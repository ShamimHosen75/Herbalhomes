import { Instagram, Facebook, Twitter } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground/80">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="হার্বাল হোমস লোগো" className="h-9 w-auto brightness-0 invert" />
              <span className="font-bold text-lg text-primary-foreground uppercase">Herbal Homes</span>
            </div>
            <p className="text-sm leading-relaxed text-primary-foreground/50 mb-5">
              সুস্থ ও টেকসই জীবনযাপনের জন্য হাতে তৈরি জৈব পণ্য।
            </p>
            <div className="flex gap-2">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="h-9 w-9 rounded-xl bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors">
                  <Icon className="h-4 w-4" />
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
              <li>hello@herbalhomes.com</li>
              <li>+৮৮০ ১৭১২-৩৪৫৬৭৮</li>
              <li>শনি - বৃহস্পতি, সকাল ৯টা - সন্ধ্যা ৬টা</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-10 pt-6 text-center text-xs text-primary-foreground/30">
          © ২০২৬ হার্বাল হোমস। সর্বস্বত্ব সংরক্ষিত।
        </div>
      </div>
    </footer>
  );
};

export default Footer;
