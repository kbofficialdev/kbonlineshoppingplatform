import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    engine: 'Next.js 14 App Router Full-Stack',
    database: 'PostgreSQL with Prisma Architecture',
    audit_integrity_verified: db.verifyAuditIntegrity(),
    services: {
      catalog_service: 'ONLINE',
      cart_service: 'ONLINE',
      order_service: 'ONLINE',
      payment_service: 'ONLINE',
      merchant_kyc_service: 'ONLINE',
      admin_governance_service: 'ONLINE',
    }
  });
}
