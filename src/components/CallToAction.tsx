import { ArrowRight, ShoppingBag, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="py-16 md:py-24 bg-primary relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/5 rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-foreground/5 rounded-full translate-y-1/3 -translate-x-1/4" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
            প্রাকৃতিক পণ্যে সুস্থ জীবনযাপন শুরু করুন
          </h2>
          <p className="text-primary-foreground/80 text-sm md:text-base mb-8 max-w-xl mx-auto leading-relaxed">
            ১০০% প্রাকৃতিক ও ভেষজ উপাদানে তৈরি আমাদের পণ্য ব্যবহার করুন।
            আজই অর্ডার করুন এবং পান বিশেষ ছাড়!
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 bg-primary-foreground text-primary px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-primary-foreground/90 transition-colors shadow-lg"
            >
              <ShoppingBag className="h-4 w-4" />
              এখনই কেনাকাটা করুন
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="tel:+8801712345678"
              className="inline-flex items-center justify-center gap-2 bg-primary-foreground/15 text-primary-foreground border border-primary-foreground/30 px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-primary-foreground/25 transition-colors"
            >
              <Phone className="h-4 w-4" />
              কল করুন
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
