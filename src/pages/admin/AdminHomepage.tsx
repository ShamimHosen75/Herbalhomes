import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ChevronUp, ChevronDown, GripVertical, Save, LayoutGrid, ChevronRight, Plus, Trash2 } from "lucide-react";

interface HomepageSection {
  id: string;
  section_type: string;
  title: string;
  subtitle: string;
  layout: string;
  sort_order: number;
  active: boolean;
  content: any;
}

const sectionTypeLabels: Record<string, string> = {
  hero_slider: "Hero Slider",
  featured_categories: "Featured Categories",
  best_sellers: "Best Sellers",
  why_choose_us: "Why Choose Us",
  offer_banner: "Offer Banner",
  customer_reviews: "Customer Reviews",
  contact: "Contact",
};

const defaultContent: Record<string, any> = {
  why_choose_us: {
    features: [
      { icon: "Leaf", title: "১০০% জৈব", description: "সকল পণ্য প্রত্যয়িত জৈব খামার থেকে সংগ্রহ করা।" },
      { icon: "ShieldCheck", title: "রাসায়নিক মুক্ত", description: "প্যারাবেন ও সালফেট মুক্ত। শুধুই বিশুদ্ধ প্রকৃতি।" },
      { icon: "Recycle", title: "পরিবেশবান্ধব", description: "জৈব-বিশ্লেষ্য ও পুনর্ব্যবহারযোগ্য প্যাকেজিং।" },
      { icon: "Users", title: "৫০,০০০+ গ্রাহক", description: "হাজারো গ্রাহকের বিশ্বাসের প্রতীক।" },
    ],
  },
  offer_banner: {
    cta_text: "অফার দেখুন",
    cta_link: "#best-sellers",
    coupon_code: "PURENATURE25",
  },
  customer_reviews: {
    reviews: [
      { name: "সারাহ মুন্নি", text: "হার্বাল হোমসের ল্যাভেন্ডার সাবান ৩ মাস ধরে ব্যবহার করছি।", rating: 5 },
      { name: "জামিল রহমান", text: "কালোজিরার তেলের মান অসাধারণ।", rating: 5 },
      { name: "আমিরা খান", text: "চমৎকার প্যাকেজিং, অসাধারণ পণ্য।", rating: 5 },
    ],
  },
  contact: {
    phone: "০১৭১২-৩৪৫৬৭৮",
    phone_raw: "+8801712345678",
    whatsapp: "8801712345678",
    facebook: "https://m.me/herbalhomes",
    cta_whatsapp: "হোয়াটসঅ্যাপ",
    cta_facebook: "ফেসবুকে মেসেজ করুন",
  },
};

export default function AdminHomepage() {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSections = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("homepage_sections")
      .select("*")
      .order("sort_order");
    const mapped = ((data as any[]) || []).map((s) => ({
      ...s,
      content: s.content && Object.keys(s.content).length > 0 ? s.content : (defaultContent[s.section_type] || {}),
    }));
    setSections(mapped);
    setLoading(false);
  };

  useEffect(() => { fetchSections(); }, []);

  const moveSection = (index: number, direction: "up" | "down") => {
    const newSections = [...sections];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newSections.length) return;
    const tempOrder = newSections[index].sort_order;
    newSections[index].sort_order = newSections[swapIndex].sort_order;
    newSections[swapIndex].sort_order = tempOrder;
    [newSections[index], newSections[swapIndex]] = [newSections[swapIndex], newSections[index]];
    setSections(newSections);
  };

  const updateField = (id: string, field: keyof HomepageSection, value: any) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const updateContent = (id: string, content: any) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, content } : s));
  };

  const handleSave = async () => {
    setSaving(true);
    for (const section of sections) {
      await supabase
        .from("homepage_sections")
        .update({
          title: section.title,
          subtitle: section.subtitle,
          layout: section.layout,
          sort_order: section.sort_order,
          active: section.active,
          content: section.content,
        } as any)
        .eq("id", section.id);
    }
    setSaving(false);
    toast({ title: "হোমপেজ সেকশন সেভ হয়েছে" });
  };

  const renderContentEditor = (section: HomepageSection) => {
    const { section_type, content } = section;

    if (section_type === "why_choose_us") {
      const features = content?.features || [];
      return (
        <div className="space-y-3 mt-4">
          <h4 className="text-sm font-semibold text-foreground">Features</h4>
          {features.map((f: any, i: number) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 border border-border rounded-lg bg-muted/30">
              <Input value={f.title} placeholder="Title" onChange={e => {
                const updated = [...features];
                updated[i] = { ...updated[i], title: e.target.value };
                updateContent(section.id, { ...content, features: updated });
              }} />
              <Input value={f.description} placeholder="Description" onChange={e => {
                const updated = [...features];
                updated[i] = { ...updated[i], description: e.target.value };
                updateContent(section.id, { ...content, features: updated });
              }} />
              <div className="flex gap-2">
                <Select value={f.icon || "Leaf"} onValueChange={v => {
                  const updated = [...features];
                  updated[i] = { ...updated[i], icon: v };
                  updateContent(section.id, { ...content, features: updated });
                }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Leaf">🌿 Leaf</SelectItem>
                    <SelectItem value="ShieldCheck">🛡️ Shield</SelectItem>
                    <SelectItem value="Recycle">♻️ Recycle</SelectItem>
                    <SelectItem value="Users">👥 Users</SelectItem>
                    <SelectItem value="Star">⭐ Star</SelectItem>
                    <SelectItem value="Heart">❤️ Heart</SelectItem>
                    <SelectItem value="Truck">🚚 Truck</SelectItem>
                    <SelectItem value="Award">🏆 Award</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="icon" variant="ghost" className="text-destructive shrink-0" onClick={() => {
                  const updated = features.filter((_: any, idx: number) => idx !== i);
                  updateContent(section.id, { ...content, features: updated });
                }}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => {
            updateContent(section.id, { ...content, features: [...features, { icon: "Star", title: "", description: "" }] });
          }}><Plus className="h-4 w-4 mr-1" /> Add Feature</Button>
        </div>
      );
    }

    if (section_type === "offer_banner") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Coupon Code</label>
            <Input value={content?.coupon_code || ""} onChange={e => updateContent(section.id, { ...content, coupon_code: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">CTA Text</label>
            <Input value={content?.cta_text || ""} onChange={e => updateContent(section.id, { ...content, cta_text: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">CTA Link</label>
            <Input value={content?.cta_link || ""} onChange={e => updateContent(section.id, { ...content, cta_link: e.target.value })} />
          </div>
        </div>
      );
    }

    if (section_type === "customer_reviews") {
      const reviews = content?.reviews || [];
      return (
        <div className="space-y-3 mt-4">
          <h4 className="text-sm font-semibold text-foreground">Reviews</h4>
          {reviews.map((r: any, i: number) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-2 p-3 border border-border rounded-lg bg-muted/30">
              <Input value={r.name} placeholder="Name" onChange={e => {
                const updated = [...reviews];
                updated[i] = { ...updated[i], name: e.target.value };
                updateContent(section.id, { ...content, reviews: updated });
              }} />
              <Textarea value={r.text} placeholder="Review text" className="md:col-span-2" onChange={e => {
                const updated = [...reviews];
                updated[i] = { ...updated[i], text: e.target.value };
                updateContent(section.id, { ...content, reviews: updated });
              }} />
              <div className="flex gap-2 items-start">
                <Select value={String(r.rating || 5)} onValueChange={v => {
                  const updated = [...reviews];
                  updated[i] = { ...updated[i], rating: Number(v) };
                  updateContent(section.id, { ...content, reviews: updated });
                }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[5,4,3,2,1].map(n => <SelectItem key={n} value={String(n)}>{"⭐".repeat(n)}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button size="icon" variant="ghost" className="text-destructive shrink-0" onClick={() => {
                  updateContent(section.id, { ...content, reviews: reviews.filter((_: any, idx: number) => idx !== i) });
                }}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => {
            updateContent(section.id, { ...content, reviews: [...reviews, { name: "", text: "", rating: 5 }] });
          }}><Plus className="h-4 w-4 mr-1" /> Add Review</Button>
        </div>
      );
    }

    if (section_type === "contact") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Phone Display</label>
            <Input value={content?.phone || ""} onChange={e => updateContent(section.id, { ...content, phone: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Phone (raw, e.g. +880...)</label>
            <Input value={content?.phone_raw || ""} onChange={e => updateContent(section.id, { ...content, phone_raw: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">WhatsApp Number</label>
            <Input value={content?.whatsapp || ""} onChange={e => updateContent(section.id, { ...content, whatsapp: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Facebook Messenger Link</label>
            <Input value={content?.facebook || ""} onChange={e => updateContent(section.id, { ...content, facebook: e.target.value })} />
          </div>
        </div>
      );
    }

    if (section_type === "hero_slider") {
      return (
        <p className="text-xs text-muted-foreground mt-3">
          স্লাইডার কনটেন্ট <a href="/admin/slider" className="text-primary underline">Slider Settings</a> থেকে এডিট করুন।
        </p>
      );
    }

    if (section_type === "featured_categories") {
      return (
        <p className="text-xs text-muted-foreground mt-3">
          ক্যাটাগরি <a href="/admin/categories" className="text-primary underline">Categories</a> থেকে ম্যানেজ করুন।
        </p>
      );
    }

    if (section_type === "best_sellers") {
      return (
        <p className="text-xs text-muted-foreground mt-3">
          প্রোডাক্ট <a href="/admin/products" className="text-primary underline">Products</a> থেকে ম্যানেজ করুন।
        </p>
      );
    }

    return null;
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayoutGrid className="h-6 w-6 text-foreground" />
            <h1 className="text-2xl font-bold text-foreground">Homepage Settings</h1>
          </div>
          <p className="text-sm text-muted-foreground">হোমপেজের সেকশন কনফিগার ও রিঅর্ডার করুন</p>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Sections</h2>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-1" />
            {saving ? "Saving..." : "Save Sections"}
          </Button>
        </div>

        {loading ? (
          <p className="text-center py-8 text-muted-foreground">লোড হচ্ছে...</p>
        ) : (
          <div className="space-y-3">
            {sections.map((section, index) => (
              <div key={section.id} className="border border-border rounded-lg p-4">
                {/* Section header */}
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="text-xs">{sectionTypeLabels[section.section_type] || section.section_type}</Badge>
                  <span className="text-xs text-muted-foreground">#{index + 1}</span>
                </div>

                {/* Section controls */}
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => moveSection(index, "up")} disabled={index === 0} className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30">
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button onClick={() => moveSection(index, "down")} disabled={index === sections.length - 1} className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30">
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                  <GripVertical className="h-5 w-5 text-muted-foreground/50 shrink-0" />
                  <Input value={section.title} onChange={e => updateField(section.id, "title", e.target.value)} className="flex-1" />
                  <Input value={section.subtitle} onChange={e => updateField(section.id, "subtitle", e.target.value)} placeholder="Subtitle" className="flex-1" />
                  <Select value={section.layout} onValueChange={v => updateField(section.id, "layout", v)}>
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grid</SelectItem>
                      <SelectItem value="carousel">Carousel</SelectItem>
                      <SelectItem value="list">List</SelectItem>
                    </SelectContent>
                  </Select>
                  <Switch checked={section.active} onCheckedChange={v => updateField(section.id, "active", v)} />
                  <button onClick={() => setExpandedId(expandedId === section.id ? null : section.id)} className="p-1 text-muted-foreground hover:text-foreground">
                    <ChevronRight className={`h-4 w-4 transition-transform ${expandedId === section.id ? "rotate-90" : ""}`} />
                  </button>
                </div>

                {/* Expanded content editor */}
                {expandedId === section.id && (
                  <div className="border-t border-border mt-3 pt-3">
                    {renderContentEditor(section)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
