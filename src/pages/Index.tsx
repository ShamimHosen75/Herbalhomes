import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import BestSellers from "@/components/BestSellers";
import AllProducts from "@/components/AllProducts";
import FreeDeliveryBanner from "@/components/FreeDeliveryBanner";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import CustomerVideoReviews from "@/components/CustomerVideoReviews";
import VideoSliderSection from "@/components/VideoSliderSection";
import CallToAction from "@/components/CallToAction";
import BSTICertificates from "@/components/BSTICertificates";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { supabase } from "@/integrations/supabase/client";

interface SectionConfig {
  section_type: string;
  active: boolean;
  sort_order: number;
}

const sectionComponents: Record<string, React.FC<any>> = {
  hero_slider: HeroSection,
  featured_categories: CategoriesSection,
  best_sellers: BestSellers,
  all_products: AllProducts,
  why_choose_us: WhyChooseUs,
  customer_reviews: Testimonials,
  customer_video_reviews: CustomerVideoReviews,
  offer_banner: FreeDeliveryBanner,
  contact: CallToAction,
};

const Index = () => {
  const [sections, setSections] = useState<SectionConfig[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase
      .from("homepage_sections")
      .select("section_type, active, sort_order")
      .order("sort_order")
      .then(({ data }) => {
        if (data) setSections(data as SectionConfig[]);
        setLoaded(true);
      });
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {loaded ? (
          sections
            .filter((s) => s.active)
            .map((s) => {
              const Component = sectionComponents[s.section_type];
              if (!Component) return null;
              return <Component key={s.section_type} />;
            })
        ) : (
          <>
            <HeroSection />
            <CategoriesSection />
            <AllProducts />
            <WhyChooseUs />
            <Testimonials />
            <CustomerVideoReviews />
          </>
        )}
        <VideoSliderSection />
        <BSTICertificates />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
