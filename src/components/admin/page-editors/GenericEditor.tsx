import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface GenericEditorProps {
  content: any;
  onUpdate: (content: any) => void;
}

export default function GenericEditor({ content, onUpdate }: GenericEditorProps) {
  const c = content || {};
  const fields = c.fields || [];

  const updateField = (index: number, key: string, value: string) => {
    const updated = [...fields];
    updated[index] = { ...updated[index], [key]: value };
    onUpdate({ ...c, fields: updated });
  };

  const addField = () => {
    onUpdate({ ...c, fields: [...fields, { label: "", value: "" }] });
  };

  const removeField = (index: number) => {
    onUpdate({ ...c, fields: fields.filter((_: any, i: number) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-muted-foreground">মূল বিষয়বস্তু / Main Content</label>
        <Textarea
          value={c.body || ""}
          placeholder="পেজের মূল কনটেন্ট এখানে লিখুন..."
          rows={5}
          onChange={e => onUpdate({ ...c, body: e.target.value })}
        />
      </div>

      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3">অতিরিক্ত ফিল্ড (Custom Fields)</h4>
        <div className="space-y-2">
          {fields.map((field: any, i: number) => (
            <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-start">
              <Input
                value={field.label || ""}
                placeholder="ফিল্ড নাম"
                onChange={e => updateField(i, "label", e.target.value)}
              />
              <Textarea
                value={field.value || ""}
                placeholder="মান / Value"
                rows={2}
                onChange={e => updateField(i, "value", e.target.value)}
              />
              <Button size="icon" variant="ghost" className="text-destructive" onClick={() => removeField(i)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" className="mt-3" onClick={addField}>
          <Plus className="h-4 w-4 mr-1" /> নতুন ফিল্ড যোগ করুন
        </Button>
      </div>
    </div>
  );
}
