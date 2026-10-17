import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';

export default function Footer() {
  const store = db.storeSettings;

  return (
    <footer className="bg-black text-neutral-300 border-t border-neutral-800 pt-0 pb-12 mt-16 relative overflow-hidden">
      
      {/* ========================================================= */}
      {/* 1. TOP TRUST & ARTISAN HERITAGE STRIP (Clean Monochrome)   */}
      {/* ========================================================= */}
      <div className="bg-neutral-950 border-b border-neutral-800 py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-lg shrink-0 text-white">
              🧵
            </div>
            <div>
              <div className="font-bold text-white text-xs">100% Genuine Weaves</div>
              <div className="text-[11px] text-neutral-400">Pure silk &amp; branded mill cuts</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-lg shrink-0 text-white">
              🚚
            </div>
            <div>
              <div className="font-bold text-white text-xs">10 km Local Village Delivery</div>
              <div className="text-[11px] text-neutral-400">Doorstep runner (PIN 503145)</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-lg shrink-0 text-white">
              🎫
            </div>
            <div>
              <div className="font-bold text-white text-xs">Online Support Desk</div>
              <div className="text-[11px] text-neutral-400">Streamlined 24h ticket resolution</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-lg shrink-0 text-white">
              🏛️
            </div>
            <div>
              <div className="font-bold text-white text-xs">Sec 23 CGST Compliant</div>
              <div className="text-[11px] text-neutral-400">GST-exempt direct village value</div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. MAIN FOOTER NAVIGATION GRID (Black & White, Blue on Hover) */}
      {/* ========================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-neutral-800">
          
          {/* Column 1: Brand & Village Identity */}
          <div className="space-y-4 lg:col-span-2">
            <div className="space-y-1">
              <div className="text-3xl font-black tracking-tight text-white flex items-baseline gap-1">
                <span>{store.brandName}.</span>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  FASHIONS
                </span>
              </div>
              <div className="font-telugu text-sm font-semibold text-neutral-300">
                కల్వరాల్ గ్రామీణ చేనేత వస్త్ర భాండాగారం
              </div>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Rooted in Kalwaral village for over two decades (2006–2026). Delivering genuine Gadwal handloom sarees, unstitched Raymond suiting fabrics, and rural cotton essentials strictly within a 10 km radius under PIN 503145.
            </p>

            <div className="space-y-2 text-xs pt-1">
              <div className="flex items-start gap-2 text-neutral-400">
                <span className="text-neutral-300">📍</span>
                <span>{store.address}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-400">
                <span className="text-neutral-300">📞</span>
                <span>Helpline: <strong className="text-white">{store.contactPhone}</strong> (9 AM – 9 PM)</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-400">
                <span className="text-neutral-300">✉️</span>
                <a href={`mailto:${store.contactEmail}`} className="hover:text-blue-500 hover:font-bold transition-all">
                  {store.contactEmail}
                </a>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href={`https://wa.me/91${(store.contactPhone || '').replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-900 text-neutral-300 border border-neutral-700 text-[11px] font-medium hover:border-blue-500 hover:text-blue-500 hover:font-bold transition-all"
              >
                <span>💬</span>
                <span>WhatsApp Helpline</span>
              </a>
              <Link
                href="/support"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-900 text-neutral-300 border border-neutral-700 text-[11px] font-medium hover:border-blue-500 hover:text-blue-500 hover:font-bold transition-all"
              >
                <span>🎫</span>
                <span>Online Support Desk</span>
              </Link>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div className="text-xs space-y-3">
            <h4 className="font-bold text-white uppercase tracking-widest text-[11px] border-b border-neutral-800 pb-2 inline-block">
              Textile Collections
            </h4>
            <div className="space-y-2 pt-1 flex flex-col">
              <Link href="/search?category=Sarees" className="text-neutral-400 hover:text-blue-500 hover:font-bold transition-all">Gadwal Handloom Sarees</Link>
              <Link href="/search?category=Sarees" className="text-neutral-400 hover:text-blue-500 hover:font-bold transition-all">Pure Silk Pattu &amp; Nirma</Link>
              <Link href="/search?category=Men%27s+Unstitched" className="text-neutral-400 hover:text-blue-500 hover:font-bold transition-all">Raymond Suiting &amp; Shirting</Link>
              <Link href="/search?category=Men%27s+Unstitched" className="text-neutral-400 hover:text-blue-500 hover:font-bold transition-all">Arvind Pure Linen Cuts</Link>
              <Link href="/search?category=Dhoti+%26+Towels" className="text-neutral-400 hover:text-blue-500 hover:font-bold transition-all">Traditional Cotton Panchas</Link>
              <Link href="/search?category=Women" className="text-neutral-400 hover:text-blue-500 hover:font-bold transition-all">Matching 2×2 Rubia Blouses</Link>
            </div>
          </div>

          {/* Column 3: Patron Services */}
          <div className="text-xs space-y-3">
            <h4 className="font-bold text-white uppercase tracking-widest text-[11px] border-b border-neutral-800 pb-2 inline-block">
              Patron Care &amp; Support
            </h4>
            <div className="space-y-2 pt-1 flex flex-col">
              <Link href="/support" className="text-neutral-400 hover:text-blue-500 hover:font-bold transition-all">Online Support Desk</Link>
              <Link href="/account?tab=tracking" className="text-neutral-400 hover:text-blue-500 hover:font-bold transition-all">Track Consignment Live</Link>
              <Link href="/about" className="text-neutral-400 hover:text-blue-500 hover:font-bold transition-all">20-Year Kalwaral Heritage</Link>
              <Link href="/policies/shipping" className="text-neutral-400 hover:text-blue-500 hover:font-bold transition-all">10 km Local Delivery Hub</Link>
              <Link href="/contact" className="text-neutral-400 hover:text-blue-500 hover:font-bold transition-all">Help Desk &amp; Inquiries</Link>
              <Link href="/ai" className="text-neutral-400 hover:text-blue-500 hover:font-bold transition-all">KB Shopmate AI Preview</Link>
            </div>
          </div>

          {/* Column 4: Statutory Legal Compliance */}
          <div className="text-xs space-y-3">
            <h4 className="font-bold text-white uppercase tracking-widest text-[11px] border-b border-neutral-800 pb-2 inline-block">
              Statutory Compliance
            </h4>
            <div className="space-y-2 pt-1 flex flex-col">
              <Link href="/policies/grievance" className="text-neutral-400 hover:text-blue-500 hover:font-bold transition-all">Grievance Redressal (Rules 2020)</Link>
              <Link href="/policies/shipping" className="text-neutral-400 hover:text-blue-500 hover:font-bold transition-all">Shipping &amp; 10 km Radius Policy</Link>
              <Link href="/policies/refunds" className="text-neutral-400 hover:text-blue-500 hover:font-bold transition-all">7-Day Refund &amp; Return Policy</Link>
              <Link href="/policies/terms" className="text-neutral-400 hover:text-blue-500 hover:font-bold transition-all">Terms of Sale &amp; Conditions</Link>
              <Link href="/policies/privacy" className="text-neutral-400 hover:text-blue-500 hover:font-bold transition-all">Privacy Policy</Link>
              <Link href="/policies/statutory-declaration" className="text-neutral-400 hover:text-blue-500 hover:font-bold transition-all">Sec 23 CGST Exemption Notice</Link>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. PAYMENT BADGES & BOTTOM COPYRIGHT (Strictly B&W, No Names) */}
        {/* ========================================================= */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-400 gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div>
              © 2006–2026 {store.officialName}. All rights reserved. Kalwaral Village, Kamareddy, Telangana, India.
            </div>
            <div className="text-[11px] text-neutral-400">
              Grievance Redressal: <strong className="text-white">{store.officialName}</strong> — {store.grievanceOfficerDesignation || 'Designated Grievance Redressal Officer'} (<a href={`mailto:${store.contactEmail}`} className="text-white hover:text-blue-500 hover:font-bold transition-all">{store.contactEmail}</a>) (Rule 5(9) Consumer Protection E-Commerce Rules 2020).
            </div>
          </div>

          {/* Payment & Logistics Badges (Clean Black & White) */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-bold">
            <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-700 text-neutral-200">
              ⚡ UPI / QR
            </span>
            <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-700 text-neutral-200">
              🇮🇳 RuPay
            </span>
            <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-700 text-neutral-200">
              💳 Visa / Mastercard
            </span>
            <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-700 text-neutral-200">
              💵 Village COD
            </span>
            <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-700 text-neutral-200">
              📍 10 km Local Delivery (PIN 503145)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
