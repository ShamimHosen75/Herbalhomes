import { useProducts } from "@/contexts/ProductsContext";
import ProductCard from "@/components/ProductCard";

interface Props {
  title?: string;
  subtitle?: string;
}

const AllProducts = ({ title, subtitle }: Props) => {
  const { products } = useProducts();

  return (
    <section className="py-14 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-2">
          {title || "আমাদের সকল পণ্য"}
        </h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground text-center mb-10">{subtitle}</p>
        )}
        {!subtitle && <div className="mb-10" />}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllProducts;
