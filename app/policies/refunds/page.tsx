import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';

export default function RefundPolicyPage() {
  const store = db.storeSettings;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          Consumer Protection • Fair Returns Guarantee
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-kb-black tracking-tight">
          Refund &amp; Cancellation Policy
        </h1>
        <p className="text-xs text-neutral-500 font-mono">
          Updated: October 2026 • Official Policy of {store.officialName}
        </p>
      </div>

      {/* Body Content */}
      <div className="prose prose-sm max-w-none text-neutral-700 space-y-6 text-xs sm:text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-kb-black">1. 7-Day Return Window for Standard Garments</h2>
          <p>
            At <strong>{store.officialName}</strong>, we cherish the 20-year trust built with our patrons. If you are not completely satisfied with your purchase, you may initiate a return within <strong>7 days of delivery</strong> for:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-neutral-600">
            <li>Unworn, unwashed Handloom Gadwal and Pattu Sarees with original folds and tags intact.</li>
            <li>Packaged Dhotis, Towels, and Kerchief sets in their original retail packaging.</li>
            <li>Unopened Innerwear essentials (Banians/Vests) with unbroken hygienic seals.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-kb-black">2. Custom Unstitched Meter Cuts (Exceptions)</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-2">
            <div className="font-bold">⚠️ Special Policy for Custom Fabric Cuts:</div>
            <p>
              Fabrics cut from wholesale bolts (e.g. Raymond 2.25m or Arvind shirting/suiting) to your customized meter length cannot be returned or exchanged unless there is an evident transit tear or physical manufacturing flaw.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-kb-black">3. Order Cancellation Policy</h2>
          <p>
            You may cancel an order free of charge anytime <strong>before it enters the "DISPATCHED" stage</strong>. Once dispatched with our courier partner (Telangana Express / Postal Logistics), the order cannot be cancelled in transit and must follow the standard return procedure upon delivery.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-kb-black">4. Refund Processing &amp; Settlement Timelines</h2>
          <p>
            Once your returned item is received at our Kalwaral store and inspected by our weavers:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-neutral-600">
            <li><strong>UPI &amp; Digital Payments:</strong> The refund will be credited directly to your source bank account / UPI VPA within <strong>5 to 7 business days</strong>.</li>
            <li><strong>Cash on Delivery (COD) Orders:</strong> The refund will be transferred via NEFT/IMPS or UPI to the account details provided by you.</li>
            <li><strong>Statutory Credit Memo:</strong> A digital Credit Note / Refund Bill of Supply will be issued to your account portal.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-kb-black">5. How to Initiate a Return</h2>
          <p>
            To initiate a return or request assistance:
          </p>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
            <div>1. Email our support desk at <a href={`mailto:${store.contactEmail}`} className="text-kb-blue underline">{store.contactEmail}</a> with your Order ID and photo of the item.</div>
            <div>2. Or message / call our village store directly at <strong>{store.contactPhone}</strong> (9 AM – 7 PM IST).</div>
            <div>3. Our team will schedule a pickup or provide direct return shipping instructions.</div>
          </div>
        </section>
      </div>

      <div className="pt-6 border-t border-slate-200 flex justify-between items-center text-xs">
        <Link href="/policies/terms" className="text-neutral-600 hover:text-black font-semibold">
          ← Terms &amp; Conditions
        </Link>
        <Link href="/policies/shipping" className="text-kb-blue hover:underline font-bold">
          Shipping &amp; Delivery Policy →
        </Link>
      </div>
    </div>
  );
}
