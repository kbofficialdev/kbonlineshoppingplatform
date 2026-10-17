import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';

export const metadata = {
  title: 'Privacy Policy | KB FASHIONS',
  description: 'Official statutory privacy policy and data governance practices of KB FASHIONS, Kalwaral, Telangana.',
};

export default function PrivacyPolicyPage() {
  const store = db.storeSettings;

  return (
    <div className="space-y-8 pb-16">
      {/* Policy Hero Banner with Gradient Background */}
      <section className="bg-gradient-to-r from-[#0B1528] via-[#0F2654] to-[#07101F] text-white border-b border-blue-900/40 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-xs text-blue-300 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/policies" className="hover:text-white transition-colors">Policies</Link>
            <span>/</span>
            <span className="text-white font-semibold">Privacy Policy</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-200 border border-blue-400/30">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            IT ACT 2000 &amp; SPDI RULES 2011 COMPLIANT
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Privacy Policy &amp; Data Protection
          </h1>
          <p className="text-sm text-blue-200/80 max-w-2xl leading-relaxed">
            Statutory privacy notice, data minimization guarantees, and cryptographic protection standards for patrons of {store.officialName}.
          </p>
        </div>
      </section>

      {/* Main Content Card */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-12 shadow-sm space-y-8 text-neutral-800 leading-relaxed text-sm">
          <div className="border-b border-slate-200 pb-4 flex justify-between items-center text-xs text-neutral-500">
            <span>Official Governance: {store.officialName}</span>
            <span>Last Updated: {new Date(store.updatedAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
          </div>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-black">1. Preamble &amp; Scope</h2>
            <p>
              <strong>{store.officialName}</strong> (&quot;KB FASHIONS&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), operating from {store.address}, is committed to honoring and safeguarding the privacy of our patrons, online visitors, and retail customers. This Privacy Policy details our practices regarding the collection, processing, storage, and protection of personal data in compliance with the Information Technology Act, 2000, and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 (&quot;SPDI Rules&quot;).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-black">2. Information We Collect</h2>
            <p>We collect only the minimum personal data strictly necessary to fulfill e-commerce services, calculate consignment delivery, and provide legitimate customer assistance:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-neutral-600">
              <li><strong>Identity &amp; Contact:</strong> Full name, telephone number (for SMS/WhatsApp delivery updates), and email address.</li>
              <li><strong>Delivery Addresses:</strong> Village, town, house/plot number, mandal, district, state, and postal PIN code ({store.pinCode} primary hub).</li>
              <li><strong>Transactional Records:</strong> Order identification, items purchased, meter cut lengths, and payment reference tokens.</li>
              <li><strong>Account Media:</strong> Profile avatar pictures uploaded voluntarily by users and stored securely in our database.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-black">3. Payment Information &amp; PCI-DSS Compliance</h2>
            <p>
              KB FASHIONS <strong>does not collect, store, or process raw credit card numbers, debit card PINs, or CVV codes</strong> on our servers. All electronic payments (UPI, Debit/Credit Card, Net Banking) are conducted via RBI-authorized, PCI-DSS Level 1 compliant Payment Aggregators (e.g. Cashfree, Razorpay). Only masked transaction identifiers and settlement statuses are retained for statutory accounting.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-black">4. Data Storage &amp; Cryptographic Security</h2>
            <p>
              All customer database records, session tokens, and passwords are protected with industry-standard SHA-256 and bcrypt hashing algorithms. Sensitive operations (such as login and password changes) are secured with time-limited OTP tokens and automatic 10-minute freezes upon unauthorized brute-force attempts.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-black">5. Grievance Officer &amp; Contact Desk</h2>
            <p>
              Inquiries regarding personal data handling or requests to erase account data may be directed to our Nodal Grievance Officer:
            </p>
            <div className="bg-neutral-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
              <div><strong className="text-black">Officer:</strong> {store.grievanceOfficerName || 'Sri K. Balaram'}</div>
              <div><strong className="text-black">Designation:</strong> {store.grievanceOfficerDesignation || 'Grievance Redressal Officer'}</div>
              <div><strong className="text-black">Email:</strong> <a href={`mailto:${store.grievanceOfficerEmail || store.contactEmail}`} className="text-blue-700 underline font-mono">{store.grievanceOfficerEmail || store.contactEmail}</a></div>
              <div><strong className="text-black">Helpline:</strong> {store.grievanceOfficerPhone || store.contactPhone}</div>
              <div><strong className="text-black">Physical Chamber:</strong> {store.grievanceOfficerAddress || store.address}</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
