import { useState } from "react";
import { ShoppingCart, Menu, X, Search, User, Heart, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "#" },
    { label: "Shop", href: "#best-sellers" },
    { label: "Categories", href: "#categories" },
    { label: "About", href: "#why-us" },
    { label: "Contact", href: "#newsletter" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <Leaf className="h-7 w-7 text-primary" />
            <span className="font-display text-xl md:text-2xl font-bold text-foreground tracking-tight">
              PureNatura
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-3">
            <button className="hidden md:flex p-2 text-muted-foreground hover:text-primary transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <button className="hidden md:flex p-2 text-muted-foreground hover:text-primary transition-colors">
              <User className="h-5 w-5" />
            </button>
            <button className="hidden md:flex p-2 text-muted-foreground hover:text-primary transition-colors">
              <Heart className="h-5 w-5" />
            </button>
            <button className="relative p-2 text-muted-foreground hover:text-primary transition-colors">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            <button
              className="md:hidden p-2 text-muted-foreground"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <nav className="md:hidden pb-4 border-t border-border pt-4 animate-fade-in">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block py-2.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
