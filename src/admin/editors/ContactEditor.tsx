import { useState, useEffect } from "react";
import { useContent } from "@/hooks/useContent";
import { SectionEditor } from "../components/SectionEditor";
import { BilingualField } from "../components/BilingualField";
import { ArrayEditor } from "../components/ArrayEditor";
import { Input } from "@/components/ui/input";
import type { ContactContent, ContactInfoItem, Bi } from "@/types/content";

const emptyBi = (): Bi => ({ fr: "", en: "" });

const FORM_LABEL_KEYS = [
  "name",
  "email",
  "company",
  "companyPlaceholder",
  "message",
  "messagePlaceholder",
  "submit",
  "sending",
  "success",
  "successSub",
  "note",
] as const;

const FORM_LABEL_NAMES: Record<string, string> = {
  name: "Nom",
  email: "Email",
  company: "Entreprise",
  companyPlaceholder: "Placeholder entreprise",
  message: "Message",
  messagePlaceholder: "Placeholder message",
  submit: "Soumettre",
  sending: "Envoi en cours",
  success: "Succes",
  successSub: "Sous-texte succes",
  note: "Note",
};

export function ContactEditor() {
  const { content, updateSection } = useContent();
  const [data, setData] = useState<ContactContent>(content.contact);

  useEffect(() => { setData(content.contact); }, [content.contact]);

  const save = async () => { await updateSection("contact", data); };

  const updateFormLabel = (key: string, value: Bi) => {
    setData({
      ...data,
      formLabels: { ...data.formLabels, [key]: value },
    });
  };

  return (
    <SectionEditor title="Contact" onSave={save}>
      <BilingualField label="Badge" value={data.badge} onChange={(badge) => setData({ ...data, badge })} />
      <BilingualField label="Titre" value={data.title} onChange={(title) => setData({ ...data, title })} />
      <BilingualField label="Sous-titre" value={data.subtitle} onChange={(subtitle) => setData({ ...data, subtitle })} multiline />

      <ArrayEditor<ContactInfoItem>
        label="Informations de contact"
        items={data.contactInfo ?? []}
        onChange={(contactInfo) => setData({ ...data, contactInfo })}
        createItem={() => ({ iconName: "Mail", text: emptyBi() })}
        renderItem={(item, _i, update) => (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Icone (Lucide)
              </label>
              <Input
                value={item.iconName}
                onChange={(e) => update({ ...item, iconName: e.target.value })}
                className="text-sm"
              />
            </div>
            <BilingualField label="Texte" value={item.text} onChange={(text) => update({ ...item, text })} />
          </div>
        )}
      />

      <div className="space-y-4 mt-4">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Labels du formulaire
        </label>
        <div className="border rounded-lg p-4 bg-white space-y-4">
          {FORM_LABEL_KEYS.map((key) => (
            <BilingualField
              key={key}
              label={FORM_LABEL_NAMES[key] || key}
              value={(data.formLabels as Record<string, Bi>)?.[key] ?? emptyBi()}
              onChange={(v) => updateFormLabel(key, v)}
            />
          ))}
        </div>
      </div>
    </SectionEditor>
  );
}
