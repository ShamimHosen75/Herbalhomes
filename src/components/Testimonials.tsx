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

const PhoneMockup = ({ src, index }: { src: string; index: number }) => (
  <div className="relative mx-auto" style={{ maxWidth: 500 }}>
    {/* Shadow beneath phone */}
    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[70%] h-8 bg-black/30 blur-2xl rounded-full" />

    {/* Phone body */}
    <div className="relative rounded-[2rem] overflow-hidden" style={{
      background: "linear-gradient(145deg, #2a2a2e 0%, #1a1a1e 100%)",
      padding: "8px 6px",
      boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 25px 50px -12px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)"
    }}>
      {/* Screen */}
      <div className="rounded-[1.5rem] overflow-hidden bg-white relative">
        {/* Dynamic Island */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[72px] h-[18px] bg-black rounded-full z-20" />

        {/* Screen content - full image */}
        <img
          src={src}
          alt={`Customer review ${index + 1}`}
          className="w-full h-auto block"
          loading="lazy"
        />

        {/* Home indicator */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-[100px] h-[4px] bg-black/20 rounded-full z-20" />
      </div>

      {/* Side buttons - power */}
      <div className="absolute right-[-2px] top-[80px] w-[3px] h-[40px] rounded-r-sm" style={{ background: "linear-gradient(180deg, #3a3a3e, #2a2a2e)" }} />
      {/* Side buttons - volume */}
      <div className="absolute left-[-2px] top-[70px] w-[3px] h-[24px] rounded-l-sm" style={{ background: "linear-gradient(180deg, #3a3a3e, #2a2a2e)" }} />
      <div className="absolute left-[-2px] top-[100px] w-[3px] h-[24px] rounded-l-sm" style={{ background: "linear-gradient(180deg, #3a3a3e, #2a2a2e)" }} />
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
  const imageList = reviewImages.length > 0
    ? reviewImages
    : reviews.filter((r: any) => r.image).map((r: any) => r.image);

  const getVisibleCount = () => {
    if (typeof window === "undefined") return 3;
    if (window.innerWidth < 768) return 1;
    return 3;
  };

  const [visibleCount, setVisibleCount] = useState(getVisibleCount);

  useEffect(() => {
    const handleResize = () => setVisibleCount(getVisibleCount());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sliderItems = hasImages ? imageList : reviews;
  const maxIndex = Math.max(0, sliderItems.length - visibleCount);

  const next = useCallback(() => {
    setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    if (!isAutoPlaying || sliderItems.length <= visibleCount) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, next, sliderItems.length, visibleCount]);

  const sectionBg = "bg-gradient-to-b from-[hsl(258,50%,12%)] via-[hsl(260,42%,18%)] to-[hsl(262,45%,14%)]";

  // ─── IMAGE TESTIMONIALS (phone mockups) ───
  if (hasImages && imageList.length > 0) {
    return (
      <section className={`py-16 md:py-24 ${sectionBg} relative overflow-hidden`}>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-1 tracking-tight">
            {title || "আমাদের সম্মানিত গ্রাহকদের রিভিউ দেখুন"}
          </h2>
          <p className="text-sm text-white/40 text-center mb-14">
            {subtitle || "বিশ্বস্ত গ্রাহকদের অভিজ্ঞতা"}
          </p>

          <div
            className="relative"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Arrows */}
            {imageList.length > visibleCount && (
              <>
                <button
                  onClick={prev}
                  className="absolute -left-2 md:left-0 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/[0.07] backdrop-blur-lg border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.12] transition-all"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={next}
                  className="absolute -right-2 md:right-0 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/[0.07] backdrop-blur-lg border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.12] transition-all"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            <div className="overflow-hidden mx-8 md:mx-14">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${current * (100 / visibleCount)}%)` }}
              >
                {imageList.map((img: string, i: number) => (
                  <div
                    key={i}
                    className="flex-shrink-0 px-4 md:px-6 py-6"
                    style={{ width: `${100 / visibleCount}%` }}
                  >
                    <PhoneMockup src={img} index={i} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dots */}
          {imageList.length > visibleCount && (
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
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-1 tracking-tight">
          {title || "আমাদের সম্মানিত গ্রাহকদের রিভিউ দেখুন"}
        </h2>
        <p className="text-sm text-white/40 text-center mb-14">
          {subtitle || "বিশ্বস্ত গ্রাহকদের অভিজ্ঞতা"}
        </p>

        <div
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {reviews.length > visibleCount && (
            <>
              <button
                onClick={prev}
                className="absolute -left-2 md:left-0 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/[0.07] backdrop-blur-lg border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.12] transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                className="absolute -right-2 md:right-0 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/[0.07] backdrop-blur-lg border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.12] transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <div className="overflow-hidden mx-8 md:mx-14">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${current * (100 / visibleCount)}%)` }}
            >
              {reviews.map((review: any, i: number) => (
                <div
                  key={i}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / visibleCount}%` }}
                >
                  <div className="rounded-2xl p-6 h-full border border-white/[0.06] hover:border-white/[0.12] transition-colors" style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                    backdropFilter: "blur(12px)"
                  }}>
                    <div className="flex items-center gap-0.5 mb-4">
                      {Array.from({ length: review.rating || 5 }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed mb-6">"{review.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center text-sm font-bold text-primary-foreground border border-primary/30">
                        {review.name?.[0] || "?"}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{review.name}</p>
                        <p className="text-[11px] text-white/40 flex items-center gap-1">
                          <span className="inline-block w-3 h-3 rounded-full bg-primary/60 text-[8px] text-white flex items-center justify-center">✓</span>
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
