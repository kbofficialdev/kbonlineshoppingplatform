import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';

export const metadata = {
  title: 'Privacy Policy & Data Governance | KB FASHIONS',
  description: 'Official statutory privacy policy and data governance practices of KB FASHIONS, Kalwaral, Telangana.',
};

export default function PrivacyPolicyPage() {
  const store = db.storeSettings;

  return (
    <div className="space-y-8 pb-20 bg-[#FAF9F6] min-h-screen">
      {/* Policy Hero Banner with Midnight-Navy Gradient */}
      <section className="bg-gradient-to-r from-[#071326] via-[#0E2856] to-[#050E1C] text-white border-b border-blue-900/50 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="text-xs text-blue-300 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/policies/terms" className="hover:text-white transition-colors">Policies</Link>
            <span>/</span>
            <span className="text-white font-semibold">Privacy Policy</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-200 border border-blue-400/30">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span>IT ACT 2000 &amp; SPDI RULES 2011 COMPLIANT • ZERO DATA RESALE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Privacy Policy &amp; Data Protection
          </h1>
          <p className="text-sm text-blue-100/90 max-w-3xl leading-relaxed">
            Statutory privacy notice, data minimization guarantees, and cryptographic protection standards for patrons of {store.officialName}.
          </p>

          {/* Quick Policy Navigation Strip */}
          <div className="pt-3 flex flex-wrap gap-2 text-xs">
            <Link href="/policies/shipping" className="bg-white/10 hover:bg-white/20 text-white font-medium px-3 py-1.5 rounded-full border border-white/15 transition-colors">
              🚚 Shipping &amp; 10 km
            </Link>
            <Link href="/policies/refunds" className="bg-white/10 hover:bg-white/20 text-white font-medium px-3 py-1.5 rounded-full border border-white/15 transition-colors">
              ↩️ 7-Day Returns
            </Link>
            <Link href="/policies/grievance" className="bg-white/10 hover:bg-white/20 text-white font-medium px-3 py-1.5 rounded-full border border-white/15 transition-colors">
              ⚖️ Grievance Officer
            </Link>
            <Link href="/policies/terms" className="bg-white/10 hover:bg-white/20 text-white font-medium px-3 py-1.5 rounded-full border border-white/15 transition-colors">
              📜 Terms of Sale
            </Link>
            <Link href="/policies/privacy" className="bg-white text-black font-bold px-3 py-1.5 rounded-full shadow-sm">
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
        
        {/* Governance & Compliance Header Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
          <div>
            <span className="font-bold text-neutral-900 block">Data Controller:</span>
            <span className="text-neutral-500">{store.officialName} ({store.village}, {store.district}, Telangana)</span>
          </div>
          <div className="text-neutral-500 sm:text-right">
            <span>Governance Standard: </span>
            <strong className="text-emerald-700">Digital Personal Data Protection (DPDP) Aligned</strong>
          </div>
        </div>

        {/* 1. Core Privacy Commitments (3-Column Colored Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-5 space-y-2 text-emerald-950">
            <div className="text-xl">🚫</div>
            <div className="font-black text-emerald-900">Zero Data Resale</div>
            <p className="text-[11px] text-emerald-900/80 leading-relaxed">
              We never sell, rent, lease, or monetize your contact numbers or addresses with marketing brokers or advertisers.
            </p>
          </div>

          <div className="bg-blue-50 border-2 border-blue-300 rounded-3xl p-5 space-y-2 text-blue-950">
            <div className="text-xl">🔐</div>
            <div className="font-black text-blue-900">Cryptographic Defense</div>
            <p className="text-[11px] text-blue-900/80 leading-relaxed">
              Account passwords are encrypted with bcrypt hashing. Transmissions are guarded by end-to-end TLS 1.3 encryption.
            </p>
          </div>

          <div className="bg-purple-50 border-2 border-purple-300 rounded-3xl p-5 space-y-2 text-purple-950">
            <div className="text-xl">⚡</div>
            <div className="font-black text-purple-900">5-Minute OTP Privacy</div>
            <p className="text-[11px] text-purple-900/80 leading-relaxed">
              Authentication passcodes and verification tokens automatically expire in exactly 5 minutes, mitigating session hijacking.
            </p>
          </div>
        </div>

        {/* 2. Information Collected Table (Slate & Blue) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-lg">
              📋
            </div>
            <div>
              <h2 className="text-base font-black text-neutral-900">Data Categories Collected &amp; Purpose</h2>
              <p className="text-xs text-neutral-500">Only the minimum data required to execute legal sales and courier dispatches</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 text-xs">
            <table className="w-full text-left divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-700 font-bold">
                <tr>
                  <th className="p-3.5">Data Category</th>
                  <th className="p-3.5">Specific Fields</th>
                  <th className="p-3.5">Processing Purpose</th>
                  <th className="p-3.5">Retention Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-neutral-800">
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-bold">Patron Identity</td>
                  <td className="p-3.5">Full Legal Name, Email, Phone Number</td>
                  <td className="p-3.5">Account security, order OTP verification &amp; delivery SMS</td>
                  <td className="p-3.5">Duration of active account</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-bold">Consignment Address</td>
                  <td className="p-3.5">House/Street, Village, District, State, PIN (503145)</td>
                  <td className="p-3.5">Doorstep delivery routing &amp; India Post parcel manifest</td>
                  <td className="p-3.5">Statutory tax audit period (7 yrs)</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-bold">Transaction Record</td>
                  <td className="p-3.5">Order ID, Fabric Cut Metres, Saree ID, Bill of Supply</td>
                  <td className="p-3.5">Fulfillment, 7-day return verification, invoice records</td>
                  <td className="p-3.5">Permanent accounting archive</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
