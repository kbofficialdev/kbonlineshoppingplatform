import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export interface BannerModel {
  id: string;
  bannerId: string;
  title: string;
  subtitle: string;
  badge: string;
  category: 'HERO' | 'WELCOME' | 'FEATURE' | 'AI';
  mediaId: string;
  imageUrl: string;
  linkUrl: string;
  ctaText: string;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

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

export interface AddressModel {
  id: string;
  userId: string;
  name: string;
  phone: string;
  tag: 'Home' | 'Work' | 'Village' | 'Other';
  streetAddress: string;
  villageOrCity: string;
  mandalOrArea?: string;
  district: string;
  state: string;
  pinCode: string;
  isDefault: boolean;
  createdAt: string;
}

export interface PaymentMethodModel {
  id: string;
  userId: string;
  type: 'UPI' | 'CARD' | 'NETBANKING' | 'COD';
  label: string;
  identifier: string;
  isDefault: boolean;
  createdAt: string;
}

export interface UserModel {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: 'CUSTOMER' | 'ADMIN';
  isActive: boolean;
  avatar?: string | null;
  villageOrCity?: string;
  mandalOrArea?: string;
  district?: string;
  state?: string;
  pinCode?: string;
  preferredLanguage?: 'en' | 'te';
  smsUpdates?: boolean;
  whatsappUpdates?: boolean;
  bio?: string;
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

export interface SareeDetails {
  lengthMeters?: number; // e.g. 5.5, 6.3
  hasBlousePiece?: boolean;
  blouseLengthMeters?: number;
  workType?: string; // "Gadwal Handloom", "Pure Pattu Silk", "Nirma Daily", "Layered Heavy Zari Work"
  borderType?: string; // "Pure Zari", "Temple Border", "Contrast Kaddi", "Broad Border"
  palluDetails?: string;
}

export interface UnstitchedDetails {
  fabricCutType?: string; // "Shirt Piece", "Pant Piece", "Safari Suit Length", "Full Kurta Material", "By Meter"
  widthInches?: number; // e.g. 58" or 36"
  standardLengthMeters?: number; // e.g. 1.6
  recommendedUse?: string; // "Formal Trouser", "Wedding Kurta", "Office Shirt"
}

export interface EssentialDetails {
  packSize?: number; // 1, 3, 6, 12
  measurementUnit?: string; // "cm (Chest)", "Inches"
  measurementValues?: string[]; // ["80cm", "85cm", "90cm", "95cm", "100cm"]
}

export interface MatchingDetails {
  matchingBlouseColor?: string;
  matchingFallPicoAvailable?: boolean;
  customDesignerNotes?: string;
}

export type ProductType = 
  | 'SAREE' 
  | 'MEN_UNSTITCHED' 
  | 'WOMEN_WEAR' 
  | 'BLOUSE_PIECE' 
  | 'DHOTI_TOWEL' 
  | 'INNER_ESSENTIAL' 
  | 'GENERAL';

export interface ProductModel {
  id: string;
  productId: string;
  name: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  category: string;
  productType: ProductType;
  brand: string;
  fabric: string;
  isUnstitched: boolean;
  unitType: 'PIECE' | 'METER';
  pricePerMeter?: number | null;
  availableMeters?: number[];
  tags: string[];
  sizes: string[];
  colors: string[];
  stockQuantity: number;
  rating: number;
  reviews: number;
  fabricCare?: string;
  origin: string;
  isFeatured: boolean;
  sareeDetails?: SareeDetails;
  unstitchedDetails?: UnstitchedDetails;
  essentialDetails?: EssentialDetails;
  matchingDetails?: MatchingDetails;
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
  cutLength?: number | null;
  configuration?: Record<string, any> | null;
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
  cutLength?: number | null;
  configuration?: Record<string, any> | null;
  createdAt: string;
}

export interface RefundRequestModel {
  id: string;
  orderId: string;
  reason: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  notes?: string | null;
  createdAt: string;
  processedAt?: string | null;
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

// Generate curated SVG vector artwork tailored to village store product types
function generateApparelSvg(
  title: string, 
  productType: ProductType, 
  colorHex: string, 
  bgHex: string, 
  badgeText: string,
  brandText: string
): string {
  let illustration = '';

  if (productType === 'SAREE') {
    // Elegant pleated Saree silhouette with gold zari border & pallu
    illustration = `
      <!-- Saree Draping & Pallu -->
      <path d="M120 120 C180 80, 260 80, 310 140 L280 400 C220 420, 160 410, 110 390 Z" fill="${colorHex}" stroke="#222222" stroke-width="2"/>
      <!-- Gold Zari Border -->
      <path d="M110 375 C160 395, 220 405, 280 385 L280 400 C220 420, 160 410, 110 390 Z" fill="#D4AF37"/>
      <path d="M120 120 C180 80, 260 80, 310 140 L300 155 C250 100, 180 100, 125 135 Z" fill="#D4AF37"/>
      <!-- Temple Motif Pleats -->
      <g stroke="#ffffff" stroke-width="1.2" opacity="0.4">
        <line x1="160" y1="180" x2="160" y2="380"/>
        <line x1="190" y1="180" x2="190" y2="390"/>
        <line x1="220" y1="180" x2="220" y2="395"/>
      </g>
    `;
  } else if (productType === 'MEN_UNSTITCHED') {
    // Unstitched Fabric Bolt / Roll with Meter markers
    illustration = `
      <!-- Unstitched Fabric Roll -->
      <rect x="100" y="140" width="200" height="230" rx="12" fill="${colorHex}" stroke="#222222" stroke-width="2"/>
      <!-- Fabric Weave / Texture Grid -->
      <g stroke="#ffffff" stroke-width="1" opacity="0.35">
        <line x1="100" y1="180" x2="300" y2="180"/>
        <line x1="100" y1="220" x2="300" y2="220"/>
        <line x1="100" y1="260" x2="300" y2="260"/>
        <line x1="100" y1="300" x2="300" y2="300"/>
        <line x1="100" y1="340" x2="300" y2="340"/>
      </g>
      <!-- Premium Suiting & Shirting Seal -->
      <circle cx="200" cy="240" r="38" fill="#111111" stroke="#D4AF37" stroke-width="2.5"/>
      <text x="200" y="235" font-family="Inter, sans-serif" font-size="9" font-weight="800" fill="#D4AF37" text-anchor="middle">UNSTITCHED</text>
      <text x="200" y="249" font-family="Inter, sans-serif" font-size="8" font-weight="700" fill="#ffffff" text-anchor="middle">METERS</text>
    `;
  } else if (productType === 'DHOTI_TOWEL') {
    // Traditional Folded Dhoti / Towel with Zari Border
    illustration = `
      <!-- Pristine White Dhoti Fold -->
      <rect x="90" y="130" width="220" height="250" rx="8" fill="${colorHex}" stroke="#333333" stroke-width="2"/>
      <!-- Gold Zari Border Band -->
      <rect x="90" y="325" width="220" height="35" fill="#D4AF37"/>
      <g stroke="#ffffff" stroke-width="1.5">
        <line x1="90" y1="332" x2="310" y2="332"/>
        <line x1="90" y1="352" x2="310" y2="352"/>
      </g>
      <!-- Pure Cotton Seal -->
      <circle cx="200" cy="220" r="30" fill="#ffffff" stroke="#e0e0e0" stroke-width="1.5"/>
      <text x="200" y="224" font-family="Inter, sans-serif" font-size="9" font-weight="800" fill="#047857" text-anchor="middle">100% COTTON</text>
    `;
  } else if (productType === 'INNER_ESSENTIAL') {
    // Ribbed Sleeveless Cotton Vest / Banian
    illustration = `
      <!-- Ribbed Vest Silhouette -->
      <path d="M140 120 C170 145, 230 145, 260 120 L275 180 C245 190, 240 220, 245 400 L155 400 C160 220, 155 190, 125 180 Z" 
            fill="${colorHex}" stroke="#222222" stroke-width="2"/>
      <!-- Rib Knit Texture -->
      <g stroke="#d5d5d5" stroke-width="1" opacity="0.6">
        <line x1="170" y1="160" x2="170" y2="390"/>
        <line x1="185" y1="160" x2="185" y2="390"/>
        <line x1="200" y1="160" x2="200" y2="390"/>
        <line x1="215" y1="160" x2="215" y2="390"/>
        <line x1="230" y1="160" x2="230" y2="390"/>
      </g>
    `;
  } else {
    // Women's Top / Dress / Blouse piece
    illustration = `
      <!-- Garment Silhouette -->
      <path d="M140 110 Q200 135 260 110 L310 160 L280 205 L250 185 L250 405 L150 405 L150 185 L120 205 L90 160 Z" 
            fill="${colorHex}" stroke="#111111" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M175 118 L200 145 L225 118" fill="none" stroke="#ffffff" stroke-width="2"/>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 480" width="100%" height="100%">
    <rect width="400" height="480" fill="${bgHex}"/>
    <!-- Village Textile Loom Grid -->
    <g opacity="0.06" stroke="#111111" stroke-width="1.5">
      <line x1="20" y1="20" x2="380" y2="460"/>
      <line x1="380" y1="20" x2="20" y2="460"/>
      <circle cx="200" cy="240" r="140" fill="none"/>
    </g>
    ${illustration}
    <!-- Enterprise Brand & Provenance Seal -->
    <rect x="25" y="25" width="140" height="26" rx="13" fill="#111111"/>
    <text x="95" y="42" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="1">${brandText}</text>
    <!-- Card Info Bar -->
    <rect x="20" y="426" width="360" height="36" rx="8" fill="#ffffff" stroke="#e0e0e0"/>
    <text x="35" y="449" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#111111">${title.length > 36 ? title.substring(0, 36) + '...' : title}</text>
    <text x="365" y="449" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#047857" text-anchor="end">${badgeText}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Global In-Memory & PostgreSQL Persistent Store
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
    exemptionNotice: "Small rural artisan & retail occupation enterprise exempted from GST under Section 23 of CGST Act / Telangana SGST Act.",
    historySince: "Serving our village & patrons for 20 years with ancestral dedication.",
    story: "KB FASHIONS has been rooted in Kalwaral village for over two decades. Originating as part of our ancestral occupation in fine textiles, we now bring honest quality, durable fabrics, and traditional warmth directly online to customers across India.",
    freeShippingThreshold: 999,
    flatShippingFee: 70,
    updatedAt: new Date().toISOString(),
  };

  public users: UserModel[] = [];
  public addresses: AddressModel[] = [];
  public paymentMethods: PaymentMethodModel[] = [];
  public products: ProductModel[] = [];
  public productImages: ProductImageModel[] = [];
  public banners: BannerModel[] = [];
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

    // 1. Initial Users
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
        avatar: "/api/media/avatar-usr-admin-1",
        villageOrCity: "Kalwaral",
        mandalOrArea: "Sadasivanagar",
        district: "Kamareddy",
        state: "Telangana",
        pinCode: "503145",
        preferredLanguage: "en",
        smsUpdates: true,
        whatsappUpdates: true,
        bio: "Managing KB FASHIONS ancestral village handlooms & fine textiles since 2006.",
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
        avatar: "/api/media/avatar-usr-cust-1",
        villageOrCity: "Kalwaral",
        mandalOrArea: "Sadasivanagar",
        district: "Kamareddy",
        state: "Telangana",
        pinCode: "503145",
        preferredLanguage: "en",
        smsUpdates: true,
        whatsappUpdates: true,
        bio: "Patron of authentic Gadwal sarees and Raymond fine shirting cuts.",
        createdAt: now,
        updatedAt: now,
      }
    ];

    // Seed default avatar image assets in PostgreSQL memory
    this.productImages.push({
      id: "avatar-usr-admin-1",
      productId: "avatar-usr-admin-1",
      name: "Admin Profile Avatar",
      mimeType: "image/svg+xml",
      data: `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" fill="#0B0F19" stroke="#D6AC55" stroke-width="3"/>
          <text x="50" y="58" font-family="Inter, sans-serif" font-size="28" font-weight="900" fill="#D6AC55" text-anchor="middle">KB</text>
        </svg>
      `)}`,
      isPrimary: false,
      createdAt: now,
    });

    this.productImages.push({
      id: "avatar-usr-cust-1",
      productId: "avatar-usr-cust-1",
      name: "Customer Profile Avatar",
      mimeType: "image/svg+xml",
      data: `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" fill="#3478F6" stroke="#FFFFFF" stroke-width="3"/>
          <text x="50" y="58" font-family="Inter, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF" text-anchor="middle">RS</text>
        </svg>
      `)}`,
      isPrimary: false,
      createdAt: now,
    });

    // Seed Customer Addresses
    this.addresses = [
      {
        id: "addr-1",
        userId: "usr-cust-1",
        name: "Rahul Sharma",
        phone: "+919876543210",
        tag: "Home",
        streetAddress: "H.No 2-44, Near Pochamma Temple",
        villageOrCity: "Kalwaral",
        mandalOrArea: "Sadasivanagar",
        district: "Kamareddy",
        state: "Telangana",
        pinCode: "503145",
        isDefault: true,
        createdAt: now,
      },
      {
        id: "addr-2",
        userId: "usr-cust-1",
        name: "Rahul Sharma (Shop)",
        phone: "+919876543210",
        tag: "Work",
        streetAddress: "Main Bazaar Road, Opposite Panchayat Office",
        villageOrCity: "Sadasivanagar",
        mandalOrArea: "Sadasivanagar",
        district: "Kamareddy",
        state: "Telangana",
        pinCode: "503145",
        isDefault: false,
        createdAt: now,
      }
    ];

    // Seed Customer Payment Methods
    this.paymentMethods = [
      {
        id: "pm-1",
        userId: "usr-cust-1",
        type: "UPI",
        label: "Google Pay UPI",
        identifier: "rahul.sharma@okaxis",
        isDefault: true,
        createdAt: now,
      },
      {
        id: "pm-2",
        userId: "usr-cust-1",
        type: "CARD",
        label: "State Bank of India Debit Card",
        identifier: "•••• •••• •••• 4128",
        isDefault: false,
        createdAt: now,
      }
    ];

    // 2. Comprehensive Catalog Representing Village Store Real Inventory
    const rawCatalog = [
      // A) SAREES (Gadwal, Pattu, Designer, Nirma)
      {
        id: "prod-gadwal-1",
        productId: "prod-gadwal-1",
        name: "Authentic Handloom Gadwal Cotton-Silk Saree",
        title: "Traditional Telangana Gadwal Saree (For Elders & Special Occasions)",
        description: "Revered traditional Gadwal saree crafted by generational artisans. Features a featherlight 80-count unbleached cotton body with an attached pure silk contrasting kuttu border and temple zari pallu. Non-slippery, non-creasing, and deeply cherished by village elders.",
        price: 2450,
        compareAtPrice: 3200,
        category: "Sarees",
        productType: "SAREE" as ProductType,
        brand: "Gadwal Handloom Heritage",
        fabric: "80-Count Pure Cotton Body with Pure Silk Contrast Border",
        isUnstitched: false,
        unitType: "PIECE" as const,
        tags: ["Gadwal", "Elderly Special", "Handloom", "Temple Border", "Pooja Weave"],
        sizes: ["Standard 6.3m"],
        colors: ["Earthy Mustard & Maroon", "Peacock Green & Purple", "Traditional Off-White & Red"],
        stockQuantity: 28,
        rating: 4.95,
        reviews: 94,
        fabricCare: "Gentle hand wash in cold water or dry clean. Do not wring.",
        origin: "Gadwal / Kalwaral Store, Telangana",
        isFeatured: true,
        colorHex: "#e9c46a",
        bgHex: "#f4a261",
        badge: "Gadwal Handloom",
        sareeDetails: {
          lengthMeters: 6.3,
          hasBlousePiece: true,
          blouseLengthMeters: 0.8,
          workType: "Authentic Gadwal Kuttu Weave",
          borderType: "Pure Silk Temple Zari Border",
          palluDetails: "Rich Traditional Floral Temple Zari Pallu",
        },
        matchingDetails: {
          matchingBlouseColor: "Contrast Deep Maroon Silk Bit",
          matchingFallPicoAvailable: true,
          customDesignerNotes: "Matching cotton fall and stitched pico border included on request.",
        }
      },
      {
        id: "prod-pattu-1",
        productId: "prod-pattu-1",
        name: "Royal Dharmavaram Pure Silk Wedding Pattu Saree",
        title: "100% Pure Mulberry Silk Bridal & Festive Saree",
        description: "Heavy woven pure pattu silk saree featuring intricate silver and gold zari jaal across the body. Accompanied by a 0.8-meter unstitched contrast silk blouse bit. A timeless ancestral investment for Telangana weddings and housewarming celebrations.",
        price: 4890,
        compareAtPrice: 6500,
        category: "Sarees",
        productType: "SAREE" as ProductType,
        brand: "KB Royal Pattu",
        fabric: "100% Pure Mulberry Handloom Silk",
        isUnstitched: false,
        unitType: "PIECE" as const,
        tags: ["Pattu Silk", "Wedding Special", "Pure Zari", "Bridal Wear", "Bestseller"],
        sizes: ["Standard 6.3m"],
        colors: ["Crimson Red & Gold", "Emerald Green & Gold", "Royal Navy & Silver"],
        stockQuantity: 18,
        rating: 4.98,
        reviews: 112,
        fabricCare: "Dry clean only. Store wrapped in pure cotton or muslin cloth.",
        origin: "Telangana Traditional Weavers",
        isFeatured: true,
        colorHex: "#9b2226",
        bgHex: "#ae2012",
        badge: "Pure Pattu Silk",
        sareeDetails: {
          lengthMeters: 6.3,
          hasBlousePiece: true,
          blouseLengthMeters: 0.8,
          workType: "Traditional Handloom Jacquard Zari",
          borderType: "Broad 4-Inch Zari Kaddi Border",
          palluDetails: "Heavy Brocade Zari Wedding Pallu",
        }
      },
      {
        id: "prod-designer-1",
        productId: "prod-designer-1",
        name: "Heavy Maggam Cutwork Layered Designer Saree",
        title: "Party Wear Georgette Saree with Hand Embroidered Scallop Border",
        description: "Contemporary designer party wear saree with layered stone, sequin, and thread cutwork along the scalloped border. Comes with a matching heavily embroidered designer blouse piece for modern festive events.",
        price: 1850,
        compareAtPrice: 2600,
        category: "Sarees",
        productType: "SAREE" as ProductType,
        brand: "KB Designer Studio",
        fabric: "Soft Flowing Micro-Georgette with Maggam Embroidery",
        isUnstitched: false,
        unitType: "PIECE" as const,
        tags: ["Designer Saree", "Maggam Work", "Cutwork Layered", "Party Wear"],
        sizes: ["Standard 6.3m"],
        colors: ["Dusty Rose", "Ice Blue", "Lavender Mist"],
        stockQuantity: 24,
        rating: 4.85,
        reviews: 58,
        fabricCare: "Dry clean recommended due to detailed hand embroidery.",
        origin: "Kalwaral Artisan Unit, Telangana",
        isFeatured: true,
        colorHex: "#b5838d",
        bgHex: "#6d6875",
        badge: "Maggam Designer",
        sareeDetails: {
          lengthMeters: 6.3,
          hasBlousePiece: true,
          blouseLengthMeters: 0.85,
          workType: "Hand Maggam Cutwork & Stone Setting",
          borderType: "Scalloped Cutwork Floral Border",
          palluDetails: "Embroidered Tassel Edge Pallu",
        }
      },
      {
        id: "prod-nirma-1",
        productId: "prod-nirma-1",
        name: "Nirma Wash-and-Wear Soft Daily Crepe Saree",
        title: "Featherlight Printed Daily Saree (Zero Ironing Required)",
        description: "The trusted village everyday saree! Soft, featherlight, machine-washable Nirma crepe printed saree with fast colors. Dries in minutes, needs zero ironing, and provides 100% all-day comfort during active household routines.",
        price: 450,
        compareAtPrice: 650,
        category: "Sarees",
        productType: "SAREE" as ProductType,
        brand: "Nirma Tex",
        fabric: "Premium Synthetic Micro-Crepe",
        isUnstitched: false,
        unitType: "PIECE" as const,
        tags: ["Nirma", "Daily Wear", "Wash & Wear", "Low Maintenance", "Pocket Friendly"],
        sizes: ["Regular 5.5m"],
        colors: ["Floral Yellow", "Geometric Maroon", "Leaf Green Print"],
        stockQuantity: 75,
        rating: 4.88,
        reviews: 140,
        fabricCare: "Normal bucket machine wash. Color fastness guaranteed.",
        origin: "Kalwaral Store, Telangana",
        isFeatured: false,
        colorHex: "#e76f51",
        bgHex: "#f4a261",
        badge: "Nirma Daily",
        sareeDetails: {
          lengthMeters: 5.5,
          hasBlousePiece: false,
          workType: "Digital Reactive Floral Print",
          borderType: "Satin Piped Border",
          palluDetails: "Printed Striped Pallu",
        }
      },

      // B) WOMEN'S WEAR (Tops, Leggings, Dresses, Blouse Pieces)
      {
        id: "prod-women-top-1",
        productId: "prod-women-top-1",
        name: "Pure Cotton Daily Breathable Tunic Top",
        title: "Women's Everyday Regular Fit Cotton Kurti / Top",
        description: "Stitched with breathable 100% combed cotton, tailored for warm Telangana weather. Twin-needle reinforced seams and comfortable 3/4 sleeves.",
        price: 399,
        compareAtPrice: 599,
        category: "Women's Wear",
        productType: "WOMEN_WEAR" as ProductType,
        brand: "KB Daily Casuals",
        fabric: "100% Breathable Mill Cotton",
        isUnstitched: false,
        unitType: "PIECE" as const,
        tags: ["Cotton Top", "Kurti", "Daily Wear", "Breathable"],
        sizes: ["M", "L", "XL", "XXL"],
        colors: ["Indigo Motif", "Madder Red", "Mustard Ochre"],
        stockQuantity: 50,
        rating: 4.8,
        reviews: 45,
        fabricCare: "Machine wash cold with like colors.",
        origin: "Telangana Mill Weave",
        isFeatured: false,
        colorHex: "#457b9d",
        bgHex: "#1d3557",
        badge: "Pure Cotton"
      },
      {
        id: "prod-women-legging-1",
        productId: "prod-women-legging-1",
        name: "4-Way Cotton-Lycra Bio-Wash Leggings",
        title: "Stretchable Ankle & Churidar Length Leggings (Anti-Pilling)",
        description: "Crafted from 95% combed cotton and 5% DuPont Lycra (210 GSM). High-rise broad waistband that never rolls down. Bio-washed for ultra-soft hand feel.",
        price: 299,
        compareAtPrice: 450,
        category: "Women's Wear",
        productType: "WOMEN_WEAR" as ProductType,
        brand: "KB Flexi-Comfort",
        fabric: "95% Combed Cotton, 5% Spandex (210 GSM)",
        isUnstitched: false,
        unitType: "PIECE" as const,
        tags: ["Leggings", "4-Way Stretch", "Bio-Wash", "Churidar"],
        sizes: ["L (Waist 28-32)", "XL (Waist 32-36)", "XXL (Waist 36-40)"],
        colors: ["Jet Black", "Crisp White", "Deep Maroon", "Navy Blue"],
        stockQuantity: 65,
        rating: 4.9,
        reviews: 78,
        fabricCare: "Gentle machine wash. Do not bleach.",
        origin: "Kalwaral Store, Telangana",
        isFeatured: false,
        colorHex: "#1d3557",
        bgHex: "#000814",
        badge: "4-Way Stretch"
      },
      {
        id: "prod-women-dress-1",
        productId: "prod-women-dress-1",
        name: "3-Piece Traditional Salwar Suit Dress Material",
        title: "Unstitched Cotton Top + Bottom + Zari Border Dupatta Set",
        description: "Complete 3-piece unstitched dress material: 2.5m Chanderi cotton top with neck embroidery, 2.0m pure cotton bottom, and a 2.25m designer woven zari dupatta.",
        price: 1199,
        compareAtPrice: 1699,
        category: "Women's Wear",
        productType: "WOMEN_WEAR" as ProductType,
        brand: "Telangana Heritage Weaves",
        fabric: "Chanderi Cotton Top + Pure Cotton Bottom + Zari Dupatta",
        isUnstitched: true,
        unitType: "PIECE" as const,
        tags: ["Dress Material", "Salwar Suit", "Unstitched 3-Piece", "Festive"],
        sizes: ["Free Size (Unstitched 3-Piece)"],
        colors: ["Teal & Coral", "Rust & Gold", "Mustard & Maroon"],
        stockQuantity: 32,
        rating: 4.88,
        reviews: 36,
        fabricCare: "First wash dry clean recommended, subsequent hand wash.",
        origin: "Telangana Handloom Weavers",
        isFeatured: true,
        colorHex: "#2a9d8f",
        bgHex: "#264653",
        badge: "3-Piece Set"
      },
      {
        id: "prod-blouse-1",
        productId: "prod-blouse-1",
        name: "Heavy Maggam Work & 2x2 Rubia Blouse Pieces (Pack of 3)",
        title: "Unstitched 1-Meter Blouse Bits with Fast Colors",
        description: "Essential unstitched 1-meter blouse pieces. Includes 1 designer Maggam hand-embroidered back & sleeve piece and 2 authentic 2x2 Rubia cotton pieces. Perfect matching for silk & daily sarees.",
        price: 350,
        compareAtPrice: 550,
        category: "Blouse Pieces & Matching",
        productType: "BLOUSE_PIECE" as ProductType,
        brand: "KB Matching Center",
        fabric: "2x2 Rubia High-Count Cotton & Raw Silk Maggam Bit",
        isUnstitched: true,
        unitType: "PIECE" as const,
        tags: ["Blouse Pieces", "Maggam Bit", "Rubia 2x2", "Pack of 3"],
        sizes: ["1.0 Meter Cut Each"],
        colors: ["Traditional Tri-Color (Red, Gold, Green)", "Pastel Tri-Color", "Vibrant Contrast"],
        stockQuantity: 80,
        rating: 4.92,
        reviews: 86,
        fabricCare: "Colorfast. Cold soak wash before tailor stitching.",
        origin: "Kalwaral Store, Telangana",
        isFeatured: false,
        colorHex: "#bc6c25",
        bgHex: "#dda15e",
        badge: "Pack of 3 Bits"
      },
      {
        id: "prod-matching-1",
        productId: "prod-matching-1",
        name: "Special Designer Color-Matching Family Set",
        title: "Coordinated Mother & Daughter / Family Puja Matching Cloth Set",
        description: "Special curated matching collection designed in our Kalwaral store. Perfectly color-synchronized handloom saree with matching child pavada material and father's matching unstitched kanduva border.",
        price: 1599,
        compareAtPrice: 2199,
        category: "Blouse Pieces & Matching",
        productType: "BLOUSE_PIECE" as ProductType,
        brand: "KB Kalwaral Exclusive",
        fabric: "Handloom Cotton with Synchronized Gold Borders",
        isUnstitched: true,
        unitType: "PIECE" as const,
        tags: ["Matching Clothes", "Family Set", "Puja Special", "Color Coordinated"],
        sizes: ["Standard Combo Set"],
        colors: ["Haldi Yellow & Red", "Peacock Blue & Gold", "Temple Crimson & Zari"],
        stockQuantity: 20,
        rating: 4.95,
        reviews: 28,
        fabricCare: "Handloom care. Dry in shade.",
        origin: "Kalwaral, Telangana, India",
        isFeatured: true,
        colorHex: "#e9d8a6",
        bgHex: "#ee9b00",
        badge: "Special Design"
      },

      // C) MEN'S UNSTITCHED FABRICS (Raymond, Arvind, Siyaram's, Sold in Meters)
      {
        id: "prod-men-raymond-shirt",
        productId: "prod-men-raymond-shirt",
        name: "Raymond Premium Unstitched Shirting Fabric",
        title: "100% Cotton Fine Weave Shirting (Sold by Meter or Shirt Piece)",
        description: "Original Raymond mill-finished unstitched shirting material. Breathable, luxury luster, and crisp drape for executive and wedding tailoring. Sold by standard shirt length (1.6m) or custom meters chosen by customer.",
        price: 608, // 1.6m @ 380/m
        compareAtPrice: 850,
        category: "Men's Unstitched Fabrics",
        productType: "MEN_UNSTITCHED" as ProductType,
        brand: "Raymond",
        fabric: "100% Giza Egyptian Long-Staple Cotton",
        isUnstitched: true,
        unitType: "METER" as const,
        pricePerMeter: 380,
        availableMeters: [1.6, 2.0, 2.25, 2.5, 3.0],
        tags: ["Raymond", "Unstitched Shirting", "By Meter", "Pure Cotton", "Executive"],
        sizes: ["1.6 Mtr (Shirt)", "2.0 Mtr (Tall Shirt)", "2.25 Mtr (Kurta)", "3.0 Mtr (Extra Cut)"],
        colors: ["Classic Sky Blue", "Crisp White", "Soft Pink Checks", "Lavender Twill"],
        stockQuantity: 120,
        rating: 4.96,
        reviews: 135,
        fabricCare: "Machine wash warm, iron at cotton setting for razor-sharp finish.",
        origin: "Raymond Mills / Kalwaral Authorized Stockist",
        isFeatured: true,
        colorHex: "#0077b6",
        bgHex: "#023e8a",
        badge: "Raymond Original",
        unstitchedDetails: {
          fabricCutType: "Shirting Fabric (Custom Meters)",
          widthInches: 58,
          standardLengthMeters: 1.6,
          recommendedUse: "Tailored Formal & Festive Shirts, Kurtas",
        }
      },
      {
        id: "prod-men-raymond-pant",
        productId: "prod-men-raymond-pant",
        name: "Raymond Luxury Unstitched Poly-Wool Trouser Fabric",
        title: "Wrinkle-Free Formal & Safari Pant Piece (1.2m Standard Cut)",
        description: "Original Raymond suiting fabric for men's formal trousers. Superior crease resistance, smooth drape, and long-lasting fabric strength tested over years of tailors' trust.",
        price: 660, // 1.2m @ 550/m
        compareAtPrice: 950,
        category: "Men's Unstitched Fabrics",
        productType: "MEN_UNSTITCHED" as ProductType,
        brand: "Raymond",
        fabric: "Poly-Viscose Wool Touch Suiting (Super 120s)",
        isUnstitched: true,
        unitType: "METER" as const,
        pricePerMeter: 550,
        availableMeters: [1.2, 1.3, 1.5, 2.5, 3.0],
        tags: ["Raymond", "Trouser Piece", "Unstitched Suiting", "By Meter", "Formal Pant"],
        sizes: ["1.2 Mtr (Standard Trouser)", "1.3 Mtr (Tall)", "1.5 Mtr (Comfort Pleats)", "3.0 Mtr (Safari Suit)"],
        colors: ["Charcoal Grey", "Midnight Black", "Rich Navy", "Earth Khaki"],
        stockQuantity: 90,
        rating: 4.94,
        reviews: 98,
        fabricCare: "Machine wash cold or dry clean for maximum longevity.",
        origin: "Raymond Mills / Kalwaral Authorized Stockist",
        isFeatured: true,
        colorHex: "#2b2d42",
        bgHex: "#1a1a24",
        badge: "Raymond Suiting",
        unstitchedDetails: {
          fabricCutType: "Trouser / Suiting Fabric (Custom Meters)",
          widthInches: 58,
          standardLengthMeters: 1.2,
          recommendedUse: "Bespoke Formal Trousers, Safari Suits, Bandhgala",
        }
      },
      {
        id: "prod-men-arvind-linen",
        productId: "prod-men-arvind-linen",
        name: "Arvind & Siyaram's Unstitched Pure Linen Fabric",
        title: "60-Lea Breathable Linen-Cotton Shirting & Kurta Material",
        description: "Pure natural unstitched linen blend from Arvind & Siyaram's. Renowned for natural temperature regulation, slub texture, and distinguished rustic elegance.",
        price: 672, // 1.6m @ 420/m
        compareAtPrice: 980,
        category: "Men's Unstitched Fabrics",
        productType: "MEN_UNSTITCHED" as ProductType,
        brand: "Arvind / Siyaram's",
        fabric: "60-Lea Pure Linen-Cotton Blend",
        isUnstitched: true,
        unitType: "METER" as const,
        pricePerMeter: 420,
        availableMeters: [1.6, 2.0, 2.25, 2.5],
        tags: ["Arvind", "Siyaram", "Linen", "Unstitched", "Kurta Fabric"],
        sizes: ["1.6 Mtr (Shirt)", "2.25 Mtr (Kurta)", "2.5 Mtr (Long Kurta)"],
        colors: ["Natural Flax", "Mint Sage", "Pastel Peach", "Optic White"],
        stockQuantity: 70,
        rating: 4.9,
        reviews: 64,
        fabricCare: "Gentle wash. Iron damp for characteristic linen crispness.",
        origin: "Authorized Mill Stockist, Kalwaral",
        isFeatured: false,
        colorHex: "#606c38",
        bgHex: "#283618",
        badge: "Pure Linen",
        unstitchedDetails: {
          fabricCutType: "Linen Shirting & Kurta Fabric",
          widthInches: 58,
          standardLengthMeters: 1.6,
          recommendedUse: "Traditional Kurtas, Casual Linen Shirts",
        }
      },
      {
        id: "prod-men-combo-box",
        productId: "prod-men-combo-box",
        name: "Raymond Suiting & Shirting Unstitched Gift Pack Combo",
        title: "Pre-Packaged Presentation Box (1.6m Shirting + 1.2m Trouser Piece)",
        description: "The classic Indian wedding & festival gifting box! Contains 1.6m premium Raymond unstitched cotton shirting and 1.2m matching Raymond poly-viscose trouser piece in an elegant gift box.",
        price: 1199,
        compareAtPrice: 1699,
        category: "Men's Unstitched Fabrics",
        productType: "MEN_UNSTITCHED" as ProductType,
        brand: "Raymond",
        fabric: "Raymond Cotton Shirting (1.6m) + Poly-Viscose Trouser (1.2m)",
        isUnstitched: true,
        unitType: "PIECE" as const,
        tags: ["Raymond Combo", "Gift Pack", "Pant & Shirt", "Wedding Gift", "Bestseller"],
        sizes: ["Combo Pack (1.6m + 1.2m)"],
        colors: ["White Shirt + Navy Pant", "Blue Shirt + Charcoal Pant", "Cream Shirt + Dark Brown Pant"],
        stockQuantity: 45,
        rating: 4.97,
        reviews: 156,
        fabricCare: "Standard garment care instructions on inner mill tag.",
        origin: "Raymond Authorized Distribution",
        isFeatured: true,
        colorHex: "#14213d",
        bgHex: "#000000",
        badge: "Gift Box Combo",
        unstitchedDetails: {
          fabricCutType: "Boxed Combo Pair (1.6m + 1.2m)",
          widthInches: 58,
          standardLengthMeters: 2.8,
          recommendedUse: "Wedding Gifting, Shagun, Complete Tailored Suit",
        }
      },

      // D) DHOTIS & TOWELS
      {
        id: "prod-dhoti-1",
        productId: "prod-dhoti-1",
        name: "Traditional Double Pancha Dhoti with Gold Zari & Kanduva",
        title: "Men's Authentic 8-Mul Pure Cotton Dhoti Set (Double 4.0m + 2.0m)",
        description: "Ancestral South Indian men's traditional dhoti (Pancha). Made with high-twist 8-mul bleached pure cotton with a 1.5-inch woven golden zari border. Includes matching unstitched shoulder angavastram/kanduva.",
        price: 849,
        compareAtPrice: 1199,
        category: "Dhotis & Towels",
        productType: "DHOTI_TOWEL" as ProductType,
        brand: "KB Heritage Weavers",
        fabric: "100% Super-Fine 8-Mul Combed Cotton",
        isUnstitched: true,
        unitType: "PIECE" as const,
        tags: ["Dhoti", "Pancha", "Gold Zari", "Temple Wear", "Puja Wear"],
        sizes: ["Double Pancha (4.0m) + Kanduva (2.0m)", "Single Pancha (3.65m)"],
        colors: ["Pure Bleached White & Gold Zari", "Natural Off-White & Gold Zari"],
        stockQuantity: 60,
        rating: 4.95,
        reviews: 82,
        fabricCare: "Hand wash gently in cold water. Iron zari border with light heat.",
        origin: "Kalwaral Handloom Store, Telangana",
        isFeatured: true,
        colorHex: "#f8f9fa",
        bgHex: "#e9ecef",
        badge: "8-Mul Gold Zari"
      },
      {
        id: "prod-towel-1",
        productId: "prod-towel-1",
        name: "Village Absorbent Cotton Bath Towels (Gamcha / Thundu - Pack of 2)",
        title: "Heavyweight 100% Cotton Waffle Bath Towel Set (30x60 Inches)",
        description: "Heavy absorption village cotton bath towels. Natural honeycomb waffle weave dries 3x faster than synthetic microfiber towels and gets softer with every wash.",
        price: 399,
        compareAtPrice: 550,
        category: "Dhotis & Towels",
        productType: "DHOTI_TOWEL" as ProductType,
        brand: "KB Kalwaral Weaves",
        fabric: "100% Pure Unbleached Waffle Cotton (450 GSM)",
        isUnstitched: false,
        unitType: "PIECE" as const,
        tags: ["Towel", "Thundu", "Gamcha", "Pure Cotton", "Pack of 2"],
        sizes: ["Large (30x60 Inches) - Pack of 2"],
        colors: ["Rustic Honeycomb Off-White", "Classic Striped Border"],
        stockQuantity: 85,
        rating: 4.88,
        reviews: 95,
        fabricCare: "Machine wash normal. Becomes softer after first wash.",
        origin: "Kalwaral Store, Telangana",
        isFeatured: false,
        colorHex: "#adb5bd",
        bgHex: "#6c757d",
        badge: "Pack of 2"
      },

      // E) INNERS & ESSENTIALS (Banians, Kerchiefs, Undergarments)
      {
        id: "prod-banian-1",
        productId: "prod-banian-1",
        name: "100% Super Combed Ribbed Cotton Banians / Vests (Pack of 3)",
        title: "Men's Sleeveless Rib Knit Cotton Inner Vests (Sweat Absorbent)",
        description: "Trusted village essentials! 100% combed ribbed cotton banians providing superior sweat absorption, soft armholes, and seamless side fit under shirts. Standard chest sizing in centimeters.",
        price: 340,
        compareAtPrice: 420,
        category: "Inners & Essentials",
        productType: "INNER_ESSENTIAL" as ProductType,
        brand: "Rupa / Lux Premium",
        fabric: "100% Mercerized Combed Cotton 1x1 Rib Knit",
        isUnstitched: false,
        unitType: "PIECE" as const,
        tags: ["Banian", "Vest", "Inners", "Pure Cotton", "Pack of 3"],
        sizes: ["80cm (S)", "85cm (M)", "90cm (L)", "95cm (XL)", "100cm (XXL)"],
        colors: ["Classic Bleached White"],
        stockQuantity: 150,
        rating: 4.92,
        reviews: 180,
        fabricCare: "Boil-wash safe, hot water machine wash.",
        origin: "Authorized Stockist, Kalwaral",
        isFeatured: false,
        colorHex: "#f8f9fa",
        bgHex: "#dee2e6",
        badge: "Pack of 3 Vests",
        essentialDetails: {
          packSize: 3,
          measurementUnit: "cm (Chest)",
          measurementValues: ["80cm", "85cm", "90cm", "95cm", "100cm"],
        }
      },
      {
        id: "prod-kerchief-1",
        productId: "prod-kerchief-1",
        name: "Pure Cotton White & Checked Kerchiefs / Rumals (Pack of 6)",
        title: "Men's & Family High-Density Poplin Handkerchiefs (45x45 cm)",
        description: "High-density 100% poplin cotton handkerchiefs with satin corded borders. Ultra-absorbent, skin-friendly, and durable through endless laundry cycles.",
        price: 180,
        compareAtPrice: 240,
        category: "Inners & Essentials",
        productType: "INNER_ESSENTIAL" as ProductType,
        brand: "KB Essentials",
        fabric: "100% High-Density Poplin Cotton",
        isUnstitched: false,
        unitType: "PIECE" as const,
        tags: ["Kerchiefs", "Rumals", "Handkerchiefs", "Pack of 6"],
        sizes: ["Standard 45x45 cm - Pack of 6"],
        colors: ["Pure White with Satin Cord", "Assorted Woven Checks"],
        stockQuantity: 110,
        rating: 4.9,
        reviews: 72,
        fabricCare: "Easy bucket or machine wash.",
        origin: "Kalwaral Store, Telangana",
        isFeatured: false,
        colorHex: "#ced4da",
        bgHex: "#adb5bd",
        badge: "Pack of 6"
      }
    ];

    // Seed into Database collections & generate custom SVGs stored in DB
    rawCatalog.forEach((p, idx) => {
      const imgId = `img-cat-${idx + 1}`;
      const svgData = generateApparelSvg(p.name, p.productType, p.colorHex, p.bgHex, p.badge, p.brand);

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
        productType: p.productType,
        brand: p.brand,
        fabric: p.fabric,
        isUnstitched: p.isUnstitched,
        unitType: p.unitType,
        pricePerMeter: p.pricePerMeter,
        availableMeters: p.availableMeters,
        tags: p.tags,
        sizes: p.sizes,
        colors: p.colors,
        stockQuantity: p.stockQuantity,
        rating: p.rating,
        reviews: p.reviews,
        fabricCare: p.fabricCare,
        origin: p.origin,
        isFeatured: p.isFeatured,
        sareeDetails: p.sareeDetails,
        unstitchedDetails: p.unstitchedDetails,
        essentialDetails: p.essentialDetails,
        matchingDetails: p.matchingDetails,
        createdAt: now,
        updatedAt: now,
        images: [imageModel],
      });
    });

    // 3. Seed Initial Realistic Orders showcasing real items
    this.orders = [
      {
        id: "ord-1",
        orderId: "ORD-2026-1001",
        invoiceNumber: "KB/2026-27/0042",
        userId: "usr-cust-1",
        customerName: "Rahul Sharma",
        customerPhone: "+91 9876543210",
        customerEmail: "customer@example.com",
        streetAddress: "House 4-12, Gandhi Road",
        villageOrCity: "Nizamabad",
        mandalOrArea: "Town Center",
        district: "Nizamabad",
        state: "Telangana",
        pinCode: "503001",
        subtotal: 3058, // Gadwal Saree (2450) + Raymond Shirting 1.6m (608)
        discountAmount: 306, // KB10
        shippingFee: 0,
        totalPaid: 2752,
        paymentMethod: "UPI",
        paymentStatus: "CAPTURED",
        orderStatus: "DISPATCHED",
        courierPartner: "India Post Speed Post",
        trackingNumber: "EK582910482IN",
        estimatedDeliveryDays: 2,
        createdAt: "2026-10-15T10:30:00.000Z",
        updatedAt: "2026-10-16T08:15:00.000Z",
        items: [
          {
            id: "item-1",
            orderId: "ORD-2026-1001",
            productId: "prod-gadwal-1",
            title: "Authentic Handloom Gadwal Cotton-Silk Saree (Earthy Mustard)",
            qty: 1,
            unitPrice: 2450,
            totalAmount: 2450,
            size: "Standard 6.3m",
            configuration: { sareeType: "Gadwal Handloom", blouseIncluded: true },
            image: this.productImages[0]?.data,
          },
          {
            id: "item-2",
            orderId: "ORD-2026-1001",
            productId: "prod-men-raymond-shirt",
            title: "Raymond Premium Unstitched Shirting Fabric (1.6 Meters)",
            qty: 1,
            unitPrice: 608,
            totalAmount: 608,
            size: "1.6 Mtr Cut",
            cutLength: 1.6,
            configuration: { meters: 1.6, pricePerMeter: 380, brand: "Raymond" },
            image: this.productImages[9]?.data,
          }
        ],
        timeline: [
          {
            id: "tl-1",
            orderId: "ORD-2026-1001",
            stage: "ORDER_PLACED",
            title: "Order Placed & Payment Captured",
            description: "Patron placed order via UPI. Statutory Retail Cash Memo / Bill of Supply generated.",
            location: "Kalwaral Village Store, Kamareddy",
            timestamp: "2026-10-15T10:30:00.000Z",
          },
          {
            id: "tl-2",
            orderId: "ORD-2026-1001",
            stage: "CONFIRMED",
            title: "Handloom Inspection & Packaging",
            description: "Handloom Gadwal saree and Raymond unstitched fabric verified for weaving accuracy. Packed in eco-friendly cotton wrap.",
            location: "KB FASHIONS Kalwaral Store",
            timestamp: "2026-10-15T14:45:00.000Z",
          },
          {
            id: "tl-3",
            orderId: "ORD-2026-1001",
            stage: "DISPATCHED",
            title: "Consignment Dispatched with India Post",
            description: "Consignment handed over to India Post Speed Post facility under tracking EK582910482IN.",
            location: "Kamareddy Head Post Office, Telangana",
            courierPartner: "India Post Speed Post",
            trackingNumber: "EK582910482IN",
            timestamp: "2026-10-16T08:15:00.000Z",
          }
        ]
      }
    ];

    // 4. Initial Database Banners and Media Assets (Read from disk into PostgreSQL DB records)
    let traditionData = '';
    let shopmateData = '';

    if (typeof window === 'undefined') {
      try {
        const nodeFs = eval('require')('fs');
        const nodePath = eval('require')('path');
        const traditionBannerPath = nodePath.join(process.cwd(), 'externals', 'KB Fashions_ Tradition Meets Trend.png');
        const shopmateBannerPath = nodePath.join(process.cwd(), 'externals', 'kb-shopmate-ai-banner.png');

        if (nodeFs.existsSync(traditionBannerPath)) {
          const buf = nodeFs.readFileSync(traditionBannerPath);
          traditionData = `data:image/png;base64,${buf.toString('base64')}`;
        }

        if (nodeFs.existsSync(shopmateBannerPath)) {
          const buf = nodeFs.readFileSync(shopmateBannerPath);
          shopmateData = `data:image/png;base64,${buf.toString('base64')}`;
        }
      } catch (e) {
        // Fallback gracefully if running in a client bundle
      }
    }

    if (traditionData) {
      this.productImages.push({
        id: "banner-tradition-meets-trend",
        productId: "banner-tradition",
        name: "KB Fashions - Tradition Meets Trend Official Welcome Hero",
        mimeType: "image/png",
        data: traditionData,
        isPrimary: true,
        createdAt: now,
      });
    }

    if (shopmateData) {
      this.productImages.push({
        id: "banner-shopmate-ai",
        productId: "banner-shopmate-ai",
        name: "KB Shopmate AI Voice & Visual Assistant Official Banner",
        mimeType: "image/png",
        data: shopmateData,
        isPrimary: true,
        createdAt: now,
      });
    }

    this.banners = [
      {
        id: "bnr-1",
        bannerId: "banner-tradition",
        title: "Tradition Meets Trend",
        subtitle: "20 Years of Generational Handlooms, Gadwal Craft & Authentic Unstitched Fabrics from Kalwaral Village",
        badge: "✨ HERITAGE COLLECTION 2026",
        category: "HERO",
        mediaId: "banner-tradition-meets-trend",
        imageUrl: "/api/media/banner-tradition-meets-trend",
        linkUrl: "/search?category=All",
        ctaText: "Explore Collection",
        position: 1,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "bnr-2",
        bannerId: "banner-shopmate-ai",
        title: "KB Shopmate AI: The Future of Village Shopping",
        subtitle: "Personalized Telugu & English Voice AI Shopping for Sarees, Unstitched Fabrics, and Family Garments",
        badge: "✦ NEW AI FEATURE LAUNCH",
        category: "AI",
        mediaId: "banner-shopmate-ai",
        imageUrl: "/api/media/banner-shopmate-ai",
        linkUrl: "/ai",
        ctaText: "Experience Voice AI",
        position: 2,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      }
    ];

    // 5. Initial Audit Log
    this.addAuditLog(
      "SYSTEM",
      "SYSTEM",
      "STORE_CATALOG_INITIALIZED",
      "CATALOG",
      "KB-CATALOG",
      { totalProducts: this.products.length, village: "Kalwaral", status: "ONLINE_READY" }
    );
  }

  public getBanners(): BannerModel[] {
    return this.banners.filter(b => b.isActive).sort((a, b) => a.position - b.position);
  }

  public getBannerById(id: string): BannerModel | undefined {
    return this.banners.find(b => b.id === id || b.bannerId === id);
  }

  public getTopNewProducts(limit = 5): ProductModel[] {
    return [...this.products].slice(0, limit);
  }

  public getStoreSettings(): StoreSettingsModel {
    return this.storeSettings;
  }

  public updateStoreSettings(updates: Partial<StoreSettingsModel>): StoreSettingsModel {
    this.storeSettings = {
      ...this.storeSettings,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.storeSettings;
  }

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

  // ==========================================
  // CUSTOMER ACCOUNT MANAGEMENT REPOSITORY
  // ==========================================

  public getUserAddresses(userId: string): AddressModel[] {
    return this.addresses.filter(a => a.userId === userId);
  }

  public addAddress(userId: string, data: Omit<AddressModel, 'id' | 'userId' | 'createdAt'>): AddressModel {
    const now = new Date().toISOString();
    if (data.isDefault) {
      this.addresses.filter(a => a.userId === userId).forEach(a => a.isDefault = false);
    }
    const newAddress: AddressModel = {
      id: `addr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      ...data,
      isDefault: data.isDefault || this.addresses.filter(a => a.userId === userId).length === 0,
      createdAt: now,
    };
    this.addresses.push(newAddress);
    return newAddress;
  }

  public updateAddress(id: string, userId: string, data: Partial<AddressModel>): AddressModel | null {
    const addr = this.addresses.find(a => a.id === id && a.userId === userId);
    if (!addr) return null;
    if (data.isDefault) {
      this.addresses.filter(a => a.userId === userId).forEach(a => a.isDefault = false);
    }
    Object.assign(addr, data);
    return addr;
  }

  public deleteAddress(id: string, userId: string): boolean {
    const idx = this.addresses.findIndex(a => a.id === id && a.userId === userId);
    if (idx === -1) return false;
    this.addresses.splice(idx, 1);
    // If the deleted address was default, set the first remaining as default
    const userAddrs = this.addresses.filter(a => a.userId === userId);
    if (userAddrs.length > 0 && !userAddrs.some(a => a.isDefault)) {
      userAddrs[0].isDefault = true;
    }
    return true;
  }

  public getUserPaymentMethods(userId: string): PaymentMethodModel[] {
    return this.paymentMethods.filter(pm => pm.userId === userId);
  }

  public addPaymentMethod(userId: string, data: Omit<PaymentMethodModel, 'id' | 'userId' | 'createdAt'>): PaymentMethodModel {
    const now = new Date().toISOString();
    if (data.isDefault) {
      this.paymentMethods.filter(pm => pm.userId === userId).forEach(pm => pm.isDefault = false);
    }
    const newPm: PaymentMethodModel = {
      id: `pm-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      ...data,
      isDefault: data.isDefault || this.paymentMethods.filter(pm => pm.userId === userId).length === 0,
      createdAt: now,
    };
    this.paymentMethods.push(newPm);
    return newPm;
  }

  public deletePaymentMethod(id: string, userId: string): boolean {
    const idx = this.paymentMethods.findIndex(pm => pm.id === id && pm.userId === userId);
    if (idx === -1) return false;
    this.paymentMethods.splice(idx, 1);
    const userPms = this.paymentMethods.filter(pm => pm.userId === userId);
    if (userPms.length > 0 && !userPms.some(pm => pm.isDefault)) {
      userPms[0].isDefault = true;
    }
    return true;
  }

  public updateUserProfile(userId: string, updates: Partial<UserModel>): UserModel | null {
    const user = this.users.find(u => u.id === userId);
    if (!user) return null;
    const allowed = ['name', 'phone', 'villageOrCity', 'mandalOrArea', 'district', 'state', 'pinCode', 'preferredLanguage', 'smsUpdates', 'whatsappUpdates', 'bio'];
    for (const key of allowed) {
      if (key in updates) {
        (user as any)[key] = (updates as any)[key];
      }
    }
    user.updatedAt = new Date().toISOString();
    return user;
  }

  public updateUserAvatar(userId: string, avatarDataUrl: string): { user: UserModel; avatarUrl: string } | null {
    const user = this.users.find(u => u.id === userId);
    if (!user) return null;
    const mediaId = `avatar-${userId}`;
    const now = new Date().toISOString();

    const existingImg = this.productImages.find(img => img.id === mediaId);
    if (existingImg) {
      existingImg.data = avatarDataUrl;
      existingImg.createdAt = now;
    } else {
      this.productImages.push({
        id: mediaId,
        productId: mediaId,
        name: `${user.name} Avatar`,
        mimeType: avatarDataUrl.startsWith('data:image/svg') ? 'image/svg+xml' : 'image/png',
        data: avatarDataUrl,
        isPrimary: false,
        createdAt: now,
      });
    }

    user.avatar = `/api/media/${mediaId}?t=${Date.now()}`;
    user.updatedAt = now;
    return { user, avatarUrl: user.avatar };
  }

  public changeUserPassword(userId: string, oldPass: string, newPass: string): { success: boolean; error?: string } {
    const user = this.users.find(u => u.id === userId);
    if (!user) return { success: false, error: 'User not found' };
    const isValid = bcrypt.compareSync(oldPass, user.passwordHash);
    if (!isValid) {
      return { success: false, error: 'Current password is incorrect' };
    }
    user.passwordHash = bcrypt.hashSync(newPass, 10);
    user.updatedAt = new Date().toISOString();
    return { success: true };
  }

  public getOrderTracking(orderId: string): any {
    const order = this.orders.find(o => o.orderId === orderId || o.id === orderId || o.trackingNumber === orderId);
    if (!order) return null;

    // Structured stage steps
    const stages = [
      { key: 'ORDER_PLACED', label: 'Order Placed', desc: 'Received at Kalwaral Village Store' },
      { key: 'CONFIRMED', label: 'Order Confirmed', desc: 'Handloom weave & meter cut verified' },
      { key: 'DISPATCHED', label: 'Dispatched', desc: `Handed to ${order.courierPartner || 'Telangana Express Postal Logistics'}` },
      { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Delivery partner en route to destination' },
      { key: 'DELIVERED', label: 'Delivered', desc: 'Package delivered with verified OTP / Signature' }
    ];

    const currentIdx = stages.findIndex(s => s.key === order.orderStatus);

    return {
      orderId: order.orderId,
      invoiceNumber: order.invoiceNumber,
      orderStatus: order.orderStatus,
      courierPartner: order.courierPartner || 'Telangana Express Postal Logistics',
      trackingNumber: order.trackingNumber || `KB-EXP-${order.orderId.replace(/[^0-9]/g, '')}`,
      destination: `${order.streetAddress}, ${order.villageOrCity}, ${order.district}, ${order.pinCode}`,
      customerName: order.customerName,
      createdAt: order.createdAt,
      timeline: order.timeline,
      stages: stages.map((s, idx) => ({
        ...s,
        completed: currentIdx >= idx,
        isCurrent: currentIdx === idx,
      })),
    };
  }
}

// Global Singleton Database Instance
const globalForDb = globalThis as unknown as { dbInstance: DatabaseStore | undefined };
export const db = globalForDb.dbInstance ?? new DatabaseStore();
if (process.env.NODE_ENV !== 'production') globalForDb.dbInstance = db;