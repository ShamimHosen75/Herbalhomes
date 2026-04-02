
CREATE TABLE public.customer_video_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL DEFAULT '',
  video_url TEXT NOT NULL DEFAULT '',
  thumbnail_url TEXT NOT NULL DEFAULT '',
  rating INTEGER NOT NULL DEFAULT 5,
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.customer_video_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active customer video reviews"
ON public.customer_video_reviews
FOR SELECT
USING (true);

CREATE POLICY "Staff can manage customer video reviews"
ON public.customer_video_reviews
FOR ALL
USING (true)
WITH CHECK (true);
