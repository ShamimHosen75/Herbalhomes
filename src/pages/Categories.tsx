import { ArrowRight, Baby, Sparkles, UtensilsCrossed, Package } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import categorySoap from "@/assets/category-soap.jpg";
import categoryOils from "@/assets/category-oils.jpg";
import categorySkincare from "@/assets/category-skincare.jpg";
import categoryFood from "@/assets/category-food.jpg";

const categories = [
  { name: "জৈব সাবান", slug: "soap", subtitle: "প্রাকৃতিক ও হাতে তৈরি সাবান", count: "৮টি পণ্য", icon: Sparkles, color: "text-pink-500", bg: "bg-badge-pink", image: categorySoap },
  { name: "প্রাকৃতিক তেল", slug: "oil", subtitle: "কালোজিরা, নারকেল ও অন্যান্য তেল", count: "৬টি পণ্য", icon: Package, color: "text-primary", bg: "bg-badge-green", image: categoryOils },
  { name: "ভেষজ স্কিনকেয়ার", slug: "skincare", subtitle: "ত্বকের যত্নে প্রকৃতির ছোঁয়া", count: "১০টি পণ্য", icon: Baby, color: "text-orange-500", bg: "bg-badge-orange", image: categorySkincare },
  { name: "স্বাস্থ্যকর খাবার", slug: "food", subtitle: "খাঁটি ও জৈব খাদ্য সামগ্রী", count: "৫টি পণ্য", icon: UtensilsCrossed, color: "text-blue-500", bg: "bg-badge-blue", image: categoryFood },
];

const Categories = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section className="bg-accent py-10 md:py-14">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Link to="/" className="hover:text-primary">হোম</Link>
              <ArrowRight className="h-3 w-3" />
              <span className="text-foreground font-medium">ক্যাটাগরি</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">পণ্যের ক্যাটাগরি</h1>
            <p className="text-muted-foreground mt-2">আপনার পছন্দ অনুযায়ী ক্যাটাগরি বেছে নিন</p>
          </div>
        </section>

        <section className="py-10 md:py-14">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  to={`/shop?category=${encodeURIComponent(cat.name)}`}
                  className="group flex overflow-hidden rounded-2xl border border-border bg-card hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                >
                  <div className="w-1/3 aspect-square overflow-hidden">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1 p-5 md:p-6 flex flex-col justify-center">
                    <div className={`h-10 w-10 rounded-xl ${cat.bg} flex items-center justify-center mb-3`}>
                      <cat.icon className={`h-5 w-5 ${cat.color}`} />
                    </div>
                    <h3 className="font-bold text-foreground text-lg mb-1">{cat.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{cat.subtitle}</p>
                    <span className="text-xs font-semibold text-primary">{cat.count}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Categories;
