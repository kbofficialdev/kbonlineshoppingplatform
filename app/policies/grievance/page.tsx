import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';

export const metadata = {
  title: 'Grievance Redressal Officer | KB FASHIONS',
  description: 'Statutory Grievance Redressal Officer details under Consumer Protection (E-Commerce) Rules 2020 for KB FASHIONS, Kalwaral village.',
};

export default function GrievanceRedressalPage() {
  const store = db.storeSettings;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Breadcrumb */}
      <div className="text-xs text-neutral-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <span className="text-black font-semibold">Grievance Redressal</span>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-12 shadow-sm space-y-8 text-neutral-800 leading-relaxed text-sm">
        <div className="border-b border-slate-200 pb-6">
          <div className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-900 border border-purple-200 mb-3">
            RULE 5(9) OF CONSUMER PROTECTION (E-COMMERCE) RULES 2020
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-kb-black">Consumer Grievance Redressal Mechanism</h1>
          <p className="text-xs text-neutral-500 mt-2">
            Designated Nodal Grievance Redressal Officer &amp; Dispute Resolution Framework
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-black">1. Mandatory Statutory Disclosure</h2>
          <p>
            In compliance with Rule 5(9) of the Consumer Protection (E-Commerce) Rules, 2020, and Section 43A of the Information Technology Act, 2000, {store.officialName} has appointed a designated Grievance Redressal Officer to address consumer inquiries, transaction disputes, service feedback, and legal notices.
          </p>
        </section>

        {/* Officer Contact Card */}
        <div className="bg-neutral-50 border-2 border-slate-300 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center font-black text-lg">
              KB
            </div>
            <div>
              <div className="text-base font-black text-black">Sri K. Balaram</div>
              <div className="text-xs font-bold text-kb-blue">Designated Grievance Redressal Officer &amp; Managing Proprietor</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-3 border-t border-slate-200">
            <div>
              <span className="font-bold text-neutral-500 uppercase tracking-wider text-[10px] block mb-1">Entity Name</span>
              <span className="font-extrabold text-black">{store.officialName} (Brand: {store.brandName})</span>
            </div>
            <div>
              <span className="font-bold text-neutral-500 uppercase tracking-wider text-[10px] block mb-1">Official Email Desk</span>
              <a href={`mailto:${store.contactEmail}`} className="font-mono text-kb-blue underline font-bold">{store.contactEmail}</a>
            </div>
            <div>
              <span className="font-bold text-neutral-500 uppercase tracking-wider text-[10px] block mb-1">Telephone Helpline</span>
              <span className="font-mono font-bold text-black">{store.contactPhone}</span>
            </div>
            <div>
              <span className="font-bold text-neutral-500 uppercase tracking-wider text-[10px] block mb-1">Operating Hours</span>
              <span className="text-black font-medium">10:00 AM – 7:00 PM IST (Mon – Sat)</span>
            </div>
            <div className="sm:col-span-2">
              <span className="font-bold text-neutral-500 uppercase tracking-wider text-[10px] block mb-1">Physical Store &amp; Redressal Office</span>
              <span className="text-black font-mono leading-relaxed">{store.address}</span>
            </div>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-black">2. Grievance Resolution Timelines (SLA)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
              <div className="font-bold text-blue-900 text-sm">48 Hours Acknowledgment</div>
              <p className="text-blue-800">
                Every grievance submitted via email or post is formally acknowledged with a unique Complaint Ticket Number within 48 hours.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
              <div className="font-bold text-emerald-900 text-sm">30 Days Maximum Resolution</div>
              <p className="text-emerald-800">
                Complaints are thoroughly investigated and conclusively redressed within 30 calendar days from the date of receipt.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-black">3. How to Submit a Grievance</h2>
          <p>
            When lodging a grievance, please provide:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-neutral-600">
            <li>Your registered customer name and phone number</li>
            <li>Order ID # (e.g. ORD-2026-1001) or Invoice Number</li>
            <li>Detailed description of the issue (delivery delay, payment settlement, damaged package)</li>
            <li>Supporting photographic evidence if material damage is reported</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

