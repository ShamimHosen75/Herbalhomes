import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { useProducts } from "@/contexts/ProductsContext";
import { useCategories } from "@/contexts/CategoriesContext";
import { useLanguage } from "@/contexts/LanguageContext";
import ProductCard from "@/components/ProductCard";
import PageLayout from "@/components/PageLayout";
import Breadcrumb from "@/components/Breadcrumb";

type SortOption = "newest" | "price-asc" | "price-desc" | "popular" | "rating";
const ITEMS_PER_PAGE = 8;

const Shop = () => {
  const [searchParams] = useSearchParams();
  const { products } = useProducts();
  const { categories } = useCategories();
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const cat = searchParams.get("category");
    setSelectedCategory(cat || null);
  }, [searchParams]);
  const [sort, setSort] = useState<SortOption>("popular");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [showFilters, setShowFilters] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...products];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.shortDesc.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)));
    }
    if (selectedCategory) result = result.filter((p) => p.category === selectedCategory);
    result = result.filter((p) => { const min = Math.min(...p.variants.map((v) => v.price)); return min >= priceRange[0] && min <= priceRange[1]; });
    if (inStockOnly) result = result.filter((p) => p.variants.some((v) => v.stock > 0));
    switch (sort) {
      case "price-asc": result.sort((a, b) => a.variants[0].price - b.variants[0].price); break;
      case "price-desc": result.sort((a, b) => b.variants[0].price - a.variants[0].price); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "popular": result.sort((a, b) => b.reviewCount - a.reviewCount); break;
    }
    return result;
  }, [search, selectedCategory, sort, priceRange, inStockOnly]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedProducts = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <PageLayout>
      <section className="bg-accent py-8 md:py-10">
        <div className="container mx-auto px-4">
          <Breadcrumb items={[{ label: t("shop.breadcrumb") }]} />
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mt-3">{t("shop.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("shop.subtitle")}</p>
        </div>
      </section>
      <section className="py-8 md:py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="text" placeholder={t("shop.search_placeholder")} value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="h-4 w-4 text-muted-foreground" /></button>}
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <select value={sort} onChange={(e) => setSort(e.target.value as SortOption)} className="h-11 pl-4 pr-10 rounded-xl bg-muted border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer">
                  <option value="popular">{t("shop.sort_popular")}</option>
                  <option value="newest">{t("shop.sort_newest")}</option>
                  <option value="price-asc">{t("shop.sort_price_asc")}</option>
                  <option value="price-desc">{t("shop.sort_price_desc")}</option>
                  <option value="rating">{t("shop.sort_rating")}</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              <button onClick={() => setShowFilters(!showFilters)} className={`h-11 px-4 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors ${showFilters ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-accent"}`}>
                <SlidersHorizontal className="h-4 w-4" /> {t("shop.filter")}
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="bg-card rounded-2xl border border-border p-5 mb-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">{t("shop.price_range")}</h4>
                  <div className="flex items-center gap-2">
                    <input type="number" min={0} value={priceRange[0]} onChange={(e) => { setPriceRange([Number(e.target.value), priceRange[1]]); setPage(1); }} className="w-24 h-9 px-3 rounded-lg bg-muted border-0 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="৳ ০" />
                    <span className="text-muted-foreground text-xs">—</span>
                    <input type="number" min={0} value={priceRange[1]} onChange={(e) => { setPriceRange([priceRange[0], Number(e.target.value)]); setPage(1); }} className="w-24 h-9 px-3 rounded-lg bg-muted border-0 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="৳ ২০০০" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">{t("shop.availability")}</h4>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={inStockOnly} onChange={(e) => { setInStockOnly(e.target.checked); setPage(1); }} className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30" />
                    <span className="text-sm text-foreground">{t("shop.in_stock_only")}</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-6">
            <button onClick={() => { setSelectedCategory(null); setPage(1); }} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${!selectedCategory ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}>
              {t("shop.all")} ({products.length})
            </button>
            {categories.map((cat) => {
              const count = products.filter((p) => p.category === cat.slug).length;
              return (
                <button key={cat.id} onClick={() => { setSelectedCategory(cat.slug); setPage(1); }} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${selectedCategory === cat.slug ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}>
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

          <p className="text-sm text-muted-foreground mb-4">{t("shop.products_found", { count: String(filtered.length) })}</p>

          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {paginatedProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg font-semibold text-foreground mb-2">{t("shop.no_products")}</p>
              <p className="text-sm text-muted-foreground">{t("shop.no_products_desc")}</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${page === p ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-accent"}`}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default Shop;