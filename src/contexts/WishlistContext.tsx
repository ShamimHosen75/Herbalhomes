import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { toast } from "@/hooks/use-toast";
import { products } from "@/data/products";

type WishlistContextType = {
  items: string[]; // product IDs
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggleItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  getCount: () => number;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);
const WL_KEY = "hh_wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WL_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(WL_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((id: string) => {
    setItems((prev) => {
      if (prev.includes(id)) return prev;
      const product = products.find((p) => p.id === id);
      if (product) toast({ title: "উইশলিস্টে যোগ হয়েছে", description: product.name });
      return [...prev, id];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i !== id));
  }, []);

  const toggleItem = useCallback((id: string) => {
    setItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      }
      const product = products.find((p) => p.id === id);
      if (product) toast({ title: "উইশলিস্টে যোগ হয়েছে", description: product.name });
      return [...prev, id];
    });
  }, []);

  const isInWishlist = useCallback((id: string) => items.includes(id), [items]);
  const getCount = useCallback(() => items.length, [items]);

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, toggleItem, isInWishlist, getCount }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
