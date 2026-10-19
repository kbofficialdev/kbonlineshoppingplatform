import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cartAddSchema } from '@/lib/validations';
import { calculateCart } from '@/lib/cart';
import { getAuthFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ 
        error: 'Authentication Required: Please sign in or register to add garments to your shopping bag.',
        requiresAuth: true
      }, { status: 401 });
    }

    if (db.storeSettings.isCartEnabled === false) {
      return NextResponse.json({
        error: db.storeSettings.cartDisabledNotice || 'Adding items to cart is temporarily paused by store administration.',
        isCartDisabled: true,
      }, { status: 403 });
    }

    const body = await req.json();
    const parsed = cartAddSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const { productId, name, price, size, color, qty, cutLength, configuration } = parsed.data;
    const effectiveSessionId = auth.userId || parsed.data.sessionId || 'default-guest';

    const existing = db.cartItems.find(
      i => (i.sessionId === effectiveSessionId || i.sessionId === auth.userId) && 
           (i.productId === productId || i.productId === `PRD-${productId}`) && 
           i.size === size &&
           i.cutLength === (cutLength || null)
    );

    if (existing) {
      existing.qty += qty;
    } else {
      db.cartItems.push({
        id: `CI-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        sessionId: effectiveSessionId,
        productId,
        name,
        price,
        size,
        color,
        qty,
        cutLength: cutLength || null,
        configuration: configuration || null,
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json(calculateCart(effectiveSessionId));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
