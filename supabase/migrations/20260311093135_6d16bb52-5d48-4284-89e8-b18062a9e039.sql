ALTER TABLE public.product_reviews ADD COLUMN IF NOT EXISTS image text NOT NULL DEFAULT '';

INSERT INTO storage.buckets (id, name, public) VALUES ('review-images', 'review-images', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read review images" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'review-images');
CREATE POLICY "Public upload review images" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'review-images');
CREATE POLICY "Public delete review images" ON storage.objects FOR DELETE TO anon, authenticated USING (bucket_id = 'review-images');