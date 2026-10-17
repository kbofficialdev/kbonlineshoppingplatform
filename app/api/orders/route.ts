import { NextRequest, NextResponse } from 'next/server';
import { db, OrderModel, OrderTimelineEventModel } from '@/lib/db';
import { checkoutSchema } from '@/lib/validations';
import { calculateCart } from '@/lib/cart';
import { getAuthFromRequest } from '@/lib/auth';

let orderCounter = 1002;
let billCounter = 842;

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const { customer, paymentMethod, sessionId } = parsed.data;
    const cart = calculateCart(sessionId);

    if (!cart.items || cart.items.length === 0) {
      return NextResponse.json({ error: 'Cannot checkout with an empty bag' }, { status: 400 });
    }

    orderCounter += 1;
    billCounter += 1;
    const orderId = `ORD-2026-${orderCounter}`;
    const invoiceNumber = `BILL-2026-00${billCounter}`;
    const now = new Date().toISOString();

    const orderItems = cart.items.map(item => {
      const p = db.products.find(prod => prod.productId === item.productId || prod.id === item.productId);
      return {
        id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        orderId,
        productId: item.productId,
        title: item.name,
        qty: item.qty,
        unitPrice: item.price,
        totalAmount: item.price * item.qty,
        size: item.size,
        image: p?.images?.[0]?.data,
      };
    });

    // Reduce stock quantities in database
    cart.items.forEach(item => {
      const prod = db.products.find(p => p.productId === item.productId || p.id === item.productId);
      if (prod) {
        prod.stockQuantity = Math.max(0, prod.stockQuantity - item.qty);
      }
    });

    const initialTimeline: OrderTimelineEventModel[] = [
      {
        id: `tl-${orderId}-1`,
        orderId,
        stage: 'ORDER_PLACED',
        title: 'Order Placed Successfully',
        description: `Order received and recorded under Bill #${invoiceNumber}. Payment method: ${paymentMethod}.`,
        location: `${db.storeSettings.officialName}, Kalwaral, Telangana`,
        timestamp: now,
      }
    ];

    const newOrder: OrderModel = {
      id: orderId,
      orderId,
      invoiceNumber,
      userId: auth?.userId || null,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      streetAddress: customer.streetAddress,
      villageOrCity: customer.villageOrCity,
      mandalOrArea: customer.mandalOrArea || null,
      district: customer.district,
      state: customer.state,
      pinCode: customer.pinCode,
      subtotal: cart.subtotal,
      discountAmount: cart.discountAmount,
      shippingFee: cart.shippingFee,
      totalPaid: cart.total,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'AUTHORIZED' : 'CAPTURED',
      orderStatus: 'ORDER_PLACED',
      courierPartner: 'India Post Speed Post',
      trackingNumber: `KB${Math.floor(10000000 + Math.random() * 90000000)}IN`,
      estimatedDeliveryDays: 3,
      createdAt: now,
      updatedAt: now,
      items: orderItems,
      timeline: initialTimeline,
    };

    db.orders.unshift(newOrder);

    // Record in immutable SHA-256 audit ledger
    db.addAuditLog(
      auth?.email || customer.email,
      auth?.role || 'CUSTOMER',
      'ORDER_CREATED',
      'ORDER',
      orderId,
      { invoiceNumber, totalPaid: newOrder.totalPaid, paymentMethod, itemsCount: orderItems.length }
    );

    // Clear cart for this session
    db.cartItems = db.cartItems.filter(i => i.sessionId !== sessionId);
    db.appliedPromos.delete(sessionId);

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      order: newOrder,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let list = [...db.orders];

    if (auth?.role !== 'ADMIN') {
      // If customer, only show their orders (or match by email query if guest)
      const email = searchParams.get('email');
      if (auth?.userId) {
        list = list.filter(o => o.userId === auth.userId || (auth.email && o.customerEmail === auth.email));
      } else if (email) {
        list = list.filter(o => o.customerEmail.toLowerCase() === email.toLowerCase());
      }
    }

    if (status && status !== 'ALL') {
      list = list.filter(o => o.orderStatus === status);
    }

    return NextResponse.json({
      success: true,
      count: list.length,
      orders: list,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
