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
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <CategoriesSection />
        <FreeDeliveryBanner />
        <AllProducts />
        <WhyChooseUs />
        
        {/* Unified Dark Section for all reviews/videos as in screenshot */}
        <div className="bg-gradient-to-b from-[hsl(258,50%,12%)] via-[hsl(260,42%,18%)] to-[hsl(262,45%,14%)] text-white">
          <Testimonials />
          <VideoSliderSection />
          <CustomerVideoReviews />
        </div>
        
        <BSTICertificates />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
