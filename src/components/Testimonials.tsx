import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "সারাহ মুন্নি",
    text: "পিউরন্যাচারার ল্যাভেন্ডার সাবান ৩ মাস ধরে ব্যবহার করছি। আমার ত্বক এত ভালো আগে কখনো ছিল না। সত্যিই রাসায়নিকমুক্ত এবং কোমল!",
    rating: 5,
    product: "ল্যাভেন্ডার সাবান",
  },
  {
    name: "জামিল রহমান",
    text: "কালোজিরার তেলের মান অসাধারণ। কোল্ড-প্রেসড এবং বিশুদ্ধ — বাজারের অন্যান্য ব্র্যান্ডের সাথে পার্থক্যটা স্পষ্ট বোঝা যায়।",
    rating: 5,
    product: "কালোজিরার তেল",
  },
  {
    name: "আমিরা খান",
    text: "চমৎকার প্যাকেজিং, অসাধারণ পণ্য। রোজহিপ সিরাম আমার স্কিনকেয়ার রুটিন বদলে দিয়েছে। এখন আমার ত্বক ঝলমল করে!",
    rating: 5,
    product: "রোজহিপ সিরাম",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 md:py-28 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-sm font-medium tracking-widest uppercase text-primary">রিভিউ</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
            আমাদের গ্রাহকরা কী বলছেন
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-card rounded-2xl p-8 border border-border/50 hover:shadow-md transition-shadow"
            >
              <Quote className="h-8 w-8 text-primary/20 mb-4" />
              <p className="text-foreground leading-relaxed mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-warm text-warm" />
                ))}
              </div>
              <p className="font-semibold text-foreground">{t.name}</p>
              <p className="text-xs text-muted-foreground">যাচাইকৃত ক্রেতা — {t.product}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
