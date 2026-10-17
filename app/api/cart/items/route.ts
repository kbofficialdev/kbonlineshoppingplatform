import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cartAddSchema } from '@/lib/validations';
import { calculateCart } from '@/lib/cart';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = cartAddSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const { id, productId, name, price, size, color, qty, hsnCode, sessionId } = parsed.data;

    const existing = db.cartItems.find(
      i => i.sessionId === sessionId && (i.productId === productId || i.productId === `PRD-${id}`) && i.size === size
    );

    if (existing) {
      existing.qty += qty;
    } else {
      db.cartItems.push({
        id: `CI-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        sessionId,
        productId: productId || `PRD-${id}`,
        name,
        price,
        size,
        color,
        qty,
        taxRatePercent: 18,
        hsnCode: hsnCode || '61091000'
      });
    }

    return NextResponse.json(calculateCart(sessionId));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
