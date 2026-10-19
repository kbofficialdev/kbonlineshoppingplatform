"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ToastContext';
import { authFetch } from '@/lib/clientAuth';
import CircularContentLoader from '@/components/CircularContentLoader';
import { OrderSummarySkeleton } from '@/components/SkeletonPlaceholder';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  size: string;
  color: string;
  qty: number;
  imageUrl?: string;
}

export default function CartPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isCheckoutEnabled, setIsCheckoutEnabled] = useState<boolean>(true);
  const [checkoutNotice, setCheckoutNotice] = useState<string>('');

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const res = await authFetch('/api/cart');
      if (res.status === 401) {
        router.push('/auth/signin?redirect=%2Fcart&reason=auth_required');
        return;
      }
      const data = await res.json();
      if (data?.items) {
        setItems(data.items);
        setSubtotal(data.subtotal || 0);
        setDiscount(data.discountAmount || 0);
        setShippingFee(data.shippingFee || 0);
        setTotal(data.total || 0);
      }

      try {
        const sRes = await fetch('/api/store/settings');
        if (sRes.ok) {
          const sData = await sRes.json();
          const settings = sData.storeSettings || sData.settings;
          if (settings) {
            setIsCheckoutEnabled(settings.isCheckoutEnabled !== false);
            setCheckoutNotice(settings.checkoutDisabledNotice || '');
          }
        }
      } catch (err) {}
    } catch (e) {
      console.error('Error loading cart:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQty = async (productId: string, size: string, delta: number) => {
    try {
      setIsUpdating(true);
      const res = await authFetch(`/api/cart/items/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ size, delta }),
      });
      const data = await res.json();
      if (data?.items) {
        setItems(data.items);
        setSubtotal(data.subtotal || 0);
        setDiscount(data.discountAmount || 0);
        setShippingFee(data.shippingFee || 0);
        setTotal(data.total || 0);
      }
    } catch (e) {
      showToast({
        type: 'error',
        title: 'Cart Error',
        message: 'Could not update quantity.',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async (productId: string, size: string) => {
    try {
      setIsUpdating(true);
      const res = await authFetch(`/api/cart/items/${productId}?size=${encodeURIComponent(size)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data?.items) {
        setItems(data.items);
        setSubtotal(data.subtotal || 0);
        setDiscount(data.discountAmount || 0);
        setShippingFee(data.shippingFee || 0);
        setTotal(data.total || 0);
      }
      showToast({
        type: 'info',
        title: 'Item Removed',
        message: 'Garment removed from shopping bag.',
      });
    } catch (e) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Could not remove item.',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const totalItemsCount = items.reduce((sum, item) => sum + item.qty, 0);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <CircularContentLoader message="Loading shopping bag..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      
      {/* Cart Title */}
      <div className="flex items-baseline justify-between pb-4 mb-6 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
          My Cart {totalItemsCount > 0 && <span className="text-neutral-500 font-bold text-lg sm:text-xl">({totalItemsCount} items)</span>}
        </h1>
        <Link
          href="/search"
          className="text-xs font-bold text-[#3478F6] hover:text-blue-700 transition-colors"
        >
          ← Continue Shopping
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <div className="text-5xl mb-4">🛍️</div>
          <h2 className="text-xl font-black text-neutral-900">Your bag is empty</h2>
          <p className="text-xs text-neutral-500 mt-2 max-w-sm mx-auto">
            You haven't added any handloom sarees, unstitched suitings, or festive attire to your cart yet.
          </p>
          <Link
            href="/search"
            className="mt-6 inline-block bg-[#3478F6] text-white text-xs font-bold px-8 py-3 rounded-full hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            Explore Collections →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Cart Items (LG: 7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.size}`}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex items-center justify-between gap-4 shadow-xs hover:border-slate-300 transition-all"
              >
                {/* Product Thumbnail */}
                <Link
                  href={`/products/${item.productId}`}
                  className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100 block"
                >
                  <img
                    src={item.imageUrl || `/api/media/${item.productId}`}
                    alt={item.name}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80';
                    }}
                  />
                </Link>

                {/* Info & Modifiers */}
                <div className="flex-1 min-w-0 pr-2">
                  <Link href={`/products/${item.productId}`}>
                    <h3 className="text-xs sm:text-sm font-black text-neutral-900 hover:text-blue-600 transition-colors truncate">
                      {item.name}
                    </h3>
                  </Link>

                  <div className="text-[11px] text-neutral-500 mt-1 flex items-center gap-2 flex-wrap">
                    {item.color && <span>Color: {item.color}</span>}
                    {item.color && item.size && <span>•</span>}
                    {item.size && <span>Size: {item.size}</span>}
                  </div>

                  <div className="text-sm sm:text-base font-black text-neutral-900 mt-2">
                    ₹{(item.price * item.qty).toLocaleString('en-IN')}
                    {item.qty > 1 && (
                      <span className="text-[11px] font-normal text-neutral-400 ml-2">
                        (₹{item.price.toLocaleString('en-IN')} each)
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Modifier & Remove */}
                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleUpdateQty(item.productId, item.size, -1)}
                      className="px-2.5 py-1 text-neutral-600 hover:bg-slate-200 font-bold text-xs disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-black text-neutral-900 select-none">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleUpdateQty(item.productId, item.size, 1)}
                      className="px-2.5 py-1 text-neutral-600 hover:bg-slate-200 font-bold text-xs disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleRemoveItem(item.productId, item.size)}
                    aria-label="Remove item"
                    className="p-1.5 rounded-full text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* RIGHT COLUMN: Order Summary (LG: 5 cols matching approved mockup) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5 sticky top-28">
              
              <h2 className="text-lg font-black text-neutral-900 pb-3 border-b border-slate-100">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-neutral-600">
                  <span>Subtotal ({totalItemsCount} items)</span>
                  <span className="font-bold text-neutral-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {discount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 font-bold">
                    <span>Discount</span>
                    <span>- ₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-neutral-600">
                  <span>Delivery</span>
                  {shippingFee === 0 ? (
                    <span className="font-bold text-emerald-600">FREE</span>
                  ) : (
                    <span className="font-bold text-neutral-900">₹{shippingFee}</span>
                  )}
                </div>

                <div className="border-t border-slate-200 pt-3 flex items-baseline justify-between">
                  <span className="text-base font-black text-neutral-900">Total</span>
                  <span className="text-2xl font-black text-neutral-900">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Primary Action Button */}
              {!isCheckoutEnabled ? (
                <div className="space-y-2">
                  <button
                    disabled
                    className="block w-full py-3.5 bg-neutral-200 text-neutral-500 text-center font-bold text-sm rounded-xl cursor-not-allowed shadow-none"
                  >
                    Checkout Temporarily Paused
                  </button>
                  <p className="text-[11px] text-rose-600 text-center font-semibold bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
                    {checkoutNotice || 'Checkout is temporarily paused for routine maintenance. Your items remain safely saved.'}
                  </p>
                </div>
              ) : (
                <Link
                  href="/checkout"
                  className="block w-full py-3.5 bg-[#3478F6] text-white text-center font-bold text-sm rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                >
                  Proceed to Checkout
                </Link>
              )}

              {/* Savings Banner matching mockup */}
              {discount > 0 && (
                <div className="p-3 bg-emerald-50 border border-emerald-200/60 rounded-xl text-center text-xs font-bold text-emerald-700">
                  ✓ You saved ₹{discount.toLocaleString('en-IN')} on this order!
                </div>
              )}

              {/* Statutory Note */}
              <p className="text-[10px] text-neutral-400 text-center leading-normal">
                ✓ Free shipping on orders above ₹999. GST exempted net retail pricing under Section 23 CGST Act.
              </p>

            </div>
          </div>

        </div>
      )}

      {/* Trust Strip matching approved mockup */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 pt-8 border-t border-slate-200 text-center text-xs text-neutral-600">
        <div className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-slate-100">
          <span className="text-base">🚚</span>
          <span className="font-bold text-neutral-800">Free Shipping</span> above ₹999
        </div>
        <div className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-slate-100">
          <span className="text-base">🔄</span>
          <span className="font-bold text-neutral-800">Easy Returns</span> within 7 days
        </div>
        <div className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-slate-100">
          <span className="text-base">🔒</span>
          <span className="font-bold text-neutral-800">Secure Payment</span> 100% Safe with Cashfree
        </div>
      </div>

    </div>
  );
}
