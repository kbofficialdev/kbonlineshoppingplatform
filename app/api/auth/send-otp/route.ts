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
    const user = db.users.find(
      u => u.email.toLowerCase() === emailOrPhone.toLowerCase() || u.phone === emailOrPhone
    );

    if (!user) {
      return NextResponse.json({ error: 'No account registered with this email or phone number' }, { status: 404 });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    user.otpCode = otp;
    user.otpExpiresAt = expiresAt;

    // Send email / log OTP
    await sendEmail({
      to: user.email,
      subject: `Your KB FASHIONS Login OTP: ${otp}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #111;">
          <h2>KB FASHIONS (Kalwaral, Telangana)</h2>
          <p>Hello ${user.name},</p>
          <p>Your one-time login verification code is:</p>
          <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; padding: 12px; background: #f4f4f1; border-radius: 8px; display: inline-block;">
            ${otp}
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 16px;">This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to ${user.email}`,
      // In development mode, provide OTP in response for testing convenience
      devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
