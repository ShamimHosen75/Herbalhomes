import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { dbProductToApp } from "@/lib/supabase-helpers";
import type { Product } from "@/data/products";

type ProductsContextType = {
  products: Product[];
  loading: boolean;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (cat: string) => Product[];
  refreshProducts: () => Promise<void>;
  moveProduct: (id: string, direction: "up" | "down") => Promise<void>;
};

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data: rows, error } = await supabase.from("products").select("*").order("sort_order", { ascending: true }) as any;
      if (error) throw error;

      const { data: allVariants } = await supabase.from("product_variants").select("*") as any;
      const { data: allReviews } = await supabase.from("product_reviews").select("*") as any;

      const mapped = (rows || []).map((row: any) => {
        const variants = (allVariants || []).filter((v: any) => v.product_id === row.id);
        const reviews = (allReviews || []).filter((r: any) => r.product_id === row.id);
        return dbProductToApp(row, variants, reviews);
      });

      setProducts(mapped);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = useCallback(async (product: Product) => {
    const { error } = await supabase.from("products").insert({
      id: product.id,
      slug: product.slug,
      name: product.name,
      short_desc: product.shortDesc,
      description: product.description,
      ingredients: product.ingredients,
      benefits: product.benefits,
      usage_info: product.usage,
      images: product.images,
      category: product.category,
      subcategory: product.subcategory,
      brand: product.brand,
      tags: product.tags,
      badge: product.badge,
      rating: product.rating,
      review_count: product.reviewCount,
      related_ids: product.relatedIds,
      faq: product.faq as any,
      meta_title: product.metaTitle,
      meta_desc: product.metaDesc,
    } as any);

    if (error) { console.error("Error adding product:", error); return; }

    for (const v of product.variants) {
      await supabase.from("product_variants").insert({
        id: v.id,
        product_id: product.id,
        label: v.label,
        price: v.price,
        old_price: v.oldPrice,
        stock: v.stock,
        sku: v.sku,
      } as any);
    }

    await fetchProducts();
  }, [fetchProducts]);

  const updateProduct = useCallback(async (id: string, product: Product) => {
    await supabase.from("products").update({
      slug: product.slug,
      name: product.name,
      short_desc: product.shortDesc,
      description: product.description,
      ingredients: product.ingredients,
      benefits: product.benefits,
      usage_info: product.usage,
      images: product.images,
      category: product.category,
      subcategory: product.subcategory,
      brand: product.brand,
      tags: product.tags,
      badge: product.badge,
      rating: product.rating,
      review_count: product.reviewCount,
      related_ids: product.relatedIds,
      faq: product.faq as any,
      meta_title: product.metaTitle,
      meta_desc: product.metaDesc,
    } as any).eq("id", id);

    // Replace variants: delete old, insert new
    await (supabase.from("product_variants") as any).delete().eq("product_id", id);
    for (const v of product.variants) {
      await supabase.from("product_variants").insert({
        id: v.id,
        product_id: id,
        label: v.label,
        price: v.price,
        old_price: v.oldPrice,
        stock: v.stock,
        sku: v.sku,
      } as any);
    }

    await fetchProducts();
  }, [fetchProducts]);

  const deleteProduct = useCallback(async (id: string) => {
    await (supabase.from("products") as any).delete().eq("id", id);
    await fetchProducts();
  }, [fetchProducts]);

  const moveProduct = useCallback(async (id: string, direction: "up" | "down") => {
    const idx = products.findIndex((p) => p.id === id);
    if (idx < 0) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= products.length) return;

    const current = products[idx];
    const swap = products[swapIdx];

    await supabase.from("products").update({ sort_order: swap.sortOrder } as any).eq("id", current.id);
    await supabase.from("products").update({ sort_order: current.sortOrder } as any).eq("id", swap.id);
    await fetchProducts();
  }, [products, fetchProducts]);

  const getProductBySlug = useCallback(
    (slug: string) => products.find((p) => p.slug === slug),
    [products]
  );

  const getProductById = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products]
  );

  const getProductsByCategory = useCallback(
    (cat: string) => products.filter((p) => p.category === cat),
    [products]
  );

  return (
    <ProductsContext.Provider
      value={{ products, loading, addProduct, updateProduct, deleteProduct, getProductBySlug, getProductById, getProductsByCategory, refreshProducts: fetchProducts, moveProduct }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
}
