import { useState } from "react";
import { ShoppingCart, Menu, X, Search, User, Heart, Phone } from "lucide-react";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { label: "হোমপেজ", href: "#", icon: "🏠" },
    { label: "পণ্য সমূহ", href: "#best-sellers" },
    { label: "অর্ডার ট্র্যাক", href: "#" },
    { label: "যোগাযোগ", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-[72px] gap-4">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 shrink-0">
            <img src={logo} alt="হার্বাল হোমস লোগো" className="h-9 md:h-11 w-auto" />
            <span className="hidden sm:block font-bold text-lg md:text-xl text-foreground uppercase tracking-wide">
              Herbal Homes
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  i === 0
                    ? "text-primary bg-accent"
                    : "text-muted-foreground hover:text-primary hover:bg-accent"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-sm">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="প্রোডাক্ট খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-1 md:gap-2">
            <button className="hidden md:flex p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-accent">
              <Heart className="h-5 w-5" />
            </button>
            <button className="relative p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-accent">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute top-0.5 right-0.5 h-4 w-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                ৩
              </span>
            </button>
            <button className="hidden md:flex p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-accent">
              <User className="h-5 w-5" />
            </button>

            {/* Call CTA */}
            <a
              href="tel:+8801712345678"
              className="hidden lg:flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              <Phone className="h-4 w-4" />
              কল করুন
            </a>

            <button
              className="lg:hidden p-2 text-muted-foreground"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <nav className="lg:hidden pb-4 border-t border-border pt-3 animate-fade-in space-y-1">
            {/* Mobile search */}
            <div className="relative mb-3 md:hidden">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="প্রোডাক্ট খুঁজুন..."
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block py-2.5 px-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="tel:+8801712345678"
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold mt-2"
            >
              <Phone className="h-4 w-4" />
              কল করুন
            </a>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
