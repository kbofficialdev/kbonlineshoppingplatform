import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin?error=Invalid+verification+token', req.url));
    }

    const user = db.findUserByVerificationToken(token);

    if (!user) {
      return NextResponse.redirect(new URL('/auth/signin?error=Verification+token+not+found+or+already+used', req.url));
    }

    // Check strict 5-minute expiry
    if (user.emailVerificationExpiresAt && new Date(user.emailVerificationExpiresAt).getTime() < Date.now()) {
      user.emailVerificationToken = null;
      user.emailVerificationExpiresAt = null;
      db.saveUser(user);
      return NextResponse.redirect(
        new URL('/auth/signin?error=Security+Notice:+Activation+link+expired.+Links+are+strictly+valid+for+5+minutes+only.+Please+sign+in+with+password+and+OTP.', req.url)
      );
    }

    // Activate and verify user
    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpiresAt = null;
    user.isActive = true;
    db.saveUser(user);

    db.addAuditLog(
      user.email,
      user.role,
      'EMAIL_VERIFIED_VIA_5MIN_LINK',
      'USER',
      user.id,
      { method: '5_MIN_SECURE_LINK' }
    );

    const authToken = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const isHttps = req.nextUrl.protocol === 'https:' || req.headers.get('x-forwarded-proto') === 'https';

    const response = NextResponse.redirect(new URL('/account?verified=true', req.url));

    response.cookies.set('kb_auth_token', authToken, {
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
    return NextResponse.redirect(new URL(`/auth/signin?error=${encodeURIComponent(err.message)}`, req.url));
  }
}

