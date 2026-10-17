import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { otpVerifySchema } from '@/lib/validations';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = otpVerifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const { emailOrPhone, otp } = parsed.data;
    const user = db.users.find(
      u => u.email.toLowerCase() === emailOrPhone.toLowerCase() || u.phone === emailOrPhone
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if account is frozen
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      const remainingMinutes = Math.ceil((new Date(user.lockedUntil).getTime() - Date.now()) / 60000);
      return NextResponse.json({
        error: `Security Alert: Account is temporarily frozen for ${remainingMinutes} minute(s).`,
        isLocked: true,
        remainingMinutes,
      }, { status: 423 });
    }

    if (!user.otpCode || user.otpCode !== otp) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= 3) {
        user.lockedUntil = new Date(Date.now() + 10 * 60 * 1000).toISOString();
        user.otpCode = null;
        user.otpExpiresAt = null;

        const { sendAccountLockedEmail } = await import('@/lib/email');
        await sendAccountLockedEmail(user.email, user.name, 10);

        return NextResponse.json({
          error: 'Security Alert: Account frozen for 10 minutes due to multiple invalid OTP attempts.',
          isLocked: true,
          remainingMinutes: 10,
        }, { status: 423 });
      }

      return NextResponse.json({
        error: `Invalid OTP code. Warning: Attempt ${user.failedLoginAttempts} of 3.`,
        attemptsRemaining: 3 - user.failedLoginAttempts,
      }, { status: 400 });
    }

    if (user.otpExpiresAt && new Date(user.otpExpiresAt).getTime() < Date.now()) {
      return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 });
    }

    // Clear used OTP and reset failed attempts
    user.otpCode = null;
    user.otpExpiresAt = null;
    user.failedLoginAttempts = 0;
    user.otpRequestCount = 0;
    user.lockedUntil = null;

    db.addAuditLog(
      user.email,
      user.role,
      'USER_SIGNIN_OTP',
      'USER',
      user.id,
      { method: 'OTP' }
    );

    // Auto-migrate any guest cart items to this authenticated user
    db.cartItems.forEach(i => {
      if (i.sessionId === 'default-guest') {
        i.sessionId = user.id;
        i.userId = user.id;
      }
    });
    if (db.appliedPromos.has('default-guest')) {
      const promo = db.appliedPromos.get('default-guest');
      if (promo) db.appliedPromos.set(user.id, promo);
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const isHttps = req.nextUrl.protocol === 'https:' || req.headers.get('x-forwarded-proto') === 'https';

    const response = NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar || null,
      },
      token,
    });

    response.cookies.set('kb_auth_token', token, {
      httpOnly: false,
      secure: isHttps,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 3600,
    });

    response.cookies.set('kb_session_active', '1', {
      httpOnly: false,
      secure: isHttps,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 3600,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

