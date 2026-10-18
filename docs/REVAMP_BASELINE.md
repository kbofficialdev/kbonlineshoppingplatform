# KB FASHIONS — REVAMP BASELINE & DISCOVERY REPORT

**Document ID:** `docs/REVAMP_BASELINE.md`  
**Date:** October 18, 2026  
**Environment:** Linux (Ubuntu 24.04 LTS), Node.js v20+, Next.js 14.2.15, PostgreSQL 16.15 (Local) & PostgreSQL 17.9 (AWS RDS ap-southeast-2)  
**Target Domain:** `https://kbfashions.in` (Configurable via environment variables)  
**Repository Remote:** `https://github.com/kbofficialdev/kbonlineshoppingplatform.git` (`main` branch)

---

## 1. Current Architecture Overview

KB FASHIONS is an ecommerce platform built as a full-stack Next.js application using the App Router architecture.

- **Frontend Framework:** Next.js 14.2.15 with React 18, TypeScript 5.3.3.
- **Styling & Design System:** Tailwind CSS v3.4.19 with Autoprefixer and PostCSS. Custom theme extensions mapped in `tailwind.config.js`.
- **Backend & APIs:** Next.js Route Handlers (`app/api/**/route.ts`) providing REST endpoints for Authentication, Catalog, Cart, Checkout, Cashfree Payments, Orders, Support Desk, and Admin Operations.
- **Authentication & Security:** JWT-based bearer authentication (`jsonwebtoken`), bcrypt password hashing (`bcryptjs`), OTP email verification via Nodemailer, Indian mobile number E.164 normalization (`+91`), and SHA-256 cryptographic audit logs with previous-hash chain verification.
- **Database & Persistence:**
  - Prisma Schema: `prisma/schema.prisma` defining PostgreSQL relational schema (`StoreSettings`, `User`, `Address`, `PaymentMethod`, `Product`, `ProductImage`, `Category`, `CartItem`, `Order`, `OrderItem`, `OrderTimelineEvent`, `RefundRequest`, `AuditLog`, `Banner`, `SupportTicket`, `TicketMessage`).
  - Active runtime data access layer: `lib/db.ts` utilizing an in-memory transactional ORM with atomic snapshots, currently serializing disk state to `data/store_db.json`.
  - AWS RDS PostgreSQL: Host `kbonlineshoppingplatform-db-instance-1.cl0wcim2kxoj.ap-southeast-2.rds.amazonaws.com:5432/postgres` with dynamic IAM SigV4 token caching (`lib/rds.ts`).
  - Dedicated Local PostgreSQL instance: Port 5433, database `kbfashions` (PostgreSQL 16.15).
- **Payment Gateway:** Cashfree Payments Hosted Checkout (`API Version 2026-01-01`), server-side order token generation (`/pg/orders`), cryptographic signature verification, return handling (`/checkout/cashfree-return`), and webhook notifications (`/api/payments/cashfree/webhook`).

---

## 2. Existing Route Inventory

The repository contains 71 production-compiled routes across customer-facing, administration, authentication, and statutory policy pages:

### Customer & Storefront Routes
- `/` (`app/page.tsx`): Main storefront and landing page.
- `/search` (`app/search/page.tsx`): Category browsing, keyword search, price & availability filtering.
- `/products/[id]` (`app/products/[id]/page.tsx`): Product details, variant selection, reviews, image gallery, Add to Cart / Buy Now.
- `/cart` (`app/cart/page.tsx`): Shopping bag, quantity modifiers, promo code application, order summary.
- `/checkout` (`app/checkout/page.tsx`): Multi-step checkout with address selection, 10km village delivery eligibility, and Cashfree hosted payment.
- `/checkout/cashfree-return` (`app/checkout/cashfree-return/page.tsx`): Cashfree payment redirect return verification and order placement confirmation.
- `/orders/[id]` (`app/orders/[id]/page.tsx`): Customer order receipt, tracking timeline, and invoice generation.
- `/invoices/[orderId]` (`app/invoices/[orderId]/page.tsx`): Printable statutory tax/bill-of-supply invoice.
- `/wishlist` (`app/wishlist/page.tsx`): Customer saved products and favorites.
- `/support` (`app/support/page.tsx`): Streamlined patron & guest support desk, public ticket reference search (`TKT-2026-XXXXX`), artisan messaging, and Rule 5(9) grievance submission.
- `/about` (`app/about/page.tsx`): Brand heritage, Kalwaral village artisan story.
- `/contact` (`app/contact/page.tsx`): Physical store address, phone, email, and map location.

### Customer Account Routes
- `/account` (`app/account/page.tsx`): Customer dashboard, profile editing, address book, saved payment methods, security settings.
- `/account/orders` (`app/account/orders/page.tsx`): Full order history and order tracking.

### Admin Governance & Store Operations Routes
- `/admin` (`app/admin/page.tsx`): Store executive metrics, revenue trends, top-selling products, operational shortcuts.
- `/admin/products` (`app/admin/products/page.tsx`): Product catalog management, inventory levels, pricing.
- `/admin/products/new` (`app/admin/products/new/page.tsx`): New product creation with image uploads and variant specifications.
- `/admin/products/[id]/edit` (`app/admin/products/[id]/edit/page.tsx`): Product editing.
- `/admin/orders` (`app/admin/orders/page.tsx`): Order lifecycle management (Confirm, Dispatch, Out for Delivery, Deliver, Cancel).
- `/admin/orders/[id]` (`app/admin/orders/[id]/page.tsx`): Order detail view with timeline controller and customer contact.
- `/admin/customers` (`app/admin/customers/page.tsx`): Customer account directory and status.
- `/admin/refunds` (`app/admin/refunds/page.tsx`): Refund request approval and Cashfree refund processing.
- `/admin/support` (`app/admin/support/page.tsx`): Admin support desk console for ticket resolution and patron replies.
- `/admin/settings` (`app/admin/settings/page.tsx`): Store configuration, local 10km village delivery radius, grievance officer statutory details.
- `/admin/alerts` (`app/admin/alerts/page.tsx`): Store broadcast announcements and top-bar notifications.

### Authentication & Policy Routes
- `/auth/signin`, `/auth/signup`, `/auth/forgot-password`, `/auth/reset-password`.
- `/policies/terms`, `/policies/privacy`, `/policies/shipping`, `/policies/refunds`, `/policies/grievance`, `/policies/statutory-declaration`.

---

## 3. Existing Database & Persistence Dependencies

1. **`lib/db.ts` Persistence:**
   - In-memory relational state initialized with seed data.
   - Synchronous file persistence reading and writing `data/store_db.json`.
   - **Target Phase 10 Action:** Remove file-based runtime dependency entirely. Connect persistent reads and writes directly to PostgreSQL via Prisma Client / PG pool.
2. **PostgreSQL Schema (`prisma/schema.prisma`):**
   - 16 distinct models fully aligned with application entities.
   - Migrations and DDL defined in `scripts/migrate-to-rds.js` for AWS RDS and local cluster.
3. **Product Images:**
   - Currently, product images in `data/store_db.json` contain base64-encoded SVG vector placeholders.
   - **Target Phase 4 & 10 Action:** Replace SVG placeholders with authentic, high-resolution photography URLs stored in PostgreSQL; enable both URL-based image management and binary uploads.

---

## 4. Existing Integrations

- **Cashfree Payments:** Sole payment gateway. Integrated via REST API (`/pg/orders`), returns, and webhooks.
- **Nodemailer SMTP:** Transactional emails for OTPs and password resets. Decoupled into background tasks (`Promise.allSettled`).
- **AWS RDS PostgreSQL (ap-southeast-2):** IAM token auto-refreshing signer with 12-minute TTL cache in `lib/rds.ts`.
- **Local PostgreSQL 16.15:** Running on port 5433 with database `kbfashions`.

---

## 5. Identified Defects & Areas for Improvement

1. **Visual Style Discrepancies vs Approved Mockup:**
   - The current UI lacks the warm gray (`#F5F5F4`), soft orange (`#F6E8D8`), and electric blue (`#3478F6`) palette shown in the approved design reference.
   - Product cards currently use SVG illustrations instead of authentic photography.
   - Mobile navigation: Needs the sleek obsidian bottom navigation bar with active blue highlight (`#3478F6`) matching the mockup.
   - Customer dashboard: Needs the 4 metric cards (`Total Orders`, `Wishlist Items`, `Total Spent`, `Saved`) and left obsidian sidebar matching the mockup.
   - Checkout: Needs the 3-step progress stepper (`1 Address` -> `2 Delivery` -> `3 Payment`).
   - Cart: Needs the order summary with green savings banner (`✓ You saved ₹500 on this order!`).
2. **Persistence Dependency on JSON:**
   - `lib/db.ts` reads and writes `data/store_db.json` on disk. Must be cut over completely to PostgreSQL.
3. **Hardcoded URLs:**
   - Need to audit and ensure all internal links use relative paths, and all external canonical references use `NEXT_PUBLIC_APP_URL` or dynamic server headers rather than hardcoded domain strings.

---

## 6. Proposed Implementation Order

1. **PHASE 1:** Design System & Shared Components (tokens, header, mobile bottom nav, product cards, buttons, skeletons).
2. **PHASE 2:** Homepage and Storefront Rebuild (desktop & mobile matching approved mockup with real photography).
3. **PHASE 3:** Category & Product Listing (compact responsive grid, filter pills, sorting).
4. **PHASE 4:** Product Details & Image Management (photo gallery swatches, URL + upload support, SSRF validation).
5. **PHASE 5:** Cart and Checkout (3-step stepper, savings banner, Cashfree payment flow preservation).
6. **PHASE 6:** Customer Dashboard & Account (obsidian sidebar, metrics cards, recent orders table).
7. **PHASE 7:** Mobile Navigation & Responsiveness (fixed bottom bar, active electric blue, touch targets, safe-area padding).
8. **PHASE 8:** Loading, Errors & Performance (skeleton placeholders, bottom circular loader).
9. **PHASE 9:** Admin Dashboard & Store Operations (consistent brand theme, real PostgreSQL metrics).
10. **PHASE 10:** PostgreSQL-Only Persistence (complete elimination of JSON runtime dependencies).
11. **PHASE 11:** Production Configuration & AWS (relative links, environment variables, no hardcoded domains).
12. **PHASE 12:** Code Quality & Security Assessment (written `docs/SECURITY_REPORT.md`).
13. **PHASE 13:** Testing & Acceptance (automated visual testing, build verification, route checks).
14. **PHASE 14:** GitHub Publication (clean commit, remote push to `https://github.com/kbofficialdev/kbonlineshoppingplatform.git`).
15. **PHASE 15:** Final Implementation Report.

---

## 7. Risks, Dependencies & Mitigation

- **Risk:** Interruption during database cutover causing lost user state.  
  *Mitigation:* Seed and reconcile data into PostgreSQL before removing JSON file writes.
- **Risk:** Mobile bottom navigation overlapping bottom buttons or inputs.  
  *Mitigation:* Add `pb-24` safe-area bottom padding to all scrollable mobile layouts.
- **Risk:** Cashfree webhook signature verification failures.  
  *Mitigation:* Retain existing Cashfree signature verification logic, using server environment variables.

