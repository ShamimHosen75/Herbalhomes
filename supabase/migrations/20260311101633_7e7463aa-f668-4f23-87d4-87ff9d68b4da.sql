
-- Create BSTI certificates table
CREATE TABLE public.bsti_certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bsti_certificates ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Public read bsti_certificates" ON public.bsti_certificates
  FOR SELECT TO anon, authenticated USING (true);

-- Public manage policy
CREATE POLICY "Public manage bsti_certificates" ON public.bsti_certificates
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Create storage bucket for certificate images
INSERT INTO storage.buckets (id, name, public) VALUES ('bsti-certificates', 'bsti-certificates', true);

-- Storage RLS policies
CREATE POLICY "Public read bsti certificate files" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'bsti-certificates');

CREATE POLICY "Public upload bsti certificate files" ON storage.objects
  FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'bsti-certificates');

CREATE POLICY "Public update bsti certificate files" ON storage.objects
  FOR UPDATE TO anon, authenticated USING (bucket_id = 'bsti-certificates');

CREATE POLICY "Public delete bsti certificate files" ON storage.objects
  FOR DELETE TO anon, authenticated USING (bucket_id = 'bsti-certificates');
