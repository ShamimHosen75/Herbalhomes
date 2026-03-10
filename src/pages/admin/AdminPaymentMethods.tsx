import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Trash2, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type PaymentMethod = {
  id: string;
  name: string;
  code: string;
  description: string;
  instructions: string;
  enabled: boolean;
  require_transaction_id: boolean;
  sort_order: number;
  partial_delivery: boolean;
};

export default function AdminPaymentMethods() {
  const [items, setItems] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", code: "", description: "", instructions: "",
    enabled: true, require_transaction_id: false, sort_order: 0, partial_delivery: false
  });

  const fetchMethods = async () => {
    const { data, error } = await supabase.from("payment_methods").select("*").order("sort_order");
    if (error) { toast.error("Failed to load payment methods"); return; }
    setItems((data || []) as PaymentMethod[]);
    setLoading(false);
  };

  useEffect(() => { fetchMethods(); }, []);

  const resetForm = () => {
    setForm({ name: "", code: "", description: "", instructions: "", enabled: true, require_transaction_id: false, sort_order: 0, partial_delivery: false });
    setEditId(null);
  };

  const handleOpen = (method?: PaymentMethod) => {
    if (method) {
      setEditId(method.id);
      setForm({
        name: method.name, code: method.code, description: method.description, instructions: method.instructions,
        enabled: method.enabled, require_transaction_id: method.require_transaction_id,
        sort_order: method.sort_order, partial_delivery: method.partial_delivery
      });
    } else {
      resetForm();
    }
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.code) { toast.error("Name and code are required"); return; }

    if (editId) {
      const { error } = await supabase.from("payment_methods").update({
        name: form.name, code: form.code, description: form.description, instructions: form.instructions,
        enabled: form.enabled, require_transaction_id: form.require_transaction_id,
        sort_order: form.sort_order, partial_delivery: form.partial_delivery
      }).eq("id", editId);
      if (error) { toast.error("Update failed"); return; }
      toast.success("Payment method updated");
    } else {
      const { error } = await supabase.from("payment_methods").insert({
        id: `pm-${Date.now()}`, name: form.name, code: form.code, description: form.description,
        instructions: form.instructions, enabled: form.enabled, require_transaction_id: form.require_transaction_id,
        sort_order: form.sort_order, partial_delivery: form.partial_delivery
      });
      if (error) { toast.error("Create failed"); return; }
      toast.success("Payment method created");
    }
    setOpen(false);
    resetForm();
    fetchMethods();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("payment_methods").delete().eq("id", deleteId);
    if (error) { toast.error("Delete failed"); return; }
    toast.success("Payment method deleted");
    setDeleteId(null);
    fetchMethods();
  };

  const toggleEnabled = async (method: PaymentMethod) => {
    await supabase.from("payment_methods").update({ enabled: !method.enabled }).eq("id", method.id);
    fetchMethods();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payment Methods</h1>
          <p className="text-muted-foreground text-sm">Manage payment options for checkout</p>
        </div>
        <Button size="sm" onClick={() => handleOpen()}><Plus className="h-4 w-4 mr-1" /> Add Method</Button>
      </div>

      <div className="bg-card rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NAME</TableHead>
              <TableHead>CODE</TableHead>
              <TableHead>DESCRIPTION</TableHead>
              <TableHead>TXN ID</TableHead>
              <TableHead>PARTIAL</TableHead>
              <TableHead>ORDER</TableHead>
              <TableHead>ENABLED</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : items.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No payment methods yet</TableCell></TableRow>
            ) : items.map((pm) => (
              <TableRow key={pm.id}>
                <TableCell className="font-medium">{pm.name}</TableCell>
                <TableCell><Badge variant="secondary">{pm.code}</Badge></TableCell>
                <TableCell className="text-muted-foreground max-w-[200px] truncate">{pm.description || "—"}</TableCell>
                <TableCell>{pm.require_transaction_id ? <Badge>Required</Badge> : "—"}</TableCell>
                <TableCell>{pm.partial_delivery ? <Badge variant="outline">Yes</Badge> : "—"}</TableCell>
                <TableCell>{pm.sort_order}</TableCell>
                <TableCell><Switch checked={pm.enabled} onCheckedChange={() => toggleEnabled(pm)} /></TableCell>
                <TableCell className="flex gap-1 justify-end">
                  <Button variant="ghost" size="icon" onClick={() => handleOpen(pm)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteId(pm.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); setOpen(v); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Edit" : "Add"} Payment Method</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold">Name *</Label>
                <Input className="mt-1" placeholder="e.g., bKash" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label className="font-semibold">Code *</Label>
                <Input className="mt-1" placeholder="e.g., bkash" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
              </div>
            </div>
            <div>
              <Label className="font-semibold">Description</Label>
              <Input className="mt-1" placeholder="Short description shown to customer" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <Label className="font-semibold">Instructions</Label>
              <Textarea className="mt-1" placeholder="Instructions for customer (e.g., send money to 01XXXXXXXXX)" value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="font-semibold">Enabled</Label>
              <Switch checked={form.enabled} onCheckedChange={(v) => setForm({ ...form, enabled: v })} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="font-semibold">Require Transaction ID</Label>
              <Switch checked={form.require_transaction_id} onCheckedChange={(v) => setForm({ ...form, require_transaction_id: v })} />
            </div>
            <div>
              <Label className="font-semibold">Sort Order</Label>
              <Input className="mt-1" type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: +e.target.value })} />
            </div>
            <div className="bg-muted/50 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">Partial Delivery Payment</p>
                <p className="text-muted-foreground text-xs">Customer pays advance amount, rest on delivery</p>
              </div>
              <Switch checked={form.partial_delivery} onCheckedChange={(v) => setForm({ ...form, partial_delivery: v })} />
            </div>
            <Button onClick={handleSave} className="w-full">{editId ? "Update Method" : "Create Method"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(v) => { if (!v) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Payment Method?</AlertDialogTitle>
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
