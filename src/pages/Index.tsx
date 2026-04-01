import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import BestSellers from "@/components/BestSellers";
import AllProducts from "@/components/AllProducts";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import OfferBanner from "@/components/OfferBanner";
import ContactSection from "@/components/ContactSection";
import VideoSection from "@/components/VideoSection";
import BSTICertificates from "@/components/BSTICertificates";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <AllProducts />
        <CategoriesSection />
        <WhyChooseUs />
        <Testimonials />
        <BSTICertificates />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
