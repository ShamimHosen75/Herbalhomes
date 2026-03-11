import { Gift } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  title?: string;
  subtitle?: string;
  content?: any;
}

const OfferBanner = ({ title, subtitle, content }: Props) => {
  const { t } = useLanguage();
  const ctaText = content?.cta_text || t("offer.cta");
  const ctaLink = content?.cta_link || "#best-sellers";
  const couponCode = content?.coupon_code || "PURENATURE25";

  return (
    <section className="py-14 md:py-20 bg-gradient-to-r from-primary to-[hsl(142,64%,28%)] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-primary-foreground/5 -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-52 h-52 rounded-full bg-primary-foreground/5 translate-y-1/3 -translate-x-1/3" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-xl mx-auto">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary-foreground/10 mb-5">
            <Gift className="h-7 w-7 text-primary-foreground" />
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-3">
            {title || t("offer.title")}
          </h2>
          <p className="text-primary-foreground/80 text-sm md:text-base mb-7">
            {subtitle || t("offer.subtitle", { code: couponCode })}
          </p>
          <a
            href={ctaLink}
            className="inline-flex items-center gap-2 bg-background text-foreground px-7 py-3 rounded-xl text-sm font-semibold hover:bg-muted transition-colors"
          >
            {ctaText}
          </a>
        </div>
      </div>
    </section>
  );
};

export default OfferBanner;