import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';

export const metadata = {
  title: 'Privacy Policy & Data Protection | KB FASHIONS',
  description: 'Statutory privacy disclosures, data governance standards, and cryptographic protection policies under the Information Technology Act 2000 and DPDP Act 2023.',
};

export default function PrivacyPolicyPage() {
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
            <span className="text-white font-medium">Privacy Policy</span>
          </div>

          <div className="flex items-start sm:items-center gap-4 pt-2">
            {/* Custom SVG Icon for Privacy (Cryptographic Shield & Lock) */}
            <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center shrink-0 shadow-inner">
              <svg className="w-8 h-8 text-neutral-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <circle cx="12" cy="11" r="2" />
                <path d="M12 13v3" />
              </svg>
            </div>

            <div>
              <div className="inline-block px-3 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase bg-neutral-800 text-neutral-300 border border-neutral-700 mb-1">
                IT Act 2000 (Sec 43A) • SPDI Rules 2011 • DPDP Act 2023
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Privacy Policy &amp; Data Protection
              </h1>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed pt-1">
            Official statutory privacy framework, purpose limitation, and cryptographic security guarantees for patrons of {store.officialName}.
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
            <Link href="/policies/privacy" className="bg-white text-black font-bold px-3.5 py-1.5 rounded-full shadow-xs">
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
        
        {/* Core Guarantee Highlight Card */}
        <div className="border-l-4 border-black bg-white border border-neutral-200/90 rounded-r-2xl p-5 shadow-xs hover-elevate-card space-y-2">
          <span className="font-black text-neutral-900 text-xs uppercase tracking-wider block">
            Core Guarantee: Absolute Non-Commercialization of Patron Data
          </span>
          <p className="text-neutral-700 text-xs leading-relaxed">
            {store.officialName} never sells, monetizes, rents, trades, or disseminates customer mobile numbers, delivery addresses, or purchase histories to third-party telemarketers, credit bureaus, or advertising networks. Your information is used strictly to fulfill handloom textile orders within our local delivery network.
          </p>
        </div>

        {/* 1. Legal Basis & Categories of Data Collected */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-3 hover-elevate-card">
          <h2 className="text-base sm:text-lg font-black text-neutral-900">
            1. Categories of Personal Data Collected
          </h2>
          <p className="text-neutral-700">
            In compliance with the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, we collect only necessary data:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-neutral-700">
            <li><strong>Identity &amp; Contact Information:</strong> Full name, verified mobile phone number, and authenticated email address for OTP issuance and order communication.</li>
            <li><strong>Physical Delivery Coordinates:</strong> House number, street landmark, village name, and postal PIN code (503145) to enable runner dispatch.</li>
            <li><strong>Transactional Records:</strong> Invoice numbers, ordered items, measurement lengths, payment reference IDs, and customer support ticket correspondence.</li>
          </ul>
        </div>

        {/* 2. Purpose Limitation */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-3 hover-elevate-card">
          <h2 className="text-base sm:text-lg font-black text-neutral-900">
            2. Purpose Limitation &amp; Lawful Processing
          </h2>
          <p className="text-neutral-700">
            Personal data collected by {store.officialName} is processed solely for lawful commercial fulfillment:
          </p>
          <ol className="list-decimal pl-5 space-y-1.5 text-neutral-700">
            <li>Generating statutory Bills of Supply as mandated by Indian commercial statutes.</li>
            <li>Routing local delivery runners to recipient doorsteps within our 10 km service territory.</li>
            <li>Issuing two-factor authentication OTPs (strictly valid for 5 minutes).</li>
            <li>Facilitating customer support inquiries and warranty resolution via our transparent ticket system.</li>
          </ol>
        </div>

        {/* 3. Cryptographic Security & Reasonable Measures */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-3 hover-elevate-card">
          <h2 className="text-base sm:text-lg font-black text-neutral-900">
            3. Cryptographic Security Standards (Section 43A IT Act)
          </h2>
          <p className="text-neutral-700">
            We maintain reasonable security practices and procedures as defined under Section 43A of the Information Technology Act, 2000:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-neutral-700">
            <li><strong>Salted Password Hashing:</strong> User passwords are never stored in plaintext. Passwords are cryptographically salted and hashed using bcrypt (cost factor 10).</li>
            <li><strong>Transport Layer Security:</strong> All data in transit between customer web browsers and our application servers is encrypted via TLS 1.3 with modern 256-bit cipher suites.</li>
            <li><strong>Tamper-Evident Audit Ledger:</strong> Administrative operations, status modifications, and support ticket activities are logged in an immutable SHA-256 cryptographic audit chain.</li>
            <li><strong>Zero Sensitive Payment Storage:</strong> Credit card numbers, debit card PINs, CVV codes, and netbanking credentials are processed exclusively on Cashfree Payments PCI-DSS Level 1 certified infrastructure.</li>
          </ul>
        </div>

        {/* 4. Patron Data Rights & Data Erasure */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-3 hover-elevate-card">
          <h2 className="text-base sm:text-lg font-black text-neutral-900">
            4. Data Principal Rights &amp; Account Erasure
          </h2>
          <p className="text-neutral-700">
            Under the Digital Personal Data Protection Act, 2023, patrons have the statutory right to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-neutral-700">
            <li>Access a summary of personal information processed by the platform.</li>
            <li>Request rectification of inaccurate delivery addresses or phone numbers via the Account portal.</li>
            <li>Request permanent account deactivation and data erasure, subject to mandatory statutory tax retention periods for Bills of Supply.</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
