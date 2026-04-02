import { Truck, Package, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const FreeDeliveryBanner = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-primary via-primary to-[hsl(142,64%,22%)] relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary-foreground/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-foreground/[0.02] rounded-full" />
        {/* Dotted pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "radial-gradient(circle, hsl(var(--primary-foreground)) 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left: Main message */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-4 py-1.5 mb-4">
              <Truck className="h-4 w-4 text-primary-foreground" />
              <span className="text-xs font-semibold text-primary-foreground tracking-wide uppercase">
                সীমিত সময়ের অফার
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-foreground mb-3 leading-tight">
              সম্পূর্ণ <span className="relative inline-block">
                ফ্রি ডেলিভারি
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M1 5.5C47 2 153 2 199 5.5" stroke="hsl(var(--primary-foreground))" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
                </svg>
              </span>
            </h2>
            <p className="text-primary-foreground/75 text-base md:text-lg max-w-lg mx-auto lg:mx-0 mb-6 leading-relaxed">
              সকল পণ্যে এখন ডেলিভারি চার্জ সম্পূর্ণ ফ্রি! বাংলাদেশের যেকোনো প্রান্তে পৌঁছে যাবে আপনার পণ্য।
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2.5 bg-primary-foreground text-primary px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-primary-foreground/90 transition-all shadow-lg shadow-black/10 group"
            >
              এখনই অর্ডার করুন
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Right: Feature cards */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto lg:min-w-[280px]">
            {[
              {
                icon: Truck,
                title: "ফ্রি ডেলিভারি",
                desc: "সারাদেশে বিনামূল্যে ডেলিভারি",
              },
              {
                icon: Package,
                title: "নিরাপদ প্যাকেজিং",
                desc: "প্রতিটি পণ্য যত্নসহকারে প্যাক করা হয়",
              },
              {
                icon: ShieldCheck,
                title: "১০০% অরিজিনাল",
                desc: "সম্পূর্ণ খাঁটি ও প্রাকৃতিক পণ্য",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3.5 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/15 rounded-xl px-4 py-3.5 flex-1"
              >
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary-foreground/15 shrink-0">
                  <item.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary-foreground">{item.title}</p>
                  <p className="text-xs text-primary-foreground/60 leading-snug">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreeDeliveryBanner;
