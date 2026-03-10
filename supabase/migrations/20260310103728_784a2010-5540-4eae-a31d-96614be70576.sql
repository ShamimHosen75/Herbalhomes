
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
