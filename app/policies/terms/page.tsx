import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';

export const metadata = {
  title: 'Terms & Conditions of Sale | KB FASHIONS',
  description: 'Statutory terms of sale and platform usage for KB FASHIONS, Kalwaral village, Telangana.',
};

export default function TermsAndConditionsPage() {
  const store = db.storeSettings;

  return (
    <div className="space-y-8 pb-20 bg-[#FAF9F6] min-h-screen">
      {/* Policy Hero Banner with Slate-Purple Gradient */}
      <section className="bg-gradient-to-r from-[#170E28] via-[#2D164E] to-[#110721] text-white border-b border-purple-900/50 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="text-xs text-purple-300 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/policies/terms" className="hover:text-white transition-colors">Policies</Link>
            <span>/</span>
            <span className="text-white font-semibold">Terms &amp; Conditions</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-200 border border-purple-400/30">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            <span>LEGAL CONTRACT • INDIAN CONTRACT ACT, 1872 &amp; E-COMMERCE RULES 2020</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Terms &amp; Conditions of Sale
          </h1>
          <p className="text-sm text-purple-100/90 max-w-3xl leading-relaxed">
            Statutory terms governing patron sales, handloom characteristics, meter cut policies, and legal jurisdiction of {store.officialName}.
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
            <Link href="/policies/terms" className="bg-white text-black font-bold px-3 py-1.5 rounded-full shadow-sm">
              📜 Terms of Sale
            </Link>
            <Link href="/policies/privacy" className="bg-white/10 hover:bg-white/20 text-white font-medium px-3 py-1.5 rounded-full border border-white/15 transition-colors">
              🛡️ Privacy Policy
            </Link>
            <Link href="/policies/statutory-declaration" className="bg-white/10 hover:bg-white/20 text-white font-medium px-3 py-1.5 rounded-full border border-white/15 transition-colors">
              🏛️ Sec 23 Tax Exemption
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Jurisdiction & Effective Date Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
          <div>
            <span className="font-bold text-neutral-900 block">Legal Jurisdiction:</span>
            <span className="text-neutral-500">Courts of {store.district || 'Kamareddy'}, {store.state || 'Telangana'}, India</span>
          </div>
          <div className="text-neutral-500 sm:text-right">
            <span>Last Statutory Review: </span>
            <strong className="text-black">{new Date(store.updatedAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</strong>
          </div>
        </div>

        {/* 1. Acceptance of Terms (Blue Accent) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-lg">
              📜
            </div>
            <div>
              <h2 className="text-base font-black text-neutral-900">1. Acceptance of Terms &amp; Authentic Account Mandate</h2>
              <p className="text-xs text-neutral-500">Binding legal purchase agreement under Indian Contract Act, 1872</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
            Welcome to <strong>{store.officialName}</strong> (&quot;KB FASHIONS&quot;). By browsing our catalog, signing into an authenticated account, placing orders, or utilizing our services, you enter into a legally binding contract governed by the Indian Contract Act, 1872, and the Consumer Protection (E-Commerce) Rules, 2020. Anonymous sessions cannot place orders; multi-factor customer sessions with valid 5-minute confirmation OTP are strictly required.
          </p>
        </div>

        {/* 2. Authentic Village Origin & Handloom Characteristics (Amber Accent) */}
        <div className="bg-amber-50/70 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 text-amber-950">
          <div className="flex items-center gap-3 border-b border-amber-200 pb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-lg">
              🧵
            </div>
            <div>
              <h2 className="text-base font-black text-amber-900">2. Authentic Village Origin &amp; Handloom Characteristics</h2>
              <p className="text-xs text-amber-800">Natural artisan textures of pure pit-loom weaving</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
            KB FASHIONS is rooted in {store.village} village, {store.district} District, {store.state}. We specialize in authentic handloom Gadwal sarees, Kuttu zari borders, pure cotton weaves, and mill-fresh unstitched suitings and shirtings.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div className="bg-white p-3.5 rounded-2xl border border-amber-200">
              <strong className="text-black block mb-1">Handloom Weft &amp; Slubs:</strong>
              <span className="text-neutral-600">Minor slubs, uneven thread spacing, or subtle temple border nuances are authentic signs of genuine handloom weaving, not manufacturing defects.</span>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-amber-200">
              <strong className="text-black block mb-1">Color Fidelity:</strong>
              <span className="text-neutral-600">Natural vegetable dyes and pure silk reflections may vary slightly under varied home lighting compared to high-resolution studio photographs.</span>
            </div>
          </div>
        </div>

        {/* 3. Pricing, GST Exemption & Precision Meter Cuts (Emerald Accent) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
              💰
            </div>
            <div>
              <h2 className="text-base font-black text-neutral-900">3. Pricing, Section 23 CGST Exemption &amp; Cut Allowance</h2>
              <p className="text-xs text-neutral-500">Transparent pricing without hidden GST additions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 space-y-1">
              <div className="font-bold text-emerald-950">✓ Zero Hidden Taxes</div>
              <div className="text-neutral-600">Prices listed are final. As a registered rural small enterprise under Section 23 of the CGST Act, no GST is collected.</div>
            </div>

            <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200 space-y-1">
              <div className="font-bold text-blue-950">✂ 5cm Complimentary Selvage</div>
              <div className="text-neutral-600">All unstitched suiting/shirting orders receive a 5cm complimentary artisan buffer beyond the requested meter length.</div>
            </div>

            <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-200 space-y-1">
              <div className="font-bold text-purple-950">📜 Statutory Bill of Supply</div>
              <div className="text-neutral-600">Every consignment is accompanied by an authenticated Bill of Supply invoice as required by commercial law.</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
