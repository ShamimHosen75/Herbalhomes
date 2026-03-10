import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = Record<string, string>;

let cachedSettings: SiteSettings | null = null;
let fetchPromise: Promise<SiteSettings> | null = null;

async function fetchSettings(): Promise<SiteSettings> {
  const { data } = await supabase.from("site_settings").select("*");
  const map: SiteSettings = {};
  (data || []).forEach((row: any) => { map[row.key] = row.value; });
  cachedSettings = map;
  return map;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(cachedSettings || {});
  const [loading, setLoading] = useState(!cachedSettings);

  useEffect(() => {
    if (cachedSettings) { setSettings(cachedSettings); setLoading(false); return; }
    if (!fetchPromise) fetchPromise = fetchSettings();
    fetchPromise.then((s) => { setSettings(s); setLoading(false); });
  }, []);

  return { settings, loading };
}
