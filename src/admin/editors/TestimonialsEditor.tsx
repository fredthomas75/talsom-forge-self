import { useState, useEffect } from "react";
import { useContent } from "@/hooks/useContent";
import { SectionEditor } from "../components/SectionEditor";
import { BilingualField } from "../components/BilingualField";
import { ArrayEditor } from "../components/ArrayEditor";
import { Input } from "@/components/ui/input";
import type { TestimonialsContent, TestimonialItem } from "@/types/content";

export function TestimonialsEditor() {
  const { content, updateSection } = useContent();
  const [data, setData] = useState<TestimonialsContent>(content.testimonials);

  useEffect(() => { setData(content.testimonials); }, [content.testimonials]);

  const save = async () => { await updateSection("testimonials", data); };

  return (
    <SectionEditor title="Temoignages" onSave={save}>
      <BilingualField label="Badge" value={data.badge} onChange={(badge) => setData({ ...data, badge })} />
      <BilingualField label="Titre" value={data.title} onChange={(title) => setData({ ...data, title })} />
      <BilingualField label="Sous-titre" value={data.subtitle} onChange={(subtitle) => setData({ ...data, subtitle })} multiline />

      <ArrayEditor<TestimonialItem>
        label="Temoignages"
        items={data.items}
        onChange={(items) => setData({ ...data, items })}
        createItem={() => ({
          name: "",
          role: { fr: "", en: "" },
          company: "",
          quote: { fr: "", en: "" },
        })}
        renderItem={(item, _i, update) => (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Nom
                </label>
                <Input
                  value={item.name}
                  onChange={(e) => update({ ...item, name: e.target.value })}
                  className="text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Entreprise
                </label>
                <Input
                  value={item.company}
                  onChange={(e) => update({ ...item, company: e.target.value })}
                  className="text-sm"
                />
              </div>
            </div>
            <BilingualField label="Role" value={item.role} onChange={(role) => update({ ...item, role })} />
            <BilingualField label="Citation" value={item.quote} onChange={(quote) => update({ ...item, quote })} multiline />
          </div>
        )}
      />
    </SectionEditor>
  );
}
