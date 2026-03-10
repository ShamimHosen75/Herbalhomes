import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Pencil } from "lucide-react";

type ShippingZone = { id: string; name: string; areas: string; deliveryCost: number };

const STORAGE_KEY = "hh_admin_shipping_zones";
const defaultZones: ShippingZone[] = [
  { id: "z1", name: "ঢাকা সিটি", areas: "ঢাকা মেট্রো এরিয়া", deliveryCost: 60 },
  { id: "z2", name: "ঢাকার বাইরে", areas: "সারা বাংলাদেশ", deliveryCost: 120 },
];

function load(): ShippingZone[] {
  try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : defaultZones; } catch { return defaultZones; }
}

export default function AdminShippingZones() {
  const [items, setItems] = useState<ShippingZone[]>(load);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<ShippingZone>>({});
  const [editId, setEditId] = useState<string | null>(null);

  const save = (next: ShippingZone[]) => { setItems(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); };

  const handleSave = () => {
    if (!form.name) return;
    const item: ShippingZone = { id: editId || `z-${Date.now()}`, name: form.name!, areas: form.areas || "", deliveryCost: form.deliveryCost || 0 };
    save(editId ? items.map((i) => i.id === editId ? item : i) : [...items, item]);
    setOpen(false); setForm({}); setEditId(null);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Shipping Zones</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setForm({}); setEditId(null); } }}>
          <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Zone</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? "Edit" : "Add"} Shipping Zone</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Zone Name" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Areas / Coverage" value={form.areas || ""} onChange={(e) => setForm({ ...form, areas: e.target.value })} />
              <Input type="number" placeholder="Delivery Cost (৳)" value={form.deliveryCost || ""} onChange={(e) => setForm({ ...form, deliveryCost: +e.target.value })} />
              <Button onClick={handleSave} className="w-full">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ZONE</TableHead>
              <TableHead>AREAS</TableHead>
              <TableHead>COST</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((z) => (
              <TableRow key={z.id}>
                <TableCell className="font-medium">{z.name}</TableCell>
                <TableCell className="text-muted-foreground">{z.areas}</TableCell>
                <TableCell>৳{z.deliveryCost}</TableCell>
                <TableCell className="flex gap-1 justify-end">
                  <Button variant="ghost" size="icon" onClick={() => { setForm(z); setEditId(z.id); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => save(items.filter((i) => i.id !== z.id))}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
