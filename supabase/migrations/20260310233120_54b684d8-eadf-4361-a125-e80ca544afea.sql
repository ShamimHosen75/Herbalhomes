
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
