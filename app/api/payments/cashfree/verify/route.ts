import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyCashfreeOrder } from '@/lib/cashfree';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('order_id');

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required for verification' }, { status: 400 });
    }

    const order = db.orders.find(o => o.orderId === orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found in database' }, { status: 404 });
    }

    // Call Cashfree API to verify actual payment status
    const cfVerify = await verifyCashfreeOrder(orderId);

    if (cfVerify.is_paid || cfVerify.order_status === 'PAID') {
      const now = new Date().toISOString();

      if (order.paymentStatus !== 'CAPTURED') {
        order.paymentStatus = 'CAPTURED';
        order.orderStatus = 'CONFIRMED';
        order.updatedAt = now;

        order.timeline.push({
          id: `tl-${Date.now()}-confirmed`,
          orderId,
          stage: 'CONFIRMED',
          title: 'Cashfree Payment Captured Successfully',
          description: `Payment of ₹${order.totalPaid} captured via Cashfree Hosted Checkout. Handloom garments queued for inspection.`,
          location: 'Cashfree PG Gateway',
          timestamp: now,
        });

        // Clear user's shopping bag
        if (order.userId) {
          db.clearCart(order.userId);
        }

        // Audit log
        db.addAuditLog(
          order.customerEmail,
          'CUSTOMER',
          'PAYMENT_CAPTURED_CASHFREE',
          'ORDER',
          orderId,
          { totalPaid: order.totalPaid, status: 'PAID' }
        );

        // Send confirmation email
        try {
          const { sendMail } = await import('@/lib/email');
          await sendMail({
            to: order.customerEmail,
            subject: `✓ Order Confirmed: KB FASHIONS #${order.orderId}`,
            html: `
              <h2>Thank You for Your Order!</h2>
              <p>Namaste ${order.customerName},</p>
              <p>Your payment of <strong>₹${order.totalPaid}</strong> has been successfully captured via Cashfree Payments.</p>
              <p><strong>Order ID:</strong> ${order.orderId}</p>
              <p><strong>Invoice Number:</strong> ${order.invoiceNumber}</p>
              <p><strong>Delivery Address:</strong> ${order.streetAddress}, ${order.villageOrCity}, ${order.state} - ${order.pinCode}</p>
              <p>Track your local 10 km runner delivery on our store website.</p>
              <br>
              <p>KB Fashions • Kalwaral Village, Telangana</p>
            `,
          });
        } catch (e) {
          console.error('Failed to send confirmation email:', e);
        }
      }

      return NextResponse.json({
        success: true,
        is_paid: true,
        order_status: 'PAID',
        order,
      });
    }

    return NextResponse.json({
      success: false,
      is_paid: false,
      order_status: cfVerify.order_status,
      message: cfVerify.error || `Payment not completed. Status: ${cfVerify.order_status}`,
      order,
    });
  } catch (err: any) {
    console.error('Error verifying Cashfree order:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

