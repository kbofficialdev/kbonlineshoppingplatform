import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';

export const metadata = {
  title: 'Statutory GST Exemption Declaration | KB FASHIONS',
  description: 'Official tax declaration under Section 23 of Central Goods and Services Tax Act for KB FASHIONS, Kalwaral village.',
};

export default function StatutoryDeclarationPage() {
  const store = db.storeSettings;

  return (
    <div className="space-y-8 pb-20 bg-[#FAF9F6] min-h-screen">
      {/* Policy Hero Banner with Warm Bronze-Amber Gradient */}
      <section className="bg-gradient-to-r from-[#201504] via-[#3B2508] to-[#170E02] text-white border-b border-amber-900/50 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="text-xs text-amber-300 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/policies/terms" className="hover:text-white transition-colors">Policies</Link>
            <span>/</span>
            <span className="text-white font-semibold">Statutory Tax Declaration</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-200 border border-amber-400/30">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>SECTION 23 OF CGST ACT, 2017 • RETAIL BILL OF SUPPLY PROTOCOL</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Statutory Tax Exemption &amp; Retail Bill of Supply
          </h1>
          <p className="text-sm text-amber-100/90 max-w-3xl leading-relaxed">
            Official business tax disclosure, rural artisan enterprise status, and Rule 49 Retail Bill of Supply protocols of {store.officialName}.
          </p>

          {/* Quick Policy Navigation Strip */}
          <div className="pt-3 flex flex-wrap gap-2 text-xs">
            <Link href="/policies/shipping" className="bg-white/10 hover:bg-white/20 text-white font-medium px-3 py-1.5 rounded-full border border-white/15 transition-colors">
              🚚 Shipping &amp; 10 km
            </Link>
            <Link href="/policies/refunds" className="bg-white/10 hover:bg-white/20 text-white font-medium px-3 py-1.5 rounded-full border border-white/15 transition-colors">
              ↩️ 7-Day Returns
            </Link>
            <Link href="/policies/grievance" className="bg-white/10 hover:bg-white/20 text-white font-medium px-3 py-1.5 rounded-full border border-white/15 transition-colors">
              ⚖️ Grievance Officer
            </Link>
            <Link href="/policies/terms" className="bg-white/10 hover:bg-white/20 text-white font-medium px-3 py-1.5 rounded-full border border-white/15 transition-colors">
              📜 Terms of Sale
            </Link>
            <Link href="/policies/privacy" className="bg-white/10 hover:bg-white/20 text-white font-medium px-3 py-1.5 rounded-full border border-white/15 transition-colors">
              🛡️ Privacy Policy
            </Link>
            <Link href="/policies/statutory-declaration" className="bg-white text-black font-bold px-3 py-1.5 rounded-full shadow-sm">
              🏛️ Sec 23 Tax Exemption
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Entity Card with Government Reference */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
          <div>
            <span className="font-bold text-neutral-900 block">Registered Rural Enterprise:</span>
            <span className="text-neutral-500">{store.officialName} (Brand: {store.brandName})</span>
          </div>
          <div className="text-neutral-500 sm:text-right">
            <span>Location: </span>
            <strong className="text-black">{store.village}, {store.district}, {store.state} ({store.pinCode})</strong>
          </div>
        </div>

        {/* 1. Official Exemption Notice (Emerald & Gold) */}
        <div className="bg-emerald-50/80 border-2 border-emerald-300 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 text-emerald-950">
          <div className="flex items-center gap-3 border-b border-emerald-200 pb-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-200 text-emerald-900 flex items-center justify-center font-black text-xl shadow-xs">
              📜
            </div>
            <div>
              <h2 className="text-base font-black text-emerald-950">1. Statutory Tax Exemption under Section 23 CGST Act</h2>
              <p className="text-xs text-emerald-800">Direct artisan value without intermediate Goods and Services Tax levies</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
            This public declaration certifies that <strong>{store.officialName}</strong> (Brand: {store.brandName}), established in {store.village} village, {store.mandal} Mandal, {store.district} District, {store.state}, operates as an ancestral village occupation enterprise engaged in the retail distribution of authentic handloom sarees, unstitched fabrics, and traditional textiles.
          </p>

          <div className="bg-white p-5 rounded-2xl border border-emerald-200 text-xs text-emerald-950 leading-relaxed shadow-xs">
            <strong>Statutory Exemption Clause:</strong> Under Section 23 of the Central Goods and Services Tax (CGST) Act, 2017, and the corresponding provisions of the Telangana State Goods and Services Tax (TGST) Act, persons engaged exclusively in supplies not liable to tax, or whose aggregate annual turnover is below the statutory mandatory registration threshold for rural retail goods, are explicitly exempted from obtaining GSTIN registration.
          </div>
        </div>

        {/* 2. Retail Bill of Supply Notice (Rule 49 CGST Rules) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg">
              🧾
            </div>
            <div>
              <h2 className="text-base font-black text-neutral-900">2. Retail Bill of Supply Documentation (Rule 49)</h2>
              <p className="text-xs text-neutral-500">Official commercial invoice provided with all dispatches</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
            In compliance with Rule 49 of the CGST Rules, 2017, every retail sale by {store.officialName} is documented via a formal <strong>Bill of Supply</strong> rather than a Tax Invoice. Each Bill of Supply contains:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-1">
              <span className="font-bold text-neutral-900 block">✓ Consecutive Invoice Serial Number</span>
              <span className="text-neutral-500">Unique identifier (e.g. INV-2026-XXXXX) generated per order.</span>
            </div>
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-1">
              <span className="font-bold text-neutral-900 block">✓ Exact Garment / Cut Metric Breakdown</span>
              <span className="text-neutral-500">Fabric length in meters, saree weave description, and unit price.</span>
            </div>
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-1">
              <span className="font-bold text-neutral-900 block">✓ Physical Store Geolocation &amp; Help Desk</span>
              <span className="text-neutral-500">{store.address} with verified telephone contact.</span>
            </div>
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-1">
              <span className="font-bold text-neutral-900 block">✓ Statutory Tax Exemption Declaration</span>
              <span className="text-neutral-500">Formal endorsement as a non-taxable rural small business.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
