import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Coupon = {
  id: string;
  code: string;
  description: string;
  type: string;
  value: number;
  min_order: number;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  active: boolean;
  created_at: string;
};

const emptyForm = (): Partial<Coupon> => ({
  code: "",
  description: "",
  type: "percentage",
  value: 10,
  min_order: 0,
  max_uses: null,
  expires_at: null,
  active: true,
});

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Coupon>>(emptyForm());
  const { toast } = useToast();

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false }) as any;
    if (data) setCoupons(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchCoupons(); }, [fetchCoupons]);

  const handleSave = async () => {
    if (!form.code?.trim()) {
      toast({ title: "Code is required", variant: "destructive" });
      return;
    }

    const payload = {
      code: form.code!.toUpperCase().trim(),
      description: form.description || "",
      type: form.type || "percentage",
      value: form.value || 0,
      min_order: form.min_order || 0,
      max_uses: form.max_uses || null,
      expires_at: form.expires_at || null,
      active: form.active ?? true,
    };

    if (editId) {
      await supabase.from("coupons").update(payload as any).eq("id", editId);
      toast({ title: "কুপন আপডেট হয়েছে!" });
    } else {
      await supabase.from("coupons").insert({ id: `coupon-${Date.now()}`, used_count: 0, ...payload } as any);
      toast({ title: "নতুন কুপন তৈরি হয়েছে!" });
    }

    setDialogOpen(false);
    setForm(emptyForm());
    setEditId(null);
    fetchCoupons();
  };

  const handleEdit = (c: Coupon) => {
    setForm(c);
    setEditId(c.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await (supabase.from("coupons") as any).delete().eq("id", id);
    toast({ title: "কুপন ডিলিট হয়েছে!", variant: "destructive" });
    fetchCoupons();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("coupons").update({ active: !current } as any).eq("id", id);
    setCoupons((prev) => prev.map((c) => c.id === id ? { ...c, active: !current } : c));
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Coupons</h1>
        <Button size="sm" onClick={() => { setForm(emptyForm()); setEditId(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-1" /> Add Coupon
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border">
        {loading ? (
          <p className="p-8 text-center text-muted-foreground">Loading...</p>
        ) : coupons.length === 0 ? (
          <p className="p-8 text-center text-muted-foreground">No coupons yet</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CODE</TableHead>
                <TableHead>DESCRIPTION</TableHead>
                <TableHead>TYPE</TableHead>
                <TableHead>VALUE</TableHead>
                <TableHead>MIN ORDER</TableHead>
                <TableHead>USED</TableHead>
                <TableHead>EXPIRES</TableHead>
                <TableHead>ACTIVE</TableHead>
                <TableHead className="text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-bold">{c.code}</TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-[150px] truncate">{c.description || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {c.type === "percentage" ? "%" : c.type === "fixed" ? "৳ Fixed" : "Free Ship"}
                    </Badge>
                  </TableCell>
                  <TableCell>{c.type === "free_shipping" ? "—" : c.type === "percentage" ? `${c.value}%` : `৳${c.value}`}</TableCell>
                  <TableCell>৳{Number(c.min_order).toLocaleString("bn-BD")}</TableCell>
                  <TableCell>{c.used_count}/{c.max_uses ?? "∞"}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{c.expires_at || "Never"}</TableCell>
                  <TableCell>
                    <Switch checked={c.active} onCheckedChange={() => toggleActive(c.id, c.active)} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(c)}>
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
                            <AlertDialogTitle>কুপন ডিলিট করবেন?</AlertDialogTitle>
                            <AlertDialogDescription>"{c.code}" কুপন স্থায়ীভাবে মুছে যাবে।</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>বাতিল</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(c.id)}>ডিলিট</AlertDialogAction>
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit" : "Create"} Coupon</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Code *</Label>
              <Input
                value={form.code || ""}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="SAVE10"
                className="mt-1"
                maxLength={20}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Description</Label>
              <Input
                value={form.description || ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="10% off your order"
                className="mt-1"
                maxLength={100}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium">Type</Label>
                <Select value={form.type || "percentage"} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="free_shipping">Free Shipping</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">
                  {form.type === "percentage" ? "Discount %" : form.type === "fixed" ? "Amount (৳)" : "Value"}
                </Label>
                <Input
                  type="number"
                  value={form.value || ""}
                  onChange={(e) => setForm({ ...form, value: +e.target.value })}
                  className="mt-1"
                  disabled={form.type === "free_shipping"}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium">Min Order</Label>
                <Input
                  type="number"
                  value={form.min_order || 0}
                  onChange={(e) => setForm({ ...form, min_order: +e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Max Uses</Label>
                <Input
                  type="number"
                  value={form.max_uses ?? ""}
                  onChange={(e) => setForm({ ...form, max_uses: e.target.value ? +e.target.value : null })}
                  placeholder="Unlimited"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Expires At</Label>
              <Input
                type="date"
                value={form.expires_at || ""}
                onChange={(e) => setForm({ ...form, expires_at: e.target.value || null })}
                className="mt-1"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Active</Label>
              <Switch
                checked={form.active ?? true}
                onCheckedChange={(v) => setForm({ ...form, active: v })}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} className="flex-1">
                {editId ? "Update" : "Create"}
              </Button>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
