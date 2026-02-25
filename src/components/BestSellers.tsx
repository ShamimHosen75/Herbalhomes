import { ArrowRight, ShoppingCart } from "lucide-react";
import productSoapLavender from "@/assets/product-soap-lavender.jpg";
import productBlackseedOil from "@/assets/product-blackseed-oil.jpg";
import productFaceCream from "@/assets/product-face-cream.jpg";
import productHoney from "@/assets/product-honey.jpg";
import productCoconutOil from "@/assets/product-coconut-oil.jpg";
import productSoapCharcoal from "@/assets/product-soap-charcoal.jpg";
import productRosehipSerum from "@/assets/product-rosehip-serum.jpg";
import productHerbalTea from "@/assets/product-herbal-tea.jpg";
import categorySoap from "@/assets/category-soap.jpg";
import categoryOils from "@/assets/category-oils.jpg";
import categorySkincare from "@/assets/category-skincare.jpg";
import categoryFood from "@/assets/category-food.jpg";

type Product = {
  name: string;
  price: number;
  oldPrice: number | null;
  image: string;
  badge?: string;
};

const productGroups = [
  {
    title: "জৈব সাবান",
    subtitle: "প্রাকৃতিক ও হাতে তৈরি সাবান",
    emoji: "🧼",
    products: [
      { name: "ল্যাভেন্ডার জৈব সাবান", price: 250, oldPrice: 350, image: productSoapLavender, badge: "সেরা" },
      { name: "চারকোল ডিটক্স সাবান", price: 299, oldPrice: null, image: productSoapCharcoal, badge: "নতুন" },
      { name: "অর্গানিক সোপ কালেকশন", price: 450, oldPrice: 599, image: categorySoap },
    ] as Product[],
  },
  {
    title: "প্রাকৃতিক তেল",
    subtitle: "বিশুদ্ধ ও কোল্ড-প্রেসড",
    emoji: "🫒",
    products: [
      { name: "কালোজিরার তেল", price: 550, oldPrice: null, image: productBlackseedOil },
      { name: "ভার্জিন নারকেল তেল", price: 380, oldPrice: 499, image: productCoconutOil, badge: "ছাড়" },
      { name: "প্রাকৃতিক তেল কালেকশন", price: 699, oldPrice: 899, image: categoryOils },
    ] as Product[],
  },
  {
    title: "ভেষজ স্কিনকেয়ার",
    subtitle: "ত্বকের যত্নে প্রকৃতির ছোঁয়া",
    emoji: "🌿",
    products: [
      { name: "অ্যালোভেরা ফেস ক্রিম", price: 699, oldPrice: 899, image: productFaceCream, badge: "ছাড়" },
      { name: "রোজহিপ ফেস সিরাম", price: 850, oldPrice: 1050, image: productRosehipSerum, badge: "জনপ্রিয়" },
      { name: "স্কিনকেয়ার কালেকশন", price: 999, oldPrice: 1299, image: categorySkincare },
    ] as Product[],
  },
  {
    title: "স্বাস্থ্যকর খাবার",
    subtitle: "খাদ্য সামগ্রী",
    emoji: "🍯",
    products: [
      { name: "খাঁটি জৈব মধু", price: 450, oldPrice: null, image: productHoney },
      { name: "জৈব ক্যামোমিল চা", price: 350, oldPrice: null, image: productHerbalTea },
      { name: "অর্গানিক ফুড কালেকশন", price: 599, oldPrice: 799, image: categoryFood, badge: "ছাড়" },
    ] as Product[],
  },
];

const ProductCard = ({ product }: { product: Product }) => {
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  return (
    <div className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300 flex flex-col">
      {/* Image */}
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

      {/* Info */}
      <div className="p-3.5 flex flex-col flex-1">
        <span className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">HERBAL HOMES</span>
        <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2 mb-2 flex-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-foreground text-base">৳{product.price}</span>
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
};

const BestSellers = () => {
  return (
    <section id="best-sellers" className="bg-muted/50">
      {productGroups.map((group) => (
        <div key={group.title} className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            {/* Group Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{group.emoji}</span>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-foreground">{group.title}</h2>
                  <p className="text-sm text-muted-foreground">{group.subtitle}</p>
                </div>
              </div>
              <a
                href="#"
                className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                সব দেখুন <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-5">
              {group.products.map((product) => (
                <ProductCard key={product.name} product={product} />
              ))}
            </div>

            <div className="sm:hidden mt-5 text-center">
              <a
                href="#"
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
              >
                আরো দেখুন <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default BestSellers;
