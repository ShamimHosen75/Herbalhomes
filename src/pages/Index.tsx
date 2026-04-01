import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import BestSellers from "@/components/BestSellers";
import AllProducts from "@/components/AllProducts";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import VideoSliderSection from "@/components/VideoSliderSection";
import CallToAction from "@/components/CallToAction";
import BSTICertificates from "@/components/BSTICertificates";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <CategoriesSection />
        
        <AllProducts />
        <WhyChooseUs />
        <Testimonials />
        <VideoSliderSection />
        <CallToAction />
        <BSTICertificates />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
