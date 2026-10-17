import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { createCashfreeOrder } from '@/lib/cashfree';
import { calculateCart } from '@/lib/cart';

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    if (!auth) {
      return NextResponse.json(
        { error: 'Authentication Required: Please sign in to place an order', requiresAuth: true },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { customer, sessionId } = body;

    if (!customer || !customer.email || !customer.phone || !customer.streetAddress) {
      return NextResponse.json(
        { error: 'Missing required customer delivery information' },
        { status: 400 }
      );
    }

    // Retrieve active cart items
    const effectiveSessionId = auth.userId || sessionId || 'default-guest';
    const cart = calculateCart(effectiveSessionId);

    if (!cart.items || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Your shopping bag is empty. Please add items before checking out.' },
        { status: 400 }
      );
    }

    const orderId = `ORD-CF-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const invoiceNumber = `BILL-2026-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || (req.url.startsWith('https') ? 'https' : 'http');
    const appUrl = `${protocol}://${host}`;
    const returnUrl = `${appUrl}/checkout/cashfree-return?order_id=${orderId}`;

    // Clean phone number for Cashfree
    let cleanPhone = (customer.phone || '').replace(/\D/g, '');
    if (cleanPhone.length > 10) cleanPhone = cleanPhone.slice(-10);
    if (cleanPhone.length < 10) cleanPhone = '9876543210';

    // 1. Create order on Cashfree PG
    const cfRes = await createCashfreeOrder({
      orderId,
      orderAmount: cart.total,
      orderCurrency: 'INR',
      customer: {
        customer_id: auth.userId || `cust_${Date.now()}`,
        customer_name: customer.name || auth.name || 'Valued Patron',
        customer_email: customer.email || auth.email,
        customer_phone: cleanPhone,
      },
      returnUrl,
      orderNote: `KB Fashions Kalwaral Order #${orderId}`,
    });

    if (!cfRes.success || !cfRes.payment_session_id) {
      return NextResponse.json(
        { error: cfRes.error || 'Failed to initiate Cashfree payment session' },
        { status: 502 }
      );
    }

    // 2. Record initial pending order in DB
    const orderItems = cart.items.map((item, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      orderId,
      productId: item.productId,
      title: item.name,
      qty: item.qty,
      unitPrice: item.price,
      totalAmount: item.price * item.qty,
      size: item.size,
      color: item.color,
      cutLength: item.cutLength,
      configuration: item.configuration,
      image: item.image,
    }));

    const initialTimeline = [
      {
        id: `tl-${Date.now()}-1`,
        orderId,
        stage: 'ORDER_PLACED' as const,
        title: 'Cashfree Payment Initiated',
        description: 'Customer redirected to Cashfree Payments Hosted Checkout.',
        location: 'Cashfree PG Gateway',
        timestamp: now,
      }
    ];

    const newOrder = {
      id: `order-rec-${Date.now()}`,
      orderId,
      invoiceNumber,
      userId: auth.userId,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      streetAddress: customer.streetAddress,
      villageOrCity: customer.villageOrCity,
      mandalOrArea: customer.mandalOrArea,
      district: customer.district,
      state: customer.state,
      pinCode: customer.pinCode,
      subtotal: cart.subtotal,
      discountAmount: cart.discountAmount,
      shippingFee: cart.shippingFee,
      totalPaid: cart.total,
      paymentMethod: 'CASHFREE',
      paymentStatus: 'PENDING',
      orderStatus: 'ORDER_PLACED' as const,
      courierPartner: 'KB 10km Express Runner',
      trackingNumber: `KB-LOC-${Math.floor(10000000 + Math.random() * 90000000)}`,
      estimatedDeliveryDays: 1,
      createdAt: now,
      updatedAt: now,
      items: orderItems,
      timeline: initialTimeline,
    };

    db.orders.unshift(newOrder);

    // Audit log
    db.addAuditLog(
      auth.email,
      auth.role,
      'CASHFREE_ORDER_SESSION_CREATED',
      'ORDER',
      orderId,
      { amount: cart.total, cf_order_id: cfRes.cf_order_id }
    );

    return NextResponse.json({
      success: true,
      order_id: orderId,
      payment_session_id: cfRes.payment_session_id,
      cf_order_id: cfRes.cf_order_id,
      order_amount: cart.total,
      return_url: returnUrl,
    });
  } catch (err: any) {
    console.error('Error creating Cashfree order:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

