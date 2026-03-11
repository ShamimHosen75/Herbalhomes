import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import DragDropImageUpload from "@/components/admin/DragDropImageUpload";

type Slide = {
  id: string;
  image_url: string;
  banner_url: string;
  layout: string;
  heading: string;
  text: string;
  cta_text: string;
  cta_link: string;
  sort_order: number;
  active: boolean;
  created_at: string;
};

const emptyForm = (): Partial<Slide> => ({
  image_url: "",
  banner_url: "",
  layout: "card",
  heading: "",
  text: "",
  cta_text: "Shop Now",
  cta_link: "/shop",
  sort_order: 0,
  active: true,
});

export default function AdminSlider() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Slide>>(emptyForm());
  const { toast } = useToast();

  const fetchSlides = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("sliders").select("*").order("sort_order", { ascending: true }) as any;
    if (data) setSlides(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchSlides(); }, [fetchSlides]);

  const handleSave = async () => {
    if (!form.heading?.trim()) {
      toast({ title: "Heading is required", variant: "destructive" });
      return;
    }

    const payload = {
      image_url: form.image_url || "",
      banner_url: form.banner_url || "",
      layout: form.layout || "card",
      heading: form.heading || "",
      text: form.text || "",
      cta_text: form.cta_text || "Shop Now",
      cta_link: form.cta_link || "/shop",
      sort_order: form.sort_order || 0,
      active: form.active ?? true,
    };

    if (editId) {
      await supabase.from("sliders").update(payload as any).eq("id", editId);
      toast({ title: "স্লাইড আপডেট হয়েছে!" });
    } else {
      await supabase.from("sliders").insert({ id: `slide-${Date.now()}`, ...payload } as any);
      toast({ title: "নতুন স্লাইড যোগ হয়েছে!" });
    }

    setDialogOpen(false);
    setForm(emptyForm());
    setEditId(null);
    fetchSlides();
  };

  const handleEdit = (slide: Slide) => {
    setForm(slide);
    setEditId(slide.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await (supabase.from("sliders") as any).delete().eq("id", id);
    toast({ title: "স্লাইড ডিলিট হয়েছে!", variant: "destructive" });
    fetchSlides();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("sliders").update({ active: !current } as any).eq("id", id);
    setSlides((prev) => prev.map((s) => s.id === id ? { ...s, active: !current } : s));
  };

  // Removed old ImageUploadBox - now using DragDropImageUpload directly

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Slider</h1>
        <Button size="sm" onClick={() => { setForm(emptyForm()); setEditId(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-1" /> Add Slide
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border">
        {loading ? (
          <p className="p-8 text-center text-muted-foreground">Loading...</p>
        ) : slides.length === 0 ? (
          <p className="p-8 text-center text-muted-foreground">No slides yet</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>IMAGE</TableHead>
                <TableHead>LAYOUT</TableHead>
                <TableHead>HEADING</TableHead>
                <TableHead>CTA</TableHead>
                <TableHead>ORDER</TableHead>
                <TableHead>ACTIVE</TableHead>
                <TableHead className="text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slides.map((slide) => (
                <TableRow key={slide.id}>
                  <TableCell>
                    {(slide.layout === "banner" ? slide.banner_url : slide.image_url) ? (
                      <img src={slide.layout === "banner" ? slide.banner_url : slide.image_url} alt="" className="w-20 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-20 h-12 bg-muted rounded flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{slide.layout || "card"}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-sm">{slide.heading}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">{slide.text}</div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{slide.cta_text} → {slide.cta_link}</TableCell>
                  <TableCell>{slide.sort_order}</TableCell>
                  <TableCell>
                    <Switch checked={slide.active} onCheckedChange={() => toggleActive(slide.id, slide.active)} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(slide)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>স্লাইড ডিলিট করবেন?</AlertDialogTitle>
                            <AlertDialogDescription>এই স্লাইড স্থায়ীভাবে মুছে যাবে।</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>বাতিল</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(slide.id)}>ডিলিট</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(v) => { if (!v) { setForm(emptyForm()); setEditId(null); } setDialogOpen(v); }}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit" : "Add New"} Slide</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Layout Type */}
            <div>
              <Label className="text-sm font-medium">Layout Type *</Label>
              <Select value={form.layout || "card"} onValueChange={(v) => setForm(prev => ({ ...prev, layout: v }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Card Image (ডান পাশে ছবি)</SelectItem>
                  <SelectItem value="banner">Full Width Banner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Card Image - shown for card layout */}
            {form.layout === "card" && (
              <div>
                <Label className="text-sm font-medium">Card Image (ডান পাশে) *</Label>
                <DragDropImageUpload
                  value={form.image_url || ""}
                  onChange={(v) => setForm(prev => ({ ...prev, image_url: v as string }))}
                  bucket="slider-images"
                  previewSize="lg"
                />
              </div>
            )}

            {/* Banner Image - shown for banner layout */}
            {form.layout === "banner" && (
              <div>
                <Label className="text-sm font-medium">Banner Image (Full Width) *</Label>
                <DragDropImageUpload
                  value={form.banner_url || ""}
                  onChange={(v) => setForm(prev => ({ ...prev, banner_url: v as string }))}
                  bucket="slider-images"
                  previewSize="lg"
                />
              </div>
            )}

            {/* Heading */}
            <div>
              <Label className="text-sm font-medium">Heading *</Label>
              <Textarea
                value={form.heading || ""}
                onChange={(e) => setForm(prev => ({ ...prev, heading: e.target.value }))}
                className="mt-1"
                rows={2}
              />
            </div>

            {/* Text */}
            <div>
              <Label className="text-sm font-medium">Text</Label>
              <Textarea
                value={form.text || ""}
                onChange={(e) => setForm(prev => ({ ...prev, text: e.target.value }))}
                className="mt-1"
                rows={3}
              />
            </div>

            {/* CTA */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium">CTA Text *</Label>
                <Input
                  value={form.cta_text || ""}
                  onChange={(e) => setForm(prev => ({ ...prev, cta_text: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">CTA Link *</Label>
                <Input
                  value={form.cta_link || ""}
                  onChange={(e) => setForm(prev => ({ ...prev, cta_link: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Sort Order & Active */}
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <Label className="text-sm font-medium">Sort Order</Label>
                <Input
                  type="number"
                  value={form.sort_order || 0}
                  onChange={(e) => setForm(prev => ({ ...prev, sort_order: +e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div className="flex items-center gap-2 pb-2">
                <Switch
                  checked={form.active ?? true}
                  onCheckedChange={(v) => setForm(prev => ({ ...prev, active: v }))}
                />
                <Label className="text-sm">Active</Label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} className="flex-1">
                {editId ? "Update Slide" : "Create Slide"}
              </Button>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}