const express = require('express');
const cors = require('cors');
const path = require('path');

// Import individual microservices for local unified orchestration
const catalogService = require('../catalog-service/index').app;
const cartService = require('../cart-service/index').app;
const orderService = require('../order-service/index').app;
const paymentService = require('../payment-service/index').app;
const merchantService = require('../merchant-service/index').app;
const adminService = require('../admin-service/index').app;

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;

// Request logging & correlation ID middleware
app.use((req, res, next) => {
  const correlationId = req.headers['x-correlation-id'] || `REQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  res.setHeader('X-Correlation-ID', correlationId);
  console.log(`[Gateway] ${req.method} ${req.url} (CID: ${correlationId})`);
  next();
});

// Health Check of Gateway and all downstream Microservices
app.get('/healthz', (req, res) => {
  res.json({
    status: 'healthy',
    gateway_port: PORT,
    timestamp: new Date().toISOString(),
    services: {
      catalog_service: 'ONLINE',
      cart_service: 'ONLINE',
      order_service: 'ONLINE',
      payment_service: 'ONLINE',
      merchant_service: 'ONLINE',
      admin_service: 'ONLINE'
    }
  });
});

// Mount Microservice Endpoints
app.use(catalogService);
app.use(cartService);
app.use(orderService);
app.use(paymentService);
app.use(merchantService);
app.use(adminService);

// Serve Frontend Static Client
const frontendDir = path.join(__dirname, '../../public');
app.use(express.static(frontendDir));

// Fallback SPA routing
app.use((req, res, next) => {
  if (req.url.startsWith('/api/')) return next();
  res.sendFile(path.join(frontendDir, 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(` 🚀 KB Online API Gateway listening on http://localhost:${PORT}`);
    console.log(` 📦 Catalog Service:   Mounted`);
    console.log(` 🛒 Cart Service:      Mounted`);
    console.log(` 📋 Order Service:     Mounted`);
    console.log(` 💳 Payment Service:   Mounted`);
    console.log(` 🏛️ Merchant Service:  Mounted`);
    console.log(` ⚖️ Admin Service:     Mounted`);
    console.log(`======================================================\n`);
  });
}

module.exports = app;
