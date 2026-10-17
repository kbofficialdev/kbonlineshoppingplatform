// Export all shared types for the KB Online Shopping Platform

export type EntityType = 'LLP' | 'Private Limited' | 'Public Limited' | 'Partnership' | 'Proprietorship' | 'Co-operative' | 'Artisan / Guild';

export type VerificationStatus = 'PENDING' | 'QUERY_RAISED' | 'VERIFIED' | 'REJECTED';

export type PaymentMethod = 'UPI' | 'CARD' | 'NETBANKING' | 'COD';

export type PaymentStatus = 'PENDING' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED' | 'REFUNDED';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Product {
  id: number;
  product_id: string;
  merchant_id: string;
  name: string;
  title?: string;
  price: number;
  currency: string;
  category: 'Men' | 'Women' | 'New Arrivals' | 'Offers';
  tags: string[];
  hsn_code: string;
  country_of_origin: string;
  is_govt_verified_seller: boolean;
  tax_rate_percent: number;
  sizes: string[];
  colors: string[];
  rating: number;
  reviews: number;
  stock_quantity: number;
  manufacturer_details: string;
  collection: string;
  fabric_care?: string;
  fit_sizing?: string;
  return_policy?: string;
  image_placeholder?: string;
}

export interface Category {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  item_count: number;
}

export interface CartItem {
  id: number;
  product_id: string;
  name: string;
  price: number;
  size: string;
  color?: string;
  qty: number;
  tax_rate_percent: number;
  hsn_code: string;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  discount_percent: number;
  discount_amount: number;
  shipping_fee: number;
  total: number;
  free_shipping_threshold: number;
  amount_needed_for_free_shipping: number;
  applied_promo_code?: string;
}

export interface CustomerAddress {
  name: string;
  phone: string;
  email?: string;
  street_address: string;
  pin_code: string;
  city: string;
  state: string;
  b2b_gstin?: string;
}

export interface OrderItem {
  product_id: string;
  hsn_code: string;
  title: string;
  qty: number;
  unit_price: number;
  tax_amount: number;
  total_amount: number;
  size: string;
}

export interface OrderFinancials {
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  shipping_fee: number;
  discount_amount: number;
  total_paid: number;
  payment_method: PaymentMethod;
  status: PaymentStatus;
}

export interface Order {
  order_id: string;
  invoice_number: string;
  created_at: string;
  customer: CustomerAddress;
  items: OrderItem[];
  financials: OrderFinancials;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  tracking_id?: string;
  estimated_delivery_days: number;
}

export interface SellerInfo {
  legal_name: string;
  gstin: string;
  address: string;
  support_email: string;
  support_phone: string;
  grievance_officer: {
    name: string;
    email: string;
    sla: string;
  };
}

export interface StatutoryTaxInvoice {
  order_id: string;
  invoice_number: string;
  created_at: string;
  seller: SellerInfo;
  customer: {
    name: string;
    phone: string;
    shipping_address: string;
    b2b_gstin?: string;
  };
  items: OrderItem[];
  financials: OrderFinancials;
  digital_signature: {
    authorized_by: string;
    signed_at: string;
    verification_hash: string;
  };
}

export interface MerchantKYC {
  merchant_id: string;
  legal_business_name: string;
  brand_trade_name: string;
  entity_type: EntityType;
  gstin: string;
  incorporation_number: string;
  contact_email: string;
  contact_phone: string;
  registered_address: string;
  quality_certifications: string[]; // e.g. ["ISO 9001", "BIS Quality Mark", "Handloom Mark"]
  verification_status: VerificationStatus;
  verification_seal_timestamp?: string;
  rejection_reason?: string;
  compliance_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  log_id: string;
  timestamp: string;
  actor_id: string;
  actor_role: 'ADMIN' | 'MERCHANT' | 'SYSTEM' | 'CUSTOMER';
  action: string;
  resource_type: string;
  resource_id: string;
  details: Record<string, any>;
  previous_hash: string;
  hash: string;
}

export interface QualitySentimentInsight {
  metric: string;
  positive_percentage: number;
  benchmark_target: number;
  verified_reviews_count: number;
}

