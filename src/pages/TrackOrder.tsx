import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Package, CheckCircle2, Truck, PackageCheck, XCircle, RotateCcw, Clock } from "lucide-react";
import { useOrders } from "@/contexts/OrderContext";
import type { OrderStatus } from "@/data/products";
import PageLayout from "@/components/PageLayout";
import Breadcrumb from "@/components/Breadcrumb";

const statusConfig: Record<OrderStatus, { label: string; icon: typeof Package; color: string }> = {
  pending: { label: "অপেক্ষমাণ", icon: Clock, color: "text-yellow-600" },
  confirmed: { label: "নিশ্চিত", icon: CheckCircle2, color: "text-blue-600" },
  packed: { label: "প্যাকেজড", icon: Package, color: "text-purple-600" },
  shipped: { label: "শিপড", icon: Truck, color: "text-indigo-600" },
  delivered: { label: "ডেলিভারড", icon: PackageCheck, color: "text-primary" },
  cancelled: { label: "বাতিল", icon: XCircle, color: "text-discount" },
  refunded: { label: "রিফান্ড", icon: RotateCcw, color: "text-muted-foreground" },
};

const statusOrder: OrderStatus[] = ["pending", "confirmed", "packed", "shipped", "delivered"];

const TrackOrder = () => {
  const [searchParams] = useSearchParams();
  const { trackOrder } = useOrders();

  const [orderId, setOrderId] = useState(searchParams.get("id") || "");
  const [phone, setPhone] = useState(searchParams.get("phone") || "");
  const [searched, setSearched] = useState(!!(searchParams.get("id") && searchParams.get("phone")));

  const order = searched ? trackOrder(orderId, phone) : undefined;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  const currentStepIdx = order ? statusOrder.indexOf(order.status) : -1;

  return (
    <PageLayout>
      <section className="bg-accent py-6">
        <div className="container mx-auto px-4">
          <Breadcrumb items={[{ label: "অর্ডার ট্র্যাক" }]} />
          <h1 className="text-2xl font-bold text-foreground mt-3">অর্ডার ট্র্যাক করুন</h1>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4 max-w-xl">
          <form onSubmit={handleSearch} className="bg-card rounded-2xl border border-border p-5 mb-8">
            <h3 className="font-bold text-foreground mb-4">অর্ডার খুঁজুন</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="অর্ডার আইডি (যেমন: HH-XXXXXXXX)"
                value={orderId}
                onChange={(e) => { setOrderId(e.target.value); setSearched(false); }}
                className="w-full h-11 px-4 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
              <input
                type="tel"
                placeholder="ফোন নম্বর (যেমন: 01XXXXXXXXX)"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setSearched(false); }}
                className="w-full h-11 px-4 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
              <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                <Search className="h-4 w-4" />
                ট্র্যাক করুন
              </button>
            </div>
          </form>

          {searched && !order && (
            <div className="text-center py-8">
              <p className="text-foreground font-semibold mb-1">অর্ডার পাওয়া যায়নি</p>
              <p className="text-sm text-muted-foreground">অর্ডার আইডি ও ফোন নম্বর সঠিকভাবে দিন।</p>
            </div>
          )}

          {order && (
            <div className="bg-card rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-muted-foreground">অর্ডার আইডি</p>
                  <p className="font-bold text-foreground text-lg">{order.id}</p>
                </div>
                <div className={`flex items-center gap-1.5 text-sm font-semibold ${statusConfig[order.status].color}`}>
                  {(() => { const Icon = statusConfig[order.status].icon; return <Icon className="h-4 w-4" />; })()}
                  {statusConfig[order.status].label}
                </div>
              </div>

              {/* Timeline */}
              {!["cancelled", "refunded"].includes(order.status) && (
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    {statusOrder.map((s, i) => {
                      const isActive = i <= currentStepIdx;
                      const cfg = statusConfig[s];
                      const Icon = cfg.icon;
                      return (
                        <div key={s} className="flex flex-col items-center relative flex-1">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <p className={`text-[9px] mt-1 text-center ${isActive ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                            {cfg.label}
                          </p>
                          {i < statusOrder.length - 1 && (
                            <div className={`absolute top-4 left-[calc(50%+16px)] h-0.5 w-[calc(100%-32px)] ${i < currentStepIdx ? "bg-primary" : "bg-border"}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Order details */}
              <div className="space-y-3 text-sm border-t border-border pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">তারিখ</span>
                  <span className="text-foreground">{new Date(order.createdAt).toLocaleDateString("bn-BD")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">মোট</span>
                  <span className="font-bold text-foreground">৳{order.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">পেমেন্ট</span>
                  <span className="text-foreground">ক্যাশ অন ডেলিভারি</span>
                </div>
                {order.trackingNumber && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ট্র্যাকিং</span>
                    <span className="text-foreground">{order.courierName} - {order.trackingNumber}</span>
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="border-t border-border mt-4 pt-4">
                <h4 className="font-semibold text-foreground text-sm mb-3">পণ্য সমূহ</h4>
                <div className="space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <img src={item.image} alt={item.name} className="h-10 w-10 rounded-lg object-cover bg-muted" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground line-clamp-1">{item.name}</p>
                        <p className="text-[10px] text-muted-foreground">{item.variantLabel} × {item.quantity}</p>
                      </div>
                      <span className="text-xs font-bold text-foreground">৳{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status History */}
              <div className="border-t border-border mt-4 pt-4">
                <h4 className="font-semibold text-foreground text-sm mb-3">স্ট্যাটাস ইতিহাস</h4>
                <div className="space-y-2">
                  {order.statusHistory.map((h, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-foreground">{statusConfig[h.status].label}</p>
                        {h.note && <p className="text-[10px] text-muted-foreground">{h.note}</p>}
                        <p className="text-[10px] text-muted-foreground">{new Date(h.date).toLocaleString("bn-BD")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default TrackOrder;
