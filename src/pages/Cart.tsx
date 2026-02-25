import { Link } from "react-router-dom";
import { ShoppingCart, Minus, Plus, Trash2, Tag, X, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import PageLayout from "@/components/PageLayout";
import Breadcrumb from "@/components/Breadcrumb";
import { useState } from "react";

const Cart = () => {
  const { getCartProducts, updateQuantity, removeItem, clearCart, getSubtotal, getDiscount, appliedCoupon, applyCoupon, removeCoupon, getItemCount } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const items = getCartProducts();
  const subtotal = getSubtotal();
  const discount = getDiscount();
  const itemCount = getItemCount();

  const handleApplyCoupon = () => {
    if (couponInput.trim()) {
      applyCoupon(couponInput.trim());
      setCouponInput("");
    }
  };

  if (items.length === 0) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
            <ShoppingCart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">আপনার কার্ট খালি</h1>
          <p className="text-muted-foreground mb-6">এখনো কোনো পণ্য যোগ করা হয়নি।</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            শপিং শুরু করুন
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <section className="bg-accent py-6">
        <div className="container mx-auto px-4">
          <Breadcrumb items={[{ label: "কার্ট" }]} />
          <h1 className="text-2xl font-bold text-foreground mt-3">শপিং কার্ট ({itemCount}টি পণ্য)</h1>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => {
                const lineTotal = item.price * item.quantity;
                return (
                  <div key={`${item.product.id}-${item.variantId}`} className="flex gap-4 bg-card rounded-2xl border border-border p-4">
                    <Link to={`/product/${item.product.slug}`} className="h-20 w-20 md:h-24 md:w-24 rounded-xl overflow-hidden bg-muted shrink-0">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.product.slug}`} className="font-semibold text-foreground text-sm hover:text-primary line-clamp-1">
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-muted-foreground mb-2">{item.variantLabel}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-border rounded-lg">
                          <button onClick={() => updateQuantity(item.product.id, item.variantId, item.quantity - 1)} className="h-8 w-8 flex items-center justify-center hover:bg-muted rounded-l-lg">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="h-8 w-10 flex items-center justify-center text-xs font-semibold border-x border-border">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.variantId, item.quantity + 1)} className="h-8 w-8 flex items-center justify-center hover:bg-muted rounded-r-lg">
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-foreground text-sm">৳{lineTotal}</span>
                          <button onClick={() => removeItem(item.product.id, item.variantId)} className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-discount rounded-lg hover:bg-muted">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      {item.stock <= 5 && (
                        <p className="text-[10px] text-discount mt-1">মাত্র {item.stock}টি বাকি আছে</p>
                      )}
                    </div>
                  </div>
                );
              })}
              <button onClick={clearCart} className="text-sm text-muted-foreground hover:text-discount transition-colors">
                কার্ট খালি করুন
              </button>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl border border-border p-5 sticky top-24">
                <h3 className="font-bold text-foreground mb-4">অর্ডার সারাংশ</h3>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">সাবটোটাল</span>
                    <span className="text-foreground font-medium">৳{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-primary">
                      <span>ডিসকাউন্ট ({appliedCoupon?.code})</span>
                      <span>-৳{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ডেলিভারি</span>
                    <span className="text-foreground">চেকআউটে নির্ধারণ হবে</span>
                  </div>
                  <div className="border-t border-border pt-2.5 flex justify-between">
                    <span className="font-bold text-foreground">মোট</span>
                    <span className="font-bold text-foreground text-lg">৳{subtotal - discount}</span>
                  </div>
                </div>

                {/* Coupon */}
                <div className="mt-5">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-accent rounded-xl p-3">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold text-primary">{appliedCoupon.code}</span>
                      </div>
                      <button onClick={removeCoupon} className="text-muted-foreground hover:text-discount">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="কুপন কোড"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                        className="flex-1 h-10 px-3 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                      >
                        প্রয়োগ
                      </button>
                    </div>
                  )}
                </div>

                <Link
                  to="/checkout"
                  className="mt-5 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  চেকআউটে যান
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link to="/shop" className="block text-center text-sm text-primary font-medium mt-3 hover:underline">
                  শপিং চালিয়ে যান
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Cart;
