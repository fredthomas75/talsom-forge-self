import { useState, useEffect } from "react";
import { useContent } from "@/hooks/useContent";
import { SectionEditor } from "../components/SectionEditor";
import { BilingualField } from "../components/BilingualField";
import { AIGenerateButton } from "../components/AIGenerateButton";
import { AISuggestPopover } from "../components/AISuggestPopover";
import { Input } from "@/components/ui/input";
import type { HeroContent } from "@/types/content";

export function HeroEditor() {
  const { content, updateSection } = useContent();
  const [data, setData] = useState<HeroContent>(content.hero);

  useEffect(() => { setData(content.hero); }, [content.hero]);

  const save = async () => { await updateSection("hero", data); };

  return (
    <SectionEditor title="Hero" onSave={save}>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Badge Text
        </label>
        <Input
          value={data.badgeText ?? ""}
          onChange={(e) => setData({ ...data, badgeText: e.target.value })}
          placeholder="Badge text"
          className="text-sm"
        />
      </div>
      <BilingualField
        label="Titre"
        value={data.title}
        onChange={(title) => setData({ ...data, title })}
      />
      <BilingualField
        label="Titre accent"
        value={data.titleAccent}
        onChange={(titleAccent) => setData({ ...data, titleAccent })}
      />
      <div className="space-y-1.5">
        <div className="flex items-center gap-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Sous-titre
          </label>
          <AIGenerateButton
            prompt={`Génère un sous-titre accrocheur pour la section Hero d'un site de consulting virtuel spécialisé en transformation digitale et IA. Le sous-titre actuel est: "${data.subtitle.fr}". Génère une alternative percutante.`}
            sectionKey="hero"
            fieldPath="subtitle.fr"
            lang="fr"
            onGenerated={(text) => setData({ ...data, subtitle: { ...data.subtitle, fr: text } })}
          />
          <AISuggestPopover
            currentContent={data.subtitle.fr}
            fieldLabel="Sous-titre"
            sectionKey="hero"
            onSelect={(text) => setData({ ...data, subtitle: { ...data.subtitle, fr: text } })}
          />
        </div>
        <BilingualField
          label=""
          value={data.subtitle}
          onChange={(subtitle) => setData({ ...data, subtitle })}
          multiline
        />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            CTA Principal
          </label>
          <AISuggestPopover
            currentContent={data.ctaPrimary.fr}
            fieldLabel="CTA Principal"
            sectionKey="hero"
            onSelect={(text) => setData({ ...data, ctaPrimary: { ...data.ctaPrimary, fr: text } })}
          />
        </div>
        <BilingualField
          label=""
          value={data.ctaPrimary}
          onChange={(ctaPrimary) => setData({ ...data, ctaPrimary })}
        />
      </div>
      <BilingualField
        label="CTA Secondaire"
        value={data.ctaSecondary}
        onChange={(ctaSecondary) => setData({ ...data, ctaSecondary })}
      />
    </SectionEditor>
  );
}
