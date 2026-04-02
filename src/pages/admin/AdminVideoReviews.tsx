import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DragDropImageUpload from "@/components/admin/DragDropImageUpload";

interface VideoReview {
  id: string;
  customer_name: string;
  video_url: string;
  thumbnail_url: string;
  rating: number;
  active: boolean;
  sort_order: number;
  created_at: string;
}

const emptyForm = () => ({
  customer_name: "",
  video_url: "",
  thumbnail_url: "",
  rating: 5,
  active: true,
  sort_order: 0,
});

export default function AdminVideoReviews() {
  const [reviews, setReviews] = useState<VideoReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const { toast } = useToast();

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("customer_video_reviews")
      .select("*")
      .order("sort_order") as any;
    if (data) setReviews(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleSave = async () => {
    if (!form.customer_name.trim() || !form.video_url.trim()) {
      toast({ title: "নাম এবং ভিডিও URL দিন", variant: "destructive" });
      return;
    }

    const payload = {
      customer_name: form.customer_name,
      video_url: form.video_url,
      thumbnail_url: form.thumbnail_url,
      rating: form.rating,
      active: form.active,
      sort_order: form.sort_order,
    };

    if (editId) {
      await supabase.from("customer_video_reviews").update(payload as any).eq("id", editId);
      toast({ title: "ভিডিও রিভিউ আপডেট হয়েছে!" });
    } else {
      await supabase.from("customer_video_reviews").insert(payload as any);
      toast({ title: "নতুন ভিডিও রিভিউ যোগ হয়েছে!" });
    }

    setDialogOpen(false);
    setForm(emptyForm());
    setEditId(null);
    fetchReviews();
  };

  const handleEdit = (r: VideoReview) => {
    setForm({
      customer_name: r.customer_name,
      video_url: r.video_url,
      thumbnail_url: r.thumbnail_url,
      rating: r.rating,
      active: r.active,
      sort_order: r.sort_order,
    });
    setEditId(r.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await (supabase.from("customer_video_reviews") as any).delete().eq("id", id);
    toast({ title: "ভিডিও রিভিউ ডিলিট হয়েছে!", variant: "destructive" });
    fetchReviews();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("customer_video_reviews").update({ active: !current } as any).eq("id", id);
    setReviews(prev => prev.map(r => r.id === id ? { ...r, active: !current } : r));
  };

  const getYtThumb = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([^?&/]+)/);
    return match ? `https://img.youtube.com/vi/${match[1]}/default.jpg` : null;
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">গ্রাহক ভিডিও রিভিউ</h1>
        <Button size="sm" onClick={() => { setForm(emptyForm()); setEditId(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-1" /> যোগ করুন
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border">
        {loading ? (
          <p className="p-8 text-center text-muted-foreground">Loading...</p>
        ) : reviews.length === 0 ? (
          <p className="p-8 text-center text-muted-foreground">কোনো ভিডিও রিভিউ নেই</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ভিডিও</TableHead>
                <TableHead>গ্রাহক</TableHead>
                <TableHead>রেটিং</TableHead>
                <TableHead>অর্ডার</TableHead>
                <TableHead>সক্রিয়</TableHead>
                <TableHead className="text-right">অ্যাকশন</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    {r.thumbnail_url || getYtThumb(r.video_url) ? (
                      <img src={r.thumbnail_url || getYtThumb(r.video_url)!} alt="" className="w-20 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-20 h-12 bg-muted rounded flex items-center justify-center">
                        <Video className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{r.customer_name}</TableCell>
                  <TableCell>{"⭐".repeat(r.rating)}</TableCell>
                  <TableCell>{r.sort_order}</TableCell>
                  <TableCell>
                    <Switch checked={r.active} onCheckedChange={() => toggleActive(r.id, r.active)} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(r)}>
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
                            <AlertDialogTitle>ডিলিট করবেন?</AlertDialogTitle>
                            <AlertDialogDescription>এই ভিডিও রিভিউ স্থায়ীভাবে মুছে যাবে।</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>বাতিল</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(r.id)}>ডিলিট</AlertDialogAction>
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

      <Dialog open={dialogOpen} onOpenChange={(v) => { if (!v) { setForm(emptyForm()); setEditId(null); } setDialogOpen(v); }}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? "এডিট" : "নতুন"} ভিডিও রিভিউ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">গ্রাহকের নাম *</Label>
              <Input
                value={form.customer_name}
                onChange={(e) => setForm(prev => ({ ...prev, customer_name: e.target.value }))}
                className="mt-1"
                placeholder="যেমন: রহিম উদ্দিন"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">YouTube ভিডিও URL *</Label>
              <Input
                value={form.video_url}
                onChange={(e) => setForm(prev => ({ ...prev, video_url: e.target.value }))}
                className="mt-1"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
            <div>
              <Label className="text-sm font-medium">কাস্টম থাম্বনেইল (ঐচ্ছিক)</Label>
              <p className="text-xs text-muted-foreground mb-1">খালি রাখলে YouTube থেকে স্বয়ংক্রিয়ভাবে নেবে</p>
              <DragDropImageUpload
                value={form.thumbnail_url}
                onChange={(v) => setForm(prev => ({ ...prev, thumbnail_url: v as string }))}
                bucket="slider-images"
                previewSize="md"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium">রেটিং (1-5)</Label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={form.rating}
                  onChange={(e) => setForm(prev => ({ ...prev, rating: Math.min(5, Math.max(1, +e.target.value)) }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">সর্ট অর্ডার</Label>
                <Input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm(prev => ({ ...prev, sort_order: +e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.active} onCheckedChange={(v) => setForm(prev => ({ ...prev, active: v }))} />
              <Label className="text-sm">সক্রিয়</Label>
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} className="flex-1">
                {editId ? "আপডেট করুন" : "যোগ করুন"}
              </Button>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>বাতিল</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
