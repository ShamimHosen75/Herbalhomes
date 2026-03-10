import AdminLayout from "@/components/admin/AdminLayout";
import { useOrders } from "@/contexts/OrderContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AdminCustomers() {
  const { orders } = useOrders();

  const customersMap = new Map<string, { name: string; phone: string; email?: string; orderCount: number; totalSpent: number; lastOrder: string }>();
  orders.forEach((o) => {
    const existing = customersMap.get(o.customerPhone);
    if (existing) {
      existing.orderCount++;
      existing.totalSpent += o.total;
      if (o.createdAt > existing.lastOrder) existing.lastOrder = o.createdAt;
    } else {
      customersMap.set(o.customerPhone, {
        name: o.customerName, phone: o.customerPhone, email: o.customerEmail,
        orderCount: 1, totalSpent: o.total, lastOrder: o.createdAt,
      });
    }
  });

  const customers = Array.from(customersMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-foreground mb-6">Customers</h1>
      <div className="bg-card rounded-xl border border-border">
        {customers.length === 0 ? (
          <p className="p-8 text-center text-muted-foreground">No customers yet</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NAME</TableHead>
                <TableHead>PHONE</TableHead>
                <TableHead>EMAIL</TableHead>
                <TableHead>ORDERS</TableHead>
                <TableHead>TOTAL SPENT</TableHead>
                <TableHead>LAST ORDER</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((c) => (
                <TableRow key={c.phone}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.phone}</TableCell>
                  <TableCell className="text-muted-foreground">{c.email || "—"}</TableCell>
                  <TableCell><Badge variant="secondary">{c.orderCount}</Badge></TableCell>
                  <TableCell>৳{c.totalSpent.toLocaleString("bn-BD")}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(c.lastOrder).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
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
