import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProducts } from "@/contexts/ProductsContext";
import PageLayout from "@/components/PageLayout";
import Breadcrumb from "@/components/Breadcrumb";

const Wishlist = () => {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();
  const { t } = useLanguage();
  const { products } = useProducts();

  const wishlistProducts = items.map((id) => products.find((p) => p.id === id)).filter(Boolean) as typeof products;

  if (wishlistProducts.length === 0) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
            <Heart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{t("wishlist.empty")}</h1>
          <p className="text-muted-foreground mb-6">{t("wishlist.empty_desc")}</p>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
            {t("wishlist.start_shopping")}
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <section className="bg-accent py-6">
        <div className="container mx-auto px-4">
          <Breadcrumb items={[{ label: t("wishlist.title") }]} />
          <h1 className="text-2xl font-bold text-foreground mt-3">{t("wishlist.title")} ({t("wishlist.items_count", { count: String(wishlistProducts.length) })})</h1>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlistProducts.map((product) => {
              const defaultVariant = product.variants[0];
              return (
                <div key={product.id} className="flex gap-4 bg-card rounded-2xl border border-border p-4">
                  <Link to={`/product/${product.slug}`} className="h-24 w-24 rounded-xl overflow-hidden bg-muted shrink-0">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${product.slug}`} className="font-semibold text-foreground text-sm hover:text-primary line-clamp-2">
                      {product.name}
                    </Link>
                    <p className="font-bold text-foreground mt-1">৳{defaultVariant.price}</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => { addItem(product.id, defaultVariant.id); removeItem(product.id); }}
                        className="flex-1 flex items-center justify-center gap-1 bg-primary text-primary-foreground py-2 rounded-lg text-xs font-semibold hover:bg-primary/90"
                      >
                        <ShoppingCart className="h-3 w-3" />
                        {t("wishlist.add_to_cart")}
                      </button>
                      <button onClick={() => removeItem(product.id)} className="h-8 w-8 flex items-center justify-center rounded-lg bg-muted text-muted-foreground hover:text-discount hover:bg-muted">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Wishlist;