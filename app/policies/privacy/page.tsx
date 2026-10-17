import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';

export default function PrivacyPolicyPage() {
  const store = db.storeSettings;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-kb-blue text-xs font-bold uppercase tracking-wider">
          Statutory Compliance • IT Act 2000
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-kb-black tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-neutral-500 font-mono">
          Last Updated: October 2026 • Official Policy of {store.officialName}
        </p>
      </div>

      {/* Body Content */}
      <div className="prose prose-sm max-w-none text-neutral-700 space-y-6 text-xs sm:text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-kb-black">1. Introduction & Enterprise Scope</h2>
          <p>
            Welcome to <strong>{store.officialName}</strong> (“we,” “our,” or “us”), an ancestral textile occupation business operating from <strong>{store.address}</strong>. We are committed to protecting your privacy and ensuring your personal information is collected, stored, and processed securely in compliance with the Information Technology Act, 2000, and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.
          </p>
          <p>
            This Privacy Policy governs your use of our e-commerce platform, our WhatsApp/SMS order notifications, and our voice shopping assistant (KB Shopmate AI).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-kb-black">2. Information We Collect</h2>
          <p>We collect only the minimum information necessary to fulfill your apparel orders and provide authentic customer service:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
            <li><strong>Personal Identifiers:</strong> Name, contact phone number, email address, and profile picture (stored securely in our database).</li>
            <li><strong>Delivery Addresses:</strong> Street address, village/city, mandal, district, state, and 6-digit postal PIN code for parcel delivery.</li>
            <li><strong>Order & Transaction Records:</strong> Garment selections, unstitched meter cuts, invoice numbers (Bill of Supply), and payment reference tokens.</li>
            <li><strong>Security & Authentication:</strong> Passwords encrypted using industry-standard bcrypt hashing, OTPs for one-time verification.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-kb-black">3. Payment Information & PCI-DSS Compliance</h2>
          <p>
            <strong>We do not store your raw Credit/Debit card numbers, CVV codes, or net banking passwords.</strong>
          </p>
          <p>
            All digital payment transactions (UPI, Cards, Net Banking) are securely processed via RBI-authorized payment aggregators (e.g., Cashfree Payments, Razorpay) compliant with the Payment Card Industry Data Security Standard (PCI-DSS Level 1).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-kb-black">4. Purpose & Use of Data</h2>
          <p>Your data is collected strictly for:</p>
          <ul className="list-disc pl-5 space-y-1 text-neutral-600">
            <li>Packaging and dispatching sarees, unstitched fabrics, and apparel from our Kalwaral store.</li>
            <li>Generating statutory retail Bills of Supply under Section 23 of the CGST Act.</li>
            <li>Sending consignment tracking numbers and stage milestone updates via SMS/WhatsApp.</li>
            <li>Customer support and grievance resolution within statutory timelines.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-kb-black">5. Data Retention & Security Practices</h2>
          <p>
            Your account data, profile images, and order histories are stored in enterprise-grade PostgreSQL relational databases with encrypted connections (SSL/TLS). Audit logs are cryptographically hashed to guarantee data integrity against unauthorized alterations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-kb-black">6. Grievance Redressal Officer Contact</h2>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2 text-xs">
            <div className="font-bold text-black text-sm">Grievance Redressal Officer (Rule 5(9) of IT Rules 2011)</div>
            <div><strong>Name:</strong> Sri K. Balaram / Grievance Officer, KB FASHIONS</div>
            <div><strong>Physical Address:</strong> {store.address}</div>
            <div><strong>Email:</strong> <a href={`mailto:${store.contactEmail}`} className="text-kb-blue underline">{store.contactEmail}</a></div>
            <div><strong>Helpline Phone:</strong> {store.contactPhone} (Mon–Sat, 9:00 AM – 7:00 PM IST)</div>
            <div className="text-neutral-500 text-[11px] pt-1">
              Complaints are acknowledged within 48 hours and resolved within 30 days as mandated by Indian Law.
            </div>
          </div>
        </section>
      </div>

      <div className="pt-6 border-t border-slate-200 flex justify-between items-center text-xs">
        <Link href="/" className="text-neutral-600 hover:text-black font-semibold">
          ← Back to Shopping
        </Link>
        <Link href="/policies/terms" className="text-kb-blue hover:underline font-bold">
          View Terms &amp; Conditions →
        </Link>
      </div>
    </div>
  );
}
