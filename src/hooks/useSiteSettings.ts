import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = Record<string, string>;

let cachedSettings: SiteSettings | null = null;
let fetchPromise: Promise<SiteSettings> | null = null;
let listeners: Array<(s: SiteSettings) => void> = [];

async function fetchSettings(): Promise<SiteSettings> {
  const { data } = await supabase.from("site_settings").select("*");
  const map: SiteSettings = {};
  (data || []).forEach((row: any) => { map[row.key] = row.value; });
  cachedSettings = map;
  return map;
}

export function invalidateSiteSettings() {
  cachedSettings = null;
  fetchPromise = null;
  fetchSettings().then((s) => {
    listeners.forEach(fn => fn(s));
  });
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(cachedSettings || {});
  const [loading, setLoading] = useState(!cachedSettings);

  useEffect(() => {
    const handler = (s: SiteSettings) => { setSettings(s); setLoading(false); };
    listeners.push(handler);

    if (cachedSettings) { setSettings(cachedSettings); setLoading(false); }
    else {
      if (!fetchPromise) fetchPromise = fetchSettings();
      fetchPromise.then(handler);
    }

    return () => { listeners = listeners.filter(fn => fn !== handler); };
  }, []);

  return { settings, loading };
}
