"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { authFetch } from '@/lib/clientAuth';

export default function MobileBottomDock() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState<number>(0);
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const loadDockData = async () => {
    try {
      // Check auth
      const meRes = await authFetch('/api/auth/me');
      if (meRes.ok) {
        const meData = await meRes.json();
        setIsLoggedIn(Boolean(meData?.authenticated));
      }

      // Check cart
      const cartRes = await authFetch('/api/cart');
      if (cartRes.ok) {
        const cartData = await cartRes.json();
        if (cartData?.items) {
          setCartCount(cartData.items.reduce((sum: number, i: any) => sum + i.qty, 0));
        }
      }

      // Check wishlist
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
    const interval = setInterval(loadDockData, 6000);
    return () => clearInterval(interval);
  }, [pathname]);

  const isHome = pathname === '/';
  const isCategories = pathname.startsWith('/search');
  const isWishlist = pathname.startsWith('/wishlist');
  const isCart = pathname.startsWith('/cart');
  const isAccount = pathname.startsWith('/account') || pathname.startsWith('/auth');

  return (
    <nav
      id="mobile-bottom-dock"
      aria-label="Mobile Navigation Dock"
      className="fixed bottom-3 left-3 right-3 sm:hidden z-40 bg-neutral-950 text-white rounded-full px-2 py-1.5 shadow-2xl border border-neutral-800 flex items-center justify-around backdrop-blur-md select-none"
    >
      {/* 1. Home */}
      <Link
        href="/"
        className={`flex flex-col items-center justify-center transition-all px-2.5 py-1 rounded-full ${
          isHome
            ? 'bg-white text-black font-black px-4 shadow-sm'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isHome ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span className="text-[10px] mt-0.5 tracking-tight font-medium">Home</span>
      </Link>

      {/* 2. Categories */}
      <Link
        href="/search?category=All"
        className={`flex flex-col items-center justify-center transition-all px-2.5 py-1 rounded-full ${
          isCategories
            ? 'bg-white text-black font-black px-4 shadow-sm'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isCategories ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
        </svg>
        <span className="text-[10px] mt-0.5 tracking-tight font-medium">Categories</span>
      </Link>

      {/* 3. Wishlist */}
      <Link
        href="/wishlist"
        className={`flex flex-col items-center justify-center transition-all px-2.5 py-1 rounded-full relative ${
          isWishlist
            ? 'bg-white text-black font-black px-4 shadow-sm'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        <div className="relative">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isWishlist ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {wishlistCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-kb-blue text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-0.5 tracking-tight font-medium">Wishlist</span>
      </Link>

      {/* 4. Cart */}
      <Link
        href="/cart"
        className={`flex flex-col items-center justify-center transition-all px-2.5 py-1 rounded-full relative ${
          isCart
            ? 'bg-white text-black font-black px-4 shadow-sm'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        <div className="relative">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isCart ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-kb-blue text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-0.5 tracking-tight font-medium">Cart</span>
      </Link>

      {/* 5. Account (Highlighted Pill when active, identical to Modern UI inspiration) */}
      <Link
        href={isLoggedIn ? "/account" : "/auth/signin?redirect=/account"}
        id="mobile-bottom-dock-account"
        className={`flex flex-col items-center justify-center transition-all px-2.5 py-1 rounded-full ${
          isAccount
            ? 'bg-white text-kb-blue font-black px-4 shadow-md'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isAccount ? "2.4" : "1.8"} strokeLinecap="round" strokeLinejoin="round" className={`w-5 h-5 ${isAccount ? 'text-kb-blue' : ''}`}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span className={`text-[10px] mt-0.5 tracking-tight font-bold ${isAccount ? 'text-kb-blue font-black' : ''}`}>
          Account
        </span>
      </Link>
    </nav>
  );
}
