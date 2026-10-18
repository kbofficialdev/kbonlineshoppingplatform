"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import StoreAlertBanner from './StoreAlertBanner';
import { authFetch, clearClientSession } from '@/lib/clientAuth';
import { useToast } from './ToastContext';
import {
  KBBrandLogoMark,
  UserProfileIcon,
  OrdersBoxIcon,
  DeliveryTruckIcon,
  SupportDeskIcon,
  AdminShieldIcon,
  LogoutIcon,
  ChevronDownIcon
} from './CustomIcons';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cartCount, setCartCount] = useState<number>(0);
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Track window scroll for subtle glass elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
  }, [pathname]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadHeaderData = async () => {
    try {
      // 1. User
      const userRes = await authFetch('/api/auth/me');
      if (userRes.ok) {
        const userData = await userRes.json();
        if (userData?.authenticated) {
          setUser(userData.user);
        } else {
          setUser(null);
        }
      }

      // 2. Cart count
      const cartRes = await authFetch('/api/cart');
      if (cartRes.ok) {
        const cartData = await cartRes.json();
        if (cartData?.items && Array.isArray(cartData.items)) {
          setCartCount(cartData.items.reduce((sum: number, item: any) => sum + (item.qty || 1), 0));
        }
      }

      // 3. Wishlist count
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
    loadHeaderData();
    const interval = setInterval(loadHeaderData, 10000);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      clearClientSession();
      setUser(null);
      showToast({
        type: 'info',
        title: 'Logged Out',
        message: 'You have been securely signed out of KB Fashions.',
      });
      setTimeout(() => {
        window.location.href = '/';
      }, 200);
    } catch (e) {
      window.location.href = '/';
    }
  };

  return (
    <header
      id="main-store-header"
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-200 ${
        isScrolled ? 'border-b border-slate-200 shadow-xs' : 'border-b border-slate-200/80'
      }`}
    >
      {/* Top Notification / Push Alert Banner */}
      <StoreAlertBanner />

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 sm:h-[72px] flex items-center justify-between gap-4">
          
          {/* LEFT: KB FASHIONS Brand Logo */}
          <Link
            href="/"
            id="kb-navbar-brand-logo"
            className="flex items-center gap-2.5 shrink-0 group select-none cursor-pointer"
            aria-label="KB Fashions Home"
          >
            <KBBrandLogoMark className="w-9 h-9 sm:w-10 sm:h-10 transition-transform duration-300 group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900 group-hover:text-blue-600 transition-colors">
                KB <span className="font-light tracking-widest text-neutral-800">FASHIONS</span>
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV LINKS (Women, Men, Kids, Accessories, Festive, Offers) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-bold text-neutral-700">
            <Link
              href="/search?category=Sarees"
              className="hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              Women
            </Link>
            <Link
              href="/search?category=Men%27s%20Unstitched%20Fabrics"
              className="hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              Men
            </Link>
            <Link
              href="/search?category=Inners%20%26%20Essentials"
              className="hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              Kids
            </Link>
            <Link
              href="/search?category=Dhotis%20%26%20Towels"
              className="hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              Accessories
            </Link>
            <Link
              href="/search?category=Sarees"
              className="hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              Festive
            </Link>
            <Link
              href="/search?sort=price-asc"
              className="text-red-600 hover:text-red-700 font-extrabold whitespace-nowrap"
            >
              Offers
            </Link>
          </nav>

          {/* DESKTOP SEARCH BAR */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-sm lg:max-w-md relative"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for sarees, kurtas, dresses..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
              />
              <button
                type="submit"
                aria-label="Submit search"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            </div>
          </form>

          {/* RIGHT ICONS: Profile, Wishlist, Cart */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Account Menu Trigger */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                id="kb-navbar-profile-trigger"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                aria-label="User Account Menu"
                className="flex items-center gap-1.5 p-2 rounded-full hover:bg-slate-100 transition-colors text-neutral-700"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || 'User'}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                  />
                ) : (
                  <UserProfileIcon className="w-5 h-5 text-neutral-800" />
                )}
                <ChevronDownIcon
                  className={`hidden sm:block w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${
                    dropdownOpen ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>

              {/* Account Dropdown */}
              {dropdownOpen && (
                <div
                  id="kb-navbar-profile-dropdown"
                  className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden"
                >
                  {user ? (
                    <>
                      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-neutral-900 text-white font-bold flex items-center justify-center text-sm shrink-0">
                          {user.name?.slice(0, 2).toUpperCase() || 'KB'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-black text-neutral-900 truncate">{user.name}</div>
                          <div className="text-[11px] text-neutral-500 truncate">{user.email || user.phone}</div>
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/account"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-neutral-700 hover:bg-slate-50 transition-colors"
                        >
                          <UserProfileIcon className="w-4 h-4 text-blue-600" />
                          <span>Customer Dashboard</span>
                        </Link>
                        <Link
                          href="/account/orders"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-neutral-700 hover:bg-slate-50 transition-colors"
                        >
                          <OrdersBoxIcon className="w-4 h-4 text-neutral-600" />
                          <span>My Orders & Tracking</span>
                        </Link>
                        <Link
                          href="/wishlist"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-neutral-700 hover:bg-slate-50 transition-colors"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                          <span>Saved Wishlist ({wishlistCount})</span>
                        </Link>
                        <Link
                          href="/support"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-neutral-700 hover:bg-slate-50 transition-colors"
                        >
                          <SupportDeskIcon className="w-4 h-4 text-neutral-600" />
                          <span>Patron Care & Grievance Desk</span>
                        </Link>

                        {user.role === 'ADMIN' && (
                          <Link
                            href="/admin"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-amber-700 hover:bg-amber-50/50 border-t border-slate-100"
                          >
                            <AdminShieldIcon className="w-4 h-4 text-amber-600" />
                            <span>Store Management Console</span>
                          </Link>
                        )}

                        <div className="border-t border-slate-100 mt-1 pt-1">
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50/60 transition-colors text-left"
                          >
                            <LogoutIcon className="w-4 h-4 text-red-500" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-3 space-y-2">
                      <div className="text-center pb-2 border-b border-slate-100">
                        <div className="text-xs font-bold text-neutral-800">Welcome to KB Fashions</div>
                        <p className="text-[11px] text-neutral-500">Access your orders and wishlist</p>
                      </div>
                      <Link
                        href="/auth/signin"
                        onClick={() => setDropdownOpen(false)}
                        className="block w-full py-2.5 bg-neutral-900 text-white font-bold text-xs rounded-xl text-center hover:bg-black transition-all"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/auth/signup"
                        onClick={() => setDropdownOpen(false)}
                        className="block w-full py-2 bg-slate-100 text-neutral-800 font-bold text-xs rounded-xl text-center hover:bg-slate-200 transition-all"
                      >
                        Create Account
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist Link with Badge */}
            <Link
              href="/wishlist"
              id="kb-navbar-wishlist-link"
              aria-label="View Wishlist"
              className="relative p-2 rounded-full hover:bg-slate-100 transition-colors text-neutral-700"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Link with Badge */}
            <Link
              href="/cart"
              id="kb-navbar-cart-link"
              aria-label="Shopping Cart"
              className="relative p-2 rounded-full hover:bg-slate-100 transition-colors text-neutral-700"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-blue-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </Link>

          </div>

        </div>

        {/* MOBILE SEARCH BAR ROW (Shown only on small screens) */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for sarees, kurtas, dresses..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
            />
            <button
              type="submit"
              aria-label="Submit search"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </form>
        </div>

      </div>
    </header>
  );
}
