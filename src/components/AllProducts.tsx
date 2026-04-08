import { useMemo } from "react";
import { useProducts } from "@/contexts/ProductsContext";
import { useCategories } from "@/contexts/CategoriesContext";
import ProductCard from "@/components/ProductCard";

interface Props {
  title?: string;
  subtitle?: string;
}

const AllProducts = ({ title, subtitle }: Props) => {
  const { products, loading } = useProducts();
  const { categories } = useCategories();

  const grouped = useMemo(() => {
    if (!products.length || !categories.length) return [];

    return categories
      .map((cat) => ({
        category: cat,
        items: products.filter(
          (p) => p.category?.toLowerCase() === cat.slug?.toLowerCase()
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [products, categories]);

  return (
    <section className="py-14 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-2">
          {title || "আমাদের সকল পণ্য"}
        </h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground text-center mb-10">{subtitle}</p>
        )}
        {!subtitle && <div className="mb-10" />}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
                <div className="aspect-square bg-muted" />
                <div className="p-3.5 space-y-2">
                  <div className="h-3 bg-muted rounded w-1/3" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-9 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : grouped.length > 0 ? (
          <div className="space-y-12">
            {grouped.map((group) => (
              <div key={group.category.id}>
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-5 border-l-4 border-primary pl-3">
                  {group.category.name}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                  {group.items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-10">কোনো পণ্য পাওয়া যায়নি</p>
        )}
      </div>
    </section>
  );
};

export default AllProducts;
