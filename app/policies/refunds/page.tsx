import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';

export const metadata = {
  title: 'Refund & Return Policy | KB FASHIONS',
  description: 'Statutory 7-day return policy, cancellation procedures, and refund settlement timelines for KB FASHIONS under Consumer Protection Rules 2020.',
};

export default function RefundPolicyPage() {
  const store = db.storeSettings;

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
            <span className="text-white font-medium">Refund &amp; Return Policy</span>
          </div>

          <div className="flex items-start sm:items-center gap-4 pt-2">
            {/* Custom SVG Icon for Refunds & Returns (7-Day Box Return / Shield Exchange) */}
            <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center shrink-0 shadow-inner">
              <svg className="w-8 h-8 text-neutral-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
            </div>

            <div>
              <div className="inline-block px-3 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase bg-neutral-800 text-neutral-300 border border-neutral-700 mb-1">
                Consumer Protection (E-Commerce) Rules, 2020 • Rule 5(3)(c)
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Refund, Return &amp; Cancellation Policy
              </h1>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed pt-1">
            Statutory 7-day return guidelines, artisan fabric conditions, and electronic refund settlement framework for {store.officialName}.
          </p>

          {/* Minimalist Policy Navigation Strip */}
          <div className="pt-4 flex flex-wrap gap-2 text-xs">
            <Link href="/policies/terms" className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-medium px-3.5 py-1.5 rounded-full border border-neutral-700 transition-colors">
              📜 Terms of Sale
            </Link>
            <Link href="/policies/shipping" className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-medium px-3.5 py-1.5 rounded-full border border-neutral-700 transition-colors">
              🚚 Shipping &amp; 10 km Radius
            </Link>
            <Link href="/policies/refunds" className="bg-white text-black font-bold px-3.5 py-1.5 rounded-full shadow-xs">
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
        
        {/* Support Ticket Quick Action Card */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-neutral-600 hover-elevate-card">
          <div>
            <span className="font-bold text-neutral-900 block text-sm">Need to Request a Return or Replacement?</span>
            <span>Initiate requests directly via your account support ticket portal for swift resolution.</span>
          </div>
          <Link
            href="/support"
            className="px-5 py-2.5 rounded-full bg-black text-white hover:bg-neutral-800 text-xs font-bold transition-all shadow-xs shrink-0"
          >
            Create Return Ticket →
          </Link>
        </div>

        {/* 1. 7-Day Inspection Window */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-3 hover-elevate-card">
          <h2 className="text-base sm:text-lg font-black text-neutral-900">
            1. Statutory 7-Day Return &amp; Inspection Window
          </h2>
          <p className="text-neutral-700">
            Under Rule 5(3)(c) of the Consumer Protection (E-Commerce) Rules, 2020, consumers are entitled to a clear, unambiguous return and refund policy. {store.officialName} provides a <strong>7-calendar-day return window</strong> commencing from the date and time of verified physical delivery.
          </p>
          <p className="text-neutral-700">
            If you receive merchandise that does not correspond to product specifications or exhibits transit damage, you may request an exchange or full refund within 7 days of receipt.
          </p>
        </div>

        {/* 2. Item Eligibility Matrix */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-4 hover-elevate-card">
          <h2 className="text-base sm:text-lg font-black text-neutral-900">
            2. Category Return Eligibility &amp; Condition Criteria
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50 space-y-2">
              <span className="font-bold text-neutral-900 text-xs uppercase tracking-wider block">
                ✓ Returnable Items (7-Day Window):
              </span>
              <ul className="list-disc pl-4 space-y-1 text-xs text-neutral-700">
                <li>Pre-packaged Sarees (Gadwal silks, cotton dhotis, matching sets).</li>
                <li>Standard uncut apparel with original manufacturer seals intact.</li>
                <li>Items with verified manufacturing defects or wrong product dispatch.</li>
              </ul>
            </div>

            <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50 space-y-2">
              <span className="font-bold text-neutral-900 text-xs uppercase tracking-wider block">
                ✕ Non-Returnable Items:
              </span>
              <ul className="list-disc pl-4 space-y-1 text-xs text-neutral-700">
                <li>Custom Cut Meter Pieces cut to tailor-specified length (unless defective).</li>
                <li>Garments that have been washed, ironed, perfumed, or tailored.</li>
                <li>Items with security tags or brand labels removed.</li>
              </ul>
            </div>
          </div>

          {/* Highlight Disclaimers */}
          <div className="border-l-4 border-black bg-neutral-100 p-4 rounded-r-xl space-y-1">
            <span className="font-black text-neutral-900 uppercase text-xs tracking-wider block">
              Mandatory Condition Criteria for Returns:
            </span>
            <p className="text-neutral-800 text-xs leading-relaxed">
              Items must be presented in their original factory folds, inside the original packaging, and with all accompanying documentation (Bill of Supply). Our local collection runner conducts a physical verification of tags and fold integrity at the time of doorstep collection.
            </p>
          </div>
        </div>

        {/* 3. Doorstep Pickup & Inspection Process */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-3 hover-elevate-card">
          <h2 className="text-base sm:text-lg font-black text-neutral-900">
            3. Doorstep Pickup &amp; Quality Inspection
          </h2>
          <p className="text-neutral-700">
            Once a return ticket is submitted on our platform:
          </p>
          <ol className="list-decimal pl-5 space-y-1.5 text-neutral-700">
            <li>Our support desk acknowledges your ticket within <strong>24 business hours</strong>.</li>
            <li>Our designated Kalwaral store runner is scheduled for doorstep collection from your registered village address within <strong>48 hours</strong>.</li>
            <li>The item undergoes physical verification at our Kalwaral store hub to confirm weave integrity and unwashed condition.</li>
          </ol>
        </div>

        {/* 4. Refund Disbursement SLA */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-3 hover-elevate-card">
          <h2 className="text-base sm:text-lg font-black text-neutral-900">
            4. Electronic Refund Disbursement Timeline (5-7 Business Days)
          </h2>
          <p className="text-neutral-700">
            Upon successful inspection approval at our store:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-neutral-700">
            <li><strong>Original Payment Method:</strong> Refunds are disbursed directly to the original funding account via the Cashfree Payments gateway or UPI ID used during checkout.</li>
            <li><strong>Settlement Timeline:</strong> The electronic transfer is initiated within <strong>24 to 48 hours</strong> of approval and typically credits your bank account within <strong>5 to 7 business days</strong> depending on your banking institution.</li>
            <li><strong>Cash On Delivery (COD) Orders:</strong> Refunds for COD orders are transferred electronically to the patron&apos;s verified UPI ID or NEFT bank account.</li>
          </ul>
        </div>

        {/* 5. Pre-Dispatch Cancellation Rights */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-3 hover-elevate-card">
          <h2 className="text-base sm:text-lg font-black text-neutral-900">
            5. Order Cancellation Prior to Dispatch
          </h2>
          <p className="text-neutral-700">
            Patrons may cancel any order without penalty prior to runner dispatch or fabric cutting. Once an order is logged as &quot;DISPATCHED&quot; or cut from master weaver bolts, the standard 7-day return procedure applies following physical delivery.
          </p>
        </div>

      </div>
    </div>
  );
}
