import { useState, useEffect } from "react";
import { ArrowRight, Truck, ShieldCheck, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import heroPerson from "@/assets/hero-person.png";

interface Slide {
  id: string;
  heading: string;
  text: string;
  image_url: string;
  banner_url: string;
  layout: string;
  cta_text: string;
  cta_link: string;
  active: boolean;
  sort_order: number;
}

interface Props {
  title?: string;
  subtitle?: string;
  content?: any;
}

const HeroSection = (_props: Props) => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchSlides = async () => {
      const { data } = await supabase
        .from("sliders")
        .select("*")
        .eq("active", true)
        .order("sort_order");
      setSlides((data as Slide[]) || []);
      setLoading(false);
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[current];

  if (loading || slides.length === 0) {
    return <FallbackHero />;
  }

  const isBanner = slide.layout === "banner";

  if (isBanner) {
    return (
      <section key={slide.id} className="relative overflow-hidden">
        {slide.banner_url && (
          <img src={slide.banner_url} alt={slide.heading} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 animate-fade-in" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

        <div className="relative container mx-auto px-4 py-24 md:py-36 lg:py-44">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-white leading-tight mb-5 animate-[fade-in_0.6s_ease-out_both]">
              {slide.heading}
            </h1>
            {slide.text && (
              <p className="text-base md:text-lg text-white/80 leading-relaxed mb-8 max-w-lg animate-[fade-in_0.6s_ease-out_0.15s_both]">{slide.text}</p>
            )}
            <div className="flex flex-wrap gap-3 animate-[fade-in_0.6s_ease-out_0.3s_both]">
              <Link to={slide.cta_link || "/shop"} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 hover-scale">
                <ShoppingCartIcon />
                {slide.cta_text || t("hero.shop_now")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/categories" className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-7 py-3.5 rounded-xl text-sm font-semibold border border-white/30 hover:bg-white/30 transition-colors hover-scale">
                {t("hero.view_categories")}
              </Link>
            </div>

            <SlideControls slides={slides} current={current} setCurrent={setCurrent} light />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section key={slide.id} className="relative overflow-hidden bg-gradient-to-br from-[hsl(var(--hero-gradient-start))] via-background to-[hsl(var(--hero-gradient-end))]">
      <div className="container mx-auto px-4 py-16 md:py-28 lg:py-32">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-accent text-secondary-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-6 animate-[fade-in_0.5s_ease-out_both]">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              {t("hero.trusted_shop")}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-foreground leading-tight mb-5 animate-[fade-in_0.6s_ease-out_0.1s_both]">
              {slide.heading}
            </h1>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0 animate-[fade-in_0.6s_ease-out_0.2s_both]">
              {slide.text}
            </p>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start animate-[fade-in_0.6s_ease-out_0.3s_both]">
              <Link to={slide.cta_link || "/shop"} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 hover-scale">
                <ShoppingCartIcon />
                {slide.cta_text || t("hero.shop_now")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/categories" className="inline-flex items-center gap-2 bg-background text-foreground px-7 py-3.5 rounded-xl text-sm font-semibold border border-border hover:bg-muted transition-colors hover-scale">
                {t("hero.view_categories")}
              </Link>
            </div>

            <SlideControls slides={slides} current={current} setCurrent={setCurrent} />
          </div>

          <div className="flex-1 relative flex justify-center animate-[scale-in_0.7s_ease-out_0.2s_both]">
            <div className="relative">
              <img src={slide.image_url || heroPerson} alt={slide.heading} className="w-72 md:w-80 lg:w-96 h-auto object-contain relative z-10 rounded-2xl" />

              <div className="absolute top-8 -right-2 md:right-0 bg-background rounded-xl shadow-lg px-4 py-2.5 flex items-center gap-2 animate-float z-20">
                <div className="h-8 w-8 rounded-full bg-badge-blue flex items-center justify-center">
                  <Truck className="h-4 w-4 text-primary" />
                </div>
                <span className="text-xs font-semibold text-foreground">{t("hero.fast_delivery")}</span>
              </div>

              <div className="absolute bottom-16 -left-4 md:left-0 bg-background rounded-xl shadow-lg px-4 py-2.5 flex items-center gap-2 animate-float z-20" style={{ animationDelay: "1s" }}>
                <div className="h-8 w-8 rounded-full bg-badge-green flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                </div>
                <span className="text-xs font-semibold text-foreground">{t("hero.original")}</span>
              </div>

              <div className="absolute bottom-4 right-4 bg-background rounded-xl shadow-lg px-4 py-2.5 flex items-center gap-2 animate-float z-20" style={{ animationDelay: "2s" }}>
                <div className="h-8 w-8 rounded-full bg-badge-orange flex items-center justify-center">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                </div>
                <span className="text-xs font-semibold text-foreground">{t("hero.safe_service")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

function FallbackHero() {
  const { t } = useLanguage();
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(var(--hero-gradient-start))] via-background to-[hsl(var(--hero-gradient-end))]">
      <div className="container mx-auto px-4 py-16 md:py-28 lg:py-32">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-accent text-secondary-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              {t("hero.trusted_shop")}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-foreground leading-tight mb-5">
              {t("hero.fallback_title_1")}{" "}<span className="text-primary">{t("hero.fallback_title_highlight")}</span>{" "}{t("hero.fallback_title_2")}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              {t("hero.fallback_subtitle")}
            </p>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <Link to="/shop" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                <ShoppingCartIcon /> {t("hero.shop_now")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="flex-1 relative flex justify-center">
            <img src={heroPerson} alt="Herbal Homes" className="w-72 md:w-80 lg:w-96 h-auto object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
}

function SlideControls({ slides, current, setCurrent, light }: { slides: Slide[]; current: number; setCurrent: (n: number) => void; light?: boolean }) {
  if (slides.length <= 1) return null;
  const btnClass = light
    ? "p-1.5 rounded-full border border-white/30 hover:bg-white/20 transition-colors"
    : "p-1.5 rounded-full border border-border hover:bg-muted transition-colors";
  const chevronClass = light ? "h-4 w-4 text-white" : "h-4 w-4 text-foreground";
  const dotActive = "w-6 bg-primary";
  const dotInactive = light ? "w-2 bg-white/40" : "w-2 bg-muted-foreground/30";

  return (
    <div className={`flex items-center gap-3 mt-8 ${light ? "" : "justify-center lg:justify-start"}`}>
      <button onClick={() => setCurrent((current - 1 + slides.length) % slides.length)} className={btnClass}>
        <ChevronLeft className={chevronClass} />
      </button>
      <div className="flex gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`h-2 rounded-full transition-all ${i === current ? dotActive : dotInactive}`} />
        ))}
      </div>
      <button onClick={() => setCurrent((current + 1) % slides.length)} className={btnClass}>
        <ChevronRight className={chevronClass} />
      </button>
    </div>
  );
}

const ShoppingCartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
);

export default HeroSection;