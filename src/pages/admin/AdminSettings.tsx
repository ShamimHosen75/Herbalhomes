import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "hh_admin_settings";

type StoreSettings = {
  storeName: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  facebook: string;
  logo: string;
  currency: string;
};

const defaults: StoreSettings = {
  storeName: "Herbal Homes",
  phone: "01XXXXXXXXX",
  email: "info@herbalhomes.com",
  address: "ঢাকা, বাংলাদেশ",
  whatsapp: "8801XXXXXXXXX",
  facebook: "",
  logo: "",
  currency: "৳",
};

function load(): StoreSettings {
  try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : defaults; } catch { return defaults; }
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<StoreSettings>(load);
  const { toast } = useToast();

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    toast({ title: "Settings saved!" });
  };

  const update = (key: keyof StoreSettings, value: string) => setSettings({ ...settings, [key]: value });

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>

      <div className="bg-card rounded-xl border border-border p-6 max-w-2xl space-y-5">
        <div>
          <label className="text-sm font-medium text-foreground">Store Name</label>
          <Input value={settings.storeName} onChange={(e) => update("storeName", e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Phone</label>
          <Input value={settings.phone} onChange={(e) => update("phone", e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Email</label>
          <Input type="email" value={settings.email} onChange={(e) => update("email", e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Address</label>
          <Input value={settings.address} onChange={(e) => update("address", e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">WhatsApp Number</label>
          <Input value={settings.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Facebook URL</label>
          <Input value={settings.facebook} onChange={(e) => update("facebook", e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Currency Symbol</label>
          <Input value={settings.currency} onChange={(e) => update("currency", e.target.value)} />
        </div>

        <Button onClick={handleSave} className="w-full">Save Settings</Button>
      </div>
    </AdminLayout>
  );
}
