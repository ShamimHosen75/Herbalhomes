import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    text: "I've been using PureNatura's lavender soap for 3 months now and my skin has never felt better. Truly chemical-free and gentle!",
    rating: 5,
    product: "Lavender Soap",
  },
  {
    name: "James R.",
    text: "The black seed oil is incredible quality. Cold-pressed and pure — you can really tell the difference from store-bought brands.",
    rating: 5,
    product: "Black Seed Oil",
  },
  {
    name: "Amira K.",
    text: "Beautiful packaging, amazing products. The rosehip serum has transformed my skincare routine. My skin glows now!",
    rating: 5,
    product: "Rosehip Serum",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 md:py-28 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-sm font-medium tracking-widest uppercase text-primary">Reviews</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
            What Our Customers Say
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
              <p className="text-xs text-muted-foreground">Verified Buyer — {t.product}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
