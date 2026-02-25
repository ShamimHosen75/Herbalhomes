import { Leaf, ShieldCheck, Recycle, Users } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "১০০% জৈব",
    description: "সকল পণ্য প্রত্যয়িত জৈব খামার থেকে সংগ্রহ করা হয়, কোনো কৃত্রিম উপাদান নেই।",
  },
  {
    icon: ShieldCheck,
    title: "ক্ষতিকর রাসায়নিক মুক্ত",
    description: "প্যারাবেন, সালফেট এবং কৃত্রিম সুগন্ধি মুক্ত। শুধুই বিশুদ্ধ প্রকৃতি।",
  },
  {
    icon: Recycle,
    title: "পরিবেশবান্ধব প্যাকেজিং",
    description: "জৈব-বিশ্লেষ্য, পুনর্ব্যবহারযোগ্য প্যাকেজিং যা পৃথিবীর জন্যও নিরাপদ।",
  },
  {
    icon: Users,
    title: "হাজারো গ্রাহকের বিশ্বাস",
    description: "৫০,০০০+ সন্তুষ্ট গ্রাহক তাদের দৈনন্দিন সুস্থতায় পিউরন্যাচারাকে বিশ্বাস করেন।",
  },
];

const WhyChooseUs = () => {
  return (
    <section id="why-us" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-sm font-medium tracking-widest uppercase text-primary">আমাদের প্রতিশ্রুতি</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
            কেন পিউরন্যাচারা বেছে নেবেন
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="text-center p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-leaf-light mb-5">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
