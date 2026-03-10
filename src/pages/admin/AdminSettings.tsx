import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Store, Phone, Mail, MapPin, Globe, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type SettingsMap = Record<string, string>;

const settingGroups = [
  {
    title: "স্টোর তথ্য",
    icon: Store,
    fields: [
      { key: "store_name", label: "স্টোরের নাম", placeholder: "Herbal Homes", type: "text" },
      { key: "currency", label: "কারেন্সি সিম্বল", placeholder: "৳", type: "text" },
      { key: "logo", label: "লোগো URL", placeholder: "https://...", type: "text" },
    ],
  },
  {
    title: "যোগাযোগ তথ্য",
    icon: Phone,
    fields: [
      { key: "phone", label: "ফোন নম্বর", placeholder: "01XXXXXXXXX", type: "tel" },
      { key: "email", label: "ইমেইল", placeholder: "info@herbalhomes.com", type: "email" },
      { key: "address", label: "ঠিকানা", placeholder: "ঢাকা, বাংলাদেশ", type: "textarea" },
      { key: "whatsapp", label: "WhatsApp নম্বর", placeholder: "8801XXXXXXXXX", type: "tel" },
    ],
  },
  {
    title: "সোশ্যাল মিডিয়া",
    icon: Share2,
    fields: [
      { key: "facebook", label: "Facebook URL", placeholder: "https://facebook.com/...", type: "url" },
      { key: "instagram", label: "Instagram URL", placeholder: "https://instagram.com/...", type: "url" },
      { key: "youtube", label: "YouTube URL", placeholder: "https://youtube.com/...", type: "url" },
    ],
  },
  {
    title: "SEO সেটিংস",
    icon: Globe,
    fields: [
      { key: "meta_title", label: "Meta Title", placeholder: "সাইটের টাইটেল", type: "text" },
      { key: "meta_description", label: "Meta Description", placeholder: "সাইটের বর্ণনা", type: "textarea" },
    ],
  },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.from("site_settings").select("*");
      if (error) { toast.error("সেটিংস লোড করতে সমস্যা হয়েছে"); setLoading(false); return; }
      const map: SettingsMap = {};
      (data || []).forEach((row: any) => { map[row.key] = row.value; });
      setSettings(map);
      setLoading(false);
    };
    load();
  }, []);

  const update = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(settings)) {
        await supabase
          .from("site_settings")
          .upsert({ key, value, updated_at: new Date().toISOString() } as any, { onConflict: "key" });
      }
      toast.success("সেটিংস সফলভাবে সেভ হয়েছে!");
    } catch {
      toast.error("সেভ করতে সমস্যা হয়েছে");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">সেটিংস</h1>
          <p className="text-muted-foreground text-sm">সাইটের সাধারণ সেটিংস পরিচালনা করুন</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
          সেভ করুন
        </Button>
      </div>

      <div className="max-w-3xl space-y-6">
        {settingGroups.map((group) => (
          <div key={group.title} className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-5">
              <group.icon className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-foreground">{group.title}</h3>
            </div>
            <div className="space-y-4">
              {group.fields.map((field) => (
                <div key={field.key}>
                  <Label className="font-semibold text-sm">{field.label}</Label>
                  {field.type === "textarea" ? (
                    <Textarea
                      className="mt-1"
                      placeholder={field.placeholder}
                      value={settings[field.key] || ""}
                      onChange={(e) => update(field.key, e.target.value)}
                      rows={3}
                    />
                  ) : (
                    <Input
                      className="mt-1"
                      type={field.type}
                      placeholder={field.placeholder}
                      value={settings[field.key] || ""}
                      onChange={(e) => update(field.key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
