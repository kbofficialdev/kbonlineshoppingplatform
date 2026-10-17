import { NextRequest, NextResponse } from 'next/server';
import { generateOtp } from '@/lib/auth';
import { sendOrderConfirmationOtp } from '@/lib/email';
import { getAuthFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const { email, name, amount } = body;

    const targetEmail = (email || auth.email || '').trim().toLowerCase();
    const targetName = name || auth.name || 'Valued Patron';

    if (!targetEmail) {
      return NextResponse.json({ error: 'Valid customer email is required' }, { status: 400 });
    }

    const otp = generateOtp();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes strict expiry

    db.orderOtps.set(targetEmail, { otp, expiresAt });

    // Dispatch real email via Google SMTP
    const mailResult = await sendOrderConfirmationOtp(targetEmail, targetName, otp, amount || 0);

    db.addAuditLog(
      auth.email,
      auth.role,
      'ORDER_CONFIRMATION_OTP_DISPATCHED',
      'CHECKOUT',
      targetEmail,
      { amount, mailSent: mailResult.success }
    );

    return NextResponse.json({
      success: true,
      message: `A 6-digit order verification code has been dispatched to ${targetEmail}`,
      mailSent: mailResult.success,
      devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
