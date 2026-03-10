import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Eye, Filter } from "lucide-react";

type LeadStatus = "new" | "contacted" | "converted" | "invalid";

type CheckoutLead = {
  id: string;
  customer_name: string;
  customer_phone: string;
  items: any[];
  items_count: number;
  total: number;
  status: LeadStatus;
  address: string;
  created_at: string;
};

const statusColors: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  converted: "bg-green-100 text-green-800",
  invalid: "bg-red-100 text-red-800",
};

const statusLabels: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  converted: "Converted",
  invalid: "Invalid",
};

const allStatuses: LeadStatus[] = ["new", "contacted", "converted", "invalid"];

export default function AdminCheckoutLeads() {
  const [leads, setLeads] = useState<CheckoutLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewLead, setViewLead] = useState<CheckoutLead | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("checkout_leads")
      .select("*")
      .order("created_at", { ascending: false }) as any;
    if (!error && data) setLeads(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const updateLeadStatus = async (id: string, status: LeadStatus) => {
    await supabase.from("checkout_leads").update({ status } as any).eq("id", id);
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const filtered = leads.filter((l) => {
    const matchesSearch =
      !search ||
      l.id.toLowerCase().includes(search.toLowerCase()) ||
      l.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      l.customer_phone.includes(search);
    const matchesStatus = statusFilter === "all" || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const counts = {
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    converted: leads.filter((l) => l.status === "converted").length,
    invalid: leads.filter((l) => l.status === "invalid").length,
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Checkout Leads</h1>
        <p className="text-muted-foreground text-sm">Users who started checkout but didn't complete their order</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by phone, name, or lead #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <SelectValue placeholder="All Status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {allStatuses.map((s) => (
              <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {allStatuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
              statusFilter === s ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-muted/50"
            }`}
          >
            <span className="text-sm font-medium text-foreground">{statusLabels[s]}</span>
            <Badge variant="secondary" className={`${statusColors[s]} text-xs min-w-[28px] justify-center`}>
              {counts[s]}
            </Badge>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border">
        {loading ? (
          <p className="p-8 text-center text-muted-foreground">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="p-8 text-center text-muted-foreground">No checkout leads found</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>LEAD #</TableHead>
                <TableHead>CUSTOMER</TableHead>
                <TableHead>PHONE</TableHead>
                <TableHead>ITEMS</TableHead>
                <TableHead>TOTAL</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>CREATED</TableHead>
                <TableHead className="text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.id}</TableCell>
                  <TableCell>{lead.customer_name}</TableCell>
                  <TableCell>{lead.customer_phone}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{lead.items_count} items</Badge>
                  </TableCell>
                  <TableCell>৳{Number(lead.total).toLocaleString("bn-BD")}</TableCell>
                  <TableCell>
                    <Select
                      value={lead.status}
                      onValueChange={(val) => updateLeadStatus(lead.id, val as LeadStatus)}
                    >
                      <SelectTrigger className="w-28 h-7 text-xs border-0 p-0">
                        <Badge variant="secondary" className={`${statusColors[lead.status]} text-xs cursor-pointer`}>
                          {statusLabels[lead.status]}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {allStatuses.map((s) => (
                          <SelectItem key={s} value={s}>
                            <Badge variant="secondary" className={`${statusColors[s]} text-xs`}>
                              {statusLabels[s]}
                            </Badge>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(lead.created_at).toLocaleDateString("en-US", {
                      month: "short", day: "numeric",
                    })}, {new Date(lead.created_at).toLocaleTimeString("en-US", {
                      hour: "numeric", minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewLead(lead)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* View Detail Dialog */}
      <Dialog open={!!viewLead} onOpenChange={(open) => !open && setViewLead(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Lead {viewLead?.id}</DialogTitle>
          </DialogHeader>
          {viewLead && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-muted-foreground">Customer:</span> {viewLead.customer_name}</div>
                <div><span className="text-muted-foreground">Phone:</span> {viewLead.customer_phone}</div>
                <div className="col-span-2"><span className="text-muted-foreground">Address:</span> {viewLead.address || "—"}</div>
                <div><span className="text-muted-foreground">Total:</span> ৳{Number(viewLead.total).toLocaleString("bn-BD")}</div>
                <div><span className="text-muted-foreground">Status:</span>{" "}
                  <Badge variant="secondary" className={`${statusColors[viewLead.status]} text-xs`}>
                    {statusLabels[viewLead.status]}
                  </Badge>
                </div>
              </div>
              {Array.isArray(viewLead.items) && viewLead.items.length > 0 && (
                <div className="border-t border-border pt-3">
                  <p className="font-medium mb-2">Cart Items</p>
                  {viewLead.items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between py-1">
                      <span>{item.name} {item.variantLabel && `(${item.variantLabel})`} × {item.quantity}</span>
                      <span>৳{(item.price * item.quantity).toLocaleString("bn-BD")}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="text-xs text-muted-foreground border-t border-border pt-2">
                Created: {new Date(viewLead.created_at).toLocaleString()}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
