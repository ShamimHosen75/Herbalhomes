import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Pencil } from "lucide-react";

type Courier = { id: string; name: string; trackingUrl: string; phone: string; active: boolean };

const STORAGE_KEY = "hh_admin_couriers";
const defaultCouriers: Courier[] = [
  { id: "c1", name: "Pathao Courier", trackingUrl: "https://merchant.pathao.com", phone: "09678-100800", active: true },
  { id: "c2", name: "Steadfast", trackingUrl: "https://steadfast.com.bd", phone: "09678-100900", active: true },
  { id: "c3", name: "RedX", trackingUrl: "https://redx.com.bd", phone: "16900", active: false },
];

function load(): Courier[] {
  try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : defaultCouriers; } catch { return defaultCouriers; }
}

export default function AdminCourier() {
  const [items, setItems] = useState<Courier[]>(load);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<Courier>>({ active: true });
  const [editId, setEditId] = useState<string | null>(null);

  const save = (next: Courier[]) => { setItems(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); };

  const handleSave = () => {
    if (!form.name) return;
    const item: Courier = { id: editId || `c-${Date.now()}`, name: form.name!, trackingUrl: form.trackingUrl || "", phone: form.phone || "", active: form.active ?? true };
    save(editId ? items.map((i) => i.id === editId ? item : i) : [...items, item]);
    setOpen(false); setForm({ active: true }); setEditId(null);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Courier</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setForm({ active: true }); setEditId(null); } }}>
          <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Courier</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? "Edit" : "Add"} Courier</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Name" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Tracking URL" value={form.trackingUrl || ""} onChange={(e) => setForm({ ...form, trackingUrl: e.target.value })} />
              <Input placeholder="Phone" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Button onClick={handleSave} className="w-full">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NAME</TableHead>
              <TableHead>TRACKING URL</TableHead>
              <TableHead>PHONE</TableHead>
              <TableHead>ACTIVE</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="text-muted-foreground max-w-[200px] truncate">{c.trackingUrl}</TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell><Switch checked={c.active} onCheckedChange={() => save(items.map((i) => i.id === c.id ? { ...i, active: !i.active } : i))} /></TableCell>
                <TableCell className="flex gap-1 justify-end">
                  <Button variant="ghost" size="icon" onClick={() => { setForm(c); setEditId(c.id); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => save(items.filter((i) => i.id !== c.id))}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
