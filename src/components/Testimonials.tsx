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

const PhoneCard = ({ src, index }: { src: string; index: number }) => (
  <div className="flex flex-col items-center">
    <div className="relative" style={{ width: "min(240px, 55vw)" }}>
      <img
        src={phoneFrame}
        alt="Phone frame"
        className="relative z-10 block w-full h-auto pointer-events-none"
      />
      <div
        className="absolute z-0 overflow-hidden"
        style={{
          top: "1.8%",
          left: "3.6%",
          width: "92.8%",
          height: "96.4%",
          borderRadius: "2.4rem",
        }}
      >
        <img
          src={src}
          alt={`Customer review ${index + 1}`}
          className="block w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      {/* Shadow */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 h-8 w-[55%] rounded-full bg-primary/20 blur-2xl" />
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
      .limit(20)
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

  // Show 3 on md+, 1 on mobile
  const visibleCount = typeof window !== "undefined" && window.innerWidth >= 768 ? 3 : 1;
  const totalItems = hasImages ? imageList.length : reviews.length;
  const maxIndex = Math.max(0, totalItems - visibleCount);

  const next = useCallback(() => {
    setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    if (totalItems <= visibleCount) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, next, totalItems, visibleCount]);

  const sectionBg =
    "bg-gradient-to-b from-[hsl(258,50%,12%)] via-[hsl(260,42%,18%)] to-[hsl(262,45%,14%)]";

  const slideWidth = 100 / visibleCount;

  // ─── IMAGE TESTIMONIALS ───
  if (hasImages && imageList.length > 0) {
    return (
      <section className={`py-16 md:py-24 ${sectionBg} relative overflow-hidden`}>
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
            className="relative max-w-6xl mx-auto"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Arrows */}
            {totalItems > visibleCount && (
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

            {/* 3-at-a-time slider */}
            <div className="overflow-hidden mx-10 md:mx-16">
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${current * slideWidth}%)` }}
              >
                {imageList.map((img: string, i: number) => (
                  <div
                    key={i}
                    className="flex-shrink-0 px-2 md:px-4"
                    style={{ width: `${slideWidth}%` }}
                  >
                    <PhoneCard src={img} index={i} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dots */}
          {totalItems > visibleCount && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
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
          className="relative max-w-5xl mx-auto"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {reviews.length > visibleCount && (
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
              style={{ transform: `translateX(-${current * slideWidth}%)` }}
            >
              {reviews.map((review: any, i: number) => (
                <div
                  key={i}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${slideWidth}%` }}
                >
                  <div
                    className="rounded-2xl p-6 md:p-8 border border-white/[0.06] hover:border-white/[0.12] transition-colors"
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
                    <p className="text-white/80 text-sm md:text-base leading-relaxed mb-6">
                      "{review.text}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center text-sm font-bold text-primary-foreground border border-primary/30">
                        {review.name?.[0] || "?"}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{review.name}</p>
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

        {reviews.length > visibleCount && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
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
