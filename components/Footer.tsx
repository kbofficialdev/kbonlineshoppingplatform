"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { KBBrandLogoMark } from './CustomIcons';

export default function Footer() {
  const pathname = usePathname();

  // Hide public storefront footer inside administrative portal
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const officialName = "KB Fashions";
  const address = "3-55/1, Kalwaral, Sadasivanagar, Kamareddy, Telangana - 503145";
  const contactPhone = "+91 7989768200";
  const contactEmail = "kb.official.admin@gmail.com";

  return (
    <footer className="bg-black text-neutral-300 border-t border-neutral-800 pt-0 pb-12 mt-16 relative overflow-hidden select-none">
      {/* 1. MOBILE ULTRA-COMPACT MINIMALIST FOOTER (sm:hidden) */}
      <div className="block sm:hidden py-4 px-4 text-center">
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] font-semibold text-neutral-400">
          <Link href="/policies/terms" className="hover:text-white transition-colors">Terms</Link>
          <span className="text-neutral-600">|</span>
          <Link href="/policies/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <span className="text-neutral-600">|</span>
          <Link href="/policies/refunds" className="hover:text-white transition-colors">Refunds</Link>
          <span className="text-neutral-600">|</span>
          <Link href="/policies/shipping" className="hover:text-white transition-colors">Shipping</Link>
          <span className="text-neutral-600">|</span>
          <Link href="/policies/grievance" className="hover:text-white transition-colors">Grievance</Link>
        </div>
        <p className="mt-2 text-[10px] text-neutral-400 font-medium">
          © 2026 KB Fashions. All rights reserved.
        </p>
      </div>

      {/* 2. DESKTOP FULL HERITAGE FOOTER (hidden sm:block) */}
      <div className="hidden sm:block">
        {/* Top Trust & Heritage Strip */}
        <div className="bg-neutral-950 border-b border-neutral-800 py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center font-bold text-white text-xs shrink-0">
                01
              </div>
              <div>
                <div className="font-bold text-white text-xs">Genuine Handlooms</div>
                <div className="text-[11px] text-neutral-400">Pure silk &amp; certified mill cuts</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center font-bold text-white text-xs shrink-0">
                02
              </div>
              <div>
                <div className="font-bold text-white text-xs">10 km Local Village Runner</div>
                <div className="text-[11px] text-neutral-400">Direct delivery under PIN 503145</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center font-bold text-white text-xs shrink-0">
                03
              </div>
              <div>
                <div className="font-bold text-white text-xs">Online Support Desk</div>
                <div className="text-[11px] text-neutral-400">Direct ticket tracking</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center font-bold text-white text-xs shrink-0">
                04
              </div>
              <div>
                <div className="font-bold text-white text-xs">Sec 23 CGST Compliant</div>
                <div className="text-[11px] text-neutral-400">Tax-exempt net retail pricing</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Navigation Columns */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-10 border-b border-neutral-800">
            {/* Column 1: Brand & Village Landmark */}
            <div className="space-y-4 lg:col-span-2">
              <div className="flex items-center gap-3">
                <KBBrandLogoMark className="w-9 h-9" />
                <div>
                  <div className="text-2xl font-black tracking-tight text-white">
                    KB FASHIONS
                  </div>
                  <div className="font-telugu text-xs font-semibold text-neutral-400">
                    కల్వరాల్ గ్రామీణ చేనేత వస్త్ర భాండాగారం
                  </div>
                </div>
              </div>

              <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
                Established 2006 in Kalwaral village, Kamareddy district. Providing authentic Gadwal handloom sarees, unstitched suitings, and essentials within a strict 10 km rural radius.
              </p>

              <div className="space-y-1.5 text-xs text-neutral-400">
                <div>📍 {address}</div>
                <div>📞 Helpline: <strong className="text-white">{contactPhone}</strong> (9 AM – 9 PM)</div>
                <div>
                  ✉️ Email:{' '}
                  <a href={`mailto:${contactEmail}`} className="hover:text-blue-400 font-semibold transition-colors">
                    {contactEmail}
                  </a>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <a
                  href={`https://wa.me/91${contactPhone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 text-neutral-300 border border-neutral-700 text-xs font-medium hover:border-blue-500 hover:text-white transition-all"
                >
                  <span>WhatsApp Helpline</span>
                </a>
                <Link
                  href="/support"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 text-neutral-300 border border-neutral-700 text-xs font-medium hover:border-blue-500 hover:text-white transition-all"
                >
                  <span>Online Support</span>
                </Link>
              </div>
            </div>

            {/* Column 2: Distinct Collections */}
            <div className="text-xs space-y-3">
              <h4 className="font-bold text-white uppercase tracking-widest text-[11px] border-b border-neutral-800 pb-2">
                Collections
              </h4>
              <div className="space-y-2 pt-1 flex flex-col">
                <Link href="/search?category=Sarees" className="text-neutral-400 hover:text-blue-400 transition-colors">Gadwal Handloom Sarees</Link>
                <Link href="/search?category=Men%27s+Unstitched" className="text-neutral-400 hover:text-blue-400 transition-colors">Raymond &amp; Arvind Suitings</Link>
                <Link href="/search?category=Dhotis+%26+Towels" className="text-neutral-400 hover:text-blue-400 transition-colors">Cotton Dhotis &amp; Panchas</Link>
                <Link href="/search?category=Women%27s+Wear" className="text-neutral-400 hover:text-blue-400 transition-colors">Women’s Wear &amp; Blouses</Link>
              </div>
            </div>

            {/* Column 3: Customer Services */}
            <div className="text-xs space-y-3">
              <h4 className="font-bold text-white uppercase tracking-widest text-[11px] border-b border-neutral-800 pb-2">
                Patron Services
              </h4>
              <div className="space-y-2 pt-1 flex flex-col">
                <Link href="/account?tab=tracking" className="text-neutral-400 hover:text-blue-400 transition-colors">Track Consignment Live</Link>
                <Link href="/about" className="text-neutral-400 hover:text-blue-400 transition-colors">20-Year Village Heritage</Link>
                <Link href="/contact" className="text-neutral-400 hover:text-blue-400 transition-colors">Store Contact &amp; Hours</Link>
                <Link href="/ai" className="text-neutral-400 hover:text-blue-400 transition-colors">KB Shopmate AI Preview</Link>
              </div>
            </div>

            {/* Column 4: Statutory Legal Compliance */}
            <div className="text-xs space-y-3">
              <h4 className="font-bold text-white uppercase tracking-widest text-[11px] border-b border-neutral-800 pb-2">
                Statutory Policies
              </h4>
              <div className="space-y-2 pt-1 flex flex-col">
                <Link href="/policies/grievance" className="text-neutral-400 hover:text-blue-400 transition-colors">Grievance Redressal</Link>
                <Link href="/policies/shipping" className="text-neutral-400 hover:text-blue-400 transition-colors">10 km Local Shipping Policy</Link>
                <Link href="/policies/refunds" className="text-neutral-400 hover:text-blue-400 transition-colors">7-Day Cancellation &amp; Returns</Link>
                <Link href="/policies/terms" className="text-neutral-400 hover:text-blue-400 transition-colors">Terms of Sale</Link>
                <Link href="/policies/privacy" className="text-neutral-400 hover:text-blue-400 transition-colors">Privacy Policy</Link>
                <Link href="/policies/statutory-declaration" className="text-neutral-400 hover:text-blue-400 transition-colors">Sec 23 CGST Declaration</Link>
              </div>
            </div>
          </div>

          {/* Copyright & Badges */}
          <div className="pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-400 gap-4">
            <div className="text-center md:text-left text-[11px]">
              © 2006–2026 {officialName}. All rights reserved. Kalwaral Village, Kamareddy, Telangana.
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-bold">
              <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
                UPI / QR
              </span>
              <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
                RuPay / Cards
              </span>
              <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
                Village COD
              </span>
              <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
                10 km Express (503145)
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
