import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';

export const metadata = {
  title: 'Refund & Cancellation Policy | KB FASHIONS',
  description: 'Statutory returns, refunds, and order cancellation policy for KB FASHIONS, Kalwaral village, Telangana.',
};

export default function RefundPolicyPage() {
  const store = db.storeSettings;

  return (
    <div className="space-y-8 pb-16">
      {/* Policy Hero Banner with Gradient Background */}
      <section className="bg-gradient-to-r from-[#061E16] via-[#0C3B2C] to-[#04140F] text-white border-b border-emerald-900/40 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-xs text-emerald-300 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/policies" className="hover:text-white transition-colors">Policies</Link>
            <span>/</span>
            <span className="text-white font-semibold">Refund &amp; Cancellation</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            CONSUMER PROTECTION (E-COMMERCE) RULES 2020 COMPLIANT
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Refund, Return &amp; Cancellation Policy
          </h1>
          <p className="text-sm text-emerald-200/80 max-w-2xl leading-relaxed">
            Transparent 7-day return framework, pre-dispatch cancellation rules, and bank settlement protocols for {store.officialName}.
          </p>
        </div>
      </section>

      {/* Main Content Card */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-12 shadow-sm space-y-8 text-neutral-800 leading-relaxed text-sm">
          <div className="border-b border-slate-200 pb-4 flex justify-between items-center text-xs text-neutral-500">
            <span>Entity: {store.officialName}</span>
            <span>Returns Hub: {store.village}, {store.district} ({store.pinCode})</span>
          </div>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-black">1. 7-Day Return Window for Packaged Garments</h2>
            <p>
              We take tremendous pride in the quality of our {store.village} textiles. If you are not completely satisfied with your purchase, you may initiate a return within <strong>7 calendar days</strong> from the recorded delivery date for eligible items:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-neutral-600">
              <li><strong>Eligible Items:</strong> Unopened, unworn, unwashed sarees (Gadwal, Pattu, Designer), dhotis, towels, and pre-packaged boxed innerwear with original tags and fold intact.</li>
              <li><strong>Condition:</strong> The item must be returned in its original condition with the statutory Bill of Supply invoice copy included.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-black">2. Policy on Custom-Cut Unstitched Fabrics</h2>
            <p>
              For men&apos;s unstitched suiting and shirting fabrics that are custom-measured and cut from continuous bolts (e.g. Raymond cuts):
            </p>
            <p className="text-xs text-neutral-700 bg-amber-50 p-4 rounded-2xl border border-amber-200 leading-relaxed">
              <strong>Custom-Cut Notice:</strong> Fabrics specifically cut to your requested bespoke meter length (e.g. 1.6m, 2.25m) cannot be returned or exchanged unless the material arrives damaged, torn, or with a demonstrable cutting error exceeding ±2 cm.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-black">3. Order Cancellation Before Dispatch</h2>
            <p>
              You may cancel an order free of penalty anytime before the consignment is marked as <strong>DISPATCHED</strong> from our {store.village} store hub. Once an order has been handed over to our delivery executive or postal courier partner, cancellation is no longer possible and the standard 7-day return procedure applies upon delivery.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-black">4. Refund Settlement Timelines (RBI Guidelines)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="font-bold text-emerald-900 text-sm">UPI &amp; Cards (3–5 Business Days)</div>
                <p className="text-emerald-800">
                  Prepaid orders refunded directly to the original payment source via our authorized payment gateway within 3–5 banking days of inspection.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
                <div className="font-bold text-blue-900 text-sm">Cash on Delivery (Bank Transfer)</div>
                <p className="text-blue-800">
                  For COD returns, refund is issued directly to the customer's verified bank account or UPI VPA within 3 business days of return receipt.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-black">5. Grievance Redressal for Refunds</h2>
            <p>
              If a refund has not reflected within the stated timeframe, please contact our Grievance Officer:
            </p>
            <div className="bg-neutral-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
              <div><strong className="text-black">Officer:</strong> {store.grievanceOfficerName}</div>
              <div><strong className="text-black">Desk:</strong> <a href={`mailto:${store.grievanceOfficerEmail}`} className="text-emerald-700 underline font-mono">{store.grievanceOfficerEmail}</a></div>
              <div><strong className="text-black">Store Helpline:</strong> {store.grievanceOfficerPhone}</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
