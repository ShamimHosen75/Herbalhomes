import AdminLayout from "@/components/admin/AdminLayout";
import { useOrders } from "@/contexts/OrderContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AdminCheckoutLeads() {
  const { orders } = useOrders();

  // Checkout leads = all orders (in a real app, this would track abandoned checkouts)
  const leads = orders.map((o) => ({
    id: o.id,
    name: o.customerName,
    phone: o.customerPhone,
    total: o.total,
    items: o.items.length,
    status: o.status,
    date: o.createdAt,
  }));

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-foreground mb-6">Checkout Leads</h1>
      <div className="bg-card rounded-xl border border-border">
        {leads.length === 0 ? (
          <p className="p-8 text-center text-muted-foreground">No checkout leads yet</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ORDER ID</TableHead>
                <TableHead>NAME</TableHead>
                <TableHead>PHONE</TableHead>
                <TableHead>ITEMS</TableHead>
                <TableHead>TOTAL</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>DATE</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-medium">{l.id}</TableCell>
                  <TableCell>{l.name}</TableCell>
                  <TableCell>{l.phone}</TableCell>
                  <TableCell>{l.items}</TableCell>
                  <TableCell>৳{l.total.toLocaleString("bn-BD")}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={l.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}>
                      {l.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(l.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
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
