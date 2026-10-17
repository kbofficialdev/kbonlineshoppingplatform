"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState<number>(0);
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [user, setUser] = useState<any>(null);
  const [store, setStore] = useState<any>({
    brandName: "KB",
    officialName: "KB FASHIONS",
    village: "Kalwaral",
    district: "Kamareddy",
    state: "Telangana",
    contactPhone: "+91 7989768200",
  });

  const loadData = async () => {
    try {
      // Fetch cart
      const cartRes = await fetch('/api/cart');
      const cartData = await cartRes.json();
      if (cartData?.items) {
        setCartCount(cartData.items.reduce((sum: number, i: any) => sum + i.qty, 0));
      }

      // Fetch user profile
      const userRes = await fetch('/api/auth/me');
      const userData = await userRes.json();
      if (userData?.authenticated) {
        setUser(userData.user);
      } else {
        setUser(null);
      }

      // Wishlist
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('kb_wishlist');
        if (stored) {
          const parsed = JSON.parse(stored);
          setWishlistCount(Array.isArray(parsed) ? parsed.length : 0);
        }
      }

      // Store settings
      const storeRes = await fetch('/api/store/settings');
      const storeData = await storeRes.json();
      if (storeData?.settings) {
        setStore(storeData.settings);
      }
    } catch (e) {}
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      window.location.href = '/';
    } catch (e) {}
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-kbBorder">
      {/* Top Banner with Store Details */}
      <aside className="bg-kbBlack text-white text-[11px] py-1.5 px-4 font-mono">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{store.officialName} • {store.village}, {store.district}, {store.state} (503145) • 20 Years of Heritage</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-300">
            <span>Free Express Delivery over ₹{store.freeShippingThreshold || 999}</span>
            <Link href="/about" className="hover:text-white underline">Village Story</Link>
            <Link href="/contact" className="hover:text-white underline">{store.contactPhone}</Link>
          </div>
        </div>
      </aside>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-baseline gap-1 group">
            <span className="text-2xl font-black tracking-tight text-kbBlack group-hover:opacity-80 transition-opacity">
              {store.brandName}.
            </span>
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest hidden sm:inline">
              FASHIONS
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-neutral-600">
            <Link href="/search?category=All" className="hover:text-black transition-colors">All Collections</Link>
            <Link href="/search?category=Men" className="hover:text-black transition-colors">Men</Link>
            <Link href="/search?category=Women" className="hover:text-black transition-colors">Women</Link>
            <Link href="/search?category=Ethnic %26 Traditional" className="hover:text-black transition-colors">Traditional & Dhoti</Link>
            <Link href="/search?category=Daily Wear" className="hover:text-black transition-colors">Daily Wear</Link>
            <Link href="/about" className="hover:text-black transition-colors">About Shop</Link>
            <Link href="/contact" className="hover:text-black transition-colors">Contact</Link>
          </nav>
        </div>

        {/* Right Actions: Search, Wishlist, Bag, Account, Admin */}
        <div className="flex items-center gap-3">
          {/* Search Button */}
          <Link
            href="/search"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-kb-pill bg-kbLight border border-kbBorder text-xs text-neutral-600 hover:text-black hover:border-black transition-all"
          >
            <span>🔍</span>
            <span className="hidden sm:inline">Search...</span>
          </Link>

          {/* Wishlist Link */}
          <Link
            href="/wishlist"
            className="relative w-9 h-9 rounded-full border border-kbBorder flex items-center justify-center text-xs hover:border-black transition-colors"
            title="Wishlist"
          >
            ♡
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Link */}
          <Link
            href="/cart"
            id="header-cart-link"
            className="relative px-3.5 py-1.5 rounded-kb-pill bg-kbBlack text-white text-xs font-bold hover:bg-neutral-800 transition-all flex items-center gap-1.5"
            title="Shopping Bag"
          >
            <span>Bag</span>
            <span className="bg-white text-black text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {cartCount}
            </span>
          </Link>

          {/* Account / Auth Links */}
          {user ? (
            <div className="flex items-center gap-2 border-l border-kbBorder pl-3 ml-1 text-xs">
              <Link href="/account/orders" className="font-semibold text-neutral-800 hover:text-black underline">
                Orders
              </Link>
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="bg-emerald-800 text-white px-2.5 py-1 rounded-kb-pill text-[10px] font-bold uppercase tracking-wider"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-neutral-400 hover:text-red-600 text-[11px]"
                title="Logout"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 border-l border-kbBorder pl-3 ml-1 text-xs font-semibold">
              <Link href="/auth/signin" className="text-neutral-700 hover:text-black">
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="hidden sm:inline border border-kbBorder px-2.5 py-1 rounded-kb-pill hover:border-black"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

