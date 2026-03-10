
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
