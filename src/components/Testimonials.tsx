import { useState, useEffect, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
  <div className="relative flex items-center justify-center py-8">
    {/* Main phone */}
    <div className="relative z-10" style={{ width: "min(340px, 80vw)" }}>
      {/* Phone shadow */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[60%] h-10 bg-black/40 blur-3xl rounded-full" />

      {/* Phone body */}
      <div
        className="relative rounded-[2.8rem] overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #3a3a3e 0%, #1a1a1e 100%)",
          padding: "10px 8px",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.1), 0 30px 60px -15px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.15)",
        }}
      >
        {/* Screen */}
        <div className="rounded-[2.2rem] overflow-hidden bg-white relative">
          {/* Dynamic Island */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[80px] h-[22px] bg-black rounded-full z-20" />

          {/* Screenshot */}
          <img
            src={src}
            alt={`Customer review ${index + 1}`}
            className="w-full h-auto block"
            loading="lazy"
          />

          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[120px] h-[4px] bg-black/20 rounded-full z-20" />
        </div>

        {/* Side buttons */}
        <div
          className="absolute right-[-3px] top-[90px] w-[4px] h-[50px] rounded-r-sm"
          style={{ background: "linear-gradient(180deg, #4a4a4e, #2a2a2e)" }}
        />
        <div
          className="absolute left-[-3px] top-[80px] w-[4px] h-[28px] rounded-l-sm"
          style={{ background: "linear-gradient(180deg, #4a4a4e, #2a2a2e)" }}
        />
        <div
          className="absolute left-[-3px] top-[116px] w-[4px] h-[28px] rounded-l-sm"
          style={{ background: "linear-gradient(180deg, #4a4a4e, #2a2a2e)" }}
        />
      </div>
    </div>

    {/* Magnified overlay - floating card */}
    <div
      className="absolute z-20 hidden md:block"
      style={{
        bottom: "5%",
        left: "58%",
        width: "min(380px, 40vw)",
        transform: "rotate(0deg)",
      }}
    >
      <div
        className="rounded-2xl overflow-hidden border border-white/10"
        style={{
          boxShadow: "0 25px 60px -10px rgba(0,0,0,0.6), 0 0 40px rgba(139,92,246,0.15)",
        }}
      >
        <img
          src={src}
          alt={`Magnified review ${index + 1}`}
          className="w-full h-auto block"
          loading="lazy"
          style={{
            objectFit: "cover",
            objectPosition: "center 40%",
            maxHeight: "350px",
          }}
        />
      </div>
      {/* Glow behind overlay */}
      <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-3xl -z-10" />
    </div>

    {/* Badge */}
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 md:left-auto md:right-[10%] md:bottom-[-10px] md:-translate-x-0 z-30">
      <div
        className="rounded-full px-6 py-2.5 flex items-center gap-2"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8))",
          boxShadow: "0 8px 30px hsl(var(--primary) / 0.4)",
        }}
      >
        <span className="text-primary-foreground text-sm font-semibold">আলহামদুলিল্লাহ Happy client</span>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, j) => (
            <Star key={j} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          ))}
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
