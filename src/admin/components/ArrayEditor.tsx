import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";

interface Props<T> {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, index: number, update: (val: T) => void) => ReactNode;
  createItem: () => T;
  label: string;
}

export function ArrayEditor<T>({ items, onChange, renderItem, createItem, label }: Props<T>) {
  const list = items ?? [];

  const updateAt = (index: number, val: T) => {
    const next = [...list];
    next[index] = val;
    onChange(next);
  };

  const removeAt = (index: number) => {
    onChange(list.filter((_, i) => i !== index));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...list];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  };

  const moveDown = (index: number) => {
    if (index >= list.length - 1) return;
    const next = [...list];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label} ({list.length})
      </label>
      <div className="space-y-3">
        {list.map((item, i) => (
          <div
            key={i}
            className="relative border border-gray-200 rounded-lg p-4 bg-white"
          >
            <div className="absolute top-2 right-2 flex items-center gap-0.5">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => moveUp(i)}
                disabled={i === 0}
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => moveDown(i)}
                disabled={i >= list.length - 1}
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50"
                onClick={() => removeAt(i)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="pr-24">{renderItem(item, i, (val) => updateAt(i, val))}</div>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...list, createItem()])}
        className="mt-2"
      >
        <Plus className="w-3.5 h-3.5 mr-1.5" />
        Ajouter
      </Button>
    </div>
  );
}
