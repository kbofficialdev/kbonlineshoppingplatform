import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { applyPromoSchema } from '@/lib/validations';
import { calculateCart } from '@/lib/cart';
import { getAuthFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth?.userId) {
      return NextResponse.json(
        { error: 'Authentication Required: You must be signed in to apply promo discounts.', requiresAuth: true },
        { status: 401 }
      );
    }
    const body = await req.json();
    const parsed = applyPromoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const { code } = parsed.data;
    const userId = auth.userId;

    if (code === 'KB10') {
      db.appliedPromos.set(userId, { code: 'KB10', percent: 10 });
      return NextResponse.json({
        success: true,
        message: 'Promo code KB10 applied! 10% discount subtracted.',
        cart: calculateCart(userId),
      });
    } else if (code === 'WELCOME50') {
      db.appliedPromos.set(userId, { code: 'WELCOME50', percent: 0 });
      return NextResponse.json({
        success: true,
        message: 'Promo code WELCOME50 applied! ₹50 discount subtracted.',
        cart: calculateCart(userId),
      });
    } else {
      return NextResponse.json({ success: false, error: "Invalid promo code. Try 'KB10'." }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
