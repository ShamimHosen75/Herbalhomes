import { Baby, Sparkles, UtensilsCrossed, Package } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  { name: "জৈব সাবান", slug: "soap", subtitle: "প্রাকৃতিক ও হাতে তৈরি", icon: Sparkles, bg: "bg-badge-pink", color: "text-pink-500" },
  { name: "প্রাকৃতিক তেল", slug: "oil", subtitle: "কালোজিরা, নারকেল তেল", icon: Package, bg: "bg-badge-green", color: "text-primary" },
  { name: "ভেষজ স্কিনকেয়ার", slug: "skincare", subtitle: "ত্বকের যত্ন", icon: Baby, bg: "bg-badge-orange", color: "text-orange-500" },
  { name: "স্বাস্থ্যকর খাবার", slug: "food", subtitle: "খাদ্য সামগ্রী", icon: UtensilsCrossed, bg: "bg-badge-blue", color: "text-blue-500" },
];

const CategoriesSection = () => {
  return (
    <section id="categories" className="py-14 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-10">
          প্রোডাক্ট বাছাই করুন
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group flex flex-col items-center text-center p-6 md:p-8 rounded-2xl border border-border bg-card hover:shadow-lg hover:border-primary/20 transition-all duration-300"
            >
              <div className={`h-14 w-14 md:h-16 md:w-16 rounded-2xl ${cat.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <cat.icon className={`h-6 w-6 md:h-7 md:w-7 ${cat.color}`} />
              </div>
              <h3 className="font-semibold text-foreground text-sm md:text-base">{cat.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{cat.subtitle}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
