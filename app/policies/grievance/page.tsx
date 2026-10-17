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
    <div className="space-y-8 pb-16">
      {/* Policy Hero Banner with Gradient Background */}
      <section className="bg-gradient-to-r from-[#17092B] via-[#210D3D] to-[#0D041A] text-white border-b border-purple-900/40 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-xs text-purple-300 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/policies" className="hover:text-white transition-colors">Policies</Link>
            <span>/</span>
            <span className="text-white font-semibold">Grievance Redressal</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-200 border border-purple-400/30">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
            RULE 5(9) CONSUMER PROTECTION (E-COMMERCE) RULES 2020
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Consumer Grievance Redressal Mechanism
          </h1>
          <p className="text-sm text-purple-200/80 max-w-2xl leading-relaxed">
            Statutory Nodal Grievance Redressal Officer &amp; Dispute Resolution Framework for {store.officialName}, Kalwaral Village.
          </p>
        </div>
      </section>

      {/* Main Content Card */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-12 shadow-sm space-y-8 text-neutral-800 leading-relaxed text-sm">
          <section className="space-y-3">
            <h2 className="text-base font-bold text-black">1. Mandatory Statutory Disclosure</h2>
            <p>
              In strict compliance with Rule 5(9) of the Consumer Protection (E-Commerce) Rules, 2020, and Section 43A of the Information Technology Act, 2000, <strong>{store.officialName}</strong> has appointed a designated Grievance Redressal Officer to address consumer inquiries, transaction disputes, service feedback, and legal notices.
            </p>
          </section>

          {/* Officer Contact Card (Dynamically Managed from DB) */}
          <div className="bg-gradient-to-br from-neutral-50 to-purple-50/40 border-2 border-purple-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-black text-xl shadow-md border border-purple-300">
                {store.brandName || 'KB'}
              </div>
              <div>
                <div className="text-lg font-black text-black">{store.grievanceOfficerName || 'Sri K. Balaram'}</div>
                <div className="text-xs font-bold text-purple-700">{store.grievanceOfficerDesignation || 'Designated Grievance Redressal Officer & Managing Proprietor'}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-purple-100">
              <div>
                <span className="font-bold text-neutral-500 uppercase tracking-wider text-[10px] block mb-1">Entity Name</span>
                <span className="font-extrabold text-black">{store.officialName} (Brand: {store.brandName})</span>
              </div>
              <div>
                <span className="font-bold text-neutral-500 uppercase tracking-wider text-[10px] block mb-1">Officer Direct Email Desk</span>
                <a href={`mailto:${store.grievanceOfficerEmail || store.contactEmail}`} className="font-mono text-purple-800 hover:text-purple-950 underline font-bold">
                  {store.grievanceOfficerEmail || store.contactEmail}
                </a>
              </div>
              <div>
                <span className="font-bold text-neutral-500 uppercase tracking-wider text-[10px] block mb-1">Helpline Telephone</span>
                <span className="font-mono font-bold text-black">{store.grievanceOfficerPhone || store.contactPhone}</span>
              </div>
              <div>
                <span className="font-bold text-neutral-500 uppercase tracking-wider text-[10px] block mb-1">Operating Hours</span>
                <span className="text-black font-medium">10:00 AM – 7:00 PM IST (Mon – Sat)</span>
              </div>
              <div className="sm:col-span-2">
                <span className="font-bold text-neutral-500 uppercase tracking-wider text-[10px] block mb-1">Physical Store &amp; Redressal Chamber</span>
                <span className="text-black font-mono leading-relaxed">{store.grievanceOfficerAddress || store.address}</span>
              </div>
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-black">2. Grievance Resolution Timelines (Statutory SLA)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-1">
                <div className="font-bold text-purple-900 text-sm">48 Hours Acknowledgment</div>
                <p className="text-purple-800">
                  Every grievance submitted via email or postal delivery is formally acknowledged with a unique Complaint Ticket Number within 48 hours.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="font-bold text-emerald-900 text-sm">30 Days Maximum Resolution</div>
                <p className="text-emerald-800">
                  Complaints are thoroughly investigated and conclusively redressed within 30 calendar days from the date of formal receipt.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-black">3. How to Submit a Grievance</h2>
            <p>
              When lodging a grievance with our Redressal Officer, please provide:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-neutral-600">
              <li>Your registered patron name and phone number</li>
              <li>Order ID # (e.g. ORD-2026-1001) or Bill of Supply invoice number</li>
              <li>Detailed description of the grievance (delivery timeline, cut length, damaged parcel)</li>
              <li>Photographic evidence if fabric damage or package tampering is reported</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
