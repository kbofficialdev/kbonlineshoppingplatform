import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signinSchema } from '@/lib/validations';
import { comparePassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = signinSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const { emailOrPhone, password } = parsed.data;

    // Find user by email or phone
    const user = db.users.find(
      u => u.email.toLowerCase() === emailOrPhone.toLowerCase() || u.phone === emailOrPhone
    );

    if (!user) {
      return NextResponse.json({ error: 'No account found with this email or phone number' }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json({ error: 'This account has been deactivated. Please contact support.' }, { status: 403 });
    }

    // 1. Check if Account is Currently Frozen / Locked (10-Minute Lock)
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      const remainingSeconds = Math.ceil((new Date(user.lockedUntil).getTime() - Date.now()) / 1000);
      const remainingMinutes = Math.ceil(remainingSeconds / 60);

      db.addAuditLog(
        user.email,
        user.role,
        'SIGNIN_BLOCKED_ACCOUNT_LOCKED',
        'USER',
        user.id,
        { remainingSeconds, remainingMinutes }
      );

      return NextResponse.json({
        error: `Security Alert: This account is temporarily frozen for 10 minutes due to multiple failed login attempts. Please wait ${remainingMinutes} minute(s) or reset your password.`,
        isLocked: true,
        remainingMinutes,
      }, { status: 423 });
    }

    // 2. Validate Password with Brute-Force Rate Limiting (5 Attempts Max)
    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

      if (user.failedLoginAttempts >= 5) {
        // Freeze account for exactly 10 minutes
        user.lockedUntil = new Date(Date.now() + 10 * 60 * 1000).toISOString();
        db.addAuditLog(
          user.email,
          user.role,
          'ACCOUNT_FROZEN_10_MINUTES',
          'USER',
          user.id,
          { failedAttempts: user.failedLoginAttempts, lockDuration: '10_MINUTES' }
        );

        // Dispatch security alert email to customer
        const { sendAccountLockedEmail } = await import('@/lib/email');
        await sendAccountLockedEmail(user.email, user.name, 10);

        return NextResponse.json({
          error: 'Security Alert: Account has been frozen for 10 minutes due to 5 consecutive failed login attempts. A security notice has been dispatched to your email.',
          isLocked: true,
          remainingMinutes: 10,
        }, { status: 423 });
      }

      const attemptsRemaining = 5 - user.failedLoginAttempts;
      return NextResponse.json({
        error: `Incorrect password. Warning: ${attemptsRemaining} attempt(s) remaining before a 10-minute security freeze.`,
        attemptsRemaining,
      }, { status: 401 });
    }

    // 3. Reset failed attempts on successful sign-in
    user.failedLoginAttempts = 0;
    user.lockedUntil = null;

    db.addAuditLog(
      user.email,
      user.role,
      'USER_SIGNIN',
      'USER',
      user.id,
      { method: 'PASSWORD' }
    );

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const isHttps = req.nextUrl.protocol === 'https:' || req.headers.get('x-forwarded-proto') === 'https';

    const response = NextResponse.json({
      success: true,
      message: 'Signed in successfully',
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

    // Set auth cookie (client-accessible for full synchronization across requests)
    response.cookies.set('kb_auth_token', token, {
      httpOnly: false,
      secure: isHttps,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 3600,
    });

    // Client-accessible session flag
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

