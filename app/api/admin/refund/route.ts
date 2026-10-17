import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { adminRefundSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = adminRefundSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const { orderId, amount, reason } = parsed.data;
    const refundTxnId = `RFD-KB-${Date.now()}`;

    const auditEntry = db.addAuditLog(
      "ADMIN_OFFICER_SARAH",
      "ADMIN",
      "REFUND_ISSUED",
      "PAYMENT",
      orderId,
      { refundId: refundTxnId, amount, reason }
    );

    return NextResponse.json({
      success: true,
      message: `Refund of ₹${amount || 'full amount'} successfully initiated to original payment source.`,
      refundId: refundTxnId,
      orderId,
      auditHash: auditEntry.hash
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
