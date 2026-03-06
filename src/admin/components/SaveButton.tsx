import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Check, Save } from "lucide-react";

interface Props {
  onClick: () => Promise<void>;
  label?: string;
}

export function SaveButton({ onClick, label = "Sauvegarder" }: Props) {
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");

  const handleClick = async () => {
    setState("saving");
    try {
      await onClick();
      setState("saved");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("idle");
    }
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={state === "saving"}
      className="min-w-[140px]"
    >
      {state === "saving" && (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Sauvegarde...
        </>
      )}
      {state === "saved" && (
        <>
          <Check className="w-4 h-4 mr-2" />
          Sauvegard&eacute;
        </>
      )}
      {state === "idle" && (
        <>
          <Save className="w-4 h-4 mr-2" />
          {label}
        </>
      )}
    </Button>
  );
}
