import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';

export const metadata = {
  title: 'Shipping & Delivery Policy | KB FASHIONS',
  description: 'Doorstep delivery timelines, courier partners, and free shipping thresholds for KB FASHIONS, Kalwaral, Telangana.',
};

export default function ShippingPolicyPage() {
  const store = db.storeSettings;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Breadcrumb */}
      <div className="text-xs text-neutral-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <span className="text-black font-semibold">Shipping &amp; Delivery Policy</span>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-12 shadow-sm space-y-8 text-neutral-800 leading-relaxed text-sm">
        <div className="border-b border-slate-200 pb-6">
          <div className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-sky-50 text-sky-900 border border-sky-200 mb-3">
            LOGISTICS &amp; FULFILLMENT PROTOCOL
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-kb-black">Shipping &amp; Delivery Policy</h1>
          <p className="text-xs text-neutral-500 mt-2">
            Dispatched Daily Directly from Our Heritage Village Store in Kalwaral, Telangana
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-black">1. Shipping Coverage &amp; Delivery Partners</h2>
          <p>
            {store.officialName} delivers to over 19,000 postal PIN codes across India. All orders are carefully inspected, handloom-folded, and packaged in tamper-resistant moisture-proof wrapping at our physical store in Kalwaral village before dispatch via:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-neutral-600">
            <li><strong>Telangana State Postal Express &amp; India Post Speed Post:</strong> Providing reliable access to rural village locations and remote talukas.</li>
            <li><strong>Express Surface Logistics Partners (Delhivery / Bluedart):</strong> For urban centers, metropolitan districts, and rapid deliveries.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-black">2. Delivery Charges &amp; Free Shipping Tier</h2>
          <div className="p-4 rounded-2xl bg-neutral-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="font-bold text-black">Orders of ₹{store.freeShippingThreshold} and Above:</span>
              <span className="text-emerald-700 font-extrabold uppercase">FREE DELIVERY (₹0)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-black">Orders Under ₹{store.freeShippingThreshold}:</span>
              <span className="text-black font-extrabold">Flat ₹{store.flatShippingFee} Shipping Nationwide</span>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-black">3. Estimated Delivery Timelines</h2>
          <ul className="list-disc pl-5 space-y-2 text-xs text-neutral-600">
            <li><strong>Within Telangana &amp; Andhra Pradesh:</strong> Typically delivered within <strong>2 to 4 business days</strong>.</li>
            <li><strong>Rest of India (Metropolitan &amp; Tier 1/2 Cities):</strong> Delivered within <strong>4 to 6 business days</strong>.</li>
            <li><strong>Remote Regions &amp; North East:</strong> Delivered within <strong>6 to 8 business days</strong>.</li>
          </ul>
          <p className="text-xs text-neutral-500">
            <em>Note: Dispatch takes place from Monday to Saturday. Orders placed on Sundays or public holidays are processed on the subsequent working morning.</em>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-black">4. Real-Time Consignment Tracking</h2>
          <p>
            As soon as your package is dispatched, you will receive an SMS and WhatsApp notification containing your official AWB Tracking Number. You can track your consignment at any moment by visiting:
          </p>
          <div className="pt-1">
            <Link
              href="/account?tab=tracking"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-kb-blue text-white text-xs font-bold hover:brightness-110 shadow-sm"
            >
              <span>Go to Live Tracking Portal</span>
              <span>→</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
