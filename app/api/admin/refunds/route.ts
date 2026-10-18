import { NextRequest, NextResponse } from 'next/server';
import { db, RefundRequestModel } from '@/lib/db';
import { getAuthFromRequest } from '@/lib/auth';
import { refundRequestSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      count: db.refundRequests.length,
      refunds: db.refundRequests,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    const body = await req.json();
    const parsed = refundRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const { orderId, reason, amount } = parsed.data;
    const order = db.orders.find(o => o.orderId === orderId || o.id === orderId);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const refund: RefundRequestModel = {
      id: `ref-${Date.now()}`,
      orderId: order.orderId,
      reason,
      amount,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    db.refundRequests.unshift(refund);

    db.addAuditLog(
      auth?.email || order.customerEmail,
      auth?.role || 'CUSTOMER',
      'REFUND_REQUESTED',
      'ORDER',
      order.orderId,
      { amount, reason }
    );

    return NextResponse.json({
      success: true,
      message: 'Refund request submitted for merchant review',
      refund,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { refundId, status, notes } = body;

    const refund = db.refundRequests.find(r => r.id === refundId);
    if (!refund) {
      return NextResponse.json({ error: 'Refund request not found' }, { status: 404 });
    }

    const order = db.orders.find(o => o.orderId === refund.orderId);
    if (!order) {
      return NextResponse.json({ error: 'Associated order not found' }, { status: 404 });
    }

    let cfRefundResult: any = null;

    // If approving or completing refund, and order was paid via Cashfree, process gateway refund
    if ((status === 'APPROVED' || status === 'COMPLETED') && (order.paymentMethod === 'CASHFREE' || order.paymentStatus === 'CAPTURED')) {
      const { createCashfreeRefund } = await import('@/lib/cashfree');
      const uniqueRefundId = `ref_${order.orderId.replace(/[^a-zA-Z0-9]/g, '')}_${Date.now()}`;
      cfRefundResult = await createCashfreeRefund(
        order.orderId,
        refund.amount,
        uniqueRefundId,
        notes || refund.reason || 'Approved refund by KB Fashions Admin'
      );

      if (!cfRefundResult.success) {
        console.warn('[ADMIN REFUNDS] Cashfree gateway returned error, proceeding with manual merchant credit log:', cfRefundResult.error);
      }
    }

    // Execute state update inside atomic rollback-capable transaction
    await db.transaction(() => {
      const now = new Date().toISOString();
      refund.status = status;
      refund.notes = notes || refund.notes || null;
      refund.processedAt = now;
      refund.processedBy = auth.email;
      if (cfRefundResult?.cf_refund_id) {
        refund.cashfreeRefundId = String(cfRefundResult.cf_refund_id);
      }

      if (status === 'APPROVED' || status === 'COMPLETED') {
        order.paymentStatus = 'REFUNDED';
        if (order.orderStatus === 'ORDER_PLACED' || order.orderStatus === 'CONFIRMED') {
          order.orderStatus = 'CANCELLED';
        }

        order.timeline.push({
          id: `tl-${order.orderId}-refund-${Date.now()}`,
          orderId: order.orderId,
          stage: order.orderStatus,
          title: `Refund ${status === 'COMPLETED' ? 'Settled' : 'Approved'}: ₹${refund.amount}`,
          description: `Refund of ₹${refund.amount} approved by KB FASHIONS admin. Method: ${order.paymentMethod}. CF Ref: ${refund.cashfreeRefundId || 'Direct Bank Settlement'}. ${notes || ''}`.trim(),
          location: 'KB FASHIONS Kalwaral Store',
          timestamp: now,
        });
      } else if (status === 'REJECTED') {
        order.timeline.push({
          id: `tl-${order.orderId}-refund-rej-${Date.now()}`,
          orderId: order.orderId,
          stage: order.orderStatus,
          title: 'Refund Request Rejected',
          description: `Refund request for ₹${refund.amount} was rejected. Note: ${notes || 'Does not meet 7-day assurance guidelines (e.g. customized meter cuts).'}`.trim(),
          location: 'KB FASHIONS Kalwaral Store',
          timestamp: now,
        });
      }

      db.addAuditLog(
        auth.email,
        'ADMIN',
        `REFUND_${status}`,
        'REFUND',
        refund.id,
        {
          orderId: order.orderId,
          amount: refund.amount,
          status,
          notes,
          cfRefundId: refund.cashfreeRefundId,
        }
      );
    });

    // Dispatch refund status notification email
    try {
      const { sendMail } = await import('@/lib/email');
      await sendMail({
        to: order.customerEmail,
        subject: `[KB FASHIONS] Refund Request ${status}: Order #${order.orderId}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h2 style="color: #111827; margin-bottom: 8px;">Refund Request ${status}</h2>
            <p>Namaste ${order.customerName},</p>
            <p>Your return / refund request for Order <strong>#${order.orderId}</strong> has been updated to: <strong>${status}</strong>.</p>
            <p><strong>Amount:</strong> ₹${refund.amount}</p>
            ${refund.cashfreeRefundId ? `<p><strong>Gateway Refund Reference:</strong> ${refund.cashfreeRefundId}</p>` : ''}
            ${notes ? `<p><strong>Merchant Notes:</strong> ${notes}</p>` : ''}
            <p style="color: #6b7280; font-size: 13px; margin-top: 20px;">
              For approved refunds, amounts are settled directly back to your original source account (Cashfree / UPI / Bank) within 5 to 7 statutory business days.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="font-size: 12px; color: #9ca3af;">KB Fashions • Kalwaral, Telangana • 503145</p>
          </div>
        `,
      });
    } catch (mailErr) {
      console.error('[ADMIN REFUNDS] Customer email dispatch error:', mailErr);
    }

    return NextResponse.json({
      success: true,
      message: `Refund ${status.toLowerCase()} successfully`,
      refund,
      order,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

