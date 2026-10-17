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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Breadcrumb */}
      <div className="text-xs text-neutral-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <span className="text-black font-semibold">Refund &amp; Cancellation Policy</span>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-12 shadow-sm space-y-8 text-neutral-800 leading-relaxed text-sm">
        <div className="border-b border-slate-200 pb-6">
          <div className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 mb-3">
            CONSUMER PROTECTION (E-COMMERCE) RULES 2020 COMPLIANT
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-kb-black">Refund, Return &amp; Cancellation Policy</h1>
          <p className="text-xs text-neutral-500 mt-2">
            Clear, Transparent Return Timelines &amp; Settlement Protocols for Our Patrons
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-black">1. 7-Day Return Window for Packaged Garments</h2>
          <p>
            We take tremendous pride in the quality of our Kalwaral textiles. If you are not completely satisfied with your purchase, you may initiate a return within <strong>7 calendar days</strong> from the recorded delivery date for eligible items:
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
          <p className="text-xs text-neutral-600 bg-amber-50 p-3.5 rounded-xl border border-amber-200">
            <strong>Custom-Cut Notice:</strong> Fabrics specifically cut to your requested length (e.g., 2.25 meters) cannot be returned or exchanged unless the material arrives damaged, torn, or with a demonstrable cutting error exceeding ±2 cm.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-black">3. Order Cancellation Before Dispatch</h2>
          <p>
            You may cancel an order free of penalty anytime before the consignment is marked as <strong>DISPATCHED</strong> from our Kalwaral store. Once an order has been handed over to the courier partner, cancellation is no longer possible and the standard 7-day return procedure applies upon delivery.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-black">4. Refund Settlement &amp; Timelines</h2>
          <p>
            Once the returned consignment arrives at our Kalwaral store and passes quality inspection:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-neutral-600">
            <li><strong>UPI &amp; Card Payments:</strong> Refunds are credited directly back to the original source account via our payment gateway within <strong>5 to 7 business days</strong>.</li>
            <li><strong>Cash on Delivery (COD) Orders:</strong> Refunds are disbursed directly to your designated bank account or UPI VPA within <strong>3 to 5 business days</strong> after you provide payment coordinates to our support desk.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-black">5. How to Initiate a Return or Refund</h2>
          <p>
            To initiate a return or request assistance with a damaged item, please contact our support desk:
          </p>
          <div className="p-4 rounded-2xl bg-neutral-50 border border-slate-200 text-xs space-y-1">
            <div><strong>Email:</strong> <a href={`mailto:${store.contactEmail}`} className="text-kb-blue underline">{store.contactEmail}</a> (Include your Order ID #)</div>
            <div><strong>Helpline:</strong> <span className="font-mono">{store.contactPhone}</span> (10:00 AM – 7:00 PM IST, Monday through Saturday)</div>
            <div><strong>Physical Return Center:</strong> {store.officialName}, {store.address}</div>
          </div>
        </section>
      </div>
    </div>
  );
}

