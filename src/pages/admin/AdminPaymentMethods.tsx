import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Pencil } from "lucide-react";

type PaymentMethod = { id: string; name: string; description: string; instructions: string; active: boolean };

const STORAGE_KEY = "hh_admin_payment_methods";
const defaults: PaymentMethod[] = [
  { id: "pm1", name: "Cash on Delivery", description: "পণ্য হাতে পেয়ে পেমেন্ট করুন", instructions: "ডেলিভারি ম্যানকে টাকা দিন", active: true },
  { id: "pm2", name: "bKash", description: "বিকাশ পেমেন্ট", instructions: "01XXXXXXXXX নম্বরে Send Money করুন", active: false },
  { id: "pm3", name: "Nagad", description: "নগদ পেমেন্ট", instructions: "01XXXXXXXXX নম্বরে Send Money করুন", active: false },
];

function load(): PaymentMethod[] {
  try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : defaults; } catch { return defaults; }
}

export default function AdminPaymentMethods() {
  const [items, setItems] = useState<PaymentMethod[]>(load);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<PaymentMethod>>({ active: true });
  const [editId, setEditId] = useState<string | null>(null);

  const save = (next: PaymentMethod[]) => { setItems(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); };

  const handleSave = () => {
    if (!form.name) return;
    const item: PaymentMethod = { id: editId || `pm-${Date.now()}`, name: form.name!, description: form.description || "", instructions: form.instructions || "", active: form.active ?? true };
    save(editId ? items.map((i) => i.id === editId ? item : i) : [...items, item]);
    setOpen(false); setForm({ active: true }); setEditId(null);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Payment Methods</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setForm({ active: true }); setEditId(null); } }}>
          <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Method</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? "Edit" : "Add"} Payment Method</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Name" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Description" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <Input placeholder="Instructions" value={form.instructions || ""} onChange={(e) => setForm({ ...form, instructions: e.target.value })} />
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
              <TableHead>DESCRIPTION</TableHead>
              <TableHead>ACTIVE</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((pm) => (
              <TableRow key={pm.id}>
                <TableCell className="font-medium">{pm.name}</TableCell>
                <TableCell className="text-muted-foreground">{pm.description}</TableCell>
                <TableCell><Switch checked={pm.active} onCheckedChange={() => save(items.map((i) => i.id === pm.id ? { ...i, active: !i.active } : i))} /></TableCell>
                <TableCell className="flex gap-1 justify-end">
                  <Button variant="ghost" size="icon" onClick={() => { setForm(pm); setEditId(pm.id); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => save(items.filter((i) => i.id !== pm.id))}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
