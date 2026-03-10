import AdminLayout from "@/components/admin/AdminLayout";
import { products } from "@/data/products";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Star } from "lucide-react";

export default function AdminReviews() {
  const allReviews = products.flatMap((p) =>
    p.reviews.map((r) => ({ ...r, productName: p.name, productId: p.id }))
  );

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-foreground mb-6">Reviews</h1>
      <div className="bg-card rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PRODUCT</TableHead>
              <TableHead>AUTHOR</TableHead>
              <TableHead>RATING</TableHead>
              <TableHead>COMMENT</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>VERIFIED</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allReviews.slice(0, 50).map((r, i) => (
              <TableRow key={`${r.productId}-${r.id}-${i}`}>
                <TableCell className="font-medium max-w-[150px] truncate">{r.productName}</TableCell>
                <TableCell>{r.author}</TableCell>
                <TableCell>
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    {r.rating}
                  </span>
                </TableCell>
                <TableCell className="max-w-[250px] truncate text-muted-foreground">{r.comment}</TableCell>
                <TableCell className="text-muted-foreground">{r.date}</TableCell>
                <TableCell>{r.verified ? "✅" : "❌"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
