import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }

    const paymentMethods = db.getUserPaymentMethods(auth.userId);
    return NextResponse.json({ success: true, paymentMethods });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const { type, label, identifier, isDefault } = body;

    if (!type || !label || !identifier) {
      return NextResponse.json({ error: 'Payment type, label, and identifier are required' }, { status: 400 });
    }

    const newPm = db.addPaymentMethod(auth.userId, {
      type: type || 'UPI',
      label,
      identifier,
      isDefault: Boolean(isDefault),
    });

    return NextResponse.json({
      success: true,
      message: 'Payment method saved successfully',
      paymentMethod: newPm,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Payment method ID is required' }, { status: 400 });
    }

    const ok = db.deletePaymentMethod(id, auth.userId);
    if (!ok) {
      return NextResponse.json({ error: 'Payment method not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Payment method removed successfully',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

