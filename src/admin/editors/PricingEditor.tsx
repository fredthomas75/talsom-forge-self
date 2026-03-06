import { useState, useEffect } from "react";
import { useContent } from "@/hooks/useContent";
import { SectionEditor } from "../components/SectionEditor";
import { BilingualField } from "../components/BilingualField";
import { ArrayEditor } from "../components/ArrayEditor";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { PricingContent, PlanItem, Bi } from "@/types/content";

const emptyBi = (): Bi => ({ fr: "", en: "" });

export function PricingEditor() {
  const { content, updateSection } = useContent();
  const [data, setData] = useState<PricingContent>(content.pricing);

  useEffect(() => { setData(content.pricing); }, [content.pricing]);

  const save = async () => { await updateSection("pricing", data); };

  return (
    <SectionEditor title="Tarification" onSave={save}>
      <BilingualField label="Badge" value={data.badge} onChange={(badge) => setData({ ...data, badge })} />
      <BilingualField label="Titre" value={data.title} onChange={(title) => setData({ ...data, title })} />
      <BilingualField label="Sous-titre" value={data.subtitle} onChange={(subtitle) => setData({ ...data, subtitle })} multiline />

      <ArrayEditor<PlanItem>
        label="Plans"
        items={data.plans}
        onChange={(plans) => setData({ ...data, plans })}
        createItem={() => ({
          name: "",
          price: emptyBi(),
          sub: emptyBi(),
          features: [],
          cta: emptyBi(),
          highlight: false,
        })}
        renderItem={(plan, _i, update) => (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Nom
              </label>
              <Input
                value={plan.name}
                onChange={(e) => update({ ...plan, name: e.target.value })}
                className="text-sm"
              />
            </div>
            <BilingualField label="Prix" value={plan.price} onChange={(price) => update({ ...plan, price })} />
            <BilingualField label="Sous-texte" value={plan.sub} onChange={(sub) => update({ ...plan, sub })} />
            <BilingualField label="CTA" value={plan.cta} onChange={(cta) => update({ ...plan, cta })} />
            <div className="flex items-center gap-2 pt-1">
              <Checkbox
                checked={plan.highlight}
                onCheckedChange={(checked) => update({ ...plan, highlight: !!checked })}
              />
              <label className="text-xs font-medium text-gray-600">Mis en avant</label>
            </div>
            <ArrayEditor<Bi>
              label="Fonctionnalites"
              items={plan.features ?? []}
              onChange={(features) => update({ ...plan, features })}
              createItem={emptyBi}
              renderItem={(feat, _j, upd) => (
                <BilingualField label="Feature" value={feat} onChange={upd} />
              )}
            />
          </div>
        )}
      />
    </SectionEditor>
  );
}
