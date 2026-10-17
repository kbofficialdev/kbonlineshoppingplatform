import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';

export default function GrievanceRedressalPage() {
  const store = db.storeSettings;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-kb-violet text-xs font-bold uppercase tracking-wider">
          Consumer Protection (E-Commerce) Rules, 2020 • Rule 5(4)
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-kb-black tracking-tight">
          Grievance Redressal &amp; Nodal Officer
        </h1>
        <p className="text-xs text-neutral-500 font-mono">
          Statutory Disclosure for Consumer Complaints &amp; Disputes
        </p>
      </div>

      {/* Body Content */}
      <div className="prose prose-sm max-w-none text-neutral-700 space-y-6 text-xs sm:text-sm leading-relaxed">
        <section className="space-y-3">
          <p>
            In compliance with the <strong>Consumer Protection Act, 2019</strong> and the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>, <strong>{store.officialName}</strong> has established a dedicated Grievance Redressal Mechanism to address customer complaints fairly, transparently, and expeditiously.
          </p>
        </section>

        {/* Official Officer Profile Box */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-neutral-900 flex items-center justify-center text-2xl font-bold text-white shrink-0">
              ⚖️
            </div>
            <div>
              <h2 className="text-lg font-bold text-black">Sri K. Balaram</h2>
              <div className="text-xs text-neutral-500 font-semibold">
                Designated Grievance Redressal Officer &amp; Nodal Contact
              </div>
              <div className="text-[11px] text-kb-blue font-mono font-bold mt-0.5">
                {store.officialName} • Ancestral Textile Business
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
            <div>
              <span className="text-neutral-400 block text-[10px] font-bold uppercase tracking-wider">Physical Official Address</span>
              <span className="text-neutral-800 font-medium leading-relaxed">
                {store.address}
              </span>
            </div>

            <div>
              <span className="text-neutral-400 block text-[10px] font-bold uppercase tracking-wider">Email for Consumer Complaints</span>
              <a href={`mailto:${store.contactEmail}`} className="text-kb-blue font-bold font-mono underline">
                {store.contactEmail}
              </a>
            </div>

            <div>
              <span className="text-neutral-400 block text-[10px] font-bold uppercase tracking-wider">Telephone &amp; WhatsApp Line</span>
              <span className="font-mono font-bold text-black">
                {store.contactPhone}
              </span>
            </div>

            <div>
              <span className="text-neutral-400 block text-[10px] font-bold uppercase tracking-wider">Office Hours</span>
              <span className="text-neutral-800">
                Monday through Saturday, 9:00 AM – 7:00 PM IST
              </span>
            </div>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-kb-black">Complaint Resolution Timelines &amp; Escalation Process</h2>
          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-kb-blue text-white flex items-center justify-center font-bold text-xs shrink-0">1</span>
              <div>
                <strong className="text-black">Acknowledgment within 48 Hours:</strong>
                <p className="text-neutral-600 mt-0.5">
                  Upon receiving a complaint regarding product quality, delivery transit, or refund settlement, our Grievance Officer will issue a unique Ticket Reference Number via email or SMS within 48 hours.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-kb-blue text-white flex items-center justify-center font-bold text-xs shrink-0">2</span>
              <div>
                <strong className="text-black">Resolution within 30 Days:</strong>
                <p className="text-neutral-600 mt-0.5">
                  Every consumer dispute is thoroughly reviewed in coordination with our weavers and logistics partners, with a complete final resolution provided within a maximum of 30 days from receipt.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-kb-black">National Consumer Helpline (NCH) Escalation</h2>
          <p>
            If you remain unsatisfied with the internal resolution, you may also approach the National Consumer Helpline at <a href="https://consumerhelpline.gov.in" target="_blank" rel="noopener noreferrer" className="text-kb-blue underline">consumerhelpline.gov.in</a> or toll-free at <strong>1915</strong>.
          </p>
        </section>
      </div>

      <div className="pt-6 border-t border-slate-200 flex justify-between items-center text-xs">
        <Link href="/policies/shipping" className="text-neutral-600 hover:text-black font-semibold">
          ← Shipping Policy
        </Link>
        <Link href="/policies/statutory-declaration" className="text-kb-blue hover:underline font-bold">
          Statutory Tax Exemption Declaration →
        </Link>
      </div>
    </div>
  );
}
