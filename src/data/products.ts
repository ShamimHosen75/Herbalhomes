import soapNeem from "@/assets/soap-neem.jpg";
import soapCinnamon from "@/assets/soap-cinnamon.jpg";
import soapSandalwood from "@/assets/soap-sandalwood.png";
import soapSeaweed from "@/assets/soap-seaweed.jpg";
import soapCharcoal from "@/assets/soap-charcoal.jpg";
import soapTurmeric from "@/assets/soap-turmeric.jpg";
import soapMoringa from "@/assets/soap-moringa.jpg";
import soapGoatMilk from "@/assets/soap-goat-milk.jpg";
import soapSaffron from "@/assets/soap-saffron.jpg";

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

// ─── Seed Data ───────────────────────────────────────────
const genReviews = (count: number): ProductReview[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `rev-${i}`,
    author: ["আহমেদ হোসেন", "ফাতিমা খানম", "রাহেলা আক্তার", "মোঃ রফিকুল", "নাজমা বেগম", "করিম উদ্দিন"][i % 6],
    rating: [5, 4, 5, 5, 4, 3][i % 6],
    comment: [
      "অসাধারণ পণ্য! খুব ভালো লেগেছে।",
      "মান ভালো, তবে ডেলিভারি আরো দ্রুত হলে ভালো হতো।",
      "পরিবারের সবাই ব্যবহার করছি। খুবই সন্তুষ্ট।",
      "দামের তুলনায় মান চমৎকার।",
      "প্রাকৃতিক পণ্য খুঁজছিলাম, এটা পারফেক্ট।",
      "ভালো কিন্তু প্যাকেজিং আরো উন্নত করা দরকার।",
    ][i % 6],
    date: `2025-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
    verified: i % 3 !== 2,
  }));

export const categories: Category[] = [
  { id: "cat-soap", name: "জৈব সাবান", slug: "soap", image: soapNeem, description: "প্রাকৃতিক ও হাতে তৈরি সাবান", count: 9 },
];

export const products: Product[] = [
  {
    id: "p1",
    slug: "neem-soap",
    name: "Neem Soap",
    shortDesc: "প্রাকৃতিক নিম পাতার নির্যাস দিয়ে তৈরি সাবান",
    description: "নিম পাতার নির্যাস দিয়ে তৈরি এই সাবান ত্বকের ইনফেকশন, চুলকানি ও ব্রণ দূর করতে সাহায্য করে।",
    ingredients: "নিম পাতার নির্যাস, নারকেল তেল, অলিভ অয়েল",
    benefits: ["অ্যান্টি-ব্যাকটেরিয়াল", "ব্রণ দূর করে", "চুলকানি কমায়", "ত্বক পরিষ্কার রাখে"],
    usage: "ভেজা ত্বকে সাবান ব্যবহার করুন, ফেনা তৈরি করে আলতো মেসেজ করুন এবং পানি দিয়ে ধুয়ে ফেলুন।",
    images: [soapNeem],
    category: "soap",
    brand: "ALiNA",
    tags: ["সাবান", "নিম"],
    badge: "সেরা",
    variants: [
      { id: "p1-v1", label: "110g", price: 520, oldPrice: 650, stock: 50, sku: "AL-SOAP-NEEM" },
    ],
    reviews: genReviews(5),
    rating: 4.8,
    reviewCount: 124,
    relatedIds: ["p2", "p5"],
    faq: [{ q: "এই সাবান কি সব ধরনের ত্বকে ব্যবহার করা যায়?", a: "হ্যাঁ, এটি সব ধরনের ত্বকের জন্য উপযুক্ত।" }],
    metaTitle: "Neem Soap | ALiNA",
    metaDesc: "প্রাকৃতিক নিম সাবান।",
  },
  {
    id: "p2",
    slug: "cinnamon-soap",
    name: "Cinnamon Soap",
    shortDesc: "দারুচিনি সমৃদ্ধ প্রাকৃতিক সাবান",
    description: "দারুচিনির গুণাগুণ সমৃদ্ধ এই সাবান ত্বককে মসৃণ ও সুগন্ধিত করে।",
    ingredients: "দারুচিনি গুঁড়া, নারকেল তেল, অলিভ অয়েল",
    benefits: ["ত্বক মসৃণ করে", "রক্ত সঞ্চালন বাড়ায়", "অ্যান্টি-অক্সিডেন্ট", "প্রাকৃতিক সুগন্ধ"],
    usage: "ভেজা ত্বকে সাবান ব্যবহার করুন।",
    images: [soapCinnamon],
    category: "soap",
    brand: "ALiNA",
    tags: ["সাবান", "দারুচিনি"],
    variants: [
      { id: "p2-v1", label: "110g", price: 520, oldPrice: 650, stock: 50, sku: "AL-SOAP-CINN" },
    ],
    reviews: genReviews(4),
    rating: 4.7,
    reviewCount: 89,
    relatedIds: ["p1", "p3"],
    faq: [],
    metaTitle: "Cinnamon Soap | ALiNA",
    metaDesc: "দারুচিনি সমৃদ্ধ প্রাকৃতিক সাবান।",
  },
  {
    id: "p3",
    slug: "sandalwood-soap",
    name: "Sandalwood Soap",
    shortDesc: "চন্দন কাঠের গুঁড়া দিয়ে তৈরি সাবান",
    description: "বিশুদ্ধ চন্দন কাঠের গুঁড়া দিয়ে তৈরি এই সাবান ত্বকের উজ্জ্বলতা বাড়ায়।",
    ingredients: "চন্দন গুঁড়া, নারকেল তেল, শিয়া বাটার",
    benefits: ["ত্বক উজ্জ্বল করে", "দাগ দূর করে", "প্রাকৃতিক গ্লো", "অ্যান্টি-ইনফ্ল্যামেটরি"],
    usage: "প্রতিদিন গোসলের সময় ব্যবহার করুন।",
    images: [soapSandalwood],
    category: "soap",
    brand: "ALiNA",
    tags: ["সাবান", "চন্দন"],
    badge: "জনপ্রিয়",
    variants: [
      { id: "p3-v1", label: "110g", price: 520, oldPrice: 650, stock: 45, sku: "AL-SOAP-SAND" },
    ],
    reviews: genReviews(6),
    rating: 4.9,
    reviewCount: 203,
    relatedIds: ["p1", "p6"],
    faq: [],
    metaTitle: "Sandalwood Soap | ALiNA",
    metaDesc: "চন্দন কাঠের প্রাকৃতিক সাবান।",
  },
  {
    id: "p4",
    slug: "seaweed-soap",
    name: "Seaweed Soap",
    shortDesc: "সামুদ্রিক শৈবাল সমৃদ্ধ প্রাকৃতিক সাবান",
    description: "সামুদ্রিক শৈবালের পুষ্টি গুণ সমৃদ্ধ এই সাবান ত্বককে ডিটক্সিফাই করে।",
    ingredients: "সামুদ্রিক শৈবাল, নারকেল তেল, অলিভ অয়েল",
    benefits: ["ত্বক ডিটক্সিফাই করে", "পুষ্টি যোগায়", "ত্বক টান টান করে", "গভীর পরিষ্কার"],
    usage: "ভেজা ত্বকে সাবান ব্যবহার করুন।",
    images: [soapSeaweed],
    category: "soap",
    brand: "ALiNA",
    tags: ["সাবান", "শৈবাল"],
    variants: [
      { id: "p4-v1", label: "110g", price: 520, oldPrice: 650, stock: 40, sku: "AL-SOAP-SEAW" },
    ],
    reviews: genReviews(4),
    rating: 4.6,
    reviewCount: 76,
    relatedIds: ["p5", "p7"],
    faq: [],
    metaTitle: "Seaweed Soap | ALiNA",
    metaDesc: "সামুদ্রিক শৈবাল সমৃদ্ধ প্রাকৃতিক সাবান।",
  },
  {
    id: "p5",
    slug: "charcoal-soap",
    name: "Charcoal Soap (Activated)",
    shortDesc: "অ্যাক্টিভেটেড চারকোল দিয়ে তৈরি ডিটক্স সাবান",
    description: "অ্যাক্টিভেটেড চারকোল দিয়ে তৈরি এই সাবান ত্বকের গভীর থেকে ময়লা ও টক্সিন পরিষ্কার করে।",
    ingredients: "অ্যাক্টিভেটেড চারকোল, নারকেল তেল, অলিভ অয়েল",
    benefits: ["গভীর পরিষ্কার", "ব্রণ দূর করে", "তৈলাক্ত ত্বক নিয়ন্ত্রণ", "ডিটক্সিফাই করে"],
    usage: "ভেজা মুখে বা শরীরে সাবান ঘষে ফেনা তৈরি করুন।",
    images: [soapCharcoal],
    category: "soap",
    brand: "ALiNA",
    tags: ["সাবান", "চারকোল"],
    badge: "নতুন",
    variants: [
      { id: "p5-v1", label: "110g", price: 520, oldPrice: 650, stock: 55, sku: "AL-SOAP-CHAR" },
    ],
    reviews: genReviews(5),
    rating: 4.8,
    reviewCount: 98,
    relatedIds: ["p1", "p6"],
    faq: [],
    metaTitle: "Charcoal Soap | ALiNA",
    metaDesc: "অ্যাক্টিভেটেড চারকোল ডিটক্স সাবান।",
  },
  {
    id: "p6",
    slug: "turmeric-soap",
    name: "Turmeric Soap",
    shortDesc: "হলুদ সমৃদ্ধ প্রাকৃতিক সাবান",
    description: "হলুদের অ্যান্টি-ইনফ্ল্যামেটরি গুণাগুণ সমৃদ্ধ এই সাবান ত্বকের উজ্জ্বলতা বাড়ায়।",
    ingredients: "হলুদ, নারকেল তেল, অলিভ অয়েল",
    benefits: ["ত্বক উজ্জ্বল করে", "দাগ দূর করে", "অ্যান্টি-ইনফ্ল্যামেটরি", "ব্রণ প্রতিরোধ করে"],
    usage: "প্রতিদিন গোসলের সময় ব্যবহার করুন।",
    images: [soapTurmeric],
    category: "soap",
    brand: "ALiNA",
    tags: ["সাবান", "হলুদ"],
    badge: "ছাড়",
    variants: [
      { id: "p6-v1", label: "110g", price: 520, oldPrice: 650, stock: 60, sku: "AL-SOAP-TURM" },
    ],
    reviews: genReviews(4),
    rating: 4.7,
    reviewCount: 67,
    relatedIds: ["p1", "p3"],
    faq: [],
    metaTitle: "Turmeric Soap | ALiNA",
    metaDesc: "হলুদ সমৃদ্ধ প্রাকৃতিক সাবান।",
  },
  {
    id: "p7",
    slug: "moringa-soap",
    name: "Moringa Soap (Activated)",
    shortDesc: "মরিঙ্গা সমৃদ্ধ প্রাকৃতিক সাবান",
    description: "মরিঙ্গার পুষ্টি গুণ সমৃদ্ধ এই সাবান ত্বককে পুষ্টি যোগায় ও সুরক্ষা দেয়।",
    ingredients: "মরিঙ্গা পাতার নির্যাস, নারকেল তেল, অলিভ অয়েল",
    benefits: ["পুষ্টি যোগায়", "অ্যান্টি-অক্সিডেন্ট", "ত্বক সুরক্ষা", "প্রাকৃতিক ডিটক্স"],
    usage: "ভেজা ত্বকে সাবান ব্যবহার করুন।",
    images: [soapMoringa],
    category: "soap",
    brand: "ALiNA",
    tags: ["সাবান", "মরিঙ্গা"],
    variants: [
      { id: "p7-v1", label: "110g", price: 520, oldPrice: 650, stock: 40, sku: "AL-SOAP-MORN" },
    ],
    reviews: genReviews(3),
    rating: 4.5,
    reviewCount: 54,
    relatedIds: ["p1", "p4"],
    faq: [],
    metaTitle: "Moringa Soap | ALiNA",
    metaDesc: "মরিঙ্গা সমৃদ্ধ প্রাকৃতিক সাবান।",
  },
  {
    id: "p8",
    slug: "goat-milk-soap",
    name: "Goat Milk Soap",
    shortDesc: "ছাগলের দুধ সমৃদ্ধ ময়েশ্চারাইজিং সাবান",
    description: "খাঁটি ছাগলের দুধ দিয়ে তৈরি এই সাবান শুষ্ক ও সংবেদনশীল ত্বকের জন্য আদর্শ।",
    ingredients: "ছাগলের দুধ, শিয়া বাটার, অলিভ অয়েল",
    benefits: ["গভীর ময়েশ্চারাইজিং", "শুষ্ক ত্বকে আরাম", "ত্বক নরম করে", "প্রাকৃতিক এক্সফোলিয়েশন"],
    usage: "ভেজা ত্বকে সাবান ঘষে ফেনা তৈরি করুন।",
    images: [soapGoatMilk],
    category: "soap",
    brand: "ALiNA",
    tags: ["সাবান", "গোট মিল্ক"],
    variants: [
      { id: "p8-v1", label: "110g", price: 650, oldPrice: 790, stock: 35, sku: "AL-SOAP-GOAT" },
    ],
    reviews: genReviews(4),
    rating: 4.6,
    reviewCount: 82,
    relatedIds: ["p9", "p3"],
    faq: [],
    metaTitle: "Goat Milk Soap | ALiNA",
    metaDesc: "ছাগলের দুধ সমৃদ্ধ প্রাকৃতিক সাবান।",
  },
  {
    id: "p9",
    slug: "saffron-goat-milk-soap",
    name: "Saffron Goat Milk Soap",
    shortDesc: "জাফরান ও ছাগলের দুধ সমৃদ্ধ প্রিমিয়াম সাবান",
    description: "জাফরান ও খাঁটি ছাগলের দুধের সমন্বয়ে তৈরি এই প্রিমিয়াম সাবান ত্বককে উজ্জ্বল ও কোমল করে।",
    ingredients: "জাফরান, ছাগলের দুধ, শিয়া বাটার, অলিভ অয়েল",
    benefits: ["ত্বক উজ্জ্বল করে", "গভীর ময়েশ্চারাইজিং", "অ্যান্টি-এজিং", "প্রাকৃতিক গ্লো"],
    usage: "প্রতিদিন গোসলের সময় ব্যবহার করুন।",
    images: [soapSaffron],
    category: "soap",
    brand: "ALiNA",
    tags: ["সাবান", "জাফরান", "গোট মিল্ক"],
    badge: "সেরা",
    variants: [
      { id: "p9-v1", label: "110g", price: 950, oldPrice: 1250, stock: 25, sku: "AL-SOAP-SAFF" },
    ],
    reviews: genReviews(5),
    rating: 4.9,
    reviewCount: 142,
    relatedIds: ["p8", "p3"],
    faq: [],
    metaTitle: "Saffron Goat Milk Soap | ALiNA",
    metaDesc: "জাফরান ও ছাগলের দুধ সমৃদ্ধ প্রিমিয়াম সাবান।",
  },
];
