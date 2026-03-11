import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import BestSellers from "@/components/BestSellers";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import OfferBanner from "@/components/OfferBanner";
import ContactSection from "@/components/ContactSection";
import BSTICertificates from "@/components/BSTICertificates";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

interface HomepageSection {
  id: string;
  section_type: string;
  title: string;
  subtitle: string;
  layout: string;
  sort_order: number;
  active: boolean;
  content: any;
}

const sectionComponents: Record<string, React.ComponentType<{ title?: string; subtitle?: string; content?: any }>> = {
  hero_slider: HeroSection,
  featured_categories: CategoriesSection,
  best_sellers: BestSellers,
  why_choose_us: WhyChooseUs,
  offer_banner: OfferBanner,
  customer_reviews: Testimonials,
  contact: ContactSection,
  bsti_certificates: BSTICertificates as any,
};

const Index = () => {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("homepage_sections")
        .select("*")
        .eq("active", true)
        .order("sort_order");
      setSections((data as HomepageSection[]) || []);
      setLoading(false);
    };
    load();
  }, []);

  // Fallback: if no sections loaded yet, show default order
  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main>
          <HeroSection />
          <CategoriesSection />
          <BestSellers />
          <WhyChooseUs />
          <OfferBanner />
          <Testimonials />
          <ContactSection />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {sections.map(section => {
          const Component = sectionComponents[section.section_type];
          if (!Component) return null;
          return <Component key={section.id} title={section.title} subtitle={section.subtitle} content={section.content} />;
        })}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
