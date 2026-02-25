import { Star } from "lucide-react";

const testimonials = [
  {
    name: "সারাহ মুন্নি",
    text: "হার্বাল হোমসের ল্যাভেন্ডার সাবান ৩ মাস ধরে ব্যবহার করছি। আমার ত্বক এত ভালো আগে কখনো ছিল না!",
    rating: 5,
    product: "ল্যাভেন্ডার সাবান",
  },
  {
    name: "জামিল রহমান",
    text: "কালোজিরার তেলের মান অসাধারণ। কোল্ড-প্রেসড এবং বিশুদ্ধ — বাজারের অন্যান্য ব্র্যান্ডের সাথে পার্থক্যটা স্পষ্ট।",
    rating: 5,
    product: "কালোজিরার তেল",
  },
  {
    name: "আমিরা খান",
    text: "চমৎকার প্যাকেজিং, অসাধারণ পণ্য। রোজহিপ সিরাম আমার স্কিনকেয়ার রুটিন বদলে দিয়েছে!",
    rating: 5,
    product: "রোজহিপ সিরাম",
  },
];

const Testimonials = () => {
  return (
    <section className="py-14 md:py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-10">
          আমাদের গ্রাহকরা কী বলছেন
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-card rounded-2xl p-6 border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-foreground text-sm leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">যাচাইকৃত ক্রেতা</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
