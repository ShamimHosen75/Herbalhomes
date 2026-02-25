import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="Natural organic products flat lay with soap, essential oils, and eucalyptus"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-xl">
          <span className="inline-block text-sm font-medium tracking-widest uppercase text-primary mb-4 animate-fade-up">
            100% Natural & Organic
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Pure Nature,{" "}
            <span className="text-primary italic">Pure You</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Embrace a chemical-free lifestyle with our handcrafted organic products.
            From nature to your doorstep — pure, honest, and sustainable.
          </p>
          <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Button size="lg" className="px-8 gap-2 text-base">
              Shop Now <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 text-base">
              Explore Categories
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
