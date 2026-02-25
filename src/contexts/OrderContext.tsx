import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Order, OrderStatus, ShippingAddress, OrderItem } from "@/data/products";

type OrderContextType = {
  orders: Order[];
  createOrder: (params: {
    items: OrderItem[];
    subtotal: number;
    discount: number;
    shippingCost: number;
    codFee: number;
    total: number;
    couponCode?: string;
    shippingMethod: string;
    address: ShippingAddress;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
  }) => Order;
  getOrderById: (id: string) => Order | undefined;
  trackOrder: (orderId: string, phone: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);
const ORDERS_KEY = "hh_orders";

function generateOrderId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "HH-";
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  const createOrder = useCallback(
    (params: Parameters<OrderContextType["createOrder"]>[0]): Order => {
      const now = new Date().toISOString();
      const order: Order = {
        id: generateOrderId(),
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

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status,
              statusHistory: [...o.statusHistory, { status, date: new Date().toISOString(), note }],
            }
          : o
      )
    );
  }, []);

  return (
    <OrderContext.Provider value={{ orders, createOrder, getOrderById, trackOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
}
