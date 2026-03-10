import AdminLayout from "@/components/admin/AdminLayout";
import { Construction } from "lucide-react";

export default function AdminPlaceholder({ title }: { title: string }) {
  return (
    <AdminLayout>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Construction className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
        <p className="text-muted-foreground">This section is coming soon.</p>
      </div>
    </AdminLayout>
  );
}
