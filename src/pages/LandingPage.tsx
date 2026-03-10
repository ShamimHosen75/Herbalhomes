import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import NotFound from "@/pages/NotFound";

interface HowToCard {
  title: string;
  description: string;
  icon: string;
}

interface LandingPageData {
  id: string;
  title: string;
  slug: string;
  active: boolean;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  cta_text: string;
  product_ids: string[];
  cards: HowToCard[];
}

interface ProductWithVariant {
  id: string;
  name: string;
  slug: string;
  images: string[];
  short_desc: string;
  rating: number;
  review_count: number;
  variants: { id: string; label: string; price: number; old_price: number | null; stock: number }[];
}

export default function LandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<LandingPageData | null>(null);
  const [products, setProducts] = useState<ProductWithVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("landing_pages")
        .select("*")
        .eq("slug", slug)
        .eq("active", true)
        .single();

      if (!data) { setNotFound(true); setLoading(false); return; }

      const pageData: LandingPageData = {
        ...data,
        cards: Array.isArray(data.cards) ? data.cards as HowToCard[] : JSON.parse(data.cards as string || "[]"),
      };
      setPage(pageData);

      if (pageData.product_ids?.length) {
        const { data: prods } = await supabase
          .from("products")
          .select("id, name, slug, images, short_desc, rating, review_count")
          .in("id", pageData.product_ids);

        if (prods?.length) {
          const { data: variants } = await supabase
            .from("product_variants")
            .select("id, label, price, old_price, stock, product_id")
            .in("product_id", prods.map(p => p.id))
            .order("price");

          const enriched = prods.map(p => ({
            ...p,
            variants: (variants || []).filter(v => v.product_id === p.id),
          }));
          setProducts(enriched);
        }
      }
      setLoading(false);
    };
    load();
  }, [slug]);

  if (notFound) return <NotFound />;
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );
  if (!page) return null;

  const handleBuyNow = (product: ProductWithVariant) => {
    const variant = product.variants[0];
    if (!variant) return;
    addToCart({
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      variantLabel: variant.label,
      price: variant.price,
      image: product.images?.[0] || "",
      quantity: 1,
    });
    toast({ title: "কার্টে যোগ হয়েছে" });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(var(--hero-gradient-start))] via-background to-[hsl(var(--hero-gradient-end))]">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="flex flex-col lg:flex-row items-center gap-10">
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-5">
                  {page.hero_title}
                </h1>
                {page.hero_subtitle && (
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                    {page.hero_subtitle}
                  </p>
                )}
                <Button size="lg" className="rounded-xl text-base px-8 shadow-lg shadow-primary/20" onClick={() => {
                  document.getElementById("lp-products")?.scrollIntoView({ behavior: "smooth" });
                }}>
                  {page.cta_text}
                </Button>
              </div>
              {page.hero_image && (
                <div className="flex-1 flex justify-center">
                  <img src={page.hero_image} alt={page.hero_title} className="w-72 md:w-96 h-auto object-contain rounded-2xl" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Products */}
        {products.length > 0 && (
          <section id="lp-products" className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-10">আমাদের প্রোডাক্ট</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {products.map(product => {
                  const variant = product.variants[0];
                  return (
                    <div key={product.id} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow">
                      <Link to={`/product/${product.slug}`}>
                        <img src={product.images?.[0] || "/placeholder.svg"} alt={product.name} className="w-full h-56 object-cover" />
                      </Link>
                      <div className="p-4">
                        <Link to={`/product/${product.slug}`}>
                          <h3 className="font-semibold text-foreground mb-1 hover:text-primary transition-colors">{product.name}</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.short_desc}</p>
                        <div className="flex items-center gap-1 mb-3">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(product.rating) ? "fill-primary text-primary" : "text-muted"}`} />
                          ))}
                          <span className="text-xs text-muted-foreground ml-1">({product.review_count})</span>
                        </div>
                        {variant && (
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-lg font-bold text-primary">৳{variant.price}</span>
                              {variant.old_price && (
                                <span className="text-sm text-muted-foreground line-through ml-2">৳{variant.old_price}</span>
                              )}
                            </div>
                            <Button size="sm" onClick={() => handleBuyNow(product)}>
                              <ShoppingCart className="h-4 w-4 mr-1" /> {page.cta_text}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* How to Use Cards */}
        {page.cards.length > 0 && (
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-10">কিভাবে ব্যবহার করবেন</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {page.cards.map((card, i) => (
                  <div key={i} className="bg-card rounded-xl border border-border p-6 text-center">
                    <div className="text-4xl mb-4">{card.icon}</div>
                    <h3 className="font-semibold text-foreground mb-2">{card.title}</h3>
                    <p className="text-sm text-muted-foreground">{card.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
