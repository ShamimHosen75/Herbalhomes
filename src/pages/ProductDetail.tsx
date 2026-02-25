import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, Heart, Star, Minus, Plus, ChevronDown, ChevronUp, Check, Truck, RotateCcw, Shield } from "lucide-react";
import { getProductBySlug, getRelatedProducts, type Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import ProductCard from "@/components/ProductCard";
import PageLayout from "@/components/PageLayout";
import Breadcrumb from "@/components/Breadcrumb";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug || "");

  if (!product) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">পণ্য পাওয়া যায়নি</h1>
          <p className="text-muted-foreground mb-4">এই পণ্যটি বর্তমানে পাওয়া যাচ্ছে না।</p>
          <Link to="/shop" className="text-primary font-semibold hover:underline">শপে ফিরে যান</Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <ProductDetailContent product={product} />
    </PageLayout>
  );
};

const ProductDetailContent = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"desc" | "ingredients" | "usage" | "reviews">("desc");

  const inWishlist = isInWishlist(product.id);
  const related = getRelatedProducts(product);

  const discount = selectedVariant.oldPrice
    ? Math.round(((selectedVariant.oldPrice - selectedVariant.price) / selectedVariant.oldPrice) * 100)
    : null;

  const handleAddToCart = () => {
    addItem(product.id, selectedVariant.id, quantity);
    setQuantity(1);
  };

  const categoryLabel = {
    soap: "জৈব সাবান",
    oil: "প্রাকৃতিক তেল",
    skincare: "ভেষজ স্কিনকেয়ার",
    food: "স্বাস্থ্যকর খাবার",
  }[product.category] || product.category;

  return (
    <>
      <section className="bg-accent py-6">
        <div className="container mx-auto px-4">
          <Breadcrumb
            items={[
              { label: "পণ্য সমূহ", href: "/shop" },
              { label: categoryLabel, href: `/shop?cat=${product.category}` },
              { label: product.name },
            ]}
          />
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Images */}
            <div>
              <div className="aspect-square rounded-2xl overflow-hidden bg-muted mb-3">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`h-16 w-16 rounded-xl overflow-hidden border-2 transition-colors ${
                        selectedImage === i ? "border-primary" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              {product.badge && (
                <span className="inline-block bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-lg mb-3">
                  {product.badge}
                </span>
              )}
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{product.name}</h1>
              <p className="text-muted-foreground mb-4">{product.shortDesc}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-border"}`} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">({product.reviewCount} রিভিউ)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-foreground">৳{selectedVariant.price}</span>
                {selectedVariant.oldPrice && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">৳{selectedVariant.oldPrice}</span>
                    <span className="text-sm font-bold text-discount bg-discount/10 px-2 py-0.5 rounded-lg">-{discount}% ছাড়</span>
                  </>
                )}
              </div>

              {/* Variants */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-foreground mb-2">সাইজ/পরিমাণ:</h4>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVariant(v);
                        setQuantity(1);
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                        selectedVariant.id === v.id
                          ? "border-primary bg-accent text-primary"
                          : "border-border text-foreground hover:border-primary/50"
                      }`}
                    >
                      {v.label}
                      {v.stock <= 5 && v.stock > 0 && (
                        <span className="ml-1 text-[10px] text-discount">(মাত্র {v.stock}টি বাকি)</span>
                      )}
                      {v.stock === 0 && <span className="ml-1 text-[10px] text-muted-foreground">(স্টক শেষ)</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity + Add to Cart */}
              {selectedVariant.stock > 0 ? (
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <div className="flex items-center border border-border rounded-xl">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-11 w-11 flex items-center justify-center text-foreground hover:bg-muted rounded-l-xl"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="h-11 w-14 flex items-center justify-center text-sm font-semibold text-foreground border-x border-border">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))}
                      className="h-11 w-11 flex items-center justify-center text-foreground hover:bg-muted rounded-r-xl"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground h-11 px-6 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    কার্টে যোগ করুন — ৳{selectedVariant.price * quantity}
                  </button>
                  <button
                    onClick={() => toggleItem(product.id)}
                    className={`h-11 w-11 rounded-xl border flex items-center justify-center transition-colors ${
                      inWishlist ? "border-discount bg-discount/10 text-discount" : "border-border text-muted-foreground hover:border-primary"
                    }`}
                    aria-label="উইশলিস্ট"
                  >
                    <Heart className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
                  </button>
                </div>
              ) : (
                <div className="bg-muted rounded-xl p-4 mb-6 text-center">
                  <p className="text-sm font-semibold text-muted-foreground">এই ভ্যারিয়েন্ট বর্তমানে স্টকে নেই</p>
                </div>
              )}

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { icon: Truck, label: "ফ্রি শিপিং ৳১০০০+" },
                  { icon: RotateCcw, label: "৭ দিনে রিটার্ন" },
                  { icon: Shield, label: "১০০% অরিজিনাল" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-accent text-center">
                    <item.icon className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-medium text-foreground">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* SKU */}
              <p className="text-xs text-muted-foreground">SKU: {selectedVariant.sku}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-8 md:py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex border-b border-border mb-6 overflow-x-auto">
            {[
              { key: "desc", label: "বিবরণ" },
              { key: "ingredients", label: "উপকরণ" },
              { key: "usage", label: "ব্যবহারবিধি" },
              { key: "reviews", label: `রিভিউ (${product.reviewCount})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="max-w-3xl">
            {activeTab === "desc" && (
              <div>
                <p className="text-foreground leading-relaxed mb-5">{product.description}</p>
                <h4 className="font-semibold text-foreground mb-2">উপকারিতা:</h4>
                <ul className="space-y-1.5">
                  {product.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activeTab === "ingredients" && (
              <p className="text-foreground leading-relaxed">{product.ingredients}</p>
            )}
            {activeTab === "usage" && (
              <p className="text-foreground leading-relaxed">{product.usage}</p>
            )}
            {activeTab === "reviews" && (
              <div className="space-y-4">
                {product.reviews.map((review) => (
                  <div key={review.id} className="bg-card rounded-xl p-4 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground">{review.author}</span>
                        {review.verified && (
                          <span className="flex items-center gap-0.5 text-[10px] font-medium text-primary bg-accent px-1.5 py-0.5 rounded">
                            <Check className="h-2.5 w-2.5" /> যাচাইকৃত
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                    <div className="flex mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-border"}`} />
                      ))}
                    </div>
                    <p className="text-sm text-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FAQ */}
          {product.faq.length > 0 && (
            <div className="mt-10 max-w-3xl">
              <h3 className="text-lg font-bold text-foreground mb-4">সচরাচর জিজ্ঞাসা</h3>
              <div className="space-y-2">
                {product.faq.map((item, i) => (
                  <div key={i} className="bg-card rounded-xl border border-border overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left"
                    >
                      <span className="text-sm font-medium text-foreground">{item.q}</span>
                      {openFaq === i ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4 text-sm text-muted-foreground">{item.a}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="py-10 md:py-14">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-bold text-foreground mb-6">সম্পর্কিত পণ্য</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ProductDetail;
