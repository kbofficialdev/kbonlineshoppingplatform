import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { otpRequestSchema } from '@/lib/validations';
import { generateOtp, sendEmail } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = otpRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const { emailOrPhone } = parsed.data;
    const user = db.findUser(emailOrPhone);

    if (!user) {
      return NextResponse.json({ error: 'No account registered with this email or phone number' }, { status: 404 });
    }

    if (!user.isActive) {
      return NextResponse.json({ error: 'This account has been deactivated. Please contact support.' }, { status: 403 });
    }

    // Check if account is frozen
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      const remainingMinutes = Math.ceil((new Date(user.lockedUntil).getTime() - Date.now()) / 60000);
      return NextResponse.json({
        error: `Security Alert: Account is temporarily frozen for ${remainingMinutes} minute(s). OTP delivery paused.`,
        isLocked: true,
        remainingMinutes,
      }, { status: 423 });
    }

    // Rate-limiting: Max 3 OTP requests within 10 minutes
    if (user.otpLockedUntil && new Date(user.otpLockedUntil) > new Date()) {
      const remainingMinutes = Math.ceil((new Date(user.otpLockedUntil).getTime() - Date.now()) / 60000);
      return NextResponse.json({
        error: `Too many OTP requests. Please wait ${remainingMinutes} minute(s) before requesting a new code.`,
        isLocked: true,
        remainingMinutes,
      }, { status: 429 });
    }

    user.otpRequestCount = (user.otpRequestCount || 0) + 1;
    if (user.otpRequestCount > 3) {
      user.otpLockedUntil = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      db.saveUser(user);
      return NextResponse.json({
        error: 'Maximum OTP request limit reached (3 requests). For your protection, OTP requests are paused for 10 minutes.',
        isLocked: true,
        remainingMinutes: 10,
      }, { status: 429 });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    user.otpCode = otp;
    user.otpExpiresAt = expiresAt;
    db.saveUser(user);

    // Send real email via Google SMTP (Nodemailer)
    const { sendOtpEmail } = await import('@/lib/email');
    const mailRes = await sendOtpEmail(user.email, user.name, otp);

    db.addAuditLog(
      user.email,
      user.role,
      'OTP_GENERATED_AND_DISPATCHED',
      'USER',
      user.id,
      { success: mailRes.success, messageId: mailRes.messageId }
    );

    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to ${user.email}. Please check your inbox.`,
      mailDispatched: mailRes.success,
      devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

