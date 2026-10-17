"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [accessDenied, setAccessDenied] = useState<boolean>(false);

  useEffect(() => {
    checkAdmin();
  }, [pathname]);

  const checkAdmin = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/me');
      const data = await res.json();

      if (data?.authenticated && data.user?.role === 'ADMIN') {
        setUser(data.user);
        setAccessDenied(false);
      } else {
        setAccessDenied(true);
        const reason = data?.authenticated ? 'forbidden' : 'admin_required';
        window.location.href = `/auth/signin?redirect=${encodeURIComponent(pathname)}&reason=${reason}`;
      }
    } catch (e) {
      setAccessDenied(true);
      window.location.href = `/auth/signin?redirect=${encodeURIComponent(pathname)}&reason=admin_required`;
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { label: 'Overview', href: '/admin', icon: '📊' },
    { label: 'Products & Stock', href: '/admin/products', icon: '📦' },
    { label: 'Add Product', href: '/admin/products/new', icon: '➕' },
    { label: 'Orders & Dispatch', href: '/admin/orders', icon: '🚚' },
    { label: 'Customers', href: '/admin/customers', icon: '👥' },
    { label: 'Refunds', href: '/admin/refunds', icon: '↩️' },
    { label: 'Store Settings', href: '/admin/settings', icon: '⚙️' },
  ];

  if (loading || !user || user.role !== 'ADMIN' || accessDenied) {
    return (
      <div className="min-h-screen bg-kb-white flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4 bg-kb-white p-8 rounded-kb-panel border border-kb-gray shadow-sm">
          <div className="w-10 h-10 border-2 border-kb-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="text-base font-bold text-kb-black">Verifying Administrator Session...</h2>
          <p className="text-xs text-kb-slate">
            Secure authorization check in progress. Unauthenticated visits are automatically redirected to Sign-In.
          </p>
          <Link
            href={`/auth/signin?redirect=${encodeURIComponent(pathname)}&reason=admin_required`}
            className="inline-block bg-kb-blue text-white text-xs font-semibold px-5 py-2.5 rounded-kb-pill hover:bg-blue-600 transition-all"
          >
            Go to Admin Sign In →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Top Admin Sub-bar */}
      <div className="bg-kb-black text-white border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-kb-blue text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Admin Portal
            </span>
            <span className="text-xs font-bold text-neutral-300">
              KB FASHIONS (Kalwaral Village Enterprise Management)
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-neutral-400">
              Logged in: <strong className="text-white">{user?.email || 'Store Owner'}</strong>
            </span>
            <Link href="/" className="text-neutral-300 hover:text-white underline text-[11px]">
              Visit Public Store →
            </Link>
          </div>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="bg-white border-b border-kb-gray sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 text-xs font-bold scrollbar-none">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-2 rounded-kb-pill whitespace-nowrap flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-kb-black text-white shadow-sm'
                      : 'text-kb-slate hover:text-kb-black hover:bg-neutral-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Admin Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
