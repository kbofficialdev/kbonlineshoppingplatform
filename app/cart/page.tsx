"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  size: string;
  color: string;
  qty: number;
  cutLength?: number | null;
  configuration?: Record<string, any> | null;
}

export default function CartPage() {
  const [cart, setCart] = useState<any>({
    items: [],
    subtotal: 0,
    discountAmount: 0,
    shippingFee: 70,
    total: 0,
    freeShippingThreshold: 999,
    amountNeededForFreeShipping: 999,
    freeShippingUnlocked: false,
    appliedPromo: null,
  });
  const [promoCode, setPromoCode] = useState<string>('');
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/cart');
      const data = await res.json();
      setCart(data);
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQty = async (productId: string, size: string, delta: number) => {
    try {
      const res = await fetch(`/api/cart/items/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ size, delta })
      });
      const data = await res.json();
      setCart(data);
    } catch (e) {}
  };

  const handleRemove = async (productId: string, size: string) => {
    try {
      const res = await fetch(`/api/cart/items/${productId}?size=${encodeURIComponent(size)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      setCart(data);
    } catch (e) {}
  };

  const handleClearCart = async () => {
    try {
      const res = await fetch('/api/cart/clear', { method: 'DELETE' });
      const data = await res.json();
      setCart(data);
    } catch (e) {}
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoError(null);
    setPromoMessage(null);
    try {
      const res = await fetch('/api/cart/apply-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode.trim().toUpperCase() })
      });
      const data = await res.json();
      if (data.success) {
        setCart(data.cart);
        setPromoMessage(data.message);
      } else {
        setPromoError(data.error || 'Invalid promo code');
      }
    } catch (e) {
      setPromoError('Failed to apply promo code');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-neutral-400">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs">Loading shopping bag...</p>
      </div>
    );
  }

  const items: CartItem[] = cart.items || [];
  const percentComplete = Math.min(100, Math.round((cart.subtotal / (cart.freeShippingThreshold || 999)) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Title */}
      <div className="flex justify-between items-baseline border-b border-kbBorder pb-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-kbBlack">Shopping Bag</h1>
          <p className="text-xs text-neutral-500 mt-1">Review your handcrafted village garments before checkout</p>
        </div>
        <Link href="/search?category=All" className="text-xs font-semibold text-neutral-600 hover:text-black underline">
          ← Continue Shopping
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="bg-kbSurfaceAlt border border-kbBorder rounded-kb-lg p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="text-4xl">🛍️</div>
          <h2 className="text-lg font-bold">Your shopping bag is empty</h2>
          <p className="text-xs text-neutral-500">
            Looks like you haven't added any garments from our Kalwaral collection yet.
          </p>
          <Link
            href="/search?category=All"
            className="inline-block bg-black text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-neutral-800 transition-all"
          >
            Explore Authentic Clothes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Left 2 Cols: Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Free Shipping Progress Tier */}
            <div className="bg-white border border-kbBorder p-4 rounded-kb-md shadow-sm">
              <div className="flex justify-between text-xs font-bold mb-2">
                <span>
                  {cart.freeShippingUnlocked ? (
                    <span className="text-emerald-700 font-extrabold">🎉 You unlocked Free Express Delivery!</span>
                  ) : (
                    <span>Add ₹{cart.amountNeededForFreeShipping} more to unlock <strong>FREE Express Shipping</strong></span>
                  )}
                </span>
                <span className="text-neutral-500 font-mono text-[11px]">{percentComplete}%</span>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentComplete}%` }}
                ></div>
              </div>
            </div>

            {/* Items List */}
            <div className="divide-y divide-kbBorder border-t border-b border-kbBorder">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="py-4 flex gap-4 items-center justify-between">
                  <div className="flex gap-4 items-center">
                    <div className="w-16 h-20 bg-kbCardBg rounded-kb-sm border border-kbBorder flex items-center justify-center font-bold text-xs text-neutral-400">
                      KB
                    </div>
                    <div>
                      <Link href={`/products/${item.productId}`} className="font-bold text-sm text-neutral-900 hover:underline">
                        {item.name}
                      </Link>
                      <div className="text-xs text-neutral-500 mt-0.5 space-y-0.5">
                        <div>
                          {item.cutLength ? (
                            <span className="font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                              ✂ Unstitched Cut: {item.cutLength}m
                            </span>
                          ) : (
                            <span>Size: <strong className="text-black">{item.size}</strong></span>
                          )}
                          {item.configuration?.chestSize && (
                            <span className="ml-2 font-semibold text-sky-900">
                              • Chest: {item.configuration.chestSize}
                            </span>
                          )}
                        </div>
                        {item.configuration?.fallPico && (
                          <div className="text-[11px] text-emerald-700 font-semibold">
                            ✓ Fall &amp; Pico Service Included (+₹80)
                          </div>
                        )}
                        {item.configuration?.matchingBlouse && (
                          <div className="text-[11px] text-rose-700 font-semibold">
                            ✓ Matching 2x2 Rubia Blouse Piece (+₹180)
                          </div>
                        )}
                      </div>
                      <div className="text-xs font-extrabold text-black mt-1">
                        ₹{item.price} each
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Remove */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center border border-kbBorder rounded-kb-pill px-2 py-0.5 bg-kbLight">
                      <button
                        onClick={() => handleUpdateQty(item.productId, item.size, -1)}
                        className="w-6 h-6 flex items-center justify-center font-bold text-xs hover:bg-neutral-200 rounded-full"
                      >
                        -
                      </button>
                      <span className="w-7 text-center text-xs font-bold">{item.qty}</span>
                      <button
                        onClick={() => handleUpdateQty(item.productId, item.size, 1)}
                        className="w-6 h-6 flex items-center justify-center font-bold text-xs hover:bg-neutral-200 rounded-full"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <div className="font-bold text-sm text-black">
                        ₹{item.price * item.qty}
                      </div>
                      <button
                        onClick={() => handleRemove(item.productId, item.size)}
                        className="text-[10px] text-neutral-400 hover:text-red-600 underline mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-xs">
              <button
                onClick={handleClearCart}
                className="text-neutral-400 hover:text-red-600 underline"
              >
                Clear entire bag
              </button>
              <span className="text-neutral-500">
                {items.length} unique item{items.length > 1 ? 's' : ''} in bag
              </span>
            </div>
          </div>

          {/* Right Col: Promo & Order Summary */}
          <div className="bg-kbSurfaceAlt border border-kbBorder p-6 rounded-kb-lg space-y-6">
            <h2 className="font-black text-base text-kbBlack uppercase tracking-wider text-xs">Order Summary</h2>

            {/* Promo Code Input */}
            <div>
              <span className="text-xs font-bold text-neutral-700 block mb-1.5">Apply Village Offer / Promo:</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="e.g. KB10"
                  className="flex-1 uppercase font-mono text-xs px-3 py-2.5 rounded-kb-pill border border-kbBorder bg-white focus:outline-none focus:ring-1 focus:ring-black"
                />
                <button
                  onClick={handleApplyPromo}
                  className="bg-black text-white text-xs font-bold px-4 py-2.5 rounded-kb-pill hover:bg-neutral-800"
                >
                  Apply
                </button>
              </div>
              {promoMessage && <p className="text-[11px] text-emerald-700 font-semibold mt-1.5">{promoMessage}</p>}
              {promoError && <p className="text-[11px] text-red-600 mt-1.5">{promoError}</p>}
              <p className="text-[10px] text-neutral-400 mt-1.5">Tip: Try promo code <strong>KB10</strong> for 10% off</p>
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-kbBorder pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items):</span>
                <span>₹{cart.subtotal}</span>
              </div>
              {cart.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Village Discount ({cart.appliedPromo}):</span>
                  <span>-₹{cart.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Express Courier Shipping:</span>
                <span>{cart.shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${cart.shippingFee}`}</span>
              </div>
              <div className="border-t border-kbBorder pt-3 flex justify-between font-black text-base text-black">
                <span>Total Amount:</span>
                <span>₹{cart.total}</span>
              </div>
              <p className="text-[10px] text-neutral-500">
                ✓ Final retail price • <strong>GST Exempted</strong> small business (Section 23 CGST Act).
              </p>
            </div>

            {/* Checkout Action Button */}
            <Link
              href="/checkout"
              id="proceed-checkout-btn"
              className="block w-full bg-kb-blue text-white hover:bg-blue-600 text-center font-semibold text-sm py-4 rounded-kb-pill transition-all shadow-sm"
            >
              Proceed to Delivery & Payment →
            </Link>

            <div className="text-[11px] text-neutral-400 text-center flex items-center justify-center gap-1">
              <span>🔒</span>
              <span>Secure Cash on Delivery (COD) & Instant UPI available</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

