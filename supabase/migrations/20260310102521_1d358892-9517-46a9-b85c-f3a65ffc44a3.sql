
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
