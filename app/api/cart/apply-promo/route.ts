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

    const upperCode = code.toUpperCase().trim();
    const coupon = db.findCouponByCode(upperCode);

    if (coupon) {
      if (!coupon.isActive) {
        return NextResponse.json({ success: false, error: `Coupon "${upperCode}" is currently inactive.` }, { status: 400 });
      }
      if (coupon.expiryDate && new Date(coupon.expiryDate).getTime() < Date.now()) {
        return NextResponse.json({ success: false, error: `Coupon "${upperCode}" has expired.` }, { status: 400 });
      }

      const currentCart = calculateCart(userId);
      if (currentCart.subtotal < coupon.minOrderAmount) {
        return NextResponse.json({
          success: false,
          error: `Minimum order amount for coupon "${upperCode}" is ₹${coupon.minOrderAmount}. (Your cart: ₹${currentCart.subtotal})`,
        }, { status: 400 });
      }

      db.appliedPromos.set(userId, {
        code: upperCode,
        percent: coupon.discountType === 'PERCENTAGE' ? coupon.discountValue : 0
      });

      // Increment coupon usage count
      coupon.usageCount = (coupon.usageCount || 0) + 1;
      db.saveToDisk();

      const updatedCart = calculateCart(userId);
      return NextResponse.json({
        success: true,
        message: `✓ Coupon "${upperCode}" applied! You saved ₹${updatedCart.discountAmount}.`,
        cart: updatedCart,
      });
    }

    if (upperCode === 'KB10') {
      db.appliedPromos.set(userId, { code: 'KB10', percent: 10 });
      return NextResponse.json({
        success: true,
        message: 'Promo code KB10 applied! 10% discount subtracted.',
        cart: calculateCart(userId),
      });
    } else if (upperCode === 'WELCOME50') {
      db.appliedPromos.set(userId, { code: 'WELCOME50', percent: 0 });
      return NextResponse.json({
        success: true,
        message: 'Promo code WELCOME50 applied! ₹50 discount subtracted.',
        cart: calculateCart(userId),
      });
    } else {
      return NextResponse.json({ success: false, error: `Invalid coupon code "${code}". Try FESTIVE30, KB10, or WELCOME100.` }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
