import AdminLayout from "@/components/admin/AdminLayout";
import { useOrders } from "@/contexts/OrderContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { OrderStatus } from "@/data/products";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  packed: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
};

const allStatuses: OrderStatus[] = ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled", "refunded"];

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useOrders();

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-foreground mb-6">Orders</h1>

      <div className="bg-card rounded-xl border border-border">
        {orders.length === 0 ? (
          <p className="p-8 text-center text-muted-foreground">No orders yet</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ORDER ID</TableHead>
                <TableHead>CUSTOMER</TableHead>
                <TableHead>PHONE</TableHead>
                <TableHead>ADDRESS</TableHead>
                <TableHead>AMOUNT</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>DATE</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.customerPhone}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {typeof order.address === "string" ? order.address : order.address?.address || "—"}
                  </TableCell>
                  <TableCell>৳{order.total.toLocaleString("bn-BD")}</TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(val) => updateOrderStatus(order.id, val as OrderStatus)}
                    >
                      <SelectTrigger className="w-32 h-8 text-xs">
                        <SelectValue />
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
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric", month: "short", day: "numeric",
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </AdminLayout>
  );
}
