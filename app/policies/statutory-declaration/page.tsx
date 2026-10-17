import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';

export default function StatutoryDeclarationPage() {
  const store = db.storeSettings;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          Statutory Compliance Disclosure • Tax Exemption Certificate
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-kb-black tracking-tight">
          Statutory Declaration &amp; Small Business Exemption
        </h1>
        <p className="text-xs text-neutral-500 font-mono">
          Official Declaration under Section 23 of the Central Goods &amp; Services Tax (CGST) Act, 2017
        </p>
      </div>

      {/* Body Content */}
      <div className="prose prose-sm max-w-none text-neutral-700 space-y-6 text-xs sm:text-sm leading-relaxed">
        {/* Official Certificate Card */}
        <div className="bg-gradient-to-br from-white via-slate-50 to-amber-50/20 border-2 border-slate-300 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 relative">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Enterprise Profile</span>
              <h2 className="text-xl font-black text-black">{store.officialName}</h2>
              <span className="text-xs font-mono text-neutral-500">Brand: {store.brandName} FASHIONS</span>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300">
                ✓ GST EXEMPTED
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">Nature of Business</span>
              <span className="font-semibold text-black">
                Traditional Rural Artisan &amp; Textile Occupation Retail Enterprise
              </span>
            </div>

            <div>
              <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">Operational Vintage</span>
              <span className="font-semibold text-black">
                Over 20 Years of Generational Ancestral Heritage (Since 2006)
              </span>
            </div>

            <div className="sm:col-span-2">
              <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">Registered Shop Location</span>
              <span className="font-mono text-neutral-800 leading-relaxed font-semibold">
                {store.address}
              </span>
            </div>

            <div>
              <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">Statutory Invoicing Mode</span>
              <span className="font-semibold text-black">
                Retail "Bill of Supply" (Cash Memo) under Section 31(3)(c) of CGST Act
              </span>
            </div>

            <div>
              <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">Applicable Exemption Provision</span>
              <span className="font-semibold text-emerald-700 font-mono">
                Section 23 of CGST Act, 2017 &amp; Telangana SGST Act
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-neutral-600 leading-relaxed space-y-2">
            <div className="font-bold text-black">Solemn Business Affirmation:</div>
            <p>
              “We hereby declare and affirm that <strong>{store.officialName}</strong> is a traditional family-run rural retail enterprise operating in Kalwaral village, Kamareddy district, Telangana. We are not registered under the GST Act as our aggregate annual turnover is below the mandatory registration threshold prescribed under the Goods and Services Tax laws. We do not collect any Goods and Services Tax from our buyers, nor do we claim input tax credit. All transactions are supported by our statutory retail Bill of Supply.”
            </p>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-kb-black">Legal Significance for Patrons &amp; Payment Partners</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-neutral-600 text-xs sm:text-sm">
            <li><strong>Zero GST Charged:</strong> No 5%, 12%, or 18% GST surcharges are levied on any saree or unstitched fabric. The price you see is the final price.</li>
            <li><strong>Legally Valid Purchase Bill:</strong> Your purchase is accompanied by an official retail Bill of Supply bearing serial numbers, customer details, and Kalwaral village shop address.</li>
            <li><strong>Payment Gateway Compliance:</strong> This declaration satisfies RBI and Payment Aggregator merchant on-boarding requirements for unincorporated sole-proprietor/family artisan businesses in rural India.</li>
          </ul>
        </section>
      </div>

      <div className="pt-6 border-t border-slate-200 flex justify-between items-center text-xs">
        <Link href="/policies/grievance" className="text-neutral-600 hover:text-black font-semibold">
          ← Grievance Redressal Policy
        </Link>
        <Link href="/about" className="text-kb-blue hover:underline font-bold">
          Read Our 20-Year Kalwaral Heritage Story →
        </Link>
      </div>
    </div>
  );
}
