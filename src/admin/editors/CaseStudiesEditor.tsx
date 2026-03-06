import { useState, useEffect } from "react";
import { useContent } from "@/hooks/useContent";
import { SectionEditor } from "../components/SectionEditor";
import { BilingualField } from "../components/BilingualField";
import { ArrayEditor } from "../components/ArrayEditor";
import { Input } from "@/components/ui/input";
import type { CaseStudiesContent, CaseStudyItem, CaseStudyResult, Bi } from "@/types/content";

const emptyBi = (): Bi => ({ fr: "", en: "" });

export function CaseStudiesEditor() {
  const { content, updateSection } = useContent();
  const [data, setData] = useState<CaseStudiesContent>(content.caseStudies);

  useEffect(() => { setData(content.caseStudies); }, [content.caseStudies]);

  const save = async () => { await updateSection("caseStudies", data); };

  return (
    <SectionEditor title="Etudes de cas" onSave={save}>
      <BilingualField label="Badge" value={data.badge} onChange={(badge) => setData({ ...data, badge })} />
      <BilingualField label="Titre" value={data.title} onChange={(title) => setData({ ...data, title })} />
      <BilingualField label="Sous-titre" value={data.subtitle} onChange={(subtitle) => setData({ ...data, subtitle })} multiline />

      <ArrayEditor<CaseStudyItem>
        label="Etudes de cas"
        items={data.items}
        onChange={(items) => setData({ ...data, items })}
        createItem={() => ({
          client: "",
          sector: emptyBi(),
          title: emptyBi(),
          challenge: emptyBi(),
          solution: emptyBi(),
          results: [],
          service: emptyBi(),
          color: "#003533",
        })}
        renderItem={(item, _i, update) => (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Client
                </label>
                <Input
                  value={item.client}
                  onChange={(e) => update({ ...item, client: e.target.value })}
                  className="text-sm"
                />
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
                    className="text-sm flex-1"
                  />
                </div>
              </div>
            </div>
            <BilingualField label="Secteur" value={item.sector} onChange={(sector) => update({ ...item, sector })} />
            <BilingualField label="Titre" value={item.title} onChange={(title) => update({ ...item, title })} />
            <BilingualField label="Defi" value={item.challenge} onChange={(challenge) => update({ ...item, challenge })} multiline />
            <BilingualField label="Solution" value={item.solution} onChange={(solution) => update({ ...item, solution })} multiline />
            <BilingualField label="Service" value={item.service} onChange={(service) => update({ ...item, service })} />

            <ArrayEditor<CaseStudyResult>
              label="Resultats"
              items={item.results ?? []}
              onChange={(results) => update({ ...item, results })}
              createItem={() => ({ metric: emptyBi(), label: emptyBi() })}
              renderItem={(r, _j, upd) => (
                <div className="space-y-3">
                  <BilingualField label="Metrique" value={r.metric} onChange={(metric) => upd({ ...r, metric })} />
                  <BilingualField label="Label" value={r.label} onChange={(label) => upd({ ...r, label })} />
                </div>
              )}
            />
          </div>
        )}
      />
    </SectionEditor>
  );
}
