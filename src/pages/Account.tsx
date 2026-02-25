import { Link } from "react-router-dom";
import { Package, User, MapPin, ShoppingCart, Clock, ChevronRight } from "lucide-react";
import { useOrders } from "@/contexts/OrderContext";
import PageLayout from "@/components/PageLayout";
import Breadcrumb from "@/components/Breadcrumb";

const statusLabels: Record<string, string> = {
  pending: "অপেক্ষমাণ",
  confirmed: "নিশ্চিত",
  packed: "প্যাকেজড",
  shipped: "শিপড",
  delivered: "ডেলিভারড",
  cancelled: "বাতিল",
  refunded: "রিফান্ড",
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
  const { orders } = useOrders();

  return (
    <PageLayout>
      <section className="bg-accent py-6">
        <div className="container mx-auto px-4">
          <Breadcrumb items={[{ label: "আমার অ্যাকাউন্ট" }]} />
          <h1 className="text-2xl font-bold text-foreground mt-3">আমার অ্যাকাউন্ট</h1>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { icon: Package, label: "অর্ডার", href: "#orders", count: orders.length },
              { icon: User, label: "প্রোফাইল", href: "#profile" },
              { icon: MapPin, label: "ঠিকানা", href: "#address" },
              { icon: ShoppingCart, label: "ট্র্যাক অর্ডার", href: "/track-order" },
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
                  {item.count !== undefined && <p className="text-xs text-muted-foreground">{item.count}টি</p>}
                </div>
              </Link>
            ))}
          </div>

          {/* Profile placeholder */}
          <div id="profile" className="bg-card rounded-2xl border border-border p-5 mb-6">
            <h3 className="font-bold text-foreground mb-4">প্রোফাইল</h3>
            <p className="text-sm text-muted-foreground">
              লগইন ফিচার Lovable Cloud সক্রিয় করার পর ব্যবহারযোগ্য হবে। বর্তমানে আপনার সকল অর্ডার এই ডিভাইসে সংরক্ষিত আছে।
            </p>
          </div>

          {/* Orders */}
          <div id="orders" className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground">অর্ডার ইতিহাস</h3>
              <Link to="/track-order" className="text-sm text-primary font-semibold hover:underline">
                ট্র্যাক করুন
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">এখনো কোনো অর্ডার করা হয়নি।</p>
                <Link to="/shop" className="text-sm text-primary font-semibold hover:underline mt-2 inline-block">
                  শপিং শুরু করুন
                </Link>
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
                          <img
                            key={i}
                            src={item.image}
                            alt={item.name}
                            className="h-10 w-10 rounded-lg object-cover border-2 border-background bg-muted"
                          />
                        ))}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{order.id}</p>
                        <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("bn-BD")} • {order.items.length}টি পণ্য</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">৳{order.total}</p>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${statusColors[order.status]}`}>
                          {statusLabels[order.status]}
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
