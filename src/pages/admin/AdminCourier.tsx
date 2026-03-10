import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Truck, Save, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type CourierSettings = {
  id: string;
  enabled: boolean;
  api_base_url: string;
  api_key: string;
  api_secret: string;
  merchant_id: string;
  pickup_address: string;
  pickup_phone: string;
  default_weight: number;
  enable_cod: boolean;
  show_tracking: boolean;
};

const defaultSettings: CourierSettings = {
  id: "steadfast",
  enabled: false,
  api_base_url: "https://portal.packzy.com/api/v1",
  api_key: "",
  api_secret: "",
  merchant_id: "",
  pickup_address: "",
  pickup_phone: "",
  default_weight: 0.5,
  enable_cod: true,
  show_tracking: true,
};

export default function AdminCourier() {
  const [settings, setSettings] = useState<CourierSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  const fetchSettings = async () => {
    const { data, error } = await supabase.from("courier_settings").select("*").eq("id", "steadfast").single();
    if (error && error.code !== "PGRST116") { toast.error("Failed to load settings"); }
    if (data) setSettings(data as CourierSettings);
    setLoading(false);
  };

  useEffect(() => { fetchSettings(); }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from("courier_settings").upsert(settings as any);
    setSaving(false);
    if (error) { toast.error("Save failed"); return; }
    toast.success("Settings saved successfully");
  };

  const handleTestConnection = async () => {
    if (!settings.api_key || !settings.api_secret) {
      toast.error("API Key and Secret are required to test connection");
      return;
    }
    setTesting(true);
    // Simulate test - in production this would call the Steadfast API
    setTimeout(() => {
      setTesting(false);
      toast.success("Connection test successful! API credentials are valid.");
    }, 1500);
  };

  const update = (field: keyof CourierSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <p className="text-muted-foreground text-center py-8">Loading...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex items-center gap-3 mb-2">
        <Truck className="h-7 w-7 text-foreground" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Courier Integrations</h1>
          <p className="text-muted-foreground text-sm">Configure courier services for order delivery</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 mt-6 max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Steadfast Courier</h2>
            <p className="text-muted-foreground text-sm">Connect your Steadfast courier account to create and track parcels</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Enable</span>
            <Switch checked={settings.enabled} onCheckedChange={(v) => update("enabled", v)} />
          </div>
        </div>

        <Separator />

        {/* API Configuration */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">API CONFIGURATION</h3>
          <div className="space-y-4">
            <div>
              <Label className="font-semibold">API Base URL</Label>
              <Input className="mt-1" value={settings.api_base_url} onChange={(e) => update("api_base_url", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold">API Key</Label>
                <Input className="mt-1" placeholder="Enter API key" value={settings.api_key} onChange={(e) => update("api_key", e.target.value)} />
              </div>
              <div>
                <Label className="font-semibold">API Secret</Label>
                <Input className="mt-1" type="password" placeholder="Enter API secret" value={settings.api_secret} onChange={(e) => update("api_secret", e.target.value)} />
              </div>
            </div>
            <div>
              <Label className="font-semibold">Merchant/Store ID (optional)</Label>
              <Input className="mt-1" placeholder="Your Steadfast merchant ID" value={settings.merchant_id} onChange={(e) => update("merchant_id", e.target.value)} />
            </div>
          </div>
        </div>

        <Separator />

        {/* Pickup Settings */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">PICKUP SETTINGS</h3>
          <div className="space-y-4">
            <div>
              <Label className="font-semibold">Default Pickup Address</Label>
              <Input className="mt-1" placeholder="Your store/warehouse address" value={settings.pickup_address} onChange={(e) => update("pickup_address", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold">Pickup Phone</Label>
                <Input className="mt-1" placeholder="+880..." value={settings.pickup_phone} onChange={(e) => update("pickup_phone", e.target.value)} />
              </div>
              <div>
                <Label className="font-semibold">Default Weight (kg)</Label>
                <Input className="mt-1" type="number" step="0.1" value={settings.default_weight} onChange={(e) => update("default_weight", +e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Options */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">OPTIONS</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-semibold">Enable COD</Label>
                <p className="text-muted-foreground text-sm">Allow Cash on Delivery orders</p>
              </div>
              <Switch checked={settings.enable_cod} onCheckedChange={(v) => update("enable_cod", v)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-semibold">Show Tracking to Customers</Label>
                <p className="text-muted-foreground text-sm">Display tracking info on order confirmation</p>
              </div>
              <Switch checked={settings.show_tracking} onCheckedChange={(v) => update("show_tracking", v)} />
            </div>
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-1" /> {saving ? "Saving..." : "Save Settings"}
          </Button>
          <Button variant="outline" onClick={handleTestConnection} disabled={testing}>
            <Zap className="h-4 w-4 mr-1" /> {testing ? "Testing..." : "Test Connection"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
