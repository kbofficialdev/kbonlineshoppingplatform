import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { adminReviewSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = adminReviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const { merchantId, action, complianceNotes } = parsed.data;
    const merchant = db.merchants.find(m => m.merchantId === merchantId);

    if (!merchant) {
      return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
    }

    const status = action === 'APPROVE' ? 'VERIFIED' : 'REJECTED';
    merchant.verificationStatus = status;
    merchant.updatedAt = new Date().toISOString();
    merchant.complianceNotes = complianceNotes || `Reviewed by Platform Statutory Officer on ${new Date().toLocaleDateString('en-IN')}`;
    if (status === 'VERIFIED') merchant.verificationSealTimestamp = new Date().toISOString();

    const auditEntry = db.addAuditLog(
      "ADMIN_OFFICER_RAO",
      "ADMIN",
      `MERCHANT_KYC_${status}`,
      "MERCHANT",
      merchantId,
      { status, complianceNotes: merchant.complianceNotes }
    );

    return NextResponse.json({
      success: true,
      message: `Merchant KYC updated to ${status}. Recorded in immutable audit ledger.`,
      auditHash: auditEntry.hash,
      merchant
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
