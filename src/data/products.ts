// ─── Types ───────────────────────────────────────────────
export type ProductVariant = {
  id: string;
  label: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  sku: string;
};

export type ProductReview = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  shortDesc: string;
  description: string;
  ingredients: string;
  benefits: string[];
  usage: string;
  images: string[];
  category: string;
  subcategory?: string;
  brand: string;
  tags: string[];
  badge?: "নতুন" | "সেরা" | "ছাড়" | "জনপ্রিয়";
  variants: ProductVariant[];
  reviews: ProductReview[];
  rating: number;
  reviewCount: number;
  relatedIds: string[];
  faq: { q: string; a: string }[];
  metaTitle: string;
  metaDesc: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  count: number;
};

export type CouponRule = {
  code: string;
  type: "percentage" | "fixed" | "free_shipping";
  value: number;
  minSpend: number;
  maxUses: number;
  usedCount: number;
  perUserLimit: number;
  expiresAt: string;
  active: boolean;
};

export type ShippingMethod = {
  id: string;
  name: string;
  cost: number;
  estimatedDays: string;
};

export type OrderStatus = "pending" | "confirmed" | "packed" | "shipped" | "delivered" | "cancelled" | "refunded";

export type OrderItem = {
  productId: string;
  variantId: string;
  name: string;
  variantLabel: string;
  price: number;
  quantity: number;
  image: string;
};

export type Order = {
  id: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  codFee: number;
  total: number;
  couponCode?: string;
  status: OrderStatus;
  statusHistory: { status: OrderStatus; date: string; note?: string }[];
  paymentMethod: string;
  transactionId?: string;
  shippingMethod: string;
  trackingNumber?: string;
  courierName?: string;
  address: ShippingAddress;
  createdAt: string;
  customerEmail?: string;
  customerPhone: string;
  customerName: string;
};

export type ShippingAddress = {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  area: string;
  postalCode: string;
  notes?: string;
};

// ─── Default data (used as fallback) ─────────────────────
export const shippingMethods: ShippingMethod[] = [
  { id: "standard", name: "স্ট্যান্ডার্ড ডেলিভারি", cost: 80, estimatedDays: "3-5 দিন" },
  { id: "express", name: "এক্সপ্রেস ডেলিভারি", cost: 150, estimatedDays: "1-2 দিন" },
];
