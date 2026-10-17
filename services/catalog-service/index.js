const express = require('express');
const cors = require('cors');
const eventBus = require('../event-bus');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8002;

// Seeded Catalog with statutory & fintech metadata
const products = [
  {
    id: 1,
    product_id: "PRD-8801",
    merchant_id: "MCH-2026-9041",
    name: "Essential Oversized Tee",
    title: "Essential Combed Cotton Oversized Tee",
    price: 499,
    currency: "INR",
    category: "Men",
    tags: ["BESTSELLER"],
    hsn_code: "61091000",
    country_of_origin: "India",
    is_govt_verified_seller: true,
    tax_rate_percent: 18,
    sizes: ["S", "M", "L", "XL"],
    colors: ["#111111", "#737373", "#f2f2f0"],
    rating: 4.8,
    reviews: 142,
    stock_quantity: 45,
    manufacturer_details: "KB Retail Pvt Ltd, 42 Industrial Layout, Bengaluru KA 560038",
    collection: "Everyday Collection",
    fabric_care: "100% Combed Cotton. Machine wash cold with similar colors. Do not bleach.",
    fit_sizing: "Relaxed drop-shoulder oversized fit. Order standard size for intentional relaxed drape.",
    return_policy: "Free delivery on orders over ₹999. 7-day hassle-free easy returns guaranteed."
  },
  {
    id: 2,
    product_id: "PRD-8802",
    merchant_id: "MCH-2026-9041",
    name: "Relaxed Fit Cotton Shirt",
    title: "Relaxed Fit Breathable Cotton Shirt",
    price: 899,
    currency: "INR",
    category: "Men",
    tags: ["NEW"],
    hsn_code: "62052000",
    country_of_origin: "India",
    is_govt_verified_seller: true,
    tax_rate_percent: 18,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["#ffffff", "#111111", "#a3a3a3"],
    rating: 4.7,
    reviews: 89,
    stock_quantity: 30,
    manufacturer_details: "KB Retail Pvt Ltd, 42 Industrial Layout, Bengaluru KA 560038",
    collection: "New Season",
    fabric_care: "100% Premium Twill Cotton. Warm iron if needed.",
    fit_sizing: "Classic boxy relaxed drape with structured collar.",
    return_policy: "7-day easy return or size exchange."
  },
  {
    id: 3,
    product_id: "PRD-8803",
    merchant_id: "MCH-2026-9041",
    name: "Classic Cotton Hoodie",
    title: "Heavyweight Brushed Fleece Cotton Hoodie",
    price: 1099,
    currency: "INR",
    category: "Women",
    tags: ["POPULAR"],
    hsn_code: "61102000",
    country_of_origin: "India",
    is_govt_verified_seller: true,
    tax_rate_percent: 18,
    sizes: ["XS", "S", "M", "L"],
    colors: ["#181818", "#f4f4f1", "#525252"],
    rating: 4.9,
    reviews: 210,
    stock_quantity: 25,
    manufacturer_details: "KB Retail Pvt Ltd, 42 Industrial Layout, Bengaluru KA 560038",
    collection: "Comfort Collection",
    fabric_care: "380 GSM Organic Cotton Fleece. Hand or gentle machine wash.",
    fit_sizing: "Snug ribbed cuffs and hem with roomy torso.",
    return_policy: "7-day easy return or size exchange."
  },
  {
    id: 4,
    product_id: "PRD-8804",
    merchant_id: "MCH-2026-9041",
    name: "Straight Fit Trousers",
    title: "Everyday Minimalist Straight Fit Trousers",
    price: 799,
    currency: "INR",
    category: "Men",
    tags: ["SALE"],
    hsn_code: "62034200",
    country_of_origin: "India",
    is_govt_verified_seller: true,
    tax_rate_percent: 18,
    sizes: ["S", "M", "L", "XL"],
    colors: ["#111111", "#d4d4d4"],
    rating: 4.6,
    reviews: 76,
    stock_quantity: 40,
    manufacturer_details: "KB Retail Pvt Ltd, 42 Industrial Layout, Bengaluru KA 560038",
    collection: "Essential Collection",
    fabric_care: "Stretch Cotton Blend. Cold gentle wash.",
    fit_sizing: "Clean straight silhouette through hip and thigh.",
    return_policy: "7-day easy return."
  },
  {
    id: 5,
    product_id: "PRD-8805",
    merchant_id: "MCH-2026-8812",
    name: "Minimalist Linen Blouse",
    title: "Pure Handloom Woven Minimalist Linen Blouse",
    price: 999,
    currency: "INR",
    category: "Women",
    tags: ["NEW"],
    hsn_code: "62063000",
    country_of_origin: "India",
    is_govt_verified_seller: true,
    tax_rate_percent: 18,
    sizes: ["XS", "S", "M"],
    colors: ["#f7f7f5", "#a8a29e"],
    rating: 4.8,
    reviews: 64,
    stock_quantity: 18,
    manufacturer_details: "KB Handloom Artisans Guild, Sanganer, Jaipur RJ 302029",
    collection: "Summer Linen",
    fabric_care: "100% Breathable Flax Linen. Dry in shade.",
    fit_sizing: "Airy, tailored comfortable loose fit.",
    return_policy: "7-day easy return."
  },
  {
    id: 6,
    product_id: "PRD-8806",
    merchant_id: "MCH-2026-9041",
    name: "Heavyweight Crewneck Sweatshirt",
    title: "Brushed Fleece Heavyweight Crewneck Sweatshirt",
    price: 899,
    currency: "INR",
    category: "Offers",
    tags: ["SALE"],
    hsn_code: "61102000",
    country_of_origin: "India",
    is_govt_verified_seller: true,
    tax_rate_percent: 18,
    sizes: ["M", "L", "XL"],
    colors: ["#181818", "#78716c"],
    rating: 4.7,
    reviews: 118,
    stock_quantity: 52,
    manufacturer_details: "KB Retail Pvt Ltd, Focal Point, Ludhiana PB 141010",
    collection: "Winter Warmth",
    fabric_care: "340 GSM French Terry Cotton. Do not tumble dry.",
    fit_sizing: "Standard athletic relaxed fit.",
    return_policy: "7-day easy return."
  },
  {
    id: 7,
    product_id: "PRD-8807",
    merchant_id: "MCH-2026-9041",
    name: "Ribbed Knit Crop Top",
    title: "Soft Ribbed Stretch Knit Crop Top",
    price: 449,
    currency: "INR",
    category: "Women",
    tags: ["POPULAR"],
    hsn_code: "61099010",
    country_of_origin: "India",
    is_govt_verified_seller: true,
    tax_rate_percent: 18,
    sizes: ["XS", "S", "M"],
    colors: ["#111111", "#fafaf9"],
    rating: 4.5,
    reviews: 92,
    stock_quantity: 33,
    manufacturer_details: "KB Garments Export Park, Tirupur TN 641604",
    collection: "Basics Series",
    fabric_care: "95% Cotton 5% Elastane Ribbed Weave.",
    fit_sizing: "Contoured form-fitting silhouette.",
    return_policy: "7-day easy return."
  },
  {
    id: 8,
    product_id: "PRD-8808",
    merchant_id: "MCH-2026-9041",
    name: "Tailored Chino Shorts",
    title: "Pleated Tailored Cotton Chino Shorts",
    price: 699,
    currency: "INR",
    category: "Men",
    tags: ["BESTSELLER"],
    hsn_code: "62034200",
    country_of_origin: "India",
    is_govt_verified_seller: true,
    tax_rate_percent: 18,
    sizes: ["S", "M", "L", "XL"],
    colors: ["#e7e5e4", "#292524"],
    rating: 4.6,
    reviews: 81,
    stock_quantity: 22,
    manufacturer_details: "KB Textile Mills, Surat Textile Zone, Surat GJ 395002",
    collection: "Casual Fits",
    fabric_care: "100% Cotton Chino. Machine wash with warm water.",
    fit_sizing: "Sits comfortably at natural waist, 7-inch inseam.",
    return_policy: "7-day easy return."
  }
];

const categories = [
  { id: "cat-1", code: "01", name: "Men", subtitle: "Everyday essentials & fits", item_count: 4 },
  { id: "cat-2", code: "02", name: "Women", subtitle: "Modern everyday fashion", item_count: 3 },
  { id: "cat-3", code: "03", name: "New Arrivals", subtitle: "Fresh styles updated weekly", item_count: 2 },
  { id: "cat-4", code: "04", name: "Offers", subtitle: "More value for less price", item_count: 2 }
];

// Endpoints
app.get('/healthz', (req, res) => res.json({ status: 'ok', service: 'catalog-service' }));

app.get('/api/catalog/categories', (req, res) => {
  res.json({ categories });
});

app.get('/api/catalog/products', (req, res) => {
  let { category, size, maxPrice, sort, search } = req.query;
  let result = [...products];

  if (category && category !== 'All') {
    result = result.filter(p => p.category === category || p.tags.includes(category));
  }

  if (size && size !== 'All') {
    result = result.filter(p => p.sizes.includes(size));
  }

  if (maxPrice) {
    const limit = parseFloat(maxPrice);
    if (!isNaN(limit)) result = result.filter(p => p.price <= limit);
  }

  if (search) {
    const q = search.toLowerCase().trim();
    result = result.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.collection.toLowerCase().includes(q) || 
      p.tags.some(t => t.toLowerCase().includes(q)) ||
      p.hsn_code.includes(q)
    );
  }

  if (sort === 'price-low') {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    result.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    result.sort((a, b) => b.rating - a.rating);
  }

  res.json({
    total: products.length,
    visible: result.length,
    products: result
  });
});

app.get('/api/catalog/products/:id', (req, res) => {
  const idOrProductId = req.params.id;
  const product = products.find(p => p.id === parseInt(idOrProductId) || p.product_id === idOrProductId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ product });
});

app.patch('/api/catalog/products/:id/stock', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id) || p.product_id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const { delta } = req.body;
  if (typeof delta === 'number') {
    product.stock_quantity = Math.max(0, product.stock_quantity + delta);
    eventBus.publish('inventory.updated', { product_id: product.product_id, stock_quantity: product.stock_quantity });
  }
  res.json({ product });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[CatalogService] 📦 Running on port ${PORT}`);
  });
}

module.exports = { app, products, categories };

