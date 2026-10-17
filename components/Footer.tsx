import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';

export default function Footer() {
  const store = db.storeSettings;

  return (
    <footer className="bg-gradient-to-b from-[#0B0F19] via-[#090D16] to-[#05070C] text-neutral-300 border-t border-[#1C253B] pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-[#1E283E]">
          {/* Column 1: Brand & Village Heritage */}
          <div className="space-y-4 lg:col-span-1">
            <div className="text-3xl font-black tracking-tight text-white flex items-baseline gap-1">
              <span>{store.brandName}.</span>
              <span className="text-[10px] font-bold text-kb-gold uppercase tracking-widest">
                FASHIONS
              </span>
            </div>
            <div className="text-xs font-bold text-white">{store.officialName}</div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Rooted in Kalwaral village for over two decades. Ancestral fine textiles, genuine handloom Gadwal sarees, and authentic unstitched cuts directly to you.
            </p>
            <div className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-800/60 leading-snug">
              ✓ GST Exempted Rural Small Enterprise (Section 23 CGST Act). Direct artisan value.
            </div>
          </div>

          {/* Column 2: Shop Collections */}
          <div className="text-xs space-y-2.5">
            <h4 className="font-bold text-kb-gold uppercase tracking-widest text-[11px] mb-3">Shop Collections</h4>
            <div><Link href="/search?category=All" className="text-neutral-400 hover:text-white transition-colors">All Collections</Link></div>
            <div><Link href="/search?category=Sarees" className="text-neutral-400 hover:text-white transition-colors">Handloom Gadwal &amp; Pattu</Link></div>
            <div><Link href="/search?category=Men%27s+Unstitched" className="text-neutral-400 hover:text-white transition-colors">Men's Unstitched (Raymond &amp; Arvind)</Link></div>
            <div><Link href="/search?category=Women" className="text-neutral-400 hover:text-white transition-colors">Women's Tops &amp; Leggings</Link></div>
            <div><Link href="/ai" className="text-kb-violet font-semibold hover:text-white flex items-center gap-1 transition-colors">✦ KB Shopmate AI (Voice)</Link></div>
            <div><Link href="/search?category=Wedding" className="text-neutral-400 hover:text-white transition-colors">Wedding &amp; Festive Special</Link></div>
          </div>

          {/* Column 3: Customer Support & Orders */}
          <div className="text-xs space-y-2.5">
            <h4 className="font-bold text-kb-gold uppercase tracking-widest text-[11px] mb-3">Customer Support</h4>
            <div><Link href="/account" className="text-neutral-400 hover:text-white transition-colors">My Profile &amp; Account</Link></div>
            <div><Link href="/account?tab=orders" className="text-neutral-400 hover:text-white transition-colors">Order History &amp; Stages</Link></div>
            <div><Link href="/account?tab=tracking" className="text-neutral-400 hover:text-white transition-colors">Track Consignment</Link></div>
            <div><Link href="/cart" className="text-neutral-400 hover:text-white transition-colors">Shopping Bag</Link></div>
            <div><Link href="/wishlist" className="text-neutral-400 hover:text-white transition-colors">Saved Wishlist</Link></div>
            <div><Link href="/contact" className="text-neutral-400 hover:text-white transition-colors">Help Desk &amp; Inquiries</Link></div>
          </div>

          {/* Column 4: Statutory Policies & Compliance */}
          <div className="text-xs space-y-2.5">
            <h4 className="font-bold text-kb-gold uppercase tracking-widest text-[11px] mb-3">Statutory Compliance</h4>
            <div><Link href="/policies/privacy" className="text-neutral-400 hover:text-white transition-colors">Privacy Policy</Link></div>
            <div><Link href="/policies/terms" className="text-neutral-400 hover:text-white transition-colors">Terms &amp; Conditions</Link></div>
            <div><Link href="/policies/refunds" className="text-neutral-400 hover:text-white transition-colors">Refund &amp; Return Policy</Link></div>
            <div><Link href="/policies/shipping" className="text-neutral-400 hover:text-white transition-colors">Shipping &amp; Delivery</Link></div>
            <div><Link href="/policies/grievance" className="text-neutral-400 hover:text-white transition-colors">Grievance Officer (Rules 2020)</Link></div>
            <div><Link href="/policies/statutory-declaration" className="text-neutral-400 hover:text-white transition-colors">Sec 23 CGST Tax Exemption</Link></div>
          </div>

          {/* Column 5: Store Location & Official Contact */}
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
          <div className="flex flex-wrap gap-4">
            <Link href="/policies/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/policies/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/policies/refunds" className="hover:text-white transition-colors">Refunds</Link>
            <Link href="/policies/grievance" className="hover:text-white transition-colors">Grievance</Link>
            <Link href="/about" className="hover:text-white transition-colors">About Heritage</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

