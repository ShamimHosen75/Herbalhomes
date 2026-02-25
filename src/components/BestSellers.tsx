import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const productGroups = [
  { title: "জৈব সাবান", subtitle: "প্রাকৃতিক ও হাতে তৈরি সাবান", emoji: "🧼", category: "soap" },
  { title: "প্রাকৃতিক তেল", subtitle: "বিশুদ্ধ ও কোল্ড-প্রেসড", emoji: "🫒", category: "oil" },
  { title: "ভেষজ স্কিনকেয়ার", subtitle: "ত্বকের যত্নে প্রকৃতির ছোঁয়া", emoji: "🌿", category: "skincare" },
  { title: "স্বাস্থ্যকর খাবার", subtitle: "খাদ্য সামগ্রী", emoji: "🍯", category: "food" },
];

const BestSellers = () => {
  return (
    <section id="best-sellers" className="bg-muted/50">
      {productGroups.map((group) => {
        const groupProducts = products.filter((p) => p.category === group.category).slice(0, 3);
        return (
          <div key={group.title} className="py-12 md:py-16">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{group.emoji}</span>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-foreground">{group.title}</h2>
                    <p className="text-sm text-muted-foreground">{group.subtitle}</p>
                  </div>
                </div>
                <Link to="/shop" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                  সব দেখুন <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-5">
                {groupProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="sm:hidden mt-5 text-center">
                <Link to="/shop" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  আরো দেখুন <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default BestSellers;
