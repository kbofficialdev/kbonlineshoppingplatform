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

    refund.status = status;
    refund.notes = notes || null;
    refund.processedAt = new Date().toISOString();

    const order = db.orders.find(o => o.orderId === refund.orderId);
    if (order && status === 'APPROVED') {
      order.paymentStatus = 'REFUNDED';
      order.orderStatus = 'CANCELLED';
      order.timeline.push({
        id: `tl-${order.orderId}-refund`,
        orderId: order.orderId,
        stage: 'CANCELLED',
        title: 'Order Cancelled & Refund Approved',
        description: `Refund of ₹${refund.amount} approved by KB FASHIONS admin. Processed back to original payment method.`,
        location: 'KB FASHIONS Kalwaral Store',
        timestamp: new Date().toISOString(),
      });
    }

    db.addAuditLog(
      auth.email,
      'ADMIN',
      `REFUND_${status}`,
      'REFUND',
      refund.id,
      { status, notes }
    );

    return NextResponse.json({
      success: true,
      message: `Refund ${status.toLowerCase()} successfully`,
      refund,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

