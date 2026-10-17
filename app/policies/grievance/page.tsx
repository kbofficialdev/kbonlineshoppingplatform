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
    <div className="space-y-8 pb-20 bg-[#FAF9F6] min-h-screen">
      {/* Policy Hero Banner with Royal Purple-Violet Gradient */}
      <section className="bg-gradient-to-r from-[#17092B] via-[#2A104E] to-[#140625] text-white border-b border-purple-900/50 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="text-xs text-purple-300 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/policies/terms" className="hover:text-white transition-colors">Policies</Link>
            <span>/</span>
            <span className="text-white font-semibold">Grievance Redressal</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-200 border border-purple-400/30">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            <span>RULE 5(9) CONSUMER PROTECTION (E-COMMERCE) RULES 2020 DISCLOSURE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Consumer Grievance Redressal Mechanism
          </h1>
          <p className="text-sm text-purple-100/90 max-w-3xl leading-relaxed">
            Statutory Nodal Grievance Redressal Officer &amp; Dispute Resolution Framework for {store.officialName}, Kalwaral Village.
          </p>

          {/* Quick Policy Navigation Strip */}
          <div className="pt-3 flex flex-wrap gap-2 text-xs">
            <Link href="/policies/shipping" className="bg-white/10 hover:bg-white/20 text-white font-medium px-3 py-1.5 rounded-full border border-white/15 transition-colors">
              🚚 Shipping &amp; 10 km
            </Link>
            <Link href="/policies/refunds" className="bg-white/10 hover:bg-white/20 text-white font-medium px-3 py-1.5 rounded-full border border-white/15 transition-colors">
              ↩️ 7-Day Returns
            </Link>
            <Link href="/policies/grievance" className="bg-white text-black font-bold px-3 py-1.5 rounded-full shadow-sm">
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
        
        {/* Officer Contact Card (Dynamically Loaded from DB) */}
        <div className="bg-gradient-to-br from-white to-purple-50/50 border-2 border-purple-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-purple-100 pb-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-900 to-indigo-950 text-white flex items-center justify-center font-black text-2xl shadow-md border border-purple-300">
                ⚖️
              </div>
              <div>
                <div className="text-xl font-black text-neutral-900">{store.officialName || 'KB FASHIONS'}</div>
                <div className="text-xs font-bold text-purple-700">{store.grievanceOfficerDesignation || 'Designated Grievance Redressal Officer & Managing Proprietorship'}</div>
              </div>
            </div>

            <Link
              href="/support"
              className="px-5 py-2.5 rounded-full bg-purple-900 text-white font-bold text-xs hover:bg-purple-950 transition-colors shadow-sm inline-flex items-center gap-1.5"
            >
              <span>🎫</span>
              <span>Open Online Support Ticket →</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-4 rounded-2xl border border-purple-100 space-y-1">
              <span className="text-neutral-400 font-bold block text-[10px] uppercase">Official Email</span>
              <a href={`mailto:${store.grievanceOfficerEmail}`} className="font-bold text-purple-900 hover:underline break-all">
                {store.grievanceOfficerEmail || 'kb.official.admin@gmail.com'}
              </a>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-purple-100 space-y-1">
              <span className="text-neutral-400 font-bold block text-[10px] uppercase">Direct Helpline</span>
              <a href={`tel:${store.grievanceOfficerPhone}`} className="font-bold text-purple-900 hover:underline">
                {store.grievanceOfficerPhone || '+91 7989768200'}
              </a>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-purple-100 space-y-1">
              <span className="text-neutral-400 font-bold block text-[10px] uppercase">Acknowledgement SLA</span>
              <div className="font-bold text-emerald-700">Within 48 Hours</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-purple-100 space-y-1">
              <span className="text-neutral-400 font-bold block text-[10px] uppercase">Redressal Mandate</span>
              <div className="font-bold text-emerald-700">Within 30 Calendar Days</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-purple-100 text-xs text-neutral-600 flex items-start gap-2">
            <span className="text-amber-500">📍</span>
            <span><strong>Physical Chamber &amp; Post Address:</strong> {store.grievanceOfficerAddress || store.address}</span>
          </div>
        </div>

        {/* Escalation Matrix Table */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-lg">
              📈
            </div>
            <div>
              <h2 className="text-base font-black text-neutral-900">Three-Tier Dispute Escalation Matrix</h2>
              <p className="text-xs text-neutral-500">Transparent consumer redressal hierarchy under Government of India guidelines</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 text-xs">
            <table className="w-full text-left divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-700 font-bold">
                <tr>
                  <th className="p-3.5">Escalation Tier</th>
                  <th className="p-3.5">Responsible Desk</th>
                  <th className="p-3.5">Resolution Window</th>
                  <th className="p-3.5">Channel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-neutral-800">
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-bold text-blue-700">Level 1: Support Desk</td>
                  <td className="p-3.5">Kalwaral Village Customer Service Team</td>
                  <td className="p-3.5 font-semibold text-emerald-700">Within 24 Hours</td>
                  <td className="p-3.5">
                    <Link href="/support" className="underline font-bold text-blue-600">Online Support Ticket</Link> / Helpline
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-bold text-purple-700">Level 2: Grievance Officer</td>
                  <td className="p-3.5">{store.grievanceOfficerName} ({store.grievanceOfficerDesignation})</td>
                  <td className="p-3.5 font-semibold text-emerald-700">Ack: 48h • Final: 15–30 Days</td>
                  <td className="p-3.5">{store.grievanceOfficerEmail}</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-bold text-neutral-900">Level 3: Statutory Authority</td>
                  <td className="p-3.5">National Consumer Helpline (NCH, Govt of India) / Consumer Forum</td>
                  <td className="p-3.5 font-semibold">Statutory Judicial SLA</td>
                  <td className="p-3.5">Toll-free 1915 / consumerhelpline.gov.in</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
