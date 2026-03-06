import { useState, useEffect } from "react";
import { useContent } from "@/hooks/useContent";
import { SectionEditor } from "../components/SectionEditor";
import { BilingualField } from "../components/BilingualField";
import { ArrayEditor } from "../components/ArrayEditor";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { ComparisonContent, ComparisonRow, Bi } from "@/types/content";

const emptyBi = (): Bi => ({ fr: "", en: "" });

function isBi(v: Bi | boolean): v is Bi {
  return typeof v === "object" && v !== null && "fr" in v;
}

function ComparisonCellEditor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Bi | boolean;
  onChange: (v: Bi | boolean) => void;
}) {
  const isText = isBi(value);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-5 px-1.5 text-[10px]"
          onClick={() => onChange(isText ? true : emptyBi())}
        >
          {isText ? "Texte" : "Bool"} &rarr; {isText ? "Bool" : "Texte"}
        </Button>
      </div>
      {isText ? (
        <BilingualField label="" value={value} onChange={onChange} />
      ) : (
        <div className="flex items-center gap-2 py-1">
          <Checkbox
            checked={!!value}
            onCheckedChange={(checked) => onChange(!!checked)}
          />
          <span className="text-xs text-gray-600">
            {value ? "Oui" : "Non"}
          </span>
        </div>
      )}
    </div>
  );
}

export function ComparisonEditor() {
  const { content, updateSection } = useContent();
  const [data, setData] = useState<ComparisonContent>(content.comparison);

  useEffect(() => { setData(content.comparison); }, [content.comparison]);

  const save = async () => { await updateSection("comparison", data); };

  return (
    <SectionEditor title="Comparaison" onSave={save}>
      <BilingualField label="Badge" value={data.badge} onChange={(badge) => setData({ ...data, badge })} />
      <BilingualField label="Titre" value={data.title} onChange={(title) => setData({ ...data, title })} />
      <BilingualField label="Sous-titre" value={data.subtitle} onChange={(subtitle) => setData({ ...data, subtitle })} multiline />
      <BilingualField
        label="Label Traditionnel"
        value={data.traditionalLabel}
        onChange={(traditionalLabel) => setData({ ...data, traditionalLabel })}
      />
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Label Forge
        </label>
        <Input
          value={data.forgeLabel}
          onChange={(e) => setData({ ...data, forgeLabel: e.target.value })}
          className="text-sm"
        />
      </div>

      <ArrayEditor<ComparisonRow>
        label="Lignes"
        items={data.rows}
        onChange={(rows) => setData({ ...data, rows })}
        createItem={() => ({
          label: emptyBi(),
          traditional: emptyBi(),
          forge: emptyBi(),
        })}
        renderItem={(row, _i, update) => (
          <div className="space-y-3">
            <BilingualField
              label="Label"
              value={row.label}
              onChange={(label) => update({ ...row, label })}
            />
            <ComparisonCellEditor
              label="Traditionnel"
              value={row.traditional}
              onChange={(traditional) => update({ ...row, traditional })}
            />
            <ComparisonCellEditor
              label="Forge"
              value={row.forge}
              onChange={(forge) => update({ ...row, forge })}
            />
          </div>
        )}
      />
    </SectionEditor>
  );
}
