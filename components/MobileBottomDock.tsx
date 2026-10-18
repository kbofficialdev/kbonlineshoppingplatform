"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { authFetch } from '@/lib/clientAuth';

export default function MobileBottomDock() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState<number>(0);
  const [wishlistCount, setWishlistCount] = useState<number>(0);

  const loadDockCounts = async () => {
    try {
      // Cart items count
      const cartRes = await authFetch('/api/cart');
      if (cartRes.ok) {
        const cartData = await cartRes.json();
        if (cartData?.items && Array.isArray(cartData.items)) {
          setCartCount(cartData.items.reduce((sum: number, item: any) => sum + (item.qty || 1), 0));
        }
      }

      // Wishlist items count
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('kb_wishlist');
        if (stored) {
          const parsed = JSON.parse(stored);
          setWishlistCount(Array.isArray(parsed) ? parsed.length : 0);
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    loadDockCounts();
    const interval = setInterval(loadDockCounts, 8000);

    const onWishlistUpdate = () => {
      try {
        const stored = localStorage.getItem('kb_wishlist');
        if (stored) {
          const parsed = JSON.parse(stored);
          setWishlistCount(Array.isArray(parsed) ? parsed.length : 0);
        }
      } catch (e) {}
    };

    window.addEventListener('wishlist-updated', onWishlistUpdate);
    window.addEventListener('storage', onWishlistUpdate);
    return () => {
      clearInterval(interval);
      window.removeEventListener('wishlist-updated', onWishlistUpdate);
      window.removeEventListener('storage', onWishlistUpdate);
    };
  }, [pathname]);

  const isHome = pathname === '/';
  const isCategories = pathname.startsWith('/search') || pathname.startsWith('/products');
  const isWishlist = pathname.startsWith('/wishlist');
  const isCart = pathname.startsWith('/cart');
  const isAccount = pathname.startsWith('/account') || pathname.startsWith('/auth');

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <nav
      id="mobile-bottom-dock"
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 sm:hidden z-40 bg-neutral-950/95 text-white border-t border-neutral-800/80 px-2 py-2 backdrop-blur-md select-none shadow-2xl"
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            isHome
              ? 'text-blue-500 font-bold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-full ${isHome ? 'bg-blue-600/10' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill={isHome ? "currentColor" : "none"} stroke="currentColor" strokeWidth={isHome ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="text-[10px] tracking-tight">Home</span>
        </Link>

        {/* 2. Categories */}
        <Link
          href="/search?category=Sarees"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            isCategories
              ? 'text-blue-500 font-bold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-full ${isCategories ? 'bg-blue-600/10' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isCategories ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </div>
          <span className="text-[10px] tracking-tight">Categories</span>
        </Link>

        {/* 3. Wishlist */}
        <Link
          href="/wishlist"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
            isWishlist
              ? 'text-blue-500 font-bold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-full relative ${isWishlist ? 'bg-blue-600/10' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill={isWishlist ? "currentColor" : "none"} stroke="currentColor" strokeWidth={isWishlist ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Wishlist</span>
        </Link>

        {/* 4. Cart */}
        <Link
          href="/cart"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
            isCart
              ? 'text-blue-500 font-bold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-full relative ${isCart ? 'bg-blue-600/10' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isCart ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Cart</span>
        </Link>

        {/* 5. Account */}
        <Link
          href="/account"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            isAccount
              ? 'text-blue-500 font-bold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-full ${isAccount ? 'bg-blue-600/10' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill={isAccount ? "currentColor" : "none"} stroke="currentColor" strokeWidth={isAccount ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <span className="text-[10px] tracking-tight">Account</span>
        </Link>

      </div>
    </nav>
  );
}
