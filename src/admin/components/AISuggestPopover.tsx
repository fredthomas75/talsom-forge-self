import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Lightbulb, Loader2 } from "lucide-react";
import { useAdminAI } from "@/hooks/useAdminAI";

interface Props {
  currentContent: string;
  fieldLabel: string;
  sectionKey: string;
  onSelect: (suggestion: string) => void;
  count?: number;
}

export function AISuggestPopover({
  currentContent,
  fieldLabel,
  sectionKey,
  onSelect,
  count = 3,
}: Props) {
  const { suggest, suggesting } = useAdminAI();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = async (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && suggestions.length === 0) {
      setError(null);
      try {
        const result = await suggest({
          currentContent,
          fieldLabel,
          sectionKey,
          count,
        });
        setSuggestions(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur");
      }
    }
  };

  const handleSelect = (suggestion: string) => {
    onSelect(suggestion);
    setOpen(false);
    setSuggestions([]);
  };

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-7 w-7 shrink-0"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-2" align="start">
        <p className="text-xs font-medium text-gray-500 mb-2 px-1">
          Suggestions AI pour &laquo;{fieldLabel}&raquo;
        </p>
        {suggesting && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            <span className="ml-2 text-xs text-gray-400">Génération...</span>
          </div>
        )}
        {error && (
          <p className="text-xs text-red-500 px-1 py-2">{error}</p>
        )}
        {!suggesting && !error && suggestions.length > 0 && (
          <div className="space-y-1">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSelect(s)}
                className="w-full text-left text-sm px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
