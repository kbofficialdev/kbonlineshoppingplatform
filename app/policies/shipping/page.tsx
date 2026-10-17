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

        <section className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs space-y-1.5">
            <div className="font-extrabold flex items-center gap-1.5 text-amber-900">
              <span>📍</span>
              <span>MANDATORY STATUTORY DELIVERY COVERAGE: 10 KM RADIUS UNDER PIN 503145</span>
            </div>
            <p>
              Direct hyper-local doorstep delivery is strictly operated within a <strong>10 km radius</strong> for habitations and villages falling under <strong>Postal PIN Code 503145</strong> (Kalwaral, Sadasivanagar mandal, Kamareddy district, Telangana).
            </p>
          </div>

          <h2 className="text-base font-bold text-black">1. Hyper-Local 10 km Delivery Zone (PIN 503145)</h2>
          <p>
            {store.officialName} dispatches directly from our ancestral retail store at <strong>3-55/1, Kalwaral Village, Sadasivanagar Mandal, Kamareddy, Telangana 503145</strong>. Customers residing within 10 km under PIN 503145 enjoy same-day or 24-hour local delivery via our dedicated store runners.
          </p>

          <div className="border border-slate-200 rounded-2xl p-4 bg-neutral-50 text-xs space-y-2">
            <div className="font-bold text-neutral-900">Eligible Habitations &amp; Villages Within 10 km of Kalwaral (PIN 503145):</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-neutral-700">
              <div className="flex items-center gap-1.5 font-medium">✓ Kalwaral (Store Hub • 0 km)</div>
              <div className="flex items-center gap-1.5 font-medium">✓ Sadasivanagar (4 km)</div>
              <div className="flex items-center gap-1.5 font-medium">✓ Padmavajiwadi (3.5 km)</div>
              <div className="flex items-center gap-1.5 font-medium">✓ Dharmaraopet (5 km)</div>
              <div className="flex items-center gap-1.5 font-medium">✓ Modegaon (6 km)</div>
              <div className="flex items-center gap-1.5 font-medium">✓ Utnoor &amp; Kuprial (7 km)</div>
              <div className="flex items-center gap-1.5 font-medium">✓ Thippapur (8 km)</div>
              <div className="flex items-center gap-1.5 font-medium">✓ Markovillage / Thanda (8.5 km)</div>
              <div className="flex items-center gap-1.5 font-medium">✓ Jukkalwadi &amp; Adloor (9.5 km)</div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-black">2. Delivery Charges &amp; Free Shipping Tier</h2>
          <div className="p-4 rounded-2xl bg-neutral-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="font-bold text-black">Orders of ₹{store.freeShippingThreshold} and Above (Within 10 km):</span>
              <span className="text-emerald-700 font-extrabold uppercase">FREE DELIVERY (₹0)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-black">Orders Under ₹{store.freeShippingThreshold}:</span>
              <span className="text-black font-extrabold">Flat ₹{store.flatShippingFee} Delivery Fee</span>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-black">3. Delivery Timelines &amp; Outside 10 km Dispatch</h2>
          <ul className="list-disc pl-5 space-y-2 text-xs text-neutral-600">
            <li><strong>Inside 10 km Radius (PIN 503145):</strong> Delivered within <strong>24 to 48 hours</strong> directly from our Kalwaral store counter.</li>
            <li><strong>Beyond 10 km Radius / Other PIN Codes:</strong> Dispatched via <strong>India Post Speed Post</strong> with standard parcel transit (3 to 5 business days).</li>
          </ul>
          <p className="text-xs text-neutral-500">
            <em>Note: Dispatch operates Monday to Saturday. Store pickup at Kalwaral counter is always available with 0 waiting time.</em>
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

