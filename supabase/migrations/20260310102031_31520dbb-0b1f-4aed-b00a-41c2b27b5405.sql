
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
