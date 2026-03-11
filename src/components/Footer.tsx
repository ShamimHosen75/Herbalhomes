import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import logo from "@/assets/logo.png";

const Footer = () => {
  const { settings } = useSiteSettings();

  const storeName = settings.store_name || "Herbal Homes";
  const storeLogo = settings.logo || logo;
  const email = settings.email || "hello@herbalhomes.com";
  const phone = settings.phone || "+৮৮০ ১৭১২-৩৪৫৬৭৮";

  const socialLinks = [
    { icon: Facebook, url: settings.facebook },
    { icon: Instagram, url: settings.instagram },
    { icon: Youtube, url: settings.youtube },
  ].filter((s) => s.url);

  // Fallback if no social links configured
  const socialIcons = socialLinks.length > 0
    ? socialLinks
    : [
        { icon: Instagram, url: "#" },
        { icon: Facebook, url: "#" },
        { icon: Twitter, url: "#" },
      ];

  return (
    <footer className="bg-foreground text-primary-foreground/80">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={storeLogo} alt={`${storeName} লোগো`} className="h-9 w-auto" />
              <span className="font-bold text-lg text-primary-foreground uppercase">{storeName}</span>
            </div>
            <p className="text-sm leading-relaxed text-primary-foreground/50 mb-5">
              সুস্থ ও টেকসই জীবনযাপনের জন্য হাতে তৈরি জৈব পণ্য।
            </p>
            <div className="flex gap-2">
              {socialIcons.map((item, i) => (
                <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-xl bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors">
                  <item.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-primary-foreground mb-4 text-sm">দ্রুত লিংক</h4>
            <ul className="space-y-2.5 text-sm">
              {["সকল পণ্য", "সেরা বিক্রিত", "নতুন পণ্য", "গিফট সেট", "ছাড়"].map((l) => (
                <li key={l}><a href="#" className="text-primary-foreground/50 hover:text-primary transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-primary-foreground mb-4 text-sm">সাহায্য</h4>
            <ul className="space-y-2.5 text-sm">
              {["সচরাচর জিজ্ঞাসা", "শিপিং ও রিটার্ন", "অর্ডার ট্র্যাক করুন", "যোগাযোগ করুন", "গোপনীয়তা নীতি"].map((l) => (
                <li key={l}><a href="#" className="text-primary-foreground/50 hover:text-primary transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-primary-foreground mb-4 text-sm">যোগাযোগ</h4>
            <ul className="space-y-2.5 text-sm text-primary-foreground/50">
              <li>{email}</li>
              <li>{phone}</li>
              <li>{settings.address || "শনি - বৃহস্পতি, সকাল ৯টা - সন্ধ্যা ৬টা"}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-10 pt-6 text-center text-xs text-primary-foreground/30">
          © ২০২৬ {storeName}। সর্বস্বত্ব সংরক্ষিত।
        </div>
      </div>
    </footer>
  );
};

export default Footer;
