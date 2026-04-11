-- Migration: 20260310102031_31520dbb-0b1f-4aed-b00a-41c2b27b5405.sql

-- Categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  short_desc TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  ingredients TEXT NOT NULL DEFAULT '',
  benefits TEXT[] NOT NULL DEFAULT '{}',
  usage_info TEXT NOT NULL DEFAULT '',
  images TEXT[] NOT NULL DEFAULT '{}',
  category TEXT NOT NULL DEFAULT '',
  subcategory TEXT,
  brand TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  badge TEXT,
  rating NUMERIC NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  related_ids TEXT[] NOT NULL DEFAULT '{}',
  faq JSONB NOT NULL DEFAULT '[]',
  meta_title TEXT NOT NULL DEFAULT '',
  meta_desc TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Product variants table
CREATE TABLE public.product_variants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  label TEXT NOT NULL DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  old_price NUMERIC,
  stock INTEGER NOT NULL DEFAULT 0,
  sku TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Product reviews table
CREATE TABLE public.product_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  author TEXT NOT NULL DEFAULT '',
  rating INTEGER NOT NULL DEFAULT 5,
  comment TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL DEFAULT '',
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Orders table
CREATE TABLE public.orders (
  id TEXT NOT NULL PRIMARY KEY,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  discount NUMERIC NOT NULL DEFAULT 0,
  shipping_cost NUMERIC NOT NULL DEFAULT 0,
  cod_fee NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  coupon_code TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT NOT NULL DEFAULT 'cod',
  shipping_method TEXT NOT NULL DEFAULT '',
  tracking_number TEXT,
  courier_name TEXT,
  address JSONB NOT NULL DEFAULT '{}',
  customer_name TEXT NOT NULL DEFAULT '',
  customer_phone TEXT NOT NULL DEFAULT '',
  customer_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Order items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id TEXT NOT NULL DEFAULT '',
  variant_id TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL DEFAULT '',
  variant_label TEXT NOT NULL DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  quantity INTEGER NOT NULL DEFAULT 1,
  image TEXT NOT NULL DEFAULT ''
);

-- Order status history table
CREATE TABLE public.order_status_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT '',
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables (public read, no auth required for this store)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

-- Public read policies for storefront
CREATE POLICY "Public read categories" ON public.categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read products" ON public.products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read variants" ON public.product_variants FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read reviews" ON public.product_reviews FOR SELECT TO anon, authenticated USING (true);

-- Public insert/update for orders (customers place orders without auth)
CREATE POLICY "Public read orders" ON public.orders FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public update orders" ON public.orders FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read order_items" ON public.order_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public insert order_items" ON public.order_items FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Public read order_status_history" ON public.order_status_history FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public insert order_status_history" ON public.order_status_history FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Admin write policies (public for now, should be restricted with auth later)
CREATE POLICY "Public manage categories" ON public.categories FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public manage products" ON public.products FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public manage variants" ON public.product_variants FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public manage reviews" ON public.product_reviews FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);


-- Migration: 20260310102347_ea08ceb8-035e-4a11-aab7-90f699936ad9.sql

-- Drop foreign keys first
ALTER TABLE public.product_variants DROP CONSTRAINT product_variants_product_id_fkey;
ALTER TABLE public.product_reviews DROP CONSTRAINT product_reviews_product_id_fkey;

-- Change products.id from UUID to TEXT
ALTER TABLE public.products ALTER COLUMN id SET DATA TYPE TEXT;
ALTER TABLE public.product_variants ALTER COLUMN product_id SET DATA TYPE TEXT;
ALTER TABLE public.product_variants ALTER COLUMN id SET DATA TYPE TEXT;
ALTER TABLE public.product_reviews ALTER COLUMN product_id SET DATA TYPE TEXT;
ALTER TABLE public.categories ALTER COLUMN id SET DATA TYPE TEXT;

-- Re-add foreign keys
ALTER TABLE public.product_variants ADD CONSTRAINT product_variants_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
ALTER TABLE public.product_reviews ADD CONSTRAINT product_reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


-- Migration: 20260310102521_1d358892-9517-46a9-b85c-f3a65ffc44a3.sql

CREATE TABLE public.checkout_leads (
  id TEXT NOT NULL PRIMARY KEY,
  customer_name TEXT NOT NULL DEFAULT '',
  customer_phone TEXT NOT NULL DEFAULT '',
  items JSONB NOT NULL DEFAULT '[]',
  items_count INTEGER NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'new',
  address TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.checkout_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read checkout_leads" ON public.checkout_leads FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public insert checkout_leads" ON public.checkout_leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public update checkout_leads" ON public.checkout_leads FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public delete checkout_leads" ON public.checkout_leads FOR DELETE TO anon, authenticated USING (true);


-- Migration: 20260310102805_138d9cc2-3280-4825-b27f-9d8fe9171306.sql

CREATE TABLE public.sliders (
  id TEXT NOT NULL PRIMARY KEY,
  image_url TEXT NOT NULL DEFAULT '',
  heading TEXT NOT NULL DEFAULT '',
  text TEXT NOT NULL DEFAULT '',
  cta_text TEXT NOT NULL DEFAULT 'Shop Now',
  cta_link TEXT NOT NULL DEFAULT '/shop',
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.sliders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read sliders" ON public.sliders FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public manage sliders" ON public.sliders FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);


-- Migration: 20260310102826_6d854d35-f899-45cc-b8bf-0a7f7cba5959.sql

INSERT INTO storage.buckets (id, name, public) VALUES ('slider-images', 'slider-images', true);

CREATE POLICY "Public read slider images" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'slider-images');
CREATE POLICY "Public upload slider images" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'slider-images');
CREATE POLICY "Public delete slider images" ON storage.objects FOR DELETE TO anon, authenticated USING (bucket_id = 'slider-images');


-- Migration: 20260310103050_4eb36302-86ea-4ea9-a733-cdd6a4d788d8.sql

CREATE TABLE public.coupons (
  id TEXT NOT NULL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'percentage',
  value NUMERIC NOT NULL DEFAULT 0,
  min_order NUMERIC NOT NULL DEFAULT 0,
  max_uses INTEGER,
  used_count INTEGER NOT NULL DEFAULT 0,
  expires_at DATE,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read coupons" ON public.coupons FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public manage coupons" ON public.coupons FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);


-- Migration: 20260310103556_89bf09ee-53a9-42c6-8a91-10c94e4a5a33.sql

CREATE TABLE public.shipping_zones (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  cities TEXT NOT NULL DEFAULT '',
  rate NUMERIC NOT NULL DEFAULT 0,
  delivery_time TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.shipping_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read shipping_zones" ON public.shipping_zones FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public manage shipping_zones" ON public.shipping_zones FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);


-- Migration: 20260310103728_784a2010-5540-4eae-a31d-96614be70576.sql

CREATE TABLE public.shipping_methods (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  base_rate NUMERIC NOT NULL DEFAULT 0,
  estimated_days TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.shipping_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read shipping_methods" ON public.shipping_methods FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public manage shipping_methods" ON public.shipping_methods FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);


-- Migration: 20260310103853_61723f03-bfe5-4847-b40b-76dd8da3c299.sql

ALTER TABLE public.product_reviews ADD COLUMN IF NOT EXISTS approved BOOLEAN NOT NULL DEFAULT false;


-- Migration: 20260310104013_83aba47f-558c-4d58-af20-0cf4f9ed7022.sql

CREATE TABLE public.courier_settings (
  id TEXT NOT NULL PRIMARY KEY DEFAULT 'steadfast',
  enabled BOOLEAN NOT NULL DEFAULT false,
  api_base_url TEXT NOT NULL DEFAULT 'https://portal.packzy.com/api/v1',
  api_key TEXT NOT NULL DEFAULT '',
  api_secret TEXT NOT NULL DEFAULT '',
  merchant_id TEXT NOT NULL DEFAULT '',
  pickup_address TEXT NOT NULL DEFAULT '',
  pickup_phone TEXT NOT NULL DEFAULT '',
  default_weight NUMERIC NOT NULL DEFAULT 0.5,
  enable_cod BOOLEAN NOT NULL DEFAULT true,
  show_tracking BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.courier_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read courier_settings" ON public.courier_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public manage courier_settings" ON public.courier_settings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);


-- Migration: 20260310104126_6a4af26f-f6e1-4ee5-9b4b-ce652d62817f.sql

CREATE TABLE public.payment_methods (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  instructions TEXT NOT NULL DEFAULT '',
  enabled BOOLEAN NOT NULL DEFAULT true,
  require_transaction_id BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  partial_delivery BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read payment_methods" ON public.payment_methods FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public manage payment_methods" ON public.payment_methods FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);


-- Migration: 20260310221026_b86096ae-4edf-4b49-94b3-b9f31b258a56.sql
CREATE TABLE public.site_settings (
  key TEXT NOT NULL PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public manage site_settings" ON public.site_settings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Insert default settings
INSERT INTO public.site_settings (key, value) VALUES
('store_name', 'Herbal Homes'),
('phone', '01XXXXXXXXX'),
('email', 'info@herbalhomes.com'),
('address', 'ঢাকা, বাংলাদেশ'),
('whatsapp', '8801XXXXXXXXX'),
('facebook', ''),
('instagram', ''),
('youtube', ''),
('logo', ''),
('currency', '৳'),
('meta_title', 'Herbal Homes - প্রাকৃতিক ও জৈব পণ্য'),
('meta_description', 'প্রাকৃতিক ও জৈব পণ্যের বিশ্বস্ত অনলাইন শপ');

-- Migration: 20260310221156_2f07867d-8f1d-4dec-ab81-7de2894e203f.sql
ALTER TABLE public.orders ADD COLUMN transaction_id TEXT DEFAULT NULL;

-- Migration: 20260310232748_3db326c5-ea78-4046-85ba-53e1fca2ad9c.sql

CREATE TABLE public.landing_pages (
  id text NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  active boolean NOT NULL DEFAULT true,
  hero_title text NOT NULL DEFAULT '',
  hero_subtitle text NOT NULL DEFAULT '',
  hero_image text NOT NULL DEFAULT '',
  cta_text text NOT NULL DEFAULT 'Order Now',
  product_ids text[] NOT NULL DEFAULT '{}',
  cards jsonb NOT NULL DEFAULT '[]',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read landing_pages" ON public.landing_pages
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public manage landing_pages" ON public.landing_pages
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);


-- Migration: 20260310233120_54b684d8-eadf-4361-a125-e80ca544afea.sql

CREATE TABLE public.homepage_sections (
  id text NOT NULL PRIMARY KEY,
  section_type text NOT NULL,
  title text NOT NULL DEFAULT '',
  subtitle text NOT NULL DEFAULT '',
  layout text NOT NULL DEFAULT 'grid',
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read homepage_sections" ON public.homepage_sections
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public manage homepage_sections" ON public.homepage_sections
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Seed default sections matching current homepage
INSERT INTO public.homepage_sections (id, section_type, title, subtitle, sort_order, active) VALUES
  ('sec-hero', 'hero_slider', 'Hero Slider', '', 1, true),
  ('sec-categories', 'featured_categories', 'Featured Categories', '', 2, true),
  ('sec-bestsellers', 'best_sellers', 'Best Sellers', '', 3, true),
  ('sec-whychoose', 'why_choose_us', 'Why Choose Us', '', 4, true),
  ('sec-offer', 'offer_banner', 'Offer Banner', '', 5, true),
  ('sec-testimonials', 'customer_reviews', 'Customer Reviews', '', 6, true),
  ('sec-contact', 'contact', 'Contact', '', 7, true);


-- Migration: 20260310233330_25eb18d4-2e49-4523-987f-05b143296cbd.sql

CREATE TABLE public.staff_users (
  id text NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL DEFAULT '',
  email text NOT NULL UNIQUE,
  password text NOT NULL,
  role text NOT NULL DEFAULT 'admin',
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.staff_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read staff_users" ON public.staff_users
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public manage staff_users" ON public.staff_users
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Seed default admin user
INSERT INTO public.staff_users (id, name, email, password, role, active) VALUES
  ('admin-default', 'Admin', 'admin@store.com', 'admin123', 'admin', true);


-- Migration: 20260311051532_8c248a14-1814-49ba-81d1-435388864668.sql

-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  avatar_url text NOT NULL DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Create role enum and user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create has_role function BEFORE policies that use it
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- Migration: 20260311073903_0fbac50e-4797-4f61-8918-2330c4e95725.sql
ALTER TABLE public.homepage_sections ADD COLUMN IF NOT EXISTS content jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Migration: 20260311074923_7c4f268d-11d9-4fbf-891c-fbf0cdead4e2.sql
CREATE TABLE public.page_contents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text NOT NULL UNIQUE,
  title text NOT NULL DEFAULT '',
  subtitle text NOT NULL DEFAULT '',
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.page_contents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read page_contents" ON public.page_contents FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public manage page_contents" ON public.page_contents FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Seed default content for about and contact pages
INSERT INTO public.page_contents (page_key, title, subtitle, content) VALUES
('about', 'আমাদের সম্পর্কে', 'হার্বাল হোমসের গল্প', '{
  "story_title": "আমাদের যাত্রা",
  "story_paragraphs": [
    "হার্বাল হোমস বাংলাদেশের একটি বিশ্বস্ত অর্গানিক ব্র্যান্ড যেখানে আমরা ১০০% প্রাকৃতিক ও রাসায়নিকমুক্ত পণ্য সরবরাহ করি। আমাদের লক্ষ্য হলো প্রতিটি পরিবারে বিশুদ্ধ ও স্বাস্থ্যকর পণ্য পৌঁছে দেওয়া।",
    "আমরা বিশ্বাস করি যে প্রকৃতির কাছেই সেরা সমাধান লুকিয়ে আছে। তাই আমাদের প্রতিটি পণ্য প্রকৃতি থেকে সংগ্রহিত উপাদান দিয়ে তৈরি, কোনো ক্ষতিকর রাসায়নিক ছাড়াই।",
    "আমাদের পণ্যগুলো শুধু আপনার জন্য নয়, পরিবেশের জন্যও নিরাপদ। আমরা পরিবেশবান্ধব প্যাকেজিং ব্যবহার করি এবং টেকসই উৎপাদন পদ্ধতি অনুসরণ করি।"
  ],
  "values_title": "আমাদের মূল্যবোধ",
  "values": [
    {"title": "১০০% প্রাকৃতিক", "desc": "সকল পণ্য প্রত্যয়িত জৈব উপাদান দিয়ে তৈরি।", "icon": "Leaf"},
    {"title": "নিরাপদ ও বিশ্বস্ত", "desc": "প্যারাবেন, সালফেট ও কৃত্রিম রং মুক্ত।", "icon": "ShieldCheck"},
    {"title": "পরিবেশবান্ধব", "desc": "বায়োডিগ্রেডেবল ও রিসাইক্লেবল প্যাকেজিং।", "icon": "Recycle"},
    {"title": "ভালোবাসায় তৈরি", "desc": "প্রতিটি পণ্য যত্ন ও ভালোবাসায় হাতে তৈরি।", "icon": "Heart"},
    {"title": "গ্রাহক সন্তুষ্টি", "desc": "৫০,০০০+ সন্তুষ্ট গ্রাহকের বিশ্বাস।", "icon": "Users"},
    {"title": "প্রিমিয়াম মান", "desc": "সেরা মানের উপাদান ব্যবহারে আপোষহীন।", "icon": "Award"}
  ],
  "stats": [
    {"number": "৫০,০০০+", "label": "সন্তুষ্ট গ্রাহক"},
    {"number": "১০০+", "label": "জৈব পণ্য"},
    {"number": "৬৪", "label": "জেলায় ডেলিভারি"},
    {"number": "৪.৯/৫", "label": "গড় রেটিং"}
  ]
}'::jsonb),
('contact', 'যোগাযোগ করুন', 'আমরা সবসময় আপনার পাশে আছি', '{
  "phone": "০১৭১২-৩৪৫৬৭৮",
  "phone_raw": "+8801712345678",
  "email": "hello@herbalhomes.com",
  "address": "ঢাকা, বাংলাদেশ",
  "hours": "শনি - বৃহস্পতি, সকাল ৯টা - সন্ধ্যা ৬টা",
  "whatsapp": "8801712345678",
  "facebook": "https://m.me/herbalhomes"
}'::jsonb),
('navbar', 'Navigation', '', '{
  "links": [
    {"label": "হোমপেজ", "href": "/"},
    {"label": "পণ্য সমূহ", "href": "/shop"},
    {"label": "ক্যাটাগরি", "href": "/categories"},
    {"label": "আমাদের সম্পর্কে", "href": "/about"},
    {"label": "যোগাযোগ", "href": "/contact"}
  ],
  "cta_text": "যোগাযোগ",
  "cta_link": "/contact"
}'::jsonb);

-- Migration: 20260311080124_a176dfed-22d5-44a7-8bf7-886f9250ec3d.sql
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read product images" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'product-images');
CREATE POLICY "Public upload product images" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Public delete product images" ON storage.objects FOR DELETE TO anon, authenticated USING (bucket_id = 'product-images');

-- Migration: 20260311093135_6d16bb52-5d48-4284-89e8-b18062a9e039.sql
ALTER TABLE public.product_reviews ADD COLUMN IF NOT EXISTS image text NOT NULL DEFAULT '';

INSERT INTO storage.buckets (id, name, public) VALUES ('review-images', 'review-images', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read review images" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'review-images');
CREATE POLICY "Public upload review images" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'review-images');
CREATE POLICY "Public delete review images" ON storage.objects FOR DELETE TO anon, authenticated USING (bucket_id = 'review-images');

-- Migration: 20260311093608_cc60add3-f212-400b-a890-c48bea807670.sql
ALTER TABLE public.sliders ADD COLUMN IF NOT EXISTS banner_url text NOT NULL DEFAULT '';
ALTER TABLE public.sliders ADD COLUMN IF NOT EXISTS layout text NOT NULL DEFAULT 'card';

-- Migration: 20260311094435_fe0d4319-0082-493f-9341-7ef70a8186f2.sql

INSERT INTO storage.buckets (id, name, public) VALUES ('category-images', 'category-images', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read category-images" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'category-images');
CREATE POLICY "Public upload category-images" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'category-images');
CREATE POLICY "Public update category-images" ON storage.objects FOR UPDATE TO anon, authenticated USING (bucket_id = 'category-images');
CREATE POLICY "Public delete category-images" ON storage.objects FOR DELETE TO anon, authenticated USING (bucket_id = 'category-images');


-- Migration: 20260311101633_7e7463aa-f668-4f23-87d4-87ff9d68b4da.sql

-- Create BSTI certificates table
CREATE TABLE public.bsti_certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bsti_certificates ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Public read bsti_certificates" ON public.bsti_certificates
  FOR SELECT TO anon, authenticated USING (true);

-- Public manage policy
CREATE POLICY "Public manage bsti_certificates" ON public.bsti_certificates
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Create storage bucket for certificate images
INSERT INTO storage.buckets (id, name, public) VALUES ('bsti-certificates', 'bsti-certificates', true);

-- Storage RLS policies
CREATE POLICY "Public read bsti certificate files" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'bsti-certificates');

CREATE POLICY "Public upload bsti certificate files" ON storage.objects
  FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'bsti-certificates');

CREATE POLICY "Public update bsti certificate files" ON storage.objects
  FOR UPDATE TO anon, authenticated USING (bucket_id = 'bsti-certificates');

CREATE POLICY "Public delete bsti certificate files" ON storage.objects
  FOR DELETE TO anon, authenticated USING (bucket_id = 'bsti-certificates');


-- Migration: 20260401070550_1feeffef-ff73-4851-88ad-1454a4ceed31.sql
UPDATE homepage_sections SET sort_order = 8 WHERE section_type = 'best_sellers';
UPDATE homepage_sections SET sort_order = 2 WHERE section_type = 'all_products';
UPDATE homepage_sections SET sort_order = 3 WHERE section_type = 'featured_categories';
UPDATE homepage_sections SET sort_order = 4 WHERE section_type = 'why_choose_us';
UPDATE homepage_sections SET sort_order = 5 WHERE section_type = 'offer_banner';
UPDATE homepage_sections SET sort_order = 6 WHERE section_type = 'customer_reviews';
UPDATE homepage_sections SET sort_order = 7 WHERE section_type = 'contact';

-- Migration: 20260401073654_31c24431-4e38-46fb-a310-0c040d762f5d.sql
DELETE FROM bsti_certificates WHERE id = 'd42f630b-e3ac-4dc2-80e6-04305ede6943';

-- Migration: 20260401102934_54506890-f3ca-456c-a8a2-99e0d1ac8ba5.sql
ALTER TABLE public.sliders ADD COLUMN images text[] NOT NULL DEFAULT '{}'::text[];

-- Migration: 20260402115728_f53028dc-e152-4d9b-b015-31e6f5a22c32.sql

CREATE TABLE public.customer_video_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL DEFAULT '',
  video_url TEXT NOT NULL DEFAULT '',
  thumbnail_url TEXT NOT NULL DEFAULT '',
  rating INTEGER NOT NULL DEFAULT 5,
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.customer_video_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active customer video reviews"
ON public.customer_video_reviews
FOR SELECT
USING (true);

CREATE POLICY "Staff can manage customer video reviews"
ON public.customer_video_reviews
FOR ALL
USING (true)
WITH CHECK (true);


-- Migration: 20260402120028_bff7c7ae-cb88-4281-a9e0-e6a3356fec2b.sql

ALTER TABLE public.categories ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;


-- Migration: 20260402120703_30fc2bc2-c56e-4bb3-9fd1-43202fd64eee.sql
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Migration: 20260404210537_18fc22f8-534b-4f46-9587-4de1fdfc516e.sql
UPDATE page_contents SET content = jsonb_set(content, '{email}', '"info.herbalhomes26@gmail.com"'), updated_at = now() WHERE page_key = 'contact';

-- Migration: 20260408065611_c4490aab-bc68-48cc-98e8-5b56b50fe072.sql
ALTER TABLE public.products ADD COLUMN sort_order integer NOT NULL DEFAULT 0;

