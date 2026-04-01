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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {products.map((product) => {
              const variant = product.variants?.[0];
              if (!variant) return null;
              return (
                <Link
                  key={product.id}
                  to={`/product/${product.slug}`}
                  className="block bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-square bg-muted overflow-hidden">
                    <img
                      src={product.images?.[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">ALiNA</p>
                    <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2 mb-2">{product.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground text-base">৳{variant.price}</span>
                      {variant.oldPrice && (
                        <span className="text-xs text-muted-foreground line-through">৳{variant.oldPrice}</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-10">কোনো পণ্য পাওয়া যায়নি</p>
        )}
      </div>
    </section>
  );
};

export default AllProducts;
