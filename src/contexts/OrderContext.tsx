import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Order, OrderStatus, ShippingAddress, OrderItem } from "@/data/products";

type OrderContextType = {
  orders: Order[];
  loading: boolean;
  createOrder: (params: {
    items: OrderItem[];
    subtotal: number;
    discount: number;
    shippingCost: number;
    codFee: number;
    total: number;
    couponCode?: string;
    shippingMethod: string;
    paymentMethod?: string;
    address: ShippingAddress;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
  }) => Promise<Order>;
  getOrderById: (id: string) => Order | undefined;
  trackOrder: (orderId: string, phone: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => Promise<void>;
  refreshOrders: () => Promise<void>;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

function generateOrderId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "HH-";
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

function dbOrderToApp(row: any, items: any[], history: any[]): Order {
  return {
    id: row.id,
    items: items.map((i) => ({
      productId: i.product_id,
      variantId: i.variant_id,
      name: i.name,
      variantLabel: i.variant_label,
      price: Number(i.price),
      quantity: i.quantity,
      image: i.image,
    })),
    subtotal: Number(row.subtotal),
    discount: Number(row.discount),
    shippingCost: Number(row.shipping_cost),
    codFee: Number(row.cod_fee),
    total: Number(row.total),
    couponCode: row.coupon_code,
    status: row.status as OrderStatus,
    statusHistory: history.map((h) => ({
      status: h.status as OrderStatus,
      date: h.date,
      note: h.note,
    })),
    paymentMethod: row.payment_method as "cod",
    shippingMethod: row.shipping_method,
    trackingNumber: row.tracking_number,
    courierName: row.courier_name,
    address: row.address as ShippingAddress,
    createdAt: row.created_at,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerEmail: row.customer_email,
  };
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data: rows } = await supabase.from("orders").select("*").order("created_at", { ascending: false }) as any;
      const { data: allItems } = await supabase.from("order_items").select("*") as any;
      const { data: allHistory } = await supabase.from("order_status_history").select("*").order("created_at", { ascending: true }) as any;

      const mapped = (rows || []).map((row: any) => {
        const items = (allItems || []).filter((i: any) => i.order_id === row.id);
        const history = (allHistory || []).filter((h: any) => h.order_id === row.id);
        return dbOrderToApp(row, items, history);
      });

      setOrders(mapped);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const createOrder = useCallback(
    async (params: Parameters<OrderContextType["createOrder"]>[0]): Promise<Order> => {
      const orderId = generateOrderId();
      const now = new Date().toISOString();

      await supabase.from("orders").insert({
        id: orderId,
        subtotal: params.subtotal,
        discount: params.discount,
        shipping_cost: params.shippingCost,
        cod_fee: params.codFee,
        total: params.total,
        coupon_code: params.couponCode,
        status: "pending",
        payment_method: params.paymentMethod || "cod",
        shipping_method: params.shippingMethod,
        address: params.address as any,
        customer_name: params.customerName,
        customer_phone: params.customerPhone,
        customer_email: params.customerEmail,
      } as any);

      for (const item of params.items) {
        await supabase.from("order_items").insert({
          order_id: orderId,
          product_id: item.productId,
          variant_id: item.variantId,
          name: item.name,
          variant_label: item.variantLabel,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        } as any);
      }

      await supabase.from("order_status_history").insert({
        order_id: orderId,
        status: "pending",
        date: now,
        note: "অর্ডার গৃহীত হয়েছে",
      } as any);

      const order: Order = {
        id: orderId,
        items: params.items,
        subtotal: params.subtotal,
        discount: params.discount,
        shippingCost: params.shippingCost,
        codFee: params.codFee,
        total: params.total,
        couponCode: params.couponCode,
        status: "pending",
        statusHistory: [{ status: "pending", date: now, note: "অর্ডার গৃহীত হয়েছে" }],
        paymentMethod: "cod",
        shippingMethod: params.shippingMethod,
        address: params.address,
        createdAt: now,
        customerName: params.customerName,
        customerPhone: params.customerPhone,
        customerEmail: params.customerEmail,
      };

      setOrders((prev) => [order, ...prev]);
      return order;
    },
    []
  );

  const getOrderById = useCallback((id: string) => orders.find((o) => o.id === id), [orders]);

  const trackOrder = useCallback(
    (orderId: string, phone: string) =>
      orders.find((o) => o.id.toLowerCase() === orderId.toLowerCase() && o.customerPhone === phone),
    [orders]
  );

  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus, note?: string) => {
    const now = new Date().toISOString();

    await supabase.from("orders").update({ status } as any).eq("id", orderId);
    await supabase.from("order_status_history").insert({
      order_id: orderId,
      status,
      date: now,
      note,
    } as any);

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status,
              statusHistory: [...o.statusHistory, { status, date: now, note }],
            }
          : o
      )
    );
  }, []);

  return (
    <OrderContext.Provider value={{ orders, loading, createOrder, getOrderById, trackOrder, updateOrderStatus, refreshOrders: fetchOrders }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
}
