import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { resetPasswordSchema } from '@/lib/validations';
import { hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const { token, newPassword } = parsed.data;
    const user = db.users.find(u => u.resetToken === token);

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired password reset link' }, { status: 400 });
    }

    if (user.resetExpiresAt && new Date(user.resetExpiresAt).getTime() < Date.now()) {
      return NextResponse.json({ error: 'This password reset link has expired. Please request a new one.' }, { status: 400 });
    }

    user.passwordHash = await hashPassword(newPassword);
    user.resetToken = null;
    user.resetExpiresAt = null;
    user.updatedAt = new Date().toISOString();

    db.addAuditLog(
      user.email,
      user.role,
      'PASSWORD_RESET',
      'USER',
      user.id,
      { method: 'TOKEN_RESET' }
    );

    return NextResponse.json({
      success: true,
      message: 'Password successfully updated! You can now log in with your new password.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

