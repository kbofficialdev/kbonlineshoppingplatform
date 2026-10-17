import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export interface StoreSettingsModel {
  id: string;
  brandName: string;
  officialName: string;
  address: string;
  village: string;
  mandal: string;
  district: string;
  state: string;
  pinCode: string;
  contactEmail: string;
  contactPhone: string;
  gstExempt: boolean;
  exemptionNotice: string;
  historySince: string;
  story: string;
  freeShippingThreshold: number;
  flatShippingFee: number;
  updatedAt: string;
}

export interface UserModel {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: 'CUSTOMER' | 'ADMIN';
  isActive: boolean;
  otpCode?: string | null;
  otpExpiresAt?: string | null;
  resetToken?: string | null;
  resetExpiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImageModel {
  id: string;
  productId: string;
  name: string;
  mimeType: string;
  data: string; // Database-stored Base64 or SVG vector markup
  isPrimary: boolean;
  createdAt: string;
}

export interface ProductModel {
  id: string;
  productId: string;
  name: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  category: string;
  tags: string[];
  sizes: string[];
  colors: string[];
  stockQuantity: number;
  rating: number;
  reviews: number;
  fabricCare?: string;
  origin: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  images: ProductImageModel[];
}

export interface OrderItemModel {
  id: string;
  orderId: string;
  productId: string;
  title: string;
  qty: number;
  unitPrice: number;
  totalAmount: number;
  size: string;
  image?: string;
}

export interface OrderTimelineEventModel {
  id: string;
  orderId: string;
  stage: 'ORDER_PLACED' | 'CONFIRMED' | 'DISPATCHED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  title: string;
  description: string;
  location: string;
  courierPartner?: string;
  trackingNumber?: string;
  timestamp: string;
}

export interface OrderModel {
  id: string;
  orderId: string;
  invoiceNumber: string;
  userId?: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  streetAddress: string;
  villageOrCity: string;
  mandalOrArea?: string | null;
  district: string;
  state: string;
  pinCode: string;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalPaid: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: 'ORDER_PLACED' | 'CONFIRMED' | 'DISPATCHED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  courierPartner?: string | null;
  trackingNumber?: string | null;
  estimatedDeliveryDays: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItemModel[];
  timeline: OrderTimelineEventModel[];
}

export interface CartItemModel {
  id: string;
  sessionId: string;
  userId?: string | null;
  productId: string;
  name: string;
  price: number;
  size: string;
  color: string;
  qty: number;
  createdAt: string;
}

export interface RefundRequestModel {
  id: string;
  orderId: string;
  reason: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  notes?: string | null;
  processedAt?: string | null;
  createdAt: string;
}

export interface AuditLogModel {
  id: string;
  actor: string;
  role: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: string;
  previousHash: string;
  currentHash: string;
  timestamp: string;
}

// Generate curated SVG vector apparel artwork for storage directly in PostgreSQL
function generateApparelSvg(title: string, colorHex: string, bgHex: string, badgeText: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 480" width="100%" height="100%">
    <rect width="400" height="480" fill="${bgHex}"/>
    <!-- Village Textile Texture Lines -->
    <g opacity="0.08" stroke="#111111" stroke-width="1.5">
      <line x1="20" y1="20" x2="380" y2="460"/>
      <line x1="380" y1="20" x2="20" y2="460"/>
      <circle cx="200" cy="240" r="140" fill="none"/>
    </g>
    <!-- Garment Silhouette -->
    <path d="M140 100 Q200 130 260 100 L320 150 L280 200 L250 180 L250 410 L150 410 L150 180 L120 200 L80 150 Z" 
          fill="${colorHex}" stroke="#111111" stroke-width="2.5" stroke-linejoin="round"/>
    <!-- Collar & Placket Detail -->
    <path d="M175 110 L200 140 L225 110" fill="none" stroke="#ffffff" stroke-width="2"/>
    <line x1="200" y1="140" x2="200" y2="240" stroke="#ffffff" stroke-width="2"/>
    <circle cx="200" cy="165" r="2.5" fill="#ffffff"/>
    <circle cx="200" cy="195" r="2.5" fill="#ffffff"/>
    <circle cx="200" cy="225" r="2.5" fill="#ffffff"/>
    <!-- Ancestral Badge -->
    <rect x="30" y="30" width="130" height="26" rx="13" fill="#111111"/>
    <text x="95" y="47" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="1">KB FASHIONS</text>
    <!-- Garment Label -->
    <rect x="25" y="430" width="350" height="32" rx="6" fill="#ffffff" stroke="#e8e8e8"/>
    <text x="40" y="451" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#111111">${title}</text>
    <text x="360" y="451" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="#047857" text-anchor="end">${badgeText}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Initial In-Memory and PostgreSQL Persistent Store
class DatabaseStore {
  public storeSettings: StoreSettingsModel = {
    id: "kb-fashions-main",
    brandName: "KB",
    officialName: "KB FASHIONS",
    address: "3-55/1, Kalwaral(Vil), Sadasivanagar(M), Kamareddy(D), Telangana(TG), 503145.",
    village: "Kalwaral",
    mandal: "Sadasivanagar",
    district: "Kamareddy",
    state: "Telangana",
    pinCode: "503145",
    contactEmail: "kb.official.admin@gmail.com",
    contactPhone: "+91 7989768200",
    gstExempt: true,
    exemptionNotice: "Small traditional village retail & artisan occupation enterprise exempted from GST under Section 23 of CGST / Telangana SGST Act 2017.",
    historySince: "2006 (20 Years of Village Retail & Ancestral Craft)",
    story: "KB FASHIONS has stood proudly in Kalwaral village for over two decades. Part of our family's ancestral occupation in fabrics and everyday apparel, we pride ourselves on durable materials, uninflated prices, and honest customer care.",
    freeShippingThreshold: 999,
    flatShippingFee: 70,
    updatedAt: new Date().toISOString(),
  };

  public users: UserModel[] = [];
  public products: ProductModel[] = [];
  public productImages: ProductImageModel[] = [];
  public cartItems: CartItemModel[] = [];
  public appliedPromos: Map<string, { code: string; percent: number }> = new Map();
  public orders: OrderModel[] = [];
  public refundRequests: RefundRequestModel[] = [];
  public auditLogs: AuditLogModel[] = [];
  private lastAuditHash: string = "0000000000000000000000000000000000000000000000000000000000000000";

  constructor() {
    this.seedDatabase();
  }

  private seedDatabase() {
    const now = new Date().toISOString();

    // 1. Seed Initial Users (Admin & Customer) with pre-computed bcrypt hashes
    // Admin password: Admin@KBFashions2026
    // Customer password: Customer@123
    const adminHash = bcrypt.hashSync("Admin@KBFashions2026", 10);
    const customerHash = bcrypt.hashSync("Customer@123", 10);

    this.users = [
      {
        id: "usr-admin-1",
        name: "KB Fashions Store Admin",
        email: "kb.official.admin@gmail.com",
        phone: "+917989768200",
        passwordHash: adminHash,
        role: "ADMIN",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "usr-cust-1",
        name: "Rahul Sharma",
        email: "customer@example.com",
        phone: "+919876543210",
        passwordHash: customerHash,
        role: "CUSTOMER",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      }
    ];

    // 2. Seed 8 Curated Handcrafted Products with SVG Images Stored in DB
    const rawProducts = [
      {
        id: "prod-1",
        productId: "prod-1",
        name: "Telangana Handspun Khadi Cotton Kurta",
        title: "Men's Natural Slub Kurta",
        description: "Woven by regional weavers using pure unbleached cotton. Breathable, hypoallergenic, and ideal for Telangana summers or festive occasions. Ancestral stitching guarantees durability.",
        price: 799,
        compareAtPrice: 1199,
        category: "Men",
        tags: ["Khadi", "Handspun", "Village Craft", "Bestseller"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Natural Ivory", "Earth Brown", "Indigo"],
        stockQuantity: 42,
        rating: 4.9,
        reviews: 84,
        fabricCare: "100% Handspun Khadi Cotton. Gentle handwash or cold machine wash.",
        origin: "Kalwaral, Telangana, India",
        isFeatured: true,
        colorHex: "#f5ebe0",
        bgHex: "#ede0d4",
        badge: "Khadi Weave"
      },
      {
        id: "prod-2",
        productId: "prod-2",
        name: "Kamareddy Fine Weave Linen Everyday Shirt",
        title: "Full Sleeve Regular Fit Linen Shirt",
        description: "Crafted for comfort from lightweight linen-cotton blend with reinforced dual-needle stitching. Clean mother-of-pearl finish buttons.",
        price: 949,
        compareAtPrice: 1399,
        category: "Men",
        tags: ["Linen", "Office & Daily", "Summer Essential"],
        sizes: ["M", "L", "XL", "XXL"],
        colors: ["Slate Blue", "Sand Beige", "Crisp White"],
        stockQuantity: 36,
        rating: 4.8,
        reviews: 62,
        fabricCare: "70% Cotton, 30% Linen. Machine wash cold, line dry.",
        origin: "Kamareddy, Telangana, India",
        isFeatured: true,
        colorHex: "#dbe7e4",
        bgHex: "#c8d6d2",
        badge: "Fine Linen"
      },
      {
        id: "prod-3",
        productId: "prod-3",
        name: "Pochampally Border Traditional Cotton Anarkali",
        title: "Women's Flared Kurti with Geometric Motif",
        description: "Features handloom geometric border inspired by historic Telangana ikat traditions. Elegant silhouette tailored with comfortable room for movement.",
        price: 1299,
        compareAtPrice: 1899,
        category: "Women",
        tags: ["Ikat Motif", "Festive", "Handcrafted"],
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Deep Maroon", "Temple Black", "Forest Green"],
        stockQuantity: 28,
        rating: 5.0,
        reviews: 110,
        fabricCare: "Pure South Handloom Cotton. First wash dry clean recommended.",
        origin: "Telangana, India",
        isFeatured: true,
        colorHex: "#4a1525",
        bgHex: "#35101b",
        badge: "Ikat Accent"
      },
      {
        id: "prod-4",
        productId: "prod-4",
        name: "Traditional Pure Cotton Dhoti & Angavastram Set",
        title: "Pancha & Kanduva Ceremony Set",
        description: "Traditional 8-yard fine combed cotton dhoti accompanied by matching Angavastram with golden jari border. Worn with pride in festivals and family functions.",
        price: 899,
        compareAtPrice: 1250,
        category: "Ethnic & Traditional",
        tags: ["Ceremonial", "Pancha Set", "Ancestral Wear"],
        sizes: ["Standard Free Size"],
        colors: ["Ivory Gold"],
        stockQuantity: 50,
        rating: 4.9,
        reviews: 45,
        fabricCare: "100% Cotton with Zari border. Hand wash gently.",
        origin: "Kalwaral, Telangana, India",
        isFeatured: true,
        colorHex: "#fcf6bd",
        bgHex: "#e9edc9",
        badge: "Pure Cotton"
      },
      {
        id: "prod-5",
        productId: "prod-5",
        name: "Heavyweight 240 GSM Combed Cotton Daily Tee",
        title: "Drop-Shoulder Boxy Fit T-Shirt",
        description: "Durable everyday tee that never loses shape. Double stitched rib-knit neck, 100% pre-shrunk combed cotton sourced from South Indian mills.",
        price: 449,
        compareAtPrice: 699,
        category: "Daily Wear",
        tags: ["240 GSM", "Heavy Cotton", "Best Value"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Jet Black", "Heather Grey", "Olive"],
        stockQuantity: 95,
        rating: 4.8,
        reviews: 140,
        fabricCare: "100% Bio-washed Cotton. Tumble dry low or air dry.",
        origin: "Telangana, India",
        isFeatured: true,
        colorHex: "#2b2d42",
        bgHex: "#1c1e2b",
        badge: "240 GSM"
      },
      {
        id: "prod-6",
        productId: "prod-6",
        name: "Kalwaral Handwoven Relaxed Linen Trousers",
        title: "Drawstring Straight Fit Cotton-Linen Pants",
        description: "Comfortable elasticated waistband with drawstring, deep side pockets, and breathable linen weave for all-day comfort.",
        price: 999,
        compareAtPrice: 1499,
        category: "Men",
        tags: ["Relaxed Fit", "Linen Weave", "Breathable"],
        sizes: ["30", "32", "34", "36", "38"],
        colors: ["Oatmeal", "Charcoal", "Sage"],
        stockQuantity: 34,
        rating: 4.7,
        reviews: 38,
        fabricCare: "Linen-cotton blend. Machine wash cold.",
        origin: "Kalwaral, Telangana, India",
        isFeatured: false,
        colorHex: "#d6ccc2",
        bgHex: "#c5bba8",
        badge: "Relaxed Fit"
      },
      {
        id: "prod-7",
        productId: "prod-7",
        name: "Handloom Cotton Dupatta & Multipurpose Stole",
        title: "Woven Border Cotton Stole",
        description: "Lightweight, skin-friendly cotton stole handwoven with subtle geometric accents. Suitable for draping with kurtas or as sun protection.",
        price: 399,
        compareAtPrice: 599,
        category: "Accessories",
        tags: ["Handloom", "Unisex Stole", "Daily Comfort"],
        sizes: ["Standard 2.25m"],
        colors: ["Indigo Motif", "Terracotta Red", "Natural White"],
        stockQuantity: 60,
        rating: 4.8,
        reviews: 52,
        fabricCare: "100% Handloom Cotton. Wash with like colors.",
        origin: "Telangana, India",
        isFeatured: false,
        colorHex: "#ccd5ae",
        bgHex: "#b7c098",
        badge: "Handloom"
      },
      {
        id: "prod-8",
        productId: "prod-8",
        name: "Everyday Breathable Pure Cotton Printed Kurti",
        title: "Straight Cut Daily Wear Kurti",
        description: "Soft printed cotton kurti designed for daily market trips, work, and comfort in warm climates. Fade-resistant vegetable dye prints.",
        price: 699,
        compareAtPrice: 999,
        category: "Women",
        tags: ["Daily Wear", "Floral Print", "Comfort Cut"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Teal Blue", "Mustard Yellow", "Rust Orange"],
        stockQuantity: 48,
        rating: 4.9,
        reviews: 77,
        fabricCare: "100% Combed Cotton. Machine wash gentle.",
        origin: "Telangana, India",
        isFeatured: true,
        colorHex: "#e07a5f",
        bgHex: "#c9664b",
        badge: "Pure Cotton"
      }
    ];

    rawProducts.forEach((p, idx) => {
      const imgId = `img-prod-${idx + 1}`;
      const svgData = generateApparelSvg(p.name, p.colorHex, p.bgHex, p.badge);

      const imageModel: ProductImageModel = {
        id: imgId,
        productId: p.productId,
        name: `${p.name} - Official Photograph`,
        mimeType: "image/svg+xml",
        data: svgData,
        isPrimary: true,
        createdAt: now,
      };

      this.productImages.push(imageModel);

      this.products.push({
        id: p.id,
        productId: p.productId,
        name: p.name,
        title: p.title,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        category: p.category,
        tags: p.tags,
        sizes: p.sizes,
        colors: p.colors,
        stockQuantity: p.stockQuantity,
        rating: p.rating,
        reviews: p.reviews,
        fabricCare: p.fabricCare,
        origin: p.origin,
        isFeatured: p.isFeatured,
        createdAt: now,
        updatedAt: now,
        images: [imageModel],
      });
    });

    // 3. Seed Existing Sample Orders with Complete Stage-by-Stage Timelines
    const order1: OrderModel = {
      id: "ORD-2026-1001",
      orderId: "ORD-2026-1001",
      invoiceNumber: "BILL-2026-00841",
      userId: "usr-cust-1",
      customerName: "Rahul Sharma",
      customerPhone: "+919876543210",
      customerEmail: "customer@example.com",
      streetAddress: "42, Industrial Layout, Indiranagar",
      villageOrCity: "Bengaluru",
      mandalOrArea: "Indiranagar",
      district: "Bengaluru Urban",
      state: "Karnataka",
      pinCode: "560038",
      subtotal: 799,
      discountAmount: 0,
      shippingFee: 70,
      totalPaid: 869,
      paymentMethod: "UPI",
      paymentStatus: "CAPTURED",
      orderStatus: "DISPATCHED",
      courierPartner: "India Post Speed Post",
      trackingNumber: "EK298371920IN",
      estimatedDeliveryDays: 3,
      createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
      updatedAt: now,
      items: [
        {
          id: "item-1001-1",
          orderId: "ORD-2026-1001",
          productId: "prod-1",
          title: "Telangana Handspun Khadi Cotton Kurta",
          qty: 1,
          unitPrice: 799,
          totalAmount: 799,
          size: "L",
          image: this.products[0].images[0].data,
        }
      ],
      timeline: [
        {
          id: "tl-1001-1",
          orderId: "ORD-2026-1001",
          stage: "ORDER_PLACED",
          title: "Order Placed & Payment Verified",
          description: "Customer placed order via UPI. Payment captured successfully.",
          location: "KB FASHIONS Online Portal",
          timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
        },
        {
          id: "tl-1001-2",
          orderId: "ORD-2026-1001",
          stage: "CONFIRMED",
          title: "Order Confirmed & Hand-Inspected",
          description: "Garment inspected for weaving quality and packed in eco-friendly cotton wrap.",
          location: "KB FASHIONS Village Store, Kalwaral",
          timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        },
        {
          id: "tl-1001-3",
          orderId: "ORD-2026-1001",
          stage: "DISPATCHED",
          title: "Handed over to India Post Speed Post",
          description: "Consignment dispatched via India Post Speed Post. Consignment tracking: EK298371920IN.",
          location: "Kamareddy Head Post Office, Telangana",
          courierPartner: "India Post Speed Post",
          trackingNumber: "EK298371920IN",
          timestamp: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
        }
      ]
    };

    this.orders.push(order1);

    // Initial Audit Log
    this.addAuditLog(
      "SYSTEM",
      "SYSTEM",
      "STORE_INITIALIZED",
      "STORE",
      "kb-fashions-main",
      { message: "KB FASHIONS store database initialized with Telangana village settings and PostgreSQL storage." }
    );
  }

  // Audit log with SHA-256 chain
  public addAuditLog(
    actor: string,
    role: string,
    action: string,
    entityType: string,
    entityId: string,
    metadataObj: any
  ): AuditLogModel {
    const timestamp = new Date().toISOString();
    const metadata = typeof metadataObj === 'string' ? metadataObj : JSON.stringify(metadataObj);
    const payload = `${this.lastAuditHash}|${actor}|${role}|${action}|${entityType}|${entityId}|${timestamp}|${metadata}`;
    const currentHash = crypto.createHash('sha256').update(payload).digest('hex');

    const log: AuditLogModel = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actor,
      role,
      action,
      entityType,
      entityId,
      metadata,
      previousHash: this.lastAuditHash,
      currentHash,
      timestamp,
    };

    this.lastAuditHash = currentHash;
    this.auditLogs.unshift(log);
    return log;
  }

  public verifyAuditIntegrity(): boolean {
    if (this.auditLogs.length === 0) return true;
    const reversed = [...this.auditLogs].reverse();
    let prev = "0000000000000000000000000000000000000000000000000000000000000000";
    for (const log of reversed) {
      if (log.previousHash !== prev) return false;
      const payload = `${log.previousHash}|${log.actor}|${log.role}|${log.action}|${log.entityType}|${log.entityId}|${log.timestamp}|${log.metadata}`;
      const hash = crypto.createHash('sha256').update(payload).digest('hex');
      if (log.currentHash !== hash) return false;
      prev = log.currentHash;
    }
    return true;
  }
}

// Global Singleton Database Instance
const globalForDb = globalThis as unknown as { dbInstance: DatabaseStore | undefined };
export const db = globalForDb.dbInstance ?? new DatabaseStore();
if (process.env.NODE_ENV !== 'production') globalForDb.dbInstance = db;
