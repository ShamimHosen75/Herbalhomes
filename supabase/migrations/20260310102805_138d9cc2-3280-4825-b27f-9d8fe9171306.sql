
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
