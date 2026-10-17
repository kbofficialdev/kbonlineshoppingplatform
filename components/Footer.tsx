import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';

export default function Footer() {
  const store = db.storeSettings;

  return (
    <footer className="bg-gradient-to-b from-[#0B0F19] via-[#090D16] to-[#05070C] text-neutral-300 border-t border-[#1C253B] pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#1E283E]">
          {/* Brand & Village Story */}
          <div className="space-y-4">
            <div className="text-3xl font-black tracking-tight text-white flex items-baseline gap-1">
              <span>{store.brandName}.</span>
              <span className="text-[10px] font-bold text-kb-gold uppercase tracking-widest">
                FASHIONS
              </span>
            </div>
            <div className="text-xs font-bold text-white">{store.officialName}</div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Rooted in Kalwaral village for over two decades. Part of our family's ancestral occupation in fine textiles, offering honest quality, pure Gadwal weaves, and mill-fresh unstitched fabrics directly to you.
            </p>
            <div className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-800/60">
              ✓ GST Exempted Village Small Enterprise (Section 23 CGST Act). Pure artisan value without middleman markups.
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-xs space-y-2.5">
            <h4 className="font-bold text-kb-gold uppercase tracking-widest text-[11px] mb-3">Shop Collections</h4>
            <div><Link href="/search?category=All" className="text-neutral-400 hover:text-white transition-colors">All Collections</Link></div>
            <div><Link href="/search?category=Sarees" className="text-neutral-400 hover:text-white transition-colors">Handloom Gadwal &amp; Pattu Sarees</Link></div>
            <div><Link href="/search?category=Men%27s+Unstitched" className="text-neutral-400 hover:text-white transition-colors">Men&apos;s Unstitched (Raymond &amp; Arvind)</Link></div>
            <div><Link href="/ai" className="text-kb-violet font-semibold hover:text-white flex items-center gap-1 transition-colors">✦ KB Shopmate AI (Voice)</Link></div>
            <div><Link href="/search?category=Wedding" className="text-neutral-400 hover:text-white transition-colors">Wedding &amp; Ceremonial Attire</Link></div>
          </div>

          {/* Customer & Orders */}
          <div className="text-xs space-y-2.5">
            <h4 className="font-bold text-kb-gold uppercase tracking-widest text-[11px] mb-3">Customer Support</h4>
            <div><Link href="/cart" className="text-neutral-400 hover:text-white transition-colors">Shopping Bag</Link></div>
            <div><Link href="/wishlist" className="text-neutral-400 hover:text-white transition-colors">Saved Wishlist</Link></div>
            <div><Link href="/account/orders" className="text-neutral-400 hover:text-white transition-colors">Track Orders</Link></div>
            <div><Link href="/invoices/ORD-2026-1001" className="text-neutral-400 hover:text-white transition-colors">Retail Cash Memo (Bill of Supply)</Link></div>
            <div><Link href="/about" className="text-neutral-400 hover:text-white transition-colors">20-Year Heritage Story</Link></div>
            <div><Link href="/contact" className="text-neutral-400 hover:text-white transition-colors">Help &amp; Grievance Redressal</Link></div>
          </div>

          {/* Store Location & Official Contact */}
          <div className="text-xs space-y-2.5 bg-[#101625] p-5 rounded-2xl border border-[#222E48]">
            <h4 className="font-bold text-kb-gold uppercase tracking-widest text-[11px] mb-2">Physical Village Store</h4>
            <div className="font-semibold text-white">{store.officialName}</div>
            <div className="text-neutral-400 leading-relaxed font-mono text-[11px]">
              {store.address}
            </div>
            <div className="pt-2 text-neutral-300">
              <strong className="text-white">Phone:</strong> {store.contactPhone}
            </div>
            <div className="text-neutral-300">
              <strong className="text-white">Email:</strong> {store.contactEmail}
            </div>
            <div className="pt-2 border-t border-[#1C273E]">
              <Link href="/admin" className="text-[11px] font-bold text-kb-blue hover:text-white underline transition-colors">
                Merchant Admin Portal →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-500 gap-4">
          <div>
            © 2006–2026 {store.officialName}. All rights reserved. Kalwaral(Vil), Kamareddy(D), Telangana, India.
          </div>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/admin" className="hover:text-white transition-colors">Admin Governance</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
