import { NextRequest, NextResponse } from 'next/server';
import { db, MerchantKYCModel } from '@/lib/db';
import { merchantOnboardSchema } from '@/lib/validations';

let merchantCounter = 9050;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = merchantOnboardSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const {
      legalBusinessName,
      brandTradeName,
      entityType,
      gstin,
      incorporationNumber,
      contactEmail,
      contactPhone,
      registeredAddress,
      qualityCertifications
    } = parsed.data;

    merchantCounter += 1;
    const merchantId = `MCH-2026-${merchantCounter}`;

    const newMerchant: MerchantKYCModel = {
      id: merchantId,
      merchantId,
      legalBusinessName,
      brandTradeName: brandTradeName || legalBusinessName,
      entityType,
      gstin,
      incorporationNumber: incorporationNumber || `REG-${Date.now()}`,
      contactEmail,
      contactPhone,
      registeredAddress,
      qualityCertifications: qualityCertifications || [],
      verificationStatus: 'PENDING',
      complianceNotes: 'Submitted for automated GSTIN & MCA cross-verification queue.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.merchants.push(newMerchant);

    db.addAuditLog(
      "MERCHANT_PORTAL",
      "MERCHANT",
      "KYC_SUBMITTED",
      "MERCHANT",
      merchantId,
      { legalBusinessName, gstin }
    );

    return NextResponse.json({
      success: true,
      message: 'Merchant KYC profile submitted successfully. Current status: PENDING_REVIEW',
      merchant: newMerchant
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
