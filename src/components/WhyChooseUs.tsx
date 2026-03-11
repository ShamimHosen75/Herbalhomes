import { Leaf, ShieldCheck, Recycle, Users, Star, Heart, Truck, Award, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const iconMap: Record<string, LucideIcon> = {
  Leaf, ShieldCheck, Recycle, Users, Star, Heart, Truck, Award,
};

const defaultFeatures = [
  { icon: "Leaf", title_bn: "১০০% জৈব", title_en: "100% Organic", desc_bn: "সকল পণ্য প্রত্যয়িত জৈব খামার থেকে সংগ্রহ করা।", desc_en: "All products sourced from certified organic farms.", bg: "bg-badge-green" },
  { icon: "ShieldCheck", title_bn: "রাসায়নিক মুক্ত", title_en: "Chemical Free", desc_bn: "প্যারাবেন ও সালফেট মুক্ত। শুধুই বিশুদ্ধ প্রকৃতি।", desc_en: "Paraben & sulfate free. Pure nature only.", bg: "bg-badge-blue" },
  { icon: "Recycle", title_bn: "পরিবেশবান্ধব", title_en: "Eco-Friendly", desc_bn: "জৈব-বিশ্লেষ্য ও পুনর্ব্যবহারযোগ্য প্যাকেজিং।", desc_en: "Biodegradable & recyclable packaging.", bg: "bg-badge-orange" },
  { icon: "Users", title_bn: "৫০,০০০+ গ্রাহক", title_en: "50,000+ Customers", desc_bn: "হাজারো গ্রাহকের বিশ্বাসের প্রতীক।", desc_en: "Trusted by thousands of customers.", bg: "bg-badge-pink" },
];

const bgColors = ["bg-badge-green", "bg-badge-blue", "bg-badge-orange", "bg-badge-pink"];

interface Props {
  title?: string;
  subtitle?: string;
  content?: any;
}

const WhyChooseUs = ({ title, subtitle, content }: Props) => {
  const { t, language } = useLanguage();
  const features = content?.features?.length ? content.features : defaultFeatures;

  return (
    <section id="why-us" className="py-14 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-2">
          {title || t("why_choose.title")}
        </h2>
        {subtitle && <p className="text-sm text-muted-foreground text-center mb-10">{subtitle}</p>}
        {!subtitle && <div className="mb-10" />}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {features.map((feature: any, i: number) => {
            const Icon = iconMap[feature.icon] || Leaf;
            const featureTitle = language === "en" ? (feature.title_en || feature.title) : (feature.title_bn || feature.title);
            const featureDesc = language === "en" ? (feature.desc_en || feature.description) : (feature.desc_bn || feature.description);
            return (
              <div key={i} className="text-center p-6 rounded-2xl border border-border bg-card hover:shadow-md hover:border-primary/20 transition-all duration-300">
                <div className={`inline-flex items-center justify-center h-14 w-14 rounded-2xl ${feature.bg || bgColors[i % bgColors.length]} mb-4`}>
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground text-sm md:text-base mb-1.5">{featureTitle}</h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{featureDesc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
