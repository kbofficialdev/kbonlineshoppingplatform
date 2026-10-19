import { NextRequest, NextResponse } from 'next/server';
import { db, OrderTimelineEventModel, OrderStatus } from '@/lib/db';
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

    // Execute stage progression inside a rollback-capable transaction
    const normalizedStage = (stage === 'IN TRANSIT' ? 'DISPATCHED' : stage) as OrderStatus;
    await db.transaction(() => {
      db.updateOrderStatus(order.orderId, normalizedStage, {
        title,
        description,
        location,
        courierPartner,
        trackingNumber,
        actor: auth.email,
      });
    });

    // Dispatch delivery stage update email to customer
    try {
      const { sendOrderStatusUpdateEmail } = await import('@/lib/email');
      const recipientEmail = order.customerEmail;
      const recipientName = order.customerName || 'Valued Customer';
      if (recipientEmail) {
        await sendOrderStatusUpdateEmail(
          recipientEmail,
          recipientName,
          order.orderId,
          stage,
          description,
          location
        );
      }
    } catch (e) {
      console.error('Delivery status email error:', e);
    }

    return NextResponse.json({
      success: true,
      message: `Order stage advanced to ${stage} and notification dispatched to customer`,
      order,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

