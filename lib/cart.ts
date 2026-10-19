import { db } from '@/lib/db';

export function calculateCart(userId: string) {
  if (!userId) {
    return {
      userId: '',
      items: [],
      appliedPromo: null,
      discountPercent: 0,
      subtotal: 0,
      discountAmount: 0,
      shippingFee: 0,
      total: 0,
      freeShippingThreshold: 999,
      amountNeededForFreeShipping: 999,
      freeShippingUnlocked: false,
      isGstExempt: true,
      exemptionNotice: db.storeSettings?.exemptionNotice,
    };
  }
  let items = db.cartItems.filter(i => i.sessionId === userId || i.userId === userId);

  // Auto-migrate guest items to authenticated user session if user cart is empty
  if (items.length === 0 && userId && userId !== 'default-guest') {
    const guestItems = db.cartItems.filter(i => i.sessionId === 'default-guest');
    if (guestItems.length > 0) {
      guestItems.forEach(i => {
        i.sessionId = userId;
        i.userId = userId;
      });
      items = db.cartItems.filter(i => i.sessionId === userId || i.userId === userId);
    }
  }

  const subtotal = items.reduce((acc, i) => acc + (i.price * i.qty), 0);
  const appliedPromo = db.appliedPromos.get(userId) || db.appliedPromos.get('default-guest');
  let discountPercent = 0;
  let discountAmount = 0;

  if (appliedPromo?.code) {
    const coupon = db.findCouponByCode(appliedPromo.code);
    if (coupon && coupon.isActive) {
      const isExpired = coupon.expiryDate ? new Date(coupon.expiryDate).getTime() < Date.now() : false;
      const meetsMinOrder = subtotal >= (coupon.minOrderAmount || 0);

      if (!isExpired && meetsMinOrder) {
        if (coupon.discountType === 'PERCENTAGE') {
          discountPercent = coupon.discountValue;
          let calculated = Math.round(subtotal * (coupon.discountValue / 100));
          if (coupon.maxDiscountAmount && coupon.maxDiscountAmount > 0) {
            calculated = Math.min(calculated, coupon.maxDiscountAmount);
          }
          discountAmount = calculated;
        } else {
          discountAmount = Math.min(subtotal, coupon.discountValue);
          discountPercent = Math.round((discountAmount / Math.max(1, subtotal)) * 100);
        }
      }
    } else if (appliedPromo.code === 'KB10') {
      discountPercent = 10;
      discountAmount = Math.round(subtotal * 0.10);
    } else if (appliedPromo.code === 'WELCOME50') {
      discountAmount = Math.min(subtotal, 50);
    }
  }

  const freeShippingThreshold = db.storeSettings?.freeShippingThreshold ?? 999;
  const flatShippingFee = db.storeSettings?.flatShippingFee ?? 70;

  const shippingFee = (subtotal >= freeShippingThreshold || subtotal === 0) ? 0 : flatShippingFee;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);

  return {
    sessionId: userId,
    userId,
    items,
    appliedPromo: appliedPromo?.code || null,
    discountPercent,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    freeShippingThreshold,
    amountNeededForFreeShipping: amountNeeded,
    freeShippingUnlocked: subtotal >= freeShippingThreshold,
    isGstExempt: true,
    exemptionNotice: db.storeSettings?.exemptionNotice,
  };
}
