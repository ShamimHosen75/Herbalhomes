import { ShoppingCart, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import productSoapLavender from "@/assets/product-soap-lavender.jpg";
import productBlackseedOil from "@/assets/product-blackseed-oil.jpg";
import productFaceCream from "@/assets/product-face-cream.jpg";
import productHoney from "@/assets/product-honey.jpg";
import productCoconutOil from "@/assets/product-coconut-oil.jpg";
import productSoapCharcoal from "@/assets/product-soap-charcoal.jpg";
import productRosehipSerum from "@/assets/product-rosehip-serum.jpg";
import productHerbalTea from "@/assets/product-herbal-tea.jpg";

const allProducts = [
  { name: "ল্যাভেন্ডার জৈব সাবান", price: 250, oldPrice: 350, rating: 4.8, reviews: 124, image: productSoapLavender, badge: "সেরা", category: "সাবান" },
  { name: "কালোজিরার তেল", price: 550, oldPrice: null, rating: 4.9, reviews: 89, image: productBlackseedOil, badge: null, category: "তেল" },
  { name: "অ্যালোভেরা ফেস ক্রিম", price: 699, oldPrice: 899, rating: 4.7, reviews: 203, image: productFaceCream, badge: "ছাড়", category: "স্কিনকেয়ার" },
  { name: "খাঁটি জৈব মধু", price: 450, oldPrice: null, rating: 4.9, reviews: 156, image: productHoney, badge: null, category: "খাবার" },
  { name: "ভার্জিন নারকেল তেল", price: 380, oldPrice: 499, rating: 4.6, reviews: 98, image: productCoconutOil, badge: "ছাড়", category: "তেল" },
  { name: "চারকোল ডিটক্স সাবান", price: 299, oldPrice: null, rating: 4.8, reviews: 67, image: productSoapCharcoal, badge: "নতুন", category: "সাবান" },
  { name: "রোজহিপ ফেস সিরাম", price: 850, oldPrice: 1050, rating: 4.9, reviews: 142, image: productRosehipSerum, badge: "জনপ্রিয়", category: "স্কিনকেয়ার" },
  { name: "জৈব ক্যামোমিল চা", price: 350, oldPrice: null, rating: 4.7, reviews: 73, image: productHerbalTea, badge: null, category: "খাবার" },
];

const Shop = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Page Header */}
        <section className="bg-accent py-10 md:py-14">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Link to="/" className="hover:text-primary">হোম</Link>
              <ArrowRight className="h-3 w-3" />
              <span className="text-foreground font-medium">পণ্য সমূহ</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">সকল পণ্য</h1>
            <p className="text-muted-foreground mt-2">আমাদের সকল জৈব ও প্রাকৃতিক পণ্যের সংগ্রহ</p>
          </div>
        </section>

        {/* Filters + Products */}
        <section className="py-10 md:py-14">
          <div className="container mx-auto px-4">
            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              {["সকল", "সাবান", "তেল", "স্কিনকেয়ার", "খাবার"].map((cat, i) => (
                <button
                  key={cat}
                  className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors ${
                    i === 0
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {allProducts.map((product) => {
                const discount = product.oldPrice
                  ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                  : null;

                return (
                  <div
                    key={product.name}
                    className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      {product.badge && (
                        <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[11px] font-bold px-2.5 py-1 rounded-lg">
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <div className="p-3.5 flex flex-col flex-1">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">HERBAL HOMES</span>
                      <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2 mb-1.5 flex-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-border"}`}
                          />
                        ))}
                        <span className="text-[10px] text-muted-foreground ml-1">({product.reviews})</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-bold text-foreground">৳{product.price}</span>
                        {product.oldPrice && (
                          <span className="text-xs text-muted-foreground line-through">৳{product.oldPrice}</span>
                        )}
                        {discount && (
                          <span className="text-xs font-bold text-discount">-{discount}%</span>
                        )}
                      </div>
                      <button className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                        <ShoppingCart className="h-4 w-4" />
                        অর্ডার করুন
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
