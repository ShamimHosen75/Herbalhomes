ALTER TABLE public.sliders ADD COLUMN IF NOT EXISTS banner_url text NOT NULL DEFAULT '';
ALTER TABLE public.sliders ADD COLUMN IF NOT EXISTS layout text NOT NULL DEFAULT 'card';