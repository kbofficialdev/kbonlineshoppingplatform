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
        // Wrap mutations in db.transaction for ACID rollback safety
        await db.transaction(async () => {
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
        });

        // Send confirmation email asynchronously (outside rollback-sensitive block)
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

    // Handle customer drop-off, active pending session, or failed transaction
    if (cfVerify.order_status === 'EXPIRED' || cfVerify.order_status === 'FAILED') {
      if (order.paymentStatus === 'PENDING') {
        await db.transaction(() => {
          order.paymentStatus = 'FAILED';
          order.updatedAt = new Date().toISOString();
          order.timeline.push({
            id: `tl-${Date.now()}-failed`,
            orderId,
            stage: 'ORDER_PLACED',
            title: `Cashfree Transaction ${cfVerify.order_status}`,
            description: `Transaction concluded with status: ${cfVerify.order_status}. The customer may retry or switch to Cash on Delivery.`,
            location: 'Cashfree PG Gateway',
            timestamp: new Date().toISOString(),
          });
        });
      }
    }

    const friendlyMessage =
      cfVerify.order_status === 'ACTIVE'
        ? 'Your payment session is still active or was closed before completion. No amount has been deducted. You can retry now or switch payment method.'
        : cfVerify.order_status === 'EXPIRED'
        ? 'Your payment session expired. Please restart checkout to generate a fresh payment session.'
        : cfVerify.order_status === 'FAILED'
        ? 'Payment attempt was declined or failed at the bank/gateway. Please try again with another method or UPI.'
        : (cfVerify.error || `Payment status: ${cfVerify.order_status}`);

    return NextResponse.json({
      success: false,
      is_paid: false,
      order_status: cfVerify.order_status,
      message: friendlyMessage,
      order,
    });
  } catch (err: any) {
    console.error('Error verifying Cashfree order:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
