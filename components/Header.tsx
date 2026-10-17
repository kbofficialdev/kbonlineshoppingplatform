"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import TypewriterTicker from './TypewriterTicker';
import StoreAlertBanner from './StoreAlertBanner';
import BrandTooltip from './BrandTooltip';
import { authFetch, clearClientSession } from '@/lib/clientAuth';
import { useToast } from './ToastContext';

interface NavItem {
  id: string;
  label: string;
  labelTe?: string;
  href: string;
  icon: string;
  tooltip: string;
  category?: string;
  order: number;
  isFeatured?: boolean;
}

export default function Header() {
  const pathname = usePathname();
  const { showToast } = useToast();
  const [cartCount, setCartCount] = useState<number>(0);
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
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
    handleScroll(); // Initial check
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadData = async () => {
    try {
      // 1. Fetch dynamic navigation items from database
      const navRes = await fetch('/api/navigation');
      if (navRes.ok) {
        const navData = await navRes.json();
        if (navData?.navItems && Array.isArray(navData.navItems)) {
          setNavItems(navData.navItems);
        }
      }

      // 2. Fetch user profile
      const userRes = await authFetch('/api/auth/me');
      const userData = await userRes.json();
      if (userData?.authenticated) {
        setUser(userData.user);
      } else {
        setUser(null);
      }

      // 3. Fetch cart
      const cartRes = await authFetch('/api/cart');
      if (cartRes.ok) {
        const cartData = await cartRes.json();
        if (cartData?.items) {
          setCartCount(cartData.items.reduce((sum: number, i: any) => sum + i.qty, 0));
        }
      } else {
        setCartCount(0);
      }

      // 4. Wishlist
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('kb_wishlist');
        if (stored) {
          const parsed = JSON.parse(stored);
          setWishlistCount(Array.isArray(parsed) ? parsed.length : 0);
        }
      }

      // 5. Store settings from database
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
          ? 'bg-white/98 backdrop-blur-md border-b border-slate-200/90 shadow-md'
          : 'bg-white/95 backdrop-blur-xs border-b border-transparent shadow-none'
      }`}
    >
      {/* Dynamic Push Alerts & Announcements Banner (Database Powered) */}
      <StoreAlertBanner />

      {/* Main Navigation Bar */}
      <div className="max-w-kb-content mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo & Desktop Nav Categories */}
        <div className="flex items-center gap-5 lg:gap-7 min-w-0">
          <BrandTooltip content={`${store.officialName} — Kalwaral Village`} subcontent="ESTD. 2006 • GENERATIONAL WEAVERS">
            <Link href="/" className="flex items-baseline gap-1 group shrink-0">
              <span className="text-2xl font-black tracking-tight text-kb-black group-hover:opacity-80 transition-opacity">
                {store.brandName}.
              </span>
              <span className="text-[10px] font-bold text-kb-slate uppercase tracking-widest hidden sm:inline">
                FASHIONS
              </span>
            </Link>
          </BrandTooltip>

          {/* Desktop Nav Categories with Icons and Branded Tooltips (Directly from Database) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold text-kb-slate">
            {navItems.map((item) => (
              <BrandTooltip key={item.id} content={item.tooltip} subcontent={item.labelTe}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
                    pathname === item.href || (item.category && pathname.includes(`category=${item.category}`))
                      ? 'text-kb-black bg-neutral-100/80 font-bold'
                      : 'hover:text-kb-black hover:bg-neutral-50'
                  }`}
                >
                  <span className="text-sm shrink-0" aria-hidden="true">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.isFeatured && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  )}
                </Link>
              </BrandTooltip>
            ))}
          </nav>
        </div>

        {/* Global Search Input Field (Desktop / Tablet) */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-1 max-w-xs relative mx-2">
          <BrandTooltip content="Search Fabrics & Garments" subcontent="Sarees, Cottons, Raymond Cut Pieces" className="w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cottons, sarees, unstitched..."
              className="w-full px-3.5 py-1.5 pl-8 rounded-kb-pill border border-kb-gray bg-white text-xs text-kb-black placeholder-kb-slate/60 focus:outline-none focus:ring-1 focus:ring-kb-blue"
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-kb-slate pointer-events-none">🔍</span>
          </BrandTooltip>
        </form>

        {/* Right Actions Container */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* KB Shopmate AI Button */}
          <BrandTooltip content="KB Shopmate AI Voice Assistant" subcontent="Shop in Telugu & English">
            <Link
              href="/ai"
              id="kb-shopmate-ai-nav-btn"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-kb-blue to-kb-violet text-white text-xs font-semibold hover:brightness-110 active:scale-98 transition-all shadow-sm"
            >
              <span aria-hidden="true">✦</span>
              <span className="hidden sm:inline">Shop with AI</span>
              <span className="sm:hidden text-[11px]">AI Shop</span>
            </Link>
          </BrandTooltip>

          {/* Wishlist Link (Desktop) */}
          <BrandTooltip content="Saved Wishlist" subcontent={`${wishlistCount} Garments`}>
            <Link
              href="/wishlist"
              className="hidden sm:flex relative w-9 h-9 rounded-full border border-kb-gray items-center justify-center text-xs hover:border-kb-black transition-colors"
              aria-label="Wishlist"
            >
              <span aria-hidden="true">♡</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-kb-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </BrandTooltip>

          {/* Cart Link with Badge */}
          <BrandTooltip content="Shopping Bag" subcontent={`${cartCount} Items`}>
            <Link
              href="/cart"
              id="header-cart-link"
              className="relative px-3 sm:px-3.5 py-1.5 rounded-kb-pill bg-kb-black text-white text-xs font-semibold hover:bg-neutral-800 transition-all flex items-center gap-1.5 shrink-0"
              aria-label="Shopping Bag"
            >
              <span>🛍️</span>
              <span className="hidden sm:inline">Bag</span>
              <span className="bg-kb-blue text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {cartCount}
              </span>
            </Link>
          </BrandTooltip>

          {/* Dedicated Customer Profile Icon & Account Links (Desktop) */}
          {user ? (
            <div className="hidden sm:flex items-center gap-2 border-l border-kb-gray pl-2.5 ml-1 text-xs">
              <BrandTooltip content="Customer Account Dashboard" subcontent={user.email}>
                <Link
                  href="/account"
                  id="header-profile-link"
                  className="flex items-center gap-1.5 p-1 pl-1.5 pr-2.5 rounded-full border border-kb-gray hover:border-kb-blue transition-all bg-white hover:shadow-xs group"
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-neutral-900 border border-neutral-200 flex items-center justify-center text-[10px] font-bold text-white shrink-0 group-hover:scale-105 transition-transform">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{user.name?.slice(0, 2).toUpperCase() || 'KB'}</span>
                    )}
                  </div>
                  <div className="flex flex-col text-left leading-none">
                    <span className="text-[11px] font-bold text-kb-black group-hover:text-kb-blue transition-colors truncate max-w-[80px]">
                      {user.name?.split(' ')[0] || 'Account'}
                    </span>
                    <span className="text-[9px] text-neutral-400 font-medium">Profile</span>
                  </div>
                </Link>
              </BrandTooltip>

              <BrandTooltip content="My Order History & Consignments">
                <Link
                  href="/account/orders"
                  className="font-semibold text-kb-black hover:text-kb-blue px-2 py-1 rounded-md hover:bg-neutral-50 transition-colors"
                >
                  Orders
                </Link>
              </BrandTooltip>

              {user.role === 'ADMIN' && (
                <BrandTooltip content="Store Administration & Catalog Control">
                  <Link
                    href="/admin"
                    className="bg-kb-black text-white px-2.5 py-1 rounded-kb-pill text-[10px] font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                  >
                    Admin
                  </Link>
                </BrandTooltip>
              )}

              <BrandTooltip content="Sign Out Securely">
                <button
                  onClick={handleLogout}
                  className="text-kb-slate hover:text-kb-error text-[11px] px-1 py-1"
                >
                  Sign out
                </button>
              </BrandTooltip>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 border-l border-kb-gray pl-2.5 ml-1 text-xs font-semibold">
              <BrandTooltip content="Sign In to Your Account" subcontent="Access Saved Bag & Tracking">
                <Link
                  href="/auth/signin?redirect=/account"
                  id="header-profile-link"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-kb-gray hover:border-kb-blue text-kb-black hover:text-kb-blue transition-all text-xs font-semibold"
                >
                  <span className="text-sm">👤</span>
                  <span>Sign In</span>
                </Link>
              </BrandTooltip>
              <Link
                href="/auth/signup"
                className="border border-kb-gray px-2.5 py-1 rounded-kb-pill hover:border-kb-black text-xs"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-full border border-kb-gray flex items-center justify-center text-sm font-bold hover:bg-neutral-50 transition-colors shrink-0"
            aria-label="Toggle mobile drawer"
            id="mobile-menu-toggle-btn"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Letter-by-Letter Animated Ticker Banner (Below Navbar) */}
      <TypewriterTicker />

      {/* ========================================================================= */}
      {/* MOBILE CONSISTENT SIDEBAR DRAWER WITH BACKDROP & SMOOTH SLIDE ANIMATION   */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
          {/* Dark Backdrop Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-In Sidebar Drawer from Right */}
          <div
            id="mobile-nav-drawer"
            className="absolute top-0 right-0 bottom-0 w-[300px] sm:w-[340px] max-w-[85vw] bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300 ease-out"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-neutral-50/80">
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black tracking-tight text-neutral-900">{store.brandName}.</span>
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">FASHIONS</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-sm font-bold hover:bg-neutral-200 transition-colors"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Mobile Search Form */}
              <form onSubmit={handleSearchSubmit} className="flex items-center relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search sarees, fabrics, cuts..."
                  className="w-full px-3.5 py-2 pl-9 rounded-kb-pill border border-kb-gray bg-white text-xs text-kb-black focus:outline-none focus:ring-1 focus:ring-kb-blue"
                />
                <span className="absolute left-3 text-xs text-kb-slate pointer-events-none">🔍</span>
              </form>

              {/* KB Shopmate AI Feature Card */}
              <Link
                href="/ai"
                onClick={() => setMobileMenuOpen(false)}
                className="block p-3 rounded-2xl bg-gradient-to-r from-kb-blue to-kb-violet text-white shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">✦ VOICE SHOPPING</span>
                  <span className="text-xs">→</span>
                </div>
                <div className="text-xs font-bold">Talk to KB Shopmate AI</div>
                <div className="text-[10px] text-white/80 mt-0.5">Shop in Telugu &amp; English with AI assistant</div>
              </Link>

              {/* Navigation Categories with Icons & Telugu Labels */}
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 mb-2 px-1">
                  Shop by Department
                </div>
                <div className="space-y-1.5">
                  {navItems.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between p-2.5 rounded-xl transition-all ${
                        pathname === item.href
                          ? 'bg-neutral-900 text-white font-bold'
                          : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{item.icon}</span>
                        <div>
                          <div className="text-xs font-bold leading-tight">{item.label}</div>
                          {item.labelTe && (
                            <div className="text-[10px] opacity-70 leading-tight">{item.labelTe}</div>
                          )}
                        </div>
                      </div>
                      <span className="text-xs opacity-50">→</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Quick Links (Wishlist & Contact) */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 bg-neutral-50 rounded-xl hover:bg-neutral-100 flex items-center justify-between"
                >
                  <span className="font-semibold">♡ Wishlist ({wishlistCount})</span>
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 bg-neutral-50 rounded-xl hover:bg-neutral-100 flex items-center justify-between"
                >
                  <span className="font-semibold">📞 Contact Us</span>
                </Link>
              </div>

              {/* Village Store Identity Card */}
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-[11px] space-y-1 text-neutral-600">
                <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                  <span>📍</span>
                  <span>{store.officialName}</span>
                </div>
                <p>3-55/1, Kalwaral (Vil), Sadasivanagar (M), Kamareddy, Telangana 503145</p>
                <p className="text-[10px] text-emerald-700 font-bold">✓ Doorstep Delivery within 10 km Radius</p>
              </div>
            </div>

            {/* Drawer Footer: Customer Account / Auth */}
            <div className="p-4 border-t border-slate-200 bg-neutral-50">
              {user ? (
                <div className="space-y-3">
                  <Link
                    href="/account"
                    id="mobile-profile-link"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-slate-200"
                  >
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-neutral-900 text-white font-bold flex items-center justify-center text-xs shrink-0">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>{user.name?.slice(0, 2).toUpperCase() || 'KB'}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-neutral-900 truncate">{user.name || user.email}</div>
                      <div className="text-[10px] text-kb-blue font-semibold">View Account &amp; Profile →</div>
                    </div>
                  </Link>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/account/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center py-2 bg-neutral-200/80 hover:bg-neutral-200 rounded-lg text-xs font-bold text-neutral-800"
                    >
                      📦 My Orders
                    </Link>
                    <Link
                      href="/account?tab=tracking"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center py-2 bg-blue-100 hover:bg-blue-200 text-kb-blue rounded-lg text-xs font-bold"
                    >
                      🚚 Track Parcel
                    </Link>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-center py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700"
                  >
                    Sign Out of Account
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/auth/signin?redirect=/account"
                    id="mobile-profile-link"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2.5 rounded-kb-pill bg-black text-white text-xs font-bold shadow-sm"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2.5 rounded-kb-pill border border-neutral-300 text-xs font-bold bg-white"
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
