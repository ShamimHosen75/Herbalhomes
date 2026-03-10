import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { coupons as seedCoupons, type CouponRule } from "@/data/products";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

const STORAGE_KEY = "hh_admin_coupons";

function loadCoupons(): CouponRule[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : seedCoupons;
  } catch { return seedCoupons; }
}

export default function AdminCoupons() {
  const [items, setItems] = useState<CouponRule[]>(loadCoupons);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<CouponRule>>({ type: "percentage", active: true, value: 0, minSpend: 0, maxUses: 100, usedCount: 0, perUserLimit: 1 });

  const save = (next: CouponRule[]) => { setItems(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); };

  const handleAdd = () => {
    if (!form.code) return;
    const coupon: CouponRule = {
      code: form.code!.toUpperCase(),
      type: (form.type as CouponRule["type"]) || "percentage",
      value: form.value || 0,
      minSpend: form.minSpend || 0,
      maxUses: form.maxUses || 100,
      usedCount: 0,
      perUserLimit: form.perUserLimit || 1,
      expiresAt: form.expiresAt || "2026-12-31",
      active: form.active ?? true,
    };
    save([...items, coupon]);
    setOpen(false);
    setForm({ type: "percentage", active: true, value: 0, minSpend: 0, maxUses: 100, usedCount: 0, perUserLimit: 1 });
  };

  const toggleActive = (code: string) => save(items.map((c) => c.code === code ? { ...c, active: !c.active } : c));
  const remove = (code: string) => save(items.filter((c) => c.code !== code));

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Coupons</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Coupon</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Coupon</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Code (e.g. SAVE20)" value={form.code || ""} onChange={(e) => setForm({ ...form, code: e.target.value })} />
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as CouponRule["type"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                  <SelectItem value="free_shipping">Free Shipping</SelectItem>
                </SelectContent>
              </Select>
              <Input type="number" placeholder="Value" value={form.value || ""} onChange={(e) => setForm({ ...form, value: +e.target.value })} />
              <Input type="number" placeholder="Min Spend" value={form.minSpend || ""} onChange={(e) => setForm({ ...form, minSpend: +e.target.value })} />
              <Input type="number" placeholder="Max Uses" value={form.maxUses || ""} onChange={(e) => setForm({ ...form, maxUses: +e.target.value })} />
              <Input type="date" placeholder="Expires" value={form.expiresAt || ""} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
              <Button onClick={handleAdd} className="w-full">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>CODE</TableHead>
              <TableHead>TYPE</TableHead>
              <TableHead>VALUE</TableHead>
              <TableHead>MIN SPEND</TableHead>
              <TableHead>USED</TableHead>
              <TableHead>EXPIRES</TableHead>
              <TableHead>ACTIVE</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((c) => (
              <TableRow key={c.code}>
                <TableCell className="font-medium">{c.code}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{c.type === "percentage" ? "%" : c.type === "fixed" ? "৳" : "Free Ship"}</Badge>
                </TableCell>
                <TableCell>{c.type === "free_shipping" ? "—" : c.type === "percentage" ? `${c.value}%` : `৳${c.value}`}</TableCell>
                <TableCell>৳{c.minSpend}</TableCell>
                <TableCell>{c.usedCount}/{c.maxUses}</TableCell>
                <TableCell className="text-muted-foreground">{c.expiresAt}</TableCell>
                <TableCell><Switch checked={c.active} onCheckedChange={() => toggleActive(c.code)} /></TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => remove(c.code)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
