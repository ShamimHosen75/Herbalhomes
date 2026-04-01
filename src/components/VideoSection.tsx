import { Play } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  title?: string;
  subtitle?: string;
  content?: any;
}

const VideoSection = ({ title, content }: Props) => {
  const { t } = useLanguage();
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    if (content?.videos?.length) {
      setVideos(content.videos);
      return;
    }
    // Try loading from page_contents
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
  }, [content]);

  if (videos.length === 0) return null;

  return (
    <section className="py-14 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-10">
          {title || "আমাদের নিয়ে করা ভিডিও দেখুন"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video: any, i: number) => (
            <a
              key={i}
              href={video.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block rounded-xl overflow-hidden aspect-video bg-muted"
            >
              {video.thumbnail ? (
                <img
                  src={video.thumbnail}
                  alt={video.title || `Video ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Play className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <div className="h-14 w-14 rounded-full bg-destructive/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="h-6 w-6 text-primary-foreground fill-primary-foreground ml-0.5" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
