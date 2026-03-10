import { useState, useEffect, useCallback, useRef } from "react";
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
import { Plus, Pencil, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Slide = {
  id: string;
  image_url: string;
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
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchSlides = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("sliders").select("*").order("sort_order", { ascending: true }) as any;
    if (data) setSlides(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchSlides(); }, [fetchSlides]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `slide-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("slider-images").upload(path, file);
    if (error) {
      toast({ title: "আপলোড ব্যর্থ", variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("slider-images").getPublicUrl(path);
    setForm({ ...form, image_url: urlData.publicUrl });
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.heading?.trim()) {
      toast({ title: "Heading is required", variant: "destructive" });
      return;
    }
    if (!form.text?.trim()) {
      toast({ title: "Text is required", variant: "destructive" });
      return;
    }

    const payload = {
      image_url: form.image_url || "",
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
                    {slide.image_url ? (
                      <img src={slide.image_url} alt="" className="w-20 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-20 h-12 bg-muted rounded flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
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
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit" : "Add New"} Slide</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Image Upload */}
            <div>
              <Label className="text-sm font-medium">Slide Image *</Label>
              <div className="mt-2 flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-32 h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-1 hover:border-primary/50 transition-colors"
                >
                  {form.image_url ? (
                    <img src={form.image_url} alt="" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{uploading ? "Uploading..." : "Upload Image"}</span>
                    </>
                  )}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </div>
              <Input
                placeholder="Or paste image URL"
                value={form.image_url || ""}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                className="mt-2"
              />
            </div>

            {/* Heading */}
            <div>
              <Label className="text-sm font-medium">Heading *</Label>
              <Textarea
                value={form.heading || ""}
                onChange={(e) => setForm({ ...form, heading: e.target.value })}
                className="mt-1"
                rows={2}
              />
            </div>

            {/* Text */}
            <div>
              <Label className="text-sm font-medium">Text *</Label>
              <Textarea
                value={form.text || ""}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
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
                  onChange={(e) => setForm({ ...form, cta_text: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">CTA Link *</Label>
                <Input
                  value={form.cta_link || ""}
                  onChange={(e) => setForm({ ...form, cta_link: e.target.value })}
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
                  onChange={(e) => setForm({ ...form, sort_order: +e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="flex items-center gap-2 pb-2">
                <Switch
                  checked={form.active ?? true}
                  onCheckedChange={(v) => setForm({ ...form, active: v })}
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
