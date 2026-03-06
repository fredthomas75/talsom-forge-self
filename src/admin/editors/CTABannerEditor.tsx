import { useState, useEffect } from "react";
import { useContent } from "@/hooks/useContent";
import { SectionEditor } from "../components/SectionEditor";
import { BilingualField } from "../components/BilingualField";
import type { CTABannerContent } from "@/types/content";

export function CTABannerEditor() {
  const { content, updateSection } = useContent();
  const [data, setData] = useState<CTABannerContent>(content.ctaBanner);

  useEffect(() => { setData(content.ctaBanner); }, [content.ctaBanner]);

  const save = async () => { await updateSection("ctaBanner", data); };

  return (
    <SectionEditor title="Banniere CTA" onSave={save}>
      <BilingualField label="Titre" value={data.title} onChange={(title) => setData({ ...data, title })} />
      <BilingualField label="Sous-titre" value={data.subtitle} onChange={(subtitle) => setData({ ...data, subtitle })} multiline />
      <BilingualField label="CTA Principal" value={data.ctaPrimary} onChange={(ctaPrimary) => setData({ ...data, ctaPrimary })} />
      <BilingualField label="CTA Secondaire" value={data.ctaSecondary} onChange={(ctaSecondary) => setData({ ...data, ctaSecondary })} />
    </SectionEditor>
  );
}
