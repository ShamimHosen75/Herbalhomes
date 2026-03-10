import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { OrderProvider } from "@/contexts/OrderContext";
import { AdminProvider, useAdmin } from "@/contexts/AdminContext";
import { ProductsProvider } from "@/contexts/ProductsContext";
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
import AdminCoupons from "./pages/admin/AdminCoupons";
import AdminShippingMethods from "./pages/admin/AdminShippingMethods";
import AdminShippingZones from "./pages/admin/AdminShippingZones";
import AdminSlider from "./pages/admin/AdminSlider";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminCourier from "./pages/admin/AdminCourier";
import AdminPaymentMethods from "./pages/admin/AdminPaymentMethods";
import AdminCheckoutLeads from "./pages/admin/AdminCheckoutLeads";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSettings from "./pages/admin/AdminSettings";
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
                  <Route path="/admin/checkout-leads" element={<ProtectedAdmin><AdminCheckoutLeads /></ProtectedAdmin>} />
                  <Route path="/admin/slider" element={<ProtectedAdmin><AdminSlider /></ProtectedAdmin>} />
                  <Route path="/admin/coupons" element={<ProtectedAdmin><AdminCoupons /></ProtectedAdmin>} />
                  <Route path="/admin/shipping-zones" element={<ProtectedAdmin><AdminShippingZones /></ProtectedAdmin>} />
                  <Route path="/admin/shipping-methods" element={<ProtectedAdmin><AdminShippingMethods /></ProtectedAdmin>} />
                  <Route path="/admin/reviews" element={<ProtectedAdmin><AdminReviews /></ProtectedAdmin>} />
                  <Route path="/admin/courier" element={<ProtectedAdmin><AdminCourier /></ProtectedAdmin>} />
                  <Route path="/admin/payment-methods" element={<ProtectedAdmin><AdminPaymentMethods /></ProtectedAdmin>} />
                  <Route path="/admin/users" element={<ProtectedAdmin><AdminUsers /></ProtectedAdmin>} />
                  <Route path="/admin/settings" element={<ProtectedAdmin><AdminSettings /></ProtectedAdmin>} />

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
