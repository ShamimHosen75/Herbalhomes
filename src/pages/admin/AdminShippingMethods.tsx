import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Trash2, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type ShippingMethod = {
  id: string;
  name: string;
  description: string;
  base_rate: number;
  estimated_days: string;
  sort_order: number;
  active: boolean;
};

export default function AdminShippingMethods() {
  const [items, setItems] = useState<ShippingMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", base_rate: 0, estimated_days: "", sort_order: 0, active: true });

  const fetchMethods = async () => {
    const { data, error } = await supabase.from("shipping_methods").select("*").order("sort_order");
    if (error) { toast.error("Failed to load methods"); return; }
    setItems((data || []) as ShippingMethod[]);
    setLoading(false);
  };

  useEffect(() => { fetchMethods(); }, []);

  const resetForm = () => { setForm({ name: "", description: "", base_rate: 0, estimated_days: "", sort_order: 0, active: true }); setEditId(null); };

  const handleOpen = (method?: ShippingMethod) => {
    if (method) {
      setEditId(method.id);
      setForm({ name: method.name, description: method.description, base_rate: method.base_rate, estimated_days: method.estimated_days, sort_order: method.sort_order, active: method.active });
    } else {
      resetForm();
    }
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.name) { toast.error("Name is required"); return; }

    if (editId) {
      const { error } = await supabase.from("shipping_methods").update({
        name: form.name, description: form.description, base_rate: form.base_rate, estimated_days: form.estimated_days, sort_order: form.sort_order, active: form.active
      }).eq("id", editId);
      if (error) { toast.error("Update failed"); return; }
      toast.success("Method updated");
    } else {
      const { error } = await supabase.from("shipping_methods").insert({
        id: `sm-${Date.now()}`, name: form.name, description: form.description, base_rate: form.base_rate, estimated_days: form.estimated_days, sort_order: form.sort_order, active: form.active
      });
      if (error) { toast.error("Create failed"); return; }
      toast.success("Method created");
    }
    setOpen(false);
    resetForm();
    fetchMethods();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("shipping_methods").delete().eq("id", deleteId);
    if (error) { toast.error("Delete failed"); return; }
    toast.success("Method deleted");
    setDeleteId(null);
    fetchMethods();
  };

  const toggleActive = async (method: ShippingMethod) => {
    await supabase.from("shipping_methods").update({ active: !method.active }).eq("id", method.id);
    fetchMethods();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Shipping Methods</h1>
          <p className="text-muted-foreground text-sm">Manage delivery options for checkout</p>
        </div>
        <Button size="sm" onClick={() => handleOpen()}><Plus className="h-4 w-4 mr-1" /> Add Method</Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-center py-8">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No shipping methods yet</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((m) => (
            <div key={m.id} className="bg-card rounded-xl border border-border p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg text-foreground">{m.name}</h3>
                  <p className="text-muted-foreground text-sm">{m.description || "—"}</p>
                </div>
                <Switch checked={m.active} onCheckedChange={() => toggleActive(m)} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Base Rate:</span>
                <span className="font-medium">৳{m.base_rate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Est. Delivery:</span>
                <span className="font-medium">{m.estimated_days || "—"}</span>
              </div>
              <div className="flex gap-2 pt-1">
                <Button variant="outline" className="flex-1" size="sm" onClick={() => handleOpen(m)}>
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button variant="outline" size="icon" className="shrink-0" onClick={() => setDeleteId(m.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); setOpen(v); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Edit" : "Add"} Shipping Method</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="font-semibold">Name *</Label>
              <Input className="mt-1" placeholder="e.g., Express Delivery" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label className="font-semibold">Description</Label>
              <Textarea className="mt-1" placeholder="Brief description of this shipping option" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold">Base Rate *</Label>
                <Input className="mt-1" type="number" placeholder="0" value={form.base_rate || ""} onChange={(e) => setForm({ ...form, base_rate: +e.target.value })} />
              </div>
              <div>
                <Label className="font-semibold">Estimated Days</Label>
                <Input className="mt-1" placeholder="e.g., 3-5 days" value={form.estimated_days} onChange={(e) => setForm({ ...form, estimated_days: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label className="font-semibold">Sort Order</Label>
                <Input className="mt-1" type="number" placeholder="0" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: +e.target.value })} />
              </div>
              <div className="flex items-center gap-2 pt-5">
                <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
                <Label className="font-semibold">Active</Label>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => { setOpen(false); resetForm(); }}>Cancel</Button>
              <Button onClick={handleSave}>{editId ? "Update" : "Create"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(v) => { if (!v) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Shipping Method?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
