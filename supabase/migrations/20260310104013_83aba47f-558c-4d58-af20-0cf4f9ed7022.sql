
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
