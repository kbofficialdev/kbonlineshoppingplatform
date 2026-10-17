import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { forgotPasswordSchema } from '@/lib/validations';
import { sendEmail } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const { email } = parsed.data;
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      // Return success even if not found to prevent user enumeration attacks
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been dispatched.',
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    user.resetToken = resetToken;
    user.resetExpiresAt = resetExpiresAt;

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;

    const { sendPasswordResetEmail } = await import('@/lib/email');
    await sendPasswordResetEmail(user.email, user.name, resetUrl);

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been dispatched.',
      devResetToken: process.env.NODE_ENV !== 'production' ? resetToken : undefined,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

