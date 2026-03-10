
INSERT INTO storage.buckets (id, name, public) VALUES ('slider-images', 'slider-images', true);

CREATE POLICY "Public read slider images" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'slider-images');
CREATE POLICY "Public upload slider images" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'slider-images');
CREATE POLICY "Public delete slider images" ON storage.objects FOR DELETE TO anon, authenticated USING (bucket_id = 'slider-images');
