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

const Testimonials = ({ title, subtitle, content }: Props) => {
  const reviews = content?.reviews?.length ? content.reviews : defaultReviews;
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Load review images from DB
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

  // Use image list for slider if available, else text reviews
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

  // Image testimonial slider (dark purple bg, phone frames)
  if (hasImages && imageList.length > 0) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-br from-[hsl(260,45%,16%)] via-[hsl(260,40%,20%)] to-[hsl(270,35%,14%)] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-56 h-56 rounded-full bg-purple-500/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.02]" />

        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-1">
            {title || "আমাদের সম্মানিত গ্রাহকদের রিভিউ দেখুন"}
          </h2>
          {subtitle && <p className="text-sm text-white/50 text-center mb-12">{subtitle}</p>}
          {!subtitle && <div className="mb-12" />}

          <div
            className="relative px-10 md:px-14"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-600 ease-in-out"
                style={{
                  transform: `translateX(-${current * (100 / visibleCount)}%)`,
                }}
              >
                {imageList.map((img: string, i: number) => (
                  <div
                    key={i}
                    className="flex-shrink-0 px-4"
                    style={{ width: `${100 / visibleCount}%` }}
                  >
                    <div className="mx-auto max-w-[300px] group">
                      {/* Phone device */}
                      <div className="relative">
                        {/* Phone outer shell */}
                        <div className="rounded-[2.5rem] bg-gradient-to-b from-gray-700 to-gray-900 p-[6px] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)]">
                          <div className="rounded-[2.2rem] bg-white overflow-hidden relative">
                            {/* Status bar */}
                            <div className="h-8 bg-gray-50 flex items-center justify-between px-6 relative">
                              <span className="text-[9px] text-gray-500 font-medium">12:30</span>
                              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-[22px] bg-black rounded-b-2xl" />
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-2 border border-gray-400 rounded-sm relative">
                                  <div className="absolute inset-[1px] right-[2px] bg-gray-400 rounded-[1px]" />
                                </div>
                              </div>
                            </div>

                            {/* Screenshot content */}
                            <img
                              src={img}
                              alt={`Customer review ${i + 1}`}
                              className="w-full h-auto"
                              loading="lazy"
                            />

                            {/* Bottom bar */}
                            <div className="h-5 bg-gray-50 flex items-center justify-center">
                              <div className="w-24 h-1 bg-gray-300 rounded-full" />
                            </div>
                          </div>
                        </div>

                        {/* Glow effect on hover */}
                        <div className="absolute -inset-2 rounded-[3rem] bg-primary/0 group-hover:bg-primary/10 transition-all duration-500 -z-10 blur-xl" />
                      </div>

                      {/* Happy client badge */}
                      <div className="mt-4 flex justify-center">
                        <div className="bg-gradient-to-r from-primary to-[hsl(142,64%,28%)] px-5 py-2 rounded-full shadow-lg shadow-primary/20">
                          <p className="text-primary-foreground text-xs font-bold tracking-wide">✅ Verified Customer</p>
                          <div className="flex justify-center gap-0.5 mt-0.5">
                            {Array.from({ length: 5 }).map((_, s) => (
                              <span key={s} className="text-yellow-300 text-[10px]">★</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation arrows */}
            {imageList.length > visibleCount && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all z-10"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-0 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all z-10"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          {/* Dots */}
          {imageList.length > visibleCount && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === current ? "w-8 bg-primary shadow-lg shadow-primary/30" : "w-2.5 bg-white/25 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  // Fallback: text-based reviews
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-[hsl(260,45%,16%)] via-[hsl(260,40%,20%)] to-[hsl(270,35%,14%)] relative overflow-hidden">
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-10 right-10 w-56 h-56 rounded-full bg-purple-500/5 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-1">
          {title || "আমাদের সম্মানিত গ্রাহকদের রিভিউ দেখুন"}
        </h2>
        {subtitle && <p className="text-sm text-white/50 text-center mb-12">{subtitle}</p>}
        {!subtitle && <div className="mb-12" />}

        <div
          className="relative px-8 md:px-12"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${current * (100 / visibleCount)}%)`,
              }}
            >
              {reviews.map((review: any, i: number) => (
                <div
                  key={i}
                  className="flex-shrink-0 px-2"
                  style={{ width: `${100 / visibleCount}%` }}
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all h-full">
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: review.rating || 5 }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-white/90 text-sm leading-relaxed mb-5">"{review.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/30 flex items-center justify-center text-sm font-bold text-primary">
                        {review.name?.[0] || "?"}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{review.name}</p>
                        <p className="text-xs text-white/50">যাচাইকৃত ক্রেতা</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {reviews.length > visibleCount && (
            <>
              <button
                onClick={prev}
                className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {reviews.length > visibleCount && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === current ? "w-7 bg-primary" : "w-2.5 bg-white/30 hover:bg-white/50"
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
