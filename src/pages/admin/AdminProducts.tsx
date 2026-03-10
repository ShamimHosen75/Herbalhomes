import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useProducts } from "@/contexts/ProductsContext";
import { categories, type Product, type ProductVariant } from "@/data/products";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const badgeOptions = ["", "নতুন", "সেরা", "ছাড়", "জনপ্রিয়"] as const;

function emptyVariant(): ProductVariant {
  return { id: `v-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, label: "", price: 0, oldPrice: null, stock: 0, sku: "" };
}

function emptyProduct(): Partial<Product> {
  return {
    name: "", slug: "", shortDesc: "", description: "", ingredients: "", benefits: [], usage: "",
    images: [], category: "", brand: "Herbal Homes", tags: [], badge: undefined,
    variants: [emptyVariant()], reviews: [], rating: 0, reviewCount: 0, relatedIds: [],
    faq: [], metaTitle: "", metaDesc: "",
  };
}

function ProductForm({
  initial,
  onSave,
  onClose,
}: {
  initial?: Product;
  onSave: (product: Product) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Partial<Product>>(initial ? { ...initial } : emptyProduct());
  const [variants, setVariants] = useState<ProductVariant[]>(initial?.variants || [emptyVariant()]);
  const [tagsInput, setTagsInput] = useState(initial?.tags?.join(", ") || "");
  const [benefitsInput, setBenefitsInput] = useState(initial?.benefits?.join(", ") || "");
  const [imagesInput, setImagesInput] = useState(initial?.images?.join(", ") || "");

  const update = (key: keyof Product, value: any) => setForm({ ...form, [key]: value });

  const updateVariant = (index: number, key: keyof ProductVariant, value: any) => {
    const next = [...variants];
    (next[index] as any)[key] = value;
    setVariants(next);
  };

  const addVariant = () => setVariants([...variants, emptyVariant()]);
  const removeVariant = (i: number) => setVariants(variants.filter((_, idx) => idx !== i));

  const handleSubmit = () => {
    if (!form.name || !form.slug || variants.length === 0) return;

    const product: Product = {
      id: initial?.id || `p-${Date.now()}`,
      slug: form.slug!,
      name: form.name!,
      shortDesc: form.shortDesc || "",
      description: form.description || "",
      ingredients: form.ingredients || "",
      benefits: benefitsInput.split(",").map((s) => s.trim()).filter(Boolean),
      usage: form.usage || "",
      images: imagesInput.split(",").map((s) => s.trim()).filter(Boolean),
      category: form.category || "",
      subcategory: form.subcategory,
      brand: form.brand || "Herbal Homes",
      tags: tagsInput.split(",").map((s) => s.trim()).filter(Boolean),
      badge: (form.badge || undefined) as Product["badge"],
      variants,
      reviews: initial?.reviews || [],
      rating: initial?.rating || 0,
      reviewCount: initial?.reviewCount || 0,
      relatedIds: initial?.relatedIds || [],
      faq: initial?.faq || [],
      metaTitle: form.metaTitle || form.name!,
      metaDesc: form.metaDesc || form.shortDesc || "",
    };

    onSave(product);
  };

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-foreground">নাম *</label>
          <Input value={form.name || ""} onChange={(e) => { update("name", e.target.value); if (!initial) update("slug", e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")); }} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Slug *</label>
          <Input value={form.slug || ""} onChange={(e) => update("slug", e.target.value)} />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground">সংক্ষিপ্ত বিবরণ</label>
        <Input value={form.shortDesc || ""} onChange={(e) => update("shortDesc", e.target.value)} />
      </div>

      <div>
        <label className="text-sm font-medium text-foreground">বিস্তারিত বিবরণ</label>
        <Textarea rows={3} value={form.description || ""} onChange={(e) => update("description", e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-foreground">ক্যাটেগরি</label>
          <Select value={form.category || ""} onValueChange={(v) => update("category", v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">ব্যাজ</label>
          <Select value={form.badge || ""} onValueChange={(v) => update("badge", v || undefined)}>
            <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
            <SelectContent>
              {badgeOptions.map((b) => (
                <SelectItem key={b || "none"} value={b || "none"}>{b || "None"}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground">উপাদান</label>
        <Input value={form.ingredients || ""} onChange={(e) => update("ingredients", e.target.value)} />
      </div>

      <div>
        <label className="text-sm font-medium text-foreground">ব্যবহার বিধি</label>
        <Input value={form.usage || ""} onChange={(e) => update("usage", e.target.value)} />
      </div>

      <div>
        <label className="text-sm font-medium text-foreground">উপকারিতা (কমা দিয়ে)</label>
        <Input value={benefitsInput} onChange={(e) => setBenefitsInput(e.target.value)} placeholder="উপকারিতা ১, উপকারিতা ২" />
      </div>

      <div>
        <label className="text-sm font-medium text-foreground">ট্যাগ (কমা দিয়ে)</label>
        <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="ট্যাগ ১, ট্যাগ ২" />
      </div>

      <div>
        <label className="text-sm font-medium text-foreground">ছবি URL (কমা দিয়ে)</label>
        <Input value={imagesInput} onChange={(e) => setImagesInput(e.target.value)} placeholder="https://..." />
      </div>

      {/* Variants */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-foreground">ভ্যারিয়েন্ট</label>
          <Button type="button" variant="outline" size="sm" onClick={addVariant}>
            <Plus className="h-3 w-3 mr-1" /> যোগ করুন
          </Button>
        </div>
        {variants.map((v, i) => (
          <div key={v.id} className="grid grid-cols-5 gap-2 mb-2 items-end">
            <div>
              <label className="text-xs text-muted-foreground">লেবেল</label>
              <Input value={v.label} onChange={(e) => updateVariant(i, "label", e.target.value)} placeholder="100g" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">দাম</label>
              <Input type="number" value={v.price || ""} onChange={(e) => updateVariant(i, "price", +e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">আগের দাম</label>
              <Input type="number" value={v.oldPrice || ""} onChange={(e) => updateVariant(i, "oldPrice", +e.target.value || null)} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">স্টক</label>
              <Input type="number" value={v.stock || ""} onChange={(e) => updateVariant(i, "stock", +e.target.value)} />
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={() => removeVariant(i)} disabled={variants.length <= 1}>
              <X className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-2">
        <Button onClick={handleSubmit} className="flex-1">{initial ? "আপডেট করুন" : "যোগ করুন"}</Button>
        <Button variant="outline" onClick={onClose}>বাতিল</Button>
      </div>
    </div>
  );
}

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const handleSave = (product: Product) => {
    if (editProduct) {
      updateProduct(editProduct.id, product);
      toast({ title: "প্রোডাক্ট আপডেট হয়েছে!" });
    } else {
      addProduct(product);
      toast({ title: "নতুন প্রোডাক্ট যোগ হয়েছে!" });
    }
    setDialogOpen(false);
    setEditProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    toast({ title: "প্রোডাক্ট ডিলিট হয়েছে!", variant: "destructive" });
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Products ({products.length})</h1>
        <Dialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditProduct(null); }}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Product</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editProduct ? "প্রোডাক্ট এডিট করুন" : "নতুন প্রোডাক্ট যোগ করুন"}</DialogTitle>
            </DialogHeader>
            <ProductForm
              initial={editProduct || undefined}
              onSave={handleSave}
              onClose={() => { setDialogOpen(false); setEditProduct(null); }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>IMAGE</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>CATEGORY</TableHead>
              <TableHead>PRICE</TableHead>
              <TableHead>STOCK</TableHead>
              <TableHead>BADGE</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  {p.images[0] ? (
                    <img src={p.images[0]} alt={p.name} className="h-10 w-10 rounded object-cover" />
                  ) : (
                    <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">N/A</div>
                  )}
                </TableCell>
                <TableCell className="font-medium max-w-[200px] truncate">{p.name}</TableCell>
                <TableCell className="text-muted-foreground">{p.category}</TableCell>
                <TableCell>৳{p.variants[0]?.price || 0}</TableCell>
                <TableCell>{p.variants.reduce((s, v) => s + v.stock, 0)}</TableCell>
                <TableCell>
                  {p.badge && <Badge variant="secondary">{p.badge}</Badge>}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 justify-end">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>প্রোডাক্ট ডিলিট করবেন?</AlertDialogTitle>
                          <AlertDialogDescription>
                            "{p.name}" ডিলিট করলে আর ফিরিয়ে আনা যাবে না।
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>বাতিল</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(p.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            ডিলিট
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
