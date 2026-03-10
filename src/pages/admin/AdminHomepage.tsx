import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ChevronUp, ChevronDown, GripVertical, Save, LayoutGrid } from "lucide-react";

interface HomepageSection {
  id: string;
  section_type: string;
  title: string;
  subtitle: string;
  layout: string;
  sort_order: number;
  active: boolean;
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

export default function AdminHomepage() {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchSections = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("homepage_sections")
      .select("*")
      .order("sort_order");
    setSections((data as HomepageSection[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchSections(); }, []);

  const moveSection = (index: number, direction: "up" | "down") => {
    const newSections = [...sections];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newSections.length) return;

    // Swap sort_order values
    const tempOrder = newSections[index].sort_order;
    newSections[index].sort_order = newSections[swapIndex].sort_order;
    newSections[swapIndex].sort_order = tempOrder;

    // Swap positions in array
    [newSections[index], newSections[swapIndex]] = [newSections[swapIndex], newSections[index]];
    setSections(newSections);
  };

  const updateField = (id: string, field: keyof HomepageSection, value: any) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
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
        })
        .eq("id", section.id);
    }
    setSaving(false);
    toast({ title: "হোমপেজ সেকশন সেভ হয়েছে" });
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

      {/* Sections */}
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
              <div
                key={section.id}
                className="border border-border rounded-lg p-4"
              >
                {/* Section header */}
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="text-xs">{sectionTypeLabels[section.section_type] || section.section_type}</Badge>
                  <span className="text-xs text-muted-foreground">#{index + 1}</span>
                </div>

                {/* Section controls */}
                <div className="flex items-center gap-3">
                  {/* Move buttons */}
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => moveSection(index, "up")}
                      disabled={index === 0}
                      className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => moveSection(index, "down")}
                      disabled={index === sections.length - 1}
                      className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>

                  <GripVertical className="h-5 w-5 text-muted-foreground/50 shrink-0" />

                  {/* Title */}
                  <Input
                    value={section.title}
                    onChange={e => updateField(section.id, "title", e.target.value)}
                    className="flex-1"
                  />

                  {/* Subtitle */}
                  <Input
                    value={section.subtitle}
                    onChange={e => updateField(section.id, "subtitle", e.target.value)}
                    placeholder="Subtitle"
                    className="flex-1"
                  />

                  {/* Layout */}
                  <Select value={section.layout} onValueChange={v => updateField(section.id, "layout", v)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grid</SelectItem>
                      <SelectItem value="carousel">Carousel</SelectItem>
                      <SelectItem value="list">List</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Active toggle */}
                  <Switch
                    checked={section.active}
                    onCheckedChange={v => updateField(section.id, "active", v)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
