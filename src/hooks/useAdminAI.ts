import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface GenerateOptions {
  prompt: string;
  sectionKey: string;
  fieldPath: string;
  lang?: "fr" | "en";
}

interface SuggestOptions {
  currentContent: string;
  fieldLabel: string;
  sectionKey: string;
  count?: number;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  if (!supabase) throw new Error("Supabase not configured");
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Not authenticated");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export function useAdminAI() {
  const [generating, setGenerating] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (options: GenerateOptions): Promise<string> => {
      setGenerating(true);
      setError(null);
      try {
        const headers = await getAuthHeaders();
        const res = await fetch("/api/admin/generate", {
          method: "POST",
          headers,
          body: JSON.stringify(options),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || `HTTP ${res.status}`);
        }
        const { generated } = await res.json();
        return generated;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Generation failed";
        setError(msg);
        throw err;
      } finally {
        setGenerating(false);
      }
    },
    []
  );

  const suggest = useCallback(
    async (options: SuggestOptions): Promise<string[]> => {
      setSuggesting(true);
      setError(null);
      try {
        const headers = await getAuthHeaders();
        const res = await fetch("/api/admin/suggest", {
          method: "POST",
          headers,
          body: JSON.stringify(options),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || `HTTP ${res.status}`);
        }
        const { suggestions } = await res.json();
        return suggestions;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Suggestion failed";
        setError(msg);
        throw err;
      } finally {
        setSuggesting(false);
      }
    },
    []
  );

  return { generate, suggest, generating, suggesting, error };
}
