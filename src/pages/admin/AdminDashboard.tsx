import { Package, FolderOpen, ShoppingCart, TrendingUp, DollarSign, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useOrders } from "@/contexts/OrderContext";
import { useProducts } from "@/contexts/ProductsContext";
import { useCategories } from "@/contexts/CategoriesContext";
import AdminLayout from "@/components/admin/AdminLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-blue-100 text-blue-800",
  packed: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminDashboard() {
  const { orders } = useOrders();
  const { products } = useProducts();
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const uniqueCustomers = new Set(orders.map((o) => o.customerPhone)).size;

  const stats = [
    { label: "Products", value: products.length, icon: Package, color: "bg-blue-50 text-blue-600" },
    { label: "Categories", value: categories.length, icon: FolderOpen, color: "bg-green-50 text-green-600" },
    { label: "Orders", value: orders.length, icon: ShoppingCart, color: "bg-purple-50 text-purple-600" },
    { label: "Pending", value: pendingOrders.length, icon: TrendingUp, color: "bg-red-50 text-red-600" },
    { label: "Revenue", value: `৳${totalRevenue.toLocaleString("bn-BD")}`, icon: DollarSign, color: "bg-yellow-50 text-yellow-600" },
    { label: "Customers", value: uniqueCustomers, icon: Users, color: "bg-pink-50 text-pink-600" },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-card rounded-xl border border-border">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-primary hover:underline flex items-center gap-1">
            View all →
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="p-8 text-center text-muted-foreground">No orders yet</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ORDER ID</TableHead>
                <TableHead>CUSTOMER</TableHead>
                <TableHead>AMOUNT</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>DATE</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>৳{order.total.toLocaleString("bn-BD")}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={statusColors[order.status] || ""}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
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
