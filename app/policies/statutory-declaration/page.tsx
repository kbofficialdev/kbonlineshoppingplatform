import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';

export const metadata = {
  title: 'Statutory Tax Exemption & Bill of Supply | KB FASHIONS',
  description: 'Official tax declaration under Section 23 of the CGST Act 2017 and Rule 49 Bill of Supply compliance for KB FASHIONS, Kalwaral, Telangana.',
};

export default function StatutoryDeclarationPage() {
  const store = db.storeSettings;

  return (
    <div className="bg-[#f8f9fa] min-h-screen text-neutral-900 pb-20">
      {/* Sleek Pure Black Hero Banner with Custom Handcrafted SVG Icon */}
      <section className="bg-black text-white border-b border-neutral-800 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-xs text-neutral-400 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/policies/terms" className="hover:text-white transition-colors">Policies</Link>
            <span>/</span>
            <span className="text-white font-medium">Statutory Tax Declaration</span>
          </div>

          <div className="flex items-start sm:items-center gap-4 pt-2">
            {/* Custom SVG Icon for Statutory Tax Declaration (Official Pillar / Legal Seal) */}
            <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center shrink-0 shadow-inner">
              <svg className="w-8 h-8 text-neutral-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>

            <div>
              <div className="inline-block px-3 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase bg-neutral-800 text-neutral-300 border border-neutral-700 mb-1">
                Section 23 CGST Act 2017 • Rule 49 CGST Rules 2017
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Statutory Tax Exemption &amp; Bill of Supply
              </h1>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed pt-1">
            Official public disclosure regarding rural artisan micro-enterprise status, statutory Goods and Services Tax threshold exemptions, and authentic Bill of Supply issuance for {store.officialName}.
          </p>

          {/* Minimalist Policy Navigation Strip */}
          <div className="pt-4 flex flex-wrap gap-2 text-xs">
            <Link href="/policies/terms" className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-medium px-3.5 py-1.5 rounded-full border border-neutral-700 transition-colors">
              📜 Terms of Sale
            </Link>
            <Link href="/policies/shipping" className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-medium px-3.5 py-1.5 rounded-full border border-neutral-700 transition-colors">
              🚚 Shipping &amp; 10 km Radius
            </Link>
            <Link href="/policies/refunds" className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-medium px-3.5 py-1.5 rounded-full border border-neutral-700 transition-colors">
              ↩️ 7-Day Returns
            </Link>
            <Link href="/policies/privacy" className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-medium px-3.5 py-1.5 rounded-full border border-neutral-700 transition-colors">
              🛡️ Privacy &amp; Data Security
            </Link>
            <Link href="/policies/grievance" className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-medium px-3.5 py-1.5 rounded-full border border-neutral-700 transition-colors">
              ⚖️ Grievance Redressal
            </Link>
            <Link href="/policies/statutory-declaration" className="bg-white text-black font-bold px-3.5 py-1.5 rounded-full shadow-xs">
              🏛️ Sec 23 Tax Exemption
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6 text-xs sm:text-sm leading-relaxed">
        
        {/* Statutory Enterprise Card */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-neutral-600 hover-elevate-card">
          <div>
            <span className="font-bold text-neutral-900 block text-sm">Enterprise Identification:</span>
            <span>{store.officialName} (Brand: {store.brandName}) • Ancestral Village Weaving &amp; Retail Occupation</span>
          </div>
          <div className="sm:text-right">
            <span className="font-bold text-neutral-900 block text-sm">Physical Operating Center:</span>
            <span>Kalwaral Village, Kamareddy District, Telangana, 503145</span>
          </div>
        </div>

        {/* 1. Section 23 CGST Exemption Notice */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-3 hover-elevate-card">
          <h2 className="text-base sm:text-lg font-black text-neutral-900">
            1. Statutory Exemption under Section 23 of the CGST Act, 2017
          </h2>
          <p className="text-neutral-700">
            This public declaration certifies that <strong>{store.officialName}</strong> operates as an ancestral cottage occupation and retail establishment rooted in Kalwaral village, Kamareddy District, Telangana.
          </p>
          
          <div className="border-l-4 border-black bg-neutral-100 p-4 rounded-r-xl space-y-1 my-2">
            <span className="font-black text-neutral-900 uppercase text-xs tracking-wider block">
              Section 23(1)(a) Statutory Exemption Clause:
            </span>
            <p className="text-neutral-800 text-xs leading-relaxed">
              Under Section 23(1)(a) of the Central Goods and Services Tax (CGST) Act, 2017 and corresponding provisions of the Telangana Goods and Services Tax Act, 2017, persons exclusively engaged in retail supplies where aggregate annual turnover does not exceed the statutory threshold limit for goods within the State are not liable to obtain mandatory GST registration.
            </p>
          </div>

          <p className="text-neutral-700">
            Accordingly, all consumer prices listed across our platform are direct net retail prices with zero GST surcharges added at checkout.
          </p>
        </div>

        {/* 2. Rule 49 Bill of Supply Issuance */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-3 hover-elevate-card">
          <h2 className="text-base sm:text-lg font-black text-neutral-900">
            2. Retail Bill of Supply Protocol (Rule 49 CGST Rules)
          </h2>
          <p className="text-neutral-700">
            In compliance with Rule 49 of the Central Goods and Services Tax Rules, 2017:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-neutral-700">
            <li>An authentic, sequentially numbered <strong>Bill of Supply</strong> is generated for every order.</li>
            <li>Each Bill of Supply clearly states the supplier name, registered Kalwaral address, unique serial invoice number, customer delivery destination, description of handloom textiles, linear meter lengths, and total consideration paid.</li>
            <li>Patrons can download or print their verified Bill of Supply at any time from their order status page or invoice link (<span className="font-mono text-neutral-900">/invoices/[orderId]</span>).</li>
          </ul>
        </div>

        {/* 3. Artisan Empowerment & Consumer Value */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-3 hover-elevate-card">
          <h2 className="text-base sm:text-lg font-black text-neutral-900">
            3. Rural Artisan Empowerment &amp; Honest Direct Pricing
          </h2>
          <p className="text-neutral-700">
            By operating directly from our village center without intermediary urban markups or complex tax cascading, {store.officialName} delivers maximum value to patrons while directly preserving ancestral pit-loom weaving traditions in Telangana.
          </p>
          <p className="text-neutral-700">
            For statutory verification inquiries or government audit requests, contact our managing administration at <a href={`mailto:${store.contactEmail}`} className="text-black font-bold underline">{store.contactEmail}</a>.
          </p>
        </div>

      </div>
    </div>
  );
}
