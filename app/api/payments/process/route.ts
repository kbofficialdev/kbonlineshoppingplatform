import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, amount, method = 'UPI' } = body;

    const txnId = `TXN-KB-${Date.now()}`;
    db.addAuditLog(
      "PAYMENT_GATEWAY",
      "SYSTEM",
      "PAYMENT_CAPTURED",
      "PAYMENT",
      orderId,
      { txnId, amount, method }
    );

    return NextResponse.json({
      success: true,
      status: 'CAPTURED',
      transactionId: txnId,
      orderId,
      amount,
      method,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
