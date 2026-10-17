import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const paymentMethods = db.getUserPaymentMethods(auth.userId);
  return NextResponse.json({ paymentMethods });
}

export async function POST(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.type || !body.label || !body.identifier) {
      return NextResponse.json(
        { error: 'Type, label, and identifier are required' },
        { status: 400 }
      );
    }

    const newPm = db.addPaymentMethod(auth.userId, {
      type: body.type,
      label: body.label.trim(),
      identifier: body.identifier.trim(),
      isDefault: Boolean(body.isDefault),
    });

    return NextResponse.json({
      success: true,
      message: 'Payment method saved successfully',
      paymentMethod: newPm,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Invalid payment method data' }, { status: 400 });
  }
}
