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
  label: string; // e.g. "100g", "250g", "1kg"
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
    tags: ["সাবান", "নিম", "অ্যান্টি-ব্যাকটেরিয়াল"],
    badge: "সেরা",
    variants: [
      { id: "p1-v1", label: "110g", price: 520, oldPrice: 650, stock: 50, sku: "AL-SOAP-NEEM" },
    ],
    reviews: genReviews(5),
    rating: 4.8,
    reviewCount: 124,
    relatedIds: ["p2", "p5"],
    faq: [
      { q: "এই সাবান কি সব ধরনের ত্বকে ব্যবহার করা যায়?", a: "হ্যাঁ, এটি সব ধরনের ত্বকের জন্য উপযুক্ত।" },
    ],
    metaTitle: "Neem Soap | ALiNA",
    metaDesc: "প্রাকৃতিক নিম সাবান। ব্রণ ও চুলকানি দূর করে।",
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
    description: "বিশুদ্ধ চন্দন কাঠের গুঁড়া দিয়ে তৈরি এই সাবান ত্বকের উজ্জ্বলতা বাড়ায় এবং দাগ দূর করে।",
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
    metaDesc: "চন্দন কাঠের প্রাকৃতিক সাবান। ত্বক উজ্জ্বল করে।",
  },
  {
    id: "p4",
    slug: "seaweed-soap",
    name: "Seaweed Soap",
    shortDesc: "সামুদ্রিক শৈবাল সমৃদ্ধ প্রাকৃতিক সাবান",
    description: "সামুদ্রিক শৈবালের পুষ্টি গুণ সমৃদ্ধ এই সাবান ত্বককে ডিটক্সিফাই করে ও পুষ্টি যোগায়।",
    ingredients: "সামুদ্রিক শৈবাল, নারকেল তেল, অলিভ অয়েল",
    benefits: ["ত্বক ডিটক্সিফাই করে", "পুষ্টি যোগায়", "ত্বক টান টান করে", "গভীর পরিষ্কার"],
    usage: "ভেজা ত্বকে সাবান ব্যবহার করুন।",
    images: [soapSeaweed],
    category: "soap",
    brand: "ALiNA",
    tags: ["সাবান", "শৈবাল", "ডিটক্স"],
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
    tags: ["সাবান", "চারকোল", "ডিটক্স"],
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
    metaDesc: "হলুদ সমৃদ্ধ প্রাকৃতিক সাবান। ত্বক উজ্জ্বল করে।",
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
    tags: ["সাবান", "গোট মিল্ক", "ময়েশ্চারাইজিং"],
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
    tags: ["সাবান", "জাফরান", "গোট মিল্ক", "প্রিমিয়াম"],
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

export const products: Product[] = [
  {
    id: "p1",
    slug: "lavender-organic-soap",
    name: "ল্যাভেন্ডার জৈব সাবান",
    shortDesc: "ফ্রেঞ্চ ল্যাভেন্ডার অয়েল সমৃদ্ধ হ্যান্ডমেড সাবান",
    description: "ফ্রান্স থেকে আনা বিশুদ্ধ ল্যাভেন্ডার এসেনশিয়াল অয়েল দিয়ে তৈরি এই সাবান ত্বককে মসৃণ ও সুগন্ধিত করে। কোনো রাসায়নিক পদার্থ ছাড়াই সম্পূর্ণ প্রাকৃতিক উপাদানে তৈরি।",
    ingredients: "অলিভ অয়েল, নারকেল তেল, শিয়া বাটার, ল্যাভেন্ডার এসেনশিয়াল অয়েল, ভিটামিন ই",
    benefits: ["ত্বক মসৃণ করে", "মানসিক চাপ কমায়", "গভীর পরিষ্কার করে", "প্রাকৃতিক সুগন্ধ"],
    usage: "ভেজা ত্বকে সাবান ব্যবহার করুন, ফেনা তৈরি করে আলতো মেসেজ করুন এবং পানি দিয়ে ধুয়ে ফেলুন।",
    images: [productSoapLavender, categorySoap],
    category: "soap",
    brand: "Herbal Homes",
    tags: ["সাবান", "ল্যাভেন্ডার", "জৈব", "হ্যান্ডমেড"],
    badge: "সেরা",
    variants: [
      { id: "p1-v1", label: "75g", price: 250, oldPrice: 350, stock: 45, sku: "HH-SOAP-LAV-75" },
      { id: "p1-v2", label: "150g", price: 420, oldPrice: 550, stock: 30, sku: "HH-SOAP-LAV-150" },
    ],
    reviews: genReviews(5),
    rating: 4.8,
    reviewCount: 124,
    relatedIds: ["p6", "p2"],
    faq: [
      { q: "এই সাবান কি সব ধরনের ত্বকে ব্যবহার করা যায়?", a: "হ্যাঁ, এটি সব ধরনের ত্বকের জন্য উপযুক্ত।" },
      { q: "এতে কি কোনো রাসায়নিক আছে?", a: "না, এটি ১০০% প্রাকৃতিক উপাদানে তৈরি।" },
    ],
    metaTitle: "ল্যাভেন্ডার জৈব সাবান | Herbal Homes",
    metaDesc: "ফ্রেঞ্চ ল্যাভেন্ডার অয়েল সমৃদ্ধ ১০০% প্রাকৃতিক হ্যান্ডমেড সাবান। Herbal Homes থেকে অর্ডার করুন।",
  },
  {
    id: "p2",
    slug: "blackseed-oil",
    name: "কালোজিরার তেল",
    shortDesc: "কোল্ড-প্রেসড খাঁটি কালোজিরার তেল",
    description: "১০০% বিশুদ্ধ কোল্ড-প্রেসড কালোজিরার তেল। রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি, চুলের যত্ন এবং ত্বকের সমস্যা সমাধানে অত্যন্ত কার্যকর।",
    ingredients: "১০০% কোল্ড-প্রেসড কালোজিরার তেল (Nigella Sativa)",
    benefits: ["রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি", "চুল পড়া রোধ করে", "ত্বকের সমস্যা দূর করে", "হজম শক্তি বাড়ায়"],
    usage: "প্রতিদিন সকালে ১ চামচ মধু মিশিয়ে খান অথবা চুলে ও ত্বকে সরাসরি ব্যবহার করুন।",
    images: [productBlackseedOil, categoryOils],
    category: "oil",
    brand: "Herbal Homes",
    tags: ["তেল", "কালোজিরা", "কোল্ড-প্রেসড"],
    variants: [
      { id: "p2-v1", label: "100ml", price: 350, oldPrice: null, stock: 60, sku: "HH-OIL-BS-100" },
      { id: "p2-v2", label: "250ml", price: 550, oldPrice: null, stock: 40, sku: "HH-OIL-BS-250" },
      { id: "p2-v3", label: "500ml", price: 950, oldPrice: 1100, stock: 20, sku: "HH-OIL-BS-500" },
    ],
    reviews: genReviews(4),
    rating: 4.9,
    reviewCount: 89,
    relatedIds: ["p5", "p4"],
    faq: [
      { q: "এটা কি খাওয়া যায়?", a: "হ্যাঁ, এটি খাদ্য গ্রেড কালোজিরার তেল।" },
    ],
    metaTitle: "কালোজিরার তেল | Herbal Homes",
    metaDesc: "কোল্ড-প্রেসড ১০০% খাঁটি কালোজিরার তেল। Herbal Homes থেকে অর্ডার করুন।",
  },
  {
    id: "p3",
    slug: "aloe-vera-face-cream",
    name: "অ্যালোভেরা ফেস ক্রিম",
    shortDesc: "অ্যালোভেরা ও ভিটামিন সি সমৃদ্ধ ফেস ক্রিম",
    description: "তাজা অ্যালোভেরা জেল ও প্রাকৃতিক ভিটামিন সি দিয়ে তৈরি এই ক্রিম ত্বককে উজ্জ্বল ও আর্দ্র রাখে। সব ধরনের ত্বকের জন্য উপযুক্ত।",
    ingredients: "অ্যালোভেরা জেল, ভিটামিন সি, শিয়া বাটার, জোজোবা অয়েল, ভিটামিন ই",
    benefits: ["ত্বক উজ্জ্বল করে", "আর্দ্রতা ধরে রাখে", "বলিরেখা কমায়", "সানবার্ন সারায়"],
    usage: "মুখ ধুয়ে তোয়ালে দিয়ে মুছে হালকা করে মাখুন। দিনে ২ বার ব্যবহার করুন।",
    images: [productFaceCream, categorySkincare],
    category: "skincare",
    brand: "Herbal Homes",
    tags: ["স্কিনকেয়ার", "অ্যালোভেরা", "ফেস ক্রিম"],
    badge: "ছাড়",
    variants: [
      { id: "p3-v1", label: "50g", price: 699, oldPrice: 899, stock: 35, sku: "HH-SC-AV-50" },
      { id: "p3-v2", label: "100g", price: 1199, oldPrice: 1499, stock: 20, sku: "HH-SC-AV-100" },
    ],
    reviews: genReviews(6),
    rating: 4.7,
    reviewCount: 203,
    relatedIds: ["p7", "p1"],
    faq: [
      { q: "তৈলাক্ত ত্বকে কি ব্যবহার করা যাবে?", a: "হ্যাঁ, এটি হালকা ফর্মুলা এবং সব ত্বকে উপযোগী।" },
    ],
    metaTitle: "অ্যালোভেরা ফেস ক্রিম | Herbal Homes",
    metaDesc: "অ্যালোভেরা ও ভিটামিন সি সমৃদ্ধ প্রাকৃতিক ফেস ক্রিম। Herbal Homes থেকে কিনুন।",
  },
  {
    id: "p4",
    slug: "pure-organic-honey",
    name: "খাঁটি জৈব মধু",
    shortDesc: "সুন্দরবনের খাঁটি চাকের মধু",
    description: "সুন্দরবন থেকে সংগ্রহিত ১০০% খাঁটি চাকের মধু। কোনো ভেজাল বা চিনি মেশানো নেই। স্বাস্থ্য সচেতন পরিবারের জন্য আদর্শ।",
    ingredients: "১০০% খাঁটি সুন্দরবনের চাকের মধু",
    benefits: ["রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি", "ত্বকের উজ্জ্বলতা বাড়ায়", "গলা ব্যথায় উপকারী", "শক্তি যোগায়"],
    usage: "প্রতিদিন সকালে খালি পেটে ১-২ চামচ মধু পানির সাথে মিশিয়ে খান।",
    images: [productHoney, categoryFood],
    category: "food",
    brand: "Herbal Homes",
    tags: ["মধু", "খাঁটি", "সুন্দরবন", "জৈব"],
    variants: [
      { id: "p4-v1", label: "250g", price: 450, oldPrice: null, stock: 50, sku: "HH-FOOD-HON-250" },
      { id: "p4-v2", label: "500g", price: 800, oldPrice: 900, stock: 30, sku: "HH-FOOD-HON-500" },
      { id: "p4-v3", label: "1kg", price: 1450, oldPrice: 1650, stock: 15, sku: "HH-FOOD-HON-1K" },
    ],
    reviews: genReviews(5),
    rating: 4.9,
    reviewCount: 156,
    relatedIds: ["p8", "p2"],
    faq: [
      { q: "মধু কি আসল?", a: "১০০% আসল সুন্দরবনের চাকের মধু। আমরা গ্যারান্টি দিচ্ছি।" },
    ],
    metaTitle: "খাঁটি জৈব মধু | Herbal Homes",
    metaDesc: "সুন্দরবনের ১০০% খাঁটি চাকের মধু। ভেজালমুক্ত। Herbal Homes থেকে অর্ডার করুন।",
  },
  {
    id: "p5",
    slug: "virgin-coconut-oil",
    name: "ভার্জিন নারকেল তেল",
    shortDesc: "কোল্ড-প্রেসড ভার্জিন নারকেল তেল",
    description: "১০০% বিশুদ্ধ কোল্ড-প্রেসড ভার্জিন নারকেল তেল। রান্না, চুলের যত্ন ও ত্বকের যত্নে সমান কার্যকর।",
    ingredients: "১০০% কোল্ড-প্রেসড ভার্জিন নারকেল তেল",
    benefits: ["চুল ঘন করে", "ত্বক নরম রাখে", "রান্নায় স্বাস্থ্যকর", "মেটাবলিজম বাড়ায়"],
    usage: "চুলে বা ত্বকে সরাসরি ব্যবহার করুন। রান্নায় সাধারণ তেলের বিকল্প হিসেবেও ব্যবহার করা যায়।",
    images: [productCoconutOil, categoryOils],
    category: "oil",
    brand: "Herbal Homes",
    tags: ["তেল", "নারকেল", "ভার্জিন", "কোল্ড-প্রেসড"],
    badge: "ছাড়",
    variants: [
      { id: "p5-v1", label: "200ml", price: 380, oldPrice: 499, stock: 40, sku: "HH-OIL-COC-200" },
      { id: "p5-v2", label: "500ml", price: 700, oldPrice: 899, stock: 25, sku: "HH-OIL-COC-500" },
    ],
    reviews: genReviews(4),
    rating: 4.6,
    reviewCount: 98,
    relatedIds: ["p2", "p4"],
    faq: [
      { q: "এটা কি খাবার তেল হিসেবে ব্যবহার করা যাবে?", a: "হ্যাঁ, এটি ফুড-গ্রেড ভার্জিন নারকেল তেল।" },
    ],
    metaTitle: "ভার্জিন নারকেল তেল | Herbal Homes",
    metaDesc: "কোল্ড-প্রেসড ভার্জিন নারকেল তেল। চুল ও ত্বকের যত্নে আদর্শ। Herbal Homes।",
  },
  {
    id: "p6",
    slug: "charcoal-detox-soap",
    name: "চারকোল ডিটক্স সাবান",
    shortDesc: "অ্যাক্টিভেটেড চারকোল দিয়ে তৈরি ডিটক্স সাবান",
    description: "অ্যাক্টিভেটেড চারকোল ও টি ট্রি অয়েল দিয়ে তৈরি এই সাবান ত্বকের গভীর থেকে ময়লা ও টক্সিন পরিষ্কার করে। ব্রণ ও তৈলাক্ত ত্বকের জন্য বিশেষভাবে কার্যকর।",
    ingredients: "অ্যাক্টিভেটেড চারকোল, টি ট্রি অয়েল, অলিভ অয়েল, নারকেল তেল",
    benefits: ["গভীর পরিষ্কার", "ব্রণ দূর করে", "তৈলাক্ত ত্বক নিয়ন্ত্রণ", "ডিটক্সিফাই করে"],
    usage: "ভেজা মুখে বা শরীরে সাবান ঘষে ফেনা তৈরি করুন, ১ মিনিট রেখে ধুয়ে ফেলুন।",
    images: [productSoapCharcoal, categorySoap],
    category: "soap",
    brand: "Herbal Homes",
    tags: ["সাবান", "চারকোল", "ডিটক্স"],
    badge: "নতুন",
    variants: [
      { id: "p6-v1", label: "75g", price: 299, oldPrice: null, stock: 55, sku: "HH-SOAP-CHR-75" },
      { id: "p6-v2", label: "150g", price: 499, oldPrice: 599, stock: 30, sku: "HH-SOAP-CHR-150" },
    ],
    reviews: genReviews(3),
    rating: 4.8,
    reviewCount: 67,
    relatedIds: ["p1", "p3"],
    faq: [
      { q: "সেনসিটিভ ত্বকে ব্যবহার করা যাবে?", a: "প্রথমে একটু পরীক্ষা করে নিন। সাধারণত সব ত্বকে নিরাপদ।" },
    ],
    metaTitle: "চারকোল ডিটক্স সাবান | Herbal Homes",
    metaDesc: "অ্যাক্টিভেটেড চারকোল ডিটক্স সাবান। ব্রণ ও তৈলাক্ত ত্বকের সমাধান। Herbal Homes।",
  },
  {
    id: "p7",
    slug: "rosehip-face-serum",
    name: "রোজহিপ ফেস সিরাম",
    shortDesc: "অর্গানিক রোজহিপ অয়েল সমৃদ্ধ অ্যান্টি-এজিং সিরাম",
    description: "চিলি থেকে আনা বিশুদ্ধ রোজহিপ অয়েল দিয়ে তৈরি এই সিরাম ত্বকের বলিরেখা কমায়, দাগ দূর করে এবং ত্বককে তারুণ্যদীপ্ত করে তোলে।",
    ingredients: "রোজহিপ অয়েল, ভিটামিন সি, হায়ালুরনিক এসিড, জোজোবা অয়েল",
    benefits: ["বলিরেখা কমায়", "দাগ দূর করে", "ত্বক টান টান করে", "গভীর আর্দ্রতা"],
    usage: "রাতে ঘুমানোর আগে পরিষ্কার মুখে ২-৩ ফোঁটা সিরাম আলতো করে মাখুন।",
    images: [productRosehipSerum, categorySkincare],
    category: "skincare",
    brand: "Herbal Homes",
    tags: ["সিরাম", "রোজহিপ", "অ্যান্টি-এজিং", "স্কিনকেয়ার"],
    badge: "জনপ্রিয়",
    variants: [
      { id: "p7-v1", label: "30ml", price: 850, oldPrice: 1050, stock: 25, sku: "HH-SC-RH-30" },
      { id: "p7-v2", label: "50ml", price: 1350, oldPrice: 1650, stock: 15, sku: "HH-SC-RH-50" },
    ],
    reviews: genReviews(5),
    rating: 4.9,
    reviewCount: 142,
    relatedIds: ["p3", "p1"],
    faq: [
      { q: "ফলাফল কত দিনে পাওয়া যায়?", a: "সাধারণত ২-৩ সপ্তাহ নিয়মিত ব্যবহারে ফলাফল পাবেন।" },
    ],
    metaTitle: "রোজহিপ ফেস সিরাম | Herbal Homes",
    metaDesc: "অর্গানিক রোজহিপ অ্যান্টি-এজিং সিরাম। বলিরেখা কমায়, ত্বক উজ্জ্বল করে। Herbal Homes।",
  },
  {
    id: "p8",
    slug: "organic-chamomile-tea",
    name: "জৈব ক্যামোমিল চা",
    shortDesc: "মিশর থেকে আনা বিশুদ্ধ ক্যামোমিল ফুলের চা",
    description: "মিশর থেকে আমদানি করা বিশুদ্ধ ক্যামোমিল ফুল দিয়ে তৈরি এই চা ঘুমের মান উন্নত করে, স্ট্রেস কমায় এবং হজম শক্তি বাড়ায়।",
    ingredients: "১০০% বিশুদ্ধ জৈব ক্যামোমিল ফুল",
    benefits: ["ঘুমের মান উন্নত করে", "মানসিক চাপ কমায়", "হজম শক্তি বাড়ায়", "রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি"],
    usage: "১ চামচ চা ১ কাপ ফুটন্ত পানিতে ৫ মিনিট ভিজিয়ে ছেঁকে নিন। মধু দিয়ে পান করুন।",
    images: [productHerbalTea, categoryFood],
    category: "food",
    brand: "Herbal Homes",
    tags: ["চা", "ক্যামোমিল", "জৈব", "ভেষজ"],
    variants: [
      { id: "p8-v1", label: "50g", price: 350, oldPrice: null, stock: 45, sku: "HH-FOOD-CT-50" },
      { id: "p8-v2", label: "100g", price: 600, oldPrice: 700, stock: 30, sku: "HH-FOOD-CT-100" },
    ],
    reviews: genReviews(3),
    rating: 4.7,
    reviewCount: 73,
    relatedIds: ["p4", "p2"],
    faq: [
      { q: "দিনে কতবার খাওয়া যায়?", a: "দিনে ২-৩ কাপ পান করতে পারেন।" },
    ],
    metaTitle: "জৈব ক্যামোমিল চা | Herbal Homes",
    metaDesc: "মিশর থেকে আনা বিশুদ্ধ ক্যামোমিল ফুলের চা। ঘুমের মান উন্নত করে। Herbal Homes।",
  },
  {
    id: "p9",
    slug: "neem-soap",
    name: "নিম পাতার সাবান",
    shortDesc: "প্রাকৃতিক নিম পাতার নির্যাস দিয়ে তৈরি",
    description: "দেশীয় নিম পাতার নির্যাস ও হলুদ মিশিয়ে তৈরি এই সাবান ত্বকের ইনফেকশন, চুলকানি ও ব্রণ দূর করতে সাহায্য করে।",
    ingredients: "নিম পাতার নির্যাস, হলুদ, নারকেল তেল, অলিভ অয়েল",
    benefits: ["অ্যান্টি-ব্যাকটেরিয়াল", "ব্রণ দূর করে", "চুলকানি কমায়", "ত্বক পরিষ্কার রাখে"],
    usage: "প্রতিদিন গোসলের সময় ব্যবহার করুন। সমস্যাযুক্ত জায়গায় বেশি সময় রেখে ধুয়ে ফেলুন।",
    images: [categorySoap, productSoapLavender],
    category: "soap",
    brand: "Herbal Homes",
    tags: ["সাবান", "নিম", "অ্যান্টি-ব্যাকটেরিয়াল"],
    variants: [
      { id: "p9-v1", label: "75g", price: 199, oldPrice: null, stock: 70, sku: "HH-SOAP-NEM-75" },
      { id: "p9-v2", label: "150g", price: 350, oldPrice: 420, stock: 40, sku: "HH-SOAP-NEM-150" },
    ],
    reviews: genReviews(4),
    rating: 4.5,
    reviewCount: 91,
    relatedIds: ["p1", "p6"],
    faq: [],
    metaTitle: "নিম পাতার সাবান | Herbal Homes",
    metaDesc: "প্রাকৃতিক নিম পাতার সাবান। ব্রণ ও চুলকানি দূর করে। Herbal Homes।",
  },
  {
    id: "p10",
    slug: "turmeric-face-pack",
    name: "হলুদ ফেস প্যাক",
    shortDesc: "কাস্তুরী হলুদ ও মুলতানি মাটির ফেস প্যাক",
    description: "কাস্তুরী হলুদ, মুলতানি মাটি ও চন্দন গুঁড়া দিয়ে তৈরি এই ফেস প্যাক ত্বকের উজ্জ্বলতা বাড়ায়, দাগ দূর করে এবং ত্বককে মসৃণ করে।",
    ingredients: "কাস্তুরী হলুদ, মুলতানি মাটি, চন্দন গুঁড়া, গোলাপ জল",
    benefits: ["ত্বক উজ্জ্বল করে", "দাগ দূর করে", "ত্বক মসৃণ করে", "ব্রণ প্রতিরোধ করে"],
    usage: "পানি বা দুধ মিশিয়ে পেস্ট করুন, মুখে মেখে ১৫ মিনিট রেখে ধুয়ে ফেলুন। সপ্তাহে ২-৩ বার ব্যবহার করুন।",
    images: [categorySkincare, productFaceCream],
    category: "skincare",
    brand: "Herbal Homes",
    tags: ["স্কিনকেয়ার", "হলুদ", "ফেস প্যাক"],
    badge: "নতুন",
    variants: [
      { id: "p10-v1", label: "100g", price: 299, oldPrice: null, stock: 45, sku: "HH-SC-TUR-100" },
      { id: "p10-v2", label: "200g", price: 520, oldPrice: 599, stock: 25, sku: "HH-SC-TUR-200" },
    ],
    reviews: genReviews(3),
    rating: 4.6,
    reviewCount: 54,
    relatedIds: ["p3", "p7"],
    faq: [],
    metaTitle: "হলুদ ফেস প্যাক | Herbal Homes",
    metaDesc: "কাস্তুরী হলুদ ও মুলতানি মাটির প্রাকৃতিক ফেস প্যাক। ত্বক উজ্জ্বল করে। Herbal Homes।",
  },
  {
    id: "p11",
    slug: "mustard-oil-pure",
    name: "খাঁটি সরিষার তেল",
    shortDesc: "ঘানিভাঙা খাঁটি সরিষার তেল",
    description: "ঐতিহ্যবাহী ঘানি পদ্ধতিতে ভাঙা ১০০% খাঁটি সরিষার তেল। রান্নায় ও চুলের যত্নে অতুলনীয়।",
    ingredients: "১০০% ঘানিভাঙা সরিষার তেল",
    benefits: ["রান্নায় স্বাদ বাড়ায়", "চুলের গোড়া মজবুত করে", "রক্ত সঞ্চালন বাড়ায়", "অ্যান্টি-অক্সিডেন্ট"],
    usage: "রান্নায় সাধারণ তেলের মতো ব্যবহার করুন। চুলে ম্যাসাজ করে ১ ঘণ্টা রেখে ধুয়ে ফেলুন।",
    images: [categoryOils, productCoconutOil],
    category: "oil",
    brand: "Herbal Homes",
    tags: ["তেল", "সরিষা", "ঘানিভাঙা"],
    variants: [
      { id: "p11-v1", label: "500ml", price: 320, oldPrice: null, stock: 50, sku: "HH-OIL-MUS-500" },
      { id: "p11-v2", label: "1 লিটার", price: 580, oldPrice: 650, stock: 30, sku: "HH-OIL-MUS-1L" },
    ],
    reviews: genReviews(3),
    rating: 4.7,
    reviewCount: 82,
    relatedIds: ["p2", "p5"],
    faq: [],
    metaTitle: "খাঁটি সরিষার তেল | Herbal Homes",
    metaDesc: "ঘানিভাঙা ১০০% খাঁটি সরিষার তেল। Herbal Homes থেকে কিনুন।",
  },
  {
    id: "p12",
    slug: "organic-moringa-powder",
    name: "অর্গানিক মরিঙ্গা পাউডার",
    shortDesc: "সজনে পাতার গুঁড়া - সুপারফুড",
    description: "১০০% জৈব সজনে পাতার গুঁড়া। ৯০+ পুষ্টি উপাদান সমৃদ্ধ এই সুপারফুড শরীরের পুষ্টির ঘাটতি পূরণ করে।",
    ingredients: "১০০% জৈব মরিঙ্গা (সজনে) পাতার গুঁড়া",
    benefits: ["পুষ্টির ঘাটতি পূরণ", "রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি", "এনার্জি বাড়ায়", "প্রাকৃতিক ডিটক্স"],
    usage: "১ চামচ পাউডার পানি, জুস বা স্মুদিতে মিশিয়ে পান করুন।",
    images: [categoryFood, productHerbalTea],
    category: "food",
    brand: "Herbal Homes",
    tags: ["সুপারফুড", "মরিঙ্গা", "সজনে", "পাউডার"],
    variants: [
      { id: "p12-v1", label: "100g", price: 280, oldPrice: null, stock: 40, sku: "HH-FOOD-MOR-100" },
      { id: "p12-v2", label: "250g", price: 600, oldPrice: 700, stock: 20, sku: "HH-FOOD-MOR-250" },
    ],
    reviews: genReviews(3),
    rating: 4.5,
    reviewCount: 47,
    relatedIds: ["p4", "p8"],
    faq: [],
    metaTitle: "অর্গানিক মরিঙ্গা পাউডার | Herbal Homes",
    metaDesc: "১০০% জৈব সজনে পাতার গুঁড়া - সুপারফুড। Herbal Homes থেকে অর্ডার করুন।",
  },
  // ─── Additional Soap Products ──────────────────────────
  {
    id: "p13",
    slug: "tea-tree-soap",
    name: "টি ট্রি অয়েল সাবান",
    shortDesc: "অস্ট্রেলিয়ান টি ট্রি অয়েল সমৃদ্ধ অ্যান্টি-ব্যাকটেরিয়াল সাবান",
    description: "অস্ট্রেলিয়া থেকে আমদানি করা বিশুদ্ধ টি ট্রি অয়েল দিয়ে তৈরি এই সাবান ত্বকের ব্যাকটেরিয়া ও ফাঙ্গাস দূর করে। ব্রণ, দাদ ও চর্মরোগে কার্যকর।",
    ingredients: "টি ট্রি এসেনশিয়াল অয়েল, নারকেল তেল, অলিভ অয়েল, ভিটামিন ই",
    benefits: ["অ্যান্টি-ব্যাকটেরিয়াল", "ফাঙ্গাস দূর করে", "ব্রণ নিরাময়", "ত্বক সুরক্ষা"],
    usage: "ভেজা ত্বকে ফেনা তৈরি করে আলতো ম্যাসাজ করুন। ১-২ মিনিট রেখে ধুয়ে ফেলুন।",
    images: [productSoapCharcoal, categorySoap],
    category: "soap",
    brand: "Herbal Homes",
    tags: ["সাবান", "টি ট্রি", "অ্যান্টি-ব্যাকটেরিয়াল"],
    badge: "জনপ্রিয়",
    variants: [
      { id: "p13-v1", label: "75g", price: 280, oldPrice: 350, stock: 60, sku: "HH-SOAP-TT-75" },
      { id: "p13-v2", label: "150g", price: 480, oldPrice: 599, stock: 35, sku: "HH-SOAP-TT-150" },
    ],
    reviews: genReviews(5),
    rating: 4.7,
    reviewCount: 108,
    relatedIds: ["p1", "p6"],
    faq: [{ q: "এটা কি মুখে ব্যবহার করা যায়?", a: "হ্যাঁ, মুখ ও শরীর দুটোতেই ব্যবহার করা যায়।" }],
    metaTitle: "টি ট্রি অয়েল সাবান | Herbal Homes",
    metaDesc: "অস্ট্রেলিয়ান টি ট্রি অয়েল সাবান। অ্যান্টি-ব্যাকটেরিয়াল। Herbal Homes।",
  },
  {
    id: "p14",
    slug: "goat-milk-soap",
    name: "গোট মিল্ক সাবান",
    shortDesc: "ছাগলের দুধ ও মধু সমৃদ্ধ ময়েশ্চারাইজিং সাবান",
    description: "খাঁটি ছাগলের দুধ ও প্রাকৃতিক মধু দিয়ে তৈরি এই সাবান শুষ্ক ও সংবেদনশীল ত্বকের জন্য আদর্শ। ত্বককে নরম ও কোমল রাখে।",
    ingredients: "ছাগলের দুধ, মধু, শিয়া বাটার, অলিভ অয়েল, ওটমিল",
    benefits: ["গভীর ময়েশ্চারাইজিং", "শুষ্ক ত্বকে আরাম", "ত্বক নরম করে", "প্রাকৃতিক এক্সফোলিয়েশন"],
    usage: "ভেজা ত্বকে সাবান ঘষে ফেনা তৈরি করুন, আলতো মেসেজ করে ধুয়ে ফেলুন।",
    images: [categorySoap, productSoapLavender],
    category: "soap",
    brand: "Herbal Homes",
    tags: ["সাবান", "গোট মিল্ক", "ময়েশ্চারাইজিং"],
    variants: [
      { id: "p14-v1", label: "75g", price: 320, oldPrice: null, stock: 40, sku: "HH-SOAP-GM-75" },
      { id: "p14-v2", label: "150g", price: 550, oldPrice: 650, stock: 25, sku: "HH-SOAP-GM-150" },
    ],
    reviews: genReviews(4),
    rating: 4.6,
    reviewCount: 76,
    relatedIds: ["p1", "p9"],
    faq: [],
    metaTitle: "গোট মিল্ক সাবান | Herbal Homes",
    metaDesc: "ছাগলের দুধ ও মধু সমৃদ্ধ প্রাকৃতিক সাবান। Herbal Homes থেকে কিনুন।",
  },
  {
    id: "p15",
    slug: "turmeric-sandalwood-soap",
    name: "হলুদ-চন্দন সাবান",
    shortDesc: "কাস্তুরী হলুদ ও চন্দন কাঠের গুঁড়া দিয়ে তৈরি",
    description: "আয়ুর্বেদিক ফর্মুলায় তৈরি এই সাবান ত্বকের উজ্জ্বলতা বাড়ায় এবং দাগ দূর করে। বিয়ের আগে ত্বকের যত্নে বিশেষভাবে জনপ্রিয়।",
    ingredients: "কাস্তুরী হলুদ, চন্দন গুঁড়া, নারকেল তেল, গোলাপ জল",
    benefits: ["ত্বক উজ্জ্বল করে", "দাগ দূর করে", "অ্যান্টি-ইনফ্ল্যামেটরি", "প্রাকৃতিক গ্লো"],
    usage: "প্রতিদিন গোসলের সময় ব্যবহার করুন।",
    images: [productSoapLavender, categorySoap],
    category: "soap",
    brand: "Herbal Homes",
    tags: ["সাবান", "হলুদ", "চন্দন", "আয়ুর্বেদিক"],
    badge: "ছাড়",
    variants: [
      { id: "p15-v1", label: "75g", price: 230, oldPrice: 320, stock: 55, sku: "HH-SOAP-TS-75" },
      { id: "p15-v2", label: "150g", price: 399, oldPrice: 520, stock: 30, sku: "HH-SOAP-TS-150" },
    ],
    reviews: genReviews(4),
    rating: 4.5,
    reviewCount: 95,
    relatedIds: ["p9", "p6"],
    faq: [],
    metaTitle: "হলুদ-চন্দন সাবান | Herbal Homes",
    metaDesc: "কাস্তুরী হলুদ ও চন্দন কাঠের আয়ুর্বেদিক সাবান। Herbal Homes।",
  },
  // ─── Additional Oil Products ──────────────────────────
  {
    id: "p16",
    slug: "castor-oil-pure",
    name: "খাঁটি ক্যাস্টর অয়েল",
    shortDesc: "কোল্ড-প্রেসড ক্যাস্টর অয়েল - চুল ও ভ্রু ঘন করে",
    description: "১০০% বিশুদ্ধ কোল্ড-প্রেসড ক্যাস্টর অয়েল। চুল ঘন করতে, ভ্রু বাড়াতে এবং পাপড়ি লম্বা করতে অত্যন্ত কার্যকর।",
    ingredients: "১০০% কোল্ড-প্রেসড ক্যাস্টর অয়েল (Ricinus communis)",
    benefits: ["চুল ঘন করে", "ভ্রু বাড়ায়", "পাপড়ি লম্বা করে", "ত্বক নরম রাখে"],
    usage: "রাতে চুলের গোড়ায়, ভ্রুতে বা পাপড়িতে আলতো করে মাখুন। সকালে ধুয়ে ফেলুন।",
    images: [productBlackseedOil, categoryOils],
    category: "oil",
    brand: "Herbal Homes",
    tags: ["তেল", "ক্যাস্টর", "চুলের যত্ন"],
    badge: "নতুন",
    variants: [
      { id: "p16-v1", label: "100ml", price: 280, oldPrice: null, stock: 50, sku: "HH-OIL-CAS-100" },
      { id: "p16-v2", label: "250ml", price: 480, oldPrice: 580, stock: 30, sku: "HH-OIL-CAS-250" },
    ],
    reviews: genReviews(4),
    rating: 4.7,
    reviewCount: 112,
    relatedIds: ["p2", "p5"],
    faq: [{ q: "এটা কি খাওয়া যায়?", a: "এটি বাহ্যিক ব্যবহারের জন্য। খাওয়ার জন্য নয়।" }],
    metaTitle: "খাঁটি ক্যাস্টর অয়েল | Herbal Homes",
    metaDesc: "কোল্ড-প্রেসড ক্যাস্টর অয়েল। চুল ও ভ্রু ঘন করে। Herbal Homes।",
  },
  {
    id: "p17",
    slug: "olive-oil-extra-virgin",
    name: "এক্সট্রা ভার্জিন অলিভ অয়েল",
    shortDesc: "স্পেন থেকে আমদানি করা প্রিমিয়াম অলিভ অয়েল",
    description: "স্পেনের সেরা অলিভ বাগান থেকে সংগ্রহিত এক্সট্রা ভার্জিন অলিভ অয়েল। রান্না, ত্বকের যত্ন ও স্বাস্থ্যকর খাদ্যাভ্যাসের জন্য আদর্শ।",
    ingredients: "১০০% এক্সট্রা ভার্জিন অলিভ অয়েল",
    benefits: ["হার্টের জন্য উপকারী", "ত্বক উজ্জ্বল করে", "অ্যান্টি-অক্সিডেন্ট", "রান্নায় স্বাস্থ্যকর"],
    usage: "সালাদে, রান্নায় বা সরাসরি ত্বকে ব্যবহার করুন।",
    images: [categoryOils, productCoconutOil],
    category: "oil",
    brand: "Herbal Homes",
    tags: ["তেল", "অলিভ", "এক্সট্রা ভার্জিন", "আমদানি"],
    badge: "সেরা",
    variants: [
      { id: "p17-v1", label: "250ml", price: 650, oldPrice: null, stock: 35, sku: "HH-OIL-OLV-250" },
      { id: "p17-v2", label: "500ml", price: 1150, oldPrice: 1350, stock: 20, sku: "HH-OIL-OLV-500" },
    ],
    reviews: genReviews(5),
    rating: 4.8,
    reviewCount: 134,
    relatedIds: ["p5", "p11"],
    faq: [{ q: "রান্নায় ব্যবহার করা যাবে?", a: "হ্যাঁ, এটি রান্না ও সালাদ দুটোতেই ব্যবহারযোগ্য।" }],
    metaTitle: "এক্সট্রা ভার্জিন অলিভ অয়েল | Herbal Homes",
    metaDesc: "স্পেনের প্রিমিয়াম এক্সট্রা ভার্জিন অলিভ অয়েল। Herbal Homes।",
  },
  {
    id: "p18",
    slug: "argan-oil",
    name: "মরক্কান আরগান অয়েল",
    shortDesc: "মরক্কো থেকে আনা বিশুদ্ধ আরগান অয়েল",
    description: "মরক্কোর আরগান বাদাম থেকে কোল্ড-প্রেসড পদ্ধতিতে তৈরি এই তেল চুল ও ত্বকের জন্য তরল সোনা হিসেবে পরিচিত।",
    ingredients: "১০০% কোল্ড-প্রেসড আরগান অয়েল (Argania spinosa)",
    benefits: ["চুল সিল্কি করে", "ত্বকে গভীর পুষ্টি", "অ্যান্টি-এজিং", "নখ মজবুত করে"],
    usage: "চুলের আগায়, ত্বকে বা নখে কয়েক ফোঁটা মেখে ম্যাসাজ করুন।",
    images: [productCoconutOil, categoryOils],
    category: "oil",
    brand: "Herbal Homes",
    tags: ["তেল", "আরগান", "মরক্কো", "প্রিমিয়াম"],
    badge: "জনপ্রিয়",
    variants: [
      { id: "p18-v1", label: "30ml", price: 750, oldPrice: 950, stock: 20, sku: "HH-OIL-ARG-30" },
      { id: "p18-v2", label: "100ml", price: 1800, oldPrice: 2200, stock: 10, sku: "HH-OIL-ARG-100" },
    ],
    reviews: genReviews(4),
    rating: 4.9,
    reviewCount: 87,
    relatedIds: ["p2", "p16"],
    faq: [{ q: "এটা কি আসল মরক্কান?", a: "হ্যাঁ, সরাসরি মরক্কো থেকে আমদানি করা।" }],
    metaTitle: "মরক্কান আরগান অয়েল | Herbal Homes",
    metaDesc: "মরক্কো থেকে আনা বিশুদ্ধ আরগান অয়েল। চুল ও ত্বকের জন্য। Herbal Homes।",
  },
  // ─── Additional Skincare Products ──────────────────────
  {
    id: "p19",
    slug: "vitamin-c-serum",
    name: "ভিটামিন সি সিরাম",
    shortDesc: "২০% ভিটামিন সি সমৃদ্ধ ব্রাইটেনিং সিরাম",
    description: "২০% প্রাকৃতিক ভিটামিন সি ও হায়ালুরনিক এসিড সমৃদ্ধ এই সিরাম ত্বকের কালো দাগ দূর করে, উজ্জ্বলতা বাড়ায় এবং কোলাজেন উৎপাদন বৃদ্ধি করে।",
    ingredients: "ভিটামিন সি (L-Ascorbic Acid), হায়ালুরনিক এসিড, ভিটামিন ই, ফেরুলিক এসিড",
    benefits: ["কালো দাগ দূর করে", "ত্বক উজ্জ্বল করে", "কোলাজেন বাড়ায়", "সান ড্যামেজ রিপেয়ার"],
    usage: "সকালে পরিষ্কার মুখে ৩-৪ ফোঁটা সিরাম আলতো করে মাখুন, তারপর সানস্ক্রিন ব্যবহার করুন।",
    images: [productRosehipSerum, categorySkincare],
    category: "skincare",
    brand: "Herbal Homes",
    tags: ["সিরাম", "ভিটামিন সি", "ব্রাইটেনিং"],
    badge: "সেরা",
    variants: [
      { id: "p19-v1", label: "30ml", price: 750, oldPrice: 999, stock: 30, sku: "HH-SC-VC-30" },
      { id: "p19-v2", label: "50ml", price: 1200, oldPrice: 1500, stock: 18, sku: "HH-SC-VC-50" },
    ],
    reviews: genReviews(6),
    rating: 4.8,
    reviewCount: 189,
    relatedIds: ["p7", "p3"],
    faq: [{ q: "সকালে ব্যবহার করা যাবে?", a: "হ্যাঁ, তবে অবশ্যই সানস্ক্রিন ব্যবহার করুন।" }],
    metaTitle: "ভিটামিন সি সিরাম | Herbal Homes",
    metaDesc: "২০% ভিটামিন সি ব্রাইটেনিং সিরাম। কালো দাগ দূর করে। Herbal Homes।",
  },
  {
    id: "p20",
    slug: "natural-lip-balm",
    name: "প্রাকৃতিক লিপ বাম",
    shortDesc: "মোম, মধু ও শিয়া বাটার সমৃদ্ধ লিপ বাম",
    description: "মৌমাছির মোম, খাঁটি মধু ও শিয়া বাটার দিয়ে তৈরি এই লিপ বাম ঠোঁটকে নরম, মসৃণ ও আর্দ্র রাখে। ফাটা ঠোঁটের জন্য আদর্শ।",
    ingredients: "মৌমাছির মোম, মধু, শিয়া বাটার, নারকেল তেল, ভিটামিন ই",
    benefits: ["ঠোঁট নরম করে", "ফাটা ঠোঁট সারায়", "দীর্ঘস্থায়ী আর্দ্রতা", "প্রাকৃতিক সুরক্ষা"],
    usage: "প্রয়োজন অনুযায়ী ঠোঁটে লাগান। দিনে যতবার খুশি ব্যবহার করুন।",
    images: [categorySkincare, productFaceCream],
    category: "skincare",
    brand: "Herbal Homes",
    tags: ["লিপ বাম", "ঠোঁটের যত্ন", "প্রাকৃতিক"],
    variants: [
      { id: "p20-v1", label: "10g", price: 199, oldPrice: null, stock: 80, sku: "HH-SC-LB-10" },
      { id: "p20-v2", label: "15g", price: 280, oldPrice: 350, stock: 50, sku: "HH-SC-LB-15" },
    ],
    reviews: genReviews(4),
    rating: 4.6,
    reviewCount: 134,
    relatedIds: ["p3", "p10"],
    faq: [],
    metaTitle: "প্রাকৃতিক লিপ বাম | Herbal Homes",
    metaDesc: "মোম ও মধু সমৃদ্ধ প্রাকৃতিক লিপ বাম। Herbal Homes থেকে কিনুন।",
  },
  {
    id: "p21",
    slug: "charcoal-face-wash",
    name: "চারকোল ফেস ওয়াশ",
    shortDesc: "অ্যাক্টিভেটেড চারকোল ও স্যালিসাইলিক এসিড ফেস ওয়াশ",
    description: "অ্যাক্টিভেটেড চারকোল ও প্রাকৃতিক স্যালিসাইলিক এসিড দিয়ে তৈরি এই ফেস ওয়াশ ত্বকের অতিরিক্ত তেল নিয়ন্ত্রণ করে এবং পোর মিনিমাইজ করে।",
    ingredients: "অ্যাক্টিভেটেড চারকোল, স্যালিসাইলিক এসিড, টি ট্রি অয়েল, অ্যালোভেরা",
    benefits: ["তেল নিয়ন্ত্রণ", "পোর মিনিমাইজ", "গভীর পরিষ্কার", "ব্রণ প্রতিরোধ"],
    usage: "ভেজা মুখে অল্প পরিমাণ নিয়ে আলতো ম্যাসাজ করুন। পানি দিয়ে ধুয়ে ফেলুন।",
    images: [productFaceCream, categorySkincare],
    category: "skincare",
    brand: "Herbal Homes",
    tags: ["ফেস ওয়াশ", "চারকোল", "অয়েল কন্ট্রোল"],
    badge: "ছাড়",
    variants: [
      { id: "p21-v1", label: "100ml", price: 350, oldPrice: 450, stock: 45, sku: "HH-SC-CFW-100" },
      { id: "p21-v2", label: "200ml", price: 599, oldPrice: 750, stock: 25, sku: "HH-SC-CFW-200" },
    ],
    reviews: genReviews(5),
    rating: 4.7,
    reviewCount: 167,
    relatedIds: ["p6", "p10"],
    faq: [{ q: "শুষ্ক ত্বকে ব্যবহার করা যাবে?", a: "এটি তৈলাক্ত ও মিশ্র ত্বকের জন্য বেশি উপযুক্ত।" }],
    metaTitle: "চারকোল ফেস ওয়াশ | Herbal Homes",
    metaDesc: "অ্যাক্টিভেটেড চারকোল ফেস ওয়াশ। তেল নিয়ন্ত্রণ ও গভীর পরিষ্কার। Herbal Homes।",
  },
  // ─── Additional Food Products ──────────────────────────
  {
    id: "p22",
    slug: "organic-apple-cider-vinegar",
    name: "অর্গানিক অ্যাপেল সিডার ভিনেগার",
    shortDesc: "আনফিল্টারড, আনপাস্তুরাইজড অ্যাপেল সিডার ভিনেগার",
    description: "মাদার সহ ১০০% জৈব অ্যাপেল সিডার ভিনেগার। ওজন নিয়ন্ত্রণ, হজম শক্তি বৃদ্ধি এবং ত্বকের যত্নে অত্যন্ত কার্যকর।",
    ingredients: "১০০% জৈব আপেলের রস (আনফিল্টারড, আনপাস্তুরাইজড)",
    benefits: ["ওজন কমায়", "হজম শক্তি বাড়ায়", "ব্লাড সুগার নিয়ন্ত্রণ", "ত্বক পরিষ্কার করে"],
    usage: "১-২ চামচ পানিতে মিশিয়ে সকালে খালি পেটে পান করুন। সালাদ ড্রেসিংয়েও ব্যবহার করুন।",
    images: [categoryFood, productHoney],
    category: "food",
    brand: "Herbal Homes",
    tags: ["ভিনেগার", "অ্যাপেল সিডার", "জৈব", "ওজন কমানো"],
    badge: "জনপ্রিয়",
    variants: [
      { id: "p22-v1", label: "250ml", price: 450, oldPrice: null, stock: 40, sku: "HH-FOOD-ACV-250" },
      { id: "p22-v2", label: "500ml", price: 780, oldPrice: 900, stock: 25, sku: "HH-FOOD-ACV-500" },
    ],
    reviews: genReviews(5),
    rating: 4.8,
    reviewCount: 143,
    relatedIds: ["p4", "p12"],
    faq: [{ q: "সরাসরি খাওয়া যাবে?", a: "না, অবশ্যই পানিতে মিশিয়ে পান করুন।" }],
    metaTitle: "অর্গানিক অ্যাপেল সিডার ভিনেগার | Herbal Homes",
    metaDesc: "মাদার সহ জৈব অ্যাপেল সিডার ভিনেগার। ওজন কমায়। Herbal Homes।",
  },
  {
    id: "p23",
    slug: "organic-chia-seeds",
    name: "অর্গানিক চিয়া সিড",
    shortDesc: "পেরু থেকে আনা প্রিমিয়াম চিয়া সিড",
    description: "পেরু থেকে আমদানি করা ১০০% জৈব চিয়া সিড। ওমেগা-৩, ফাইবার ও প্রোটিন সমৃদ্ধ এই সুপারফুড ওজন কমাতে ও শক্তি বাড়াতে সাহায্য করে।",
    ingredients: "১০০% জৈব চিয়া সিড (Salvia hispanica)",
    benefits: ["ওমেগা-৩ সমৃদ্ধ", "ওজন নিয়ন্ত্রণ", "শক্তি বাড়ায়", "হাড় মজবুত করে"],
    usage: "পানি, দই বা স্মুদিতে ১-২ চামচ ভিজিয়ে ১৫ মিনিট রেখে খান।",
    images: [productHerbalTea, categoryFood],
    category: "food",
    brand: "Herbal Homes",
    tags: ["চিয়া সিড", "সুপারফুড", "ওমেগা-৩"],
    badge: "নতুন",
    variants: [
      { id: "p23-v1", label: "150g", price: 320, oldPrice: null, stock: 50, sku: "HH-FOOD-CHI-150" },
      { id: "p23-v2", label: "300g", price: 580, oldPrice: 680, stock: 30, sku: "HH-FOOD-CHI-300" },
    ],
    reviews: genReviews(3),
    rating: 4.6,
    reviewCount: 68,
    relatedIds: ["p12", "p8"],
    faq: [],
    metaTitle: "অর্গানিক চিয়া সিড | Herbal Homes",
    metaDesc: "পেরু থেকে আনা প্রিমিয়াম চিয়া সিড। সুপারফুড। Herbal Homes।",
  },
  {
    id: "p24",
    slug: "organic-green-tea",
    name: "অর্গানিক গ্রিন টি",
    shortDesc: "জাপানি সেনচা গ্রিন টি - অ্যান্টি-অক্সিডেন্ট সমৃদ্ধ",
    description: "জাপান থেকে আমদানি করা প্রিমিয়াম সেনচা গ্রিন টি। ক্যাটেচিন ও অ্যান্টি-অক্সিডেন্ট সমৃদ্ধ এই চা ওজন কমাতে ও মস্তিষ্কের কার্যক্ষমতা বাড়াতে সাহায্য করে।",
    ingredients: "১০০% জৈব জাপানি সেনচা গ্রিন টি পাতা",
    benefits: ["ওজন কমায়", "মস্তিষ্কের কার্যক্ষমতা বাড়ায়", "অ্যান্টি-অক্সিডেন্ট", "হার্টের জন্য উপকারী"],
    usage: "১ চামচ চা পাতা ৮০°C পানিতে ২-৩ মিনিট ভিজিয়ে ছেঁকে পান করুন।",
    images: [productHerbalTea, categoryFood],
    category: "food",
    brand: "Herbal Homes",
    tags: ["চা", "গ্রিন টি", "জাপানি", "অ্যান্টি-অক্সিডেন্ট"],
    badge: "সেরা",
    variants: [
      { id: "p24-v1", label: "50g", price: 420, oldPrice: null, stock: 35, sku: "HH-FOOD-GT-50" },
      { id: "p24-v2", label: "100g", price: 750, oldPrice: 880, stock: 20, sku: "HH-FOOD-GT-100" },
    ],
    reviews: genReviews(4),
    rating: 4.7,
    reviewCount: 96,
    relatedIds: ["p8", "p4"],
    faq: [{ q: "ক্যাফেইন আছে?", a: "হ্যাঁ, তবে কফির তুলনায় অনেক কম।" }],
    metaTitle: "অর্গানিক গ্রিন টি | Herbal Homes",
    metaDesc: "জাপানি সেনচা গ্রিন টি। অ্যান্টি-অক্সিডেন্ট সমৃদ্ধ। Herbal Homes।",
  },
  {
    id: "p25",
    slug: "mixed-dry-fruits",
    name: "মিক্সড ড্রাই ফ্রুটস",
    shortDesc: "প্রিমিয়াম ড্রাই ফ্রুটস মিক্স - বাদাম, কাজু, কিশমিশ",
    description: "কাঠবাদাম, কাজুবাদাম, আখরোট, কিশমিশ ও খেজুরের প্রিমিয়াম মিক্স। প্রতিদিনের পুষ্টির চাহিদা পূরণে আদর্শ স্ন্যাক।",
    ingredients: "কাঠবাদাম, কাজুবাদাম, আখরোট, কিশমিশ, খেজুর",
    benefits: ["পুষ্টি সমৃদ্ধ", "শক্তি যোগায়", "মস্তিষ্কের কার্যক্ষমতা বাড়ায়", "হাড় মজবুত করে"],
    usage: "প্রতিদিন এক মুঠো (30g) খান। সকালের নাস্তা বা বিকেলের স্ন্যাক হিসেবে আদর্শ।",
    images: [categoryFood, productHoney],
    category: "food",
    brand: "Herbal Homes",
    tags: ["ড্রাই ফ্রুটস", "বাদাম", "স্ন্যাক", "পুষ্টি"],
    variants: [
      { id: "p25-v1", label: "250g", price: 550, oldPrice: null, stock: 40, sku: "HH-FOOD-DF-250" },
      { id: "p25-v2", label: "500g", price: 999, oldPrice: 1150, stock: 20, sku: "HH-FOOD-DF-500" },
      { id: "p25-v3", label: "1kg", price: 1800, oldPrice: 2100, stock: 10, sku: "HH-FOOD-DF-1K" },
    ],
    reviews: genReviews(4),
    rating: 4.8,
    reviewCount: 115,
    relatedIds: ["p4", "p23"],
    faq: [],
    metaTitle: "মিক্সড ড্রাই ফ্রুটস | Herbal Homes",
    metaDesc: "প্রিমিয়াম ড্রাই ফ্রুটস মিক্স। বাদাম, কাজু, কিশমিশ। Herbal Homes।",
  },
];

export const shippingMethods: ShippingMethod[] = [
  { id: "standard-dhaka", name: "ঢাকার ভিতরে (স্ট্যান্ডার্ড)", cost: 60, estimatedDays: "১-২ দিন" },
  { id: "express-dhaka", name: "ঢাকার ভিতরে (এক্সপ্রেস)", cost: 100, estimatedDays: "একই দিন" },
  { id: "standard-outside", name: "ঢাকার বাইরে (স্ট্যান্ডার্ড)", cost: 120, estimatedDays: "৩-৫ দিন" },
  { id: "express-outside", name: "ঢাকার বাইরে (এক্সপ্রেস)", cost: 180, estimatedDays: "১-২ দিন" },
];

export const coupons: CouponRule[] = [
  { code: "WELCOME10", type: "percentage", value: 10, minSpend: 500, maxUses: 1000, usedCount: 234, perUserLimit: 1, expiresAt: "2026-12-31", active: true },
  { code: "SAVE50", type: "fixed", value: 50, minSpend: 300, maxUses: 500, usedCount: 120, perUserLimit: 2, expiresAt: "2026-06-30", active: true },
  { code: "FREESHIP", type: "free_shipping", value: 0, minSpend: 1000, maxUses: 200, usedCount: 55, perUserLimit: 3, expiresAt: "2026-12-31", active: true },
];

export const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug);
export const getProductById = (id: string) => products.find((p) => p.id === id);
export const getProductsByCategory = (cat: string) => products.filter((p) => p.category === cat);
export const getRelatedProducts = (product: Product) => product.relatedIds.map(getProductById).filter(Boolean) as Product[];
