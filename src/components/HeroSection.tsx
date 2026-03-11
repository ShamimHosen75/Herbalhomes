import { forwardRef } from "react";
import { ArrowRight, Truck, ShieldCheck, Star } from "lucide-react";
import { Link } from "react-router-dom";
import heroPerson from "@/assets/hero-person.png";

const HeroSection = forwardRef<HTMLElement>((_props, ref) => {
  return (
    <section ref={ref} className="relative overflow-hidden bg-gradient-to-br from-[hsl(var(--hero-gradient-start))] via-background to-[hsl(var(--hero-gradient-end))]">
    <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(var(--hero-gradient-start))] via-background to-[hsl(var(--hero-gradient-end))]">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-accent text-secondary-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              বাংলাদেশের বিশ্বস্ত অর্গানিক শপ
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-foreground leading-tight mb-5">
              আপনার পছন্দের{" "}
              <span className="text-primary">অর্গানিক পণ্য</span>{" "}
              এখন আপনার হাতের নাগালে
            </h1>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              জৈব সাবান, প্রাকৃতিক তেল, ভেষজ স্কিনকেয়ার ও স্বাস্থ্যকর খাবার — সবকিছু এক জায়গায়। ক্যাশ অন ডেলিভারি ও দ্রুত হোম ডেলিভারি সুবিধা।
            </p>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                <ShoppingCartIcon />
                শপিং শুরু করুন
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/categories"
                className="inline-flex items-center gap-2 bg-background text-foreground px-7 py-3.5 rounded-xl text-sm font-semibold border border-border hover:bg-muted transition-colors"
              >
                ক্যাটাগরি দেখুন
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1 relative flex justify-center">
            <div className="relative">
              <img
                src={heroPerson}
                alt="হার্বাল হোমস প্রতিনিধি"
                className="w-72 md:w-80 lg:w-96 h-auto object-contain relative z-10"
              />

              {/* Floating badges */}
              <div className="absolute top-8 -right-2 md:right-0 bg-background rounded-xl shadow-lg px-4 py-2.5 flex items-center gap-2 animate-float z-20">
                <div className="h-8 w-8 rounded-full bg-badge-blue flex items-center justify-center">
                  <Truck className="h-4 w-4 text-primary" />
                </div>
                <span className="text-xs font-semibold text-foreground">ফাস্ট ডেলিভারি</span>
              </div>

              <div className="absolute bottom-16 -left-4 md:left-0 bg-background rounded-xl shadow-lg px-4 py-2.5 flex items-center gap-2 animate-float z-20" style={{ animationDelay: "1s" }}>
                <div className="h-8 w-8 rounded-full bg-badge-green flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                </div>
                <span className="text-xs font-semibold text-foreground">১০০% অরিজিনাল</span>
              </div>

              <div className="absolute bottom-4 right-4 bg-background rounded-xl shadow-lg px-4 py-2.5 flex items-center gap-2 animate-float z-20" style={{ animationDelay: "2s" }}>
                <div className="h-8 w-8 rounded-full bg-badge-orange flex items-center justify-center">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                </div>
                <span className="text-xs font-semibold text-foreground">নিরাপদ সেবা</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ShoppingCartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
);

export default HeroSection;
