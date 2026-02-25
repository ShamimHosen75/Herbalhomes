import { ShoppingCart, Heart, Star, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import type { Product } from "@/data/products";
import { useState } from "react";

type Props = {
  product: Product;
  showRating?: boolean;
};

const ProductCard = ({ product, showRating = true }: Props) => {
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const defaultVariant = product.variants[0];
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);

  const discount = selectedVariant.oldPrice
    ? Math.round(((selectedVariant.oldPrice - selectedVariant.price) / selectedVariant.oldPrice) * 100)
    : null;

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product.id, selectedVariant.id);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product.id, selectedVariant.id);
    navigate("/checkout");
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product.id);
  };

  return (
    <div className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300 flex flex-col">
      <Link to={`/product/${product.slug}`} className="relative aspect-square overflow-hidden bg-muted block">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[11px] font-bold px-2.5 py-1 rounded-lg">
            {product.badge}
          </span>
        )}
        {discount && (
          <span className="absolute top-3 right-3 bg-discount text-primary-foreground text-[11px] font-bold px-2 py-1 rounded-lg">
            -{discount}%
          </span>
        )}
        <button
          onClick={handleWishlist}
          className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
          aria-label={inWishlist ? "উইশলিস্ট থেকে সরান" : "উইশলিস্টে যোগ করুন"}
        >
          <Heart className={`h-4 w-4 ${inWishlist ? "fill-discount text-discount" : "text-muted-foreground"}`} />
        </button>
      </Link>

      <div className="p-3.5 flex flex-col flex-1">
        <span className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">HERBAL HOMES</span>
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2 mb-1.5 flex-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {showRating && (
          <div className="flex items-center gap-1 mb-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-border"}`}
              />
            ))}
            <span className="text-[10px] text-muted-foreground ml-1">({product.reviewCount})</span>
          </div>
        )}

        {/* Variant selector if multiple */}
        {product.variants.length > 1 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedVariant(v);
                }}
                className={`text-[10px] px-2 py-0.5 rounded-md border transition-colors ${
                  selectedVariant.id === v.id
                    ? "border-primary bg-accent text-primary font-semibold"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-foreground text-base">৳{selectedVariant.price}</span>
          {selectedVariant.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">৳{selectedVariant.oldPrice}</span>
          )}
        </div>

        {selectedVariant.stock > 0 ? (
          <div className="flex flex-col gap-2">
            <button
              onClick={handleBuyNow}
              className="w-full flex items-center justify-center gap-1.5 bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              <Zap className="h-4 w-4" />
              এখনই কিনুন
            </button>
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-1.5 bg-accent text-primary py-2 rounded-xl text-xs font-semibold hover:bg-accent/80 border border-primary/20 transition-colors"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              কার্টে যোগ করুন
            </button>
          </div>
        ) : (
          <button
            disabled
            className="w-full flex items-center justify-center gap-2 bg-muted text-muted-foreground py-2.5 rounded-xl text-sm font-semibold cursor-not-allowed"
          >
            স্টক শেষ
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
