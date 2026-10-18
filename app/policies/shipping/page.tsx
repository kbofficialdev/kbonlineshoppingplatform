import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';

export const metadata = {
  title: 'Shipping & Delivery Policy | KB FASHIONS',
  description: 'Statutory shipping disclosure, 10 km radius local delivery protocol, and village coverage under PIN 503145 for KB FASHIONS, Telangana.',
};

export default function ShippingPolicyPage() {
  const store = db.storeSettings;
  const villageList = (store.deliveryVillages || 'Kalwaral, Sadasivanagar, Dharmaraopet, Tadwai, Padmavajiwadi, Modegaon, Markal, Brahmanpally, Utnoor, Kuprial')
    .split(',')
    .map(v => v.trim())
    .filter(Boolean);

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
            <span className="text-white font-medium">Shipping &amp; Local Delivery</span>
          </div>

          <div className="flex items-start sm:items-center gap-4 pt-2">
            {/* Custom SVG Icon for Shipping (Delivery Logistics Runner / GPS Pin Boundary) */}
            <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center shrink-0 shadow-inner">
              <svg className="w-8 h-8 text-neutral-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>

            <div>
              <div className="inline-block px-3 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase bg-neutral-800 text-neutral-300 border border-neutral-700 mb-1">
                Consumer Protection (E-Commerce) Rules, 2020 • Rule 5(3)(e)
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Shipping &amp; Doorstep Delivery Policy
              </h1>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed pt-1">
            Official logistics declaration for {store.officialName}. Deliveries are strictly operated within a 10 km radius covering villages and habitations under Postal PIN Code 503145.
          </p>

          {/* Minimalist Policy Navigation Strip */}
          <div className="pt-4 flex flex-wrap gap-2 text-xs">
            <Link href="/policies/terms" className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-medium px-3.5 py-1.5 rounded-full border border-neutral-700 transition-colors">
              📜 Terms of Sale
            </Link>
            <Link href="/policies/shipping" className="bg-white text-black font-bold px-3.5 py-1.5 rounded-full shadow-xs">
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
        
        {/* Highlight Callout: Strict 10 KM Local Service Boundary */}
        <div className="border-l-4 border-black bg-white border border-neutral-200/90 rounded-r-2xl p-5 shadow-xs hover-elevate-card space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-black text-neutral-900 text-xs sm:text-sm uppercase tracking-wider">
              Statutory Territorial Disclosure • Rule 5(3)(e)
            </span>
          </div>
          <p className="text-neutral-700 text-xs leading-relaxed">
            In compliance with the Consumer Protection (E-Commerce) Rules, 2020, we formally disclose that <strong>{store.officialName} delivers exclusively within a 10 km radius under Postal PIN Code 503145</strong> originating from our Kalwaral village store. We do not operate pan-India shipping or nationwide parcel transit. Orders outside our 10 km radius are strictly prohibited and cannot be accepted.
          </p>
        </div>

        {/* 1. Fulfillment Origin & Timelines */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-3 hover-elevate-card">
          <h2 className="text-base sm:text-lg font-black text-neutral-900">
            1. Fulfillment Origin &amp; Dispatch SLA
          </h2>
          <p className="text-neutral-700">
            All orders are fulfilled directly from our physical establishment located at:
          </p>
          <div className="bg-neutral-50 rounded-xl p-3.5 border border-neutral-200 font-mono text-xs text-neutral-800">
            {store.address}
          </div>
          <ul className="list-disc pl-5 space-y-1.5 text-neutral-700 pt-1">
            <li><strong>Measurement &amp; Cut Inspection:</strong> Unstitched fabric lengths and sarees are measured, inspected for warp/weft integrity, and packed within <strong>12 to 24 hours</strong> of order verification.</li>
            <li><strong>Doorstep Delivery SLA:</strong> Packages are delivered directly to patron residences within <strong>24 to 48 hours (1 to 2 business days)</strong> via our designated village runner logistics.</li>
          </ul>
        </div>

        {/* 2. Covered Habitations & Village Manifest */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-4 hover-elevate-card">
          <h2 className="text-base sm:text-lg font-black text-neutral-900">
            2. Habitations Covered Under PIN 503145 (10 km Radius)
          </h2>
          <p className="text-neutral-700">
            The following village panchayats and habitations falling within a 10 km road radius of Kalwaral are fully serviced with direct doorstep runner delivery:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
            {villageList.map((village, idx) => (
              <div
                key={idx}
                className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 flex items-center gap-2 text-xs font-semibold text-neutral-800"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 shrink-0"></span>
                <span>{village}</span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-neutral-500 pt-1">
            Patrons selecting delivery to agricultural thandas or fields within 10 km of Kalwaral must provide a landmark description and an active mobile number reachable during dispatch.
          </p>
        </div>

        {/* 3. Tariff Structure & Free Delivery Threshold */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-3 hover-elevate-card">
          <h2 className="text-base sm:text-lg font-black text-neutral-900">
            3. Standard Delivery Tariff Structure
          </h2>
          <p className="text-neutral-700">
            In conformity with transparent e-commerce pricing mandates:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">Orders under ₹{store.freeShippingThreshold || 999}</span>
              <span className="text-xl font-black text-neutral-900">₹{store.flatShippingFee || 70} Flat Local Tariff</span>
              <p className="text-neutral-600 text-xs">Covers packaging materials, tamper-proof security sleeve, and runner transit within 10 km.</p>
            </div>
            <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">Orders of ₹{store.freeShippingThreshold || 999} or Above</span>
              <span className="text-xl font-black text-neutral-900">FREE Doorstep Delivery</span>
              <p className="text-neutral-600 text-xs">Enjoy complimentary delivery across all villages in our 10 km service radius.</p>
            </div>
          </div>
        </div>

        {/* 4. Packaging, Handover & Verification Protocol */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-3 hover-elevate-card">
          <h2 className="text-base sm:text-lg font-black text-neutral-900">
            4. Tamper-Evident Packaging &amp; Handover Protocol
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-neutral-700">
            <li><strong>Dust &amp; Moisture Protection:</strong> All fine sarees, Gadwal silks, and unstitched cuts are packed in sealed moisture-resistant poly-envelopes and secondary eco-friendly kraft packaging.</li>
            <li><strong>Physical Inspection at Doorstep:</strong> Patrons are entitled to inspect the outer packaging condition prior to accepting the consignment from our delivery runner.</li>
            <li><strong>Proof of Delivery:</strong> Delivery completion requires customer signature or matching verification confirmation with the delivery runner.</li>
          </ul>
        </div>

        {/* 5. Inability to Deliver & Automatic Cancellation */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-3 hover-elevate-card">
          <h2 className="text-base sm:text-lg font-black text-neutral-900">
            5. Inability to Deliver &amp; Address Verification
          </h2>
          <p className="text-neutral-700">
            If the customer is unavailable at the provided delivery address after two consecutive runner delivery attempts or phone calls, the consignment will be returned to our Kalwaral store hub. The customer may collect the parcel directly from the store, or request a refund subject to nominal delivery fee adjustment.
          </p>
        </div>

      </div>
    </div>
  );
}
