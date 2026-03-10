import { useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

function hexToHSL(hex: string): string | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

const themeMap: Record<string, string[]> = {
  theme_accent: ["--primary", "--ring", "--sidebar-primary", "--sidebar-ring"],
  theme_primary: ["--foreground", "--card-foreground", "--popover-foreground", "--sidebar-foreground"],
  theme_secondary: ["--secondary"],
  theme_background: ["--background"],
  theme_text: ["--foreground"],
  theme_muted: ["--muted-foreground"],
  theme_border: ["--border", "--input", "--sidebar-border"],
  theme_card: ["--card"],
};

export function DynamicThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSiteSettings();

  useEffect(() => {
    const root = document.documentElement;

    for (const [settingKey, cssVars] of Object.entries(themeMap)) {
      const hex = settings[settingKey];
      if (!hex) continue;
      const hsl = hexToHSL(hex);
      if (!hsl) continue;
      cssVars.forEach(v => root.style.setProperty(v, hsl));
    }

    // Border radius
    const radius = settings.theme_radius;
    if (radius) {
      root.style.setProperty("--radius", `${radius}rem`);
    }

    // Accent foreground (auto white/black based on accent lightness)
    const accentHex = settings.theme_accent;
    if (accentHex) {
      const hsl = hexToHSL(accentHex);
      if (hsl) {
        const lightness = parseInt(hsl.split(" ")[2]);
        const fg = lightness > 55 ? "0 0% 0%" : "0 0% 100%";
        root.style.setProperty("--primary-foreground", fg);
        root.style.setProperty("--sidebar-primary-foreground", fg);
      }
    }
  }, [settings]);

  return <>{children}</>;
}
