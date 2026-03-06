import { useState, useEffect } from "react";
import { useContent } from "@/hooks/useContent";
import { SectionEditor } from "../components/SectionEditor";
import { BilingualField } from "../components/BilingualField";
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
      <BilingualField
        label="Sous-titre"
        value={data.subtitle}
        onChange={(subtitle) => setData({ ...data, subtitle })}
        multiline
      />
      <BilingualField
        label="CTA Principal"
        value={data.ctaPrimary}
        onChange={(ctaPrimary) => setData({ ...data, ctaPrimary })}
      />
      <BilingualField
        label="CTA Secondaire"
        value={data.ctaSecondary}
        onChange={(ctaSecondary) => setData({ ...data, ctaSecondary })}
      />
    </SectionEditor>
  );
}
