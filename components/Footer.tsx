import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';

export default function Footer() {
  const store = db.storeSettings;

  return (
    <footer className="bg-kbSurface border-t border-kbBorder text-kbBlack pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-kbBorder">
          {/* Brand & Village Story */}
          <div className="space-y-4">
            <div className="text-3xl font-black tracking-tight">{store.brandName}.</div>
            <div className="text-xs font-bold text-neutral-800">{store.officialName}</div>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Rooted in Kalwaral village for over two decades. Part of our family's ancestral occupation in fine textiles, offering honest quality and fair prices directly to you.
            </p>
            <div className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
              ✓ GST Exempted Village Small Business (Section 23 CGST Act). Direct retail prices without middleman markups.
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-xs space-y-2.5">
            <h4 className="font-bold text-black uppercase tracking-wider text-[11px] mb-3">Shop Collections</h4>
            <div><Link href="/search?category=All" className="text-neutral-500 hover:text-black">All Collections</Link></div>
            <div><Link href="/search?category=Men" className="text-neutral-500 hover:text-black">Men's Handspun & Linen</Link></div>
            <div><Link href="/search?category=Women" className="text-neutral-500 hover:text-black">Women's Kurtis & Anarkalis</Link></div>
            <div><Link href="/search?category=Ethnic %26 Traditional" className="text-neutral-500 hover:text-black">Traditional Dhoti Sets</Link></div>
            <div><Link href="/search?category=Daily Wear" className="text-neutral-500 hover:text-black">Daily Wear Tees & Comforts</Link></div>
          </div>

          {/* Customer & Orders */}
          <div className="text-xs space-y-2.5">
            <h4 className="font-bold text-black uppercase tracking-wider text-[11px] mb-3">Customer Support</h4>
            <div><Link href="/cart" className="text-neutral-500 hover:text-black">Shopping Bag</Link></div>
            <div><Link href="/wishlist" className="text-neutral-500 hover:text-black">Wishlist</Link></div>
            <div><Link href="/account/orders" className="text-neutral-500 hover:text-black">Track My Orders</Link></div>
            <div><Link href="/invoices/ORD-2026-1001" className="text-neutral-500 hover:text-black">Sample Bill of Supply</Link></div>
            <div><Link href="/about" className="text-neutral-500 hover:text-black">Our 20-Year Story</Link></div>
            <div><Link href="/contact" className="text-neutral-500 hover:text-black">Help & Grievance Contact</Link></div>
          </div>

          {/* Store Location & Official Contact */}
          <div className="text-xs space-y-2.5 bg-white p-5 rounded-kb-md border border-kbBorder">
            <h4 className="font-bold text-black uppercase tracking-wider text-[11px] mb-2">Physical Shop Address</h4>
            <div className="font-semibold text-neutral-800">{store.officialName}</div>
            <div className="text-neutral-600 leading-relaxed font-mono text-[11px]">
              {store.address}
            </div>
            <div className="pt-2 text-neutral-700">
              <strong>Phone:</strong> {store.contactPhone}
            </div>
            <div className="text-neutral-700">
              <strong>Email:</strong> {store.contactEmail}
            </div>
            <div className="pt-2 border-t border-neutral-100">
              <Link href="/admin" className="text-[11px] font-bold text-neutral-500 hover:text-black underline">
                Merchant Admin Portal →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-400 gap-4">
          <div>
            © 2006–2026 {store.officialName}. All rights reserved. Kalwaral, Kamareddy, Telangana, India.
          </div>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-black">About Us</Link>
            <Link href="/contact" className="hover:text-black">Contact</Link>
            <Link href="/admin" className="hover:text-black">Admin Access</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
