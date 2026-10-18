import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db, UserModel } from '@/lib/db';
import { signupSchema } from '@/lib/validations';
import { hashPassword, generateOtp, signToken } from '@/lib/auth';
import { sendOtpEmail, sendEmailVerificationLink } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const { name, email, phone, password } = parsed.data;
    const lowerEmail = email.toLowerCase().trim();
    const cleanPhone = phone.trim();
    const normalizedPhone = cleanPhone.startsWith('+91')
      ? cleanPhone
      : (cleanPhone.replace(/\D/g, '').length === 10 ? `+91${cleanPhone.replace(/\D/g, '')}` : cleanPhone);

    // Check if user already exists across disk and memory
    const existing = db.findUser(lowerEmail) || db.findUser(normalizedPhone);
    if (existing) {
      return NextResponse.json({ error: 'An account is already registered with this email or phone number' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const now = new Date().toISOString();
    
    // Strict 5-Minute Expiry for Activation Link and OTP
    const fiveMinutesLater = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    const otp = generateOtp();
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser: UserModel = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: lowerEmail,
      phone: normalizedPhone,
      passwordHash,
      role: 'CUSTOMER',
      isActive: true,
      emailVerified: false,
      otpCode: otp,
      otpExpiresAt: fiveMinutesLater,
      emailVerificationToken: verificationToken,
      emailVerificationExpiresAt: fiveMinutesLater,
      createdAt: now,
      updatedAt: now,
    };

    db.addUser(newUser);

    db.addAuditLog(
      newUser.email,
      'CUSTOMER',
      'USER_SIGNUP_PENDING_OTP_AND_LINK',
      'USER',
      newUser.id,
      { name, email: lowerEmail, phone }
    );

    // Determine host URL for activation link
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.nextUrl.protocol || 'http:';
    const verifyUrl = `${protocol}//${host}/api/auth/verify-email?token=${verificationToken}`;

    // Dispatch 6-digit OTP email & 5-minute activation link asynchronously in background
    // (Prevents SMTP network latency from stalling the HTTP client)
    Promise.allSettled([
      sendOtpEmail(newUser.email, newUser.name, otp),
      sendEmailVerificationLink(newUser.email, newUser.name, verifyUrl),
    ]).then((results) => {
      console.log(`[SIGNUP NOTIFICATIONS DISPATCHED] Customer: ${newUser.email}`);
    }).catch((e) => {
      console.error(`[SIGNUP NOTIFICATIONS ERROR] ${newUser.email}:`, e);
    });

    return NextResponse.json({
      success: true,
      requiresOtp: true,
      email: newUser.email,
      phone: newUser.phone,
      message: `Account created! Enter the 6-digit OTP dispatched to ${newUser.email}, or click the secure link sent to your email (strictly valid for 5 minutes).`,
      devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
