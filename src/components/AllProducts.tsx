import { useProducts } from "@/contexts/ProductsContext";
import ProductCard from "@/components/ProductCard";
import { Link } from "react-router-dom";

interface Props {
  title?: string;
  subtitle?: string;
}

const AllProducts = ({ title, subtitle }: Props) => {
  const { products, loading } = useProducts();

  return (
    <section className="py-14 md:py-20 bg-accent/30">
      <div className="container mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-2">
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
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {/* Debug: show count */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              মোট {products.length}টি পণ্য দেখানো হচ্ছে
            </p>
          </>
        ) : (
          <p className="text-center text-muted-foreground py-10">কোনো পণ্য পাওয়া যায়নি</p>
        )}
      </div>
    </section>
  );
};

export default AllProducts;
