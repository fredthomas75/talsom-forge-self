import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Bi } from "@/types/content";

interface Props {
  label: string;
  value: Bi;
  onChange: (v: Bi) => void;
  multiline?: boolean;
}

export function BilingualField({ label, value, onChange, multiline }: Props) {
  const Field = multiline ? Textarea : Input;

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </label>
      <div className="grid grid-cols-2 gap-2">
        <div className="relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 pointer-events-none select-none z-10">
            FR
          </span>
          <Field
            value={value?.fr ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
              onChange({ ...value, fr: e.target.value })
            }
            className="pl-9 text-sm"
            placeholder={`${label} (FR)`}
          />
        </div>
        <div className="relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 pointer-events-none select-none z-10">
            EN
          </span>
          <Field
            value={value?.en ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
              onChange({ ...value, en: e.target.value })
            }
            className="pl-9 text-sm"
            placeholder={`${label} (EN)`}
          />
        </div>
      </div>
    </div>
  );
}
