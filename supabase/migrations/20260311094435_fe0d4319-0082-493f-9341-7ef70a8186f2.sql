
INSERT INTO storage.buckets (id, name, public) VALUES ('category-images', 'category-images', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read category-images" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'category-images');
CREATE POLICY "Public upload category-images" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'category-images');
CREATE POLICY "Public update category-images" ON storage.objects FOR UPDATE TO anon, authenticated USING (bucket_id = 'category-images');
CREATE POLICY "Public delete category-images" ON storage.objects FOR DELETE TO anon, authenticated USING (bucket_id = 'category-images');
