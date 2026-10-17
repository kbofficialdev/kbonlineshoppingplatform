const gateway = require('./services/api-gateway/index');

const PORT = process.env.PORT || 8000;

const server = gateway.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(` 🌟 KB Online Shopping Platform Microservices Active!`);
  console.log(` 🌐 Frontend & API Gateway: http://localhost:${PORT}`);
  console.log(` 📦 Catalog API:           http://localhost:${PORT}/api/catalog/products`);
  console.log(` 🛒 Cart API:              http://localhost:${PORT}/api/cart`);
  console.log(` 📋 Order API:             http://localhost:${PORT}/api/orders`);
  console.log(` 💳 Payment & Invoices:    http://localhost:${PORT}/api/payments`);
  console.log(` 🏛️ Merchant KYC GVE:      http://localhost:${PORT}/api/merchants`);
  console.log(` ⚖️ Admin Governance:      http://localhost:${PORT}/api/admin`);
  console.log(`======================================================\n`);
});

module.exports = server;

