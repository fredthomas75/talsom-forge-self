import { useState, useEffect } from "react";
import { useContent } from "@/hooks/useContent";
import { SectionEditor } from "../components/SectionEditor";
import { BilingualField } from "../components/BilingualField";
import { ArrayEditor } from "../components/ArrayEditor";
import { Input } from "@/components/ui/input";
import type { StatItem } from "@/types/content";

export function StatsEditor() {
  const { content, updateSection } = useContent();
  const [data, setData] = useState<StatItem[]>(content.stats);

  useEffect(() => { setData(content.stats); }, [content.stats]);

  const save = async () => { await updateSection("stats", data); };

  return (
    <SectionEditor title="Statistiques" onSave={save}>
      <ArrayEditor<StatItem>
        label="Statistiques"
        items={data}
        onChange={setData}
        createItem={() => ({ value: "", label: { fr: "", en: "" } })}
        renderItem={(item, _i, update) => (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Valeur
              </label>
              <Input
                value={item.value}
                onChange={(e) => update({ ...item, value: e.target.value })}
                placeholder="ex: 98%"
                className="text-sm"
              />
            </div>
            <BilingualField
              label="Label"
              value={item.label}
              onChange={(label) => update({ ...item, label })}
            />
          </div>
        )}
      />
    </SectionEditor>
  );
}
