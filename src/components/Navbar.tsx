import { useState, useEffect } from "react";
import { ShoppingCart, Menu, X, Search, User, Heart, Phone, LogIn } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [navContent, setNavContent] = useState<any>(null);
  const location = useLocation();
  const { getItemCount } = useCart();
  const { getCount: getWishlistCount } = useWishlist();
  const { settings } = useSiteSettings();
  const { user } = useAuth();
  const { t } = useLanguage();
  const cartCount = getItemCount();
  const wishlistCount = getWishlistCount();

  const storeName = settings.store_name || "Herbal Homes";
  const storeLogo = settings.logo || logo;

  useEffect(() => {
    supabase.from("page_contents").select("*").eq("page_key", "navbar").single().then(({ data }) => {
      if (data) setNavContent((data as any).content);
    });
  }, []);

  const defaultNavLinks = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.shop"), href: "/shop" },
    { label: t("nav.categories"), href: "/categories" },
    { label: t("nav.about"), href: "/about" },
    { label: t("nav.contact"), href: "/contact" },
  ];

  // Always use translated nav links; only use DB for CTA customization
  const navLinks = defaultNavLinks;
  const ctaText = navContent?.cta_text || t("nav.contact");
  const ctaLink = navContent?.cta_link || "/contact";

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        {/* Top row: Logo + Search + Icons */}
        <div className="flex items-center justify-between h-16 md:h-[72px] gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={storeLogo} alt={`${storeName} লোগো`} className="h-9 md:h-11 w-auto" />
          </Link>

          <div className="hidden md:flex flex-1 max-w-md mx-auto">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("nav.search_placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-full bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link: any) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === link.href
                    ? "text-primary bg-accent"
                    : "text-muted-foreground hover:text-primary hover:bg-accent"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 md:gap-2">
            <LanguageSwitcher />
            <Link to="/wishlist" className="hidden md:flex relative p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-accent">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && <span className="absolute top-0.5 right-0.5 h-4 w-4 bg-discount text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">{wishlistCount}</span>}
            </Link>
            <Link to="/cart" className="relative p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-accent">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && <span className="absolute top-0.5 right-0.5 h-4 w-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>}
            </Link>
            {user ? (
              <Link to="/account" className="hidden md:flex p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-accent">
                <User className="h-5 w-5" />
              </Link>
            ) : (
              <Link to="/login" className="hidden md:flex items-center gap-1.5 p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-accent text-sm font-medium">
                <LogIn className="h-5 w-5" />
              </Link>
            )}

            <Link
              to={ctaLink}
              className="hidden lg:flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              {ctaText}
            </Link>

            <button
              className="lg:hidden p-2 text-muted-foreground"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <nav className="lg:hidden pb-4 border-t border-border pt-3 animate-fade-in space-y-1">
            <div className="relative mb-3 md:hidden">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("nav.search_placeholder")}
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            {navLinks.map((link: any) => (
              <Link
                key={link.href}
                to={link.href}
                className={`block py-2.5 px-3 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === link.href
                    ? "text-primary bg-accent"
                    : "text-muted-foreground hover:text-primary hover:bg-accent"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to={ctaLink}
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold mt-2"
              onClick={() => setIsOpen(false)}
            >
              {ctaText}
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
