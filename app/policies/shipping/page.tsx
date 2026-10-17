import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';

export const metadata = {
  title: 'Shipping & Delivery Policy | KB FASHIONS',
  description: 'Doorstep delivery timelines, courier partners, and local village delivery guidelines for KB FASHIONS, Kalwaral, Telangana.',
};

export default function ShippingPolicyPage() {
  const store = db.storeSettings;
  const villageList = (store.deliveryVillages || 'Kalwaral, Sadasivanagar, Dharmaraopet, Tadwai, Padmavajiwadi, Modegaon, Markal, Brahmanpally, Utnoor, Kuprial')
    .split(',')
    .map(v => v.trim())
    .filter(Boolean);

  return (
    <div className="space-y-8 pb-20 bg-[#FAF9F6] min-h-screen">
      {/* Policy Hero Banner with Vibrant Indigo-Cyan Gradient */}
      <section className="bg-gradient-to-r from-[#0A1931] via-[#103E75] to-[#0A2647] text-white border-b border-blue-900/50 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="text-xs text-blue-300 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/policies/terms" className="hover:text-white transition-colors">Policies</Link>
            <span>/</span>
            <span className="text-white font-semibold">Shipping &amp; Local Radius Delivery</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-sky-200 border border-sky-400/30">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
            <span>HYPERLOCAL VILLAGE LOGISTICS PROTOCOL • {store.deliveryRadiusKm || 10} KM RADIUS (PIN {store.deliveryPincode || '503145'})</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Shipping &amp; Doorstep Delivery Policy
          </h1>
          <p className="text-sm text-sky-100/90 max-w-3xl leading-relaxed">
            Direct dispatches from our ancestral weaver center at {store.village}, {store.district}, {store.state}. Combining local doorstep village deliveries with India Post Speed Post nationwide connectivity.
          </p>

          {/* Quick Policy Navigation Strip */}
          <div className="pt-3 flex flex-wrap gap-2 text-xs">
            <Link href="/policies/shipping" className="bg-white text-black font-bold px-3 py-1.5 rounded-full shadow-sm">
              🚚 Shipping &amp; 10 km
            </Link>
            <Link href="/policies/refunds" className="bg-white/10 hover:bg-white/20 text-white font-medium px-3 py-1.5 rounded-full border border-white/15 transition-colors">
              ↩️ 7-Day Returns
            </Link>
            <Link href="/policies/grievance" className="bg-white/10 hover:bg-white/20 text-white font-medium px-3 py-1.5 rounded-full border border-white/15 transition-colors">
              ⚖️ Grievance Officer
            </Link>
            <Link href="/policies/terms" className="bg-white/10 hover:bg-white/20 text-white font-medium px-3 py-1.5 rounded-full border border-white/15 transition-colors">
              📜 Terms of Sale
            </Link>
            <Link href="/policies/privacy" className="bg-white/10 hover:bg-white/20 text-white font-medium px-3 py-1.5 rounded-full border border-white/15 transition-colors">
              🛡️ Privacy Policy
            </Link>
            <Link href="/policies/statutory-declaration" className="bg-white/10 hover:bg-white/20 text-white font-medium px-3 py-1.5 rounded-full border border-white/15 transition-colors">
              🏛️ Sec 23 Tax Exemption
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* STATUTORY MANDATORY ALERT (Amber/Gold Card) */}
        <div className="p-6 rounded-3xl bg-amber-50 border-2 border-amber-300/80 text-amber-950 shadow-sm space-y-2">
          <div className="font-black flex items-center gap-2 text-amber-900 text-sm">
            <span className="text-lg">📍</span>
            <span>MANDATORY STATUTORY LOCAL COVERAGE: {store.deliveryRadiusKm || 10} KM RADIUS UNDER PIN {store.deliveryPincode || '503145'}</span>
          </div>
          <p className="text-xs leading-relaxed text-amber-900/90">
            Direct hyper-local doorstep delivery is operated within a <strong>{store.deliveryRadiusKm || 10} km radius</strong> for habitations and villages falling under <strong>Postal PIN Code {store.deliveryPincode || '503145'}</strong> ({store.village}, {store.mandal} mandal, {store.district} district, {store.state}).
          </p>
        </div>

        {/* 1. Local Village Delivery Section (Emerald Accents) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
              🏡
            </div>
            <div>
              <h2 className="text-base font-black text-neutral-900">1. Local Village Doorstep Delivery ({store.deliveryRadiusKm || 10} km Radius)</h2>
              <p className="text-xs text-neutral-500">Free, direct rural courier runner from Kalwaral main store</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
            {store.officialName} operates direct daily fulfillment from our ancestral store at <strong>{store.address}</strong>. Patrons residing in our local network receive expedited delivery within 24 hours of cut measurement.
          </p>

          <div className="border border-emerald-200 rounded-2xl p-5 bg-emerald-50/40 text-xs space-y-3">
            <div className="font-bold text-emerald-950 text-xs uppercase tracking-wide flex items-center gap-2">
              <span>🌾</span>
              <span>Covered Habitations &amp; Villages Within {store.deliveryRadiusKm || 10} km of {store.village} (PIN {store.deliveryPincode || '503145'}):</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-neutral-800">
              {villageList.map((village, idx) => (
                <div key={idx} className="flex items-center gap-1.5 font-semibold bg-white px-2.5 py-1.5 rounded-xl border border-emerald-200/60 shadow-xs">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{village}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Structured Comparison Table (Blue & Neutral) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-lg">
              📊
            </div>
            <div>
              <h2 className="text-base font-black text-neutral-900">2. Delivery Methods, Timelines &amp; Postal Tariffs</h2>
              <p className="text-xs text-neutral-500">Transparent rates with free shipping for orders above ₹{store.freeShippingThreshold || 999}</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 text-xs">
            <table className="w-full text-left divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-700 font-bold">
                <tr>
                  <th className="p-3.5">Delivery Channel</th>
                  <th className="p-3.5">Eligible Region</th>
                  <th className="p-3.5">Estimated SLA</th>
                  <th className="p-3.5">Shipping Tariff</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-neutral-800">
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-bold flex items-center gap-1.5">
                    <span className="text-emerald-600">●</span> Local Village Runner
                  </td>
                  <td className="p-3.5">Within 10 km of Kalwaral (PIN 503145)</td>
                  <td className="p-3.5 font-semibold text-emerald-700">Same Day / 24 Hours</td>
                  <td className="p-3.5 font-bold text-emerald-700">FREE for all local patrons</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-bold flex items-center gap-1.5">
                    <span className="text-blue-600">●</span> India Post Speed Post
                  </td>
                  <td className="p-3.5">Telangana &amp; Rest of India</td>
                  <td className="p-3.5">2 to 5 Business Days</td>
                  <td className="p-3.5">
                    ₹{store.flatShippingFee || 70} flat (FREE on orders &gt; ₹{store.freeShippingThreshold || 999})
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-bold flex items-center gap-1.5">
                    <span className="text-purple-600">●</span> Express Courier
                  </td>
                  <td className="p-3.5">Hyderabad, Bangalore, Mumbai, Metro Hubs</td>
                  <td className="p-3.5">24 to 48 Hours</td>
                  <td className="p-3.5 font-semibold">Standard Surface / Air Tariff</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Consignment Tracking & Packaging (Violet & Slate) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="text-xs font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>📦</span>
              <span>Artisan Packaging Protocol</span>
            </div>
            <h3 className="text-sm font-bold text-neutral-900">Dust-Proof Cotton &amp; Moisture Protection</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Every handloom Gadwal saree is sealed in breathable, non-woven cotton covers to preserve pure zari luster. Raymond suiting cuts are wrapped in archival water-resistant sleeves to prevent fiber crushing.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="text-xs font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>🔎</span>
              <span>Online Tracking &amp; Inquiries</span>
            </div>
            <h3 className="text-sm font-bold text-neutral-900">Real-Time Consignment Updates</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Consignment dispatch alerts are sent immediately via SMS and email. You can also track your live order stage directly on our portal or raise a ticket on the Support Desk.
            </p>
            <div>
              <Link href="/support" className="text-xs font-bold text-blue-700 underline hover:text-blue-900">
                Raise an online delivery inquiry ticket →
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
