"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import TypewriterTicker from './TypewriterTicker';

export default function Header() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState<number>(0);
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
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
      if (cartRes.ok) {
        const cartData = await cartRes.json();
        if (cartData?.items) {
          setCartCount(cartData.items.reduce((sum: number, i: any) => sum + i.qty, 0));
        }
      } else {
        setCartCount(0);
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
    setMobileMenuOpen(false); // Close mobile menu on page transition
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    } else {
      window.location.href = '/search?category=All';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-kb-gray shadow-xs">
      {/* Main Navigation Bar */}
      <div className="max-w-kb-content mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo & Desktop Categories */}
        <div className="flex items-center gap-6 lg:gap-8 min-w-0">
          <Link href="/" className="flex items-baseline gap-1 group shrink-0">
            <span className="text-2xl font-black tracking-tight text-kb-black group-hover:opacity-80 transition-opacity">
              {store.brandName}.
            </span>
            <span className="text-[10px] font-bold text-kb-slate uppercase tracking-widest hidden sm:inline">
              FASHIONS
            </span>
          </Link>

          {/* Desktop Nav Categories */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-kb-slate">
            <Link href="/search?category=Men" className="hover:text-kb-black transition-colors">Men</Link>
            <Link href="/search?category=Women" className="hover:text-kb-black transition-colors">Women</Link>
            <Link href="/search?category=Sarees" className="hover:text-kb-black transition-colors">Sarees</Link>
            <Link href="/search?category=Kids" className="hover:text-kb-black transition-colors">Kids</Link>
            <Link href="/search?category=Wedding" className="hover:text-kb-black transition-colors">Wedding</Link>
            <Link href="/search?category=Trending" className="hover:text-kb-black transition-colors">Trending</Link>
            <Link href="/about" className="hover:text-kb-black transition-colors">About</Link>
          </nav>
        </div>

        {/* Global Search Input Field (Desktop / Tablet) */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-1 max-w-xs relative mx-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cottons, sarees, unstitched..."
            className="w-full px-3.5 py-1.5 pl-8 rounded-kb-pill border border-kb-gray bg-white text-xs text-kb-black placeholder-kb-slate/60 focus:outline-none focus:ring-1 focus:ring-kb-blue"
          />
          <span className="absolute left-2.5 text-xs text-kb-slate pointer-events-none">🔍</span>
        </form>

        {/* Right Actions Container */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* KB Shopmate AI Button */}
          <Link
            href="/ai"
            id="kb-shopmate-ai-nav-btn"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-kb-blue to-kb-violet text-white text-xs font-semibold hover:brightness-110 active:scale-98 transition-all shadow-sm"
          >
            <span aria-hidden="true">✦</span>
            <span className="hidden sm:inline">Shop with KB AI</span>
            <span className="sm:hidden text-[11px]">AI Shop</span>
          </Link>

          {/* Wishlist Link (Desktop) */}
          <Link
            href="/wishlist"
            className="hidden sm:flex relative w-9 h-9 rounded-full border border-kb-gray items-center justify-center text-xs hover:border-kb-black transition-colors"
            title="Wishlist"
          >
            ♡
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-kb-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Link */}
          <Link
            href="/cart"
            id="header-cart-link"
            className="relative px-3 sm:px-3.5 py-1.5 rounded-kb-pill bg-kb-black text-white text-xs font-semibold hover:bg-neutral-800 transition-all flex items-center gap-1.5 shrink-0"
            title="Shopping Bag"
          >
            <span>Bag</span>
            <span className="bg-kb-blue text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {cartCount}
            </span>
          </Link>

          {/* Account Links (Desktop) */}
          {user ? (
            <div className="hidden sm:flex items-center gap-2 border-l border-kb-gray pl-3 ml-1 text-xs">
              <Link href="/account/orders" className="font-semibold text-kb-black hover:text-kb-blue">
                Orders
              </Link>
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="bg-kb-black text-white px-2.5 py-1 rounded-kb-pill text-[10px] font-bold uppercase tracking-wider"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-kb-slate hover:text-kb-error text-[11px]"
                title="Logout"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 border-l border-kb-gray pl-3 ml-1 text-xs font-semibold">
              <Link href="/auth/signin" className="text-kb-black hover:text-kb-blue">
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="border border-kb-gray px-2.5 py-1 rounded-kb-pill hover:border-kb-black"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-full border border-kb-gray flex items-center justify-center text-sm font-bold hover:bg-neutral-50 transition-colors shrink-0"
            aria-label="Toggle mobile menu"
            id="mobile-menu-toggle-btn"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Letter-by-Letter Animated Ticker Banner (Below Navbar) */}
      <TypewriterTicker />

      {/* Mobile In-Page Collapsible Navigation Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="lg:hidden bg-white border-b border-kb-gray px-4 py-4 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
          {/* Mobile Search Input */}
          <form onSubmit={handleSearchSubmit} className="flex items-center relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cottons, sarees, unstitched..."
              className="w-full px-3.5 py-2 pl-9 rounded-kb-pill border border-kb-gray bg-white text-xs text-kb-black focus:outline-none focus:ring-1 focus:ring-kb-blue"
            />
            <span className="absolute left-3 text-xs text-kb-slate">🔍</span>
          </form>

          {/* Mobile Category Links Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs font-medium">
            <Link
              href="/search?category=Men"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-neutral-50 rounded-xl hover:bg-neutral-100 flex items-center justify-between"
            >
              <span>Men's Fabrics</span>
              <span className="text-neutral-400">→</span>
            </Link>
            <Link
              href="/search?category=Women"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-neutral-50 rounded-xl hover:bg-neutral-100 flex items-center justify-between"
            >
              <span>Women's Wear</span>
              <span className="text-neutral-400">→</span>
            </Link>
            <Link
              href="/search?category=Sarees"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-neutral-50 rounded-xl hover:bg-neutral-100 flex items-center justify-between"
            >
              <span>Gadwal Sarees</span>
              <span className="text-neutral-400">→</span>
            </Link>
            <Link
              href="/search?category=Wedding"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-neutral-50 rounded-xl hover:bg-neutral-100 flex items-center justify-between"
            >
              <span>Wedding Specials</span>
              <span className="text-neutral-400">→</span>
            </Link>
            <Link
              href="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-neutral-50 rounded-xl hover:bg-neutral-100 flex items-center justify-between"
            >
              <span>Saved Wishlist ({wishlistCount})</span>
              <span className="text-neutral-400">♡</span>
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-neutral-50 rounded-xl hover:bg-neutral-100 flex items-center justify-between"
            >
              <span>Our 20-Year Story</span>
              <span className="text-neutral-400">📖</span>
            </Link>
          </div>

          {/* Mobile Auth / Account Section */}
          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
            {user ? (
              <div className="flex items-center gap-3 w-full justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="font-semibold">{user.name || user.email}</span>
                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="bg-black text-white px-2 py-0.5 rounded text-[10px] font-bold"
                    >
                      Admin
                    </Link>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href="/account/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-bold text-kb-blue underline"
                  >
                    Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-neutral-400 hover:text-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <Link
                  href="/auth/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-kb-pill bg-black text-white font-bold"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-kb-pill border border-neutral-300 font-bold"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
