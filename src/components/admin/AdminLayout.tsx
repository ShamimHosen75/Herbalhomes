import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ShoppingCart,
  Users,
  Image,
  Tag,
  MapPin,
  Truck,
  MessageSquare,
  CreditCard,
  Settings,
  LogOut,
  Store,
  ChevronRight,
  Menu,
  X,
  UserCheck,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/contexts/AdminContext";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Products", icon: Package, path: "/admin/products" },
  { label: "Categories", icon: FolderOpen, path: "/admin/categories" },
  { label: "Orders", icon: ShoppingCart, path: "/admin/orders" },
  { label: "Checkout Leads", icon: UserCheck, path: "/admin/checkout-leads" },
  { label: "Slider", icon: Image, path: "/admin/slider" },
  { label: "Coupons", icon: Tag, path: "/admin/coupons" },
  { label: "Shipping Zones", icon: MapPin, path: "/admin/shipping-zones" },
  { label: "Shipping Methods", icon: Truck, path: "/admin/shipping-methods" },
  { label: "Reviews", icon: MessageSquare, path: "/admin/reviews" },
  { label: "Courier", icon: Truck, path: "/admin/courier" },
  { label: "Payment Methods", icon: CreditCard, path: "/admin/payment-methods" },
  { label: "Landing Pages", icon: FileText, path: "/admin/landing-pages" },
  { label: "Users", icon: Users, path: "/admin/users" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { adminEmail, logout } = useAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-4 border-b border-border flex items-center gap-2">
        <span className="font-bold text-lg text-foreground">STORE</span>
        <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded font-medium">Admin</span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-2">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="h-4 w-4" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-border p-4 space-y-2">
        {adminEmail && (
          <div className="px-2 mb-2">
            <p className="text-xs text-muted-foreground truncate">{adminEmail}</p>
            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded mt-1 inline-block">Admin</span>
          </div>
        )}
        <Link
          to="/"
          className="flex items-center gap-3 px-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Store className="h-4 w-4" />
          Back to Store
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-2 py-2 text-sm text-destructive hover:text-destructive/80 transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 flex-col bg-card border-r border-border fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-60 h-full flex flex-col bg-card z-50">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-3 right-3 p-1 text-muted-foreground"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-60">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center gap-3 p-4 bg-card border-b border-border">
          <button onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5 text-foreground" />
          </button>
          <span className="font-bold text-foreground">STORE</span>
          <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">Admin</span>
        </header>

        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
