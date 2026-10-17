"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data?.authenticated) {
        setUser(data.user);
      }
    } catch (e) {
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

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Top Admin Sub-bar */}
      <div className="bg-neutral-900 text-white border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
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
      <div className="bg-white border-b border-kbBorder sticky top-16 z-30">
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
                      ? 'bg-black text-white shadow-sm'
                      : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
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
