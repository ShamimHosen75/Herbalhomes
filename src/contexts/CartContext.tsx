import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { type Product, type CouponRule } from "@/data/products";
import { useProducts } from "@/contexts/ProductsContext";
import { toast } from "@/hooks/use-toast";

export type CartItem = {
  productId: string;
  variantId: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (productId: string, variantId: string, quantity?: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getDiscount: () => number;
  appliedCoupon: CouponRule | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  getCartProducts: () => {
    product: Product;
    variantId: string;
    variantLabel: string;
    price: number;
    oldPrice: number | null;
    quantity: number;
    stock: number;
  }[];
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = "hh_cart";
const COUPON_KEY = "hh_coupon";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<CouponRule | null>(() => {
    try {
      const saved = localStorage.getItem(COUPON_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem(COUPON_KEY, JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem(COUPON_KEY);
    }
  }, [appliedCoupon]);

  const addItem = useCallback((productId: string, variantId: string, quantity = 1) => {
    const product = products.find((p) => p.id === productId);
    const variant = product?.variants.find((v) => v.id === variantId);
    if (!product || !variant) return;

    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId && i.variantId === variantId);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, variant.stock);
        return prev.map((i) =>
          i.productId === productId && i.variantId === variantId ? { ...i, quantity: newQty } : i
        );
      }
      return [...prev, { productId, variantId, quantity: Math.min(quantity, variant.stock) }];
    });

    toast({
      title: "কার্টে যোগ হয়েছে",
      description: `${product.name} (${variant.label}) কার্টে যোগ করা হয়েছে।`,
    });
  }, []);

  const removeItem = useCallback((productId: string, variantId: string) => {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.variantId === variantId)));
  }, []);

  const updateQuantity = useCallback((productId: string, variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, variantId);
      return;
    }
    const product = products.find((p) => p.id === productId);
    const variant = product?.variants.find((v) => v.id === variantId);
    if (!variant) return;
    const safeQty = Math.min(quantity, variant.stock);
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.variantId === variantId ? { ...i, quantity: safeQty } : i
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCoupon(null);
  }, []);

  const getCartProducts = useCallback(() => {
    return items
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        const variant = product?.variants.find((v) => v.id === item.variantId);
        if (!product || !variant) return null;
        return {
          product,
          variantId: item.variantId,
          variantLabel: variant.label,
          price: variant.price,
          oldPrice: variant.oldPrice,
          quantity: item.quantity,
          stock: variant.stock,
        };
      })
      .filter(Boolean) as ReturnType<CartContextType["getCartProducts"]>;
  }, [items]);

  const getItemCount = useCallback(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  const getSubtotal = useCallback(() => {
    return getCartProducts().reduce((sum, i) => sum + i.price * i.quantity, 0);
  }, [getCartProducts]);

  const getDiscount = useCallback(() => {
    if (!appliedCoupon) return 0;
    const subtotal = getSubtotal();
    if (subtotal < appliedCoupon.minSpend) return 0;
    if (appliedCoupon.type === "percentage") return Math.round(subtotal * (appliedCoupon.value / 100));
    if (appliedCoupon.type === "fixed") return appliedCoupon.value;
    return 0;
  }, [appliedCoupon, getSubtotal]);

  const applyCoupon = useCallback(
    (code: string): boolean => {
      const coupon = coupons.find((c) => c.code.toLowerCase() === code.toLowerCase() && c.active);
      if (!coupon) {
        toast({ title: "ত্রুটি", description: "কুপন কোড সঠিক নয়।", variant: "destructive" });
        return false;
      }
      if (new Date(coupon.expiresAt) < new Date()) {
        toast({ title: "ত্রুটি", description: "এই কুপনের মেয়াদ শেষ হয়ে গেছে।", variant: "destructive" });
        return false;
      }
      if (coupon.usedCount >= coupon.maxUses) {
        toast({ title: "ত্রুটি", description: "এই কুপন সর্বোচ্চ ব্যবহার সীমায় পৌঁছেছে।", variant: "destructive" });
        return false;
      }
      const subtotal = getSubtotal();
      if (subtotal < coupon.minSpend) {
        toast({
          title: "ত্রুটি",
          description: `এই কুপন ব্যবহার করতে সর্বনিম্ন ৳${coupon.minSpend} অর্ডার করতে হবে।`,
          variant: "destructive",
        });
        return false;
      }
      setAppliedCoupon(coupon);
      toast({ title: "সফল!", description: `কুপন "${coupon.code}" প্রয়োগ করা হয়েছে।` });
      return true;
    },
    [getSubtotal]
  );

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    toast({ title: "কুপন সরানো হয়েছে" });
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemCount,
        getSubtotal,
        getDiscount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        getCartProducts,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
