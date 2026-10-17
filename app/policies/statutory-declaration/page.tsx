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
    <div className="space-y-8 pb-16">
      {/* Policy Hero Banner with Gradient Background */}
      <section className="bg-gradient-to-r from-[#1A1104] via-[#332007] to-[#120B02] text-white border-b border-amber-900/40 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-xs text-amber-300 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/policies" className="hover:text-white transition-colors">Policies</Link>
            <span>/</span>
            <span className="text-white font-semibold">Statutory Tax Declaration</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-200 border border-amber-400/30">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            SECTION 23 OF CGST ACT, 2017 • RETAIL BILL OF SUPPLY NOTICE
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Statutory Tax Exemption &amp; Retail Bill of Supply
          </h1>
          <p className="text-sm text-amber-200/80 max-w-2xl leading-relaxed">
            Official business tax disclosure, rural artisan enterprise status, and Rule 49 Retail Bill of Supply protocols of {store.officialName}.
          </p>
        </div>
      </section>

      {/* Main Content Card */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-12 shadow-sm space-y-8 text-neutral-800 leading-relaxed text-sm">
          <div className="border-b border-slate-200 pb-4 flex justify-between items-center text-xs text-neutral-500">
            <span>Entity: {store.officialName}</span>
            <span>Location: {store.village}, {store.district}, {store.state} ({store.pinCode})</span>
          </div>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-black">1. Statutory Exemption Declaration</h2>
            <p>
              This public declaration certifies that <strong>{store.officialName}</strong> (Brand: {store.brandName}), established in {store.village} village, {store.mandal} Mandal, {store.district} District, {store.state}, operates as an ancestral village occupation enterprise engaged in the retail distribution of authentic handloom sarees, unstitched fabrics, and traditional textiles.
            </p>
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-950 font-medium leading-relaxed">
              <strong>Statutory Exemption Notice:</strong> Under Section 23 of the Central Goods and Services Tax (CGST) Act, 2017, and the corresponding provisions of the Telangana State Goods and Services Tax (TGST) Act, persons engaged exclusively in supplies not liable to tax, or whose aggregate annual turnover is below the statutory mandatory registration threshold for rural retail goods, are explicitly exempted from obtaining GSTIN registration.
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-black">2. Retail Bill of Supply Documentation</h2>
            <p>
              In accordance with Rule 49 of the CGST Rules, non-taxable small enterprises issue an official <strong>Retail Bill of Supply</strong> (Cash Memo) in lieu of a standard Tax Invoice.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-neutral-600">
              <li><strong>Zero GST Charged:</strong> No Central GST (CGST), State GST (SGST), or Integrated GST (IGST) is collected or billed to customers.</li>
              <li><strong>Honest Artisan Value:</strong> Prices reflect pure weaver, artisan, and wholesale mill rates, ensuring that village and urban patrons pay honest prices free of inflated bureaucratic surcharges.</li>
              <li><strong>Official Bill of Supply Generation:</strong> Every confirmed transaction produces an authentic, downloadable, numbered statutory Bill of Supply containing store coordinates, consignment breakdown, and payment details.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-black">3. Enterprise Identity &amp; Physical Verification</h2>
            <div className="bg-neutral-50 border border-slate-200 rounded-2xl p-5 text-xs space-y-2.5">
              <div><strong className="text-black">Commercial Entity:</strong> {store.officialName}</div>
              <div><strong className="text-black">Ancestral History:</strong> {store.historySince}</div>
              <div><strong className="text-black">Physical Village Store:</strong> {store.address}</div>
              <div><strong className="text-black">Customer Care Desk:</strong> {store.contactPhone}</div>
              <div><strong className="text-black">Official Inquiries:</strong> <a href={`mailto:${store.contactEmail}`} className="text-amber-800 underline font-mono">{store.contactEmail}</a></div>
              <div><strong className="text-black">Grievance Redressal Officer:</strong> {store.grievanceOfficerName} ({store.grievanceOfficerDesignation})</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
