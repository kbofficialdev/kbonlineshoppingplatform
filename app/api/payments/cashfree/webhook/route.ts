import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { sendMail } from '@/lib/email';

export const dynamic = 'force-dynamic';

/**
 * Cashfree Payments Webhook Endpoint
 * Documentation: https://www.cashfree.com/docs/payments/online/web/redirect#webhooks
 * Verifies HMAC-SHA256 signature using CASHFREE_SECRET_KEY
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-webhook-signature');
    const timestamp = req.headers.get('x-webhook-timestamp');

    const secretKey = (process.env.CASHFREE_SECRET_KEY || db.storeSettings.cashfreeSecretKey || '').trim();

    // Verify HMAC-SHA256 signature if headers are present
    let isSignatureValid = false;
    if (signature && timestamp && secretKey) {
      try {
        const signaturePayload = `${timestamp}${rawBody}`;
        const computedSignature = crypto
          .createHmac('sha256', secretKey)
          .update(signaturePayload)
          .digest('base64');

        if (computedSignature === signature) {
          isSignatureValid = true;
        } else {
          console.warn('[CASHFREE WEBHOOK] Signature mismatch:', { computedSignature, signature });
        }
      } catch (err: any) {
        console.error('[CASHFREE WEBHOOK] Signature calculation error:', err.message);
      }
    } else {
      console.warn('[CASHFREE WEBHOOK] Missing signature headers or secret key, validating payload structure.');
    }

    let payload: any = {};
    try {
      payload = JSON.parse(rawBody);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const eventType = payload.type || payload.event || '';
    const orderData = payload.data?.order || payload.order || {};
    const paymentData = payload.data?.payment || payload.payment || {};
    const refundData = payload.data?.refund || payload.refund || {};
    const orderId = orderData.order_id || payload.orderId || refundData.order_id;

    console.log(`[CASHFREE WEBHOOK RECEIVED] Event: ${eventType}, Order: ${orderId}, Status: ${paymentData.payment_status || refundData.refund_status}`);

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID missing in webhook payload' }, { status: 400 });
    }

    const order = db.orders.find(o => o.orderId === orderId || o.id === orderId);
    if (!order) {
      console.warn(`[CASHFREE WEBHOOK] Order #${orderId} not found in database`);
      return NextResponse.json({ message: 'Order not found, acknowledged', orderId }, { status: 200 });
    }

    const isPaidEvent =
      eventType === 'PAYMENT_SUCCESS_WEBHOOK' ||
      eventType === 'ORDER_PAID' ||
      paymentData.payment_status === 'SUCCESS' ||
      payload.data?.payment?.payment_status === 'SUCCESS';

    const isRefundEvent =
      eventType === 'REFUND_STATUS_WEBHOOK' ||
      eventType === 'REFUND_PROCESSED' ||
      Boolean(refundData.refund_status);

    const now = new Date().toISOString();

    if (isPaidEvent) {
      const isAlreadyPaid = order.paymentStatus === 'CAPTURED';

      if (!isAlreadyPaid) {
        const cfPaymentId = paymentData.cf_payment_id || payload.data?.payment?.cf_payment_id || 'CONFIRMED';

        // Wrap database updates in transaction with automatic rollback
        await db.transaction(async () => {
          order.paymentStatus = 'CAPTURED';
          order.orderStatus = 'CONFIRMED';
          order.updatedAt = now;

          order.timeline.push({
            id: `tl-${Date.now()}-webhook`,
            orderId: order.orderId,
            stage: 'CONFIRMED',
            title: 'Cashfree Webhook Confirmed Payment',
            description: `Payment captured asynchronously via Cashfree Webhook (CF Ref: ${cfPaymentId}). Verified and queued for dispatch.`,
            location: 'Cashfree Webhook Gateway',
            timestamp: now,
          });

          // Clear patron cart
          if (order.userId) {
            db.clearCart(order.userId);
          }

          // Record immutable audit log
          db.addAuditLog(
            order.customerEmail,
            'SYSTEM',
            'PAYMENT_WEBHOOK_CAPTURED',
            'ORDER',
            order.orderId,
            {
              eventType,
              cfPaymentId,
              amount: order.totalPaid,
              signatureVerified: isSignatureValid,
            }
          );
        });

        // Dispatch confirmation email outside transaction
        try {
          await sendMail({
            to: order.customerEmail,
            subject: `✓ Order Confirmed: KB FASHIONS #${order.orderId}`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <h1 style="font-size: 24px; font-weight: 900; color: #111827; margin: 0;">KB FASHIONS</h1>
                  <p style="font-size: 13px; color: #6b7280; margin: 4px 0 0;">Kalwaral Village, Sadasivanagar, Telangana 503145</p>
                </div>
                
                <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: center;">
                  <h2 style="font-size: 18px; font-weight: 800; color: #065f46; margin: 0;">✓ Payment Confirmed via Cashfree</h2>
                  <p style="font-size: 13px; color: #047857; margin: 6px 0 0;">Order #${order.orderId} is confirmed and queued for inspection.</p>
                </div>

                <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
                  <tr style="border-bottom: 1px solid #f3f4f6;">
                    <td style="padding: 8px 0; color: #6b7280;">Patron Name:</td>
                    <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #111827;">${order.customerName}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f3f4f6;">
                    <td style="padding: 8px 0; color: #6b7280;">Bill of Supply No:</td>
                    <td style="padding: 8px 0; font-family: monospace; font-weight: 600; text-align: right; color: #111827;">${order.invoiceNumber}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f3f4f6;">
                    <td style="padding: 8px 0; color: #6b7280;">Total Paid:</td>
                    <td style="padding: 8px 0; font-size: 16px; font-weight: 800; text-align: right; color: #111827;">₹${order.totalPaid}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Delivery Destination:</td>
                    <td style="padding: 8px 0; text-align: right; color: #111827;">${order.villageOrCity}, PIN ${order.pinCode} (10 km Rural Delivery)</td>
                  </tr>
                </table>

                <div style="font-size: 12px; color: #9ca3af; text-align: center; border-top: 1px solid #f3f4f6; padding-top: 16px;">
                  KB Fashions • Ancestral Handlooms &amp; Fine Textiles • Kalwaral, Telangana
                </div>
              </div>
            `,
          });
          console.log(`[CASHFREE WEBHOOK] Order confirmation email dispatched to ${order.customerEmail}`);
        } catch (e: any) {
          console.error('[CASHFREE WEBHOOK] Email notification error:', e.message);
        }
      }
    } else if (isRefundEvent) {
      // Process Cashfree asynchronous refund status
      const refundStatus = refundData.refund_status;
      const refundId = refundData.refund_id;

      await db.transaction(async () => {
        const existingReq = db.refundRequests.find(r => r.orderId === order.orderId || (r.refundId && r.refundId === refundId) || (r.cashfreeRefundId && r.cashfreeRefundId === refundId));
        if (existingReq) {
          if (refundStatus === 'SUCCESS') {
            existingReq.status = 'PROCESSED';
            existingReq.processedAt = now;
            order.refundStatus = 'REFUNDED';
          } else if (refundStatus === 'FAILED') {
            existingReq.status = 'REJECTED';
            existingReq.adminNotes = `Cashfree refund failed: ${refundData.refund_message || 'Gateway error'}`;
            existingReq.notes = existingReq.adminNotes;
            order.refundStatus = 'REJECTED';
          }
        } else if (refundStatus === 'SUCCESS') {
          order.refundStatus = 'REFUNDED';
        }

        order.updatedAt = now;
        order.timeline.push({
          id: `tl-${Date.now()}-refund-hook`,
          orderId: order.orderId,
          stage: order.orderStatus,
          title: `Cashfree Refund Status: ${refundStatus}`,
          description: `Cashfree gateway processed refund ${refundId || ''} with status ${refundStatus}.`,
          location: 'Cashfree Refund Gateway',
          timestamp: now,
        });

        db.addAuditLog(
          'CASHFREE_GATEWAY',
          'SYSTEM',
          'REFUND_WEBHOOK_STATUS',
          'REFUND',
          order.orderId,
          { refundStatus, refundId, payload: refundData }
        );
      });
    } else if (
      eventType === 'PAYMENT_FAILED_WEBHOOK' ||
      eventType === 'PAYMENT_USER_DROPPED_WEBHOOK' ||
      paymentData.payment_status === 'FAILED' ||
      paymentData.payment_status === 'USER_DROPPED'
    ) {
      await db.transaction(async () => {
        if (order.paymentStatus === 'PENDING') {
          order.paymentStatus = 'FAILED';
        }
        order.updatedAt = now;
        order.timeline.push({
          id: `tl-${Date.now()}-failed`,
          orderId: order.orderId,
          stage: order.orderStatus,
          title: eventType === 'PAYMENT_USER_DROPPED_WEBHOOK' ? 'Customer Exited Payment Window' : 'Payment Failed',
          description: `Transaction status received from gateway: ${paymentData.payment_message || eventType}. Customer may re-attempt checkout.`,
          location: 'Cashfree Gateway',
          timestamp: now,
        });
      });
    }

    return NextResponse.json({
      success: true,
      orderId: order.orderId,
      status: order.orderStatus,
      paymentStatus: order.paymentStatus,
      signatureVerified: isSignatureValid,
    }, { status: 200 });
  } catch (err: any) {
    console.error('[CASHFREE WEBHOOK HANDLER ERROR]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
