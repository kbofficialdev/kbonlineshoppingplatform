import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cartUpdateQtySchema } from '@/lib/validations';
import { calculateCart } from '@/lib/cart';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const parsed = cartUpdateQtySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const { delta, size, sessionId } = parsed.data;
    const itemId = params.id;

    const index = db.cartItems.findIndex(
      i => i.sessionId === sessionId && (i.id === itemId || i.productId === itemId) && (!size || i.size === size)
    );

    if (index === -1) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    db.cartItems[index].qty += delta;
    if (db.cartItems[index].qty <= 0) {
      db.cartItems.splice(index, 1);
    }

    return NextResponse.json(calculateCart(sessionId));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const sessionId = req.nextUrl.searchParams.get('session_id') || 'default-guest';
  const size = req.nextUrl.searchParams.get('size');
  const itemId = params.id;

  db.cartItems = db.cartItems.filter(
    i => !(i.sessionId === sessionId && (i.id === itemId || i.productId === itemId) && (!size || i.size === size))
  );

  return NextResponse.json(calculateCart(sessionId));
}
