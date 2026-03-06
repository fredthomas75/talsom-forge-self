import { useState, useEffect } from "react";
import { useContent } from "@/hooks/useContent";
import { SectionEditor } from "../components/SectionEditor";
import { BilingualField } from "../components/BilingualField";
import { ArrayEditor } from "../components/ArrayEditor";
import { Input } from "@/components/ui/input";
import type { TrustBarContent, TrustBarClient } from "@/types/content";

export function TrustBarEditor() {
  const { content, updateSection } = useContent();
  const [data, setData] = useState<TrustBarContent>(content.trustbar);

  useEffect(() => { setData(content.trustbar); }, [content.trustbar]);

  const save = async () => { await updateSection("trustbar", data); };

  return (
    <SectionEditor title="Barre de confiance" onSave={save}>
      <BilingualField
        label="Label"
        value={data.label}
        onChange={(label) => setData({ ...data, label })}
      />
      <ArrayEditor<TrustBarClient>
        label="Clients"
        items={data.clients}
        onChange={(clients) => setData({ ...data, clients })}
        createItem={() => ({ name: "", abbr: "", color: "#003533" })}
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
                  placeholder="Nom du client"
                  className="text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Abbréviation
                </label>
                <Input
                  value={item.abbr}
                  onChange={(e) => update({ ...item, abbr: e.target.value })}
                  placeholder="ABC"
                  className="text-sm"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Couleur
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={item.color}
                  onChange={(e) => update({ ...item, color: e.target.value })}
                  className="w-8 h-8 rounded border cursor-pointer"
                />
                <Input
                  value={item.color}
                  onChange={(e) => update({ ...item, color: e.target.value })}
                  placeholder="#003533"
                  className="text-sm flex-1"
                />
              </div>
            </div>
          </div>
        )}
      />
    </SectionEditor>
  );
}
