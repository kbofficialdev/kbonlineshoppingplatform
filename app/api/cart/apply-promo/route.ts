import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { applyPromoSchema } from '@/lib/validations';
import { calculateCart } from '@/lib/cart';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = applyPromoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const { code, sessionId } = parsed.data;

    if (code === 'KB10') {
      db.appliedPromos.set(sessionId, { code: 'KB10', percent: 10 });
      return NextResponse.json({
        success: true,
        message: 'Promo code KB10 applied! 10% discount subtracted.',
        cart: calculateCart(sessionId),
      });
    } else if (code === 'WELCOME50') {
      db.appliedPromos.set(sessionId, { code: 'WELCOME50', percent: 0 });
      return NextResponse.json({
        success: true,
        message: 'Promo code WELCOME50 applied! ₹50 discount subtracted.',
        cart: calculateCart(sessionId),
      });
    } else {
      return NextResponse.json({ success: false, error: "Invalid promo code. Try 'KB10'." }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
