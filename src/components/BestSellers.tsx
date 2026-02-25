import { Star, ShoppingCart, Eye } from "lucide-react";
import productSoapLavender from "@/assets/product-soap-lavender.jpg";
import productBlackseedOil from "@/assets/product-blackseed-oil.jpg";
import productFaceCream from "@/assets/product-face-cream.jpg";
import productHoney from "@/assets/product-honey.jpg";
import productCoconutOil from "@/assets/product-coconut-oil.jpg";
import productSoapCharcoal from "@/assets/product-soap-charcoal.jpg";
import productRosehipSerum from "@/assets/product-rosehip-serum.jpg";
import productHerbalTea from "@/assets/product-herbal-tea.jpg";

const products = [
  { name: "ল্যাভেন্ডার জৈব সাবান", price: 250, oldPrice: 350, rating: 4.8, reviews: 124, image: productSoapLavender, badge: "সেরা বিক্রি" },
  { name: "কালোজিরার তেল", price: 550, oldPrice: null, rating: 4.9, reviews: 89, image: productBlackseedOil, badge: null },
  { name: "অ্যালোভেরা ফেস ক্রিম", price: 699, oldPrice: 899, rating: 4.7, reviews: 203, image: productFaceCream, badge: "ছাড়" },
  { name: "খাঁটি জৈব মধু", price: 450, oldPrice: null, rating: 4.9, reviews: 156, image: productHoney, badge: null },
  { name: "ভার্জিন নারকেল তেল", price: 380, oldPrice: 499, rating: 4.6, reviews: 98, image: productCoconutOil, badge: null },
  { name: "চারকোল ডিটক্স সাবান", price: 299, oldPrice: null, rating: 4.8, reviews: 67, image: productSoapCharcoal, badge: "নতুন" },
  { name: "রোজহিপ ফেস সিরাম", price: 850, oldPrice: 1050, rating: 4.9, reviews: 142, image: productRosehipSerum, badge: "জনপ্রিয়" },
  { name: "জৈব ক্যামোমিল চা", price: 350, oldPrice: null, rating: 4.7, reviews: 73, image: productHerbalTea, badge: null },
];

const BestSellers = () => {
  return (
    <section id="best-sellers" className="py-20 md:py-28 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-sm font-medium tracking-widest uppercase text-primary">সেরা পছন্দ</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
            সেরা বিক্রিত পণ্য
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <div
              key={product.name}
              className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-border/50"
            >
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
                    {product.badge}
                  </span>
                )}
                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground/5">
                  <button className="h-10 w-10 rounded-full bg-card shadow-md flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="h-10 w-10 rounded-full bg-card shadow-md flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-medium text-foreground text-sm md:text-base leading-snug line-clamp-1">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 mt-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i < Math.floor(product.rating) ? "fill-warm text-warm" : "text-border"}`}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-bold text-foreground">৳{product.price}</span>
                  {product.oldPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ৳{product.oldPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
