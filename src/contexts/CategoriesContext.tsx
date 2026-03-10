import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { categories as seedCategories, type Category } from "@/data/products";

type CategoriesContextType = {
  categories: Category[];
  addCategory: (category: Category) => void;
  updateCategory: (id: string, category: Category) => void;
  deleteCategory: (id: string) => void;
};

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);
const STORAGE_KEY = "hh_admin_categories";

function load(): Category[] {
  try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : seedCategories; } catch { return seedCategories; }
}

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(load);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(categories)); }, [categories]);

  const addCategory = useCallback((cat: Category) => setCategories((prev) => [...prev, cat]), []);
  const updateCategory = useCallback((id: string, cat: Category) => setCategories((prev) => prev.map((c) => c.id === id ? cat : c)), []);
  const deleteCategory = useCallback((id: string) => setCategories((prev) => prev.filter((c) => c.id !== id)), []);

  return (
    <CategoriesContext.Provider value={{ categories, addCategory, updateCategory, deleteCategory }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const ctx = useContext(CategoriesContext);
  if (!ctx) throw new Error("useCategories must be used within CategoriesProvider");
  return ctx;
}
