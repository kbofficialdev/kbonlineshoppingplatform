import { NextRequest, NextResponse } from 'next/server';
import { db, OrderModel } from '@/lib/db';
import { checkoutOrderSchema } from '@/lib/validations';
import { calculateCart } from '@/lib/cart';

let orderCounter = 1000;
let invoiceCounter = 840;

const pinDatabase: Record<string, { city: string; state: string; slaDays: number }> = {
  "560038": { city: "Bengaluru", state: "Karnataka", slaDays: 2 },
  "560001": { city: "Bengaluru", state: "Karnataka", slaDays: 2 },
  "110001": { city: "New Delhi", state: "Delhi", slaDays: 3 },
  "400001": { city: "Mumbai", state: "Maharashtra", slaDays: 3 },
  "600001": { city: "Chennai", state: "Tamil Nadu", slaDays: 3 },
  "700001": { city: "Kolkata", state: "West Bengal", slaDays: 4 },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = checkoutOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const { customer, paymentMethod, sessionId } = parsed.data;
    const cart = calculateCart(sessionId);

    if (!cart.items || cart.items.length === 0) {
      return NextResponse.json({ error: 'Cannot checkout with an empty cart' }, { status: 400 });
    }

    orderCounter += 1;
    invoiceCounter += 1;
    const orderId = `ORD-2026-${orderCounter}`;
    const invoiceNumber = `INV-2026-00${invoiceCounter}`;

    const isIntraState = !customer.state || customer.state.toLowerCase() === 'karnataka';
    const subtotal = cart.subtotal;
    const discount = cart.discountAmount;
    const shipping = cart.shippingFee;
    const total = cart.total;

    const taxableBase = Math.round((subtotal / 1.18) * 100) / 100;
    const totalTax = Math.round((subtotal - taxableBase) * 100) / 100;
    const cgst = isIntraState ? Math.round((totalTax / 2) * 100) / 100 : 0;
    const sgst = isIntraState ? Math.round((totalTax / 2) * 100) / 100 : 0;
    const igst = !isIntraState ? totalTax : 0;

    const orderItems = cart.items.map(item => {
      const itemTotal = item.price * item.qty;
      const itemBase = Math.round((itemTotal / 1.18) * 100) / 100;
      const itemTax = Math.round((itemTotal - itemBase) * 100) / 100;
      return {
        productId: item.productId,
        hsnCode: item.hsnCode,
        title: item.name,
        qty: item.qty,
        unitPrice: item.price,
        taxAmount: itemTax,
        totalAmount: itemTotal,
        size: item.size
      };
    });

    const order: OrderModel = {
      id: orderId,
      orderId,
      invoiceNumber,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email || 'customer@example.com',
      streetAddress: customer.streetAddress,
      pinCode: customer.pinCode,
      city: customer.city,
      state: customer.state,
      b2bGstin: customer.b2bGstin || undefined,
      subtotal,
      discountAmount: discount,
      shippingFee: shipping,
      taxableBase,
      cgst,
      sgst,
      igst,
      totalPaid: total,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'AUTHORIZED' : 'CAPTURED',
      orderStatus: 'CONFIRMED',
      estimatedDeliveryDays: pinDatabase[customer.pinCode]?.slaDays || 3,
      createdAt: new Date().toISOString(),
      items: orderItems
    };

    db.orders.push(order);

    // Record in immutable audit ledger
    db.addAuditLog(
      "CUSTOMER",
      "CUSTOMER",
      "ORDER_PLACED",
      "ORDER",
      orderId,
      { invoiceNumber, totalPaid: total, paymentMethod }
    );

    // Clear cart for this session
    db.cartItems = db.cartItems.filter(i => i.sessionId !== sessionId);
    db.appliedPromos.delete(sessionId);

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ orders: db.orders });
}
