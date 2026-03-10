import { supabase } from "@/integrations/supabase/client";
import { products as seedProducts, categories as seedCategories } from "@/data/products";
import type { Product, Category, ProductVariant, ProductReview } from "@/data/products";

// ─── Map DB row → App types ───────────────────────────

export function dbProductToApp(row: any, variants: any[], reviews: any[]): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDesc: row.short_desc,
    description: row.description,
    ingredients: row.ingredients,
    benefits: row.benefits || [],
    usage: row.usage_info,
    images: row.images || [],
    category: row.category,
    subcategory: row.subcategory,
    brand: row.brand,
    tags: row.tags || [],
    badge: row.badge,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    relatedIds: row.related_ids || [],
    faq: row.faq || [],
    metaTitle: row.meta_title,
    metaDesc: row.meta_desc,
    variants: variants.map((v) => ({
      id: v.id,
      label: v.label,
      price: Number(v.price),
      oldPrice: v.old_price ? Number(v.old_price) : null,
      stock: v.stock,
      sku: v.sku,
    })),
    reviews: reviews.map((r) => ({
      id: r.id,
      author: r.author,
      rating: r.rating,
      comment: r.comment,
      date: r.date,
      verified: r.verified,
    })),
  };
}

export function dbCategoryToApp(row: any): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    image: row.image,
    description: row.description,
    count: row.count,
  };
}

// ─── Seed database if empty ───────────────────────────

export async function seedDatabaseIfEmpty() {
  // Check if products exist
  const { count } = await supabase.from("products").select("id", { count: "exact", head: true });
  if (count && count > 0) return;

  console.log("Seeding database...");

  // Seed categories
  for (const cat of seedCategories) {
    await supabase.from("categories").insert({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      image: cat.image,
      description: cat.description,
      count: cat.count,
    } as any);
  }

  // Seed products with variants and reviews
  for (const p of seedProducts) {
    const { error } = await supabase.from("products").insert({
      id: p.id,
      slug: p.slug,
      name: p.name,
      short_desc: p.shortDesc,
      description: p.description,
      ingredients: p.ingredients,
      benefits: p.benefits,
      usage_info: p.usage,
      images: p.images,
      category: p.category,
      subcategory: p.subcategory,
      brand: p.brand,
      tags: p.tags,
      badge: p.badge,
      rating: p.rating,
      review_count: p.reviewCount,
      related_ids: p.relatedIds,
      faq: p.faq as any,
      meta_title: p.metaTitle,
      meta_desc: p.metaDesc,
    } as any);

    if (error) {
      console.error("Error seeding product", p.id, error);
      continue;
    }

    // Insert variants
    for (const v of p.variants) {
      await supabase.from("product_variants").insert({
        id: v.id,
        product_id: p.id,
        label: v.label,
        price: v.price,
        old_price: v.oldPrice,
        stock: v.stock,
        sku: v.sku,
      } as any);
    }

    // Insert reviews
    for (const r of p.reviews) {
      await supabase.from("product_reviews").insert({
        product_id: p.id,
        author: r.author,
        rating: r.rating,
        comment: r.comment,
        date: r.date,
        verified: r.verified,
      } as any);
    }
  }

  console.log("Database seeded successfully!");
}
