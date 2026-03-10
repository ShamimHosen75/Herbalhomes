import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Loader2, Save, Store, Globe, Palette, Megaphone, Mail, Phone, MapPin,
  Share2, X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { invalidateSiteSettings } from "@/hooks/useSiteSettings";

type SettingsMap = Record<string, string>;

export default function AdminSettings() {
  const [settings, setSettings] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("site_settings").select("*");
      const map: SettingsMap = {};
      (data || []).forEach((row: any) => { map[row.key] = row.value; });
      setSettings(map);
      setLoading(false);
    };
    load();
  }, []);

  const s = (key: string) => settings[key] || "";
  const update = (key: string, value: string) => setSettings(prev => ({ ...prev, [key]: value }));
  const toggle = (key: string) => update(key, s(key) === "true" ? "false" : "true");
  const isOn = (key: string) => s(key) === "true";

  const handleSave = async () => {
    setSaving(true);
    for (const [key, value] of Object.entries(settings)) {
      await supabase
        .from("site_settings")
        .upsert({ key, value, updated_at: new Date().toISOString() } as any, { onConflict: "key" });
    }
    toast.success("সেটিংস সেভ হয়েছে!");
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
      <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>

      <Tabs defaultValue="store-info">
        <TabsList className="bg-muted/50 mb-6">
          <TabsTrigger value="store-info" className="gap-1.5"><Store className="h-4 w-4" /> Store Info</TabsTrigger>
          <TabsTrigger value="global" className="gap-1.5"><Globe className="h-4 w-4" /> Global Settings</TabsTrigger>
          <TabsTrigger value="theme" className="gap-1.5"><Palette className="h-4 w-4" /> Theme</TabsTrigger>
          <TabsTrigger value="marketing" className="gap-1.5"><Megaphone className="h-4 w-4" /> Marketing</TabsTrigger>
        </TabsList>

        {/* ==================== STORE INFO ==================== */}
        <TabsContent value="store-info" className="space-y-6 max-w-4xl">
          {/* Store Information */}
          <Section icon={Store} title="Store Information">
            <div>
              <Label>Store Logo</Label>
              <div className="flex gap-3 items-start mt-1">
                {s("logo") && (
                  <div className="relative">
                    <img src={s("logo")} alt="Logo" className="w-24 h-24 object-contain border rounded-lg" />
                    <button onClick={() => update("logo", "")} className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5"><X className="h-3.5 w-3.5" /></button>
                  </div>
                )}
                <Input className="flex-1" placeholder="Paste logo URL" value={s("logo")} onChange={e => update("logo", e.target.value)} />
              </div>
            </div>
            <div>
              <Label>Favicon</Label>
              <div className="flex gap-3 items-start mt-1">
                {s("favicon") && (
                  <div className="relative">
                    <img src={s("favicon")} alt="Favicon" className="w-16 h-16 object-contain border rounded-lg" />
                    <button onClick={() => update("favicon", "")} className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5"><X className="h-3.5 w-3.5" /></button>
                  </div>
                )}
                <Input className="flex-1" placeholder="Paste favicon URL" value={s("favicon")} onChange={e => update("favicon", e.target.value)} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Recommended: 32×32 or 64×64 PNG/ICO. This icon appears in browser tabs.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Store Name" value={s("store_name")} onChange={v => update("store_name", v)} placeholder="My Store" />
              <Field label="Tagline / Slogan" value={s("tagline")} onChange={v => update("tagline", v)} placeholder="Your one-stop shop" />
            </div>
            <Field label="Footer Text" value={s("footer_text")} onChange={v => update("footer_text", v)} placeholder="© 2024 My Store. All rights reserved." />
          </Section>

          {/* Top Bar / Announcement */}
          <Section icon={Megaphone} title="Top Bar / Announcement">
            <ToggleRow label="Enable Top Bar" desc="Show an announcement bar above the header" checked={isOn("topbar_enabled")} onChange={() => toggle("topbar_enabled")} />
            <Field label="Top Bar Text" value={s("topbar_text")} onChange={v => update("topbar_text", v)} placeholder="Free Shipping on Orders Over ৳500!" />
            <p className="text-xs text-muted-foreground">Background color uses your Primary brand color from Theme settings</p>
          </Section>

          {/* Contact Information */}
          <Section icon={Mail} title="Contact Information">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> Email Address</Label>
                <Input className="mt-1" value={s("email")} onChange={e => update("email", e.target.value)} placeholder="hello@store.com" />
              </div>
              <div>
                <Label className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> Phone Number</Label>
                <Input className="mt-1" value={s("phone")} onChange={e => update("phone", e.target.value)} placeholder="+880 1234 567890" />
              </div>
            </div>
            <div>
              <Label className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Street Address</Label>
              <Input className="mt-1" value={s("address")} onChange={e => update("address", e.target.value)} placeholder="123 Store Street, Gulshan-1, Dhaka 1212, Bangladesh" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="City" value={s("city")} onChange={v => update("city", v)} placeholder="Dhaka" />
              <Field label="Postal Code" value={s("postal_code")} onChange={v => update("postal_code", v)} placeholder="1205" />
            </div>
          </Section>

          {/* Social Media & Messaging */}
          <Section icon={Share2} title="Social Media & Messaging">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Facebook URL" value={s("facebook")} onChange={v => update("facebook", v)} placeholder="https://facebook.com/yourstore" />
              <Field label="Instagram URL" value={s("instagram")} onChange={v => update("instagram", v)} placeholder="https://instagram.com/yourstore" />
              <Field label="Twitter / X URL" value={s("twitter")} onChange={v => update("twitter", v)} placeholder="https://twitter.com/yourstore" />
              <Field label="YouTube URL" value={s("youtube")} onChange={v => update("youtube", v)} placeholder="https://youtube.com/@yourstore" />
            </div>
            <div>
              <Label>WhatsApp Number</Label>
              <Input className="mt-1" value={s("whatsapp")} onChange={e => update("whatsapp", e.target.value)} placeholder="+8801792490604" />
              <p className="text-xs text-muted-foreground mt-1">Include country code for WhatsApp click-to-chat</p>
            </div>
            <ToggleRow label="Order on WhatsApp Button" desc='Show "Order on WhatsApp" button on product pages' checked={isOn("whatsapp_order_enabled")} onChange={() => toggle("whatsapp_order_enabled")} />
          </Section>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
            Save Store Settings
          </Button>
        </TabsContent>

        {/* ==================== GLOBAL SETTINGS ==================== */}
        <TabsContent value="global" className="space-y-6 max-w-4xl">
          <Section icon={Globe} title="Global Settings">
            <div>
              <Label className="text-primary">Select Country *</Label>
              <Select value={s("country") || "BD"} onValueChange={v => update("country", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="BD">Bangladesh</SelectItem>
                  <SelectItem value="IN">India</SelectItem>
                  <SelectItem value="PK">Pakistan</SelectItem>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="UK">United Kingdom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="flex items-center gap-1">💲 Currency</Label>
              <Select value={s("currency") || "BDT"} onValueChange={v => update("currency", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="BDT">BDT (৳)</SelectItem>
                  <SelectItem value="INR">INR (₹)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="PKR">PKR (₨)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">Selected: {s("currency") || "BDT"} · Locale: bn-BD</p>
            </div>
          </Section>

          <Section icon={Globe} title="Website Language">
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "en", label: "English", native: "English" },
                { value: "hi", label: "हिन्दी", native: "Hindi" },
                { value: "bn", label: "বাংলা", native: "Bangla" },
              ].map(lang => (
                <label
                  key={lang.value}
                  className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition-colors ${
                    (s("language") || "en") === lang.value ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <input
                    type="radio"
                    name="language"
                    checked={(s("language") || "en") === lang.value}
                    onChange={() => update("language", lang.value)}
                    className="accent-primary"
                  />
                  <div>
                    <p className="font-medium text-foreground">{lang.label}</p>
                    <p className="text-xs text-muted-foreground">{lang.native}</p>
                  </div>
                </label>
              ))}
            </div>
          </Section>

          <Section icon={Globe} title="Product Display">
            <ToggleRow label="Show Stock to Visitors" desc="Display available stock quantity on product pages" checked={isOn("show_stock")} onChange={() => toggle("show_stock")} />
          </Section>

          <Section icon={Globe} title="Current Active Settings">
            <div className="grid grid-cols-4 gap-4">
              <InfoCard label="Country" value={`${s("country") || "Bangladesh"} (${s("country") || "BD"})`} />
              <InfoCard label="Currency" value={`৳ ${s("currency") || "BDT"}`} />
              <InfoCard label="Language" value={(s("language") || "EN").toUpperCase()} />
              <InfoCard label="Last Updated" value={new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })} highlight />
            </div>
          </Section>

          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
              Save Settings
            </Button>
            <Button variant="outline" onClick={() => {
              update("country", "BD"); update("currency", "BDT"); update("language", "en");
              toast.info("ডিফল্ট সেটিংসে রিসেট হয়েছে");
            }}>
              ↻ Reset to Default
            </Button>
          </div>
        </TabsContent>

        {/* ==================== THEME ==================== */}
        <TabsContent value="theme" className="space-y-6 max-w-4xl">
          <Section icon={Palette} title="Brand Colors">
            <div className="grid grid-cols-3 gap-4">
              <ColorField label="Accent / CTA" desc="Buttons, links, badges" settingKey="theme_accent" settings={settings} update={update} />
              <ColorField label="Primary" desc="Header, headings, text" settingKey="theme_primary" settings={settings} update={update} />
              <ColorField label="Secondary" desc="Secondary surfaces" settingKey="theme_secondary" settings={settings} update={update} />
              <ColorField label="Background" desc="Page background" settingKey="theme_background" settings={settings} update={update} />
              <ColorField label="Text" desc="Main text color" settingKey="theme_text" settings={settings} update={update} />
              <ColorField label="Muted Text" desc="Secondary text" settingKey="theme_muted" settings={settings} update={update} />
              <ColorField label="Border" desc="Borders, dividers" settingKey="theme_border" settings={settings} update={update} />
              <ColorField label="Card / Surface" desc="Cards, modals, popups" settingKey="theme_card" settings={settings} update={update} />
            </div>
          </Section>

          <Section icon={Palette} title="Border Radius">
            <Slider
              value={[parseFloat(s("theme_radius") || "0.5")]}
              min={0}
              max={2}
              step={0.1}
              onValueChange={([v]) => update("theme_radius", String(v))}
              className="mb-3"
            />
            <div className="flex gap-2">
              {[
                { label: "Sharp", value: "0" },
                { label: "Subtle", value: "0.25" },
                { label: "Default", value: "0.5" },
                { label: "Rounded", value: "1" },
                { label: "Pill", value: "2" },
              ].map(preset => (
                <Button
                  key={preset.label}
                  size="sm"
                  variant={s("theme_radius") === preset.value ? "default" : "outline"}
                  onClick={() => update("theme_radius", preset.value)}
                >
                  {preset.label}
                </Button>
              ))}
              <span className="ml-auto text-sm text-muted-foreground">{s("theme_radius") || "0.5"}rem</span>
            </div>
          </Section>

          <Section icon={Palette} title="Quick Accent Presets">
            <div className="flex gap-2 flex-wrap">
              {["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#ec4899", "#06b6d4", "#f43f5e", "#10b981"].map(color => (
                <button
                  key={color}
                  onClick={() => update("theme_accent", color)}
                  className="w-10 h-10 rounded-full border-2 transition-transform hover:scale-110"
                  style={{ backgroundColor: color, borderColor: s("theme_accent") === color ? "#000" : "transparent" }}
                />
              ))}
            </div>
          </Section>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
            Save Theme
          </Button>
        </TabsContent>

        {/* ==================== MARKETING ==================== */}
        <TabsContent value="marketing" className="space-y-6 max-w-4xl">
          <Section icon={Megaphone} title="Facebook Pixel">
            <ToggleRow label="Enable Facebook Pixel" desc="Track page views, add to cart, and purchase events" checked={isOn("fb_pixel_enabled")} onChange={() => toggle("fb_pixel_enabled")} />
            <div>
              <Label className="text-primary">Facebook Pixel ID *</Label>
              <div className="flex gap-2 mt-1">
                <Input value={s("fb_pixel_id")} onChange={e => update("fb_pixel_id", e.target.value)} placeholder="123456789012345" className="flex-1" />
                <Button variant="outline" size="sm" onClick={() => {
                  if (/^\d{10,20}$/.test(s("fb_pixel_id"))) toast.success("Pixel ID ভ্যালিড!");
                  else toast.error("Pixel ID ১০-২০ ডিজিটের হতে হবে");
                }}>Validate</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Enter your Pixel ID (10-20 digits). Find it in Facebook Events Manager.</p>
            </div>
            <div>
              <Label>Test Event Code (Optional)</Label>
              <Input className="mt-1" value={s("fb_test_event_code")} onChange={e => update("fb_test_event_code", e.target.value)} placeholder="TEST12345" />
              <p className="text-xs text-muted-foreground mt-1">Use this for testing events in Facebook's Test Events tool</p>
            </div>
          </Section>

          <Section icon={Megaphone} title="Conversion API (Server-Side)">
            <ToggleRow label="Enable Conversion API" desc="Send events server-side for improved tracking accuracy and reliability" checked={isOn("conversion_api_enabled")} onChange={() => toggle("conversion_api_enabled")} />
          </Section>

          <Section icon={Megaphone} title="Cookie Consent (GDPR)">
            <ToggleRow label="Enable Cookie Consent Banner" desc="Show a cookie consent banner to comply with GDPR regulations" checked={isOn("cookie_consent_enabled")} onChange={() => toggle("cookie_consent_enabled")} />
          </Section>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
            Save Marketing Settings
          </Button>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}

// ---- Helper Components ----

function Section({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        <h3 className="font-bold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input className="mt-1" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function ToggleRow({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between border border-border rounded-lg p-4">
      <div>
        <p className="font-medium text-sm text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function ColorField({ label, desc, settingKey, settings, update }: { label: string; desc: string; settingKey: string; settings: SettingsMap; update: (k: string, v: string) => void }) {
  const value = settings[settingKey] || "#000000";
  return (
    <div className="border border-border rounded-lg p-4">
      <Label className="font-semibold">{label}</Label>
      <div className="flex items-center gap-2 mt-2">
        <input
          type="color"
          value={value}
          onChange={e => update(settingKey, e.target.value)}
          className="w-10 h-10 rounded border-0 cursor-pointer"
        />
        <Input
          value={value}
          onChange={e => update(settingKey, e.target.value)}
          className="font-mono text-sm"
        />
      </div>
      <p className="text-xs text-muted-foreground mt-1">{desc}</p>
    </div>
  );
}

function InfoCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-muted/50 rounded-lg p-3">
      <p className={`text-xs ${highlight ? "text-primary" : "text-muted-foreground"}`}>{label}</p>
      <p className="font-semibold text-sm text-foreground mt-1">{value}</p>
    </div>
  );
}
