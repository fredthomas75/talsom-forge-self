import { useState, useEffect } from "react";
import { useContent } from "@/hooks/useContent";
import { SectionEditor } from "../components/SectionEditor";
import { BilingualField } from "../components/BilingualField";
import { ArrayEditor } from "../components/ArrayEditor";
import { Input } from "@/components/ui/input";
import type { NavContent, NavLink } from "@/types/content";

export function NavEditor() {
  const { content, updateSection } = useContent();
  const [data, setData] = useState<NavContent>(content.nav);

  useEffect(() => { setData(content.nav); }, [content.nav]);

  const save = async () => { await updateSection("nav", data); };

  return (
    <SectionEditor title="Navigation" onSave={save}>
      <ArrayEditor<NavLink>
        label="Liens"
        items={data.links}
        onChange={(links) => setData({ ...data, links })}
        createItem={() => ({ label: { fr: "", en: "" }, href: "" })}
        renderItem={(item, _i, update) => (
          <div className="space-y-3">
            <BilingualField
              label="Label"
              value={item.label}
              onChange={(label) => update({ ...item, label })}
            />
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Href
              </label>
              <Input
                value={item.href}
                onChange={(e) => update({ ...item, href: e.target.value })}
                placeholder="#section-id"
                className="text-sm"
              />
            </div>
          </div>
        )}
      />
      <BilingualField
        label="Label CTA"
        value={data.ctaLabel}
        onChange={(ctaLabel) => setData({ ...data, ctaLabel })}
      />
    </SectionEditor>
  );
}
