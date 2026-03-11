CREATE TABLE public.page_contents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text NOT NULL UNIQUE,
  title text NOT NULL DEFAULT '',
  subtitle text NOT NULL DEFAULT '',
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.page_contents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read page_contents" ON public.page_contents FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public manage page_contents" ON public.page_contents FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Seed default content for about and contact pages
INSERT INTO public.page_contents (page_key, title, subtitle, content) VALUES
('about', 'আমাদের সম্পর্কে', 'হার্বাল হোমসের গল্প', '{
  "story_title": "আমাদের যাত্রা",
  "story_paragraphs": [
    "হার্বাল হোমস বাংলাদেশের একটি বিশ্বস্ত অর্গানিক ব্র্যান্ড যেখানে আমরা ১০০% প্রাকৃতিক ও রাসায়নিকমুক্ত পণ্য সরবরাহ করি। আমাদের লক্ষ্য হলো প্রতিটি পরিবারে বিশুদ্ধ ও স্বাস্থ্যকর পণ্য পৌঁছে দেওয়া।",
    "আমরা বিশ্বাস করি যে প্রকৃতির কাছেই সেরা সমাধান লুকিয়ে আছে। তাই আমাদের প্রতিটি পণ্য প্রকৃতি থেকে সংগ্রহিত উপাদান দিয়ে তৈরি, কোনো ক্ষতিকর রাসায়নিক ছাড়াই।",
    "আমাদের পণ্যগুলো শুধু আপনার জন্য নয়, পরিবেশের জন্যও নিরাপদ। আমরা পরিবেশবান্ধব প্যাকেজিং ব্যবহার করি এবং টেকসই উৎপাদন পদ্ধতি অনুসরণ করি।"
  ],
  "values_title": "আমাদের মূল্যবোধ",
  "values": [
    {"title": "১০০% প্রাকৃতিক", "desc": "সকল পণ্য প্রত্যয়িত জৈব উপাদান দিয়ে তৈরি।", "icon": "Leaf"},
    {"title": "নিরাপদ ও বিশ্বস্ত", "desc": "প্যারাবেন, সালফেট ও কৃত্রিম রং মুক্ত।", "icon": "ShieldCheck"},
    {"title": "পরিবেশবান্ধব", "desc": "বায়োডিগ্রেডেবল ও রিসাইক্লেবল প্যাকেজিং।", "icon": "Recycle"},
    {"title": "ভালোবাসায় তৈরি", "desc": "প্রতিটি পণ্য যত্ন ও ভালোবাসায় হাতে তৈরি।", "icon": "Heart"},
    {"title": "গ্রাহক সন্তুষ্টি", "desc": "৫০,০০০+ সন্তুষ্ট গ্রাহকের বিশ্বাস।", "icon": "Users"},
    {"title": "প্রিমিয়াম মান", "desc": "সেরা মানের উপাদান ব্যবহারে আপোষহীন।", "icon": "Award"}
  ],
  "stats": [
    {"number": "৫০,০০০+", "label": "সন্তুষ্ট গ্রাহক"},
    {"number": "১০০+", "label": "জৈব পণ্য"},
    {"number": "৬৪", "label": "জেলায় ডেলিভারি"},
    {"number": "৪.৯/৫", "label": "গড় রেটিং"}
  ]
}'::jsonb),
('contact', 'যোগাযোগ করুন', 'আমরা সবসময় আপনার পাশে আছি', '{
  "phone": "০১৭১২-৩৪৫৬৭৮",
  "phone_raw": "+8801712345678",
  "email": "hello@herbalhomes.com",
  "address": "ঢাকা, বাংলাদেশ",
  "hours": "শনি - বৃহস্পতি, সকাল ৯টা - সন্ধ্যা ৬টা",
  "whatsapp": "8801712345678",
  "facebook": "https://m.me/herbalhomes"
}'::jsonb),
('navbar', 'Navigation', '', '{
  "links": [
    {"label": "হোমপেজ", "href": "/"},
    {"label": "পণ্য সমূহ", "href": "/shop"},
    {"label": "ক্যাটাগরি", "href": "/categories"},
    {"label": "আমাদের সম্পর্কে", "href": "/about"},
    {"label": "যোগাযোগ", "href": "/contact"}
  ],
  "cta_text": "যোগাযোগ",
  "cta_link": "/contact"
}'::jsonb);