import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useOrders } from "@/contexts/OrderContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, RefreshCw, MoreHorizontal, Eye, MessageCircle, Truck, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { OrderStatus, Order } from "@/data/products";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-orange-100 text-orange-800",
  packed: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
};

const allStatuses: OrderStatus[] = ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled", "refunded"];

export default function AdminOrders() {
  const { orders, updateOrderStatus, refreshOrders } = useOrders();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [courierEnabled, setCourierEnabled] = useState(false);
  const [sendingOrderId, setSendingOrderId] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    supabase
      .from("courier_settings")
      .select("enabled")
      .eq("id", "steadfast")
      .single()
      .then(({ data }) => {
        if (data) setCourierEnabled((data as any).enabled);
      });
  }, []);

  const filtered = orders.filter((o) => {
    const matchesSearch =
      !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search);
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sendToSteadfast = async (order: Order) => {
    if (order.trackingNumber) {
      toast.error("এই অর্ডার ইতিমধ্যে কুরিয়ারে পাঠানো হয়েছে");
      return;
    }

    setSendingOrderId(order.id);
    try {
      const { data, error } = await supabase.functions.invoke("send-to-steadfast", {
        body: { order_id: order.id },
      });

      if (error) {
        toast.error(`কুরিয়ারে পাঠাতে সমস্যা: ${error.message}`);
        return;
      }

      if (data?.error) {
        toast.error(`Steadfast Error: ${data.error}`);
        return;
      }

      toast.success(`অর্ডার ${order.id} Steadfast এ পাঠানো হয়েছে! Tracking: ${data.tracking_code}`);
      await refreshOrders();
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setSendingOrderId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Orders</h1>
        <Button variant="outline" size="sm" onClick={() => refreshOrders()}>
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by order ID, customer, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {allStatuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-xl border border-border">
        {filtered.length === 0 ? (
          <p className="p-8 text-center text-muted-foreground">No orders found</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ORDER NUMBER</TableHead>
                <TableHead>CUSTOMER</TableHead>
                <TableHead>PHONE</TableHead>
                <TableHead>PAYMENT</TableHead>
                <TableHead>TOTAL</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>COURIER</TableHead>
                <TableHead>DATE</TableHead>
                <TableHead className="text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <a href={`tel:${order.customerPhone}`} className="text-primary underline hover:text-primary/80">{order.customerPhone}</a>
                      <a href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700" title="WhatsApp">
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <Badge variant="outline" className="text-xs">{order.paymentMethod.toUpperCase()}</Badge>
                      {order.transactionId && (
                        <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">{order.transactionId}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>৳{order.total.toLocaleString("bn-BD")}</TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(val) => updateOrderStatus(order.id, val as OrderStatus)}
                    >
                      <SelectTrigger className="w-32 h-8 text-xs border-0 p-0">
                        <Badge variant="secondary" className={`${statusColors[order.status]} text-xs cursor-pointer`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {allStatuses.map((s) => (
                          <SelectItem key={s} value={s}>
                            <Badge variant="secondary" className={`${statusColors[s]} text-xs`}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </Badge>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {order.trackingNumber ? (
                      <div className="text-xs">
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-[10px]">
                          <Truck className="w-3 h-3 mr-1" />
                          {order.courierName || "Steadfast"}
                        </Badge>
                        <p className="font-mono text-muted-foreground mt-0.5">{order.trackingNumber}</p>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric", month: "short", day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setViewOrder(order)}>
                          <Eye className="w-4 h-4 mr-2" /> View Details
                        </DropdownMenuItem>
                        {courierEnabled && !order.trackingNumber && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => sendToSteadfast(order)}
                              disabled={sendingOrderId === order.id}
                            >
                              {sendingOrderId === order.id ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Truck className="w-4 h-4 mr-2" />
                              )}
                              Send to Steadfast
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={!!viewOrder} onOpenChange={(open) => !open && setViewOrder(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order {viewOrder?.id}</DialogTitle>
          </DialogHeader>
          {viewOrder && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-muted-foreground">Customer:</span> {viewOrder.customerName}</div>
                <div><span className="text-muted-foreground">Phone:</span> {viewOrder.customerPhone}</div>
                {viewOrder.customerEmail && <div className="col-span-2"><span className="text-muted-foreground">Email:</span> {viewOrder.customerEmail}</div>}
                <div className="col-span-2"><span className="text-muted-foreground">Address:</span> {typeof viewOrder.address === "string" ? viewOrder.address : viewOrder.address?.address || "—"}</div>
                <div><span className="text-muted-foreground">Payment:</span> <Badge variant="outline" className="text-xs">{viewOrder.paymentMethod.toUpperCase()}</Badge></div>
                <div><span className="text-muted-foreground">Shipping:</span> {viewOrder.shippingMethod}</div>
                {viewOrder.transactionId && (
                  <div className="col-span-2"><span className="text-muted-foreground">Transaction ID:</span> <span className="font-mono font-medium">{viewOrder.transactionId}</span></div>
                )}
                {viewOrder.trackingNumber && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Tracking:</span>{" "}
                    <span className="font-mono font-medium">{viewOrder.trackingNumber}</span>
                    {viewOrder.courierName && <Badge variant="outline" className="ml-2 text-xs">{viewOrder.courierName}</Badge>}
                  </div>
                )}
              </div>

              {/* Send to courier button in detail view */}
              {courierEnabled && !viewOrder.trackingNumber && (
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => sendToSteadfast(viewOrder)}
                  disabled={sendingOrderId === viewOrder.id}
                >
                  {sendingOrderId === viewOrder.id ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Truck className="w-4 h-4 mr-2" />
                  )}
                  Steadfast এ পাঠান
                </Button>
              )}

              <div className="border-t border-border pt-3">
                <p className="font-medium mb-2">Items</p>
                {viewOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between py-1">
                    <span>{item.name} {item.variantLabel && `(${item.variantLabel})`} × {item.quantity}</span>
                    <span>৳{(item.price * item.quantity).toLocaleString("bn-BD")}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-1">
                <div className="flex justify-between"><span>Subtotal</span><span>৳{viewOrder.subtotal.toLocaleString("bn-BD")}</span></div>
                {viewOrder.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-৳{viewOrder.discount.toLocaleString("bn-BD")}</span></div>}
                <div className="flex justify-between"><span>Shipping</span><span>৳{viewOrder.shippingCost.toLocaleString("bn-BD")}</span></div>
                {viewOrder.codFee > 0 && <div className="flex justify-between"><span>COD Fee</span><span>৳{viewOrder.codFee.toLocaleString("bn-BD")}</span></div>}
                <div className="flex justify-between font-bold text-base border-t border-border pt-2"><span>Total</span><span>৳{viewOrder.total.toLocaleString("bn-BD")}</span></div>
              </div>
              <div className="border-t border-border pt-3">
                <p className="font-medium mb-2">Status History</p>
                {viewOrder.statusHistory.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 py-1 text-xs">
                    <Badge variant="secondary" className={`${statusColors[h.status]} text-xs`}>
                      {h.status.charAt(0).toUpperCase() + h.status.slice(1)}
                    </Badge>
                    <span className="text-muted-foreground">{new Date(h.date).toLocaleString()}</span>
                    {h.note && <span>— {h.note}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
