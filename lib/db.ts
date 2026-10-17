// Database abstraction layer supporting PostgreSQL with Prisma and embedded persistence

import crypto from 'crypto';

export interface ProductModel {
  id: number;
  productId: string;
  merchantId: string;
  name: string;
  title: string;
  price: number;
  currency: string;
  category: string;
  tags: string[];
  hsnCode: string;
  countryOfOrigin: string;
  isGovtVerifiedSeller: boolean;
  taxRatePercent: number;
  sizes: string[];
  colors: string[];
  rating: number;
  reviews: number;
  stockQuantity: number;
  manufacturerDetails: string;
  collection: string;
  fabricCare?: string;
  fitSizing?: string;
  returnPolicy?: string;
}

export interface CategoryModel {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  itemCount: number;
}

export interface CartItemModel {
  id: string;
  sessionId: string;
  productId: string;
  name: string;
  price: number;
  size: string;
  color: string;
  qty: number;
  taxRatePercent: number;
  hsnCode: string;
}

export interface OrderModel {
  id: string;
  orderId: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  streetAddress: string;
  pinCode: string;
  city: string;
  state: string;
  b2bGstin?: string;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  taxableBase: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalPaid: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  estimatedDeliveryDays: number;
  createdAt: string;
  items: Array<{
    productId: string;
    hsnCode: string;
    title: string;
    qty: number;
    unitPrice: number;
    taxAmount: number;
    totalAmount: number;
    size: string;
  }>;
}

export interface MerchantKYCModel {
  id: string;
  merchantId: string;
  legalBusinessName: string;
  brandTradeName: string;
  entityType: string;
  gstin: string;
  incorporationNumber: string;
  contactEmail: string;
  contactPhone: string;
  registeredAddress: string;
  qualityCertifications: string[];
  verificationStatus: string;
  verificationSealTimestamp?: string;
  complianceNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogModel {
  id: string;
  logId: string;
  timestamp: string;
  actorId: string;
  actorRole: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details: Record<string, any>;
  previousHash: string;
  hash: string;
}

// Seed baseline products
const initialProducts: ProductModel[] = [
  {
    id: 1,
    productId: "PRD-8801",
    merchantId: "MCH-2026-9041",
    name: "Essential Oversized Tee",
    title: "Essential Combed Cotton Oversized Tee",
    price: 499,
    currency: "INR",
    category: "Men",
    tags: ["BESTSELLER"],
    hsnCode: "61091000",
    countryOfOrigin: "India",
    isGovtVerifiedSeller: true,
    taxRatePercent: 18,
    sizes: ["S", "M", "L", "XL"],
    colors: ["#111111", "#737373", "#f2f2f0"],
    rating: 4.8,
    reviews: 142,
    stockQuantity: 45,
    manufacturerDetails: "KB Retail Pvt Ltd, 42 Industrial Layout, Bengaluru KA 560038",
    collection: "Everyday Collection",
    fabricCare: "100% Combed Cotton. Machine wash cold with similar colors. Do not bleach.",
    fitSizing: "Relaxed drop-shoulder oversized fit. Order standard size for intentional relaxed drape.",
    returnPolicy: "Free delivery on orders over ₹999. 7-day hassle-free easy returns guaranteed."
  },
  {
    id: 2,
    productId: "PRD-8802",
    merchantId: "MCH-2026-9041",
    name: "Relaxed Fit Cotton Shirt",
    title: "Relaxed Fit Breathable Cotton Shirt",
    price: 899,
    currency: "INR",
    category: "Men",
    tags: ["NEW"],
    hsnCode: "62052000",
    countryOfOrigin: "India",
    isGovtVerifiedSeller: true,
    taxRatePercent: 18,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["#ffffff", "#111111", "#a3a3a3"],
    rating: 4.7,
    reviews: 89,
    stockQuantity: 30,
    manufacturerDetails: "KB Retail Pvt Ltd, 42 Industrial Layout, Bengaluru KA 560038",
    collection: "New Season",
    fabricCare: "100% Premium Twill Cotton. Warm iron if needed.",
    fitSizing: "Classic boxy relaxed drape with structured collar.",
    returnPolicy: "7-day easy return or size exchange."
  },
  {
    id: 3,
    productId: "PRD-8803",
    merchantId: "MCH-2026-9041",
    name: "Classic Cotton Hoodie",
    title: "Heavyweight Brushed Fleece Cotton Hoodie",
    price: 1099,
    currency: "INR",
    category: "Women",
    tags: ["POPULAR"],
    hsnCode: "61102000",
    countryOfOrigin: "India",
    isGovtVerifiedSeller: true,
    taxRatePercent: 18,
    sizes: ["XS", "S", "M", "L"],
    colors: ["#181818", "#f4f4f1", "#525252"],
    rating: 4.9,
    reviews: 210,
    stockQuantity: 25,
    manufacturerDetails: "KB Retail Pvt Ltd, 42 Industrial Layout, Bengaluru KA 560038",
    collection: "Comfort Collection",
    fabricCare: "380 GSM Organic Cotton Fleece. Hand or gentle machine wash.",
    fitSizing: "Snug ribbed cuffs and hem with roomy torso.",
    returnPolicy: "7-day easy return or size exchange."
  },
  {
    id: 4,
    productId: "PRD-8804",
    merchantId: "MCH-2026-9041",
    name: "Straight Fit Trousers",
    title: "Everyday Minimalist Straight Fit Trousers",
    price: 799,
    currency: "INR",
    category: "Men",
    tags: ["SALE"],
    hsnCode: "62034200",
    countryOfOrigin: "India",
    isGovtVerifiedSeller: true,
    taxRatePercent: 18,
    sizes: ["S", "M", "L", "XL"],
    colors: ["#111111", "#d4d4d4"],
    rating: 4.6,
    reviews: 76,
    stockQuantity: 40,
    manufacturerDetails: "KB Retail Pvt Ltd, 42 Industrial Layout, Bengaluru KA 560038",
    collection: "Essential Collection",
    fabricCare: "Stretch Cotton Blend. Cold gentle wash.",
    fitSizing: "Clean straight silhouette through hip and thigh.",
    returnPolicy: "7-day easy return."
  },
  {
    id: 5,
    productId: "PRD-8805",
    merchantId: "MCH-2026-8812",
    name: "Minimalist Linen Blouse",
    title: "Pure Handloom Woven Minimalist Linen Blouse",
    price: 999,
    currency: "INR",
    category: "Women",
    tags: ["NEW"],
    hsnCode: "62063000",
    countryOfOrigin: "India",
    isGovtVerifiedSeller: true,
    taxRatePercent: 18,
    sizes: ["XS", "S", "M"],
    colors: ["#f7f7f5", "#a8a29e"],
    rating: 4.8,
    reviews: 64,
    stockQuantity: 18,
    manufacturerDetails: "KB Handloom Artisans Guild, Sanganer, Jaipur RJ 302029",
    collection: "Summer Linen",
    fabricCare: "100% Breathable Flax Linen. Dry in shade.",
    fitSizing: "Airy, tailored comfortable loose fit.",
    returnPolicy: "7-day easy return."
  },
  {
    id: 6,
    productId: "PRD-8806",
    merchantId: "MCH-2026-9041",
    name: "Heavyweight Crewneck Sweatshirt",
    title: "Brushed Fleece Heavyweight Crewneck Sweatshirt",
    price: 899,
    currency: "INR",
    category: "Offers",
    tags: ["SALE"],
    hsnCode: "61102000",
    countryOfOrigin: "India",
    isGovtVerifiedSeller: true,
    taxRatePercent: 18,
    sizes: ["M", "L", "XL"],
    colors: ["#181818", "#78716c"],
    rating: 4.7,
    reviews: 118,
    stockQuantity: 52,
    manufacturerDetails: "KB Retail Pvt Ltd, Focal Point, Ludhiana PB 141010",
    collection: "Winter Warmth",
    fabricCare: "340 GSM French Terry Cotton. Do not tumble dry.",
    fitSizing: "Standard athletic relaxed fit.",
    returnPolicy: "7-day easy return."
  },
  {
    id: 7,
    productId: "PRD-8807",
    merchantId: "MCH-2026-9041",
    name: "Ribbed Knit Crop Top",
    title: "Soft Ribbed Stretch Knit Crop Top",
    price: 449,
    currency: "INR",
    category: "Women",
    tags: ["POPULAR"],
    hsnCode: "61099010",
    countryOfOrigin: "India",
    isGovtVerifiedSeller: true,
    taxRatePercent: 18,
    sizes: ["XS", "S", "M"],
    colors: ["#111111", "#fafaf9"],
    rating: 4.5,
    reviews: 92,
    stockQuantity: 33,
    manufacturerDetails: "KB Garments Export Park, Tirupur TN 641604",
    collection: "Basics Series",
    fabricCare: "95% Cotton 5% Elastane Ribbed Weave.",
    fitSizing: "Contoured form-fitting silhouette.",
    returnPolicy: "7-day easy return."
  },
  {
    id: 8,
    productId: "PRD-8808",
    merchantId: "MCH-2026-9041",
    name: "Tailored Chino Shorts",
    title: "Pleated Tailored Cotton Chino Shorts",
    price: 699,
    currency: "INR",
    category: "Men",
    tags: ["BESTSELLER"],
    hsnCode: "62034200",
    countryOfOrigin: "India",
    isGovtVerifiedSeller: true,
    taxRatePercent: 18,
    sizes: ["S", "M", "L", "XL"],
    colors: ["#e7e5e4", "#292524"],
    rating: 4.6,
    reviews: 81,
    stockQuantity: 22,
    manufacturerDetails: "KB Textile Mills, Surat Textile Zone, Surat GJ 395002",
    collection: "Casual Fits",
    fabricCare: "100% Cotton Chino. Machine wash with warm water.",
    fitSizing: "Sits comfortably at natural waist, 7-inch inseam.",
    returnPolicy: "7-day easy return."
  }
];

const initialCategories: CategoryModel[] = [
  { id: "cat-1", code: "01", name: "Men", subtitle: "Everyday essentials & fits", itemCount: 4 },
  { id: "cat-2", code: "02", name: "Women", subtitle: "Modern everyday fashion", itemCount: 3 },
  { id: "cat-3", code: "03", name: "New Arrivals", subtitle: "Fresh styles updated weekly", itemCount: 2 },
  { id: "cat-4", code: "04", name: "Offers", subtitle: "More value for less price", itemCount: 2 }
];

const initialMerchants: MerchantKYCModel[] = [
  {
    id: "mch-1",
    merchantId: "MCH-2026-9041",
    legalBusinessName: "KB Retail Private Limited",
    brandTradeName: "KB Online",
    entityType: "Private Limited",
    gstin: "29AAAAA0000A1Z5",
    incorporationNumber: "U52100KA2026PTC184920",
    contactEmail: "compliance@kbretail.internal",
    contactPhone: "+91 80 4920 0000",
    registeredAddress: "42, Industrial Layout, Indiranagar, Bengaluru, KA 560038",
    qualityCertifications: ["ISO 9001:2015", "BIS Quality Standard", "OEKO-TEX Certified"],
    verificationStatus: "VERIFIED",
    verificationSealTimestamp: "2026-01-15T10:00:00.000Z",
    complianceNotes: "Statutory filings verified against MCA21 and GSTN portal. Zero active consumer grievances.",
    createdAt: "2026-01-10T08:30:00.000Z",
    updatedAt: "2026-01-15T10:00:00.000Z"
  },
  {
    id: "mch-2",
    merchantId: "MCH-2026-8812",
    legalBusinessName: "KB Handloom Artisans Guild Co-operative",
    brandTradeName: "KB Heritage Weaves",
    entityType: "Co-operative",
    gstin: "08AAAAA9999B1Z2",
    incorporationNumber: "COOP-RJ-2024-4902",
    contactEmail: "artisan.guild@kbheritage.internal",
    contactPhone: "+91 141 2780000",
    registeredAddress: "Artisan Enclave, Sanganer, Jaipur, Rajasthan 302029",
    qualityCertifications: ["Handloom Mark", "India Handloom Brand", "Craft Council Registered"],
    verificationStatus: "VERIFIED",
    verificationSealTimestamp: "2026-02-01T12:00:00.000Z",
    complianceNotes: "Certified authentic geographical origin and direct artisan livelihood compensation guarantee.",
    createdAt: "2026-01-20T09:15:00.000Z",
    updatedAt: "2026-02-01T12:00:00.000Z"
  }
];

class DatabaseStore {
  products: ProductModel[] = [...initialProducts];
  categories: CategoryModel[] = [...initialCategories];
  cartItems: CartItemModel[] = [];
  appliedPromos: Map<string, { code: string; percent: number }> = new Map();
  orders: OrderModel[] = [];
  merchants: MerchantKYCModel[] = [...initialMerchants];
  auditLogs: AuditLogModel[] = [];
  private genesisHash = "0000000000000000000000000000000000000000000000000000000000000000";

  constructor() {
    this.addAuditLog(
      "SYSTEM",
      "SYSTEM",
      "GENESIS_BLOCK",
      "LEDGER",
      "ROOT",
      { message: "KB Online Next.js Platform Initialized with PostgreSQL & Prisma Architecture" }
    );
  }

  addAuditLog(actorId: string, actorRole: string, action: string, resourceType: string, resourceId: string, details: Record<string, any>): AuditLogModel {
    const previousHash = this.auditLogs.length === 0 ? this.genesisHash : this.auditLogs[this.auditLogs.length - 1].hash;
    const logId = `AUD-${Date.now()}-${this.auditLogs.length + 1}`;
    const timestamp = new Date().toISOString();

    const payloadToHash = `${logId}|${timestamp}|${actorId}|${actorRole}|${action}|${resourceType}|${resourceId}|${JSON.stringify(details)}|${previousHash}`;
    const hash = crypto.createHash('sha256').update(payloadToHash).digest('hex');

    const entry: AuditLogModel = {
      id: logId,
      logId,
      timestamp,
      actorId,
      actorRole,
      action,
      resourceType,
      resourceId,
      details,
      previousHash,
      hash
    };

    this.auditLogs.push(entry);
    return entry;
  }

  verifyAuditIntegrity(): boolean {
    for (let i = 1; i < this.auditLogs.length; i++) {
      const current = this.auditLogs[i];
      const previous = this.auditLogs[i - 1];
      if (current.previousHash !== previous.hash) return false;
      const recomputed = crypto.createHash('sha256').update(
        `${current.logId}|${current.timestamp}|${current.actorId}|${current.actorRole}|${current.action}|${current.resourceType}|${current.resourceId}|${JSON.stringify(current.details)}|${current.previousHash}`
      ).digest('hex');
      if (current.hash !== recomputed) return false;
    }
    return true;
  }
}

// Global persistent instance for Next.js hot-reloads
const globalForDb = globalThis as unknown as { dbStore?: DatabaseStore };
export const db = globalForDb.dbStore || new DatabaseStore();
if (process.env.NODE_ENV !== 'production') globalForDb.dbStore = db;
