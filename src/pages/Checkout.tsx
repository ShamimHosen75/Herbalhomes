import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, MapPin, Truck, CreditCard, Shield, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useOrders } from "@/contexts/OrderContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { shippingMethods, type ShippingAddress, type OrderItem } from "@/data/products";
import { toast } from "@/hooks/use-toast";
import PageLayout from "@/components/PageLayout";
import Breadcrumb from "@/components/Breadcrumb";

type PaymentMethod = {
  id: string;
  name: string;
  code: string;
  description: string;
  instructions: string;
  enabled: boolean;
  require_transaction_id: boolean;
  sort_order: number;
  partial_delivery: boolean;
};

const Checkout = () => {
  const { getCartProducts, getSubtotal, getDiscount, appliedCoupon, clearCart, getItemCount } = useCart();
  const { createOrder } = useOrders();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const items = getCartProducts();
  const subtotal = getSubtotal();
  const discount = getDiscount();

  const [shipping, setShipping] = useState(shippingMethods[0]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [transactionId, setTransactionId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const idempotencyRef = useRef<string | null>(null);

  // Load payment methods from database
  useEffect(() => {
    const loadPaymentMethods = async () => {
      const { data } = await supabase
        .from("payment_methods")
        .select("*")
        .eq("enabled", true)
        .order("sort_order");
      const methods = (data || []) as PaymentMethod[];
      setPaymentMethods(methods);
      if (methods.length > 0) setSelectedPayment(methods[0]);
    };
    loadPaymentMethods();
  }, []);

  const codFee = selectedPayment?.code === "cod" ? 20 : 0;
  const total = subtotal - discount + shipping.cost + codFee;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const leadIdRef = useRef<string | null>(null);

  // Save checkout lead when user fills phone
  const saveCheckoutLead = useCallback(async () => {
    if (!phone.trim() || !name.trim()) return;
    if (leadIdRef.current) return;
    const leadId = `LEAD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;
    leadIdRef.current = leadId;
    const cartItems = items.map((item) => ({
      name: item.product.name,
      variantLabel: item.variantLabel,
      price: item.price,
      quantity: item.quantity,
    }));
    await supabase.from("checkout_leads").insert({
      id: leadId,
      customer_name: name,
      customer_phone: phone,
      items: cartItems as any,
      items_count: items.length,
      total,
      address: deliveryAddress,
      status: "new",
    } as any);
  }, [name, phone, deliveryAddress, items, total]);

  if (items.length === 0) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">{t("checkout.cart_empty")}</h1>
          <p className="text-muted-foreground mb-4">{t("checkout.cart_empty_desc")}</p>
          <Link to="/shop" className="text-primary font-semibold hover:underline">{t("checkout.back_to_shop")}</Link>
        </div>
      </PageLayout>
    );
  }

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = t("checkout.name_required");
    if (!phone.trim()) e.phone = t("checkout.phone_required");
    else if (!/^01[3-9]\d{8}$/.test(phone.replace(/\s|-/g, ""))) e.phone = t("checkout.phone_invalid");
    if (!deliveryAddress.trim()) e.deliveryAddress = t("checkout.address_required");
    if (selectedPayment?.require_transaction_id && !transactionId.trim()) e.transactionId = t("checkout.transaction_id_required");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (isSubmitting) return;

    const token = crypto.randomUUID();
    if (idempotencyRef.current) return;
    idempotencyRef.current = token;

    setIsSubmitting(true);

    try {
      for (const item of items) {
        if (item.quantity > item.stock) {
          toast({
            title: t("checkout.stock_error"),
            description: t("checkout.stock_error_desc", { name: item.product.name, variant: item.variantLabel, max: String(item.stock) }),
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
        paymentMethod: selectedPayment?.code || "cod",
        transactionId: transactionId || undefined,
        address: shippingAddress,
        customerName: name,
        customerPhone: phone,
      });

      if (leadIdRef.current) {
        await supabase.from("checkout_leads").update({ status: "converted" } as any).eq("id", leadIdRef.current);
      }

      clearCart();
      navigate(`/order-success/${order.id}`);
    } catch {
      toast({ title: t("checkout.error"), description: t("checkout.order_error"), variant: "destructive" });
      idempotencyRef.current = null;
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <section className="bg-accent py-6">
        <div className="container mx-auto px-4">
          <Breadcrumb items={[{ label: t("cart.title"), href: "/cart" }, { label: t("checkout.title") }]} />
          <h1 className="text-2xl font-bold text-foreground mt-3">{t("checkout.title")}</h1>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Delivery Info */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-card rounded-2xl border border-border p-5">
                  <div className="flex items-center gap-2 mb-5">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-foreground">{t("checkout.delivery_info")}</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        {t("checkout.name")} <span className="text-discount">*</span>
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t("checkout.name_placeholder")}
                        className={`w-full h-11 px-4 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
                          errors.name ? "ring-2 ring-discount/50" : "focus:ring-primary/30"
                        }`}
                      />
                      {errors.name && <p className="text-xs text-discount mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        {t("checkout.phone")} <span className="text-discount">*</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onBlur={saveCheckoutLead}
                        placeholder={t("checkout.phone_placeholder")}
                        className={`w-full h-11 px-4 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
                          errors.phone ? "ring-2 ring-discount/50" : "focus:ring-primary/30"
                        }`}
                      />
                      {errors.phone && <p className="text-xs text-discount mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        {t("checkout.address")} <span className="text-discount">*</span>
                      </label>
                      <textarea
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder={t("checkout.address_placeholder")}
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
                    <h3 className="font-bold text-foreground">{t("checkout.delivery_method")}</h3>
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
                            <p className="text-xs text-muted-foreground">{t("checkout.estimated", { days: method.estimatedDays })}</p>
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
                    <h3 className="font-bold text-foreground">{t("checkout.payment_method")}</h3>
                  </div>
                  <div className="space-y-2">
                    {paymentMethods.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">{t("checkout.no_payment_methods")}</p>
                    ) : paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                          selectedPayment?.id === method.id ? "border-primary bg-accent" : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="payment"
                            checked={selectedPayment?.id === method.id}
                            onChange={() => { setSelectedPayment(method); setTransactionId(""); }}
                            className="h-4 w-4 text-primary focus:ring-primary/30"
                          />
                          <div>
                            <p className="text-sm font-medium text-foreground">{method.name}</p>
                            <p className="text-xs text-muted-foreground">{method.description}</p>
                          </div>
                        </div>
                        {method.code === "cod" && <span className="text-xs text-muted-foreground">+৳20 {t("checkout.cod_fee")}</span>}
                      </label>
                    ))}
                  </div>

                  {selectedPayment && selectedPayment.instructions && (
                    <div className="mt-3 p-3 rounded-lg bg-muted text-xs text-muted-foreground">
                      {selectedPayment.instructions}
                    </div>
                  )}
                  {selectedPayment?.require_transaction_id && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        {t("checkout.transaction_id")} <span className="text-discount">*</span>
                      </label>
                      <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder={t("checkout.transaction_id_placeholder")}
                        className={`w-full h-11 px-4 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
                          errors.transactionId ? "ring-2 ring-discount/50" : "focus:ring-primary/30"
                        }`}
                      />
                      {errors.transactionId && <p className="text-xs text-discount mt-1">{errors.transactionId}</p>}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-2xl border border-border p-5 sticky top-24">
                  <h3 className="font-bold text-foreground mb-4">{t("checkout.order_summary")}</h3>

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
                      <span className="text-muted-foreground">{t("checkout.subtotal")}</span>
                      <span className="text-foreground">৳{subtotal}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-primary">
                        <span>{t("checkout.discount")}</span>
                        <span>-৳{discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("checkout.delivery")}</span>
                      <span className="text-foreground">৳{shipping.cost}</span>
                    </div>
                    {codFee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t("checkout.cod_fee")}</span>
                        <span className="text-foreground">৳{codFee}</span>
                      </div>
                    )}
                    <div className="border-t border-border pt-2 flex justify-between">
                      <span className="font-bold text-foreground">{t("checkout.grand_total")}</span>
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
                        {t("checkout.processing")}
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4" />
                        {t("checkout.confirm_order", { total: String(total) })}
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-muted-foreground mt-3">
                    {t("checkout.terms")}
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
