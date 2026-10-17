import { z } from 'zod';

export const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;
export const pinRegex = /^\d{6}$/;

// 1. Auth Schemas
export const signupSchema = z.object({
  name: z.string().min(2, "Full Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(phoneRegex, "Must be a valid 10-digit Indian phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signinSchema = z.object({
  emailOrPhone: z.string().min(3, "Email or phone number is required"),
  password: z.string().min(1, "Password is required"),
});

export const otpRequestSchema = z.object({
  emailOrPhone: z.string().min(3, "Email or phone number is required"),
});

export const otpVerifySchema = z.object({
  emailOrPhone: z.string().min(3, "Email or phone number is required"),
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

// 2. Product Schemas
export const productCreateSchema = z.object({
  name: z.string().min(3, "Product name is required"),
  title: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be greater than zero"),
  compareAtPrice: z.coerce.number().positive().optional().nullable(),
  category: z.string().min(1, "Category is required"),
  productType: z.enum(['SAREE', 'MEN_UNSTITCHED', 'WOMEN_WEAR', 'BLOUSE_PIECE', 'DHOTI_TOWEL', 'INNER_ESSENTIAL', 'GENERAL']).default('GENERAL'),
  brand: z.string().default("KB FASHIONS"),
  fabric: z.string().default("Pure Cotton"),
  isUnstitched: z.boolean().default(false),
  unitType: z.enum(['PIECE', 'METER']).default('PIECE'),
  pricePerMeter: z.coerce.number().positive().optional().nullable(),
  availableMeters: z.array(z.coerce.number()).default([]),
  tags: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default(['S', 'M', 'L', 'XL']),
  colors: z.array(z.string()).default(['Natural', 'Indigo', 'Earthy Ochre']),
  stockQuantity: z.coerce.number().int().min(0, "Stock cannot be negative").default(25),
  fabricCare: z.string().optional(),
  origin: z.string().default("Kalwaral, Telangana, India"),
  isFeatured: z.boolean().default(false),
  sareeDetails: z.object({
    lengthMeters: z.coerce.number().default(6.3),
    hasBlousePiece: z.boolean().default(true),
    blouseLengthMeters: z.coerce.number().default(0.8),
    workType: z.string().default("Handloom Weave"),
    borderType: z.string().default("Zari Border"),
    palluDetails: z.string().default("Rich Contrast Zari Pallu"),
  }).optional().nullable(),
  unstitchedDetails: z.object({
    fabricCutType: z.string().default("Shirt Piece"),
    widthInches: z.coerce.number().default(58),
    standardLengthMeters: z.coerce.number().default(1.6),
    recommendedUse: z.string().default("Office & Festive Wear"),
  }).optional().nullable(),
  essentialDetails: z.object({
    packSize: z.coerce.number().default(1),
    measurementUnit: z.string().default("cm"),
    measurementValues: z.array(z.string()).default(['80cm', '85cm', '90cm', '95cm', '100cm']),
  }).optional().nullable(),
  matchingDetails: z.object({
    matchingBlouseColor: z.string().optional(),
    matchingFallPicoAvailable: z.boolean().default(true),
    customDesignerNotes: z.string().optional(),
  }).optional().nullable(),
  imageData: z.string().min(10, "Product image data is required (stored in database)"),
});

export const productUpdateSchema = productCreateSchema.partial();

// 3. Cart Schemas
export const cartAddSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  name: z.string().min(1, "Product name is required"),
  price: z.coerce.number().positive("Price must be positive"),
  size: z.string().default('M'),
  color: z.string().default('Natural'),
  qty: z.coerce.number().int().positive().default(1),
  cutLength: z.coerce.number().positive().optional().nullable(),
  configuration: z.record(z.any()).optional().nullable(),
  sessionId: z.string().default('default-guest'),
});

export const cartUpdateQtySchema = z.object({
  delta: z.number().int(),
  size: z.string().optional(),
  sessionId: z.string().default('default-guest'),
});

export const applyPromoSchema = z.object({
  code: z.string().trim().toUpperCase(),
  sessionId: z.string().default('default-guest'),
});

// 4. Checkout & Order Schemas
export const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().min(2, "Full name must be at least 2 characters"),
    phone: z.string().regex(phoneRegex, "Must be a valid 10-digit Indian phone number"),
    email: z.string().email("Valid email required for order notifications"),
    streetAddress: z.string().min(5, "Street address must be at least 5 characters"),
    villageOrCity: z.string().min(2, "Village or City is required"),
    mandalOrArea: z.string().optional().nullable(),
    district: z.string().min(2, "District is required"),
    state: z.string().min(2, "State is required"),
    pinCode: z.string().regex(pinRegex, "PIN code must be exactly 6 digits"),
  }),
  paymentMethod: z.enum(['COD', 'UPI', 'CARD', 'NETBANKING']).default('COD'),
  sessionId: z.string().default('default-guest'),
  otp: z.string().optional(),
  termsAccepted: z.boolean().optional(),
});

// 5. Order Timeline Progression Schema
export const orderTimelineUpdateSchema = z.object({
  stage: z.enum(['ORDER_PLACED', 'CONFIRMED', 'DISPATCHED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']),
  title: z.string().min(3, "Stage title is required"),
  description: z.string().min(5, "Stage description is required"),
  location: z.string().min(2, "Stage location or facility is required"),
  courierPartner: z.string().optional(),
  trackingNumber: z.string().optional(),
});

// 6. Store Settings Schema
export const storeSettingsUpdateSchema = z.object({
  brandName: z.string().optional(),
  officialName: z.string().optional(),
  address: z.string().optional(),
  village: z.string().optional(),
  mandal: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  pinCode: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  story: z.string().optional(),
  freeShippingThreshold: z.coerce.number().positive().optional(),
  flatShippingFee: z.coerce.number().min(0).optional(),
  grievanceOfficerName: z.string().optional(),
  grievanceOfficerDesignation: z.string().optional(),
  grievanceOfficerEmail: z.string().email().optional(),
  grievanceOfficerPhone: z.string().optional(),
  grievanceOfficerAddress: z.string().optional(),
  deliveryRadiusKm: z.coerce.number().positive().optional(),
  deliveryPincode: z.string().optional(),
  deliveryVillages: z.string().optional(),
  tariffDescription: z.string().optional(),
  notifyCustomersOnPolicyChange: z.boolean().optional(),
  policyUpdateTitle: z.string().optional(),
  policyUpdateSummary: z.string().optional(),
});

// 7. Refund Request Schema
export const refundRequestSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  reason: z.string().min(10, "Reason must be at least 10 characters"),
  amount: z.coerce.number().positive("Refund amount must be positive"),
});

// 8. Payment Webhook Schema
export const paymentWebhookSchema = z.object({
  eventType: z.string().default('payment.captured'),
  payload: z.object({
    orderId: z.string().optional(),
    amount: z.number().optional(),
    status: z.string().optional(),
  }).passthrough(),
  idempotencyKey: z.string().optional(),
});
