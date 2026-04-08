import { Link } from "react-router-dom";
import { useCategories } from "@/contexts/CategoriesContext";
import { useProducts } from "@/contexts/ProductsContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  title?: string;
  subtitle?: string;
}

const CategoriesSection = ({ title, subtitle }: Props) => {
  const { categories } = useCategories();
  const { products } = useProducts();
  const { t } = useLanguage();

  const getCategoryProductCount = (slug: string) =>
    products.filter((p) => p.category === slug).length;

  return (
    <section id="categories" className="py-14 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-2">
          {title || t("categories_section.title")}
        </h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground text-center mb-10">{subtitle}</p>
        )}
        {!subtitle && <div className="mb-10" />}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="group relative block overflow-hidden rounded-xl aspect-[4/5] md:aspect-[3/4]"
            >
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-muted flex items-center justify-center">
                  <span className="text-4xl">📦</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <span className="bg-primary text-primary-foreground text-xs md:text-sm font-bold uppercase tracking-wide px-5 py-2 rounded-sm shadow-lg group-hover:bg-primary/90 transition-colors">
                  {cat.name} ({getCategoryProductCount(cat.slug)})
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
