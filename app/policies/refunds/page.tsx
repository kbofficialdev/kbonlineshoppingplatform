import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';

export const metadata = {
  title: 'Refund & Return Policy | KB FASHIONS',
  description: 'Statutory 7-day returns, refunds, and order cancellation policy for KB FASHIONS, Kalwaral village, Telangana.',
};

export default function RefundPolicyPage() {
  const store = db.storeSettings;

  return (
    <div className="space-y-8 pb-20 bg-[#FAF9F6] min-h-screen">
      {/* Policy Hero Banner with Emerald-Teal Gradient */}
      <section className="bg-gradient-to-r from-[#042017] via-[#0B4632] to-[#042319] text-white border-b border-emerald-900/50 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="text-xs text-emerald-300 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/policies/terms" className="hover:text-white transition-colors">Policies</Link>
            <span>/</span>
            <span className="text-white font-semibold">Refund &amp; Return Policy</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>CONSUMER PROTECTION (E-COMMERCE) RULES 2020 COMPLIANT • 7-DAY WINDOW</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Refund, Return &amp; Cancellation Policy
          </h1>
          <p className="text-sm text-emerald-100/90 max-w-3xl leading-relaxed">
            Statutory 7-day return framework, pre-dispatch cancellation rules, and bank settlement protocols for {store.officialName}.
          </p>

          {/* Quick Policy Navigation Strip */}
          <div className="pt-3 flex flex-wrap gap-2 text-xs">
            <Link href="/policies/shipping" className="bg-white/10 hover:bg-white/20 text-white font-medium px-3 py-1.5 rounded-full border border-white/15 transition-colors">
              🚚 Shipping &amp; 10 km
            </Link>
            <Link href="/policies/refunds" className="bg-white text-black font-bold px-3 py-1.5 rounded-full shadow-sm">
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
        
        {/* Entity Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
          <div>
            <div className="font-bold text-neutral-900 text-sm">Operating Entity: {store.officialName}</div>
            <div className="text-neutral-500">Returns Fulfillment Hub: {store.village}, {store.district} ({store.pinCode})</div>
          </div>
          <Link
            href="/support"
            className="px-5 py-2.5 rounded-full bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition-colors shadow-sm inline-flex items-center gap-1.5 shrink-0"
          >
            <span>🎫</span>
            <span>Raise Return / Refund Ticket →</span>
          </Link>
        </div>

        {/* 1. 7-Day Return Window (Emerald Accent) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
              ↩️
            </div>
            <div>
              <h2 className="text-base font-black text-neutral-900">1. 7-Day Return Window for Packaged Garments</h2>
              <p className="text-xs text-neutral-500">Full refund or replacement on eligible handloom textiles</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
            We take tremendous pride in the quality of our {store.village} textiles. If you are not completely satisfied with your purchase, you may initiate a return within <strong>7 calendar days</strong> from the recorded delivery date for eligible items:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div className="bg-emerald-50/50 border border-emerald-200 p-4 rounded-2xl space-y-2">
              <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                <span>✓</span>
                <span>Eligible for 7-Day Return</span>
              </div>
              <ul className="space-y-1 text-emerald-900 text-[11px] list-disc pl-4">
                <li>Unopened, unworn, unwashed pure silk sarees (Gadwal, Pattu, Designer)</li>
                <li>Traditional cotton dhotis &amp; towels in original fold</li>
                <li>Pre-packaged boxed innerwear with seal unbroken</li>
                <li>Original Bill of Supply invoice included in return package</li>
              </ul>
            </div>

            <div className="bg-rose-50/50 border border-rose-200 p-4 rounded-2xl space-y-2">
              <div className="font-bold text-rose-950 flex items-center gap-1.5">
                <span>✕</span>
                <span>Ineligible for Return</span>
              </div>
              <ul className="space-y-1 text-rose-900 text-[11px] list-disc pl-4">
                <li>Custom meter-cut unstitched suiting &amp; shirting (once sheared from bolt)</li>
                <li>Worn, washed, or altered garments with removed brand tags</li>
                <li>Damage caused by customer mishandling, cuts, or artificial perfumes</li>
                <li>Returns initiated after the 7-day delivery window</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. Custom Cut Fabric Clarification (Amber Box) */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 shadow-sm space-y-3 text-amber-950">
          <div className="font-black text-sm text-amber-900 flex items-center gap-2">
            <span className="text-lg">✂️</span>
            <span>2. Trade Clarification on Custom-Cut Unstitched Fabrics</span>
          </div>
          <p className="text-xs leading-relaxed">
            In accordance with Indian textile trade customs, unstitched suitings and shirtings (Raymond, Arvind, Linen) tailored to specific customer meter requests are cut from master bolts. Therefore, custom lengths cannot be returned unless a manufacturing weave defect is documented via unboxing photograph within 48 hours.
          </p>
        </div>

        {/* 3. Refund Timelines Table (Blue Theme) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-lg">
              ⏱️
            </div>
            <div>
              <h2 className="text-base font-black text-neutral-900">3. Refund Processing Timelines &amp; Bank Settlement</h2>
              <p className="text-xs text-neutral-500">Direct credit to original payment method or bank NEFT</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 text-xs">
            <table className="w-full text-left divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-700 font-bold">
                <tr>
                  <th className="p-3.5">Payment Method</th>
                  <th className="p-3.5">Refund Channel</th>
                  <th className="p-3.5">Settlement SLA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-neutral-800">
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-bold">UPI / QR Code</td>
                  <td className="p-3.5">Direct reversal to UPI VPA (PhonePe, GPay, Paytm)</td>
                  <td className="p-3.5 font-bold text-emerald-700">Instant / Within 24 Hours</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-bold">Debit / Credit Card</td>
                  <td className="p-3.5">Reversal to card-issuing bank</td>
                  <td className="p-3.5">3 to 5 Business Days</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-bold">Cash on Delivery (COD)</td>
                  <td className="p-3.5">NEFT Bank Transfer to customer's IFSC account</td>
                  <td className="p-3.5">24 to 48 Hours upon return receipt</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
