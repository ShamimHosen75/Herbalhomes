import AdminLayout from "@/components/admin/AdminLayout";
import { categories } from "@/data/products";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminCategories() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-foreground mb-6">Categories</h1>
      <div className="bg-card rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>IMAGE</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>SLUG</TableHead>
              <TableHead>PRODUCTS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <img src={c.image} alt={c.name} className="h-10 w-10 rounded object-cover" />
                </TableCell>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="text-muted-foreground">{c.slug}</TableCell>
                <TableCell>{c.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
