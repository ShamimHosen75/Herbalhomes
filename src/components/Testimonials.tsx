import { useState, useEffect, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import phoneFrame from "@/assets/phone-frame.png";

const defaultReviews = [
  { name: "সারাহ মুন্নি", text: "হার্বাল হোমসের ল্যাভেন্ডার সাবান ৩ মাস ধরে ব্যবহার করছি।", rating: 5 },
  { name: "জামিল রহমান", text: "কালোজিরার তেলের মান অসাধারণ।", rating: 5 },
  { name: "আমিরা খান", text: "চমৎকার প্যাকেজিং, অসাধারণ পণ্য।", rating: 5 },
  { name: "রহিমা বেগম", text: "নারকেল তেল খুবই ভালো মানের। আবার অর্ডার করবো।", rating: 5 },
  { name: "কামরুল হাসান", text: "ডেলিভারি দ্রুত এবং পণ্যের মান চমৎকার।", rating: 5 },
];

interface Props {
  title?: string;
  subtitle?: string;
  content?: any;
}

const PhoneWithOverlay = ({ src, index }: { src: string; index: number }) => (
  <div className="relative flex justify-center py-6 md:py-8" style={{ minHeight: "580px" }}>
    {/* Phone with real frame */}
    <div
      className="absolute top-0 left-1/2 z-10"
      style={{
        width: "min(300px, 68vw)",
        transform: "translateX(-50%)",
      }}
    >
      <div className="relative">
        {/* Phone frame image */}
        <img
          src={phoneFrame}
          alt="Phone frame"
          className="relative z-10 block w-full h-auto pointer-events-none"
        />
        {/* Screenshot inside the frame */}
        <div
          className="absolute z-0 overflow-hidden"
          style={{
            top: "2.8%",
            left: "5.8%",
            width: "88.4%",
            height: "94.8%",
            borderRadius: "1.8rem",
          }}
        >
          <img
            src={src}
            alt={`Customer review ${index + 1}`}
            className="block w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
      {/* Shadow beneath phone */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 h-8 w-[55%] rounded-full bg-black/30 blur-2xl" />
    </div>

    {/* Magnified overlay card */}
    <div
      className="absolute left-1/2 z-20"
      style={{
        bottom: "80px",
        width: "min(420px, 92vw)",
        transform: "translateX(-50%)",
      }}
    >
      <div
        className="overflow-hidden rounded-2xl bg-white"
        style={{
          boxShadow: "0 22px 50px -12px hsla(0 0% 0% / 0.5)",
        }}
      >
        <img
          src={src}
          alt={`Magnified review ${index + 1}`}
          className="block w-full h-auto"
          loading="lazy"
          style={{
            objectFit: "cover",
            objectPosition: "center 25%",
            maxHeight: "220px",
          }}
        />
            }}
          />
        </div>
      </div>
    </div>
  </div>
);

const Testimonials = ({ title, subtitle, content }: Props) => {
  const reviews = content?.reviews?.length ? content.reviews : defaultReviews;
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    supabase
      .from("product_reviews")
      .select("image")
      .eq("approved", true)
      .neq("image", "")
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (data) {
          const imgs = (data as any[]).map((r) => r.image).filter(Boolean);
          setReviewImages(imgs);
        }
      });
  }, []);

  const hasImages = reviewImages.length > 0 || reviews.some((r: any) => r.image);
  const imageList =
    reviewImages.length > 0
      ? reviewImages
      : reviews.filter((r: any) => r.image).map((r: any) => r.image);

  const maxIndex = hasImages ? Math.max(0, imageList.length - 1) : Math.max(0, reviews.length - 1);

  const next = useCallback(() => {
    setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const total = hasImages ? imageList.length : reviews.length;
    if (total <= 1) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, next, hasImages, imageList.length, reviews.length]);

  const sectionBg =
    "bg-gradient-to-b from-[hsl(258,50%,12%)] via-[hsl(260,42%,18%)] to-[hsl(262,45%,14%)]";

  // ─── IMAGE TESTIMONIALS ───
  if (hasImages && imageList.length > 0) {
    return (
      <section className={`py-16 md:py-24 ${sectionBg} relative overflow-hidden`}>
        {/* Decorative glows */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />

        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-1 tracking-tight">
            {title || "আমাদের সম্মানিত গ্রাহকদের রিভিউ দেখুন"}
          </h2>
          <p className="text-sm text-white/40 text-center mb-10">
            {subtitle || "বিশ্বস্ত গ্রাহকদের অভিজ্ঞতা"}
          </p>

          <div
            className="relative max-w-4xl mx-auto"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Arrows */}
            {imageList.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full bg-white/[0.07] backdrop-blur-lg border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.15] transition-all"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full bg-white/[0.07] backdrop-blur-lg border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.15] transition-all"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Single slide display */}
            <div className="overflow-hidden mx-10 md:mx-16">
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${current * 100}%)` }}
              >
                {imageList.map((img: string, i: number) => (
                  <div key={i} className="flex-shrink-0 w-full">
                    <PhoneWithOverlay src={img} index={i} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dots */}
          {imageList.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {imageList.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-8 h-2.5 bg-primary"
                      : "w-2.5 h-2.5 bg-white/20 hover:bg-white/35"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  // ─── TEXT TESTIMONIALS (fallback) ───
  return (
    <section className={`py-16 md:py-24 ${sectionBg} relative overflow-hidden`}>
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-1 tracking-tight">
          {title || "আমাদের সম্মানিত গ্রাহকদের রিভিউ দেখুন"}
        </h2>
        <p className="text-sm text-white/40 text-center mb-14">
          {subtitle || "বিশ্বস্ত গ্রাহকদের অভিজ্ঞতা"}
        </p>

        <div
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {reviews.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute -left-2 md:-left-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/[0.07] backdrop-blur-lg border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.12] transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                className="absolute -right-2 md:-right-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/[0.07] backdrop-blur-lg border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.12] transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <div className="overflow-hidden mx-8 md:mx-14">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {reviews.map((review: any, i: number) => (
                <div key={i} className="flex-shrink-0 w-full px-4">
                  <div
                    className="rounded-2xl p-8 max-w-lg mx-auto border border-white/[0.06] hover:border-white/[0.12] transition-colors"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    <div className="flex items-center gap-0.5 mb-4">
                      {Array.from({ length: review.rating || 5 }).map((_, j) => (
                        <Star key={j} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-white/80 text-base leading-relaxed mb-6">
                      "{review.text}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center text-base font-bold text-primary-foreground border border-primary/30">
                        {review.name?.[0] || "?"}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{review.name}</p>
                        <p className="text-xs text-white/40 flex items-center gap-1">
                          <span className="inline-block w-4 h-4 rounded-full bg-primary/60 text-[9px] text-white flex items-center justify-center">
                            ✓
                          </span>
                          যাচাইকৃত ক্রেতা
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {reviews.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_: any, i: number) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-8 h-2.5 bg-primary"
                    : "w-2.5 h-2.5 bg-white/20 hover:bg-white/35"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
