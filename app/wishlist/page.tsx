"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useModalAlert } from '@/components/ModalContext';

export default function WishlistPage() {
  const { showModal } = useModalAlert();
  const [wishlist, setWishlist] = useState<any[]>([]);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kb_wishlist');
      if (stored) {
        try {
          setWishlist(JSON.parse(stored));
        } catch (e) {}
      }
    }
  };

  const handleRemove = (productId: string) => {
    const updated = wishlist.filter(p => (p.productId || p.id) !== productId);
    setWishlist(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kb_wishlist', JSON.stringify(updated));
    }
    showModal({
      type: 'info',
      title: 'Item Removed',
      message: 'Garment removed from your wishlist.',
    });
  };

  const handleMoveToBag = async (product: any) => {
    try {
      const res = await fetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.productId || product.id,
          name: product.name,
          price: product.price,
          size: product.sizes?.[0] || 'M',
        })
      });
      const data = await res.json();

      if (res.status === 401 || data.requiresAuth) {
        showModal({
          type: 'auth',
          title: 'Sign In Required to Shop',
          message: 'An active account session is required to move saved wishlist items into your shopping bag.',
          primaryBtn: {
            text: 'Sign In to Account →',
            href: `/auth/signin?redirect=%2Fwishlist&reason=auth_required`,
          },
          secondaryBtn: {
            text: 'Create New Account',
            href: `/auth/signup?redirect=%2Fwishlist`,
          },
        });
        return;
      }

      if (!res.ok) {
        showModal({
          type: 'error',
          title: 'Unable to Add to Bag',
          message: data.error || 'Failed to move item to bag. Please try again.',
        });
        return;
      }

      handleRemove(product.productId || product.id);
      showModal({
        type: 'success',
        title: 'Moved to Shopping Bag',
        message: `✓ "${product.name}" was moved from wishlist to your shopping bag!`,
        primaryBtn: {
          text: 'View Shopping Bag & Checkout →',
          href: '/cart',
        },
        secondaryBtn: {
          text: 'Keep Viewing Wishlist',
        },
      });
    } catch (e) {
      showModal({
        type: 'error',
        title: 'Network Error',
        message: 'Could not connect to the store servers. Please check your internet connection.',
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

      {/* Header */}
      <div className="flex justify-between items-baseline border-b border-kbBorder pb-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-kbBlack">My Wishlist</h1>
          <p className="text-xs text-neutral-500 mt-1">Saved favorites from KB FASHIONS village catalog</p>
        </div>
        <Link href="/search?category=All" className="text-xs font-semibold text-neutral-600 hover:text-black underline">
          ← Discover More Clothes
        </Link>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-kbSurfaceAlt border border-kbBorder rounded-kb-lg p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="text-4xl">♡</div>
          <h2 className="text-lg font-bold">Your wishlist is empty</h2>
          <p className="text-xs text-neutral-500">
            Bookmark items you love by tapping the heart icon on any garment in our store.
          </p>
          <Link
            href="/search?category=All"
            className="inline-block bg-black text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-neutral-800"
          >
            Explore Authentic Garments
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map(product => {
            const imageSrc = product.images?.[0]?.data || '';
            const prodId = product.productId || product.id;

            return (
              <div
                key={prodId}
                className="bg-white border border-kbBorder hover:border-black rounded-kb-md p-4 transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <Link href={`/products/${prodId}`} className="block relative aspect-[4/5] bg-kbCardBg rounded-kb-sm overflow-hidden mb-3">
                    {imageSrc ? (
                      <img src={imageSrc} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-neutral-300">KB</div>
                    )}
                  </Link>

                  <div className="text-[10px] text-emerald-800 font-semibold mb-1">
                    {product.origin || 'Kalwaral, Telangana'}
                  </div>

                  <Link href={`/products/${prodId}`}>
                    <h3 className="font-bold text-sm text-neutral-900 hover:underline line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="mt-2 font-extrabold text-sm text-black">
                    ₹{product.price}
                  </div>
                </div>

                <div className="pt-3 border-t border-kbBorder mt-3 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleMoveToBag(product)}
                    className="flex-1 bg-black text-white text-xs font-bold py-2 rounded-kb-pill hover:bg-neutral-800 text-center"
                  >
                    + Move to Bag
                  </button>
                  <button
                    onClick={() => handleRemove(prodId)}
                    className="w-8 h-8 rounded-full border border-kbBorder hover:border-red-500 hover:text-red-500 flex items-center justify-center text-xs"
                    title="Remove from wishlist"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

