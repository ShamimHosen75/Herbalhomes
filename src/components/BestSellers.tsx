import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useProducts } from "@/contexts/ProductsContext";
import { useCategories } from "@/contexts/CategoriesContext";
import ProductCard from "@/components/ProductCard";

interface Props {
  title?: string;
  subtitle?: string;
  content?: any;
}

const BestSellers = ({ title, subtitle }: Props) => {
  const { products } = useProducts();
  return (
    <section id="best-sellers" className="bg-muted/50">
      {title && (
        <div className="container mx-auto px-4 pt-12 md:pt-16">
          <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-1">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground text-center">{subtitle}</p>}
        </div>
      )}
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
