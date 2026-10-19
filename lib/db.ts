import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Safe dynamic server-side module resolution to prevent Webpack client bundling errors
function getFs(): any {
  if (typeof window !== 'undefined') return null;
  try {
    return eval('require')('fs');
  } catch (e) {
    return null;
  }
}

function getPath(): any {
  if (typeof window !== 'undefined') return null;
  try {
    return eval('require')('path');
  } catch (e) {
    return null;
  }
}

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

export interface StoreAlertModel {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'ANNOUNCEMENT' | 'OFFER' | 'URGENT' | 'WARNING';
  linkUrl?: string | null;
  linkText?: string | null;
  isActive: boolean;
  isPushed: boolean;
  displayLocation: 'TOP_BAR' | 'TOAST_ALERT' | 'BOTH';
  badge?: string | null;
  textColor?: 'BLUE' | 'BLACK' | 'GREEN' | 'RED';
  createdAt: string;
  updatedAt: string;
}

export interface TicketMessageModel {
  id: string;
  ticketId: string;
  senderRole: 'CUSTOMER' | 'ADMIN' | 'SUPPORT_AGENT';
  senderName: string;
  message: string;
  attachments?: string[];
  createdAt: string;
}

export interface SupportTicketModel {
  id: string;
  ticketNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  category: 'ORDER_ISSUE' | 'DELIVERY_DELAY' | 'HANDLOOM_QUALITY' | 'PAYMENT_BILLING' | 'ACCOUNT_ACCESS' | 'GENERAL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  orderId?: string | null;
  subject: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_CUSTOMER' | 'RESOLVED' | 'REOPENED' | 'CLOSED';
  slaHours: number;
  createdAt: string;
  updatedAt: string;
  firstResponseAt?: string | null;
  resolvedAt?: string | null;
  closedAt?: string | null;
  messages: TicketMessageModel[];
}

export interface NavItemModel {
  id: string;
  label: string;
  labelTe?: string;
  href: string;
  icon: string;
  tooltip: string;
  category?: string;
  order: number;
  isFeatured?: boolean;
}

export interface CouponModel {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FLAT';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number | null;
  usageCount: number;
  usageLimit?: number | null;
  expiryDate?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentTransactionModel {
  id: string;
  transactionId: string;
  orderId: string;
  userId?: string | null;
  customerName?: string;
  customerEmail?: string;
  amount: number;
  currency: string;
  gateway: 'CASHFREE' | 'COD' | 'UPI' | 'CARD';
  gatewayPaymentId?: string | null;
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'USER_CANCELLED';
  attemptNumber: number;
  failureReason?: string | null;
  gatewayStatusCode?: string | null;
  rawResponse?: any;
  createdAt: string;
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
  grievanceOfficerName: string;
  grievanceOfficerDesignation: string;
  grievanceOfficerEmail: string;
  grievanceOfficerPhone: string;
  grievanceOfficerAddress: string;
  deliveryRadiusKm: number;
  deliveryPincode: string;
  deliveryVillages: string;
  tariffDescription?: string;
  cashfreeAppId?: string;
  cashfreeSecretKey?: string;
  cashfreeEnv?: 'sandbox' | 'production';
  cashfreeApiVersion?: string;
  lastPolicyUpdateTitle?: string;
  lastPolicyUpdateSummary?: string;
  lastPolicyUpdatedAt?: string;
  isCartEnabled?: boolean;
  isCheckoutEnabled?: boolean;
  isPaymentsEnabled?: boolean;
  isCodEnabled?: boolean;
  isMaintenanceMode?: boolean;
  maintenanceNotice?: string;
  cartPausedNotice?: string;
  checkoutPausedNotice?: string;
  paymentsPausedNotice?: string;
  cartDisabledNotice?: string;
  checkoutDisabledNotice?: string;
  paymentsDisabledNotice?: string;
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
  otpRequestCount?: number;
  otpLockedUntil?: string | null;
  failedLoginAttempts?: number;
  lockedUntil?: string | null;
  resetToken?: string | null;
  resetExpiresAt?: string | null;
  emailVerified?: boolean;
  emailVerificationToken?: string | null;
  emailVerificationExpiresAt?: string | null;
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

export type OrderStatus = 'ORDER_PLACED' | 'CONFIRMED' | 'DISPATCHED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

export const ORDER_STATUS_RANKS: Record<OrderStatus, number> = {
  ORDER_PLACED: 1,
  CONFIRMED: 2,
  DISPATCHED: 3,
  OUT_FOR_DELIVERY: 4,
  DELIVERED: 5,
  CANCELLED: 99,
};

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
  orderStatus: OrderStatus;
  courierPartner?: string | null;
  trackingNumber?: string | null;
  estimatedDeliveryDays: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItemModel[];
  timeline: OrderTimelineEventModel[];
  refundStatus?: 'REQUESTED' | 'APPROVED' | 'PROCESSING' | 'COMPLETED' | 'REFUNDED' | 'REJECTED' | string | null;
  refundDetails?: Record<string, any> | null;
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
  refundId?: string | null;
  reason: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'PROCESSING' | 'COMPLETED' | 'PROCESSED' | 'REJECTED';
  refundType?: 'FULL' | 'PARTIAL';
  cashfreeRefundId?: string | null;
  bankReference?: string | null;
  notes?: string | null;
  adminNotes?: string | null;
  processedBy?: string | null;
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
    story: "KB FASHIONS has been rooted in Kalwaral village for over two decades. Originating as part of our ancestral occupation in fine textiles, we now bring honest quality, durable fabrics, and traditional warmth directly to local village patrons within our 10 km service radius under PIN 503145.",
    freeShippingThreshold: 999,
    flatShippingFee: 70,
    grievanceOfficerName: "KB FASHIONS Grievance Redressal Cell",
    grievanceOfficerDesignation: "Designated Grievance Redressal Officer & Managing Proprietorship",
    grievanceOfficerEmail: "kb.official.admin@gmail.com",
    grievanceOfficerPhone: "+91 7989768200",
    grievanceOfficerAddress: "3-55/1, Kalwaral(Vil), Sadasivanagar(M), Kamareddy(D), Telangana(TG), 503145.",
    deliveryRadiusKm: 10,
    deliveryPincode: "503145",
    deliveryVillages: "Kalwaral, Sadasivanagar, Dharmaraopet, Tadwai, Padmavajiwadi, Modegaon, Markal, Brahmanpally, Utnoor, Kuprial",
    tariffDescription: "Standard 10 km Local Delivery Tariff: ₹70 flat shipping across all villages in 503145 within 10 km radius. Free delivery for orders above ₹999.",
    cashfreeAppId: process.env.CASHFREE_APP_ID || "",
    cashfreeSecretKey: process.env.CASHFREE_SECRET_KEY || "",
    cashfreeEnv: "sandbox",
    cashfreeApiVersion: "2026-01-01",
    lastPolicyUpdateTitle: "Consumer Protection & Delivery Compliance 2026",
    isCartEnabled: true,
    isCheckoutEnabled: true,
    isPaymentsEnabled: true,
    isCodEnabled: true,
    isMaintenanceMode: false,
    maintenanceNotice: "Store system operating normally.",
    cartPausedNotice: "Cart additions are temporarily paused for a brief stock update.",
    checkoutPausedNotice: "Checkout is temporarily paused for scheduled maintenance.",
    paymentsPausedNotice: "Online payment gateway is temporarily paused. Please check back shortly.",
    cartDisabledNotice: "Cart additions are temporarily paused for a brief stock update.",
    checkoutDisabledNotice: "Checkout is temporarily paused for scheduled maintenance.",
    paymentsDisabledNotice: "Online payment gateway is temporarily paused. Please check back shortly.",
    updatedAt: new Date().toISOString(),
  };

  public users: UserModel[] = [];
  public addresses: AddressModel[] = [];
  public paymentMethods: PaymentMethodModel[] = [];
  public products: ProductModel[] = [];
  public productImages: ProductImageModel[] = [];
  public banners: BannerModel[] = [];
  public alerts: StoreAlertModel[] = [];
  public navItems: NavItemModel[] = [];
  public cartItems: CartItemModel[] = [];
  public coupons: CouponModel[] = [];
  public paymentTransactions: PaymentTransactionModel[] = [];
  public appliedPromos: Map<string, { code: string; percent: number }> = new Map();
  public orderOtps: Map<string, { otp: string; expiresAt: number }> = new Map();
  public orders: OrderModel[] = [];
  public refundRequests: RefundRequestModel[] = [];
  public supportTickets: SupportTicketModel[] = [];
  public auditLogs: AuditLogModel[] = [];
  private lastAuditHash: string = "0000000000000000000000000000000000000000000000000000000000000000";
  constructor() {
    this.seedDatabase();
    this.loadFromDisk();
  }

  public createSnapshot(): string {
    return JSON.stringify({
      storeSettings: this.storeSettings,
      users: this.users,
      addresses: this.addresses,
      paymentMethods: this.paymentMethods,
      products: this.products,
      productImages: this.productImages,
      banners: this.banners,
      alerts: this.alerts,
      coupons: this.coupons,
      paymentTransactions: this.paymentTransactions,
      orders: this.orders,
      refundRequests: this.refundRequests,
      supportTickets: this.supportTickets,
      auditLogs: this.auditLogs,
      lastAuditHash: this.lastAuditHash,
      cartItems: this.cartItems,
    });
  }

  public restoreSnapshot(snapshotJson: string): void {
    try {
      const data = JSON.parse(snapshotJson);
      if (data.storeSettings) this.storeSettings = data.storeSettings;
      if (data.users) this.users = data.users;
      if (data.addresses) this.addresses = data.addresses;
      if (data.paymentMethods) this.paymentMethods = data.paymentMethods;
      if (data.products) this.products = data.products;
      if (data.productImages) this.productImages = data.productImages;
      if (data.banners) this.banners = data.banners;
      if (data.alerts) this.alerts = data.alerts;
      if (data.coupons) this.coupons = data.coupons;
      if (data.paymentTransactions) this.paymentTransactions = data.paymentTransactions;
      if (data.orders) this.orders = data.orders;
      if (data.refundRequests) this.refundRequests = data.refundRequests;
      if (data.supportTickets) this.supportTickets = data.supportTickets;
      if (data.auditLogs) this.auditLogs = data.auditLogs;
      if (data.lastAuditHash) this.lastAuditHash = data.lastAuditHash;
      if (data.cartItems) this.cartItems = data.cartItems;
      console.log('[DB TRANSACTION ROLLBACK SUCCESSFUL] Restored consistent state from snapshot.');
    } catch (e) {
      console.error('[DB RESTORE SNAPSHOT ERROR]:', e);
    }
  }

  /**
   * Execute a unit of work inside a rollback-capable transaction.
   * If any error or exception occurs, the database automatically rolls back
   * to the exact pre-transaction state, discarding uncommitted mutations.
   * On success, automatically persists changes durably to disk.
   */
  public async transaction<T>(action: () => Promise<T> | T): Promise<T> {
    const snapshot = this.createSnapshot();
    try {
      const result = await action();
      this.saveToDisk();
      return result;
    } catch (err: any) {
      console.error('[DB TRANSACTION FAILURE DETECTED] Triggering automatic rollback:', err?.message || err);
      this.restoreSnapshot(snapshot);
      throw err;
    }
  }

  public saveToDisk(): void {
    if (typeof window !== 'undefined') return;
    try {
      const fsMod = getFs();
      const pathMod = getPath();
      if (!fsMod || !pathMod) return;

      const filePath = pathMod.join(process.cwd(), 'data', 'store_db.json');
      const dataDir = pathMod.dirname(filePath);
      if (!fsMod.existsSync(dataDir)) {
        fsMod.mkdirSync(dataDir, { recursive: true });
      }

      // Safeguard: Read existing disk users if present and merge so concurrent workers never drop users!
      if (fsMod.existsSync(filePath)) {
        try {
          const existingRaw = fsMod.readFileSync(filePath, 'utf-8');
          const existingParsed = JSON.parse(existingRaw);
          if (Array.isArray(existingParsed.users) && existingParsed.users.length > 0) {
            const userMap = new Map<string, UserModel>();
            for (const u of existingParsed.users) {
              const emailKey = u.email ? u.email.toLowerCase().trim() : u.id;
              userMap.set(emailKey, u);
              userMap.set(u.id, u);
            }
            for (const u of this.users) {
              const emailKey = u.email ? u.email.toLowerCase().trim() : u.id;
              userMap.set(emailKey, u);
              userMap.set(u.id, u);
            }
            // De-duplicate by id to preserve clean array
            const uniqueById = new Map<string, UserModel>();
            for (const u of userMap.values()) uniqueById.set(u.id, u);
            this.users = Array.from(uniqueById.values());
          }
          if (Array.isArray(existingParsed.orders) && existingParsed.orders.length > 0) {
            const orderMap = new Map<string, OrderModel>();
            for (const o of existingParsed.orders) orderMap.set(o.orderId || o.id, o);
            for (const o of this.orders) orderMap.set(o.orderId || o.id, o);
            this.orders = Array.from(orderMap.values());
          }
        } catch (e) {
          // If disk file is mid-write, proceed with memory
        }
      }

      const safeStoreSettings = {
        ...this.storeSettings,
        cashfreeSecretKey: undefined,
      };

      const dataToSave = {
        storeSettings: safeStoreSettings,
        users: this.users,
        addresses: this.addresses,
        paymentMethods: this.paymentMethods,
        products: this.products,
        productImages: this.productImages,
        banners: this.banners,
        alerts: this.alerts,
        coupons: this.coupons,
        paymentTransactions: this.paymentTransactions,
        orders: this.orders,
        refundRequests: this.refundRequests,
        supportTickets: this.supportTickets,
        auditLogs: this.auditLogs,
        lastAuditHash: this.lastAuditHash,
      };
      const tmpPath = `${filePath}.${Date.now()}.${Math.random().toString(36).slice(2)}.tmp`;
      fsMod.writeFileSync(tmpPath, JSON.stringify(dataToSave, null, 2), 'utf-8');
      fsMod.renameSync(tmpPath, filePath);
    } catch (err) {
      console.error('[DB DISK PERSISTENCE SAVE ERROR]', err);
    }
  }

  public loadFromDisk(): void {
    if (typeof window !== 'undefined') return;
    try {
      const fsMod = getFs();
      const pathMod = getPath();
      if (!fsMod || !pathMod) return;

      const filePath = pathMod.join(process.cwd(), 'data', 'store_db.json');
      if (fsMod.existsSync(filePath)) {
        const raw = fsMod.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.storeSettings) {
          this.storeSettings = { ...this.storeSettings, ...parsed.storeSettings };
        }
        if (Array.isArray(parsed.users) && parsed.users.length > 0) {
          const userMap = new Map<string, UserModel>();
          // Disk users overlay seed users and are the persistent source of truth
          for (const u of parsed.users) {
            const emailKey = u.email ? u.email.toLowerCase().trim() : u.id;
            userMap.set(emailKey, u);
            userMap.set(u.id, u);
          }
          // Seed users only if email not already present on disk
          for (const u of this.users) {
            const emailKey = u.email ? u.email.toLowerCase().trim() : u.id;
            if (!userMap.has(emailKey) && !userMap.has(u.id)) {
              userMap.set(emailKey, u);
              userMap.set(u.id, u);
            }
          }
          const uniqueById = new Map<string, UserModel>();
          for (const u of userMap.values()) uniqueById.set(u.id, u);
          this.users = Array.from(uniqueById.values());
        }
        if (Array.isArray(parsed.addresses)) {
          this.addresses = parsed.addresses;
        }
        if (Array.isArray(parsed.paymentMethods)) {
          this.paymentMethods = parsed.paymentMethods;
        }
        if (Array.isArray(parsed.orders) && parsed.orders.length > 0) {
          const orderMap = new Map<string, OrderModel>();
          for (const o of this.orders) orderMap.set(o.orderId || o.id, o);
          for (const o of parsed.orders) orderMap.set(o.orderId || o.id, o);
          this.orders = Array.from(orderMap.values());
        }
        if (Array.isArray(parsed.banners) && parsed.banners.length > 0) {
          this.banners = parsed.banners;
        }
        if (Array.isArray(parsed.alerts) && parsed.alerts.length > 0) {
          this.alerts = parsed.alerts;
        }
        if (Array.isArray(parsed.coupons) && parsed.coupons.length > 0) {
          this.coupons = parsed.coupons;
        }
        if (Array.isArray(parsed.paymentTransactions) && parsed.paymentTransactions.length > 0) {
          this.paymentTransactions = parsed.paymentTransactions;
        }
        if (Array.isArray(parsed.supportTickets)) {
          this.supportTickets = parsed.supportTickets;
        }
        if (Array.isArray(parsed.auditLogs)) {
          this.auditLogs = parsed.auditLogs;
        }
        if (Array.isArray(parsed.refundRequests)) {
          this.refundRequests = parsed.refundRequests;
        }
        if (Array.isArray(parsed.productImages) && parsed.productImages.length > 0) {
          const diskImgIds = new Set(parsed.productImages.map((img: any) => img.id));
          const initialNotPresent = this.productImages.filter(img => !diskImgIds.has(img.id));
          this.productImages = [...parsed.productImages, ...initialNotPresent];
        }
        if (parsed.lastAuditHash) {
          this.lastAuditHash = parsed.lastAuditHash;
        }
      } else {
        this.saveToDisk();
      }
    } catch (err) {
      console.error('[DB DISK PERSISTENCE LOAD ERROR]', err);
    }
  }

  public addUser(user: UserModel): void {
    this.loadFromDisk();
    const lowerEmail = user.email ? user.email.toLowerCase().trim() : '';
    const idx = this.users.findIndex(
      u => u.id === user.id || (lowerEmail && u.email && u.email.toLowerCase().trim() === lowerEmail)
    );
    if (idx >= 0) {
      this.users[idx] = { ...this.users[idx], ...user, updatedAt: new Date().toISOString() };
    } else {
      this.users.push(user);
    }
    this.saveToDisk();
    console.log(`[USER PERSISTED TO DISK] User ${user.email} (${user.id}) successfully stored in database. Total users: ${this.users.length}`);
  }

  public saveUser(user: UserModel): void {
    this.loadFromDisk();
    const lowerEmail = user.email ? user.email.toLowerCase().trim() : '';
    const idx = this.users.findIndex(
      u => u.id === user.id || (lowerEmail && u.email && u.email.toLowerCase().trim() === lowerEmail)
    );
    if (idx >= 0) {
      this.users[idx] = { ...this.users[idx], ...user, updatedAt: new Date().toISOString() };
    } else {
      this.users.push(user);
    }
    this.saveToDisk();
  }

  public findUser(emailOrPhone: string): UserModel | undefined {
    this.loadFromDisk();
    if (!emailOrPhone) return undefined;
    const clean = emailOrPhone.trim().toLowerCase();
    const digits = emailOrPhone.replace(/\D/g, '');

    return this.users.find(u => {
      // 1. Email check (case-insensitive & trimmed)
      if (u.email && u.email.trim().toLowerCase() === clean) return true;

      // 2. Direct phone string match
      if (u.phone && (u.phone.trim() === emailOrPhone.trim() || u.phone.trim().toLowerCase() === clean)) return true;

      // 3. Indian Phone match by last 10 digits
      if (digits.length >= 10 && u.phone) {
        const uDigits = u.phone.replace(/\D/g, '');
        if (uDigits.length >= 10 && uDigits.slice(-10) === digits.slice(-10)) {
          return true;
        }
      }

      return false;
    });
  }

  public findUserById(id: string): UserModel | undefined {
    this.loadFromDisk();
    return this.users.find(u => u.id === id);
  }

  public findUserByVerificationToken(token: string): UserModel | undefined {
    this.loadFromDisk();
    return this.users.find(u => u.emailVerificationToken === token);
  }

  public findUserByResetToken(token: string): UserModel | undefined {
    this.loadFromDisk();
    return this.users.find(u => u.resetToken === token);
  }

  public addOrder(order: OrderModel): void {
    const idx = this.orders.findIndex(o => o.id === order.id || o.orderId === order.orderId);
    if (idx >= 0) {
      this.orders[idx] = order;
    } else {
      this.orders.unshift(order);
    }
    this.saveToDisk();
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
      },
      {
        id: "usr-cust-2",
        name: "Bhavith Kumar",
        email: "k.bhavithkumar.dev@gmail.com",
        phone: "+917989768202",
        passwordHash: customerHash,
        role: "CUSTOMER",
        isActive: true,
        avatar: "/api/media/avatar-usr-cust-1",
        villageOrCity: "Kalwaral",
        mandalOrArea: "Sadasivanagar",
        district: "Kamareddy",
        state: "Telangana",
        pinCode: "503145",
        preferredLanguage: "te",
        smsUpdates: true,
        whatsappUpdates: true,
        bio: "Patron of KB FASHIONS ancestral handlooms & modern textiles.",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "usr-cust-3",
        name: "RGUKT Patron",
        email: "b210662@rgukt.ac.in",
        phone: "+919876543211",
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
        bio: "Verified RGUKT student patron.",
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

    const PRODUCT_PHOTOGRAPHY_MAP: Record<string, string> = {
      "prod-gadwal-1": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80",
      "prod-pattu-1": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80",
      "prod-designer-1": "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80",
      "prod-nirma-1": "https://images.unsplash.com/photo-1610030469854-4638706346aa?auto=format&fit=crop&w=1000&q=80",
      "prod-women-top-1": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80",
      "prod-women-legging-1": "https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?auto=format&fit=crop&w=1000&q=80",
      "prod-women-dress-1": "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=1000&q=80",
      "prod-blouse-1": "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=1000&q=80",
      "prod-matching-1": "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=1000&q=80",
      "prod-men-raymond-shirt": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80",
      "prod-men-raymond-pant": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80",
      "prod-men-arvind-linen": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80",
      "prod-men-combo-box": "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=1000&q=80",
      "prod-dhoti-1": "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=1000&q=80",
      "prod-towel-1": "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1000&q=80",
      "prod-banian-1": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80",
      "prod-kerchief-1": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80",
    };

    // Seed into Database collections & generate authentic photography URLs
    rawCatalog.forEach((p, idx) => {
      const imgId = `img-cat-${idx + 1}`;
      const photoUrl = PRODUCT_PHOTOGRAPHY_MAP[p.productId];
      const imgData = photoUrl || generateApparelSvg(p.name, p.productType, p.colorHex, p.bgHex, p.badge, p.brand);
      const mimeType = photoUrl ? "image/jpeg" : "image/svg+xml";

      const imageModel: ProductImageModel = {
        id: imgId,
        productId: p.productId,
        name: `${p.name} - Authentic Photography`,
        mimeType,
        data: imgData,
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
        courierPartner: "KB 10km Express Runner",
        trackingNumber: "KB-LOC-5829104",
        estimatedDeliveryDays: 1,
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
            title: "Consignment Dispatched via 10km Local Delivery Express",
            description: "Consignment handed over to local Kalwaral delivery runner under tracking KB-LOC-5829104.",
            location: "Kalwaral Local Hub, Sadasivanagar Mandal",
            courierPartner: "KB 10km Express Runner",
            trackingNumber: "KB-LOC-5829104",
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

    // 5. Dynamic Navigation Items (Direct from Database)
    this.navItems = [
      {
        id: "nav-men",
        label: "Men",
        labelTe: "పురుషుల దుస్తులు",
        href: "/search?category=Men",
        icon: "👔",
        tooltip: "Raymond & Premium Unstitched Suitings",
        category: "Men",
        order: 1
      },
      {
        id: "nav-women",
        label: "Women",
        labelTe: "మహిళల కలెక్షన్",
        href: "/search?category=Women",
        icon: "👗",
        tooltip: "Tops, Leggings & Daily Wear Dresses",
        category: "Women",
        order: 2
      },
      {
        id: "nav-sarees",
        label: "Sarees",
        labelTe: "చేనేత చీరలు",
        href: "/search?category=Sarees",
        icon: "🥻",
        tooltip: "Authentic Gadwal, Pattu & Designer Sarees",
        category: "Sarees",
        order: 3,
        isFeatured: true
      },
      {
        id: "nav-kids",
        label: "Kids",
        labelTe: "పిల్లల కలెక్షన్",
        href: "/search?category=Kids",
        icon: "🧒",
        tooltip: "Traditional & Comfortable Kids Wear",
        category: "Kids",
        order: 4
      },
      {
        id: "nav-wedding",
        label: "Wedding",
        labelTe: "పెళ్లి కలెక్షన్",
        href: "/search?category=Wedding",
        icon: "💍",
        tooltip: "Bridal Pattu Silk & Matching Blouse Sets",
        category: "Wedding",
        order: 5
      },
      {
        id: "nav-trending",
        label: "Trending",
        labelTe: "ట్రెండింగ్ ఫ్యాషన్",
        href: "/search?category=Trending",
        icon: "🔥",
        tooltip: "Fastest Selling Village Fashion Arrivals",
        category: "Trending",
        order: 6
      },
      {
        id: "nav-about",
        label: "About",
        labelTe: "మా 20 ఏళ్ల చరిత్ర",
        href: "/about",
        icon: "🏛️",
        tooltip: "20 Years of Generational Weaver Heritage",
        order: 7
      }
    ];

    // 6. Dynamic Store Alerts & Push Banners (Database Powered)
    this.alerts = [
      {
        id: "alert-1",
        title: "Direct Village Delivery within 10 km (PIN 503145)",
        message: "Free direct doorstep delivery within 10 km radius of Kalwaral Store. Serving Sadasivanagar, Dharmaraopet, Modegaon, and surrounding villages.",
        type: "ANNOUNCEMENT",
        linkUrl: "/policies/shipping",
        linkText: "Check Delivery Area",
        isActive: true,
        isPushed: false,
        displayLocation: "TOP_BAR",
        badge: "🚚 LOCAL VILLAGE DELIVERY",
        textColor: "BLUE",
        createdAt: now,
        updatedAt: now
      },
      {
        id: "alert-2",
        title: "Festive Ancestral Handloom Offer",
        message: "Use code KB10 at checkout for an instant 10% discount on all authentic Gadwal & Pattu sarees!",
        type: "OFFER",
        linkUrl: "/search?category=Sarees",
        linkText: "Shop Handlooms",
        isActive: true,
        isPushed: false,
        displayLocation: "TOP_BAR",
        badge: "✨ FESTIVE 10% OFF",
        textColor: "GREEN",
        createdAt: now,
        updatedAt: now
      }
    ];

    // 7. Initial Support Tickets (Online Streamlined Support)
    this.supportTickets = [
      {
        id: "tkt-1",
        ticketNumber: "TKT-2026-10482",
        userId: "usr-cust-1",
        customerName: "Rahul Sharma",
        customerEmail: "customer@example.com",
        customerPhone: "+919876543210",
        category: "ORDER_ISSUE",
        priority: "MEDIUM",
        orderId: "ord-1001",
        subject: "Verification of Raymond fine suiting custom cut length",
        status: "IN_PROGRESS",
        slaHours: 24,
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        firstResponseAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        messages: [
          {
            id: "msg-101",
            ticketId: "tkt-1",
            senderRole: "CUSTOMER",
            senderName: "Rahul Sharma",
            message: "Namaste KB Fashions team, I placed order for 3.25 meters of Raymond Dark Navy suiting fabric. Can you please confirm if the extra 0.25m allowance for tailored trousers is included from the bolt?",
            createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          },
          {
            id: "msg-102",
            ticketId: "tkt-1",
            senderRole: "ADMIN",
            senderName: "KB Fashions Support Team",
            message: "Namaskaram Sri Rahul garu! We have physically verified your cut length on our wooden measuring table in Kalwaral store. Exactly 3.25 meters plus a 5cm complimentary artisan selvage buffer has been precision cut. Your package is sealed and ready for dispatch.",
            createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          }
        ]
      },
      {
        id: "tkt-2",
        ticketNumber: "TKT-2026-09841",
        userId: "usr-cust-1",
        customerName: "Rahul Sharma",
        customerEmail: "customer@example.com",
        customerPhone: "+919876543210",
        category: "DELIVERY_DELAY",
        priority: "LOW",
        orderId: null,
        subject: "Doorstep delivery timing for Sadasivanagar local radius",
        status: "RESOLVED",
        slaHours: 24,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        firstResponseAt: new Date(Date.now() - 86400000 * 1.8).toISOString(),
        resolvedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        messages: [
          {
            id: "msg-201",
            ticketId: "tkt-2",
            senderRole: "CUSTOMER",
            senderName: "Rahul Sharma",
            message: "Could you let me know if evening delivery after 6:00 PM is available for Sadasivanagar village?",
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          },
          {
            id: "msg-202",
            ticketId: "tkt-2",
            senderRole: "SUPPORT_AGENT",
            senderName: "KB Village Dispatcher (Ramesh)",
            message: "Yes sir! Our local delivery assistant covers Sadasivanagar daily between 5:30 PM and 8:00 PM. We will give you a phone confirmation prior to arrival.",
            createdAt: new Date(Date.now() - 86400000 * 1.8).toISOString(),
          }
        ]
      }
    ];

    // 8. Promotional Coupons (Real Database Engine)
    this.coupons = [
      {
        id: "cpn-1",
        code: "FESTIVE30",
        discountType: "PERCENTAGE",
        discountValue: 30,
        minOrderAmount: 2000,
        maxDiscountAmount: 1000,
        usageCount: 142,
        usageLimit: 500,
        expiryDate: "2026-12-31T23:59:59.000Z",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "cpn-2",
        code: "WELCOME100",
        discountType: "FLAT",
        discountValue: 100,
        minOrderAmount: 999,
        maxDiscountAmount: 100,
        usageCount: 312,
        usageLimit: 1000,
        expiryDate: "2026-12-31T23:59:59.000Z",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "cpn-3",
        code: "KB10",
        discountType: "PERCENTAGE",
        discountValue: 10,
        minOrderAmount: 500,
        maxDiscountAmount: 500,
        usageCount: 420,
        usageLimit: 2000,
        expiryDate: "2026-12-31T23:59:59.000Z",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "cpn-4",
        code: "GADWAL15",
        discountType: "PERCENTAGE",
        discountValue: 15,
        minOrderAmount: 1500,
        maxDiscountAmount: 750,
        usageCount: 88,
        usageLimit: 300,
        expiryDate: "2026-11-15T23:59:59.000Z",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    ];

    // 9. Payment Transactions (Account-Isolated Payment History)
    this.paymentTransactions = [
      {
        id: "tx-1001-1",
        transactionId: "cf_tx_1001_succeeded",
        orderId: "ord-1001",
        userId: "usr-cust-1",
        customerName: "Rahul Sharma",
        customerEmail: "customer@example.com",
        amount: 3200,
        currency: "INR",
        gateway: "CASHFREE",
        gatewayPaymentId: "cf_pay_98231821",
        status: "SUCCESS",
        attemptNumber: 1,
        failureReason: null,
        gatewayStatusCode: "PAID",
        createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
      },
      {
        id: "tx-1002-1",
        transactionId: "cf_tx_1002_attempt1",
        orderId: "ord-1002",
        userId: "usr-cust-2",
        customerName: "Priya Patel",
        customerEmail: "priya.patel@gmail.com",
        amount: 1450,
        currency: "INR",
        gateway: "CASHFREE",
        gatewayPaymentId: "cf_pay_failed_4921",
        status: "FAILED",
        attemptNumber: 1,
        failureReason: "Card declined by issuing bank (Insufficient balance)",
        gatewayStatusCode: "PAYMENT_FAILED",
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      },
      {
        id: "tx-1002-2",
        transactionId: "cf_tx_1002_attempt2",
        orderId: "ord-1002",
        userId: "usr-cust-2",
        customerName: "Priya Patel",
        customerEmail: "priya.patel@gmail.com",
        amount: 1450,
        currency: "INR",
        gateway: "CASHFREE",
        gatewayPaymentId: "cf_pay_failed_4922",
        status: "FAILED",
        attemptNumber: 2,
        failureReason: "UPI intent request timed out by customer app",
        gatewayStatusCode: "TIMEOUT",
        createdAt: new Date(Date.now() - 3600000 * 47).toISOString(),
      },
      {
        id: "tx-1002-3",
        transactionId: "cf_tx_1002_attempt3",
        orderId: "ord-1002",
        userId: "usr-cust-2",
        customerName: "Priya Patel",
        customerEmail: "priya.patel@gmail.com",
        amount: 1450,
        currency: "INR",
        gateway: "CASHFREE",
        gatewayPaymentId: "cf_pay_success_4923",
        status: "SUCCESS",
        attemptNumber: 3,
        failureReason: null,
        gatewayStatusCode: "PAID",
        createdAt: new Date(Date.now() - 3600000 * 46).toISOString(),
      },
      {
        id: "tx-1003-1",
        transactionId: "cf_tx_1003_attempt1",
        orderId: "ord-1003",
        userId: "usr-cust-1",
        customerName: "Rahul Sharma",
        customerEmail: "customer@example.com",
        amount: 4500,
        currency: "INR",
        gateway: "CASHFREE",
        gatewayPaymentId: "cf_pay_failed_8812",
        status: "FAILED",
        attemptNumber: 1,
        failureReason: "NetBanking session expired before OTP entry",
        gatewayStatusCode: "USER_DROPPED",
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
      {
        id: "tx-1003-2",
        transactionId: "cf_tx_1003_attempt2",
        orderId: "ord-1003",
        userId: "usr-cust-1",
        customerName: "Rahul Sharma",
        customerEmail: "customer@example.com",
        amount: 4500,
        currency: "INR",
        gateway: "COD",
        gatewayPaymentId: "cod_confirmed",
        status: "SUCCESS",
        attemptNumber: 2,
        failureReason: null,
        gatewayStatusCode: "COD_AUTHORIZED",
        createdAt: new Date(Date.now() - 3600000 * 11).toISOString(),
      },
    ];

    // 10. Initial Audit Log
    this.addAuditLog(
      "SYSTEM",
      "SYSTEM",
      "STORE_CATALOG_INITIALIZED",
      "CATALOG",
      "KB-CATALOG",
      { totalProducts: this.products.length, village: "Kalwaral", status: "ONLINE_READY" }
    );
  }

  // ===================== COUPONS & PROMOTIONS =====================
  public getCoupons(): CouponModel[] {
    return [...this.coupons];
  }

  public findCouponByCode(code: string): CouponModel | undefined {
    if (!code) return undefined;
    return this.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
  }

  public createCoupon(data: Partial<CouponModel>): CouponModel {
    const now = new Date().toISOString();
    const newCoupon: CouponModel = {
      id: `cpn-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      code: (data.code || 'COUPON').toUpperCase().trim(),
      discountType: data.discountType || 'PERCENTAGE',
      discountValue: Number(data.discountValue) || 10,
      minOrderAmount: Number(data.minOrderAmount) || 0,
      maxDiscountAmount: data.maxDiscountAmount ? Number(data.maxDiscountAmount) : null,
      usageCount: 0,
      usageLimit: data.usageLimit ? Number(data.usageLimit) : null,
      expiryDate: data.expiryDate || null,
      isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      createdAt: now,
      updatedAt: now,
    };
    this.coupons.unshift(newCoupon);
    this.saveToDisk();
    return newCoupon;
  }

  public updateCoupon(id: string, data: Partial<CouponModel>): CouponModel | null {
    const idx = this.coupons.findIndex(c => c.id === id || c.code.toUpperCase() === id.toUpperCase());
    if (idx === -1) return null;
    this.coupons[idx] = {
      ...this.coupons[idx],
      ...data,
      code: data.code ? data.code.toUpperCase().trim() : this.coupons[idx].code,
      updatedAt: new Date().toISOString(),
    };
    this.saveToDisk();
    return this.coupons[idx];
  }

  public deleteCoupon(id: string): boolean {
    const initialLen = this.coupons.length;
    this.coupons = this.coupons.filter(c => c.id !== id && c.code.toUpperCase() !== id.toUpperCase());
    if (this.coupons.length !== initialLen) {
      this.saveToDisk();
      return true;
    }
    return false;
  }

  // ===================== PAYMENT TRANSACTIONS =====================
  public getPaymentTransactions(userId?: string, userEmail?: string): PaymentTransactionModel[] {
    if (userId || userEmail) {
      return this.paymentTransactions.filter(t => 
        (userId && t.userId === userId) || 
        (userEmail && t.customerEmail && t.customerEmail.toLowerCase() === userEmail.toLowerCase())
      );
    }
    return [...this.paymentTransactions];
  }

  public getOrderPaymentAttempts(orderId: string): PaymentTransactionModel[] {
    return this.paymentTransactions
      .filter(t => t.orderId === orderId)
      .sort((a, b) => a.attemptNumber - b.attemptNumber);
  }

  public addPaymentTransaction(data: Omit<PaymentTransactionModel, 'id' | 'createdAt'>): PaymentTransactionModel {
    const newTx: PaymentTransactionModel = {
      id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      ...data,
    };
    this.paymentTransactions.unshift(newTx);
    this.saveToDisk();
    return newTx;
  }

  public getNavItems(): NavItemModel[] {
    return [...this.navItems].sort((a, b) => a.order - b.order);
  }

  public getActiveAlerts(): StoreAlertModel[] {
    return this.alerts.filter(a => a.isActive);
  }

  public getAllAlerts(): StoreAlertModel[] {
    return [...this.alerts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getAlertById(id: string): StoreAlertModel | undefined {
    return this.alerts.find(a => a.id === id);
  }

  public createAlert(data: Partial<StoreAlertModel>): StoreAlertModel {
    const now = new Date().toISOString();
    const newAlert: StoreAlertModel = {
      id: `alert-${Date.now()}`,
      title: data.title || "Announcement",
      message: data.message || "",
      type: data.type || "INFO",
      linkUrl: data.linkUrl || null,
      linkText: data.linkText || null,
      isActive: data.isActive !== undefined ? data.isActive : true,
      isPushed: data.isPushed !== undefined ? data.isPushed : false,
      displayLocation: data.displayLocation || "TOP_BAR",
      badge: data.badge || null,
      textColor: data.textColor || (data.type === 'OFFER' ? 'GREEN' : data.type === 'URGENT' || data.type === 'WARNING' ? 'RED' : data.type === 'INFO' ? 'BLUE' : 'BLACK'),
      createdAt: now,
      updatedAt: now,
    };
    this.alerts.unshift(newAlert);
    this.addAuditLog("ADMIN", "ADMIN", "ALERT_CREATED", "ALERT", newAlert.id, { title: newAlert.title });
    return newAlert;
  }

  public updateAlert(id: string, data: Partial<StoreAlertModel>): StoreAlertModel | null {
    const idx = this.alerts.findIndex(a => a.id === id);
    if (idx === -1) return null;
    this.alerts[idx] = {
      ...this.alerts[idx],
      ...data,
      updatedAt: new Date().toISOString()
    };
    this.addAuditLog("ADMIN", "ADMIN", "ALERT_UPDATED", "ALERT", id, data);
    return this.alerts[idx];
  }

  public deleteAlert(id: string): boolean {
    const idx = this.alerts.findIndex(a => a.id === id);
    if (idx === -1) return false;
    this.alerts.splice(idx, 1);
    this.addAuditLog("ADMIN", "ADMIN", "ALERT_DELETED", "ALERT", id, {});
    return true;
  }

  public getBanners(): BannerModel[] {
    return this.banners.filter(b => b.isActive).sort((a, b) => a.position - b.position);
  }

  public getBannerById(id: string): BannerModel | undefined {
    return this.banners.find(b => b.id === id || b.bannerId === id);
  }

  public createBanner(data: Partial<BannerModel>): BannerModel {
    const now = new Date().toISOString();
    const newBanner: BannerModel = {
      id: `bnr-${Date.now()}`,
      bannerId: `banner-${Date.now()}`,
      title: data.title || "New Showcase Banner",
      subtitle: data.subtitle || "",
      badge: data.badge || "FEATURED",
      category: data.category || "HERO",
      mediaId: data.mediaId || "banner-tradition-meets-trend",
      imageUrl: data.imageUrl || "/api/media/banner-tradition-meets-trend",
      linkUrl: data.linkUrl || "/search?category=All",
      ctaText: data.ctaText || "Shop Now",
      position: data.position !== undefined ? data.position : this.banners.length + 1,
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdAt: now,
      updatedAt: now,
    };
    this.banners.push(newBanner);
    this.addAuditLog("ADMIN", "ADMIN", "BANNER_CREATED", "BANNER", newBanner.id, { title: newBanner.title });
    return newBanner;
  }

  public updateBanner(id: string, data: Partial<BannerModel>): BannerModel | null {
    const idx = this.banners.findIndex(b => b.id === id || b.bannerId === id);
    if (idx === -1) return null;
    this.banners[idx] = {
      ...this.banners[idx],
      ...data,
      updatedAt: new Date().toISOString()
    };
    this.addAuditLog("ADMIN", "ADMIN", "BANNER_UPDATED", "BANNER", id, data);
    return this.banners[idx];
  }

  public deleteBanner(id: string): boolean {
    const idx = this.banners.findIndex(b => b.id === id || b.bannerId === id);
    if (idx === -1) return false;
    this.banners.splice(idx, 1);
    this.addAuditLog("ADMIN", "ADMIN", "BANNER_DELETED", "BANNER", id, {});
    return true;
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
    this.saveToDisk();
    return this.storeSettings;
  }

  public clearCart(userIdOrSessionId: string): void {
    this.cartItems = this.cartItems.filter(
      i => i.sessionId !== userIdOrSessionId && i.userId !== userIdOrSessionId
    );
    this.appliedPromos.delete(userIdOrSessionId);
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
    this.saveToDisk();
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
    this.loadFromDisk();
    return this.addresses.filter(a => a.userId === userId);
  }

  public addAddress(userId: string, data: Omit<AddressModel, 'id' | 'userId' | 'createdAt'>): AddressModel {
    this.loadFromDisk();
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
    this.saveToDisk();
    return newAddress;
  }

  public updateAddress(id: string, userId: string, data: Partial<AddressModel>): AddressModel | null {
    this.loadFromDisk();
    const addr = this.addresses.find(a => a.id === id && a.userId === userId);
    if (!addr) return null;
    if (data.isDefault) {
      this.addresses.filter(a => a.userId === userId).forEach(a => a.isDefault = false);
    }
    Object.assign(addr, data);
    this.saveToDisk();
    return addr;
  }

  public deleteAddress(id: string, userId: string): boolean {
    this.loadFromDisk();
    const idx = this.addresses.findIndex(a => a.id === id && a.userId === userId);
    if (idx === -1) return false;
    this.addresses.splice(idx, 1);
    // If the deleted address was default, set the first remaining as default
    const userAddrs = this.addresses.filter(a => a.userId === userId);
    if (userAddrs.length > 0 && !userAddrs.some(a => a.isDefault)) {
      userAddrs[0].isDefault = true;
    }
    this.saveToDisk();
    return true;
  }

  public getUserPaymentMethods(userId: string): PaymentMethodModel[] {
    this.loadFromDisk();
    return this.paymentMethods.filter(pm => pm.userId === userId);
  }

  public addPaymentMethod(userId: string, data: Omit<PaymentMethodModel, 'id' | 'userId' | 'createdAt'>): PaymentMethodModel {
    this.loadFromDisk();
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
    this.saveToDisk();
    return newPm;
  }

  public deletePaymentMethod(id: string, userId: string): boolean {
    this.loadFromDisk();
    const idx = this.paymentMethods.findIndex(pm => pm.id === id && pm.userId === userId);
    if (idx === -1) return false;
    this.paymentMethods.splice(idx, 1);
    const userPms = this.paymentMethods.filter(pm => pm.userId === userId);
    if (userPms.length > 0 && !userPms.some(pm => pm.isDefault)) {
      userPms[0].isDefault = true;
    }
    this.saveToDisk();
    return true;
  }

  public updateUserProfile(userId: string, updates: Partial<UserModel>): UserModel | null {
    this.loadFromDisk();
    const user = this.findUserById(userId);
    if (!user) return null;
    const allowed = ['name', 'phone', 'villageOrCity', 'mandalOrArea', 'district', 'state', 'pinCode', 'preferredLanguage', 'smsUpdates', 'whatsappUpdates', 'bio'];
    for (const key of allowed) {
      if (key in updates) {
        (user as any)[key] = (updates as any)[key];
      }
    }
    user.updatedAt = new Date().toISOString();
    this.saveUser(user);
    return user;
  }

  public updateUserAvatar(userId: string, avatarDataUrl: string): { user: UserModel; avatarUrl: string } | null {
    this.loadFromDisk();
    const user = this.findUserById(userId);
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
    this.saveUser(user);
    return { user, avatarUrl: user.avatar };
  }

  public changeUserPassword(userId: string, oldPass: string, newPass: string): { success: boolean; error?: string } {
    this.loadFromDisk();
    const user = this.findUserById(userId);
    if (!user) return { success: false, error: 'User not found' };
    const isValid = bcrypt.compareSync(oldPass, user.passwordHash);
    if (!isValid) {
      return { success: false, error: 'Current password is incorrect' };
    }
    user.passwordHash = bcrypt.hashSync(newPass, 10);
    user.updatedAt = new Date().toISOString();
    this.saveUser(user);
    return { success: true };
  }

  public updateOrderStatus(
    orderId: string,
    targetStatus: OrderStatus,
    details?: {
      title?: string;
      description?: string;
      location?: string;
      courierPartner?: string;
      trackingNumber?: string;
      actor?: string;
    }
  ): OrderModel {
    const order = this.orders.find(o => o.orderId === orderId || o.id === orderId);
    if (!order) {
      throw new Error(`Order #${orderId} not found in database.`);
    }

    const currentStatus = order.orderStatus as OrderStatus;
    const currentRank = ORDER_STATUS_RANKS[currentStatus] || 0;
    const targetRank = ORDER_STATUS_RANKS[targetStatus] || 0;

    // Check terminal states
    if (currentStatus === 'DELIVERED') {
      throw new Error(`Invalid status transition: Order #${order.orderId} is DELIVERED (terminal state) and cannot undergo further status transitions.`);
    }
    if (currentStatus === 'CANCELLED') {
      throw new Error(`Invalid status transition: Order #${order.orderId} is CANCELLED (terminal state) and cannot be modified.`);
    }

    // Cancellation check: only allowed before DISPATCHED
    if (targetStatus === 'CANCELLED') {
      if (currentRank >= ORDER_STATUS_RANKS.DISPATCHED) {
        throw new Error(`Invalid status transition: Order #${order.orderId} has already reached '${currentStatus}' stage and cannot be cancelled directly. Please initiate a Return/Refund request instead under 7-day assurance.`);
      }
    } else {
      // Forward-only check
      if (targetRank <= currentRank) {
        throw new Error(`Invalid status transition: Order #${order.orderId} is currently '${currentStatus}' (Rank ${currentRank}) and cannot revert back to '${targetStatus}' (Rank ${targetRank}). Only forward status progression is permitted under delivery compliance.`);
      }
    }

    const now = new Date().toISOString();
    order.orderStatus = targetStatus;
    order.updatedAt = now;

    if (details?.courierPartner) order.courierPartner = details.courierPartner;
    if (details?.trackingNumber) order.trackingNumber = details.trackingNumber;

    if (targetStatus === 'DELIVERED') {
      order.paymentStatus = 'CAPTURED';
    }

    // Append timeline event
    order.timeline.push({
      id: `tl-${order.orderId}-${order.timeline.length + 1}`,
      orderId: order.orderId,
      stage: targetStatus,
      title: details?.title || `Stage Advanced: ${targetStatus}`,
      description: details?.description || `Consignment status progressed to ${targetStatus}`,
      location: details?.location || `${order.villageOrCity} Delivery Point, PIN 503145`,
      courierPartner: order.courierPartner || 'KB Local Village Runner (Kalwaral 10km)',
      trackingNumber: order.trackingNumber || `KB-EXP-${order.orderId.replace(/[^0-9]/g, '')}`,
      timestamp: now,
    });

    this.addAuditLog(
      details?.actor || 'SYSTEM',
      'ADMIN',
      'ORDER_STAGE_ADVANCED',
      'ORDER',
      order.orderId,
      { previousStatus: currentStatus, newStatus: targetStatus, details }
    );

    this.saveToDisk();
    return order;
  }

  public getOrderTracking(orderId: string): any {
    const order = this.orders.find(o => o.orderId === orderId || o.id === orderId || o.trackingNumber === orderId);
    if (!order) return null;

    const carrier = order.courierPartner || 'KB Local Village Runner (Kalwaral 10km)';
    const trackingCode = order.trackingNumber || `KB-EXP-${order.orderId.replace(/[^0-9]/g, '')}`;

    // Structured stage steps
    const stages = [
      { key: 'ORDER_PLACED', label: 'Order Placed', desc: 'Received at Kalwaral Village Store Hub' },
      { key: 'CONFIRMED', label: 'Order Confirmed', desc: 'Handloom weave & meter cut verified by weaver' },
      { key: 'DISPATCHED', label: 'Dispatched', desc: `Handed over to ${carrier}` },
      { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Village delivery runner en route to destination' },
      { key: 'DELIVERED', label: 'Delivered', desc: 'Doorstep delivered with customer verification' }
    ];

    const currentIdx = stages.findIndex(s => s.key === order.orderStatus);
    const relatedRefund = this.refundRequests.find(r => r.orderId === order.orderId);

    const steps = stages.map((s, idx) => ({
      ...s,
      title: s.label,
      description: s.desc,
      completed: currentIdx >= idx,
      isCurrent: currentIdx === idx,
    }));

    return {
      orderId: order.orderId,
      invoiceNumber: order.invoiceNumber,
      orderStatus: order.orderStatus,
      currentStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      courierPartner: carrier,
      carrier: carrier,
      trackingNumber: trackingCode,
      trackingCode: trackingCode,
      destination: `${order.streetAddress}, ${order.villageOrCity}, ${order.district}, ${order.pinCode}`,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      createdAt: order.createdAt,
      estimatedDelivery: order.orderStatus === 'DELIVERED' ? 'Consignment Delivered' : 'Within 24-48 Hours (10 km Local Radius)',
      timeline: order.timeline,
      stages: steps,
      steps: steps,
      refund: relatedRefund || null,
      items: order.items,
      totalPaid: order.totalPaid,
    };
  }

  // Support Tickets Operations
  public getSupportTickets(filter?: { userId?: string; status?: string; category?: string; priority?: string }): SupportTicketModel[] {
    let result = [...this.supportTickets];
    if (filter?.userId) {
      result = result.filter(t => t.userId === filter.userId);
    }
    if (filter?.status && filter.status !== 'ALL') {
      result = result.filter(t => t.status === filter.status);
    }
    if (filter?.category && filter.category !== 'ALL') {
      result = result.filter(t => t.category === filter.category);
    }
    if (filter?.priority && filter.priority !== 'ALL') {
      result = result.filter(t => t.priority === filter.priority);
    }
    return result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  public getSupportTicketById(id: string): SupportTicketModel | undefined {
    return this.supportTickets.find(t => t.id === id || t.ticketNumber === id);
  }

  public createSupportTicket(data: {
    userId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    category: SupportTicketModel['category'];
    priority: SupportTicketModel['priority'];
    orderId?: string | null;
    subject: string;
    initialMessage: string;
  }): SupportTicketModel {
    const now = new Date().toISOString();
    const id = `tkt-${Date.now()}`;
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const ticketNumber = `TKT-2026-${randomDigits}`;

    const initialMsg: TicketMessageModel = {
      id: `msg-${Date.now()}-1`,
      ticketId: id,
      senderRole: 'CUSTOMER',
      senderName: data.customerName,
      message: data.initialMessage,
      createdAt: now,
    };

    const newTicket: SupportTicketModel = {
      id,
      ticketNumber,
      userId: data.userId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      category: data.category,
      priority: data.priority,
      orderId: data.orderId || null,
      subject: data.subject,
      status: 'OPEN',
      slaHours: data.priority === 'URGENT' ? 6 : data.priority === 'HIGH' ? 12 : 24,
      createdAt: now,
      updatedAt: now,
      messages: [initialMsg],
    };

    this.supportTickets.unshift(newTicket);
    this.addAuditLog(
      data.customerEmail,
      'CUSTOMER',
      'SUPPORT_TICKET_CREATED',
      'TICKET',
      newTicket.id,
      { ticketNumber: newTicket.ticketNumber, category: newTicket.category, subject: newTicket.subject }
    );

    return newTicket;
  }

  public addTicketMessage(ticketId: string, messageData: {
    senderRole: 'CUSTOMER' | 'ADMIN' | 'SUPPORT_AGENT';
    senderName: string;
    message: string;
    attachments?: string[];
  }): TicketMessageModel | null {
    const ticket = this.supportTickets.find(t => t.id === ticketId || t.ticketNumber === ticketId);
    if (!ticket) return null;

    const now = new Date().toISOString();
    const newMsg: TicketMessageModel = {
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ticketId: ticket.id,
      senderRole: messageData.senderRole,
      senderName: messageData.senderName,
      message: messageData.message,
      attachments: messageData.attachments || [],
      createdAt: now,
    };

    ticket.messages.push(newMsg);
    ticket.updatedAt = now;

    if (messageData.senderRole === 'ADMIN' || messageData.senderRole === 'SUPPORT_AGENT') {
      if (!ticket.firstResponseAt) {
        ticket.firstResponseAt = now;
      }
      if (ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS' || ticket.status === 'REOPENED') {
        ticket.status = 'WAITING_FOR_CUSTOMER';
      }
    } else if (messageData.senderRole === 'CUSTOMER') {
      if (ticket.status === 'CLOSED') {
        throw new Error(`Ticket #${ticket.ticketNumber} is closed. Please raise a new ticket for further assistance.`);
      }
      if (ticket.status === 'RESOLVED') {
        ticket.status = 'REOPENED'; // Explicitly REOPENED, never back to initial OPEN
      } else if (ticket.status === 'WAITING_FOR_CUSTOMER') {
        ticket.status = 'IN_PROGRESS';
      }
    }

    this.addAuditLog(
      messageData.senderName,
      messageData.senderRole,
      'TICKET_MESSAGE_POSTED',
      'TICKET',
      ticket.id,
      { ticketNumber: ticket.ticketNumber, role: messageData.senderRole, currentStatus: ticket.status }
    );

    this.saveToDisk();
    return newMsg;
  }

  public updateTicketStatus(ticketId: string, status: SupportTicketModel['status'], updaterName?: string): SupportTicketModel | null {
    const ticket = this.supportTickets.find(t => t.id === ticketId || t.ticketNumber === ticketId);
    if (!ticket) return null;

    const currentStatus = ticket.status;

    // Rule 1: No ticket status can revert back to 'OPEN' (the initial created status)
    if (status === 'OPEN' && currentStatus !== 'OPEN') {
      throw new Error(`Invalid ticket transition: Ticket #${ticket.ticketNumber} is currently '${currentStatus}' and cannot revert back to initial 'OPEN' status.`);
    }

    // Rule 2: CLOSED is terminal and immutable
    if (currentStatus === 'CLOSED') {
      throw new Error(`Invalid ticket transition: Ticket #${ticket.ticketNumber} is permanently CLOSED and cannot be modified.`);
    }

    // Rule 3: Once RESOLVED, ticket cannot revert back to OPEN, IN_PROGRESS, or WAITING_FOR_CUSTOMER. It can only be CLOSED or REOPENED.
    if (currentStatus === 'RESOLVED') {
      if (status !== 'RESOLVED' && status !== 'CLOSED' && status !== 'REOPENED') {
        throw new Error(`Invalid ticket transition: Resolved ticket #${ticket.ticketNumber} can only transition to 'CLOSED' or 'REOPENED', not '${status}'.`);
      }
    }

    const now = new Date().toISOString();
    ticket.status = status;
    ticket.updatedAt = now;

    if (status === 'RESOLVED') {
      ticket.resolvedAt = now;
    } else if (status === 'CLOSED') {
      ticket.closedAt = now;
      if (!ticket.resolvedAt) ticket.resolvedAt = now;
    }

    this.addAuditLog(
      updaterName || 'SUPPORT_SYSTEM',
      'SYSTEM',
      'TICKET_STATUS_UPDATED',
      'TICKET',
      ticket.id,
      { ticketNumber: ticket.ticketNumber, previousStatus: currentStatus, newStatus: status }
    );

    this.saveToDisk();
    return ticket;
  }
}

// Global Singleton Database Instance
const globalForDb = globalThis as unknown as { dbInstance: DatabaseStore | undefined };
export const db = globalForDb.dbInstance ?? new DatabaseStore();
if (process.env.NODE_ENV !== 'production') globalForDb.dbInstance = db;