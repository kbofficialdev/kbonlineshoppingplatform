"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  const { showToast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Track window scroll for subtle glass elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on route transition
  useEffect(() => {
    setDropdownOpen(false);
  }, [pathname]);

  // Click outside and escape key listener for dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const loadUserData = async () => {
    try {
      const userRes = await authFetch('/api/auth/me');
      const userData = await userRes.json();
      if (userData?.authenticated) {
        setUser(userData.user);
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUserData();
    const interval = setInterval(loadUserData, 10000);
    return () => clearInterval(interval);
  }, [pathname]);

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
      }, 300);
    } catch (e) {
      window.location.href = '/';
    }
  };

  return (
    <header
      id="main-store-header"
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${
        isScrolled
          ? 'border-b border-slate-200/90 shadow-sm'
          : 'border-b border-slate-200'
      }`}
    >
      {/* Dynamic Push Alerts Banner */}
      <StoreAlertBanner />

      {/* Main Top Navigation Bar: Strictly Logo on Left and Profile Dropdown on Right */}
      <div className="bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between relative">
        {/* LEFT: Redesigned Brand Logo with Black, White, and Blue Variant Gradients */}
        <Link
          href="/"
          id="kb-navbar-brand-logo"
          className="flex items-center gap-3 group select-none transition-transform active:scale-[0.98]"
          aria-label="KB Fashions Home"
        >
          <KBBrandLogoMark className="w-10 h-10 sm:w-11 sm:h-11 shadow-sm transition-transform duration-300 group-hover:scale-105" />
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-neutral-950 via-blue-950 to-blue-700 bg-clip-text text-transparent group-hover:to-blue-500 transition-all">
                KB FASHIONS
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none">
              ESTD. 2006 • KALWARAL, TELANGANA
            </span>
          </div>
        </Link>

        {/* RIGHT: Profile Icon with Interactive Dropdown (No other links or icons) */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            id="kb-navbar-profile-trigger"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
            aria-label="User Account Menu"
            className={`flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-full border transition-all duration-200 ${
              dropdownOpen
                ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-sm'
                : 'border-slate-200 bg-white hover:border-neutral-900 hover:shadow-2xs'
            }`}
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || 'User'}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-900 via-blue-950 to-blue-700 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : <UserProfileIcon className="w-4 h-4 text-white" />}
              </div>
            )}

            {/* Desktop User Label / Status Indicator */}
            <div className="hidden sm:flex flex-col items-start text-left leading-tight pr-1">
              <span className="text-xs font-bold text-neutral-900 truncate max-w-[130px]">
                {user ? user.name || 'Patron' : 'My Account'}
              </span>
              <span className="text-[10px] text-neutral-400 font-medium">
                {user ? (user.role === 'ADMIN' ? '⚡ Administrator' : 'Verified Patron') : 'Sign In / Register'}
              </span>
            </div>

            <ChevronDownIcon
              className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180 text-blue-600' : ''
              }`}
            />
          </button>

          {/* Clean Account Dropdown Panel */}
          {dropdownOpen && (
            <div
              id="kb-navbar-profile-dropdown"
              className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden"
            >
              {user ? (
                <>
                  {/* Authenticated User Header */}
                  <div className="px-4 py-3 bg-neutral-50/80 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-950 to-blue-700 text-white font-bold flex items-center justify-center text-sm shrink-0 overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>{user.name?.slice(0, 2).toUpperCase() || 'KB'}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-black text-neutral-900 truncate">{user.name}</div>
                      <div className="text-[11px] text-neutral-500 truncate">{user.email || user.phone}</div>
                      <span className="inline-block mt-0.5 text-[9px] font-extrabold uppercase px-2 py-0.2 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                        {user.role === 'ADMIN' ? 'Store Administrator' : 'Verified Patron'}
                      </span>
                    </div>
                  </div>

                  {/* Account Navigation Links */}
                  <div className="py-1">
                    <Link
                      href="/account"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:text-black hover:bg-neutral-50 transition-colors"
                    >
                      <UserProfileIcon className="w-4 h-4 text-neutral-500" />
                      <span>Account Profile &amp; Addresses</span>
                    </Link>

                    <Link
                      href="/account/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:text-black hover:bg-neutral-50 transition-colors"
                    >
                      <OrdersBoxIcon className="w-4 h-4 text-neutral-500" />
                      <span>My Orders &amp; Receipts</span>
                    </Link>

                    <Link
                      href="/account?tab=tracking"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:text-black hover:bg-neutral-50 transition-colors"
                    >
                      <DeliveryTruckIcon className="w-4 h-4 text-neutral-500" />
                      <span>Live 10km Consignment Tracking</span>
                    </Link>

                    <Link
                      href="/support"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:text-black hover:bg-neutral-50 transition-colors"
                    >
                      <SupportDeskIcon className="w-4 h-4 text-neutral-500" />
                      <span>Online Support Desk</span>
                    </Link>

                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-amber-900 bg-amber-50/70 hover:bg-amber-100/70 transition-colors border-y border-amber-100"
                      >
                        <AdminShieldIcon className="w-4 h-4 text-amber-700" />
                        <span>Admin Store Management</span>
                      </Link>
                    )}
                  </div>

                  {/* Sign Out Button */}
                  <div className="pt-1 mt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogoutIcon className="w-4 h-4 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Guest Header */}
                  <div className="px-4 py-3 bg-neutral-50/80 border-b border-slate-100">
                    <div className="text-xs font-black text-neutral-900">Welcome to KB Fashions</div>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Sign in for order tracking, wishlist saves, and rural delivery services.
                    </p>
                  </div>

                  <div className="p-3 space-y-2">
                    <Link
                      href="/auth/signin?redirect=/account"
                      onClick={() => setDropdownOpen(false)}
                      className="block w-full text-center py-2.5 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-colors shadow-xs"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setDropdownOpen(false)}
                      className="block w-full text-center py-2.5 rounded-full border border-slate-300 bg-white text-neutral-900 text-xs font-bold hover:bg-neutral-50 transition-colors"
                    >
                      Create New Account
                    </Link>
                  </div>

                  <div className="pt-2 border-t border-slate-100 px-2 pb-1 space-y-1">
                    <Link
                      href="/account?tab=tracking"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-neutral-600 hover:text-black hover:bg-neutral-50 rounded-lg transition-colors"
                    >
                      <DeliveryTruckIcon className="w-4 h-4 text-neutral-400" />
                      <span>Track Consignment</span>
                    </Link>
                    <Link
                      href="/support"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-neutral-600 hover:text-black hover:bg-neutral-50 rounded-lg transition-colors"
                    >
                      <SupportDeskIcon className="w-4 h-4 text-neutral-400" />
                      <span>Online Support Desk</span>
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
