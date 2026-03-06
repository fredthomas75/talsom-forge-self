import { useState, useEffect } from "react";
import { useContent } from "@/hooks/useContent";
import { SectionEditor } from "../components/SectionEditor";
import { BilingualField } from "../components/BilingualField";
import { ArrayEditor } from "../components/ArrayEditor";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import type {
  AIChatContent,
  AIChatFeature,
  ChatScenario,
  ChatExchange,
  Bi,
} from "@/types/content";

const emptyBi = (): Bi => ({ fr: "", en: "" });

function ExchangeEditor({
  lang,
  exchanges,
  onChange,
}: {
  lang: "fr" | "en";
  exchanges: ChatExchange[];
  onChange: (exs: ChatExchange[]) => void;
}) {
  const list = exchanges ?? [];

  return (
    <ArrayEditor<ChatExchange>
      label={`Echanges (${lang.toUpperCase()})`}
      items={list}
      onChange={onChange}
      createItem={() => ({ user: "", assistant: "" })}
      renderItem={(ex, _i, update) => (
        <div className="space-y-2">
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-blue-500 uppercase">
              Utilisateur
            </label>
            <Textarea
              value={ex.user}
              onChange={(e) => update({ ...ex, user: e.target.value })}
              className="text-sm min-h-[50px]"
              placeholder="Message utilisateur..."
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-green-600 uppercase">
              Assistant
            </label>
            <Textarea
              value={ex.assistant}
              onChange={(e) => update({ ...ex, assistant: e.target.value })}
              className="text-sm min-h-[50px]"
              placeholder="Reponse assistant..."
            />
          </div>
        </div>
      )}
    />
  );
}

function ScenarioEditor({
  scenario,
  onChange,
}: {
  scenario: ChatScenario;
  onChange: (s: ChatScenario) => void;
}) {
  return (
    <AccordionItem value={scenario.key}>
      <AccordionTrigger className="text-sm font-medium">
        {scenario.label?.fr || scenario.key}
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Cle
              </label>
              <Input
                value={scenario.key}
                onChange={(e) => onChange({ ...scenario, key: e.target.value })}
                className="text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Icone (Lucide)
              </label>
              <Input
                value={scenario.iconName}
                onChange={(e) => onChange({ ...scenario, iconName: e.target.value })}
                className="text-sm"
              />
            </div>
          </div>
          <BilingualField
            label="Label"
            value={scenario.label}
            onChange={(label) => onChange({ ...scenario, label })}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ExchangeEditor
              lang="fr"
              exchanges={scenario.exchanges?.fr ?? []}
              onChange={(fr) =>
                onChange({
                  ...scenario,
                  exchanges: { ...scenario.exchanges, fr },
                })
              }
            />
            <ExchangeEditor
              lang="en"
              exchanges={scenario.exchanges?.en ?? []}
              onChange={(en) =>
                onChange({
                  ...scenario,
                  exchanges: { ...scenario.exchanges, en },
                })
              }
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export function AIChatEditor() {
  const { content, updateSection } = useContent();
  const [data, setData] = useState<AIChatContent>(content.aiChat);

  useEffect(() => { setData(content.aiChat); }, [content.aiChat]);

  const save = async () => { await updateSection("aiChat", data); };

  return (
    <SectionEditor title="Chat AI" onSave={save}>
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

      <ArrayEditor<AIChatFeature>
        label="Fonctionnalites"
        items={data.features ?? []}
        onChange={(features) => setData({ ...data, features })}
        createItem={() => ({ iconName: "Zap", text: emptyBi() })}
        renderItem={(feat, _i, update) => (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Icone (Lucide)
              </label>
              <Input
                value={feat.iconName}
                onChange={(e) => update({ ...feat, iconName: e.target.value })}
                className="text-sm"
              />
            </div>
            <BilingualField label="Texte" value={feat.text} onChange={(text) => update({ ...feat, text })} />
          </div>
        )}
      />

      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Scenarios ({data.scenarios?.length ?? 0})
        </label>
        <Accordion type="single" collapsible className="w-full">
          {(data.scenarios ?? []).map((scenario, i) => (
            <ScenarioEditor
              key={scenario.key || i}
              scenario={scenario}
              onChange={(updated) => {
                const next = [...data.scenarios];
                next[i] = updated;
                setData({ ...data, scenarios: next });
              }}
            />
          ))}
        </Accordion>
        <button
          type="button"
          className="text-sm text-blue-600 hover:text-blue-800 mt-2"
          onClick={() =>
            setData({
              ...data,
              scenarios: [
                ...data.scenarios,
                {
                  key: `scenario-${Date.now()}`,
                  iconName: "MessageSquare",
                  label: emptyBi(),
                  exchanges: { fr: [], en: [] },
                },
              ],
            })
          }
        >
          + Ajouter un scenario
        </button>
      </div>
    </SectionEditor>
  );
}
