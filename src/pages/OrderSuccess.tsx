import { useParams, Link } from "react-router-dom";
import { CheckCircle2, Package, ArrowRight, Copy } from "lucide-react";
import { useOrders } from "@/contexts/OrderContext";
import PageLayout from "@/components/PageLayout";
import { toast } from "@/hooks/use-toast";

const OrderSuccess = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById } = useOrders();
  const order = getOrderById(orderId || "");

  const copyOrderId = () => {
    if (order) {
      navigator.clipboard.writeText(order.id);
      toast({ title: "কপি হয়েছে", description: "অর্ডার আইডি কপি করা হয়েছে।" });
    }
  };

  if (!order) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">অর্ডার পাওয়া যায়নি</h1>
          <Link to="/" className="text-primary font-semibold hover:underline">হোমে ফিরে যান</Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-lg text-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">অর্ডার সফল!</h1>
          <p className="text-muted-foreground mb-6">আপনার অর্ডার সফলভাবে গৃহীত হয়েছে। ধন্যবাদ!</p>

          <div className="bg-card rounded-2xl border border-border p-6 text-left mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-muted-foreground">অর্ডার আইডি</p>
                <p className="font-bold text-foreground text-lg">{order.id}</p>
              </div>
              <button onClick={copyOrderId} className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center hover:bg-accent">
                <Copy className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">পেমেন্ট</span>
                <span className="text-foreground">ক্যাশ অন ডেলিভারি</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ডেলিভারি</span>
                <span className="text-foreground">{order.shippingMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">মোট</span>
                <span className="font-bold text-foreground">৳{order.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">স্ট্যাটাস</span>
                <span className="inline-flex items-center gap-1.5 text-primary font-semibold">
                  <Package className="h-3.5 w-3.5" />
                  অপেক্ষমাণ
                </span>
              </div>
            </div>
          </div>

          <div className="bg-accent rounded-2xl p-4 mb-6 text-left">
            <h4 className="font-semibold text-foreground text-sm mb-2">পরবর্তী ধাপ:</h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>• আমরা শীঘ্রই আপনার অর্ডার নিশ্চিত করবো</li>
              <li>• ডেলিভারির আগে ফোনে যোগাযোগ করা হবে</li>
              <li>• পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to={`/track-order?id=${order.id}&phone=${order.customerPhone}`}
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              অর্ডার ট্র্যাক করুন
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/shop"
              className="flex-1 flex items-center justify-center gap-2 bg-muted text-foreground py-3 rounded-xl text-sm font-semibold hover:bg-accent transition-colors"
            >
              শপিং চালিয়ে যান
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default OrderSuccess;
