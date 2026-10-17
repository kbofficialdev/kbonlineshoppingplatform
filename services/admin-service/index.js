const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const eventBus = require('../event-bus');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8007;

// Immutable Audit Log Ledger with Cryptographic Hash Chaining
class AuditLedger {
  constructor() {
    this.logs = [];
    this.genesisHash = "0000000000000000000000000000000000000000000000000000000000000000";
    this.append("SYSTEM", "SYSTEM", "GENESIS_BLOCK", "LEDGER", "ROOT", { message: "KB Online Audit Ledger Initialized" });
  }

  append(actorId, actorRole, action, resourceType, resourceId, details) {
    const previousHash = this.logs.length === 0 ? this.genesisHash : this.logs[this.logs.length - 1].hash;
    const logId = `AUD-${Date.now()}-${this.logs.length + 1}`;
    const timestamp = new Date().toISOString();

    const payloadToHash = `${logId}|${timestamp}|${actorId}|${actorRole}|${action}|${resourceType}|${resourceId}|${JSON.stringify(details)}|${previousHash}`;
    const hash = crypto.createHash('sha256').update(payloadToHash).digest('hex');

    const entry = {
      log_id: logId,
      timestamp,
      actor_id: actorId,
      actor_role: actorRole,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      details,
      previous_hash: previousHash,
      hash
    };

    this.logs.push(entry);
    return entry;
  }

  verifyIntegrity() {
    for (let i = 1; i < this.logs.length; i++) {
      const current = this.logs[i];
      const previous = this.logs[i - 1];
      if (current.previous_hash !== previous.hash) return false;
      const recomputed = crypto.createHash('sha256').update(
        `${current.log_id}|${current.timestamp}|${current.actor_id}|${current.actor_role}|${current.action}|${current.resource_type}|${current.resource_id}|${JSON.stringify(current.details)}|${current.previous_hash}`
      ).digest('hex');
      if (current.hash !== recomputed) return false;
    }
    return true;
  }
}

const auditLedger = new AuditLedger();

// Auto-record events from EventBus into immutable audit trail
eventBus.subscribe('order.created', (event) => {
  auditLedger.append("SYSTEM", "SYSTEM", "ORDER_CREATED", "ORDER", event.payload.order_id, event.payload);
});
eventBus.subscribe('payment.captured', (event) => {
  auditLedger.append("PAYMENT_GATEWAY", "SYSTEM", "PAYMENT_CAPTURED", "PAYMENT", event.payload.order_id, event.payload);
});
eventBus.subscribe('merchant.kyc_submitted', (event) => {
  auditLedger.append("MERCHANT_PORTAL", "MERCHANT", "KYC_SUBMITTED", "MERCHANT", event.payload.merchant_id, event.payload);
});

// Quality sentiment metrics for Chart.js
const qualitySentimentData = {
  overall_rating: 4.8,
  verified_reviews_count: 872,
  metrics: [
    { label: "Fabric Softness", score: 98, description: "100% Combed Cotton feel" },
    { label: "Fit Accuracy", score: 96, description: "Matches standard measurement chart" },
    { label: "Color Retention", score: 95, description: "Zero fading after 20 washes" },
    { label: "Stitching Strength", score: 97, description: "Reinforced twin-needle hems" },
    { label: "Price-to-Value", score: 99, description: "Rated better value than high-street brands" }
  ]
};

// Endpoints
app.get('/healthz', (req, res) => res.json({ status: 'ok', service: 'admin-service', integrity_valid: auditLedger.verifyIntegrity() }));

app.get('/api/admin/audit-logs', (req, res) => {
  res.json({
    total: auditLedger.logs.length,
    integrity_verified: auditLedger.verifyIntegrity(),
    logs: [...auditLedger.logs].reverse()
  });
});

app.get('/api/admin/analytics/sentiment', (req, res) => {
  res.json(qualitySentimentData);
});

// 1-Click Dispute & Refund Reconciliation
app.post('/api/admin/refund', (req, res) => {
  const { order_id, amount, reason = "Customer statutory cancellation within SLA" } = req.body;

  if (!order_id) {
    return res.status(400).json({ error: 'Order ID is required for refund' });
  }

  const refundTxnId = `RFD-KB-${Date.now()}`;
  const logEntry = auditLedger.append(
    "ADMIN_SARAH_K",
    "ADMIN",
    "REFUND_ISSUED",
    "PAYMENT",
    order_id,
    { refund_id: refundTxnId, amount, reason }
  );

  eventBus.publish('refund.processed', { order_id, refund_id: refundTxnId, amount, reason });

  res.json({
    success: true,
    message: `Refund of ₹${amount || 'full amount'} successfully initiated to original payment source.`,
    refund_id: refundTxnId,
    order_id,
    audit_hash: logEntry.hash
  });
});

// Admin Review of Merchant KYC
app.post('/api/admin/kyc-review', (req, res) => {
  const { merchant_id, action = 'APPROVE', compliance_notes } = req.body;

  const status = action === 'APPROVE' ? 'VERIFIED' : 'REJECTED';
  const { merchantsStore } = require('../merchant-service/index');
  const merchant = merchantsStore.get(merchant_id);

  if (!merchant) return res.status(404).json({ error: 'Merchant not found' });

  merchant.verification_status = status;
  merchant.compliance_notes = compliance_notes || `Reviewed by Platform Statutory Officer on ${new Date().toLocaleDateString('en-IN')}`;
  if (status === 'VERIFIED') merchant.verification_seal_timestamp = new Date().toISOString();

  const auditEntry = auditLedger.append(
    "ADMIN_OFFICER_RAO",
    "ADMIN",
    `MERCHANT_KYC_${status}`,
    "MERCHANT",
    merchant_id,
    { status, compliance_notes: merchant.compliance_notes }
  );

  res.json({
    success: true,
    message: `Merchant KYC updated to ${status}. Recorded in immutable audit ledger.`,
    audit_hash: auditEntry.hash,
    merchant
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[AdminService] ⚖️ Running on port ${PORT}`);
  });
}

module.exports = { app, auditLedger };

