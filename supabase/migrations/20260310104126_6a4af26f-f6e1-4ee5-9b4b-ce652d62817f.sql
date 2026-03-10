
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
