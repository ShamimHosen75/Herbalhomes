import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { dbCategoryToApp } from "@/lib/supabase-helpers";
import type { Category } from "@/data/products";

type CategoriesContextType = {
  categories: Category[];
  loading: boolean;
  addCategory: (category: Category) => Promise<void>;
  updateCategory: (id: string, category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  refreshCategories: () => Promise<void>;
};

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("categories").select("*").order("sort_order" as any) as any;
      if (error) throw error;
      setCategories((data || []).map(dbCategoryToApp));
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = useCallback(async (cat: Category) => {
    const { error } = await supabase.from("categories").insert({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      image: cat.image,
      description: cat.description,
      count: cat.count,
    } as any);
    if (error) console.error("Error adding category:", error);
    await fetchCategories();
  }, [fetchCategories]);

  const updateCategory = useCallback(async (id: string, cat: Category) => {
    await supabase.from("categories").update({
      name: cat.name,
      slug: cat.slug,
      image: cat.image,
      description: cat.description,
      count: cat.count,
    } as any).eq("id", id);
    await fetchCategories();
  }, [fetchCategories]);

  const deleteCategory = useCallback(async (id: string) => {
    await (supabase.from("categories") as any).delete().eq("id", id);
    await fetchCategories();
  }, [fetchCategories]);

  return (
    <CategoriesContext.Provider value={{ categories, loading, addCategory, updateCategory, deleteCategory, refreshCategories: fetchCategories }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const ctx = useContext(CategoriesContext);
  if (!ctx) throw new Error("useCategories must be used within CategoriesProvider");
  return ctx;
}
