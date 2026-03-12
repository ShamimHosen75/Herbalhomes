import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface TermsEditorProps {
  content: any;
  onUpdate: (content: any) => void;
  label?: string;
}

export default function TermsEditor({ content, onUpdate, label = "Terms & Conditions" }: TermsEditorProps) {
  const c = content || {};
  const sections = c.sections || [];

  const updateSection = (index: number, field: string, value: string) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate({ ...c, sections: updated });
  };

  const addSection = () => {
    onUpdate({ ...c, sections: [...sections, { heading: "", body: "" }] });
  };

  const removeSection = (index: number) => {
    onUpdate({ ...c, sections: sections.filter((_: any, i: number) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground">কার্যকর তারিখ / Effective Date</label>
          <Input
            value={c.effective_date || ""}
            placeholder="e.g. ১ জানুয়ারি ২০২৫"
            onChange={e => onUpdate({ ...c, effective_date: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">সর্বশেষ আপডেট / Last Updated</label>
          <Input
            value={c.last_updated || ""}
            placeholder="e.g. ১০ মার্চ ২০২৫"
            onChange={e => onUpdate({ ...c, last_updated: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground">ভূমিকা / Introduction</label>
        <Textarea
          value={c.intro || ""}
          placeholder={`${label} পেজের ভূমিকা লিখুন...`}
          rows={3}
          onChange={e => onUpdate({ ...c, intro: e.target.value })}
        />
      </div>

      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3">সেকশনসমূহ (Sections)</h4>
        <div className="space-y-3">
          {sections.map((section: any, i: number) => (
            <div key={i} className="border border-border rounded-lg p-4 bg-muted/20">
              <div className="flex items-start gap-2">
                <span className="text-xs font-bold text-primary bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center mt-1 shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 space-y-2">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">শিরোনাম / Heading</label>
                    <Input
                      value={section.heading || ""}
                      placeholder="সেকশন শিরোনাম..."
                      onChange={e => updateSection(i, "heading", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">বিবরণ / Content</label>
                    <Textarea
                      value={section.body || ""}
                      placeholder="সেকশনের বিষয়বস্তু লিখুন..."
                      rows={4}
                      onChange={e => updateSection(i, "body", e.target.value)}
                    />
                  </div>
                </div>
                <Button size="icon" variant="ghost" className="text-destructive shrink-0" onClick={() => removeSection(i)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" className="mt-3" onClick={addSection}>
          <Plus className="h-4 w-4 mr-1" /> নতুন সেকশন যোগ করুন
        </Button>
      </div>
    </div>
  );
}
