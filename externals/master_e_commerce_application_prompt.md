# Master AI Prompt: Enterprise Production-Ready E-Commerce Platform with Govt Regulatory Verification & Payment Gateway Suite

## ROLE & SYSTEM OBJECTIVE

Act as a **Principal Software Architect, Fintech Compliance Officer, Legal Tech Designer, and Lead Frontend/Backend Engineer**. Your task is to design, architect, and build a full-stack, enterprise-grade e-commerce application for **"\[Brand/Platform Name\]"**.

The application must seamlessly handle consumer storefront workflows, multi-vendor merchant onboarding, government statutory compliance (e.g., Consumer Protection Rules, GST/VAT/Tax breakdown, Country of Origin mandates, Grievance Officer details), payment gateway approval workflows (Razorpay, Stripe, PayPal), and real-time administrative oversight.

## 1. MANDATORY FINTECH & GOVERNMENT COMPLIANCE CHECKLIST

Before payment gateways approve live merchant onboarding or auditing regulatory bodies grant authorization, the platform must embed the following mandatory artifacts out-of-the-box:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   ENTERPRISE COMPLIANCE & LEGAL ENGINE                      │
├─────────────────────────┬─────────────────────────┬─────────────────────────┤
│ Mandatory Statutory Pages│ Merchant Verification   │ Consumer Rights & Tax   │
│ - Terms & Conditions    │ - Legal Business Name   │ - Grievance Redressal   │
│ - Privacy Policy (DPDP) │ - Verified Tax ID/GSTIN │ - Country of Origin Tag │
│ - Return/Refund Policy  │ - MCA / Reg Certificate │ - Itemized Tax Invoice  │
│ - Shipping SLA Policy   │ - Verified Address & Bank│ - HSN / SAC Code Display│
└─────────────────────────┴─────────────────────────┴─────────────────────────┘

```

## 2. DETAILED FUNCTIONAL ARCHITECTURE BY MODULE

### A. Consumer Storefront & PDP Engine

1. **Dynamic PDP Statutory Mandates:**

   * **Country of Origin Tag:** Explicit badge on every PDP (e.g., `Country of Origin: India`).

   * **Manufacturer & Importer Details:** Expandable drawer displaying registered business entity name, factory/importer address, and support details.

   * **Inclusive Pricing Transparency:** Display total price with explicit `(Incl. of all taxes)` label alongside itemized base price + tax percentage breakdown.

   * **HSN / SAC Code:** Standardized classification tag required for statutory audit compliance.

   * **Perishable / Expiry Markers:** Dynamic dates required for cosmetics, consumables, or seasonal apparel.

2. **Interactive Browsing Mechanics:**

   * Multi-angle product media gallery, dynamic color/size swatch selector with live inventory check.

   * Filter catalog by Category, Size, Price Range, Rating, and **Verification Level** (*All*, *Govt Verified Sellers*, *GI Tagged / Artisans*).

   * Instant Search Overlay with key-value match for collections, tags, and product titles.

### B. Cart, Multi-Step Checkout & Invoicing Engine

1. **Multi-Step Checkout Pipeline:**

   * **Step 1: Customer Contact & Delivery Info:** Guest checkout option or OTP/Email auth, PIN code auto-fill (City/State), address line validation.

   * **Step 2: Business B2B Tax Credit Option:** Checkbox for *"Buying for Business? Add Tax ID / GSTIN for Input Tax Credit"*.

   * **Step 3: Transparent Order Summary:** Itemized base price, SGST/CGST/IGST or VAT calculation, shipping fee, discount coupon calculation, and total payable amount.

   * **Step 4: Payment Gateway SDK Integration:** Multi-option payment flow (UPI, Credit/Debit Cards, Net Banking, COD) with webhook status listeners (`payment.authorized`, `payment.captured`, `payment.failed`, `refund.processed`).

2. **Automated Statutory Tax Invoice Generator:**

   * Dynamic Printable/PDF Tax Invoice containing:

     * Seller Legal Name, Address, GSTIN/TIN.

     * Buyer Billing/Shipping Address and optional B2B Tax ID.

     * Sequential Invoice Number (e.g., `INV-2026-00842`), Date, HSN Code, Tax Rate breakdown.

     * Digital Signature / Authorized Stamp placeholder.

### C. Merchant Onboarding & Government Verification Engine (GVE)

1. **Multi-Step Vendor KYC Workflow:**

   * **Step 1: Business Identity:** Official Business Name, Registered Entity Type (LLP, Private Limited, Co-op).

   * **Step 2: Tax & Registration Input:** Tax ID (GSTIN/EIN/VAT) and Incorporation Certificate Number.

   * **Step 3: Quality & Statutory Certificates:** Upload workflows for quality standards (FSSAI, ISO, BIS, Handloom/Artisan Registration).

   * **Step 4: Status Tracker:** Real-time indicator (*Pending Verification*, *Query Raised*, *Officially Verified*).

2. **Public Transparency Lookup Portal:**

   * Dedicated `/verify-merchant` search permitting consumers to verify any merchant's official status, tax compliance health, and verification seal timestamp.

### D. Admin Governance & Fraud Monitoring Dashboard

1. **Verification Queue:** Review interface for approving/rejecting merchant tax documents with reason logs.

2. **Dispute & Refund Reconciliation:** 1-click refund initiator triggering automated gateway webhooks back to payment processors.

3. **Audit Ledger:** Immutable log recording all administrative modifications, compliance overrides, and merchant profile edits.

## 3. STRICT DESIGN SYSTEM & VISUAL ARCHITECTURE

Implement an authoritative, clean editorial design system using monochrome high-contrast neutral tokens with subtle trust accent badges:

```
:root {
  /* Core Surface Tokens */
  --bg-primary: #FAFAFA;
  --bg-card: #FFFFFF;
  --bg-surface-alt: #F4F4F1;
  --text-primary: #0F172A; /* Deep Slate Charcoal */
  --text-muted: #64748B;
  --border-light: #E2E8F0;

  /* Trust & Compliance Accents */
  --brand-black: #111111;
  --govt-blue: #1E3A8A; /* Official Trust Blue */
  --verified-emerald: #047857; /* Verified Seal Green */
  --verified-emerald-bg: #ECFDF5;
  --gold-accent: #B45309;

  /* Typography & Geometry */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --radius-pill: 9999px;
  --radius-lg: 28px;
  --radius-md: 20px;
  --radius-sm: 12px;
}

```

## 4. DATA SCHEMAS (JSON SPECIFICATION)

### Product Object with Statutory & Verification Metadata

```
{
  "product_id": "PRD-8821",
  "merchant_id": "MCH-2026-9041",
  "title": "Essential Combed Cotton Oversized Tee",
  "price": 499.00,
  "currency": "INR",
  "category": "Men",
  "tags": ["BESTSELLER", "NEW"],
  "hsn_code": "61091000",
  "country_of_origin": "India",
  "is_govt_verified_seller": true,
  "tax_rate_percent": 18,
  "sizes": ["S", "M", "L", "XL"],
  "rating": 4.8,
  "stock_quantity": 45,
  "manufacturer_details": "KB Retail Pvt Ltd, 42 Industrial Layout, Bengaluru 560038"
}

```

### Statutory Tax Invoice Object

```
{
  "order_id": "ORD-2026-9901",
  "invoice_number": "INV-2026-00842",
  "created_at": "2026-10-17T10:00:00Z",
  "seller": {
    "legal_name": "KB Retail Private Limited",
    "gstin": "29AAAAA0000A1Z5",
    "address": "42, Industrial Layout, Indiranagar, Bengaluru, KA 560038",
    "support_email": "support@kbonline.com"
  },
  "customer": {
    "name": "Rahul Sharma",
    "phone": "+91 9876543210",
    "shipping_address": "Flat 302, Green Acres, Bengaluru, KA 560038",
    "b2b_gstin": "27BBBBB1111B2Z2"
  },
  "items": [
    {
      "product_id": "PRD-8821",
      "hsn_code": "61091000",
      "title": "Essential Combed Cotton Oversized Tee",
      "qty": 2,
      "unit_price": 422.88,
      "tax_amount": 152.24,
      "total_amount": 998.00
    }
  ],
  "financials": {
    "subtotal": 845.76,
    "cgst": 76.12,
    "sgst": 76.12,
    "shipping_fee": 0,
    "total_paid": 998.00,
    "payment_method": "UPI_GATEWAY",
    "status": "PAID"
  }
}

```

## 5. DIRECTIVES FOR CODE GENERATION

When executing this prompt:

1. **Single-Page Application (SPA):** Build using HTML5, Tailwind CSS, Vanilla JS / React, and Canvas-based Chart.js for analytics dashboarding.

2. **Zero Missing Legal Artifacts:** Include embedded full-text modals for Privacy Policy, Terms of Service, Grievance Officer details, Return & Shipping rules.

3. **Touch Ergonomics:** Include sticky frosted navigation header, desktop drawer triggers, and a thumb-friendly mobile bottom navigation bar (`<= 520px`).

4. **Persistence:** Persist cart, wishlist, address fields, and customer state in `localStorage`.