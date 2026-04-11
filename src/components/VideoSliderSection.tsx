import { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const getYouTubeId = (url: string): string | null => {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([^?&/]+)/
  );
  return match ? match[1] : null;
};

const VideoSliderSection = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [title, setTitle] = useState("নিউজ মিডিয়ার ভিডিও");
  const perPage = 3;

  useEffect(() => {
    supabase
      .from("page_contents")
      .select("*")
      .eq("page_key", "homepage_videos")
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) return;
        if (data) {
          const d = data as any;
          if (d.content?.videos && Array.isArray(d.content.videos)) {
            setVideos(d.content.videos);
          }
          if (d.title) setTitle(d.title);
        }
      });
  }, []);

  const totalPages = Math.ceil(videos.length / perPage);

  const prev = useCallback(() => {
    setPage((p) => (p === 0 ? totalPages - 1 : p - 1));
  }, [totalPages]);

  const next = useCallback(() => {
    setPage((p) => (p + 1 >= totalPages ? 0 : p + 1));
  }, [totalPages]);

  const visibleVideos = useMemo(() => {
    const start = page * perPage;
    return videos.slice(start, start + perPage);
  }, [videos, page, perPage]);

  if (videos.length === 0) return null;

  return (
    <section className="py-8 md:py-12 bg-transparent relative z-10">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-10">
          {title}
        </h2>

        <div className="relative">
          {totalPages > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-card border border-border shadow-md flex items-center justify-center hover:bg-accent transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5 text-foreground" />
              </button>
              <button
                onClick={next}
                className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-card border border-border shadow-md flex items-center justify-center hover:bg-accent transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5 text-foreground" />
              </button>
            </>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleVideos.map((video: any, i: number) => {
              const ytId = getYouTubeId(video.url || "");
              return (
                <div
                  key={`${page}-${i}`}
                  className="rounded-xl overflow-hidden border-2 border-primary/50 bg-card shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  {ytId ? (
                    <div className="aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${ytId}`}
                        title={video.title || `Video ${i + 1}`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                  ) : video.thumbnail ? (
                    <a
                      href={video.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative block aspect-video"
                    >
                      <img
                        src={video.thumbnail}
                        alt={video.title || `Video ${i + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </a>
                  ) : (
                    <div className="aspect-video bg-muted flex items-center justify-center text-muted-foreground">
                      No video
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-1.5 mt-6">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`h-2 rounded-full transition-all ${
                    page === i
                      ? "w-6 bg-primary"
                      : "w-2 bg-border hover:bg-muted-foreground/30"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default VideoSliderSection;
