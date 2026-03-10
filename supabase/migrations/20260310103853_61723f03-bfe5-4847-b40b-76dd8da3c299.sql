
ALTER TABLE public.product_reviews ADD COLUMN IF NOT EXISTS approved BOOLEAN NOT NULL DEFAULT false;
