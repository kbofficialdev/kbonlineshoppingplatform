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
    <div className="space-y-8 pb-16">
      {/* Policy Hero Banner with Gradient Background */}
      <section className="bg-gradient-to-r from-[#170E28] via-[#2D164E] to-[#110721] text-white border-b border-purple-900/40 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-xs text-purple-300 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/policies" className="hover:text-white transition-colors">Policies</Link>
            <span>/</span>
            <span className="text-white font-semibold">Terms &amp; Conditions</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-200 border border-purple-400/30">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            LEGAL AGREEMENT • INDIAN CONTRACT ACT, 1872
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Terms &amp; Conditions of Sale
          </h1>
          <p className="text-sm text-purple-200/80 max-w-2xl leading-relaxed">
            Statutory terms governing patron sales, handloom characteristics, meter cut policies, and legal jurisdiction of {store.officialName}.
          </p>
        </div>
      </section>

      {/* Main Content Card */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-12 shadow-sm space-y-8 text-neutral-800 leading-relaxed text-sm">
          <div className="border-b border-slate-200 pb-4 flex justify-between items-center text-xs text-neutral-500">
            <span>Jurisdiction: District Courts of {store.district || 'Kamareddy'}, {store.state || 'Telangana'}</span>
            <span>Effective: {new Date(store.updatedAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
          </div>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-black">1. Acceptance of Terms</h2>
            <p>
              Welcome to <strong>{store.officialName}</strong> (&quot;KB FASHIONS&quot;). By browsing our catalog, signing into an authenticated account, placing orders, or utilizing our services, you enter into a legally binding contract governed by the Indian Contract Act, 1872, and the Consumer Protection (E-Commerce) Rules, 2020. If you do not agree to these terms, please refrain from using our e-commerce platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-black">2. Authentic Village Origin &amp; Handloom Characteristics</h2>
            <p>
              KB FASHIONS is rooted in {store.village} village, {store.district} District, {store.state}. We specialize in authentic handloom Gadwal sarees, Kuttu zari borders, pure cotton weaves, and mill-fresh unstitched suitings and shirtings.
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
              {store.officialName} is a traditional rural artisan and small retail enterprise in {store.village} operating within the turnover limits exempt from Goods and Services Tax (GST) registration under Section 23 of the Central Goods and Services Tax Act, 2017 / Telangana SGST Act. All listed prices are honest net retail prices; no added GST is charged to consumers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-black">5. Local Delivery Coverage (10 km Radius) &amp; Tariffs</h2>
            <p>
              Direct door-to-door village delivery is offered within a <strong>{store.deliveryRadiusKm || 10} km radius</strong> of our store hub in {store.village} ({store.pinCode}). {store.tariffDescription || 'Standard flat shipping fee of ₹70 applies across all rural deliveries under ₹999. Free delivery for orders above ₹999.'}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-black">6. Dispute Settlement &amp; Grievance Officer</h2>
            <p>
              Any disputes or grievances shall first be submitted to our Nodal Grievance Redressal Officer, <strong>{store.grievanceOfficerName}</strong>, at <a href={`mailto:${store.grievanceOfficerEmail}`} className="text-purple-700 underline font-mono">{store.grievanceOfficerEmail}</a> or phone {store.grievanceOfficerPhone}. In the event of legal proceedings, exclusive jurisdiction lies with the competent civil courts of {store.district || 'Kamareddy'}, {store.state || 'Telangana'}.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
