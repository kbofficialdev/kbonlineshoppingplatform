import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';

export const metadata = {
  title: 'Statutory Grievance Redressal Mechanism | KB FASHIONS',
  description: 'Designated Grievance Redressal Officer disclosure under Rule 5(9) of the Consumer Protection (E-Commerce) Rules 2020 for KB FASHIONS, Telangana.',
};

export default function GrievanceRedressalPage() {
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
            <span className="text-white font-medium">Grievance Redressal</span>
          </div>

          <div className="flex items-start sm:items-center gap-4 pt-2">
            {/* Custom SVG Icon for Grievance Redressal (Ombudsman Scales & Official Helpdesk) */}
            <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center shrink-0 shadow-inner">
              <svg className="w-8 h-8 text-neutral-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18" />
                <path d="M5 21V7l8-4v18" />
                <path d="M19 21V11l-6-4" />
                <path d="M9 9v.01" />
                <path d="M9 12v.01" />
                <path d="M9 15v.01" />
                <path d="M9 18v.01" />
              </svg>
            </div>

            <div>
              <div className="inline-block px-3 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase bg-neutral-800 text-neutral-300 border border-neutral-700 mb-1">
                Consumer Protection (E-Commerce) Rules, 2020 • Rule 5(9)
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Statutory Grievance Redressal Mechanism
              </h1>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed pt-1">
            Mandatory disclosure of the Designated Grievance Redressal Officer, 48-hour statutory acknowledgement, and consumer dispute redressal procedures for {store.officialName}.
          </p>

          {/* Minimalist Policy Navigation Strip */}
          <div className="pt-4 flex flex-wrap gap-2 text-xs">
            <Link href="/policies/terms" className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-medium px-3.5 py-1.5 rounded-full border border-neutral-700 transition-colors">
              📜 Terms of Sale
            </Link>
            <Link href="/policies/shipping" className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-medium px-3.5 py-1.5 rounded-full border border-neutral-700 transition-colors">
              🚚 Shipping &amp; 10 km Radius
            </Link>
            <Link href="/policies/refunds" className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-medium px-3.5 py-1.5 rounded-full border border-neutral-700 transition-colors">
              ↩️ 7-Day Returns
            </Link>
            <Link href="/policies/privacy" className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-medium px-3.5 py-1.5 rounded-full border border-neutral-700 transition-colors">
              🛡️ Privacy &amp; Data Security
            </Link>
            <Link href="/policies/grievance" className="bg-white text-black font-bold px-3.5 py-1.5 rounded-full shadow-xs">
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
        
        {/* Designated Grievance Officer Card (Official Designation Only - No Person Names) */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-6 hover-elevate-card">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-200 pb-5">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block">
                Statutory Authority • Rule 5(9)
              </span>
              <h2 className="text-lg sm:text-xl font-black text-neutral-900">
                Designated Grievance Redressal Officer &amp; Customer Ombudsman
              </h2>
              <span className="text-xs font-bold text-neutral-700 block mt-0.5">
                {store.officialName}
              </span>
            </div>

            <Link
              href="/support"
              className="px-5 py-2.5 rounded-full bg-black text-white hover:bg-neutral-800 text-xs font-bold transition-all shadow-xs shrink-0"
            >
              Open Support Ticket →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50 space-y-1">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Official Support Email</span>
              <a href={`mailto:${store.grievanceOfficerEmail || 'kb.official.admin@gmail.com'}`} className="font-bold text-neutral-900 hover:underline break-all block">
                {store.grievanceOfficerEmail || 'kb.official.admin@gmail.com'}
              </a>
              <span className="text-[10px] text-neutral-500 block">Dedicated statutory inbox</span>
            </div>

            <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50 space-y-1">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Direct Redressal Helpline</span>
              <a href={`tel:${store.grievanceOfficerPhone || '+917989768200'}`} className="font-bold text-neutral-900 hover:underline block">
                {store.grievanceOfficerPhone || '+91 7989768200'}
              </a>
              <span className="text-[10px] text-neutral-500 block">Mon - Sat: 9:00 AM - 7:00 PM IST</span>
            </div>

            <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50 space-y-1">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Physical Office Address</span>
              <span className="font-medium text-neutral-800 text-xs block leading-snug">
                {store.grievanceOfficerAddress || store.address}
              </span>
            </div>
          </div>
        </div>

        {/* 1. Legal Mandate */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-3 hover-elevate-card">
          <h2 className="text-base sm:text-lg font-black text-neutral-900">
            1. Legal Mandate &amp; Consumer Protection Framework
          </h2>
          <p className="text-neutral-700">
            In accordance with Rule 5(9) of the Consumer Protection (E-Commerce) Rules, 2020 framed under the Consumer Protection Act, 2019, every e-commerce entity is legally required to establish a consumer grievance redressal mechanism and appoint a designated Grievance Officer.
          </p>
          <p className="text-neutral-700">
            The Designated Grievance Redressal Officer acts as an impartial ombudsman to examine patron grievances concerning order delays, fabric cut discrepancies, payment disputes, or statutory return queries.
          </p>
        </div>

        {/* 2. Statutory Timelines */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-4 hover-elevate-card">
          <h2 className="text-base sm:text-lg font-black text-neutral-900">
            2. Statutory Resolution Timelines
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border-l-4 border-black bg-neutral-50 p-4 rounded-r-xl space-y-1">
              <span className="font-black text-neutral-900 text-xs uppercase tracking-wider block">
                48-Hour Acknowledgment Guarantee:
              </span>
              <p className="text-neutral-700 text-xs leading-relaxed">
                As required by law, every formal grievance received via email or our online support ticket system will be assigned a unique ticket reference number and acknowledged in writing within <strong>48 hours</strong> of receipt.
              </p>
            </div>

            <div className="border-l-4 border-black bg-neutral-50 p-4 rounded-r-xl space-y-1">
              <span className="font-black text-neutral-900 text-xs uppercase tracking-wider block">
                30-Day Disposal Guarantee:
              </span>
              <p className="text-neutral-700 text-xs leading-relaxed">
                All consumer complaints shall be thoroughly investigated and redressed within <strong>30 calendar days</strong> from the date of formal receipt. Most local village inquiries are resolved within 2 to 3 working days.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Grievance Lodging Procedure */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-3 hover-elevate-card">
          <h2 className="text-base sm:text-lg font-black text-neutral-900">
            3. Grievance Lodging &amp; Escalation Process
          </h2>
          <p className="text-neutral-700">
            To enable prompt resolution of your inquiry:
          </p>
          <ol className="list-decimal pl-5 space-y-1.5 text-neutral-700">
            <li><strong>Step 1 (Online Ticket):</strong> Navigate to <Link href="/support" className="text-black font-bold underline hover:text-neutral-700">Online Support Desk</Link> and submit your inquiry with Order ID, Bill of Supply Number, and a brief description.</li>
            <li><strong>Step 2 (Direct Escalation):</strong> If your ticket is not resolved within 48 hours, send an email directly to <a href={`mailto:${store.grievanceOfficerEmail || 'kb.official.admin@gmail.com'}`} className="text-black font-bold underline">{store.grievanceOfficerEmail || 'kb.official.admin@gmail.com'}</a> quoting your Ticket Reference Number.</li>
            <li><strong>Step 3 (Statutory Escalation):</strong> If a dispute remains unresolved, consumers retain the right to approach the National Consumer Helpline (NCH Toll-Free: <strong>1915</strong> or visit <a href="https://consumerhelpline.gov.in" target="_blank" rel="noopener noreferrer" className="text-black font-bold underline">consumerhelpline.gov.in</a>) or the competent District Consumer Disputes Redressal Commission in Kamareddy, Telangana.</li>
          </ol>
        </div>

      </div>
    </div>
  );
}
