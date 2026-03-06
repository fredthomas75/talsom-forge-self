import { useState, useEffect } from "react";
import { useContent } from "@/hooks/useContent";
import { SectionEditor } from "../components/SectionEditor";
import { BilingualField } from "../components/BilingualField";
import { ArrayEditor } from "../components/ArrayEditor";
import type { FooterContent, FooterColumn, Bi } from "@/types/content";

const emptyBi = (): Bi => ({ fr: "", en: "" });

export function FooterEditor() {
  const { content, updateSection } = useContent();
  const [data, setData] = useState<FooterContent>(content.footer);

  useEffect(() => { setData(content.footer); }, [content.footer]);

  const save = async () => { await updateSection("footer", data); };

  return (
    <SectionEditor title="Pied de page" onSave={save}>
      <BilingualField label="Tagline" value={data.tagline} onChange={(tagline) => setData({ ...data, tagline })} multiline />
      <BilingualField label="Copyright" value={data.copyright} onChange={(copyright) => setData({ ...data, copyright })} />

      <ArrayEditor<FooterColumn>
        label="Colonnes"
        items={data.columns ?? []}
        onChange={(columns) => setData({ ...data, columns })}
        createItem={() => ({ title: emptyBi(), links: [] })}
        renderItem={(col, _i, update) => (
          <div className="space-y-3">
            <BilingualField
              label="Titre de la colonne"
              value={col.title}
              onChange={(title) => update({ ...col, title })}
            />
            <ArrayEditor<Bi>
              label="Liens"
              items={col.links ?? []}
              onChange={(links) => update({ ...col, links })}
              createItem={emptyBi}
              renderItem={(link, _j, upd) => (
                <BilingualField label="Lien" value={link} onChange={upd} />
              )}
            />
          </div>
        )}
      />

      <ArrayEditor<Bi>
        label="Liens du bas"
        items={data.bottomLinks ?? []}
        onChange={(bottomLinks) => setData({ ...data, bottomLinks })}
        createItem={emptyBi}
        renderItem={(link, _i, upd) => (
          <BilingualField label="Lien" value={link} onChange={upd} />
        )}
      />
    </SectionEditor>
  );
}
