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
    <div className="space-y-8 pb-16">
      {/* Policy Hero Banner with Gradient Background */}
      <section className="bg-gradient-to-r from-[#091C36] via-[#0F3260] to-[#071426] text-white border-b border-blue-900/40 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-xs text-blue-300 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/policies" className="hover:text-white transition-colors">Policies</Link>
            <span>/</span>
            <span className="text-white font-semibold">Shipping &amp; Delivery</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-200 border border-blue-400/30">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            LOGISTICS PROTOCOL • {store.deliveryRadiusKm || 10} KM RADIUS UNDER PIN {store.deliveryPincode || '503145'}
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Shipping &amp; Delivery Policy
          </h1>
          <p className="text-sm text-blue-200/80 max-w-2xl leading-relaxed">
            Direct daily dispatches from our heritage village store at {store.village}, {store.district}, {store.state}.
          </p>
        </div>
      </section>

      {/* Main Content Card */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-12 shadow-sm space-y-8 text-neutral-800 leading-relaxed text-sm">
          {/* Statutory Coverage Alert */}
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs space-y-2">
            <div className="font-extrabold flex items-center gap-2 text-amber-900 text-sm">
              <span>📍</span>
              <span>MANDATORY STATUTORY LOCAL COVERAGE: {store.deliveryRadiusKm || 10} KM RADIUS UNDER PIN {store.deliveryPincode || '503145'}</span>
            </div>
            <p className="leading-relaxed">
              Direct hyper-local doorstep delivery is operated within a <strong>{store.deliveryRadiusKm || 10} km radius</strong> for habitations and villages falling under <strong>Postal PIN Code {store.deliveryPincode || '503145'}</strong> ({store.village}, {store.mandal} mandal, {store.district} district, {store.state}).
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-base font-bold text-black">1. Local Village Delivery Zone (PIN {store.deliveryPincode || '503145'})</h2>
            <p>
              {store.officialName} dispatches directly from our ancestral retail store at <strong>{store.address}</strong>. Customers residing within {store.deliveryRadiusKm || 10} km under PIN {store.deliveryPincode || '503145'} enjoy expedited 24-hour local delivery via our dedicated store runners.
            </p>

            <div className="border border-slate-200 rounded-2xl p-5 bg-neutral-50 text-xs space-y-3">
              <div className="font-bold text-neutral-900 text-sm">
                Eligible Habitations &amp; Villages Within {store.deliveryRadiusKm || 10} km of {store.village} (PIN {store.deliveryPincode || '503145'}):
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-neutral-700">
                {villageList.map((village, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 font-medium">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{village}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-black">2. All-India Shipping via India Post Speed Post</h2>
            <p>
              For patrons across Telangana, Andhra Pradesh, Karnataka, Maharashtra, and nationwide, we partner exclusively with <strong>India Post Speed Post</strong> and registered express couriers.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
              <div className="p-4 rounded-2xl bg-neutral-50 border border-slate-200 space-y-1">
                <div className="font-bold text-black text-sm">Local Villages (PIN {store.deliveryPincode})</div>
                <div className="text-emerald-700 font-bold">Same Day / 24 Hours</div>
                <p className="text-neutral-500 text-[11px]">Direct rural runner delivery</p>
              </div>
              <div className="p-4 rounded-2xl bg-neutral-50 border border-slate-200 space-y-1">
                <div className="font-bold text-black text-sm">Telangana &amp; Hyderabad</div>
                <div className="text-blue-700 font-bold">1–2 Business Days</div>
                <p className="text-neutral-500 text-[11px]">Direct state dispatch</p>
              </div>
              <div className="p-4 rounded-2xl bg-neutral-50 border border-slate-200 space-y-1">
                <div className="font-bold text-black text-sm">Rest of India</div>
                <div className="text-neutral-900 font-bold">3–5 Business Days</div>
                <p className="text-neutral-500 text-[11px]">India Post Speed Post with live tracking</p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-black">3. Shipping Tariffs &amp; Free Delivery Threshold</h2>
            <div className="bg-neutral-50 p-5 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="font-semibold text-black">{store.tariffDescription || 'Standard flat shipping fee of ₹70 applies across all rural deliveries under ₹999. Free delivery for orders above ₹999.'}</div>
              <div className="flex gap-4 pt-1">
                <div><strong className="text-black">Standard Fee:</strong> ₹{store.flatShippingFee || 70}</div>
                <div><strong className="text-black">Free Shipping Minimum:</strong> ₹{store.freeShippingThreshold || 999}</div>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-black">4. Stage-by-Stage Tracking &amp; Notifications</h2>
            <p>
              Every order placed on our store is updated live with stage-by-stage consignment milestones (Order Placed, Confirmed &amp; Packed, Dispatched, Out for Delivery, Delivered). Email updates are dispatched to your registered customer inbox upon every stage progression.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-black">5. Delivery Help Desk &amp; Dispatch Inquiries</h2>
            <p>
              For consignment tracking inquiries or village route guidance, contact our store dispatch coordinator:
            </p>
            <div className="bg-neutral-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
              <div><strong className="text-black">Store:</strong> {store.officialName}</div>
              <div><strong className="text-black">Helpline Phone:</strong> {store.contactPhone}</div>
              <div><strong className="text-black">Support Email:</strong> <a href={`mailto:${store.contactEmail}`} className="text-blue-700 underline font-mono">{store.contactEmail}</a></div>
              <div><strong className="text-black">Physical Dispatch Hub:</strong> {store.address}</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
