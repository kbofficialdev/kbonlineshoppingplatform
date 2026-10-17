import { z } from 'zod';

export const productFilterSchema = z.object({
  category: z.string().optional(),
  size: z.string().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  sort: z.enum(['featured', 'price-low', 'price-high', 'rating']).optional(),
  search: z.string().optional(),
});

export const cartAddSchema = z.object({
  id: z.coerce.number().optional(),
  productId: z.string().optional(),
  name: z.string().min(1, "Product name is required"),
  price: z.coerce.number().positive("Price must be greater than zero"),
  size: z.string().default('M'),
  color: z.string().default('#111111'),
  qty: z.coerce.number().int().positive().default(1),
  hsnCode: z.string().default('61091000'),
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

export const checkoutOrderSchema = z.object({
  customer: z.object({
    name: z.string().min(2, "Full name must be at least 2 characters"),
    phone: z.string().regex(/^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/, "Must be a valid 10-digit Indian phone number"),
    email: z.string().email().optional().or(z.literal('')),
    streetAddress: z.string().min(5, "Street address must be at least 5 characters"),
    pinCode: z.string().regex(/^\d{6}$/, "PIN code must be exactly 6 digits"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    b2bGstin: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid 15-character GSTIN format").optional().nullable().or(z.literal('')),
  }),
  paymentMethod: z.enum(['UPI', 'CARD', 'COD']).default('UPI'),
  sessionId: z.string().default('default-guest'),
});

export const merchantOnboardSchema = z.object({
  legalBusinessName: z.string().min(3, "Legal Business Name must be at least 3 characters"),
  brandTradeName: z.string().optional(),
  entityType: z.enum(['LLP', 'Private Limited', 'Public Limited', 'Partnership', 'Proprietorship', 'Co-operative', 'Artisan / Guild']).default('Private Limited'),
  gstin: z.string().trim().toUpperCase().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "GSTIN must be a valid 15-character statutory alphanumeric code"),
  incorporationNumber: z.string().optional(),
  contactEmail: z.string().email("Valid statutory contact email is required"),
  contactPhone: z.string().min(10, "Contact phone is required"),
  registeredAddress: z.string().min(8, "Complete registered address is required"),
  qualityCertifications: z.array(z.string()).default([]),
});

export const adminReviewSchema = z.object({
  merchantId: z.string(),
  action: z.enum(['APPROVE', 'REJECT']),
  complianceNotes: z.string().optional(),
});

export const adminRefundSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  amount: z.coerce.number().positive().optional(),
  reason: z.string().default("Customer initiated statutory cancellation within SLA"),
});

export const paymentWebhookSchema = z.object({
  eventType: z.string(),
  payload: z.record(z.any()),
  idempotencyKey: z.string().optional(),
});
