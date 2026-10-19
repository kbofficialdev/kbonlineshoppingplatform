import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const order = db.orders.find(o => o.id === id || o.orderId === id || o.invoiceNumber === id);

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  const tracking = db.getOrderTracking(order.orderId);
  const paymentAttempts = db.getOrderPaymentAttempts ? db.getOrderPaymentAttempts(order.orderId) : [];

  return NextResponse.json({
    success: true,
    order,
    tracking,
    paymentAttempts,
    store: db.storeSettings,
  });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required' }, { status: 403 });
    }

    const { id } = params;
    const orderIndex = db.orders.findIndex(o => o.id === id || o.orderId === id || o.invoiceNumber === id);

    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const body = await req.json();
    const current = db.orders[orderIndex];
    const now = new Date().toISOString();

    const previousStatus = current.orderStatus;
    const newStatus = body.orderStatus || current.orderStatus;

    // Update order fields
    current.orderStatus = newStatus;
    if (body.paymentStatus) current.paymentStatus = body.paymentStatus;
    if (body.courierPartner) current.courierPartner = body.courierPartner;
    if (body.trackingNumber) current.trackingNumber = body.trackingNumber;
    current.updatedAt = now;

    // Add timeline event if stage changed or timeline note provided
    if (body.timelineNote || previousStatus !== newStatus) {
      const eventTitle = body.timelineTitle || `Order Status Updated to ${newStatus.replace(/_/g, ' ')}`;
      const eventDesc = body.timelineNote || `Consignment stage updated by store management at Kalwaral hub.`;
      const location = body.timelineLocation || `${db.storeSettings.officialName}, Kalwaral`;

      current.timeline.push({
        id: `tl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        orderId: current.orderId,
        stage: newStatus,
        title: eventTitle,
        description: eventDesc,
        location,
        timestamp: now,
      });

      // Send status update email notification
      try {
        const { sendOrderStatusUpdateEmail } = await import('@/lib/email');
        await sendOrderStatusUpdateEmail(
          current.customerEmail,
          current.customerName,
          current.orderId,
          newStatus,
          eventDesc,
          location
        );
      } catch (e) {
        console.warn('Could not dispatch customer status email:', e);
      }
    }

    db.orders[orderIndex] = current;
    db.saveToDisk();

    db.addAuditLog(
      auth.email,
      'ADMIN',
      'ORDER_STAGE_UPDATED',
      'ORDER',
      current.orderId,
      { previousStatus, newStatus, trackingNumber: current.trackingNumber }
    );

    return NextResponse.json({
      success: true,
      message: `Order #${current.orderId} updated to ${newStatus}`,
      order: current,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
