import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { lookup: string } }) {
  const query = decodeURIComponent(params.lookup).trim().toUpperCase();

  const merchant = db.merchants.find(m =>
    m.merchantId.toUpperCase() === query ||
    m.gstin.toUpperCase() === query ||
    m.legalBusinessName.toUpperCase().includes(query)
  );

  if (!merchant) {
    return NextResponse.json({
      found: false,
      message: `No statutory verification record found for identifier '${query}'. Ensure the GSTIN or Merchant ID is correct.`
    }, { status: 404 });
  }

  return NextResponse.json({
    found: true,
    verification: {
      merchantId: merchant.merchantId,
      legalBusinessName: merchant.legalBusinessName,
      brandTradeName: merchant.brandTradeName,
      entityType: merchant.entityType,
      gstin: merchant.gstin,
      verificationStatus: merchant.verificationStatus,
      isOfficiallyVerified: merchant.verificationStatus === 'VERIFIED',
      verificationSealTimestamp: merchant.verificationSealTimestamp,
      registeredAddress: merchant.registeredAddress,
      qualityCertifications: merchant.qualityCertifications,
      complianceRating: "5.0 / 5.0 (A+ Statutory Trust)",
      complianceNotes: merchant.complianceNotes
    }
  });
}
