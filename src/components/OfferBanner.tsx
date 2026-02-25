import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

const OfferBanner = () => {
  return (
    <section className="py-20 md:py-28 bg-primary relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary-foreground/5 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-primary-foreground/5 translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-foreground/10 mb-6">
            <Gift className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
            প্রথম অর্ডারে ২৫% ছাড় পান
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
            চেকআউটে কোড <span className="font-bold text-primary-foreground">PURENATURE25</span> ব্যবহার করুন।
            এছাড়া ৫০০ টাকার উপরে অর্ডারে ফ্রি ডেলিভারি।
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="px-10 text-base font-semibold"
          >
            অফার দেখুন
          </Button>
        </div>
      </div>
    </section>
  );
};

export default OfferBanner;
