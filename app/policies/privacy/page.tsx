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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Breadcrumb */}
      <div className="text-xs text-neutral-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <span className="text-black font-semibold">Privacy Policy</span>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-12 shadow-sm space-y-8 text-neutral-800 leading-relaxed text-sm">
        <div className="border-b border-slate-200 pb-6">
          <div className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-kb-blue border border-blue-200 mb-3">
            STATUTORY COMPLIANCE • IT ACT 2000 &amp; SPDI RULES 2011
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-kb-black">Privacy Policy &amp; Data Protection</h1>
          <p className="text-xs text-neutral-500 mt-2">
            Last Updated: October 2026 • Official Governance of {store.officialName}
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-black">1. Preamble &amp; Scope</h2>
          <p>
            {store.officialName} (&quot;KB FASHIONS&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), operating from {store.address}, is committed to honoring and safeguarding the privacy of our patrons, online visitors, and retail customers. This Privacy Policy details our practices regarding the collection, processing, storage, and protection of personal data in compliance with the Information Technology Act, 2000, and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 (&quot;SPDI Rules&quot;).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-black">2. Information We Collect</h2>
          <p>We collect only the minimum personal data strictly necessary to fulfill e-commerce services, calculate consignment delivery, and provide legitimate customer assistance:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-neutral-600">
            <li><strong>Identity &amp; Contact:</strong> Full name, telephone number (for SMS/WhatsApp delivery updates), and email address.</li>
            <li><strong>Delivery Addresses:</strong> Village, town, house/plot number, mandal, district, state, and postal PIN code.</li>
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
          <h2 className="text-base font-bold text-black">4. Data Storage &amp; Reasonable Security Practices</h2>
          <p>
            All customer records and uploaded assets are stored within hardened PostgreSQL databases. Passwords are salted and hashed utilizing bcrypt. Authentication tokens are digitally signed with industry-standard cryptographic algorithms. We enforce rate-limiting, session protection, and automated 10-minute freezes on accounts experiencing excessive failed authentication attempts.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-black">5. Non-Disclosure &amp; Third-Party Transfers</h2>
          <p>
            We do not sell, rent, monetize, or trade customer information to any marketing brokers or third parties. Delivery coordinates and phone numbers are shared strictly with our contracted shipping partners (Telangana Postal Logistics / Express Couriers) solely for the purpose of doorstep consignment delivery.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-black">6. Grievance Officer</h2>
          <p>
            In accordance with Rule 5(9) of the SPDI Rules and the Consumer Protection (E-Commerce) Rules, 2020, questions, access requests, or privacy grievances may be addressed to:
          </p>
          <div className="p-4 rounded-2xl bg-neutral-50 border border-slate-200 text-xs space-y-1">
            <div className="font-bold text-black">Grievance Redressal Officer: Sri K. Balaram</div>
            <div>{store.officialName}</div>
            <div>{store.address}</div>
            <div>Email: <a href={`mailto:${store.contactEmail}`} className="text-kb-blue underline">{store.contactEmail}</a></div>
            <div>Phone: <span className="font-mono">{store.contactPhone}</span></div>
          </div>
        </section>
      </div>
    </div>
  );
}

