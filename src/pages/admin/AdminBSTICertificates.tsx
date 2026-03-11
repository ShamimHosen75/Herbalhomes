import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Save, X, Upload, GripVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { toast } from "@/hooks/use-toast";

interface BSTICertificate {
  id: string;
  product_name: string;
  image_url: string;
  sort_order: number;
  active: boolean;
}

export default function AdminBSTICertificates() {
  const [certificates, setCertificates] = useState<BSTICertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [uploading, setUploading] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase
      .from("bsti_certificates")
      .select("*")
      .order("sort_order");
    setCertificates((data as BSTICertificate[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    const { error } = await supabase.from("bsti_certificates").insert({
      product_name: newName.trim(),
      sort_order: certificates.length,
    } as any);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Added", description: "Certificate entry added." });
      setNewName("");
      setShowAdd(false);
      load();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this certificate?")) return;
    await supabase.from("bsti_certificates").delete().eq("id", id);
    toast({ title: "Deleted" });
    load();
  };

  const handleToggle = async (id: string, active: boolean) => {
    await supabase.from("bsti_certificates").update({ active: !active } as any).eq("id", id);
    load();
  };

  const handleSaveEdit = async (id: string) => {
    await supabase.from("bsti_certificates").update({ product_name: editName } as any).eq("id", id);
    setEditingId(null);
    toast({ title: "Updated" });
    load();
  };

  const handleImageUpload = async (id: string, file: File) => {
    setUploading(id);
    const ext = file.name.split(".").pop();
    const path = `${id}.${ext}`;

    // Remove old file if exists
    await supabase.storage.from("bsti-certificates").remove([path]);

    const { error } = await supabase.storage.from("bsti-certificates").upload(path, file, { upsert: true });
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      setUploading(null);
      return;
    }

    const { data: urlData } = supabase.storage.from("bsti-certificates").getPublicUrl(path);
    await supabase.from("bsti_certificates").update({ image_url: urlData.publicUrl } as any).eq("id", id);
    toast({ title: "Image uploaded" });
    setUploading(null);
    load();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">BSTI Certificates</h1>
          <p className="text-sm text-muted-foreground">Manage BSTI certificate images for products</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Add Certificate
        </button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="bg-card border border-border rounded-xl p-4 mb-6 flex items-center gap-3">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Product name (e.g. Castor Oil)"
            className="flex-1 h-10 px-4 rounded-lg bg-muted text-sm text-foreground border-0 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button onClick={handleAdd} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium">
            Save
          </button>
          <button onClick={() => { setShowAdd(false); setNewName(""); }} className="p-2 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground text-center py-12">Loading...</p>
      ) : certificates.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-xl">
          <p className="text-muted-foreground">No certificates added yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {certificates.map((cert) => (
            <div key={cert.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
              {/* Thumbnail */}
              <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
                {cert.image_url ? (
                  <img src={cert.image_url} alt={cert.product_name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs text-muted-foreground">No Image</span>
                )}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                {editingId === cert.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="h-9 px-3 rounded-lg bg-muted text-sm text-foreground border-0 focus:outline-none focus:ring-2 focus:ring-primary/30 flex-1"
                    />
                    <button onClick={() => handleSaveEdit(cert.id)} className="p-1.5 text-primary hover:bg-accent rounded-lg">
                      <Save className="h-4 w-4" />
                    </button>
                    <button onClick={() => setEditingId(null)} className="p-1.5 text-muted-foreground hover:bg-accent rounded-lg">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <p className="font-medium text-foreground truncate">{cert.product_name}</p>
                )}
                <p className="text-xs text-muted-foreground mt-0.5">
                  {cert.image_url ? "Certificate uploaded" : "No certificate image"}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Upload */}
                <label className="cursor-pointer p-2 text-muted-foreground hover:text-primary hover:bg-accent rounded-lg transition-colors">
                  {uploading === cert.id ? (
                    <span className="text-xs">...</span>
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(cert.id, file);
                    }}
                  />
                </label>

                {/* Edit name */}
                <button
                  onClick={() => { setEditingId(cert.id); setEditName(cert.product_name); }}
                  className="p-2 text-muted-foreground hover:text-primary hover:bg-accent rounded-lg"
                >
                  <Edit2 className="h-4 w-4" />
                </button>

                {/* Toggle active */}
                <button
                  onClick={() => handleToggle(cert.id, cert.active)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    cert.active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {cert.active ? "Active" : "Hidden"}
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(cert.id)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-accent rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
