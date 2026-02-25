import { Instagram, Facebook, Twitter } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground/80">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="পিউরন্যাচারা লোগো" className="h-10 w-auto brightness-0 invert" />
              <span className="font-display text-xl font-bold text-primary-foreground">পিউরন্যাচারা</span>
            </div>
            <p className="text-sm leading-relaxed text-primary-foreground/60">
              সুস্থ ও টেকসই জীবনযাপনের জন্য হাতে তৈরি জৈব পণ্য।
            </p>
            <div className="flex gap-3 mt-5">
              <a href="#" className="h-9 w-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-primary-foreground mb-4">দ্রুত লিংক</h4>
            <ul className="space-y-2.5 text-sm">
              {["সকল পণ্য", "সেরা বিক্রিত", "নতুন পণ্য", "গিফট সেট", "ছাড়"].map((l) => (
                <li key={l}><a href="#" className="hover:text-primary transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-primary-foreground mb-4">সাহায্য</h4>
            <ul className="space-y-2.5 text-sm">
              {["সচরাচর জিজ্ঞাসা", "শিপিং ও রিটার্ন", "অর্ডার ট্র্যাক করুন", "যোগাযোগ করুন", "গোপনীয়তা নীতি"].map((l) => (
                <li key={l}><a href="#" className="hover:text-primary transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-primary-foreground mb-4">যোগাযোগ</h4>
            <ul className="space-y-2.5 text-sm">
              <li>hello@purenatura.com</li>
              <li>+৮৮০ ১৭১২-৩৪৫৬৭৮</li>
              <li>শনি - বৃহস্পতি, সকাল ৯টা - সন্ধ্যা ৬টা</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center text-sm text-primary-foreground/40">
          © ২০২৬ পিউরন্যাচারা। সর্বস্বত্ব সংরক্ষিত।
        </div>
      </div>
    </footer>
  );
};

export default Footer;
