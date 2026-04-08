import { useState, useEffect } from "react";
import { ArrowRight, Leaf, ShieldCheck, Recycle, Users, Heart, Award, Star, Truck, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import heroBanner from "@/assets/hero-banner.jpg";

const iconMap: Record<string, LucideIcon> = { Leaf, ShieldCheck, Recycle, Users, Heart, Award, Star, Truck };
const bgColors = ["bg-badge-green", "bg-badge-blue", "bg-badge-orange", "bg-badge-pink", "bg-badge-green", "bg-badge-blue"];

const About = () => {
  const [pageData, setPageData] = useState<any>(null);
  const { t } = useLanguage();

  useEffect(() => {
    supabase.from("page_contents").select("*").eq("page_key", "about").single().then(({ data }) => {
      if (data) setPageData(data);
    });
  }, []);

  const c = pageData?.content || {};
  const title = pageData?.title || t("about.title");
  const subtitle = pageData?.subtitle || t("about.subtitle");
  const storyTitle = c.story_title || t("about.story_title");
  const storyParagraphs = c.story_paragraphs || [
    "হার্বাল হোমস বাংলাদেশের একটি বিশ্বস্ত অর্গানিক ব্র্যান্ড যেখানে আমরা ১০০% প্রাকৃতিক ও রাসায়নিকমুক্ত পণ্য সরবরাহ করি।",
    "আমরা বিশ্বাস করি যে প্রকৃতির কাছেই সেরা সমাধান লুকিয়ে আছে।",
    "আমাদের পণ্যগুলো শুধু আপনার জন্য নয়, পরিবেশের জন্যও নিরাপদ।",
  ];
  const valuesTitle = c.values_title || t("about.values_title");
  const values = c.values || [
    { icon: "Leaf", title: "১০০% প্রাকৃতিক", desc: "সকল পণ্য প্রত্যয়িত জৈব উপাদান দিয়ে তৈরি।" },
    { icon: "ShieldCheck", title: "নিরাপদ ও বিশ্বস্ত", desc: "প্যারাবেন, সালফেট ও কৃত্রিম রং মুক্ত।" },
    { icon: "Recycle", title: "পরিবেশবান্ধব", desc: "বায়োডিগ্রেডেবল ও রিসাইক্লেবল প্যাকেজিং।" },
    { icon: "Heart", title: "ভালোবাসায় তৈরি", desc: "প্রতিটি পণ্য যত্ন ও ভালোবাসায় হাতে তৈরি।" },
    { icon: "Users", title: "গ্রাহক সন্তুষ্টি", desc: "৫০,০০০+ সন্তুষ্ট গ্রাহকের বিশ্বাস।" },
    { icon: "Award", title: "প্রিমিয়াম মান", desc: "সেরা মানের উপাদান ব্যবহারে আপোষহীন।" },
  ];
  const stats = c.stats || [
    { number: "৫০,০০০+", label: "সন্তুষ্ট গ্রাহক" },
    { number: "১০০+", label: "জৈব পণ্য" },
    { number: "৬৪", label: "জেলায় ডেলিভারি" },
    { number: "৪.৯/৫", label: "গড় রেটিং" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section className="bg-accent py-10 md:py-14">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Link to="/" className="hover:text-primary">{t("about.home")}</Link>
              <ArrowRight className="h-3 w-3" />
              <span className="text-foreground font-medium">{title}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h1>
            <p className="text-muted-foreground mt-2">{subtitle}</p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-10 items-center">
              <div className="flex-1">
                <img src={heroBanner} alt={title} className="rounded-2xl w-full h-auto object-cover shadow-lg" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{storyTitle}</h2>
                {storyParagraphs.map((p: string, i: number) => (
                  <p key={i} className="text-muted-foreground leading-relaxed mb-4">{p}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10">{valuesTitle}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {values.map((item: any, i: number) => {
                const Icon = iconMap[item.icon] || Leaf;
                return (
                  <div key={i} className="bg-card rounded-2xl p-6 border border-border hover:shadow-md transition-shadow">
                    <div className={`h-12 w-12 rounded-2xl ${bgColors[i % bgColors.length]} flex items-center justify-center mb-4`}>
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground mb-1.5">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat: any, i: number) => (
                <div key={i} className="text-center p-6 rounded-2xl bg-accent">
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;