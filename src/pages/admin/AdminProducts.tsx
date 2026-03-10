import { useState, useRef } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useProducts } from "@/contexts/ProductsContext";
import { categories, type Product, type ProductVariant } from "@/data/products";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, X, Upload, Search } from "lucide-react";
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
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.variants.some((v) => v.sku.toLowerCase().includes(search.toLowerCase()))
  );

  const allSelected = filtered.length > 0 && filtered.every((p) => selected.has(p.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((p) => p.id)));
    }
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const handleSave = async (product: Product) => {
    if (editProduct) {
      await updateProduct(editProduct.id, product);
      toast({ title: "প্রোডাক্ট আপডেট হয়েছে!" });
    } else {
      await addProduct(product);
      toast({ title: "নতুন প্রোডাক্ট যোগ হয়েছে!" });
    }
    setDialogOpen(false);
    setEditProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    setSelected((prev) => { const n = new Set(prev); n.delete(id); return n; });
    toast({ title: "প্রোডাক্ট ডিলিট হয়েছে!", variant: "destructive" });
  };

  const handleBulkDelete = async () => {
    for (const id of selected) await deleteProduct(id);
    toast({ title: `${selected.size}টি প্রোডাক্ট ডিলিট হয়েছে!`, variant: "destructive" });
    setSelected(new Set());
  };

  const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const lines = text.split("\n").filter(Boolean);
        if (lines.length < 2) return;
        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
        let count = 0;
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(",").map((c) => c.trim());
          const get = (key: string) => cols[headers.indexOf(key)] || "";
          const name = get("name");
          if (!name) continue;
          const product: Product = {
            id: `p-csv-${Date.now()}-${i}`,
            slug: get("slug") || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
            name,
            shortDesc: get("short_desc") || get("shortdesc") || "",
            description: get("description") || "",
            ingredients: get("ingredients") || "",
            benefits: [],
            usage: get("usage") || "",
            images: get("image") ? [get("image")] : [],
            category: get("category") || "",
            brand: get("brand") || "Herbal Homes",
            tags: [],
            variants: [{
              id: `v-csv-${Date.now()}-${i}`,
              label: get("variant") || "Default",
              price: parseFloat(get("price")) || 0,
              oldPrice: parseFloat(get("old_price")) || null,
              stock: parseInt(get("stock")) || 0,
              sku: get("sku") || "",
            }],
            reviews: [],
            rating: 0,
            reviewCount: 0,
            relatedIds: [],
            faq: [],
            metaTitle: name,
            metaDesc: get("short_desc") || "",
          };
          addProduct(product);
          count++;
        }
        toast({ title: `${count}টি প্রোডাক্ট ইমপোর্ট হয়েছে!` });
      } catch {
        toast({ title: "CSV ইমপোর্ট ব্যর্থ হয়েছে", variant: "destructive" });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Products</h1>
        <div className="flex gap-2">
          <input type="file" accept=".csv" ref={fileRef} className="hidden" onChange={handleCsvImport} />
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4 mr-1" /> Import CSV
          </Button>
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
      </div>

      {/* Search + bulk actions */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        {selected.size > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-1" /> Delete ({selected.size})
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{selected.size}টি প্রোডাক্ট ডিলিট করবেন?</AlertDialogTitle>
                <AlertDialogDescription>এই অ্যাকশন পূর্বাবস্থায় ফেরানো যাবে না।</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>বাতিল</AlertDialogCancel>
                <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">ডিলিট</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <div className="bg-card rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
              </TableHead>
              <TableHead>PRODUCT</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>PRICE</TableHead>
              <TableHead>STOCK</TableHead>
              <TableHead>CATEGORY</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id} data-state={selected.has(p.id) ? "selected" : undefined}>
                <TableCell>
                  <Checkbox checked={selected.has(p.id)} onCheckedChange={() => toggleOne(p.id)} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {p.images[0] ? (
                      <img src={p.images[0]} alt={p.name} className="h-10 w-10 rounded object-cover shrink-0" />
                    ) : (
                      <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground shrink-0">N/A</div>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium truncate">{p.name}</p>
                      {p.badge && <Badge variant="secondary" className="text-xs mt-0.5">{p.badge}</Badge>}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{p.variants[0]?.sku || "—"}</TableCell>
                <TableCell>৳{p.variants[0]?.price || 0}</TableCell>
                <TableCell>{p.variants.reduce((s, v) => s + v.stock, 0)}</TableCell>
                <TableCell className="text-muted-foreground">{p.category}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
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
                          <AlertDialogDescription>"{p.name}" ডিলিট করলে আর ফিরিয়ে আনা যাবে না।</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>বাতিল</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(p.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">ডিলিট</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {search ? "কোনো প্রোডাক্ট পাওয়া যায়নি" : "কোনো প্রোডাক্ট নেই"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
