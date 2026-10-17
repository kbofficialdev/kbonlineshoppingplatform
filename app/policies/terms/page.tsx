import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';

export default function TermsAndConditionsPage() {
  const store = db.storeSettings;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-kb-blue text-xs font-bold uppercase tracking-wider">
          Legal Agreement • Consumer Protection (E-Commerce) Rules 2020
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-kb-black tracking-tight">
          Terms &amp; Conditions
        </h1>
        <p className="text-xs text-neutral-500 font-mono">
          Effective Date: October 2026 • Governing Terms of {store.officialName}
        </p>
      </div>

      {/* Body Content */}
      <div className="prose prose-sm max-w-none text-neutral-700 space-y-6 text-xs sm:text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-kb-black">1. General Overview &amp; Acceptance</h2>
          <p>
            These Terms and Conditions (“Terms”) constitute a binding legal agreement between you (“Customer,” “User”) and <strong>{store.officialName}</strong>, having its registered business premises at <strong>{store.address}</strong>. By accessing our platform, registering an account, or placing an order, you agree to be bound by these Terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-kb-black">2. Small Business &amp; GST Exemption Notice</h2>
          <p>
            <strong>{store.officialName}</strong> is a traditional rural textile occupation enterprise rooted in Kalwaral village for over 20 years. As per <strong>Section 23 of the Central Goods and Services Tax (CGST) Act, 2017</strong> and corresponding State GST laws, our annual aggregate turnover does not exceed the statutory threshold requiring registration. Consequently:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-neutral-600">
            <li>No Goods and Services Tax (GST) is charged on customer purchases.</li>
            <li>All sales are documented via an authentic retail <strong>“Bill of Supply”</strong> (Cash Memo) bearing our official business address and invoice number.</li>
            <li>Displayed prices represent the final net purchase price without unexpected tax additions at checkout.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-kb-black">3. Product Specifications &amp; Unstitched Fabric Cuts</h2>
          <p>
            We take pride in offering genuine handlooms, Gadwal cotton-silk weaves, and Raymond/Arvind unstitched suiting and shirting:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-neutral-600">
            <li><strong>Handloom Characteristics:</strong> Natural slight variations in hand-spun cotton thread, dye hues, and traditional zari pleats are authentic markers of artisan craftsmanship, not manufacturing flaws.</li>
            <li><strong>Unstitched Fabric Cuts:</strong> Fabrics ordered by the meter (e.g. 2.25m for shirtings) are measured using calibrated steel yardsticks. A tolerance of ±1 cm is standard industry practice.</li>
            <li><strong>Cut Fabric Non-Returnability:</strong> Once a bolt of fabric is cut to your custom requested meter length, it cannot be restocked or returned unless verified as damaged upon arrival.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-kb-black">4. Account Responsibilities &amp; Strict Session Guard</h2>
          <p>
            To protect your order history and prevent unauthorized bookings, all shopping cart and checkout services strictly require a verified customer account. You are responsible for maintaining the confidentiality of your sign-in credentials.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-kb-black">5. Pricing &amp; Payment Gateway Settlement</h2>
          <p>
            All prices are denominated in Indian Rupees (INR ₹). Payment can be completed through Cash on Delivery (COD) or instant digital settlement (UPI, Debit/Credit Card) via our authorized payment gateway partners. In the event of network disruption during payment, settlements will be reconciled within 24 hours.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-kb-black">6. Governing Law &amp; Jurisdiction</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising out of transactions on this platform shall be subject to the exclusive jurisdiction of the competent courts in <strong>Kamareddy District, Telangana, India</strong>.
          </p>
        </section>
      </div>

      <div className="pt-6 border-t border-slate-200 flex justify-between items-center text-xs">
        <Link href="/policies/privacy" className="text-neutral-600 hover:text-black font-semibold">
          ← Privacy Policy
        </Link>
        <Link href="/policies/refunds" className="text-kb-blue hover:underline font-bold">
          Refund &amp; Return Policy →
        </Link>
      </div>
    </div>
  );
}
