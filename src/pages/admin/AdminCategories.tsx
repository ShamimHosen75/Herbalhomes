import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useCategories } from "@/contexts/CategoriesContext";
import type { Category } from "@/data/products";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function CategoryForm({ initial, onSave, onClose }: { initial?: Category; onSave: (c: Category) => void; onClose: () => void }) {
  const [name, setName] = useState(initial?.name || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [image, setImage] = useState(initial?.image || "");

  const handleSubmit = () => {
    if (!name) return;
    onSave({
      id: initial?.id || `cat-${Date.now()}`,
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      image,
      description,
      count: initial?.count || 0,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground">নাম *</label>
        <Input value={name} onChange={(e) => { setName(e.target.value); if (!initial) setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")); }} />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground">Slug</label>
        <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground">বিবরণ</label>
        <Input value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground">ছবি URL</label>
        <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSubmit} className="flex-1">{initial ? "আপডেট করুন" : "যোগ করুন"}</Button>
        <Button variant="outline" onClick={onClose}>বাতিল</Button>
      </div>
    </div>
  );
}

export default function AdminCategories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Category | null>(null);
  const { toast } = useToast();

  const handleSave = (cat: Category) => {
    if (editItem) {
      updateCategory(editItem.id, cat);
      toast({ title: "ক্যাটেগরি আপডেট হয়েছে!" });
    } else {
      addCategory(cat);
      toast({ title: "নতুন ক্যাটেগরি যোগ হয়েছে!" });
    }
    setDialogOpen(false);
    setEditItem(null);
  };

  const handleDelete = (id: string) => {
    deleteCategory(id);
    toast({ title: "ক্যাটেগরি ডিলিট হয়েছে!", variant: "destructive" });
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Categories ({categories.length})</h1>
        <Dialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditItem(null); }}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Category</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editItem ? "ক্যাটেগরি এডিট করুন" : "নতুন ক্যাটেগরি যোগ করুন"}</DialogTitle>
            </DialogHeader>
            <CategoryForm initial={editItem || undefined} onSave={handleSave} onClose={() => { setDialogOpen(false); setEditItem(null); }} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>IMAGE</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>SLUG</TableHead>
              <TableHead>DESCRIPTION</TableHead>
              <TableHead>PRODUCTS</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  {c.image ? (
                    <img src={c.image} alt={c.name} className="h-10 w-10 rounded object-cover" />
                  ) : (
                    <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">N/A</div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="text-muted-foreground">{c.slug}</TableCell>
                <TableCell className="text-muted-foreground max-w-[200px] truncate">{c.description}</TableCell>
                <TableCell>{c.count}</TableCell>
                <TableCell>
                  <div className="flex gap-1 justify-end">
                    <Button variant="ghost" size="icon" onClick={() => { setEditItem(c); setDialogOpen(true); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>ক্যাটেগরি ডিলিট করবেন?</AlertDialogTitle>
                          <AlertDialogDescription>"{c.name}" ডিলিট করলে আর ফিরিয়ে আনা যাবে না।</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>বাতিল</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(c.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">ডিলিট</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
