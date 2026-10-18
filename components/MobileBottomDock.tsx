"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { authFetch } from '@/lib/clientAuth';
import {
  UserProfileIcon,
  ShoppingBagIcon
} from './CustomIcons';

export default function MobileBottomDock() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState<number>(0);
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const loadDockData = async () => {
    try {
      const meRes = await authFetch('/api/auth/me');
      if (meRes.ok) {
        const meData = await meRes.json();
        setIsLoggedIn(Boolean(meData?.authenticated));
      }

      const cartRes = await authFetch('/api/cart');
      if (cartRes.ok) {
        const cartData = await cartRes.json();
        if (cartData?.items) {
          setCartCount(cartData.items.reduce((sum: number, i: any) => sum + i.qty, 0));
        }
      }

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
    loadDockData();
    const interval = setInterval(loadDockData, 8000);
    return () => clearInterval(interval);
  }, [pathname]);

  const isHome = pathname === '/';
  const isCatalog = pathname.startsWith('/search');
  const isCart = pathname.startsWith('/cart');
  const isAccount = pathname.startsWith('/account') || pathname.startsWith('/auth');

  return (
    <nav
      id="mobile-bottom-dock"
      aria-label="Mobile Navigation Dock"
      className="fixed bottom-3 left-3 right-3 sm:hidden z-40 bg-neutral-950/95 text-white rounded-full px-3 py-2 shadow-2xl border border-neutral-800 flex items-center justify-around backdrop-blur-md select-none"
    >
      {/* 1. Home */}
      <Link
        href="/"
        className={`flex flex-col items-center justify-center transition-all px-3 py-1 rounded-full ${
          isHome
            ? 'bg-white text-black font-black shadow-sm'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isHome ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span className="text-[10px] mt-0.5 font-medium">Home</span>
      </Link>

      {/* 2. Collections / Catalog */}
      <Link
        href="/search?category=All"
        className={`flex flex-col items-center justify-center transition-all px-3 py-1 rounded-full ${
          isCatalog
            ? 'bg-white text-black font-black shadow-sm'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isCatalog ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
        </svg>
        <span className="text-[10px] mt-0.5 font-medium">Catalog</span>
      </Link>

      {/* 3. Shopping Bag / Cart */}
      <Link
        href="/cart"
        className={`flex flex-col items-center justify-center transition-all px-3 py-1 rounded-full relative ${
          isCart
            ? 'bg-white text-black font-black shadow-sm'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        <div className="relative">
          <ShoppingBagIcon className="w-4 h-4" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-blue-600 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-0.5 font-medium">Bag</span>
      </Link>

      {/* 4. Customer Account Profile */}
      <Link
        href={isLoggedIn ? "/account" : "/auth/signin?redirect=/account"}
        id="mobile-bottom-dock-account"
        className={`flex flex-col items-center justify-center transition-all px-3 py-1 rounded-full ${
          isAccount
            ? 'bg-white text-black font-black shadow-sm'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        <UserProfileIcon className="w-4 h-4" />
        <span className="text-[10px] mt-0.5 font-medium">Account</span>
      </Link>
    </nav>
  );
}
