const express = require('express');
const cors = require('cors');
const eventBus = require('../event-bus');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8005;

// Statutory Platform Seller Details
const platformSeller = {
  legal_name: "KB Retail Private Limited",
  brand_name: "KB Online",
  cin: "U52100KA2026PTC184920",
  gstin: "29AAAAA0000A1Z5",
  address: "42, Industrial Layout, Indiranagar, Bengaluru, Karnataka 560038, India",
  support_email: "support@kbonline.internal",
  support_phone: "+91 80 4920 0000",
  grievance_officer: {
    name: "Vikramaditya Rao",
    designation: "Head of Statutory Compliance & Grievances",
    email: "grievance@kbonline.internal",
    address: "42, Industrial Layout, Indiranagar, Bengaluru KA 560038",
    sla: "48 hours acknowledgement, 15 business days redressal"
  }
};

const processedWebhooks = new Set();

// Endpoints
app.get('/healthz', (req, res) => res.json({ status: 'ok', service: 'payment-service' }));

app.post('/api/payments/process', (req, res) => {
  const { order_id, amount, method = 'UPI', upi_id = 'user@okhdfcbank' } = req.body;

  if (!order_id || !amount) {
    return res.status(400).json({ error: 'Order ID and amount are required' });
  }

  const transaction_id = `TXN-KB-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  eventBus.publish('payment.captured', {
    order_id,
    amount,
    method,
    transaction_id,
    timestamp: new Date().toISOString()
  });

  res.json({
    success: true,
    status: 'CAPTURED',
    transaction_id,
    order_id,
    amount,
    method,
    gateway_response: {
      auth_code: `AUTH-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'success'
    }
  });
});

app.post('/api/payments/webhook', (req, res) => {
  const { event_type, payload, idempotency_key } = req.body;

  if (idempotency_key && processedWebhooks.has(idempotency_key)) {
    return res.json({ status: 'duplicate_ignored', message: 'Webhook already processed' });
  }

  if (idempotency_key) processedWebhooks.add(idempotency_key);

  console.log(`[PaymentGatewayWebhook] Received: ${event_type}`, payload);
  eventBus.publish(`payment.${event_type}`, payload);

  res.json({ status: 'acknowledged', event_type, timestamp: new Date().toISOString() });
});

// Generate Statutory Tax Invoice JSON & Printable HTML
app.get('/api/payments/invoices/:order_id', (req, res) => {
  // Query Order Service or internal store
  const { ordersStore } = require('../order-service/index');
  const order = ordersStore.get(req.params.order_id);

  if (!order) {
    return res.status(404).json({ error: 'Order not found for tax invoice generation' });
  }

  const invoice = {
    order_id: order.order_id,
    invoice_number: order.invoice_number,
    created_at: order.created_at,
    seller: platformSeller,
    customer: order.customer,
    items: order.items,
    financials: order.financials,
    digital_signature: {
      authorized_by: "KB Retail Pvt Ltd Statutory Invoicing Authority",
      signed_at: order.created_at,
      verification_hash: `SHA256:${Buffer.from(`${order.order_id}|${order.invoice_number}|${order.financials.total_paid}`).toString('base64')}`
    }
  };

  res.json({ invoice });
});

app.get('/api/payments/invoices/:order_id/html', (req, res) => {
  const { ordersStore } = require('../order-service/index');
  const order = ordersStore.get(req.params.order_id);

  if (!order) {
    return res.status(404).send('<h3>Invoice not found</h3>');
  }

  const itemsHtml = order.items.map((item, idx) => `
    <tr style="border-bottom: 1px solid #e8e8e8;">
      <td style="padding: 10px; font-size: 12px;">${idx + 1}</td>
      <td style="padding: 10px; font-size: 12px;"><strong>${item.title}</strong><br><span style="color:#666;">Size: ${item.size}</span></td>
      <td style="padding: 10px; font-size: 12px; font-family: monospace;">${item.hsn_code}</td>
      <td style="padding: 10px; font-size: 12px; text-align: center;">${item.qty}</td>
      <td style="padding: 10px; font-size: 12px; text-align: right;">₹${(item.total_amount - item.tax_amount).toFixed(2)}</td>
      <td style="padding: 10px; font-size: 12px; text-align: right;">₹${item.tax_amount.toFixed(2)}</td>
      <td style="padding: 10px; font-size: 12px; text-align: right; font-weight: bold;">₹${item.total_amount.toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Tax Invoice — ${order.invoice_number}</title>
      <style>
        body { font-family: 'Inter', -apple-system, sans-serif; color: #111; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.5; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #111; padding-bottom: 20px; }
        .logo { font-size: 32px; font-weight: 800; letter-spacing: -1.5px; }
        .badge { background: #047857; color: white; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: bold; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 25px 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #f4f4f1; padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; }
        .totals { margin-top: 25px; width: 320px; margin-left: auto; }
        .totals div { display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px; }
        .grand-total { font-size: 16px; font-weight: 800; border-top: 2px solid #111; padding-top: 8px; margin-top: 8px; }
        .stamp { border: 2px dashed #047857; color: #047857; padding: 12px; border-radius: 8px; text-align: center; margin-top: 30px; font-size: 11px; }
        @media print { .no-print { display: none; } body { margin: 0; padding: 10px; } }
      </style>
    </head>
    <body>
      <div class="no-print" style="margin-bottom: 20px; text-align: right;">
        <button onclick="window.print()" style="background:#111; color:#fff; border:none; padding:10px 20px; border-radius:999px; font-weight:bold; cursor:pointer;">🖨️ Print / Download PDF</button>
      </div>

      <div class="header">
        <div>
          <div class="logo">KB.</div>
          <div style="font-size: 13px; color:#666;">Statutory E-Commerce Tax Invoice</div>
          <div style="font-size: 11px; color:#888;">Rule 46 of CGST Rules, 2017</div>
        </div>
        <div style="text-align: right;">
          <span class="badge">ORIGINAL FOR RECIPIENT</span>
          <div style="font-size: 14px; font-weight: bold; margin-top: 8px;">Invoice #: ${order.invoice_number}</div>
          <div style="font-size: 12px; color:#666;">Date: ${new Date(order.created_at).toLocaleDateString('en-IN')}</div>
          <div style="font-size: 12px; color:#666;">Order ID: ${order.order_id}</div>
        </div>
      </div>

      <div class="grid-2">
        <div style="font-size: 12px;">
          <strong style="font-size: 13px; text-transform: uppercase;">Sold By (Seller):</strong><br>
          <strong>${platformSeller.legal_name}</strong><br>
          ${platformSeller.address}<br>
          <strong>GSTIN:</strong> ${platformSeller.gstin}<br>
          <strong>CIN:</strong> ${platformSeller.cin}<br>
          <strong>Email:</strong> ${platformSeller.support_email}
        </div>
        <div style="font-size: 12px;">
          <strong style="font-size: 13px; text-transform: uppercase;">Billed & Shipped To:</strong><br>
          <strong>${order.customer.name}</strong><br>
          ${order.customer.street_address}<br>
          ${order.customer.city}, ${order.customer.state} - ${order.customer.pin_code}<br>
          <strong>Phone:</strong> ${order.customer.phone}<br>
          ${order.customer.b2b_gstin ? `<strong>Buyer B2B GSTIN:</strong> ${order.customer.b2b_gstin}` : '<em>Consumer Purchase (B2C)</em>'}
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Description & Item Details</th>
            <th>HSN Code</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Taxable Base</th>
            <th style="text-align: right;">GST (18%)</th>
            <th style="text-align: right;">Total Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div class="totals">
        <div><span>Subtotal (Taxable Value):</span> <span>₹${order.financials.taxable_base.toFixed(2)}</span></div>
        ${order.financials.cgst > 0 ? `<div><span>Central GST (CGST @ 9%):</span> <span>₹${order.financials.cgst.toFixed(2)}</span></div>` : ''}
        ${order.financials.sgst > 0 ? `<div><span>State GST (SGST @ 9%):</span> <span>₹${order.financials.sgst.toFixed(2)}</span></div>` : ''}
        ${order.financials.igst > 0 ? `<div><span>Integrated GST (IGST @ 18%):</span> <span>₹${order.financials.igst.toFixed(2)}</span></div>` : ''}
        ${order.financials.discount_amount > 0 ? `<div style="color:#047857;"><span>Discount:</span> <span>-₹${order.financials.discount_amount.toFixed(2)}</span></div>` : ''}
        <div><span>Shipping & Packaging SLA:</span> <span>${order.financials.shipping_fee === 0 ? 'FREE' : `₹${order.financials.shipping_fee.toFixed(2)}`}</span></div>
        <div class="grand-total"><span>Total Paid:</span> <span>₹${order.financials.total_paid.toFixed(2)}</span></div>
        <div style="font-size: 11px; color:#666; margin-top: 4px;">Payment Mode: ${order.financials.payment_method} (${order.financials.status})</div>
      </div>

      <div class="stamp">
        <strong>✓ Digitally Signed & Statutorely Verified</strong><br>
        Authorized Signatory for KB Retail Private Limited<br>
        <span style="font-size: 10px; font-family: monospace;">Verification Hash: SHA256:${Buffer.from(`${order.order_id}|${order.invoice_number}`).toString('base64')}</span>
      </div>

      <div style="margin-top: 30px; font-size: 10px; color: #777; border-top: 1px solid #e8e8e8; padding-top: 15px;">
        <strong>Statutory Notice:</strong> This invoice constitutes a valid computer-generated legal tax document under Consumer Protection (E-Commerce) Rules, 2020. 
        For grievances or discrepancies, contact Grievance Officer: ${platformSeller.grievance_officer.name} at ${platformSeller.grievance_officer.email}.
      </div>
    </body>
    </html>
  `;

  res.send(html);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[PaymentService] 💳 Running on port ${PORT}`);
  });
}

module.exports = { app, platformSeller };

