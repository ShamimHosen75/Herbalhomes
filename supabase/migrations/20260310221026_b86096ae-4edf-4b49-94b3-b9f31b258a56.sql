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