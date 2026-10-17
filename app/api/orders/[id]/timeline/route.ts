import { NextRequest, NextResponse } from 'next/server';
import { db, OrderTimelineEventModel } from '@/lib/db';
import { getAuthFromRequest } from '@/lib/auth';
import { orderTimelineUpdateSchema } from '@/lib/validations';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required to update order timeline' }, { status: 403 });
    }

    const { id } = params;
    const order = db.orders.find(o => o.id === id || o.orderId === id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const body = await req.json();
    const parsed = orderTimelineUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const { stage, title, description, location, courierPartner, trackingNumber } = parsed.data;
    const now = new Date().toISOString();

    const newEvent: OrderTimelineEventModel = {
      id: `tl-${order.orderId}-${order.timeline.length + 1}`,
      orderId: order.orderId,
      stage,
      title,
      description,
      location,
      courierPartner,
      trackingNumber,
      timestamp: now,
    };

    order.timeline.push(newEvent);
    order.orderStatus = stage;
    if (courierPartner) order.courierPartner = courierPartner;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    order.updatedAt = now;

    if (stage === 'DELIVERED') {
      order.paymentStatus = 'CAPTURED';
    }

    db.addAuditLog(
      auth.email,
      'ADMIN',
      'ORDER_STAGE_UPDATED',
      'ORDER',
      order.orderId,
      { stage, title, location, trackingNumber }
    );

    return NextResponse.json({
      success: true,
      message: `Order stage advanced to ${stage}`,
      order,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

