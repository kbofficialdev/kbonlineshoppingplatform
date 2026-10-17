import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  return NextResponse.json({
    total: db.auditLogs.length,
    integrity_verified: db.verifyAuditIntegrity(),
    logs: [...db.auditLogs].reverse(),
  });
}
