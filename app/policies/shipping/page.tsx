import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';

export default function ShippingPolicyPage() {
  const store = db.storeSettings;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-kb-blue text-xs font-bold uppercase tracking-wider">
          Logistics &amp; Delivery Standards
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-kb-black tracking-tight">
          Shipping &amp; Delivery Policy
        </h1>
        <p className="text-xs text-neutral-500 font-mono">
          Last Updated: October 2026 • Official Logistics of {store.officialName}
        </p>
      </div>

      {/* Body Content */}
      <div className="prose prose-sm max-w-none text-neutral-700 space-y-6 text-xs sm:text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-kb-black">1. Dispatch Origin &amp; Quality Inspection</h2>
          <p>
            All orders placed on <strong>{store.officialName}</strong> are hand-picked, inspected for weave perfection, calibrated (for meter cuts), and securely packed directly from our physical village store at <strong>{store.address}</strong>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-kb-black">2. Delivery Charges &amp; Free Shipping Threshold</h2>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-slate-200">
              <span className="font-bold text-black">Orders Above ₹{store.freeShippingThreshold}</span>
              <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">FREE DELIVERY</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-bold text-black">Orders Below ₹{store.freeShippingThreshold}</span>
              <span className="font-mono font-bold text-neutral-800">₹{store.flatShippingFee} Flat Logistics Fee</span>
            </div>
            <p className="text-neutral-500 text-[11px] pt-1">
              No hidden handling fees or convenience surcharges are ever added.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-kb-black">3. Delivery Timelines</h2>
          <p>We partner with premier regional and national postal networks to ensure prompt delivery:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
              <div className="font-bold text-black text-sm">Telangana &amp; Andhra Pradesh</div>
              <div className="text-kb-blue font-bold font-mono text-sm">2 to 4 Business Days</div>
              <p className="text-neutral-500 text-[11px]">Direct road dispatch via Kamareddy logistics hub.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
              <div className="font-bold text-black text-sm">Rest of India (All States &amp; UTs)</div>
              <div className="text-kb-blue font-bold font-mono text-sm">4 to 7 Business Days</div>
              <p className="text-neutral-500 text-[11px]">Surface and express air postal network to all 19,000+ pin codes.</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-kb-black">4. Real-Time Consignment Tracking</h2>
          <p>
            Every order receives a unique Air Waybill (AWB) consignment number once packed. You can track your parcel's live stages (Kalwaral Dispatch → Hub In-Transit → Out for Delivery → Delivered) directly on our <Link href="/account?tab=tracking" className="text-kb-blue font-bold underline">Customer Parcel Tracking Portal</Link> or via WhatsApp alerts.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-kb-black">5. Weather &amp; Rural Festival Delays</h2>
          <p>
            During peak festival occasions (Bathukamma, Sankranti, Dussehra, Diwali) or extreme monsoon conditions, rural parcel transit may incur a 24–48 hour delay. Our customer helpline (+91 7989768200) remains available for urgent wedding order dispatches.
          </p>
        </section>
      </div>

      <div className="pt-6 border-t border-slate-200 flex justify-between items-center text-xs">
        <Link href="/policies/refunds" className="text-neutral-600 hover:text-black font-semibold">
          ← Refund Policy
        </Link>
        <Link href="/policies/grievance" className="text-kb-blue hover:underline font-bold">
          Grievance Redressal Policy →
        </Link>
      </div>
    </div>
  );
}
