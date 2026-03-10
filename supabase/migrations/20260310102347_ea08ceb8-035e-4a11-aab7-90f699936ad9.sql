
-- Drop foreign keys first
ALTER TABLE public.product_variants DROP CONSTRAINT product_variants_product_id_fkey;
ALTER TABLE public.product_reviews DROP CONSTRAINT product_reviews_product_id_fkey;

-- Change products.id from UUID to TEXT
ALTER TABLE public.products ALTER COLUMN id SET DATA TYPE TEXT;
ALTER TABLE public.product_variants ALTER COLUMN product_id SET DATA TYPE TEXT;
ALTER TABLE public.product_variants ALTER COLUMN id SET DATA TYPE TEXT;
ALTER TABLE public.product_reviews ALTER COLUMN product_id SET DATA TYPE TEXT;
ALTER TABLE public.categories ALTER COLUMN id SET DATA TYPE TEXT;

-- Re-add foreign keys
ALTER TABLE public.product_variants ADD CONSTRAINT product_variants_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
ALTER TABLE public.product_reviews ADD CONSTRAINT product_reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
