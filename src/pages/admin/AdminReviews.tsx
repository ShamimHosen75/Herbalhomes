import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Trash2, X, Plus, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import DragDropImageUpload from "@/components/admin/DragDropImageUpload";

type Review = {
  id: string;
  product_id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  approved: boolean;
  created_at: string;
  image?: string;
};

type Product = { id: string; name: string };

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ product_id: "", author: "", rating: 5, comment: "", verified: true });
  const [reviewImage, setReviewImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchReviews = async () => {
    const { data, error } = await supabase.from("product_reviews").select("*").order("created_at", { ascending: false });
    if (error) { toast.error("Failed to load reviews"); return; }
    setReviews((data || []) as Review[]);
    setLoading(false);
  };

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("id, name").order("name");
    setProducts((data || []) as Product[]);
  };

  useEffect(() => { fetchReviews(); fetchProducts(); }, []);

  const filtered = reviews.filter((r) => {
    if (filter === "pending") return !r.approved;
    if (filter === "approved") return r.approved;
    return true;
  });

  const toggleApproval = async (review: Review) => {
    const { error } = await supabase.from("product_reviews").update({ approved: !review.approved } as any).eq("id", review.id);
    if (error) { toast.error("Update failed"); return; }
    toast.success(review.approved ? "Review unapproved" : "Review approved");
    fetchReviews();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("product_reviews").delete().eq("id", deleteId);
    if (error) { toast.error("Delete failed"); return; }
    toast.success("Review deleted");
    setDeleteId(null);
    fetchReviews();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    // no longer needed - handled by DragDropImageUpload
  };

  const handleCreate = async () => {
    if (!form.product_id || !form.author) { toast.error("Product and author are required"); return; }

    let imageUrl = "";
    if (imageFile) {
      setUploading(true);
      const ext = imageFile.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("review-images").upload(path, imageFile);
      if (upErr) { toast.error("Image upload failed"); setUploading(false); return; }
      const { data: urlData } = supabase.storage.from("review-images").getPublicUrl(path);
      imageUrl = urlData.publicUrl;
      setUploading(false);
    }

    const { error } = await supabase.from("product_reviews").insert({
      product_id: form.product_id,
      author: form.author,
      rating: form.rating,
      comment: form.comment,
      image: imageUrl,
      date: new Date().toISOString().split("T")[0],
      verified: form.verified,
      approved: true,
    } as any);
    if (error) { toast.error("Create failed"); return; }
    toast.success("Review created");
    setOpen(false);
    setForm({ product_id: "", author: "", rating: 5, comment: "", verified: true });
    setImageFile(null);
    setImagePreview("");
    fetchReviews();
  };

  const getProductName = (id: string) => products.find((p) => p.id === id)?.name || id;

  const renderStars = (rating: number) => (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`h-4 w-4 ${s <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
      ))}
    </span>
  );

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Reviews</h1>
        <Button size="sm" onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-1" /> Add Review</Button>
      </div>

      <div className="flex gap-2 mb-6">
        {(["all", "pending", "approved"] as const).map((f) => (
          <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)} className="capitalize">
            {f}
          </Button>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border divide-y divide-border">
        {loading ? (
          <p className="text-muted-foreground text-center py-8">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No reviews found</p>
        ) : filtered.map((r) => (
          <div key={r.id} className="p-5 flex items-start justify-between gap-4">
            <div className="flex gap-4 flex-1">
              {r.image && (
                <img src={r.image} alt="Review" className="h-14 w-14 rounded-lg object-cover shrink-0" />
              )}
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-bold text-foreground">{r.author}</span>
                  {renderStars(r.rating)}
                  <Badge variant={r.approved ? "default" : "secondary"} className={r.approved ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}>
                    {r.approved ? "Approved" : "Pending"}
                  </Badge>
                </div>
                {r.comment && <p className="text-muted-foreground">{r.comment}</p>}
                <div className="flex gap-3 text-xs text-muted-foreground">
                  <span>{r.date}</span>
                  <span>•</span>
                  <span>{getProductName(r.product_id)}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={() => toggleApproval(r)}>
                {r.approved ? <><X className="h-4 w-4 mr-1" /> Unapprove</> : <><Check className="h-4 w-4 mr-1" /> Approve</>}
              </Button>
              <Button variant="outline" size="icon" onClick={() => setDeleteId(r.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Review Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Custom Review</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="font-semibold">Product *</Label>
              <Select value={form.product_id} onValueChange={(v) => setForm({ ...form, product_id: v })}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select product" /></SelectTrigger>
                <SelectContent>
                  {products.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-semibold">Author Name *</Label>
              <Input className="mt-1" placeholder="Customer name" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
            </div>
            <div>
              <Label className="font-semibold">Rating *</Label>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button" onClick={() => setForm({ ...form, rating: s })}>
                    <Star className={`h-6 w-6 cursor-pointer ${s <= form.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="font-semibold">Image</Label>
              <input type="file" accept="image/*" ref={imgRef} className="hidden" onChange={handleImageSelect} />
              {imagePreview ? (
                <div className="mt-1 relative inline-block">
                  <img src={imagePreview} alt="Preview" className="h-24 w-24 rounded-lg object-cover" />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full h-5 w-5 flex items-center justify-center"
                    onClick={() => { setImageFile(null); setImagePreview(""); }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => imgRef.current?.click()}
                  className="mt-1 h-24 w-24 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary/50 transition-colors"
                >
                  <ImageIcon className="h-5 w-5" />
                  <span className="text-xs">Upload</span>
                </button>
              )}
            </div>
            <div>
              <Label className="font-semibold">Comment</Label>
              <Textarea className="mt-1" placeholder="Review comment (optional)..." value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={uploading}>
                {uploading ? "Uploading..." : "Create Review"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(v) => { if (!v) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review?</AlertDialogTitle>
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