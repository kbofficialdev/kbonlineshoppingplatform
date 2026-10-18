"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useModalAlert } from '@/components/ModalContext';
import { useToast } from '@/components/ToastContext';
import { authFetch } from '@/lib/clientAuth';

export default function WishlistPage() {
  const { showModal } = useModalAlert();
  const { showToast } = useToast();
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
    showToast({
      type: 'info',
      title: 'Item Removed',
      message: 'Item removed from your wishlist.',
    });
  };

  const handleMoveToBag = async (product: any) => {
    try {
      const res = await authFetch('/api/cart/items', {
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
          title: 'Sign In Required',
          message: 'Please sign in to move saved wishlist items to your shopping cart.',
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
        showToast({
          type: 'error',
          title: 'Unable to Add',
          message: data.error || 'Failed to move item to bag.',
        });
        return;
      }

      handleRemove(product.productId || product.id);
      showToast({
        type: 'success',
        title: 'Moved to Cart',
        message: `✓ "${product.name}" added to your shopping cart!`,
      });
    } catch (e) {
      showToast({
        type: 'error',
        title: 'Network Error',
        message: 'Could not connect to store servers.',
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28 sm:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutralBorder pb-4 mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-warmGray text-obsidian border border-neutralBorder mb-1">
            <span>🤍 Saved Favorites</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-obsidian tracking-tight">
            My Wishlist ({wishlist.length})
          </h1>
        </div>
        <Link
          href="/search?category=All"
          className="text-xs font-bold text-electricBlue hover:underline flex items-center gap-1"
        >
          <span>← Browse Catalog</span>
        </Link>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white border border-neutralBorder rounded-2xl p-12 text-center max-w-md mx-auto space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-warmGray mx-auto flex items-center justify-center text-2xl">
            🤍
          </div>
          <h2 className="text-lg font-bold text-obsidian">Your wishlist is empty</h2>
          <p className="text-xs text-secondaryText max-w-xs mx-auto">
            Tap the heart icon on any handloom saree, kurti, or fabric to save it for later.
          </p>
          <Link
            href="/search?category=All"
            className="inline-block bg-obsidian text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-neutral-800 transition-colors shadow-sm"
          >
            Explore Handlooms &amp; Festive Wear →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlist.map(product => {
            const imageSrc = product.images?.[0]?.data || product.image || '';
            const prodId = product.productId || product.id;

            return (
              <div
                key={prodId}
                className="bg-white border border-neutralBorder hover:border-obsidian rounded-2xl p-3 sm:p-4 transition-all shadow-xs flex flex-col justify-between group"
              >
                <div>
                  <Link href={`/products/${prodId}`} className="block relative aspect-3/4 bg-warmGray rounded-xl overflow-hidden mb-3">
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized={imageSrc.startsWith('http')}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-neutral-300">KB</div>
                    )}
                  </Link>

                  <div className="text-[10px] text-emerald-800 font-semibold mb-1">
                    {product.origin || 'Kalwaral, Telangana'}
                  </div>

                  <Link href={`/products/${prodId}`}>
                    <h3 className="font-bold text-xs sm:text-sm text-obsidian hover:text-electricBlue line-clamp-1 transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="mt-1 font-bold text-sm sm:text-base text-obsidian">
                    ₹{product.price}
                  </div>
                </div>

                <div className="pt-3 border-t border-neutralBorder mt-3 flex items-center gap-2">
                  <button
                    onClick={() => handleMoveToBag(product)}
                    className="flex-1 bg-electricBlue text-white text-xs font-bold py-2 rounded-xl hover:bg-blue-600 transition-colors text-center shadow-xs"
                  >
                    Move to Bag
                  </button>
                  <button
                    onClick={() => handleRemove(prodId)}
                    className="w-8 h-8 rounded-xl border border-neutralBorder hover:border-rose-300 hover:text-rose-600 flex items-center justify-center text-xs transition-colors shrink-0"
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
