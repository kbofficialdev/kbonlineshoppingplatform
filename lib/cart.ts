import { db } from '@/lib/db';

export function calculateCart(sessionId = 'default-guest') {
  const items = db.cartItems.filter(i => i.sessionId === sessionId);
  const subtotal = items.reduce((acc, i) => acc + (i.price * i.qty), 0);
  const appliedPromo = db.appliedPromos.get(sessionId);

  let discountAmount = 0;
  let discountPercent = 0;

  if (appliedPromo?.code === 'KB10') {
    discountPercent = 10;
    discountAmount = Math.round(subtotal * 0.10);
  } else if (appliedPromo?.code === 'WELCOME50') {
    discountAmount = Math.min(subtotal, 50);
  }

  const freeShippingThreshold = db.storeSettings?.freeShippingThreshold ?? 999;
  const flatShippingFee = db.storeSettings?.flatShippingFee ?? 70;

  const shippingFee = (subtotal >= freeShippingThreshold || subtotal === 0) ? 0 : flatShippingFee;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);

  return {
    sessionId,
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
