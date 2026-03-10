import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { OrderProvider } from "@/contexts/OrderContext";
import { AdminProvider, useAdmin } from "@/contexts/AdminContext";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Categories from "./pages/Categories";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import TrackOrder from "./pages/TrackOrder";
import Wishlist from "./pages/Wishlist";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminPlaceholder from "./pages/admin/AdminPlaceholder";
import type { ReactNode } from "react";

const queryClient = new QueryClient();

function ProtectedAdmin({ children }: { children: ReactNode }) {
  const { isAdmin } = useAdmin();
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <WishlistProvider>
          <OrderProvider>
            <AdminProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Store routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/product/:slug" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-success/:orderId" element={<OrderSuccess />} />
                  <Route path="/track-order" element={<TrackOrder />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/account" element={<Account />} />

                  {/* Admin routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={<ProtectedAdmin><AdminDashboard /></ProtectedAdmin>} />
                  <Route path="/admin/products" element={<ProtectedAdmin><AdminProducts /></ProtectedAdmin>} />
                  <Route path="/admin/categories" element={<ProtectedAdmin><AdminCategories /></ProtectedAdmin>} />
                  <Route path="/admin/orders" element={<ProtectedAdmin><AdminOrders /></ProtectedAdmin>} />
                  <Route path="/admin/checkout-leads" element={<ProtectedAdmin><AdminPlaceholder title="Checkout Leads" /></ProtectedAdmin>} />
                  <Route path="/admin/slider" element={<ProtectedAdmin><AdminPlaceholder title="Slider" /></ProtectedAdmin>} />
                  <Route path="/admin/coupons" element={<ProtectedAdmin><AdminPlaceholder title="Coupons" /></ProtectedAdmin>} />
                  <Route path="/admin/shipping-zones" element={<ProtectedAdmin><AdminPlaceholder title="Shipping Zones" /></ProtectedAdmin>} />
                  <Route path="/admin/shipping-methods" element={<ProtectedAdmin><AdminPlaceholder title="Shipping Methods" /></ProtectedAdmin>} />
                  <Route path="/admin/reviews" element={<ProtectedAdmin><AdminPlaceholder title="Reviews" /></ProtectedAdmin>} />
                  <Route path="/admin/courier" element={<ProtectedAdmin><AdminPlaceholder title="Courier" /></ProtectedAdmin>} />
                  <Route path="/admin/payment-methods" element={<ProtectedAdmin><AdminPlaceholder title="Payment Methods" /></ProtectedAdmin>} />
                  <Route path="/admin/users" element={<ProtectedAdmin><AdminPlaceholder title="Users" /></ProtectedAdmin>} />
                  <Route path="/admin/settings" element={<ProtectedAdmin><AdminPlaceholder title="Settings" /></ProtectedAdmin>} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </AdminProvider>
          </OrderProvider>
        </WishlistProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
