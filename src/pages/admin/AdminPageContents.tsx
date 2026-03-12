import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, FileText, Plus, Trash2, ChevronRight } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import FAQEditor from "@/components/admin/page-editors/FAQEditor";
import TermsEditor from "@/components/admin/page-editors/TermsEditor";
import GenericEditor from "@/components/admin/page-editors/GenericEditor";

interface PageContent {
  id: string;
  page_key: string;
  title: string;
  subtitle: string;
  content: any;
}

const pageLabels: Record<string, string> = {
  about: "About Us / আমাদের সম্পর্কে",
  contact: "Contact / যোগাযোগ",
  navbar: "Navigation Menu",
  footer: "Footer / ফুটার",
  faq: "FAQ / প্রশ্নোত্তর",
  terms: "Terms & Conditions / শর্তাবলী",
  privacy: "Privacy Policy / গোপনীয়তা নীতি",
  refund: "Refund Policy / রিফান্ড নীতি",
  shipping_policy: "Shipping Policy / শিপিং নীতি",
};

export default function AdminPageContents() {
  const [pages, setPages] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [expandedPage, setExpandedPage] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newPageKey, setNewPageKey] = useState("");
  const [newPageTitle, setNewPageTitle] = useState("");
  const [addingPage, setAddingPage] = useState(false);
  const { toast } = useToast();

  const fetchPages = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("page_contents")
      .select("*")
      .order("page_key") as any;
    setPages(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchPages(); }, []);

  const updatePage = (id: string, field: string, value: any) => {
    setPages(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const updateContent = (id: string, content: any) => {
    setPages(prev => prev.map(p => p.id === id ? { ...p, content } : p));
  };

  const handleSave = async (page: PageContent) => {
    setSaving(page.id);
    await supabase
      .from("page_contents")
      .update({
        title: page.title,
        subtitle: page.subtitle,
        content: page.content,
        updated_at: new Date().toISOString(),
      } as any)
      .eq("id", page.id);
    setSaving(null);
    toast({ title: `${pageLabels[page.page_key] || page.page_key} সেভ হয়েছে` });
  };

  const handleAddPage = async () => {
    if (!newPageKey.trim()) return;
    const slug = newPageKey.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    if (pages.some(p => p.page_key === slug)) {
      toast({ title: "এই page key ইতিমধ্যে আছে", variant: "destructive" });
      return;
    }
    setAddingPage(true);
    const { error } = await supabase.from("page_contents").insert({
      page_key: slug,
      title: newPageTitle.trim() || slug,
      subtitle: "",
      content: {},
    } as any);
    setAddingPage(false);
    if (error) {
      toast({ title: "পেজ তৈরি করতে সমস্যা হয়েছে", variant: "destructive" });
      return;
    }
    setShowAddDialog(false);
    setNewPageKey("");
    setNewPageTitle("");
    toast({ title: "নতুন পেজ তৈরি হয়েছে" });
    fetchPages();
  };

  const handleDeletePage = async (page: PageContent) => {
    if (!confirm(`"${pageLabels[page.page_key] || page.page_key}" পেজটি মুছে ফেলতে চান?`)) return;
    await supabase.from("page_contents").delete().eq("id", page.id);
    toast({ title: "পেজ মুছে ফেলা হয়েছে" });
    fetchPages();
  };

  const renderAboutEditor = (page: PageContent) => {
    const c = page.content || {};
    return (
      <div className="space-y-6">
        {/* Story */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">Story Section</h4>
          <Input value={c.story_title || ""} placeholder="Story Title" className="mb-2"
            onChange={e => updateContent(page.id, { ...c, story_title: e.target.value })} />
          <div className="space-y-2">
            {(c.story_paragraphs || []).map((p: string, i: number) => (
              <div key={i} className="flex gap-2">
                <Textarea value={p} className="flex-1" onChange={e => {
                  const updated = [...(c.story_paragraphs || [])];
                  updated[i] = e.target.value;
                  updateContent(page.id, { ...c, story_paragraphs: updated });
                }} />
                <Button size="icon" variant="ghost" className="text-destructive shrink-0" onClick={() => {
                  updateContent(page.id, { ...c, story_paragraphs: (c.story_paragraphs || []).filter((_: any, idx: number) => idx !== i) });
                }}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => {
              updateContent(page.id, { ...c, story_paragraphs: [...(c.story_paragraphs || []), ""] });
            }}><Plus className="h-4 w-4 mr-1" /> Add Paragraph</Button>
          </div>
        </div>

        {/* Values */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">Values Section</h4>
          <Input value={c.values_title || ""} placeholder="Values Section Title" className="mb-2"
            onChange={e => updateContent(page.id, { ...c, values_title: e.target.value })} />
          {(c.values || []).map((v: any, i: number) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-2 p-3 border border-border rounded-lg bg-muted/30 mb-2">
              <Input value={v.title} placeholder="Title" onChange={e => {
                const updated = [...(c.values || [])];
                updated[i] = { ...updated[i], title: e.target.value };
                updateContent(page.id, { ...c, values: updated });
              }} />
              <Input value={v.desc} placeholder="Description" className="md:col-span-2" onChange={e => {
                const updated = [...(c.values || [])];
                updated[i] = { ...updated[i], desc: e.target.value };
                updateContent(page.id, { ...c, values: updated });
              }} />
              <div className="flex gap-2">
                <Select value={v.icon || "Leaf"} onValueChange={val => {
                  const updated = [...(c.values || [])];
                  updated[i] = { ...updated[i], icon: val };
                  updateContent(page.id, { ...c, values: updated });
                }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Leaf","ShieldCheck","Recycle","Heart","Users","Award","Star","Truck"].map(ic => (
                      <SelectItem key={ic} value={ic}>{ic}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="icon" variant="ghost" className="text-destructive shrink-0" onClick={() => {
                  updateContent(page.id, { ...c, values: (c.values || []).filter((_: any, idx: number) => idx !== i) });
                }}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => {
            updateContent(page.id, { ...c, values: [...(c.values || []), { title: "", desc: "", icon: "Star" }] });
          }}><Plus className="h-4 w-4 mr-1" /> Add Value</Button>
        </div>

        {/* Stats */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">Stats</h4>
          {(c.stats || []).map((s: any, i: number) => (
            <div key={i} className="grid grid-cols-3 gap-2 mb-2">
              <Input value={s.number} placeholder="Number" onChange={e => {
                const updated = [...(c.stats || [])];
                updated[i] = { ...updated[i], number: e.target.value };
                updateContent(page.id, { ...c, stats: updated });
              }} />
              <Input value={s.label} placeholder="Label" onChange={e => {
                const updated = [...(c.stats || [])];
                updated[i] = { ...updated[i], label: e.target.value };
                updateContent(page.id, { ...c, stats: updated });
              }} />
              <Button size="icon" variant="ghost" className="text-destructive" onClick={() => {
                updateContent(page.id, { ...c, stats: (c.stats || []).filter((_: any, idx: number) => idx !== i) });
              }}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => {
            updateContent(page.id, { ...c, stats: [...(c.stats || []), { number: "", label: "" }] });
          }}><Plus className="h-4 w-4 mr-1" /> Add Stat</Button>
        </div>
      </div>
    );
  };

  const renderContactEditor = (page: PageContent) => {
    const c = page.content || {};
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Phone Display</label>
          <Input value={c.phone || ""} onChange={e => updateContent(page.id, { ...c, phone: e.target.value })} />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Phone Raw (e.g. +880...)</label>
          <Input value={c.phone_raw || ""} onChange={e => updateContent(page.id, { ...c, phone_raw: e.target.value })} />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Email</label>
          <Input value={c.email || ""} onChange={e => updateContent(page.id, { ...c, email: e.target.value })} />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Address</label>
          <Input value={c.address || ""} onChange={e => updateContent(page.id, { ...c, address: e.target.value })} />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Office Hours</label>
          <Input value={c.hours || ""} onChange={e => updateContent(page.id, { ...c, hours: e.target.value })} />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">WhatsApp Number</label>
          <Input value={c.whatsapp || ""} onChange={e => updateContent(page.id, { ...c, whatsapp: e.target.value })} />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-medium text-muted-foreground">Facebook Messenger Link</label>
          <Input value={c.facebook || ""} onChange={e => updateContent(page.id, { ...c, facebook: e.target.value })} />
        </div>
      </div>
    );
  };

  const renderNavbarEditor = (page: PageContent) => {
    const c = page.content || {};
    const links = c.links || [];
    return (
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">Menu Links</h4>
          {links.map((link: any, i: number) => (
            <div key={i} className="grid grid-cols-3 gap-2 mb-2">
              <Input value={link.label} placeholder="Label" onChange={e => {
                const updated = [...links];
                updated[i] = { ...updated[i], label: e.target.value };
                updateContent(page.id, { ...c, links: updated });
              }} />
              <Input value={link.href} placeholder="Link (e.g. /about)" onChange={e => {
                const updated = [...links];
                updated[i] = { ...updated[i], href: e.target.value };
                updateContent(page.id, { ...c, links: updated });
              }} />
              <Button size="icon" variant="ghost" className="text-destructive" onClick={() => {
                updateContent(page.id, { ...c, links: links.filter((_: any, idx: number) => idx !== i) });
              }}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => {
            updateContent(page.id, { ...c, links: [...links, { label: "", href: "/" }] });
          }}><Plus className="h-4 w-4 mr-1" /> Add Link</Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground">CTA Button Text</label>
            <Input value={c.cta_text || ""} onChange={e => updateContent(page.id, { ...c, cta_text: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">CTA Button Link</label>
            <Input value={c.cta_link || ""} onChange={e => updateContent(page.id, { ...c, cta_link: e.target.value })} />
          </div>
        </div>
      </div>
    );
  };

  const renderFooterEditor = (page: PageContent) => {
    const c = page.content || {};
    const quickLinks = c.quick_links || [];
    const helpLinks = c.help_links || [];
    return (
      <div className="space-y-6">
        {/* Tagline & Copyright */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Tagline / ট্যাগলাইন</label>
            <Input value={c.tagline || ""} onChange={e => updateContent(page.id, { ...c, tagline: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Copyright Text</label>
            <Input value={c.copyright || ""} onChange={e => updateContent(page.id, { ...c, copyright: e.target.value })} />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">দ্রুত লিংক (Quick Links)</h4>
          <Input value={c.quick_links_title || ""} placeholder="Section Title" className="mb-2 max-w-xs"
            onChange={e => updateContent(page.id, { ...c, quick_links_title: e.target.value })} />
          {quickLinks.map((link: any, i: number) => (
            <div key={i} className="grid grid-cols-3 gap-2 mb-2">
              <Input value={link.label} placeholder="Label" onChange={e => {
                const updated = [...quickLinks]; updated[i] = { ...updated[i], label: e.target.value };
                updateContent(page.id, { ...c, quick_links: updated });
              }} />
              <Input value={link.href} placeholder="/shop" onChange={e => {
                const updated = [...quickLinks]; updated[i] = { ...updated[i], href: e.target.value };
                updateContent(page.id, { ...c, quick_links: updated });
              }} />
              <Button size="icon" variant="ghost" className="text-destructive" onClick={() => {
                updateContent(page.id, { ...c, quick_links: quickLinks.filter((_: any, idx: number) => idx !== i) });
              }}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => {
            updateContent(page.id, { ...c, quick_links: [...quickLinks, { label: "", href: "/" }] });
          }}><Plus className="h-4 w-4 mr-1" /> Add Link</Button>
        </div>

        {/* Help Links */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">সাহায্য (Help Links)</h4>
          <Input value={c.help_links_title || ""} placeholder="Section Title" className="mb-2 max-w-xs"
            onChange={e => updateContent(page.id, { ...c, help_links_title: e.target.value })} />
          {helpLinks.map((link: any, i: number) => (
            <div key={i} className="grid grid-cols-3 gap-2 mb-2">
              <Input value={link.label} placeholder="Label" onChange={e => {
                const updated = [...helpLinks]; updated[i] = { ...updated[i], label: e.target.value };
                updateContent(page.id, { ...c, help_links: updated });
              }} />
              <Input value={link.href} placeholder="/contact" onChange={e => {
                const updated = [...helpLinks]; updated[i] = { ...updated[i], href: e.target.value };
                updateContent(page.id, { ...c, help_links: updated });
              }} />
              <Button size="icon" variant="ghost" className="text-destructive" onClick={() => {
                updateContent(page.id, { ...c, help_links: helpLinks.filter((_: any, idx: number) => idx !== i) });
              }}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => {
            updateContent(page.id, { ...c, help_links: [...helpLinks, { label: "", href: "/" }] });
          }}><Plus className="h-4 w-4 mr-1" /> Add Link</Button>
        </div>

        {/* Contact column title */}
        <div className="max-w-xs">
          <label className="text-xs font-medium text-muted-foreground">Contact Column Title</label>
          <Input value={c.contact_title || ""} onChange={e => updateContent(page.id, { ...c, contact_title: e.target.value })} />
        </div>
      </div>
    );
  };

  const renderEditor = (page: PageContent) => {
    switch (page.page_key) {
      case "about": return renderAboutEditor(page);
      case "contact": return renderContactEditor(page);
      case "navbar": return renderNavbarEditor(page);
      case "footer": return renderFooterEditor(page);
      default: return <p className="text-sm text-muted-foreground">No editor available for this page.</p>;
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-foreground" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Page Contents</h1>
            <p className="text-sm text-muted-foreground">সকল পেজের কনটেন্ট এডিট করুন</p>
          </div>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add New Page
        </Button>
      </div>

      {loading ? (
        <p className="text-center py-8 text-muted-foreground">লোড হচ্ছে...</p>
      ) : (
        <div className="space-y-4">
          {pages.map(page => (
            <div key={page.id} className="bg-card rounded-lg border border-border">
              {/* Header */}
              <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setExpandedPage(expandedPage === page.id ? null : page.id)}>
                <div className="flex items-center gap-3">
                  <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${expandedPage === page.id ? "rotate-90" : ""}`} />
                  <div>
                    <h3 className="font-semibold text-foreground">{pageLabels[page.page_key] || page.page_key}</h3>
                    <p className="text-xs text-muted-foreground">{page.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={(e) => { e.stopPropagation(); handleDeletePage(page); }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={(e) => { e.stopPropagation(); handleSave(page); }} disabled={saving === page.id}>
                    <Save className="h-4 w-4 mr-1" />
                    {saving === page.id ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>

              {/* Expanded editor */}
              {expandedPage === page.id && (
                <div className="border-t border-border p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Page Title</label>
                      <Input value={page.title} onChange={e => updatePage(page.id, "title", e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Subtitle</label>
                      <Input value={page.subtitle} onChange={e => updatePage(page.id, "subtitle", e.target.value)} />
                    </div>
                  </div>
                  {renderEditor(page)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add New Page Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>নতুন পেজ তৈরি করুন</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-foreground">Page Key</label>
              <Input value={newPageKey} onChange={e => setNewPageKey(e.target.value)} placeholder="e.g. faq, terms, privacy" />
              <p className="text-xs text-muted-foreground mt-1">ইউনিক আইডেন্টিফায়ার (ইংরেজি, lowercase)</p>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Page Title</label>
              <Input value={newPageTitle} onChange={e => setNewPageTitle(e.target.value)} placeholder="e.g. FAQ, Terms & Conditions" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>বাতিল</Button>
            <Button onClick={handleAddPage} disabled={addingPage || !newPageKey.trim()}>
              <Plus className="h-4 w-4 mr-1" /> {addingPage ? "তৈরি হচ্ছে..." : "তৈরি করুন"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
