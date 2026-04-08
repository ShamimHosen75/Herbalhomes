import { useState, useEffect, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const getYouTubeId = (url: string): string | null => {
  // Standard YouTube URLs
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([^?&/]+)/
  );
  if (match) return match[1];
  // Google Ads redirect URLs with video_id param
  const vidParam = url.match(/[?&]video_id=([^&]+)/);
  return vidParam ? vidParam[1] : null;
};

interface VideoReview {
  id: string;
  customer_name: string;
  video_url: string;
  thumbnail_url: string;
  rating: number;
  active: boolean;
  sort_order: number;
}

const CustomerVideoReviews = () => {
  const [reviews, setReviews] = useState<VideoReview[]>([]);
  const [page, setPage] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const perPage = typeof window !== "undefined" && window.innerWidth >= 768 ? 3 : 1;

  useEffect(() => {
    supabase
      .from("customer_video_reviews")
      .select("*")
      .eq("active", true)
      .order("sort_order")
      .then(({ data }) => {
        if (data) setReviews(data as VideoReview[]);
      });
  }, []);

  const totalPages = Math.ceil(reviews.length / perPage);

  const prev = useCallback(() => {
    setPage((p) => (p === 0 ? totalPages - 1 : p - 1));
    setPlayingId(null);
  }, [totalPages]);

  const next = useCallback(() => {
    setPage((p) => (p + 1 >= totalPages ? 0 : p + 1));
    setPlayingId(null);
  }, [totalPages]);

  const visibleReviews = reviews.slice(page * perPage, page * perPage + perPage);

  if (reviews.length === 0) return null;

  const sectionBg =
    "bg-gradient-to-b from-[hsl(258,50%,12%)] via-[hsl(260,42%,18%)] to-[hsl(262,45%,14%)]";

  return (
    <section className={`py-14 md:py-20 ${sectionBg} relative overflow-hidden`}>
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-1 tracking-tight">
          গ্রাহকদের ভিডিও রিভিউ
        </h2>
        <p className="text-sm text-white/40 text-center mb-10">
          আমাদের সন্তুষ্ট গ্রাহকদের অভিজ্ঞতা দেখুন
        </p>

        <div className="relative max-w-6xl mx-auto">
          {totalPages > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute -left-3 md:-left-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/[0.07] backdrop-blur-lg border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.15] transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                className="absolute -right-3 md:-right-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/[0.07] backdrop-blur-lg border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.15] transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mx-8 md:mx-14">
            {visibleReviews.map((review) => {
              const ytId = getYouTubeId(review.video_url);
              const isPlaying = playingId === review.id;

              return (
                <div
                  key={review.id}
                  className="rounded-2xl overflow-hidden border border-white/[0.08] hover:border-white/[0.15] transition-all"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  {/* Video area */}
                  <div className="aspect-video relative">
                    {isPlaying && ytId ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                        title={review.customer_name}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <button
                        onClick={() => setPlayingId(review.id)}
                        className="w-full h-full relative group"
                      >
                        <img
                          src={
                            review.thumbnail_url ||
                            (ytId
                              ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
                              : "")
                          }
                          alt={review.customer_name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                          <div className="h-14 w-14 rounded-full bg-primary/90 flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                            <Play className="h-6 w-6 text-white fill-white ml-0.5" />
                          </div>
                        </div>
                      </button>
                    )}
                  </div>

                  {/* Customer info */}
                  <div className="p-4">
                    <div className="flex items-center gap-0.5 mb-2">
                      {Array.from({ length: review.rating }).map((_, j) => (
                        <Star
                          key={j}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center text-sm font-bold text-primary-foreground border border-primary/30">
                        {review.customer_name?.[0] || "?"}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">
                          {review.customer_name}
                        </p>
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
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setPage(i); setPlayingId(null); }}
                  className={`rounded-full transition-all duration-300 ${
                    i === page
                      ? "w-8 h-2.5 bg-primary"
                      : "w-2.5 h-2.5 bg-white/20 hover:bg-white/35"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CustomerVideoReviews;
