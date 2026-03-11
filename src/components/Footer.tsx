import { useState, useEffect } from "react";
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

interface FooterLink {
  label: string;
  href: string;
}

const Footer = () => {
  const { settings } = useSiteSettings();
  const { t } = useLanguage();
  const [footerData, setFooterData] = useState<any>(null);

  useEffect(() => {
    supabase
      .from("page_contents")
      .select("*")
      .eq("page_key", "footer")
      .single()
      .then(({ data }) => {
        if (data) setFooterData(data.content);
      });
  }, []);

  const storeName = settings.store_name || "Herbal Homes";
  const storeLogo = settings.logo || logo;
  const email = settings.email || "hello@herbalhomes.com";
  const phone = settings.phone || "+৮৮০ ১৭১২-৩৪৫৬৭৮";

  const socialLinks = [
    { icon: Facebook, url: settings.facebook },
    { icon: Instagram, url: settings.instagram },
    { icon: Youtube, url: settings.youtube },
  ].filter((s) => s.url);

  const socialIcons = socialLinks.length > 0
    ? socialLinks
    : [
        { icon: Instagram, url: "#" },
        { icon: Facebook, url: "#" },
        { icon: Twitter, url: "#" },
      ];

  const c = footerData || {};
  const tagline = c.tagline || t("footer.tagline");
  const copyright = c.copyright || t("footer.copyright", { storeName });
  const quickLinks: FooterLink[] = c.quick_links || [
    { label: t("footer.all_products"), href: "/shop" },
    { label: t("footer.best_selling"), href: "/shop" },
    { label: t("footer.new_products"), href: "/shop" },
    { label: t("footer.gift_sets"), href: "/shop" },
    { label: t("footer.discounts"), href: "/shop" },
  ];
  const helpLinks: FooterLink[] = c.help_links || [
    { label: t("footer.faq"), href: "/contact" },
    { label: t("footer.shipping_returns"), href: "/contact" },
    { label: t("footer.track_order"), href: "/track-order" },
    { label: t("footer.contact_us"), href: "/contact" },
    { label: t("footer.privacy_policy"), href: "/about" },
  ];
  const quickLinksTitle = c.quick_links_title || t("footer.quick_links");
  const helpLinksTitle = c.help_links_title || t("footer.help");
  const contactTitle = c.contact_title || t("footer.contact_title");

  return (
    <footer className="bg-foreground text-primary-foreground/80">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={storeLogo} alt={`${storeName} logo`} className="h-9 w-auto" />
              <span className="font-bold text-lg text-primary-foreground uppercase">{storeName}</span>
            </div>
            <p className="text-sm leading-relaxed text-primary-foreground/50 mb-5">{tagline}</p>
            <div className="flex gap-2">
              {socialIcons.map((item, i) => (
                <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-xl bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors">
                  <item.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-primary-foreground mb-4 text-sm">{quickLinksTitle}</h4>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((l, i) => (
                <li key={i}><a href={l.href} className="text-primary-foreground/50 hover:text-primary transition-colors">{l.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-primary-foreground mb-4 text-sm">{helpLinksTitle}</h4>
            <ul className="space-y-2.5 text-sm">
              {helpLinks.map((l, i) => (
                <li key={i}><a href={l.href} className="text-primary-foreground/50 hover:text-primary transition-colors">{l.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-primary-foreground mb-4 text-sm">{contactTitle}</h4>
            <ul className="space-y-2.5 text-sm text-primary-foreground/50">
              <li>{email}</li>
              <li>{phone}</li>
              <li>{settings.address || "শনি - বৃহস্পতি, সকাল ৯টা - সন্ধ্যা ৬টা"}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-10 pt-6 text-center text-xs text-primary-foreground/30">
          {copyright}
        </div>
      </div>
    </footer>
  );
};

export default Footer;