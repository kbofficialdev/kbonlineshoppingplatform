const express = require('express');
const cors = require('cors');
const eventBus = require('../event-bus');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8004;

const ordersStore = new Map();
let orderSequence = 1000;
let invoiceSequence = 840;

// PIN Code Directory for Auto-fill & SLA Verification
const pinCodeDatabase = {
  "560038": { city: "Bengaluru", state: "Karnataka", sla_days: 2 },
  "560001": { city: "Bengaluru", state: "Karnataka", sla_days: 2 },
  "110001": { city: "New Delhi", state: "Delhi", sla_days: 3 },
  "400001": { city: "Mumbai", state: "Maharashtra", sla_days: 3 },
  "600001": { city: "Chennai", state: "Tamil Nadu", sla_days: 3 },
  "700001": { city: "Kolkata", state: "West Bengal", sla_days: 4 }
};

// Endpoints
app.get('/healthz', (req, res) => res.json({ status: 'ok', service: 'order-service' }));

app.get('/api/orders/lookup-pin/:pin', (req, res) => {
  const pin = req.params.pin.trim();
  const found = pinCodeDatabase[pin];
  if (found) {
    res.json({ success: true, ...found });
  } else {
    // Default fallback estimation
    res.json({ success: true, city: "Bengaluru", state: "Karnataka", sla_days: 3 });
  }
});

app.post('/api/orders', (req, res) => {
  const { customer, items, financials, payment_method = 'UPI' } = req.body;

  if (!customer || !customer.name || !customer.phone || !customer.street_address) {
    return res.status(400).json({ error: 'Customer contact and delivery address are mandatory' });
  }

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Cannot create order with an empty item list' });
  }

  orderSequence += 1;
  invoiceSequence += 1;
  const orderId = `ORD-2026-${orderSequence}`;
  const invoiceNumber = `INV-2026-00${invoiceSequence}`;

  // Intra-state (KA to KA) vs Inter-state (KA to outside) tax logic
  const isIntraState = !customer.state || customer.state.toLowerCase() === 'karnataka';
  const subtotal = financials?.subtotal || items.reduce((acc, i) => acc + (i.price * i.qty), 0);
  const discount = financials?.discount_amount || 0;
  const shipping = financials?.shipping_fee ?? (subtotal >= 999 ? 0 : 99);
  const total = subtotal - discount + shipping;

  const taxable_base = Math.round((subtotal / 1.18) * 100) / 100;
  const total_tax = Math.round((subtotal - taxable_base) * 100) / 100;

  const cgst = isIntraState ? Math.round((total_tax / 2) * 100) / 100 : 0;
  const sgst = isIntraState ? Math.round((total_tax / 2) * 100) / 100 : 0;
  const igst = !isIntraState ? total_tax : 0;

  const orderItems = items.map(item => {
    const itemTotal = item.price * item.qty;
    const itemBase = Math.round((itemTotal / 1.18) * 100) / 100;
    const itemTax = Math.round((itemTotal - itemBase) * 100) / 100;
    return {
      product_id: item.product_id || `PRD-${item.id}`,
      hsn_code: item.hsn_code || '61091000',
      title: item.name || item.title,
      qty: item.qty,
      unit_price: item.price,
      tax_amount: itemTax,
      total_amount: itemTotal,
      size: item.size || 'M'
    };
  });

  const order = {
    order_id: orderId,
    invoice_number: invoiceNumber,
    created_at: new Date().toISOString(),
    customer: {
      name: customer.name,
      phone: customer.phone,
      email: customer.email || 'customer@example.com',
      street_address: customer.street_address,
      pin_code: customer.pin_code || '560038',
      city: customer.city || 'Bengaluru',
      state: customer.state || 'Karnataka',
      b2b_gstin: customer.b2b_gstin || null
    },
    items: orderItems,
    financials: {
      subtotal,
      discount_amount: discount,
      shipping_fee: shipping,
      taxable_base,
      cgst,
      sgst,
      igst,
      total_paid: total,
      payment_method,
      status: payment_method === 'COD' ? 'AUTHORIZED' : 'CAPTURED'
    },
    order_status: 'CONFIRMED',
    payment_status: payment_method === 'COD' ? 'AUTHORIZED' : 'CAPTURED',
    estimated_delivery_days: pinCodeDatabase[customer.pin_code]?.sla_days || 3
  };

  ordersStore.set(orderId, order);

  eventBus.publish('order.created', { order_id: orderId, invoice_number: invoiceNumber, total });
  res.status(201).json({ success: true, order });
});

app.get('/api/orders/:order_id', (req, res) => {
  const order = ordersStore.get(req.params.order_id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json({ order });
});

app.get('/api/orders', (req, res) => {
  res.json({ orders: Array.from(ordersStore.values()) });
});

app.patch('/api/orders/:order_id/status', (req, res) => {
  const order = ordersStore.get(req.params.order_id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const { status } = req.body;
  if (['CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].includes(status)) {
    order.order_status = status;
    eventBus.publish('order.status_updated', { order_id: order.order_id, status });
  }
  res.json({ order });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[OrderService] 📋 Running on port ${PORT}`);
  });
}

module.exports = { app, ordersStore };

