import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { useAdminAI } from "@/hooks/useAdminAI";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  prompt: string;
  sectionKey: string;
  fieldPath: string;
  lang?: "fr" | "en";
  onGenerated: (text: string) => void;
}

export function AIGenerateButton({
  prompt,
  sectionKey,
  fieldPath,
  lang = "fr",
  onGenerated,
}: Props) {
  const { generate, generating } = useAdminAI();
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setError(null);
    try {
      const text = await generate({ prompt, sectionKey, fieldPath, lang });
      onGenerated(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={handleClick}
            disabled={generating}
            className="h-7 w-7 shrink-0"
          >
            {generating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-yellow-600" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-yellow-600" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          {error ? error : "Générer avec AI"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
