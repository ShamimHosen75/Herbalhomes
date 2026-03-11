import { useState, useEffect, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // How many cards to show at once
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

  const maxIndex = Math.max(0, reviews.length - visibleCount);

  const next = useCallback(() => {
    setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying || reviews.length <= visibleCount) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, next, reviews.length, visibleCount]);

  return (
    <section className="py-14 md:py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-2">
          {title || "আমাদের গ্রাহকরা কী বলছেন"}
        </h2>
        {subtitle && <p className="text-sm text-muted-foreground text-center mb-10">{subtitle}</p>}
        {!subtitle && <div className="mb-10" />}

        <div
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Slider container */}
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
                  <div className="bg-card rounded-2xl p-6 border border-border hover:shadow-md transition-shadow h-full">
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: review.rating || 5 }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-foreground text-sm leading-relaxed mb-5">"{review.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {review.name?.[0] || "?"}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{review.name}</p>
                        <p className="text-xs text-muted-foreground">যাচাইকৃত ক্রেতা</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          {reviews.length > visibleCount && (
            <>
              <button
                onClick={prev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-5 h-9 w-9 rounded-full bg-card border border-border shadow-md flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors z-10"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-5 h-9 w-9 rounded-full bg-card border border-border shadow-md flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors z-10"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* Dots indicator */}
        {reviews.length > visibleCount && (
          <div className="flex justify-center gap-1.5 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? "w-6 bg-primary" : "w-2 bg-border hover:bg-muted-foreground/30"
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
