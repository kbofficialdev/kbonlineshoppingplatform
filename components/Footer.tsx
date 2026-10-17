import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';

export default function Footer() {
  const store = db.storeSettings;

  return (
    <footer className="bg-gradient-to-b from-[#0B0F19] via-[#090D17] to-[#04060A] text-neutral-300 border-t border-amber-500/20 pt-0 pb-12 mt-20 relative overflow-hidden">
      
      {/* ========================================================= */}
      {/* 1. TOP TRUST & ARTISAN HERITAGE STRIP                     */}
      {/* ========================================================= */}
      <div className="bg-gradient-to-r from-amber-950/40 via-neutral-900 to-indigo-950/40 border-b border-white/10 py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-lg shrink-0">
              🧵
            </div>
            <div>
              <div className="font-black text-white text-xs">100% Genuine Weaves</div>
              <div className="text-[11px] text-neutral-400">Pure silk &amp; branded mill cuts</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-lg shrink-0">
              🚚
            </div>
            <div>
              <div className="font-black text-white text-xs">10 km Local Village Hub</div>
              <div className="text-[11px] text-neutral-400">Free doorstep express (PIN 503145)</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-lg shrink-0">
              🎫
            </div>
            <div>
              <div className="font-black text-white text-xs">Online Support Desk</div>
              <div className="text-[11px] text-neutral-400">Streamlined 24h ticket resolution</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-400/30 flex items-center justify-center text-lg shrink-0">
              🏛️
            </div>
            <div>
              <div className="font-black text-white text-xs">Sec 23 CGST Compliant</div>
              <div className="text-[11px] text-neutral-400">GST-exempt direct village value</div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. MAIN FOOTER NAVIGATION GRID                            */}
      {/* ========================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-neutral-800">
          
          {/* Column 1: Brand & Village Identity */}
          <div className="space-y-4 lg:col-span-2">
            <div className="space-y-1">
              <div className="text-3xl font-black tracking-tight text-white flex items-baseline gap-1">
                <span>{store.brandName}.</span>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                  FASHIONS
                </span>
              </div>
              <div className="font-telugu text-sm font-semibold text-amber-200/90">
                కల్వరాల్ గ్రామీణ చేనేత వస్త్ర భాండాగారం
              </div>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Rooted in Kalwaral village for over two decades (2006–2026). Offering genuine Gadwal handloom sarees, unstitched Raymond suiting fabrics, and rural cotton essentials with complete transparency.
            </p>

            <div className="space-y-2 text-xs pt-1">
              <div className="flex items-start gap-2 text-neutral-400">
                <span className="text-amber-400">📍</span>
                <span>{store.address}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-400">
                <span className="text-emerald-400">📞</span>
                <span>Helpline: <strong className="text-white">{store.contactPhone}</strong> (9 AM – 9 PM)</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-400">
                <span className="text-sky-400">✉️</span>
                <span>{store.contactEmail}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href={`https://wa.me/91${(store.contactPhone || '').replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold hover:bg-emerald-600/30 transition-colors"
              >
                <span>💬</span>
                <span>WhatsApp Assistant</span>
              </a>
              <Link
                href="/support"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-600/20 text-blue-300 border border-blue-500/40 text-[11px] font-bold hover:bg-blue-600/30 transition-colors"
              >
                <span>🎫</span>
                <span>Raise Support Ticket</span>
              </Link>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div className="text-xs space-y-3">
            <h4 className="font-black text-amber-400 uppercase tracking-widest text-[11px] border-b border-amber-500/20 pb-2 inline-block">
              Textile Collections
            </h4>
            <div className="space-y-2 pt-1">
              <div><Link href="/search?category=Sarees" className="text-neutral-400 hover:text-white transition-colors">Gadwal Handloom Sarees</Link></div>
              <div><Link href="/search?category=Sarees" className="text-neutral-400 hover:text-white transition-colors">Pure Silk Pattu &amp; Nirma</Link></div>
              <div><Link href="/search?category=Men%27s+Unstitched" className="text-neutral-400 hover:text-white transition-colors">Raymond Suiting &amp; Shirting</Link></div>
              <div><Link href="/search?category=Men%27s+Unstitched" className="text-neutral-400 hover:text-white transition-colors">Arvind Pure Linen Cuts</Link></div>
              <div><Link href="/search?category=Dhoti+%26+Towels" className="text-neutral-400 hover:text-white transition-colors">Traditional Cotton Panchas</Link></div>
              <div><Link href="/search?category=Women" className="text-neutral-400 hover:text-white transition-colors">Matching 2×2 Rubia Blouses</Link></div>
            </div>
          </div>

          {/* Column 3: Patron Services & Support Desk */}
          <div className="text-xs space-y-3">
            <h4 className="font-black text-amber-400 uppercase tracking-widest text-[11px] border-b border-amber-500/20 pb-2 inline-block">
              Patron Care &amp; Support
            </h4>
            <div className="space-y-2 pt-1">
              <div>
                <Link href="/support" className="text-sky-300 font-bold hover:underline flex items-center gap-1.5">
                  <span>🎫</span>
                  <span>Online Support Desk (SLA)</span>
                </Link>
              </div>
              <div><Link href="/account?tab=tracking" className="text-neutral-400 hover:text-white transition-colors">Track Consignment Live</Link></div>
              <div><Link href="/about" className="text-neutral-400 hover:text-white transition-colors">20-Year Kalwaral Heritage</Link></div>
              <div><Link href="/policies/shipping" className="text-neutral-400 hover:text-white transition-colors">10 km Local Village Hub</Link></div>
              <div><Link href="/contact" className="text-neutral-400 hover:text-white transition-colors">Help Desk &amp; Inquiries</Link></div>
              <div><Link href="/ai" className="text-neutral-400 hover:text-white transition-colors">KB Shopmate AI Preview</Link></div>
            </div>
          </div>

          {/* Column 4: Statutory Legal Compliance */}
          <div className="text-xs space-y-3">
            <h4 className="font-black text-amber-400 uppercase tracking-widest text-[11px] border-b border-amber-500/20 pb-2 inline-block">
              Statutory Compliance
            </h4>
            <div className="space-y-2 pt-1">
              <div><Link href="/policies/grievance" className="text-neutral-400 hover:text-white transition-colors">Grievance Officer (Rules 2020)</Link></div>
              <div><Link href="/policies/shipping" className="text-neutral-400 hover:text-white transition-colors">Shipping &amp; Local Radius Policy</Link></div>
              <div><Link href="/policies/refunds" className="text-neutral-400 hover:text-white transition-colors">7-Day Refund &amp; Return Policy</Link></div>
              <div><Link href="/policies/terms" className="text-neutral-400 hover:text-white transition-colors">Terms of Sale &amp; Conditions</Link></div>
              <div><Link href="/policies/privacy" className="text-neutral-400 hover:text-white transition-colors">Privacy Policy</Link></div>
              <div><Link href="/policies/statutory-declaration" className="text-neutral-400 hover:text-white transition-colors">Sec 23 CGST Exemption Notice</Link></div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. PAYMENT BADGES & BOTTOM COPYRIGHT                      */}
        {/* ========================================================= */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-400 gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div>
              © 2006–2026 {store.officialName}. All rights reserved. Kalwaral Village, Kamareddy, Telangana, India.
            </div>
            <div className="text-[11px] text-neutral-500">
              Grievance Officer: Sri K. Balaram (Rule 5(9) Consumer Protection E-Commerce Rules 2020).
            </div>
          </div>

          {/* Payment & Logistics Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-bold">
            <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-700 text-neutral-300">
              ⚡ UPI / QR
            </span>
            <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-700 text-neutral-300">
              🇮🇳 RuPay
            </span>
            <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-700 text-neutral-300">
              💳 Visa / Mastercard
            </span>
            <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-700 text-neutral-300">
              💵 Village COD
            </span>
            <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-700 text-amber-300">
              📮 India Post Speed Post
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
