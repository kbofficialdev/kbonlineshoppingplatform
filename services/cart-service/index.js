const express = require('express');
const cors = require('cors');
const eventBus = require('../event-bus');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8003;

// In-memory cart repository indexed by session_id (replaces Redis)
const cartStore = new Map();

const FREE_SHIPPING_THRESHOLD = 999;
const STANDARD_SHIPPING_FEE = 99;

function getOrCreateCart(sessionId = 'default-guest') {
  if (!cartStore.has(sessionId)) {
    cartStore.set(sessionId, {
      session_id: sessionId,
      items: [],
      applied_promo: null,
      discount_percent: 0
    });
  }
  return cartStore.get(sessionId);
}

function calculateCartTotals(cart) {
  const subtotal = cart.items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  let discount_amount = 0;

  if (cart.applied_promo === 'KB10') {
    discount_amount = Math.round(subtotal * 0.10);
  } else if (cart.applied_promo === 'WELCOME50') {
    discount_amount = Math.min(subtotal, 50);
  }

  const shipping_fee = (subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0) ? 0 : STANDARD_SHIPPING_FEE;
  const total = Math.max(0, subtotal - discount_amount + shipping_fee);
  const amount_needed = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const free_shipping_unlocked = subtotal >= FREE_SHIPPING_THRESHOLD;

  // Breakdown GST (18% included in product prices)
  const taxable_base = Math.round((subtotal / 1.18) * 100) / 100;
  const total_tax = Math.round((subtotal - taxable_base) * 100) / 100;
  const cgst = Math.round((total_tax / 2) * 100) / 100;
  const sgst = Math.round((total_tax / 2) * 100) / 100;

  return {
    session_id: cart.session_id,
    items: cart.items,
    applied_promo: cart.applied_promo,
    discount_percent: cart.discount_percent,
    subtotal,
    discount_amount,
    shipping_fee,
    total,
    taxable_base,
    cgst,
    sgst,
    free_shipping_threshold: FREE_SHIPPING_THRESHOLD,
    amount_needed_for_free_shipping: amount_needed,
    free_shipping_unlocked
  };
}

// Endpoints
app.get('/healthz', (req, res) => res.json({ status: 'ok', service: 'cart-service' }));

app.get('/api/cart', (req, res) => {
  const sessionId = req.query.session_id || 'default-guest';
  const cart = getOrCreateCart(sessionId);
  res.json(calculateCartTotals(cart));
});

app.post('/api/cart/items', (req, res) => {
  const sessionId = req.body.session_id || 'default-guest';
  const { id, product_id, name, price, size = 'M', color = '#111111', qty = 1, hsn_code = '61091000' } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: 'Item name and price are required' });
  }

  const cart = getOrCreateCart(sessionId);
  const existing = cart.items.find(i => (i.id === id || i.product_id === product_id) && i.size === size);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.items.push({
      id: id || Date.now(),
      product_id: product_id || `PRD-${id}`,
      name,
      price: parseFloat(price),
      size,
      color,
      qty: parseInt(qty) || 1,
      tax_rate_percent: 18,
      hsn_code
    });
  }

  eventBus.publish('cart.item_added', { session_id: sessionId, item: { name, price, size, qty } });
  res.json(calculateCartTotals(cart));
});

app.patch('/api/cart/items/:id', (req, res) => {
  const sessionId = req.body.session_id || 'default-guest';
  const itemId = req.params.id;
  const { delta, size } = req.body;

  const cart = getOrCreateCart(sessionId);
  const index = cart.items.findIndex(i => (i.id.toString() === itemId || i.product_id === itemId) && (!size || i.size === size));

  if (index === -1) {
    return res.status(404).json({ error: 'Item not found in cart' });
  }

  if (typeof delta === 'number') {
    cart.items[index].qty += delta;
    if (cart.items[index].qty <= 0) {
      cart.items.splice(index, 1);
    }
  }

  res.json(calculateCartTotals(cart));
});

app.delete('/api/cart/items/:id', (req, res) => {
  const sessionId = req.query.session_id || req.body.session_id || 'default-guest';
  const itemId = req.params.id;
  const size = req.query.size;

  const cart = getOrCreateCart(sessionId);
  cart.items = cart.items.filter(i => !((i.id.toString() === itemId || i.product_id === itemId) && (!size || i.size === size)));

  res.json(calculateCartTotals(cart));
});

app.post('/api/cart/apply-promo', (req, res) => {
  const sessionId = req.body.session_id || 'default-guest';
  const code = (req.body.code || '').trim().toUpperCase();
  const cart = getOrCreateCart(sessionId);

  if (code === 'KB10') {
    cart.applied_promo = 'KB10';
    cart.discount_percent = 10;
    return res.json({ success: true, message: 'Promo code KB10 applied! 10% discount subtracted.', cart: calculateCartTotals(cart) });
  } else if (code === 'WELCOME50') {
    cart.applied_promo = 'WELCOME50';
    cart.discount_percent = 0;
    return res.json({ success: true, message: 'Promo code WELCOME50 applied! ₹50 discount subtracted.', cart: calculateCartTotals(cart) });
  } else {
    return res.status(400).json({ success: false, error: "Invalid promo code. Try 'KB10'." });
  }
});

app.delete('/api/cart/clear', (req, res) => {
  const sessionId = req.query?.session_id || req.body?.session_id || 'default-guest';
  const cart = getOrCreateCart(sessionId);
  cart.items = [];
  cart.applied_promo = null;
  cart.discount_percent = 0;
  res.json(calculateCartTotals(cart));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[CartService] 🛒 Running on port ${PORT}`);
  });
}

module.exports = { app, getOrCreateCart, calculateCartTotals };

