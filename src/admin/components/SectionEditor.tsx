import type { ReactNode } from "react";
import { SaveButton } from "./SaveButton";
import { Separator } from "@/components/ui/separator";

interface Props {
  title: string;
  onSave: () => Promise<void>;
  children: ReactNode;
}

export function SectionEditor({ title, onSave, children }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <Separator className="mt-3" />
      </div>
      <div className="space-y-5">{children}</div>
      <Separator />
      <div className="flex justify-end">
        <SaveButton onClick={onSave} />
      </div>
    </div>
  );
}
