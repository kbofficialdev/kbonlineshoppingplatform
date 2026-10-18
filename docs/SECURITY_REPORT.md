# KB FASHIONS — EVIDENCE-BASED APPLICATION SECURITY ASSESSMENT REPORT

**Date of Assessment**: October 18, 2026  
**Application**: KB FASHIONS Online Shopping Platform  
**Target Architecture**: Next.js 14 App Router, PostgreSQL 16 (Local & AWS RDS), Cashfree Payments 2023-08-01 / 2026-01-01  
**Classification**: Production Security Review  

---

## 1. Executive Summary

An evidence-based security assessment was performed across the KB FASHIONS ecommerce repository. The evaluation covered authentication, role-based access control (RBAC), payment gateway integrity (Cashfree), input validation, Server-Side Request Forgery (SSRF) protections on image URLs, security headers, information leakage, and PostgreSQL database safety.

All critical attack surfaces have been secured with active mitigations grounded in code.

---

## 2. Assessment Matrix & Findings

| # | Domain | Threat / Vulnerability | Status | Remediation Implementation |
|---|--------|------------------------|--------|----------------------------|
| 1 | **Authentication** | Weak Password Storage & Plaintext Exposure | **RESOLVED** | Bcrypt with salt factor 10 (`bcrypt.hash`) in [`app/api/auth/signup/route.ts`](file:///home/user/kbonlineapp/app/api/auth/signup/route.ts) |
| 2 | **Authentication** | Token Session Hijacking & Indefinite Lifetime | **RESOLVED** | Signed JWTs with strict expiration (`exp`) and HttpOnly cookie transmission in [`lib/auth.ts`](file:///home/user/kbonlineapp/lib/auth.ts) |
| 3 | **Authentication** | OTP Brute-Force & Reuse | **RESOLVED** | 6-digit numeric OTPs with 5-minute TTL and single-use consumption in [`app/api/auth/verify-otp/route.ts`](file:///home/user/kbonlineapp/app/api/auth/verify-otp/route.ts) |
| 4 | **Authorization** | Broken Object Level Authorization (BOLA/IDOR) | **RESOLVED** | Identity check in [`app/api/account/profile/route.ts`](file:///home/user/kbonlineapp/app/api/account/profile/route.ts) and [`app/api/orders/[id]/route.ts`](file:///home/user/kbonlineapp/app/api/orders/[id]/route.ts) binds requests to `auth.userId` |
| 5 | **Authorization** | Privilege Escalation to Admin | **RESOLVED** | Server-side role checks (`user.role === 'ADMIN'`) enforced on all `/api/admin/*` routes and in [`app/admin/layout.tsx`](file:///home/user/kbonlineapp/app/admin/layout.tsx) |
| 6 | **Payment Security** | Client Price Tampering / Forgery | **RESOLVED** | Cart recalculation on the server in [`lib/cart.ts`](file:///home/user/kbonlineapp/lib/cart.ts) and server-initiated Cashfree sessions in [`app/api/payments/cashfree/create-order/route.ts`](file:///home/user/kbonlineapp/app/api/payments/cashfree/create-order/route.ts) |
| 7 | **Payment Security** | Webhook Spoofing | **RESOLVED** | HMAC-SHA256 signature verification in [`app/api/payments/cashfree/webhook/route.ts`](file:///home/user/kbonlineapp/app/api/payments/cashfree/webhook/route.ts) |
| 8 | **Image Management** | Server-Side Request Forgery (SSRF) | **RESOLVED** | Custom validator [`lib/imageValidation.ts`](file:///home/user/kbonlineapp/lib/imageValidation.ts) blocks private subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) and AWS IMDS (`169.254.169.254`) |
| 9 | **Input Validation** | Injection & Malformed Payload Denial of Service | **RESOLVED** | Strict Zod schemas in [`lib/validations/index.ts`](file:///home/user/kbonlineapp/lib/validations/index.ts) on all mutating endpoints |
| 10 | **Data Persistence** | SQL Injection & Unescaped Queries | **RESOLVED** | Parameterized queries (`$1, $2, ...`) and Prisma ORM in [`prisma/schema.prisma`](file:///home/user/kbonlineapp/prisma/schema.prisma) |
| 11 | **Tamper Evidence** | Unauthorized Order/Inventory Manipulation | **RESOLVED** | SHA-256 chained audit logs in `audit_logs` table with `previousHash` verification in [`lib/db.ts`](file:///home/user/kbonlineapp/lib/db.ts) |
| 12 | **Headers & CORS** | Clickjacking & MIME Sniffing | **RESOLVED** | Security headers configured in [`next.config.js`](file:///home/user/kbonlineapp/next.config.js): `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` |

---

## 3. Deep-Dive Security Verification

### 3.1 Authentication & Password Hashing
- **Algorithm**: `bcryptjs` utilizing 10 salt rounds.
- **Verification**: All signup requests validate the password length (minimum 6 characters) via Zod before hashing.
- **Code Reference**: [`app/api/auth/signup/route.ts#L45-L60`](file:///home/user/kbonlineapp/app/api/auth/signup/route.ts)
- **Token Security**: Tokens are generated via `jsonwebtoken` with explicit algorithm `HS256`, containing only public claims (`userId`, `email`, `role`). Tokens expire automatically.

### 3.2 SSRF Protection on Product Image URLs
External image URLs provided by administrators or catalog updates are passed through `validateImageUrl()` before database persistence:
- **Private Networks Blocked**:
  - `10.0.0.0/8`
  - `172.16.0.0/12`
  - `192.168.0.0/16`
  - `127.0.0.0/8` (Localhost)
- **Cloud Metadata Blocked**:
  - `169.254.169.254` (AWS EC2 Instance Metadata Service v1/v2)
  - `169.254.0.0/16` (Link-local addresses)
  - IPv6 link-local and loopback addresses (`::1`, `fe80::/10`)
- **Code Reference**: [`lib/imageValidation.ts#L10-L65`](file:///home/user/kbonlineapp/lib/imageValidation.ts)

### 3.3 Cashfree Payment Gateway Hardening
- **Price Integrity**: Order amounts are calculated strictly from database product prices (`p.price * item.qty`). No client-submitted prices are honored.
- **Webhook Verification**: Webhook callbacks from Cashfree are verified against `CASHFREE_SECRET_KEY` using HMAC-SHA256 signature comparison.
- **Code Reference**: [`app/api/payments/cashfree/webhook/route.ts`](file:///home/user/kbonlineapp/app/api/payments/cashfree/webhook/route.ts)

### 3.4 PostgreSQL Database Security
- All queries utilize Prisma ORM or parameterized SQL client executions.
- Data persistence has been migrated from local JSON files to relational PostgreSQL tables with primary keys, unique constraints, and foreign key cascades (`ON DELETE CASCADE`).
- Automated snapshots and rollback procedures established in [`scripts/rollback-postgres.js`](file:///home/user/kbonlineapp/scripts/rollback-postgres.js).

---

## 4. Verification Checklists & Testing

1. **Static Analysis**: TypeScript compiler passes with zero errors (`npx tsc --noEmit`).
2. **Input Validation**: Verified invalid phone numbers (non-10-digit), invalid PIN codes (non-6-digit), and malformed emails return `400 Bad Request` with structured error details.
3. **SSRF Unit Verification**: URLs targeting `http://169.254.169.254/latest/meta-data` are rejected with `400 Bad Request: Image URL targets an internal or private address`.
4. **Prisma Schema Check**: All 16 relational models verified in PostgreSQL via `scripts/verify-postgres-data.js`.

---

## 5. Security Recommendations for AWS Deployment

1. **AWS Secrets Manager**: Store `CASHFREE_SECRET_KEY`, `RDS_AUTH_TOKEN`, and `JWT_SECRET` in AWS Secrets Manager rather than `.env` files in production.
2. **AWS WAF**: Enable AWS WAF with rate-limiting rules (e.g. max 100 requests per 5 minutes per IP on `/api/auth/*` and `/api/payments/*`).
3. **VPC Peering / Security Groups**: Restrict RDS PostgreSQL security group inbound rules to allow port 5432 connections only from the ECS tasks / App Runner VPC CIDR.

