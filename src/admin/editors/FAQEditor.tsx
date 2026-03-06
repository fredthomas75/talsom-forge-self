import { useState, useEffect } from "react";
import { useContent } from "@/hooks/useContent";
import { SectionEditor } from "../components/SectionEditor";
import { BilingualField } from "../components/BilingualField";
import { ArrayEditor } from "../components/ArrayEditor";
import { Input } from "@/components/ui/input";
import type { FAQContent, FAQItem } from "@/types/content";

export function FAQEditor() {
  const { content, updateSection } = useContent();
  const [data, setData] = useState<FAQContent>(content.faq);

  useEffect(() => { setData(content.faq); }, [content.faq]);

  const save = async () => { await updateSection("faq", data); };

  return (
    <SectionEditor title="FAQ" onSave={save}>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Badge
        </label>
        <Input
          value={data.badge ?? ""}
          onChange={(e) => setData({ ...data, badge: e.target.value })}
          className="text-sm"
        />
      </div>
      <BilingualField label="Titre" value={data.title} onChange={(title) => setData({ ...data, title })} />
      <BilingualField label="Sous-titre" value={data.subtitle} onChange={(subtitle) => setData({ ...data, subtitle })} multiline />

      <ArrayEditor<FAQItem>
        label="Questions"
        items={data.items}
        onChange={(items) => setData({ ...data, items })}
        createItem={() => ({
          q: { fr: "", en: "" },
          a: { fr: "", en: "" },
        })}
        renderItem={(item, _i, update) => (
          <div className="space-y-3">
            <BilingualField label="Question" value={item.q} onChange={(q) => update({ ...item, q })} multiline />
            <BilingualField label="Reponse" value={item.a} onChange={(a) => update({ ...item, a })} multiline />
          </div>
        )}
      />
    </SectionEditor>
  );
}
