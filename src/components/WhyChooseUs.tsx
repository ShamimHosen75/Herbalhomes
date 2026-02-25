import { Leaf, ShieldCheck, Recycle, Users } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "100% Organic",
    description: "All products are sourced from certified organic farms with zero synthetic additives.",
  },
  {
    icon: ShieldCheck,
    title: "No Harmful Chemicals",
    description: "Free from parabens, sulfates, and artificial fragrances. Just pure nature.",
  },
  {
    icon: Recycle,
    title: "Eco-Friendly Packaging",
    description: "Biodegradable, recyclable packaging that's as kind to the earth as our products.",
  },
  {
    icon: Users,
    title: "Trusted by Thousands",
    description: "Over 50,000 happy customers trust PureNatura for their daily wellness needs.",
  },
];

const WhyChooseUs = () => {
  return (
    <section id="why-us" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-sm font-medium tracking-widest uppercase text-primary">Our Promise</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
            Why Choose PureNatura
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
