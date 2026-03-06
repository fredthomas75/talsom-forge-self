import { useContentCtx } from "@/contexts/ContentProvider";
import { useLang } from "@/lib/contexts";
import type { Bi, SectionKey, SiteContent } from "@/types/content";

/** Access full content context */
export function useContent() {
  return useContentCtx();
}

/** Get a specific section with proper typing */
export function useSection<K extends SectionKey>(key: K): SiteContent[K] {
  const { content } = useContentCtx();
  return content[key];
}

/** Resolve a bilingual field to the active language */
export function useBi() {
  const { lang } = useLang();
  return (bi: Bi) => bi[lang];
}
