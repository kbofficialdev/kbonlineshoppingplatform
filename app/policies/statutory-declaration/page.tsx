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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Breadcrumb */}
      <div className="text-xs text-neutral-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <span className="text-black font-semibold">Statutory GST Exemption Declaration</span>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-12 shadow-sm space-y-8 text-neutral-800 leading-relaxed text-sm">
        <div className="border-b border-slate-200 pb-6">
          <div className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200 mb-3">
            SECTION 23 OF CGST ACT, 2017 • OFFICIAL BUSINESS DECLARATION
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-kb-black">Statutory Tax Exemption &amp; Retail Bill of Supply Declaration</h1>
          <p className="text-xs text-neutral-500 mt-2">
            Village Micro-Enterprise Exemption Notice under Goods and Services Tax (GST) Laws of India
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-black">1. Statutory Exemption Declaration</h2>
          <p>
            This public declaration certifies that <strong>{store.officialName}</strong> (Brand: {store.brandName}), established in Kalwaral village, Sadasivanagar Mandal, Kamareddy District, Telangana, operates as an ancestral village occupation enterprise engaged in the retail distribution of authentic handloom sarees, unstitched fabrics, and traditional textiles.
          </p>
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 font-medium leading-relaxed">
            <strong>Statutory Exemption Notice:</strong> Under Section 23 of the Central Goods and Services Tax (CGST) Act, 2017, and the corresponding provisions of the Telangana State Goods and Services Tax (TGST) Act, persons engaged exclusively in supplies not liable to tax, or whose aggregate annual turnover is below the statutory mandatory registration threshold for rural retail goods, are explicitly exempted from obtaining GSTIN registration.
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-black">2. Retail Bill of Supply Documentation</h2>
          <p>
            In accordance with Rule 49 of the CGST Rules, non-taxable small enterprises issue an official <strong>Retail Bill of Supply</strong> (Cash Memo) in lieu of a standard Tax Invoice.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-neutral-600">
            <li><strong>Zero GST Charged:</strong> No Central GST (CGST), State GST (SGST), or Integrated GST (IGST) is collected or billed to customers.</li>
            <li><strong>Pure Value:</strong> Prices reflect pure artisan and wholesale mill rates, ensuring that village and urban patrons pay honest prices free of inflated bureaucratic surcharges.</li>
            <li><strong>Official Invoice Generation:</strong> Every confirmed transaction produces a downloadable, numbered statutory Bill of Supply containing store coordinates, consignment breakdown, and payment details.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-black">3. Enterprise Identity &amp; Physical Verification</h2>
          <div className="bg-neutral-50 border border-slate-200 rounded-2xl p-5 text-xs space-y-2">
            <div><strong>Commercial Entity:</strong> {store.officialName}</div>
            <div><strong>Ancestral History:</strong> {store.historySince}</div>
            <div><strong>Physical Village Store:</strong> {store.address}</div>
            <div><strong>Direct Contact:</strong> {store.contactPhone} | {store.contactEmail}</div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-black">4. Payment Gateway &amp; Commercial Banking Compliance</h2>
          <p>
            This declaration confirms to RBI-regulated payment aggregators, commercial banks, and regulatory bodies that {store.officialName} legitimately operates within the statutory boundaries of Indian tax legislation, delivering genuine handloom merchandise directly from artisan weavers to households across India.
          </p>
        </section>
      </div>
    </div>
  );
}

