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
    sortOrder: row.sort_order ?? 0,
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
