import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { shippingMethods as seedMethods, type ShippingMethod } from "@/data/products";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Pencil } from "lucide-react";

const STORAGE_KEY = "hh_admin_shipping_methods";

function load(): ShippingMethod[] {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : seedMethods;
  } catch { return seedMethods; }
}

export default function AdminShippingMethods() {
  const [items, setItems] = useState<ShippingMethod[]>(load);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<ShippingMethod>>({});
  const [editId, setEditId] = useState<string | null>(null);

  const save = (next: ShippingMethod[]) => { setItems(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); };

  const handleSave = () => {
    if (!form.name) return;
    const item: ShippingMethod = {
      id: editId || `sm-${Date.now()}`,
      name: form.name!,
      cost: form.cost || 0,
      estimatedDays: form.estimatedDays || "",
    };
    if (editId) {
      save(items.map((i) => i.id === editId ? item : i));
    } else {
      save([...items, item]);
    }
    setOpen(false); setForm({}); setEditId(null);
  };

  const startEdit = (item: ShippingMethod) => { setForm(item); setEditId(item.id); setOpen(true); };
  const remove = (id: string) => save(items.filter((i) => i.id !== id));

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Shipping Methods</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setForm({}); setEditId(null); } }}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Method</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? "Edit" : "Add"} Shipping Method</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Name" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input type="number" placeholder="Cost (৳)" value={form.cost || ""} onChange={(e) => setForm({ ...form, cost: +e.target.value })} />
              <Input placeholder="Estimated Days" value={form.estimatedDays || ""} onChange={(e) => setForm({ ...form, estimatedDays: e.target.value })} />
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
              <TableHead>COST</TableHead>
              <TableHead>ESTIMATED DAYS</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-medium">{m.name}</TableCell>
                <TableCell>৳{m.cost}</TableCell>
                <TableCell className="text-muted-foreground">{m.estimatedDays}</TableCell>
                <TableCell className="flex gap-1 justify-end">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(m)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
