import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

type ShippingZone = {
  id: string;
  name: string;
  cities: string;
  rate: number;
  delivery_time: string;
  sort_order: number;
  active: boolean;
};

export default function AdminShippingZones() {
  const [items, setItems] = useState<ShippingZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", cities: "", rate: 0, delivery_time: "", sort_order: 0, active: true });

  const fetchZones = async () => {
    const { data, error } = await supabase.from("shipping_zones").select("*").order("sort_order");
    if (error) { toast.error("Failed to load zones"); return; }
    setItems((data || []) as ShippingZone[]);
    setLoading(false);
  };

  useEffect(() => { fetchZones(); }, []);

  const resetForm = () => { setForm({ name: "", cities: "", rate: 0, delivery_time: "", sort_order: 0, active: true }); setEditId(null); };

  const handleOpen = (zone?: ShippingZone) => {
    if (zone) {
      setEditId(zone.id);
      setForm({ name: zone.name, cities: zone.cities, rate: zone.rate, delivery_time: zone.delivery_time, sort_order: zone.sort_order, active: zone.active });
    } else {
      resetForm();
    }
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.cities) { toast.error("Zone name and cities are required"); return; }

    if (editId) {
      const { error } = await supabase.from("shipping_zones").update({
        name: form.name, cities: form.cities, rate: form.rate, delivery_time: form.delivery_time, sort_order: form.sort_order, active: form.active
      }).eq("id", editId);
      if (error) { toast.error("Update failed"); return; }
      toast.success("Zone updated");
    } else {
      const { error } = await supabase.from("shipping_zones").insert({
        id: `sz-${Date.now()}`, name: form.name, cities: form.cities, rate: form.rate, delivery_time: form.delivery_time, sort_order: form.sort_order, active: form.active
      });
      if (error) { toast.error("Create failed"); return; }
      toast.success("Zone created");
    }
    setOpen(false);
    resetForm();
    fetchZones();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("shipping_zones").delete().eq("id", deleteId);
    if (error) { toast.error("Delete failed"); return; }
    toast.success("Zone deleted");
    setDeleteId(null);
    fetchZones();
  };

  const toggleActive = async (zone: ShippingZone) => {
    await supabase.from("shipping_zones").update({ active: !zone.active }).eq("id", zone.id);
    fetchZones();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Shipping Zones</h1>
        <Button size="sm" onClick={() => handleOpen()}><Plus className="h-4 w-4 mr-1" /> Add Zone</Button>
      </div>

      <div className="bg-card rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ZONE NAME</TableHead>
              <TableHead>CITIES</TableHead>
              <TableHead>RATE (৳)</TableHead>
              <TableHead>DELIVERY TIME</TableHead>
              <TableHead>ORDER</TableHead>
              <TableHead>ACTIVE</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : items.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No shipping zones yet</TableCell></TableRow>
            ) : items.map((z) => (
              <TableRow key={z.id}>
                <TableCell className="font-medium">{z.name}</TableCell>
                <TableCell className="text-muted-foreground max-w-[200px] truncate">{z.cities}</TableCell>
                <TableCell>৳{z.rate}</TableCell>
                <TableCell className="text-muted-foreground">{z.delivery_time || "—"}</TableCell>
                <TableCell>{z.sort_order}</TableCell>
                <TableCell><Switch checked={z.active} onCheckedChange={() => toggleActive(z)} /></TableCell>
                <TableCell className="flex gap-1 justify-end">
                  <Button variant="ghost" size="icon" onClick={() => handleOpen(z)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteId(z.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); setOpen(v); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Edit" : "Create"} Shipping Zone</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="font-semibold">Zone Name *</Label>
              <Input className="mt-1" placeholder="Inside Dhaka" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label className="font-semibold">Cities (comma separated) *</Label>
              <Textarea className="mt-1" placeholder="Dhaka, Gazipur, Narayanganj" value={form.cities} onChange={(e) => setForm({ ...form, cities: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold">Rate (৳) *</Label>
                <Input className="mt-1" type="number" placeholder="60" value={form.rate || ""} onChange={(e) => setForm({ ...form, rate: +e.target.value })} />
              </div>
              <div>
                <Label className="font-semibold">Delivery Time</Label>
                <Input className="mt-1" placeholder="2-3 days" value={form.delivery_time} onChange={(e) => setForm({ ...form, delivery_time: e.target.value })} />
              </div>
            </div>
            <div>
              <Label className="font-semibold">Sort Order</Label>
              <Input className="mt-1" type="number" placeholder="0" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: +e.target.value })} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="font-semibold">Active</Label>
              <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex-1">{editId ? "Update" : "Create"}</Button>
              <Button variant="outline" onClick={() => { setOpen(false); resetForm(); }}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(v) => { if (!v) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Shipping Zone?</AlertDialogTitle>
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
