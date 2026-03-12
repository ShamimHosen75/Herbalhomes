import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface FAQEditorProps {
  content: any;
  onUpdate: (content: any) => void;
}

export default function FAQEditor({ content, onUpdate }: FAQEditorProps) {
  const c = content || {};
  const items = c.items || [];

  const updateItem = (index: number, field: string, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate({ ...c, items: updated });
  };

  const addItem = () => {
    onUpdate({ ...c, items: [...items, { question: "", answer: "" }] });
  };

  const removeItem = (index: number) => {
    onUpdate({ ...c, items: items.filter((_: any, i: number) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-muted-foreground">পেজ পরিচিতি / Intro Text</label>
        <Textarea
          value={c.intro || ""}
          placeholder="FAQ পেজের উপরে একটি ছোট পরিচিতি লিখুন..."
          rows={2}
          onChange={e => onUpdate({ ...c, intro: e.target.value })}
        />
      </div>

      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3">প্রশ্ন ও উত্তর (FAQ Items)</h4>
        <div className="space-y-3">
          {items.map((item: any, i: number) => (
            <div key={i} className="relative border border-border rounded-lg p-4 bg-muted/20">
              <div className="flex items-start gap-2">
                <GripVertical className="h-5 w-5 text-muted-foreground mt-2 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">প্রশ্ন #{i + 1}</label>
                    <Input
                      value={item.question || ""}
                      placeholder="প্রশ্ন লিখুন..."
                      onChange={e => updateItem(i, "question", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">উত্তর</label>
                    <Textarea
                      value={item.answer || ""}
                      placeholder="উত্তর লিখুন..."
                      rows={3}
                      onChange={e => updateItem(i, "answer", e.target.value)}
                    />
                  </div>
                </div>
                <Button size="icon" variant="ghost" className="text-destructive shrink-0" onClick={() => removeItem(i)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" className="mt-3" onClick={addItem}>
          <Plus className="h-4 w-4 mr-1" /> নতুন প্রশ্ন যোগ করুন
        </Button>
      </div>
    </div>
  );
}
