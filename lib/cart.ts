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

  const shippingFee = (subtotal >= 999 || subtotal === 0) ? 0 : 99;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);
  const amountNeeded = Math.max(0, 999 - subtotal);

  // 18% GST statutory calculation
  const taxableBase = Math.round((subtotal / 1.18) * 100) / 100;
  const totalTax = Math.round((subtotal - taxableBase) * 100) / 100;
  const cgst = Math.round((totalTax / 2) * 100) / 100;
  const sgst = Math.round((totalTax / 2) * 100) / 100;

  return {
    sessionId,
    items,
    appliedPromo: appliedPromo?.code || null,
    discountPercent,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    taxableBase,
    cgst,
    sgst,
    freeShippingThreshold: 999,
    amountNeededForFreeShipping: amountNeeded,
    freeShippingUnlocked: subtotal >= 999
  };
}
