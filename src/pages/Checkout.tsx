import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, MapPin, Truck, CreditCard, Shield, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useOrders } from "@/contexts/OrderContext";
import { shippingMethods, type ShippingAddress, type OrderItem } from "@/data/products";
import { toast } from "@/hooks/use-toast";
import PageLayout from "@/components/PageLayout";
import Breadcrumb from "@/components/Breadcrumb";

const Checkout = () => {
  const { getCartProducts, getSubtotal, getDiscount, appliedCoupon, clearCart, getItemCount } = useCart();
  const { createOrder } = useOrders();
  const navigate = useNavigate();

  const items = getCartProducts();
  const subtotal = getSubtotal();
  const discount = getDiscount();

  const [shipping, setShipping] = useState(shippingMethods[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const idempotencyRef = useRef<string | null>(null);

  const codFee = 20;
  const total = subtotal - discount + shipping.cost + codFee;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (items.length === 0) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">কার্ট খালি</h1>
          <p className="text-muted-foreground mb-4">চেকআউট করতে কার্টে পণ্য যোগ করুন।</p>
          <Link to="/shop" className="text-primary font-semibold hover:underline">শপে ফিরে যান</Link>
        </div>
      </PageLayout>
    );
  }

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "নাম প্রয়োজন";
    if (!phone.trim()) e.phone = "ফোন নম্বর প্রয়োজন";
    else if (!/^01[3-9]\d{8}$/.test(phone.replace(/\s|-/g, ""))) e.phone = "সঠিক ফোন নম্বর দিন (01xxxxxxxxx)";
    if (!deliveryAddress.trim()) e.deliveryAddress = "ঠিকানা প্রয়োজন";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (isSubmitting) return;

    // Idempotency
    const token = crypto.randomUUID();
    if (idempotencyRef.current) return;
    idempotencyRef.current = token;

    setIsSubmitting(true);

    try {
      // Stock check
      for (const item of items) {
        if (item.quantity > item.stock) {
          toast({
            title: "স্টক সমস্যা",
            description: `"${item.product.name}" (${item.variantLabel}) এ পর্যাপ্ত স্টক নেই। সর্বোচ্চ ${item.stock}টি অর্ডার করা যাবে।`,
            variant: "destructive",
          });
          setIsSubmitting(false);
          idempotencyRef.current = null;
          return;
        }
      }

      const orderItems: OrderItem[] = items.map((item) => ({
        productId: item.product.id,
        variantId: item.variantId,
        name: item.product.name,
        variantLabel: item.variantLabel,
        price: item.price,
        quantity: item.quantity,
        image: item.product.images[0],
      }));

      const shippingAddress: ShippingAddress = {
        fullName: name,
        phone,
        address: deliveryAddress,
        city: "",
        area: "",
        email: "",
        postalCode: "",
        notes: "",
      };

      const order = await createOrder({
        items: orderItems,
        subtotal,
        discount,
        shippingCost: shipping.cost,
        codFee,
        total,
        couponCode: appliedCoupon?.code,
        shippingMethod: shipping.name,
        address: shippingAddress,
        customerName: name,
        customerPhone: phone,
      });

      clearCart();
      navigate(`/order-success/${order.id}`);
    } catch {
      toast({ title: "ত্রুটি", description: "অর্ডার প্রক্রিয়ায় সমস্যা হয়েছে। আবার চেষ্টা করুন।", variant: "destructive" });
      idempotencyRef.current = null;
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <section className="bg-accent py-6">
        <div className="container mx-auto px-4">
          <Breadcrumb items={[{ label: "কার্ট", href: "/cart" }, { label: "চেকআউট" }]} />
          <h1 className="text-2xl font-bold text-foreground mt-3">চেকআউট</h1>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Delivery Info - Simplified */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-card rounded-2xl border border-border p-5">
                  <div className="flex items-center gap-2 mb-5">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-foreground">ডেলিভারি তথ্য</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        নাম <span className="text-discount">*</span>
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="আপনার নাম"
                        className={`w-full h-11 px-4 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
                          errors.name ? "ring-2 ring-discount/50" : "focus:ring-primary/30"
                        }`}
                      />
                      {errors.name && <p className="text-xs text-discount mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        ফোন নম্বর <span className="text-discount">*</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className={`w-full h-11 px-4 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
                          errors.phone ? "ring-2 ring-discount/50" : "focus:ring-primary/30"
                        }`}
                      />
                      {errors.phone && <p className="text-xs text-discount mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        ঠিকানা <span className="text-discount">*</span>
                      </label>
                      <textarea
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="বাসা/ফ্ল্যাট নম্বর, রাস্তা, এলাকা, শহর"
                        rows={3}
                        className={`w-full px-4 py-3 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 resize-none ${
                          errors.deliveryAddress ? "ring-2 ring-discount/50" : "focus:ring-primary/30"
                        }`}
                      />
                      {errors.deliveryAddress && <p className="text-xs text-discount mt-1">{errors.deliveryAddress}</p>}
                    </div>
                  </div>
                </div>

                {/* Shipping Method */}
                <div className="bg-card rounded-2xl border border-border p-5">
                  <div className="flex items-center gap-2 mb-5">
                    <Truck className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-foreground">ডেলিভারি পদ্ধতি</h3>
                  </div>
                  <div className="space-y-2">
                    {shippingMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                          shipping.id === method.id ? "border-primary bg-accent" : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            checked={shipping.id === method.id}
                            onChange={() => setShipping(method)}
                            className="h-4 w-4 text-primary focus:ring-primary/30"
                          />
                          <div>
                            <p className="text-sm font-medium text-foreground">{method.name}</p>
                            <p className="text-xs text-muted-foreground">আনুমানিক {method.estimatedDays}</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-foreground">৳{method.cost}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Payment */}
                <div className="bg-card rounded-2xl border border-border p-5">
                  <div className="flex items-center gap-2 mb-5">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-foreground">পেমেন্ট পদ্ধতি</h3>
                  </div>
                  <label className="flex items-center justify-between p-4 rounded-xl border border-primary bg-accent cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input type="radio" checked readOnly className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">ক্যাশ অন ডেলিভারি (COD)</p>
                        <p className="text-xs text-muted-foreground">পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">+৳{codFee} ফি</span>
                  </label>
                </div>
              </div>

              {/* Right: Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-2xl border border-border p-5 sticky top-24">
                  <h3 className="font-bold text-foreground mb-4">অর্ডার সারাংশ</h3>

                  {/* Items preview */}
                  <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <div key={`${item.product.id}-${item.variantId}`} className="flex gap-3">
                        <img src={item.product.images[0]} alt={item.product.name} className="h-12 w-12 rounded-lg object-cover bg-muted" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground line-clamp-1">{item.product.name}</p>
                          <p className="text-[10px] text-muted-foreground">{item.variantLabel} × {item.quantity}</p>
                        </div>
                        <span className="text-xs font-bold text-foreground whitespace-nowrap">৳{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">সাবটোটাল</span>
                      <span className="text-foreground">৳{subtotal}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-primary">
                        <span>ডিসকাউন্ট</span>
                        <span>-৳{discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ডেলিভারি</span>
                      <span className="text-foreground">৳{shipping.cost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">COD ফি</span>
                      <span className="text-foreground">৳{codFee}</span>
                    </div>
                    <div className="border-t border-border pt-2 flex justify-between">
                      <span className="font-bold text-foreground">সর্বমোট</span>
                      <span className="font-bold text-foreground text-lg">৳{total}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-5 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        প্রসেসিং...
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4" />
                        অর্ডার নিশ্চিত করুন — ৳{total}
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-muted-foreground mt-3">
                    অর্ডার করে আপনি আমাদের শর্তাবলীতে সম্মত হচ্ছেন
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </PageLayout>
  );
};

export default Checkout;
