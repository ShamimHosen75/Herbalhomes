import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, Shield, ShoppingCart, Search } from "lucide-react";

interface StaffUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  active: boolean;
  created_at: string;
}

const roles = [
  { value: "admin", label: "Admin", desc: "Full access: products, orders, settings, users" },
  { value: "order_handler", label: "Order Handler", desc: "Orders only (view + update status)" },
];

export default function AdminUsers() {
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "order_handler" });
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await supabase.from("staff_users").select("*").order("created_at");
    setUsers((data as StaffUser[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async () => {
    if (!form.email.trim() || !form.password.trim()) {
      toast({ title: "Email ও Password আবশ্যক", variant: "destructive" });
      return;
    }
    // Check duplicate email
    const exists = users.some(u => u.email === form.email.trim());
    if (exists) {
      toast({ title: "এই ইমেইল আগে থেকে আছে", variant: "destructive" });
      return;
    }
    const id = crypto.randomUUID();
    const { error } = await supabase.from("staff_users").insert({
      id,
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role,
      active: true,
    });
    if (error) {
      toast({ title: "ইউজার তৈরি ব্যর্থ হয়েছে", variant: "destructive" });
      return;
    }
    toast({ title: "স্টাফ ইউজার তৈরি হয়েছে" });
    setDialogOpen(false);
    setForm({ name: "", email: "", password: "", role: "order_handler" });
    fetchUsers();
  };

  const toggleActive = async (user: StaffUser) => {
    await supabase.from("staff_users").update({ active: !user.active }).eq("id", user.id);
    toast({ title: user.active ? "ইউজার ডিসেবল হয়েছে" : "ইউজার এনেবল হয়েছে" });
    fetchUsers();
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add User
        </Button>
      </div>

      {/* Role Permissions */}
      <div className="bg-card rounded-lg border border-border p-5 mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Role Permissions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {roles.map(role => (
            <div key={role.value} className="flex items-start gap-3">
              <div className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${role.value === "admin" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>
                {role.value === "admin" ? <Shield className="h-3 w-3" /> : <ShoppingCart className="h-3 w-3" />}
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">{role.label}</p>
                <p className="text-xs text-muted-foreground">{role.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>USER</TableHead>
              <TableHead>ROLE</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead className="text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">লোড হচ্ছে...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">কোনো ইউজার নেই</TableCell></TableRow>
            ) : filtered.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{user.name || "—"}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={user.role === "admin" ? "destructive" : "secondary"}>
                    {user.role === "admin" ? "Admin" : "Order Handler"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.active ? "default" : "outline"} className={user.active ? "bg-green-100 text-green-700 border-green-200" : ""}>
                    {user.active ? "✦ Active" : "Disabled"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant={user.active ? "outline" : "default"}
                    size="sm"
                    onClick={() => toggleActive(user)}
                  >
                    {user.active ? "Disable" : "Enable"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create User Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Staff User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input placeholder="John Doe" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <Label>Email *</Label>
              <Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <Label>Password *</Label>
              <Input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
            </div>
            <div>
              <Label>Role</Label>
              <Select value={form.role} onValueChange={v => setForm(p => ({ ...p, role: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(r => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label} — {r.desc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={handleCreate}>Create User</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
