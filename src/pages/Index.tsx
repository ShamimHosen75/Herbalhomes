import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import BestSellers from "@/components/BestSellers";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import OfferBanner from "@/components/OfferBanner";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <CategoriesSection />
        <BestSellers />
        <WhyChooseUs />
        <Testimonials />
        <OfferBanner />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
