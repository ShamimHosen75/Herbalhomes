import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Pencil } from "lucide-react";

type Slider = { id: string; title: string; subtitle: string; imageUrl: string; link: string; active: boolean; order: number };

const STORAGE_KEY = "hh_admin_sliders";
const defaultSliders: Slider[] = [
  { id: "s1", title: "প্রাকৃতিক পণ্য", subtitle: "সেরা মানের জৈব পণ্য", imageUrl: "", link: "/shop", active: true, order: 1 },
];

function load(): Slider[] {
  try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : defaultSliders; } catch { return defaultSliders; }
}

export default function AdminSlider() {
  const [items, setItems] = useState<Slider[]>(load);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<Slider>>({ active: true });
  const [editId, setEditId] = useState<string | null>(null);

  const save = (next: Slider[]) => { setItems(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); };

  const handleSave = () => {
    if (!form.title) return;
    const item: Slider = {
      id: editId || `s-${Date.now()}`, title: form.title!, subtitle: form.subtitle || "",
      imageUrl: form.imageUrl || "", link: form.link || "/", active: form.active ?? true, order: form.order || items.length + 1,
    };
    save(editId ? items.map((i) => i.id === editId ? item : i) : [...items, item]);
    setOpen(false); setForm({ active: true }); setEditId(null);
  };

  const toggleActive = (id: string) => save(items.map((i) => i.id === id ? { ...i, active: !i.active } : i));

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Slider</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setForm({ active: true }); setEditId(null); } }}>
          <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Slide</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? "Edit" : "Add"} Slide</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Title" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Input placeholder="Subtitle" value={form.subtitle || ""} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
              <Input placeholder="Image URL" value={form.imageUrl || ""} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
              <Input placeholder="Link (e.g. /shop)" value={form.link || ""} onChange={(e) => setForm({ ...form, link: e.target.value })} />
              <Input type="number" placeholder="Order" value={form.order || ""} onChange={(e) => setForm({ ...form, order: +e.target.value })} />
              <Button onClick={handleSave} className="w-full">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ORDER</TableHead>
              <TableHead>TITLE</TableHead>
              <TableHead>SUBTITLE</TableHead>
              <TableHead>LINK</TableHead>
              <TableHead>ACTIVE</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.sort((a, b) => a.order - b.order).map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.order}</TableCell>
                <TableCell className="font-medium">{s.title}</TableCell>
                <TableCell className="text-muted-foreground">{s.subtitle}</TableCell>
                <TableCell className="text-muted-foreground">{s.link}</TableCell>
                <TableCell><Switch checked={s.active} onCheckedChange={() => toggleActive(s.id)} /></TableCell>
                <TableCell className="flex gap-1 justify-end">
                  <Button variant="ghost" size="icon" onClick={() => { setForm(s); setEditId(s.id); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => save(items.filter((i) => i.id !== s.id))}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
