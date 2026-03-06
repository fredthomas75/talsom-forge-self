import { useState, useEffect } from "react";
import { useContent } from "@/hooks/useContent";
import { SectionEditor } from "../components/SectionEditor";
import { BilingualField } from "../components/BilingualField";
import { ArrayEditor } from "../components/ArrayEditor";
import { Input } from "@/components/ui/input";
import type { HowItWorksContent, HowItWorksStep } from "@/types/content";

export function HowItWorksEditor() {
  const { content, updateSection } = useContent();
  const [data, setData] = useState<HowItWorksContent>(content.howItWorks);

  useEffect(() => { setData(content.howItWorks); }, [content.howItWorks]);

  const save = async () => { await updateSection("howItWorks", data); };

  return (
    <SectionEditor title="Comment ca marche" onSave={save}>
      <BilingualField
        label="Badge"
        value={data.badge}
        onChange={(badge) => setData({ ...data, badge })}
      />
      <BilingualField
        label="Titre"
        value={data.title}
        onChange={(title) => setData({ ...data, title })}
      />
      <BilingualField
        label="Sous-titre"
        value={data.subtitle}
        onChange={(subtitle) => setData({ ...data, subtitle })}
        multiline
      />
      <ArrayEditor<HowItWorksStep>
        label="Etapes"
        items={data.steps}
        onChange={(steps) => setData({ ...data, steps })}
        createItem={() => ({
          iconName: "Zap",
          title: { fr: "", en: "" },
          desc: { fr: "", en: "" },
        })}
        renderItem={(item, _i, update) => (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Icone (Lucide)
              </label>
              <Input
                value={item.iconName}
                onChange={(e) => update({ ...item, iconName: e.target.value })}
                placeholder="Zap, Brain, etc."
                className="text-sm"
              />
            </div>
            <BilingualField
              label="Titre"
              value={item.title}
              onChange={(title) => update({ ...item, title })}
            />
            <BilingualField
              label="Description"
              value={item.desc}
              onChange={(desc) => update({ ...item, desc })}
              multiline
            />
          </div>
        )}
      />
    </SectionEditor>
  );
}
