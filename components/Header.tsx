"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import TypewriterTicker from './TypewriterTicker';
import StoreAlertBanner from './StoreAlertBanner';
import BrandTooltip from './BrandTooltip';
import CategoryStrip from './CategoryStrip';
import { authFetch, clearClientSession } from '@/lib/clientAuth';
import { useToast } from './ToastContext';

export default function Header() {
  const pathname = usePathname();
  const { showToast } = useToast();
  const [cartCount, setCartCount] = useState<number>(0);
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [store, setStore] = useState<any>({
    brandName: "KB",
    officialName: "KB FASHIONS",
    village: "Kalwaral",
    district: "Kamareddy",
    state: "Telangana",
    contactPhone: "+91 7989768200",
  });

  // Track window scroll for elevation shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile sidebar drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const loadData = async () => {
    try {
      // 1. Fetch user profile
      const userRes = await authFetch('/api/auth/me');
      const userData = await userRes.json();
      if (userData?.authenticated) {
        setUser(userData.user);
      } else {
        setUser(null);
      }

      // 2. Fetch cart
      const cartRes = await authFetch('/api/cart');
      if (cartRes.ok) {
        const cartData = await cartRes.json();
        if (cartData?.items) {
          setCartCount(cartData.items.reduce((sum: number, i: any) => sum + i.qty, 0));
        }
      } else {
        setCartCount(0);
      }

      // 3. Wishlist
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('kb_wishlist');
        if (stored) {
          const parsed = JSON.parse(stored);
          setWishlistCount(Array.isArray(parsed) ? parsed.length : 0);
        }
      }

      // 4. Store settings from database
      const storeRes = await fetch('/api/store/settings');
      const storeData = await storeRes.json();
      if (storeData?.settings) {
        setStore(storeData.settings);
      }
    } catch (e) {}
  };

  useEffect(() => {
    loadData();
    setMobileMenuOpen(false); // Close mobile drawer on page transition
    const interval = setInterval(loadData, 6000);
    return () => clearInterval(interval);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      clearClientSession();
      setUser(null);
      showToast({
        type: 'info',
        title: 'Logged Out',
        message: 'You have been securely signed out of your account.'
      });
      setTimeout(() => {
        window.location.href = '/';
      }, 400);
    } catch (e) {
      window.location.href = '/';
    }
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
    <header
      id="main-store-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white border-b border-slate-200/90 shadow-md'
          : 'bg-white border-b border-slate-200 shadow-none'
      }`}
    >
      {/* Dynamic Push Alerts & Announcements Banner (Database Powered) */}
      <StoreAlertBanner />

      {/* Main Top Navigation Bar (100% Solid Opaque Background) */}
      <div className="bg-white max-w-kb-content mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <BrandTooltip content={`${store.officialName} • Kalwaral`} subcontent="ESTD. 2006">
            <Link href="/" className="flex items-baseline gap-1 group">
              <span className="text-2xl font-black tracking-tight text-black group-hover:opacity-80 transition-opacity">
                {store.brandName}.
              </span>
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest hidden sm:inline">
                FASHIONS
              </span>
            </Link>
          </BrandTooltip>
        </div>

        {/* Global Search Input Field (Desktop / Tablet) */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-1 max-w-md relative mx-4">
          <BrandTooltip content="Search" subcontent="Sarees, Fabrics, Cuts" className="w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Gadwal sarees, Raymond suitings, cottons..."
              className="w-full px-4 py-2 pl-9 rounded-full border border-slate-200 bg-neutral-50 text-xs text-black placeholder-neutral-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 pointer-events-none">🔍</span>
          </BrandTooltip>
        </form>

        {/* Right Actions Container: All Buttons Have Exactly Identical Dimensions (w-9 h-9 sm:w-10 sm:h-10) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* AI Feature Icon (Coming Soon / Waitlist) */}
          <BrandTooltip content="KB AI" subcontent="Coming Soon">
            <Link
              href="/ai"
              id="kb-shopmate-ai-nav-btn"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-sm hover:border-black hover:bg-neutral-50 transition-colors shadow-2xs relative"
              aria-label="KB AI Waitlist"
            >
              <span aria-hidden="true">🤖</span>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            </Link>
          </BrandTooltip>

          {/* Wishlist Icon */}
          <BrandTooltip content="Wishlist" subcontent={`${wishlistCount} items`}>
            <Link
              href="/wishlist"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-sm hover:border-black hover:bg-neutral-50 transition-colors shadow-2xs relative"
              aria-label="Wishlist"
            >
              <span aria-hidden="true">♡</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </BrandTooltip>

          {/* Bag Icon */}
          <BrandTooltip content="Bag" subcontent={`${cartCount} items`}>
            <Link
              href="/cart"
              id="header-cart-link"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-black bg-black text-white flex items-center justify-center text-sm hover:bg-neutral-800 transition-colors shadow-xs relative"
              aria-label="Shopping Bag"
            >
              <span aria-hidden="true">🛍️</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </BrandTooltip>

          {/* Customer Account / Profile Icon */}
          {user ? (
            <>
              <BrandTooltip content="Account" subcontent={user.email}>
                <Link
                  href="/account"
                  id="header-profile-link"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-xs font-bold hover:border-black transition-colors shadow-2xs overflow-hidden"
                  aria-label="Account Profile"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{user.name?.slice(0, 2).toUpperCase() || '👤'}</span>
                  )}
                </Link>
              </BrandTooltip>

              {user.role === 'ADMIN' && (
                <BrandTooltip content="Admin" subcontent="Store Management">
                  <Link
                    href="/admin"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-300 bg-amber-50 text-amber-900 flex items-center justify-center text-sm font-bold hover:bg-amber-100 transition-colors shadow-2xs"
                    aria-label="Admin Portal"
                  >
                    ⚡
                  </Link>
                </BrandTooltip>
              )}

              <BrandTooltip content="Sign Out">
                <button
                  onClick={handleLogout}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-sm text-neutral-600 hover:text-red-600 hover:border-red-300 transition-colors shadow-2xs"
                  aria-label="Sign Out"
                >
                  🚪
                </button>
              </BrandTooltip>
            </>
          ) : (
            <BrandTooltip content="Sign In" subcontent="Login / Register">
              <Link
                href="/auth/signin?redirect=/account"
                id="header-profile-link"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-sm hover:border-black transition-colors shadow-2xs"
                aria-label="Sign In"
              >
                👤
              </Link>
            </BrandTooltip>
          )}

          {/* Mobile Hamburger Menu Button (Identical Size) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-sm font-bold hover:border-black hover:bg-neutral-50 transition-colors shadow-2xs shrink-0"
            aria-label="Toggle mobile drawer"
            id="mobile-menu-toggle-btn"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Sub-Navbar Horizontal Category Strip with Custom SVGs for Exact Village Product Lines */}
      <CategoryStrip />

      {/* Letter-by-Letter Animated Ticker Banner (Below Categories) */}
      <TypewriterTicker />

      {/* ========================================================================= */}
      {/* MOBILE CONSISTENT SIDEBAR DRAWER WITH STRICT GROUPING & SCROLL RETENTION  */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
          {/* Dark Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-In Sidebar Drawer from Right (Guaranteed Full Height & Visible on Scroll) */}
          <div
            id="mobile-nav-drawer"
            className="fixed top-0 right-0 bottom-0 w-[310px] sm:w-[340px] max-w-[85vw] bg-white shadow-2xl flex flex-col z-50 h-full overflow-y-auto animate-in slide-in-from-right duration-300 ease-out"
          >
            {/* Drawer Header */}
            <div className="sticky top-0 z-20 p-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black tracking-tight text-black">{store.brandName}.</span>
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">FASHIONS</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-sm font-bold hover:bg-neutral-100 transition-colors"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content Container */}
            <div className="p-4 space-y-6 flex-1">
              {/* Mobile Search Form */}
              <form onSubmit={handleSearchSubmit} className="flex items-center relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search sarees, unstitched cuts..."
                  className="w-full px-3.5 py-2 pl-9 rounded-full border border-slate-200 bg-neutral-50 text-xs text-black focus:outline-none focus:ring-1 focus:ring-black"
                />
                <span className="absolute left-3 text-xs text-neutral-400 pointer-events-none">🔍</span>
              </form>

              {/* KB Shopmate AI Feature Card (Coming Soon / Waitlist) */}
              <Link
                href="/ai"
                onClick={() => setMobileMenuOpen(false)}
                className="block p-3.5 rounded-2xl bg-neutral-900 text-white shadow-sm border border-neutral-800"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider bg-white/20 text-amber-300 px-2 py-0.5 rounded-full">
                    ✦ PRIVATE WAITLIST
                  </span>
                  <span className="text-xs">→</span>
                </div>
                <div className="text-xs font-bold">KB Shopmate AI Voice Assistant</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">Coming soon for trusted customers (Telugu &amp; English)</div>
              </Link>

              {/* Exact Categories Specified by User */}

              {/* Group 1: Women's Collection */}
              <div className="space-y-2">
                <div className="text-[11px] font-black uppercase tracking-wider text-neutral-900 flex items-center gap-1.5 border-b border-neutral-100 pb-1">
                  <span>👗</span>
                  <span>Women's Collection</span>
                </div>
                <div className="space-y-1 text-xs">
                  <Link
                    href="/search?category=Sarees"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50"
                  >
                    <span>Sarees (Nirma, Layered Zari, Pattu, Latest)</span>
                    <span className="text-neutral-400">→</span>
                  </Link>
                  <Link
                    href="/search?category=Women&type=WOMEN_WEAR"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50"
                  >
                    <span>Tops, Leggings &amp; Daily Dresses</span>
                    <span className="text-neutral-400">→</span>
                  </Link>
                  <Link
                    href="/search?category=Women&type=BLOUSE_PIECE"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50"
                  >
                    <span>Blouse Pieces &amp; Matching Cloths</span>
                    <span className="text-neutral-400">→</span>
                  </Link>
                </div>
              </div>

              {/* Group 2: Men's Collection */}
              <div className="space-y-2">
                <div className="text-[11px] font-black uppercase tracking-wider text-neutral-900 flex items-center gap-1.5 border-b border-neutral-100 pb-1">
                  <span>👔</span>
                  <span>Men's Fabrics (Only Unstitched)</span>
                </div>
                <div className="space-y-1 text-xs">
                  <Link
                    href="/search?category=Men&isUnstitched=true"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50"
                  >
                    <span>Raymond &amp; Brand Suitings (in Meters)</span>
                    <span className="text-neutral-400">→</span>
                  </Link>
                  <Link
                    href="/search?category=Men&type=DHOTI_TOWEL"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50"
                  >
                    <span>Dhotis, Panchas &amp; Traditional Towels</span>
                    <span className="text-neutral-400">→</span>
                  </Link>
                </div>
              </div>

              {/* Group 3: General Essentials */}
              <div className="space-y-2">
                <div className="text-[11px] font-black uppercase tracking-wider text-neutral-900 flex items-center gap-1.5 border-b border-neutral-100 pb-1">
                  <span>🎽</span>
                  <span>General Essentials</span>
                </div>
                <div className="space-y-1 text-xs">
                  <Link
                    href="/search?category=Men&type=INNER_ESSENTIAL"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50"
                  >
                    <span>Banians (80-100cm Combed Cotton) &amp; Inners</span>
                    <span className="text-neutral-400">→</span>
                  </Link>
                  <Link
                    href="/search?category=Men&type=INNER_ESSENTIAL"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50"
                  >
                    <span>Pure Cotton Kerchiefs &amp; Handloom Towels</span>
                    <span className="text-neutral-400">→</span>
                  </Link>
                </div>
              </div>

              {/* Group 4: Older People */}
              <div className="space-y-2">
                <div className="text-[11px] font-black uppercase tracking-wider text-neutral-900 flex items-center gap-1.5 border-b border-neutral-100 pb-1">
                  <span>👵</span>
                  <span>Older People Heritage</span>
                </div>
                <div className="space-y-1 text-xs">
                  <Link
                    href="/search?category=Sarees&work=gadwal"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2 rounded-lg bg-amber-50/60 border border-amber-200/60 text-amber-950 font-bold"
                  >
                    <span>Authentic Gadwal Sarees (Temple Border)</span>
                    <span className="text-amber-700">★</span>
                  </Link>
                </div>
              </div>

              {/* Village Store Identity Card */}
              <div className="p-3 bg-neutral-50 border border-slate-200 rounded-xl text-[11px] space-y-1 text-neutral-600">
                <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                  <span>📍</span>
                  <span>{store.officialName}</span>
                </div>
                <p>3-55/1, Kalwaral (Vil), Sadasivanagar (M), Kamareddy, Telangana 503145</p>
                <p className="text-[10px] text-emerald-700 font-bold">✓ Doorstep Delivery within 10 km Radius</p>
              </div>
            </div>

            {/* Drawer Footer: Customer Account / Auth */}
            <div className="sticky bottom-0 p-4 border-t border-slate-200 bg-white">
              {user ? (
                <div className="space-y-3">
                  <Link
                    href="/account"
                    id="mobile-profile-link"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-neutral-50 border border-slate-200"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-black text-white font-bold flex items-center justify-center text-xs shrink-0">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>{user.name?.slice(0, 2).toUpperCase() || '👤'}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-neutral-900 truncate">{user.name || user.email}</div>
                      <div className="text-[10px] text-blue-600 font-semibold">Manage Profile →</div>
                    </div>
                  </Link>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/account/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-xs font-bold text-neutral-800"
                    >
                      📦 Orders
                    </Link>
                    <Link
                      href="/account?tab=tracking"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold"
                    >
                      🚚 Track
                    </Link>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-center py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/auth/signin?redirect=/account"
                    id="mobile-profile-link"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2.5 rounded-full bg-black text-white text-xs font-bold shadow-sm"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2.5 rounded-full border border-neutral-300 text-xs font-bold bg-white"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
