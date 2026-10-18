import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';

export const metadata = {
  title: 'Terms & Conditions of Sale | KB FASHIONS',
  description: 'Statutory terms of sale, e-commerce compliance, handloom disclosures, and consumer contract terms for KB FASHIONS under Indian Law.',
};

export default function TermsAndConditionsPage() {
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
            <span className="text-white font-medium">Terms &amp; Conditions</span>
          </div>

          <div className="flex items-start sm:items-center gap-4 pt-2">
            {/* Custom SVG Icon for Terms & Conditions (Scales of Justice & Contract Parchment) */}
            <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center shrink-0 shadow-inner">
              <svg className="w-8 h-8 text-neutral-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>

            <div>
              <div className="inline-block px-3 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase bg-neutral-800 text-neutral-300 border border-neutral-700 mb-1">
                Consumer Protection (E-Commerce) Rules, 2020 • Indian Contract Act, 1872
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Terms &amp; Conditions of Sale
              </h1>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed pt-1">
            Official commercial terms governing electronic commerce sales, patron contracts, meter-cut fabric protocols, and legal liabilities for {store.officialName}.
          </p>

          {/* Minimalist Policy Navigation Strip */}
          <div className="pt-4 flex flex-wrap gap-2 text-xs">
            <Link href="/policies/terms" className="bg-white text-black font-bold px-3.5 py-1.5 rounded-full shadow-xs">
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
            <Link href="/policies/statutory-declaration" className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-medium px-3.5 py-1.5 rounded-full border border-neutral-700 transition-colors">
              🏛️ Sec 23 Tax Exemption
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6 text-xs sm:text-sm leading-relaxed">
        
        {/* Statutory Metadata Bar */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-neutral-600 hover-elevate-card">
          <div>
            <span className="font-bold text-neutral-900 block">Proprietorship Entity:</span>
            <span>{store.officialName} • Kalwaral Village, Sadasivanagar Mandal, Kamareddy District, Telangana 503145</span>
          </div>
          <div className="sm:text-right">
            <span className="font-bold text-neutral-900 block">Territorial Jurisdiction:</span>
            <span>Civil Courts of Kamareddy District, Telangana, India</span>
          </div>
        </div>

        {/* 1. Legal Contract Formation */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-3 hover-elevate-card">
          <h2 className="text-base sm:text-lg font-black text-neutral-900">
            1. Statutory Framework &amp; Legal Capacity
          </h2>
          <p className="text-neutral-700">
            This electronic document is published in compliance with the Information Technology Act, 2000, the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, and Rule 4 of the Consumer Protection (E-Commerce) Rules, 2020.
          </p>
          <p className="text-neutral-700">
            By accessing this platform, registering an account, or placing an order with <strong>{store.officialName}</strong> (&quot;KB FASHIONS&quot;, &quot;we&quot;, &quot;our&quot;), you confirm that you possess the legal capacity to enter into a binding contract under the Indian Contract Act, 1872. If you are accessing this platform on behalf of a family household or enterprise, you represent that you hold full authorization to bind such entity to these commercial terms.
          </p>
        </div>

        {/* 2. Authenticated Patron Sessions & Order Placement */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-3 hover-elevate-card">
          <h2 className="text-base sm:text-lg font-black text-neutral-900">
            2. Customer Account Integrity &amp; Mandatory Verification
          </h2>
          <p className="text-neutral-700">
            To ensure authenticated transactions and prevent unauthorized order placements, customers must register using an authentic telephone number and verifiable email address.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-neutral-700">
            <li><strong>Two-Factor OTP Security:</strong> User registration and checkout order confirmations mandate a 6-digit cryptographic One-Time Password (OTP) dispatched to the registered mobile/email address with a strict 5-minute validity window.</li>
            <li><strong>Session Confidentiality:</strong> Patrons are strictly responsible for preserving the confidentiality of their credentials. Any order placed under verified credentials shall be deemed an authorized commercial commitment.</li>
            <li><strong>Prohibition of Anonymous Bot Orders:</strong> Automated bots, scraping agents, or anonymous checkout scripts are strictly prohibited under Section 43 of the Information Technology Act, 2000.</li>
          </ul>
        </div>

        {/* 3. Handloom Disclosures & Legal Metrology */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-3 hover-elevate-card">
          <h2 className="text-base sm:text-lg font-black text-neutral-900">
            3. Product Characteristics &amp; Handloom Disclosures
          </h2>
          <p className="text-neutral-700">
            In compliance with the Legal Metrology (Packaged Commodities) Rules, 2011, all product listings provide exact fabric composition, country of origin (India), net quantity, standard dimensions, and manufacturer details.
          </p>
          
          {/* Highlight Note */}
          <div className="border-l-4 border-black bg-neutral-100 p-4 rounded-r-xl space-y-1 my-3">
            <span className="font-black text-neutral-900 uppercase text-xs tracking-wider block">
              Artisan Handloom Natural Nuance Notice:
            </span>
            <p className="text-neutral-800 text-xs leading-relaxed">
              Patrons acknowledge that genuine handloom sarees (such as Gadwal handlooms woven on traditional pit-looms) possess natural yarn slubs, minor weft knots, and organic selvedge variations. These are inherent markers of authentic human craftsmanship and do not constitute defective merchandise under consumer law.
            </p>
          </div>

          <p className="text-neutral-700">
            Color Representation: While photographs are captured under standard calibrated 5500K daylight lighting, digital display screens (AMOLED, IPS, Retina) possess varying color profiles. Slight visual variations between screen rendering and physical fabric in ambient daylight do not constitute misrepresentation.
          </p>
        </div>

        {/* 4. Meter Cut Non-Reversibility */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-3 hover-elevate-card">
          <h2 className="text-base sm:text-lg font-black text-neutral-900">
            4. Unstitched Fabric &amp; Custom Meter Cut Conditions
          </h2>
          <p className="text-neutral-700">
            When ordering unstitched suiting, shirting, or matching fabric by linear length (meters):
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-neutral-700">
            <li><strong>Custom Cut Irreversibility:</strong> Once fabric is physically unrolled and cut from the master weaver bolt to your specified measurement, the cut piece cannot be restored to the roll. Consequently, cut meter pieces are non-returnable unless defective at the time of delivery.</li>
            <li><strong>Artisan Selvage Buffer:</strong> To guarantee tailor convenience, KB Fashions includes an additional 3cm to 5cm complimentary buffer beyond the requested length on all cut lengths.</li>
            <li><strong>Shrinkage Allowance:</strong> Natural 100% cotton shirting fabrics require pre-soaking as per industry standards; patrons must account for up to 2-3% natural cotton relaxation before bespoke tailoring.</li>
          </ul>
        </div>

        {/* 5. Pricing, Statutory Invoicing & GST Exemption */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-3 hover-elevate-card">
          <h2 className="text-base sm:text-lg font-black text-neutral-900">
            5. Pricing Transparency &amp; Bill of Supply
          </h2>
          <p className="text-neutral-700">
            Prices displayed on product cards are the net maximum retail prices. There are no hidden processing surcharges.
          </p>
          <p className="text-neutral-700">
            <strong>Section 23 CGST Act Compliance:</strong> {store.officialName} is a rural village micro-enterprise operating within the statutory turnover exemption thresholds under Section 23 of the Central Goods and Services Tax (CGST) Act, 2017 and the Telangana Goods and Services Tax Act, 2017. Accordingly, no GST is levied or collected, and an authentic, statutory <strong>Bill of Supply</strong> is issued with every shipment in lieu of a Tax Invoice.
          </p>
        </div>

        {/* 6. Strict 10 KM Delivery Boundary */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-3 hover-elevate-card">
          <h2 className="text-base sm:text-lg font-black text-neutral-900">
            6. Statutory Service Territory (10 km Radius PIN 503145)
          </h2>
          <p className="text-neutral-700">
            In accordance with Rule 5(3)(e) of the Consumer Protection (E-Commerce) Rules, 2020, we disclose our geographical delivery limitations prior to checkout. Delivery services are exclusively operated within a <strong>10 km radius</strong> of our Kalwaral store hub, covering rural villages under postal PIN <strong>503145</strong> (including Kalwaral, Sadasivanagar, Dharmaraopet, Padmavajiwadi, Modegaon, Kuprial, Utnoor, and surrounding habitations).
          </p>
          <p className="text-neutral-700">
            Orders addressed outside this certified radius are automatically declined prior to dispatch or refunded in full.
          </p>
        </div>

        {/* 7. Payments & Payment Gateway */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-3 hover-elevate-card">
          <h2 className="text-base sm:text-lg font-black text-neutral-900">
            7. Payment Processing &amp; Cashfree Payments Security
          </h2>
          <p className="text-neutral-700">
            Online transactions are processed via Cashfree Payments India Pvt. Ltd., an authorized Payment Aggregator under the Reserve Bank of India (RBI) Payment and Settlement Systems Act, 2007.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-neutral-700">
            <li>KB Fashions does not store or process debit/credit card CVV or netbanking passwords on local servers. All transmissions are encrypted using 256-bit TLS/SSL encryption directly with Cashfree gateway infrastructure.</li>
            <li>In the event of a disputed transaction, payment reconciliation is governed by RBI settlement guidelines and verified via cryptographic webhook signatures.</li>
          </ul>
        </div>

        {/* 8. Governing Law & Legal Jurisdiction */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-3 hover-elevate-card">
          <h2 className="text-base sm:text-lg font-black text-neutral-900">
            8. Governing Law, Dispute Resolution &amp; Jurisdiction
          </h2>
          <p className="text-neutral-700">
            These commercial terms and any contracts formed hereunder shall be interpreted strictly in accordance with the substantive laws of the Republic of India.
          </p>
          <p className="text-neutral-700">
            Any unresolved claims, disputes, or proceedings arising out of transactions with {store.officialName} shall be subject to the exclusive jurisdiction of the competent civil courts situated in <strong>Kamareddy District, Telangana, India</strong>.
          </p>
        </div>

      </div>
    </div>
  );
}
