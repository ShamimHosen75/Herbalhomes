import { Leaf, Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground/80">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="font-display text-xl font-bold text-primary-foreground">PureNatura</span>
            </div>
            <p className="text-sm leading-relaxed text-primary-foreground/60">
              Handcrafted organic products for a healthier, more sustainable lifestyle.
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

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-primary-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {["Shop All", "Best Sellers", "New Arrivals", "Gift Sets", "Sale"].map((l) => (
                <li key={l}><a href="#" className="hover:text-primary transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-display font-semibold text-primary-foreground mb-4">Help</h4>
            <ul className="space-y-2.5 text-sm">
              {["FAQ", "Shipping & Returns", "Track Order", "Contact Us", "Privacy Policy"].map((l) => (
                <li key={l}><a href="#" className="hover:text-primary transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-primary-foreground mb-4">Contact</h4>
            <ul className="space-y-2.5 text-sm">
              <li>hello@purenatura.com</li>
              <li>+1 (555) 123-4567</li>
              <li>Mon - Fri, 9am - 6pm EST</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center text-sm text-primary-foreground/40">
          © 2026 PureNatura. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
