import { useState, useEffect, useCallback } from "react";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const VideoSliderSection = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    supabase
      .from("page_contents")
      .select("*")
      .eq("page_key", "homepage_videos")
      .single()
      .then(({ data }) => {
        if (data && (data as any).content?.videos) {
          setVideos((data as any).content.videos);
        }
      });
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c === 0 ? Math.max(0, videos.length - 2) : Math.max(0, c - 2)));
  }, [videos.length]);

  const next = useCallback(() => {
    setCurrent((c) => (c + 2 >= videos.length ? 0 : c + 2));
  }, [videos.length]);

  if (videos.length === 0) return null;

  const visibleVideos = videos.slice(current, current + 2);
  // If we're at the end and only have 1 left, wrap around
  if (visibleVideos.length < 2 && videos.length > 1) {
    visibleVideos.push(videos[0]);
  }

  return (
    <section className="py-14 md:py-20 bg-muted/40">
      <div className="container mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-3">
          আমাদের ভিডিও দেখুন
        </h2>
        <p className="text-sm text-muted-foreground text-center mb-10">
          আমাদের পণ্য সম্পর্কে বিস্তারিত জানুন ভিডিওতে
        </p>

        <div className="relative max-w-5xl mx-auto">
          {videos.length > 2 && (
            <>
              <button
                onClick={prev}
                className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-card border border-border shadow-md flex items-center justify-center hover:bg-accent transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5 text-foreground" />
              </button>
              <button
                onClick={next}
                className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-card border border-border shadow-md flex items-center justify-center hover:bg-accent transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5 text-foreground" />
              </button>
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {visibleVideos.map((video: any, i: number) => (
              <a
                key={`${current}-${i}`}
                href={video.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block rounded-2xl overflow-hidden aspect-video bg-muted shadow-md hover:shadow-xl transition-shadow"
              >
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.title || `Video ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Play className="h-16 w-16 text-muted-foreground/50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-destructive/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="h-7 w-7 text-primary-foreground fill-primary-foreground ml-0.5" />
                  </div>
                </div>
                {video.title && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <p className="text-primary-foreground text-sm font-medium truncate">{video.title}</p>
                  </div>
                )}
              </a>
            ))}
          </div>

          {videos.length > 2 && (
            <div className="flex justify-center gap-1.5 mt-6">
              {Array.from({ length: Math.ceil(videos.length / 2) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i * 2)}
                  className={`h-2 rounded-full transition-all ${
                    Math.floor(current / 2) === i
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
