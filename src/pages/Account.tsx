import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Package, User, MapPin, ShoppingCart, Clock, ChevronRight, LogOut, Save, KeyRound } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageLayout from "@/components/PageLayout";
import Breadcrumb from "@/components/Breadcrumb";
import { toast } from "@/hooks/use-toast";

const statusLabels: Record<string, Record<string, string>> = {
  bn: { pending: "অপেক্ষমাণ", confirmed: "নিশ্চিত", packed: "প্যাকেজড", shipped: "শিপড", delivered: "ডেলিভারড", cancelled: "বাতিল", refunded: "রিফান্ড" },
  en: { pending: "Pending", confirmed: "Confirmed", packed: "Packed", shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled", refunded: "Refunded" },
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  packed: "bg-purple-100 text-purple-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-badge-green text-primary",
  cancelled: "bg-red-100 text-discount",
  refunded: "bg-muted text-muted-foreground",
};

const Account = () => {
  const { user, profile, loading, signOut, updateProfile } = useAuth();
  const { orders } = useOrders();
  const { t, language } = useLanguage();

  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [address, setAddress] = useState(profile?.address || "");
  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useState(() => {
    if (profile) {
      setFullName(profile.full_name);
      setPhone(profile.phone);
      setAddress(profile.address);
    }
  });

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </PageLayout>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const handleSaveProfile = async () => {
    setSaving(true);
    const { error } = await updateProfile({ full_name: fullName, phone, address });
    setSaving(false);
    if (error) {
      toast({ title: t("account.update_failed"), description: error, variant: "destructive" });
    } else {
      toast({ title: t("account.update_success") });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({ title: t("account.logout_success") });
  };

  return (
    <PageLayout>
      <section className="bg-accent py-6">
        <div className="container mx-auto px-4">
          <Breadcrumb items={[{ label: t("account.title") }]} />
          <div className="flex items-center justify-between mt-3">
            <h1 className="text-2xl font-bold text-foreground">{t("account.title")}</h1>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-1.5" /> {t("account.logout")}
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { icon: Package, label: t("account.orders"), href: "#orders", count: orders.length },
              { icon: User, label: t("account.profile"), href: "#profile" },
              { icon: MapPin, label: t("account.address"), href: "#profile" },
              { icon: ShoppingCart, label: t("account.track_order"), href: "/track-order" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.href.startsWith("/") ? item.href : ""}
                onClick={item.href.startsWith("#") ? () => document.getElementById(item.href.slice(1))?.scrollIntoView({ behavior: "smooth" }) : undefined}
                className="flex items-center gap-3 bg-card rounded-2xl border border-border p-4 hover:shadow-md transition-shadow"
              >
                <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  {item.count !== undefined && <p className="text-xs text-muted-foreground">{t("account.items", { count: String(item.count) })}</p>}
                </div>
              </Link>
            ))}
          </div>

          <div id="profile" className="bg-card rounded-2xl border border-border p-6 mb-6">
            <h3 className="font-bold text-foreground mb-1">{t("account.profile_info")}</h3>
            <p className="text-sm text-muted-foreground mb-5">{user.email}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">{t("account.full_name")}</label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={t("account.name_placeholder")} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">{t("account.phone")}</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t("account.phone_placeholder")} />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-foreground mb-1.5 block">{t("account.address")}</label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder={t("account.address_placeholder")} />
              </div>
            </div>
            <Button onClick={handleSaveProfile} className="mt-4" disabled={saving}>
              <Save className="h-4 w-4 mr-1.5" /> {saving ? t("account.saving") : t("account.save")}
            </Button>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 mb-6">
            <div className="flex items-center gap-2 mb-5">
              <KeyRound className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-foreground">{t("account.change_password")}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">{t("account.current_password")}</label>
                <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">{t("account.new_password")}</label>
                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder={t("signup.password_placeholder")} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">{t("account.confirm_new_password")}</label>
                <Input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} placeholder={t("signup.confirm_placeholder")} />
              </div>
            </div>
            <Button
              onClick={async () => {
                if (!currentPassword || !newPassword) {
                  toast({ title: t("account.fill_all_fields"), variant: "destructive" });
                  return;
                }
                if (newPassword.length < 6) {
                  toast({ title: t("account.password_min"), variant: "destructive" });
                  return;
                }
                if (newPassword !== confirmNewPassword) {
                  toast({ title: t("account.password_mismatch"), variant: "destructive" });
                  return;
                }
                setChangingPassword(true);
                const { error: signInError } = await supabase.auth.signInWithPassword({ email: user!.email!, password: currentPassword });
                if (signInError) {
                  setChangingPassword(false);
                  toast({ title: t("account.wrong_password"), variant: "destructive" });
                  return;
                }
                const { error } = await supabase.auth.updateUser({ password: newPassword });
                setChangingPassword(false);
                if (error) {
                  toast({ title: t("account.password_change_failed"), description: error.message, variant: "destructive" });
                } else {
                  toast({ title: t("account.password_changed") });
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmNewPassword("");
                }
              }}
              className="mt-4"
              variant="outline"
              disabled={changingPassword}
            >
              <KeyRound className="h-4 w-4 mr-1.5" /> {changingPassword ? t("account.changing_password") : t("account.change_password_btn")}
            </Button>
          </div>

          <div id="orders" className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground">{t("account.order_history")}</h3>
              <Link to="/track-order" className="text-sm text-primary font-semibold hover:underline">{t("account.track")}</Link>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">{t("account.no_orders")}</p>
                <Link to="/shop" className="text-sm text-primary font-semibold hover:underline mt-2 inline-block">{t("account.start_shopping")}</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <Link
                    key={order.id}
                    to={`/track-order?id=${order.id}&phone=${order.customerPhone}`}
                    className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 3).map((item, i) => (
                          <img key={i} src={item.image} alt={item.name} className="h-10 w-10 rounded-lg object-cover border-2 border-background bg-muted" />
                        ))}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{order.id}</p>
                        <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("bn-BD")} • {t("account.items", { count: String(order.items.length) })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">৳{order.total}</p>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${statusColors[order.status]}`}>
                          {(statusLabels[language] || statusLabels.bn)[order.status]}
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Account;