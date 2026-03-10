
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
