import AdminLayout from "@/components/admin/AdminLayout";
import { products } from "@/data/products";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AdminProducts() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-foreground mb-6">Products</h1>

      <div className="bg-card rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>IMAGE</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>CATEGORY</TableHead>
              <TableHead>PRICE</TableHead>
              <TableHead>STOCK</TableHead>
              <TableHead>BADGE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <img src={p.images[0]} alt={p.name} className="h-10 w-10 rounded object-cover" />
                </TableCell>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell className="text-muted-foreground">{p.category}</TableCell>
                <TableCell>৳{p.variants[0]?.price}</TableCell>
                <TableCell>{p.variants.reduce((s, v) => s + v.stock, 0)}</TableCell>
                <TableCell>
                  {p.badge && <Badge variant="secondary">{p.badge}</Badge>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
