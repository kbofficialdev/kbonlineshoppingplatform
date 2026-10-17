const express = require('express');
const cors = require('cors');
const eventBus = require('../event-bus');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8006;

// Seeded Merchants Database
const merchantsStore = new Map([
  [
    "MCH-2026-9041",
    {
      merchant_id: "MCH-2026-9041",
      legal_business_name: "KB Retail Private Limited",
      brand_trade_name: "KB Online",
      entity_type: "Private Limited",
      gstin: "29AAAAA0000A1Z5",
      incorporation_number: "U52100KA2026PTC184920",
      contact_email: "compliance@kbretail.internal",
      contact_phone: "+91 80 4920 0000",
      registered_address: "42, Industrial Layout, Indiranagar, Bengaluru, KA 560038",
      quality_certifications: ["ISO 9001:2015", "BIS Quality Standard", "OEKO-TEX Certified"],
      verification_status: "VERIFIED",
      verification_seal_timestamp: "2026-01-15T10:00:00.000Z",
      compliance_notes: "Statutory filings verified against MCA21 and GSTN portal. Zero active consumer grievances.",
      created_at: "2026-01-10T08:30:00.000Z",
      updated_at: "2026-01-15T10:00:00.000Z"
    }
  ],
  [
    "MCH-2026-8812",
    {
      merchant_id: "MCH-2026-8812",
      legal_business_name: "KB Handloom Artisans Guild Co-operative",
      brand_trade_name: "KB Heritage Weaves",
      entity_type: "Co-operative",
      gstin: "08AAAAA9999B1Z2",
      incorporation_number: "COOP-RJ-2024-4902",
      contact_email: "artisan.guild@kbheritage.internal",
      contact_phone: "+91 141 2780000",
      registered_address: "Artisan Enclave, Sanganer, Jaipur, Rajasthan 302029",
      quality_certifications: ["Handloom Mark", "India Handloom Brand", "Craft Council Registered"],
      verification_status: "VERIFIED",
      verification_seal_timestamp: "2026-02-01T12:00:00.000Z",
      compliance_notes: "Certified authentic geographical origin and direct artisan livelihood compensation guarantee.",
      created_at: "2026-01-20T09:15:00.000Z",
      updated_at: "2026-02-01T12:00:00.000Z"
    }
  ]
]);

let merchantCounter = 9050;

// Endpoints
app.get('/healthz', (req, res) => res.json({ status: 'ok', service: 'merchant-service' }));

app.get('/api/merchants/list', (req, res) => {
  res.json({ merchants: Array.from(merchantsStore.values()) });
});

// Public Transparency Lookup Portal API (/verify-merchant)
app.get('/api/merchants/verify/:lookup', (req, res) => {
  const query = req.params.lookup.trim().toUpperCase();
  const allMerchants = Array.from(merchantsStore.values());

  const merchant = allMerchants.find(m => 
    m.merchant_id.toUpperCase() === query || 
    m.gstin.toUpperCase() === query ||
    m.legal_business_name.toUpperCase().includes(query)
  );

  if (!merchant) {
    return res.status(404).json({
      found: false,
      message: `No statutory verification record found for identifier '${query}'. Ensure the GSTIN or Merchant ID is correct.`
    });
  }

  res.json({
    found: true,
    verification: {
      merchant_id: merchant.merchant_id,
      legal_business_name: merchant.legal_business_name,
      brand_trade_name: merchant.brand_trade_name,
      entity_type: merchant.entity_type,
      gstin: merchant.gstin,
      verification_status: merchant.verification_status,
      is_officially_verified: merchant.verification_status === 'VERIFIED',
      verification_seal_timestamp: merchant.verification_seal_timestamp,
      registered_address: merchant.registered_address,
      quality_certifications: merchant.quality_certifications,
      compliance_rating: "5.0 / 5.0 (A+ Statutory Trust)",
      compliance_notes: merchant.compliance_notes
    }
  });
});

// Merchant Onboarding (Multi-step KYC)
app.post('/api/merchants/onboard', (req, res) => {
  const {
    legal_business_name,
    brand_trade_name,
    entity_type = 'Private Limited',
    gstin,
    incorporation_number,
    contact_email,
    contact_phone,
    registered_address,
    quality_certifications = []
  } = req.body;

  if (!legal_business_name || !gstin || !contact_email) {
    return res.status(400).json({ error: 'Legal Business Name, GSTIN, and Contact Email are required' });
  }

  // Validate GSTIN pattern (15 characters)
  const gstinClean = gstin.trim().toUpperCase();
  if (gstinClean.length !== 15) {
    return res.status(400).json({ error: 'GSTIN must be a valid 15-character statutory alphanumeric code' });
  }

  merchantCounter += 1;
  const merchantId = `MCH-2026-${merchantCounter}`;

  const newMerchant = {
    merchant_id: merchantId,
    legal_business_name,
    brand_trade_name: brand_trade_name || legal_business_name,
    entity_type,
    gstin: gstinClean,
    incorporation_number: incorporation_number || `REG-${Date.now()}`,
    contact_email,
    contact_phone: contact_phone || '+91 9999999999',
    registered_address: registered_address || 'India',
    quality_certifications,
    verification_status: "PENDING",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    compliance_notes: "Submitted for automated GSTIN & MCA cross-verification queue."
  };

  merchantsStore.set(merchantId, newMerchant);

  eventBus.publish('merchant.kyc_submitted', { merchant_id: merchantId, legal_business_name, gstin: gstinClean });

  res.status(201).json({
    success: true,
    message: 'Merchant KYC profile submitted successfully. Current status: PENDING_REVIEW',
    merchant: newMerchant
  });
});

// Admin review endpoint (approve / query / reject)
app.patch('/api/merchants/:id/review', (req, res) => {
  const merchant = merchantsStore.get(req.params.id);
  if (!merchant) return res.status(404).json({ error: 'Merchant not found' });

  const { status, compliance_notes, rejection_reason } = req.body;
  if (['PENDING', 'QUERY_RAISED', 'VERIFIED', 'REJECTED'].includes(status)) {
    merchant.verification_status = status;
    merchant.updated_at = new Date().toISOString();
    if (status === 'VERIFIED') {
      merchant.verification_seal_timestamp = new Date().toISOString();
    }
    if (compliance_notes) merchant.compliance_notes = compliance_notes;
    if (rejection_reason) merchant.rejection_reason = rejection_reason;

    eventBus.publish('merchant.kyc_reviewed', { merchant_id: merchant.merchant_id, status });
  }

  res.json({ success: true, merchant });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[MerchantService] 🏛️ Running on port ${PORT}`);
  });
}

module.exports = { app, merchantsStore };

