import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, ExternalLink, Copy, Upload, X } from "lucide-react";

interface HowToCard {
  title: string;
  description: string;
  icon: string;
}

interface LandingPage {
  id: string;
  title: string;
  slug: string;
  active: boolean;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  cta_text: string;
  product_ids: string[];
  cards: HowToCard[];
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  images: string[];
}

const emptyForm: Omit<LandingPage, "id" | "created_at"> = {
  title: "",
  slug: "",
  active: true,
  hero_title: "",
  hero_subtitle: "",
  hero_image: "",
  cta_text: "Order Now",
  product_ids: [],
  cards: [],
};

export default function AdminLandingPages() {
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPages = async () => {
    setLoading(true);
    const { data } = await supabase.from("landing_pages").select("*").order("created_at", { ascending: false });
    setPages((data as any[] || []).map(p => ({ ...p, cards: Array.isArray(p.cards) ? p.cards : JSON.parse(p.cards || "[]") })));
    setLoading(false);
  };

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("id, name, images");
    setProducts(data || []);
  };

  useEffect(() => { fetchPages(); fetchProducts(); }, []);

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9\u0980-\u09FF]+/g, "-").replace(/(^-|-$)/g, "");

  const openCreate = () => { setEditingId(null); setForm({ ...emptyForm }); setDialogOpen(true); };
  const openEdit = (p: LandingPage) => {
    setEditingId(p.id);
    setForm({ title: p.title, slug: p.slug, active: p.active, hero_title: p.hero_title, hero_subtitle: p.hero_subtitle, hero_image: p.hero_image, cta_text: p.cta_text, product_ids: p.product_ids || [], cards: p.cards || [] });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.hero_title.trim()) {
      toast({ title: "Page Title ও Hero Title আবশ্যক", variant: "destructive" });
      return;
    }
    const slug = form.slug || generateSlug(form.title);
    const payload = { ...form, slug, cards: form.cards as any };

    if (editingId) {
      await supabase.from("landing_pages").update(payload).eq("id", editingId);
      toast({ title: "ল্যান্ডিং পেজ আপডেট হয়েছে" });
    } else {
      const id = crypto.randomUUID();
      await supabase.from("landing_pages").insert({ id, ...payload });
      toast({ title: "ল্যান্ডিং পেজ তৈরি হয়েছে" });
    }
    setDialogOpen(false);
    fetchPages();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from("landing_pages").delete().eq("id", deleteId);
    toast({ title: "ল্যান্ডিং পেজ ডিলিট হয়েছে" });
    setDeleteId(null);
    fetchPages();
  };

  const toggleProduct = (productId: string) => {
    setForm(prev => {
      const ids = prev.product_ids.includes(productId)
        ? prev.product_ids.filter(id => id !== productId)
        : prev.product_ids.length < 5
          ? [...prev.product_ids, productId]
          : prev.product_ids;
      return { ...prev, product_ids: ids };
    });
  };

  const addCard = () => {
    setForm(prev => ({ ...prev, cards: [...prev.cards, { title: "", description: "", icon: "✅" }] }));
  };

  const updateCard = (index: number, field: keyof HowToCard, value: string) => {
    setForm(prev => {
      const cards = [...prev.cards];
      cards[index] = { ...cards[index], [field]: value };
      return { ...prev, cards };
    });
  };

  const removeCard = (index: number) => {
    setForm(prev => ({ ...prev, cards: prev.cards.filter((_, i) => i !== index) }));
  };

  const copyLink = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/lp/${slug}`);
    toast({ title: "লিংক কপি হয়েছে" });
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Landing Pages</h1>
          <p className="text-sm text-muted-foreground">প্রোডাক্ট ল্যান্ডিং পেজ তৈরি ও ম্যানেজ করুন</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> Create Page</Button>
      </div>

      <div className="bg-card rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">লোড হচ্ছে...</TableCell></TableRow>
            ) : pages.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">কোনো ল্যান্ডিং পেজ নেই</TableCell></TableRow>
            ) : pages.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.title}</TableCell>
                <TableCell className="text-muted-foreground font-mono text-xs">/lp/{p.slug}</TableCell>
                <TableCell>{p.product_ids?.length || 0} products</TableCell>
                <TableCell>
                  <Badge variant={p.active ? "default" : "secondary"}>{p.active ? "Active" : "Inactive"}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" onClick={() => copyLink(p.slug)} title="Copy Link"><Copy className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" asChild><a href={`/lp/${p.slug}`} target="_blank" rel="noopener"><ExternalLink className="h-4 w-4" /></a></Button>
                    <Button size="icon" variant="ghost" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setDeleteId(p.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit" : "Create"} Landing Page</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* BASIC INFO */}
            <div>
              <p className="text-xs font-semibold text-primary mb-3 uppercase tracking-wider">Basic Info</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Page Title *</Label>
                  <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
                </div>
                <div>
                  <Label>URL Slug</Label>
                  <Input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} placeholder={generateSlug(form.title) || "auto-generated"} />
                  <p className="text-xs text-muted-foreground mt-1">/lp/...</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Switch checked={form.active} onCheckedChange={v => setForm(p => ({ ...p, active: v }))} />
                <Label>Active</Label>
              </div>
            </div>

            {/* HERO SECTION */}
            <div>
              <p className="text-xs font-semibold text-primary mb-3 uppercase tracking-wider">Hero Section</p>
              <div className="space-y-3">
                <div>
                  <Label>Hero Title *</Label>
                  <Input value={form.hero_title} onChange={e => setForm(p => ({ ...p, hero_title: e.target.value }))} />
                </div>
                <div>
                  <Label>Hero Subtitle</Label>
                  <Input value={form.hero_subtitle} onChange={e => setForm(p => ({ ...p, hero_subtitle: e.target.value }))} />
                </div>
                <div>
                  <Label>Hero Image</Label>
                  <div className="flex gap-2 items-start">
                    {form.hero_image && (
                      <img src={form.hero_image} alt="" className="w-24 h-24 object-cover rounded border" />
                    )}
                    <div className="flex-1">
                      <Input placeholder="Or paste image URL" value={form.hero_image} onChange={e => setForm(p => ({ ...p, hero_image: e.target.value }))} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div>
              <Label>CTA Button Text</Label>
              <Input value={form.cta_text} onChange={e => setForm(p => ({ ...p, cta_text: e.target.value }))} />
            </div>

            {/* PRODUCTS */}
            <div>
              <p className="text-xs font-semibold text-primary mb-3 uppercase tracking-wider">Products (Max 5)</p>
              <div className="border rounded-lg p-3 max-h-48 overflow-y-auto">
                <div className="grid grid-cols-3 gap-2">
                  {products.map(prod => (
                    <label key={prod.id} className="flex items-center gap-2 cursor-pointer text-sm">
                      <Checkbox
                        checked={form.product_ids.includes(prod.id)}
                        onCheckedChange={() => toggleProduct(prod.id)}
                        disabled={!form.product_ids.includes(prod.id) && form.product_ids.length >= 5}
                      />
                      {prod.images?.[0] && (
                        <img src={prod.images[0]} alt="" className="w-8 h-8 rounded object-cover shrink-0" />
                      )}
                      <span className="truncate">{prod.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{form.product_ids.length}/5 selected</p>
            </div>

            {/* HOW TO USE CARDS */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">How to Use Cards</p>
                <Button variant="outline" size="sm" onClick={addCard}><Plus className="h-3 w-3 mr-1" /> Add Card</Button>
              </div>
              <div className="space-y-3">
                {form.cards.map((card, i) => (
                  <div key={i} className="border rounded-lg p-3 relative">
                    <button onClick={() => removeCard(i)} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive">
                      <X className="h-4 w-4" />
                    </button>
                    <div className="grid grid-cols-[60px_1fr] gap-3">
                      <div>
                        <Label className="text-xs">Icon</Label>
                        <Input value={card.icon} onChange={e => updateCard(i, "icon", e.target.value)} className="text-center text-lg" />
                      </div>
                      <div className="space-y-2">
                        <div>
                          <Label className="text-xs">Title</Label>
                          <Input value={card.title} onChange={e => updateCard(i, "title", e.target.value)} />
                        </div>
                        <div>
                          <Label className="text-xs">Description</Label>
                          <Input value={card.description} onChange={e => updateCard(i, "description", e.target.value)} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>{editingId ? "Update" : "Create"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ল্যান্ডিং পেজ ডিলিট করবেন?</AlertDialogTitle>
            <AlertDialogDescription>এই অ্যাকশন পূর্বাবস্থায় ফেরানো যাবে না।</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">ডিলিট</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
