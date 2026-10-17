import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';

export const metadata = {
  title: 'Terms & Conditions | KB FASHIONS',
  description: 'Statutory terms of sale and platform usage for KB FASHIONS, Kalwaral village, Telangana.',
};

export default function TermsAndConditionsPage() {
  const store = db.storeSettings;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Breadcrumb */}
      <div className="text-xs text-neutral-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <span className="text-black font-semibold">Terms &amp; Conditions</span>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-12 shadow-sm space-y-8 text-neutral-800 leading-relaxed text-sm">
        <div className="border-b border-slate-200 pb-6">
          <div className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200 mb-3">
            LEGAL AGREEMENT • INDIAN CONTRACT ACT, 1872
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-kb-black">Terms &amp; Conditions of Sale</h1>
          <p className="text-xs text-neutral-500 mt-2">
            Effective Date: October 2026 • Governing Law: Jurisdiction of Kamareddy, Telangana
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-black">1. Acceptance of Terms</h2>
          <p>
            Welcome to {store.officialName} (&quot;KB FASHIONS&quot;). By browsing our catalog, signing into an authenticated account, placing orders, or utilizing our services, you enter into a legally binding contract governed by the Indian Contract Act, 1872, and the Consumer Protection (E-Commerce) Rules, 2020. If you do not agree to these terms, please refrain from using our e-commerce platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-black">2. Authentic Village Origin &amp; Handloom Characteristics</h2>
          <p>
            KB FASHIONS is rooted in Kalwaral village, Kamareddy District, Telangana. We specialize in authentic handloom Gadwal sarees, Kuttu zari borders, pure cotton weaves, and mill-fresh unstitched suitings and shirtings.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-neutral-600">
            <li><strong>Handloom Weave Distinctiveness:</strong> Handwoven garments may possess slight organic variations in weave tension, slubs, or zari interlock. These represent hallmarks of genuine manual loom craftsmanship and are not considered manufacturing defects.</li>
            <li><strong>Color Reproduction:</strong> While we endeavor to photograph textiles with true natural fidelity, minute color shade nuances may vary depending on monitor calibrations and ambient display lighting.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-black">3. Unstitched Fabrics &amp; Meter Measurement Standards</h2>
          <p>
            For men&apos;s unstitched shirting and suiting fabrics (such as Raymond and Arvind bolts), fabrics are precision-cut by the meter from continuous rolls according to your bespoke order selection (e.g. 1.6m, 2.25m, 3.0m). Standard textile industry cutting tolerance of ±1.5 cm is acknowledged and applied.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-black">4. Pricing &amp; GST Exemption Declaration</h2>
          <p>
            All prices listed on the platform are in Indian Rupees (INR) and represent honest village artisan pricing without middleman markups. {store.officialName} operates as a rural micro-enterprise exempted from mandatory GST registration under Section 23 of the Central Goods and Services Tax (CGST) Act, 2017. Transactions are issued under statutory retail &quot;Bill of Supply&quot; documents without tax charges.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-black">5. Account Responsibilities &amp; Abuse Prevention</h2>
          <p>
            Customers are responsible for maintaining the confidentiality of their sign-in credentials. Automated 10-minute security freezes are enforced on accounts that trigger multiple consecutive authentication failures to guard against brute force interference.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-black">6. Dispute Resolution &amp; Jurisdiction</h2>
          <p>
            Any disputes arising under these terms shall first be submitted to our Grievance Redressal Desk for amicable settlement within 30 days. Unresolved claims shall fall under the exclusive jurisdiction of the competent courts in Kamareddy, Telangana, India.
          </p>
        </section>
      </div>
    </div>
  );
}
