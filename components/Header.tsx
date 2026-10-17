"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import StoreAlertBanner from './StoreAlertBanner';
import BrandTooltip from './BrandTooltip';
import { CATEGORIES_DATA } from './CategoryStrip';
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
  const [isCategoriesOpen, setIsCategoriesOpen] = useState<boolean>(false);
  const categoriesDropdownRef = useRef<HTMLDivElement>(null);

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

  // Close categories dropdown on route changes
  useEffect(() => {
    setIsCategoriesOpen(false);
  }, [pathname]);

  // Click outside listener for categories dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoriesDropdownRef.current &&
        !categoriesDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoriesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    setMobileMenuOpen(false);
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
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${
        isScrolled
          ? 'border-b border-slate-200/90 shadow-md'
          : 'border-b border-slate-200 shadow-none'
      }`}
    >
      {/* Dynamic Push Alerts & Announcements Banner (Standard Blue, Black, Green, Red Text) */}
      <StoreAlertBanner />

      {/* Main Top Navigation Bar (100% Solid Opaque White Background - Completely Hides Body Content On Scroll) */}
      <div className="bg-white max-w-kb-content mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 relative">
        {/* Brand Logo & Desktop Categories Trigger */}
        <div className="flex items-center gap-3 shrink-0" ref={categoriesDropdownRef}>
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

          {/* Desktop Categories Dropdown Trigger Button */}
          <div className="hidden lg:block relative ml-2">
            <button
              type="button"
              id="desktop-categories-nav-trigger"
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              onMouseEnter={() => setIsCategoriesOpen(true)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-bold transition-all shadow-2xs ${
                isCategoriesOpen
                  ? 'bg-black text-white border-black ring-2 ring-black/10'
                  : 'bg-neutral-50 text-neutral-800 border-slate-200 hover:bg-neutral-100 hover:border-black'
              }`}
              aria-expanded={isCategoriesOpen}
              aria-haspopup="true"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <span>Categories</span>
              <span className={`text-[10px] transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`}>▾</span>
            </button>
          </div>
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

      {/* ========================================================================= */}
      {/* FLOATING CATEGORIES DROPDOWN MENU WITH SMOOTH TRANSITION EFFECT (DESKTOP) */}
      {/* ========================================================================= */}
      <div
        id="floating-categories-dropdown"
        onMouseEnter={() => setIsCategoriesOpen(true)}
        onMouseLeave={() => setIsCategoriesOpen(false)}
        className={`absolute top-full left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-2xl transition-all duration-300 ease-out origin-top ${
          isCategoriesOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto visible'
            : 'opacity-0 -translate-y-2 pointer-events-none invisible'
        }`}
      >
        <div className="max-w-kb-content mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-kb-blue animate-pulse"></span>
              <span className="text-xs font-black uppercase tracking-wider text-black">
                Kalwaral Village Handlooms &amp; Master Cuts
              </span>
              <span className="text-[10px] text-neutral-400 font-telugu">చేనేత వస్త్ర విభాగాలు</span>
            </div>
            <Link
              href="/search?category=All"
              onClick={() => setIsCategoriesOpen(false)}
              className="text-xs font-bold text-kb-blue hover:underline flex items-center gap-1"
            >
              <span>Explore All 12+ Weaves in Catalog</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {CATEGORIES_DATA.map((cat) => (
              <Link
                key={cat.id}
                href={cat.href}
                onClick={() => setIsCategoriesOpen(false)}
                className="group flex items-start gap-3 p-3 rounded-2xl border border-slate-200/80 bg-white hover:border-black hover:bg-neutral-50/80 transition-all shadow-2xs hover:shadow-sm"
              >
                <div className="p-2.5 rounded-xl bg-neutral-100 text-neutral-800 group-hover:bg-black group-hover:text-white transition-colors shrink-0">
                  {cat.iconSvg}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-neutral-900 group-hover:text-black">{cat.name}</span>
                    {cat.badge && (
                      <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                        {cat.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-500 font-telugu mt-0.5">{cat.nameTe}</p>
                  <p className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">{cat.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE CONSISTENT SIDEBAR DRAWER WITH STRICT GROUPING & CATEGORIES         */}
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

              {/* Complete Categories Included in Mobile Sidebar Drawer */}
              <div className="space-y-3">
                <div className="text-[11px] font-black uppercase tracking-wider text-neutral-900 flex items-center justify-between border-b border-neutral-100 pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span>▦</span>
                    <span>Browse All Categories</span>
                  </div>
                  <span className="text-[10px] font-bold text-neutral-400">Kalwaral Weaves</span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {CATEGORIES_DATA.map((cat) => (
                    <Link
                      key={cat.id}
                      href={cat.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-black hover:bg-neutral-50 transition-all"
                    >
                      <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0">
                        {cat.iconSvg}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-neutral-900">{cat.name}</span>
                          {cat.badge && (
                            <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900">
                              {cat.badge}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                          <span className="font-telugu">{cat.nameTe}</span>
                          <span>•</span>
                          <span className="truncate">{cat.subtitle}</span>
                        </div>
                      </div>
                      <span className="text-neutral-400 text-xs">→</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Village Store Physical Landmark Info */}
              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-slate-200 text-[11px] text-neutral-600 space-y-1.5">
                <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                  <span>🏛️</span>
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
