import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { defaultContent } from "@/data/defaultContent";
import type { SiteContent, SectionKey } from "@/types/content";

interface ContentCtx {
  content: SiteContent;
  loading: boolean;
  updateSection: <K extends SectionKey>(key: K, data: SiteContent[K]) => Promise<boolean>;
  refreshContent: () => Promise<void>;
}

const ContentContext = createContext<ContentCtx>({
  content: defaultContent,
  loading: false,
  updateSection: async () => false,
  refreshContent: async () => {},
});

// Frontend section keys that the CMS can edit.
// Keys prefixed with "kb_" are AI knowledge-base sections (used by /api/chat)
// and must NOT be merged into the frontend SiteContent.
const FRONTEND_KEYS = new Set<string>([
  "hero", "stats", "nav", "trustbar", "howItWorks", "services",
  "marketplace", "caseStudies", "testimonials", "comparison",
  "aiChat", "pricing", "faq", "contact", "ctaBanner", "footer",
]);

/** Validate that Supabase data roughly matches the expected default shape */
function isCompatible(_key: string, dbValue: unknown, defaultValue: unknown): boolean {
  if (!dbValue || typeof dbValue !== "object") return false;
  // If the default is an array, the DB value must also be an array
  if (Array.isArray(defaultValue) && !Array.isArray(dbValue)) return false;
  // If the default is an object with specific keys (e.g. badge, title, items),
  // check that the DB value shares at least one of those keys
  if (!Array.isArray(defaultValue)) {
    const defKeys = Object.keys(defaultValue as Record<string, unknown>);
    const dbKeys = Object.keys(dbValue as Record<string, unknown>);
    const overlap = defKeys.filter((k) => dbKeys.includes(k));
    if (overlap.length === 0) return false;
  }
  return true;
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [loading, setLoading] = useState(true);

  const fetchContent = useCallback(async () => {
    if (!supabase) { setLoading(false); return; }
    try {
      const { data, error } = await supabase
        .from("content_sections")
        .select("section_key, content");
      if (!error && data?.length) {
        const merged: SiteContent = { ...defaultContent };
        for (const row of data) {
          const k = row.section_key as SectionKey;
          // Only merge keys that belong to the frontend AND have a compatible shape
          if (FRONTEND_KEYS.has(k) && k in defaultContent && isCompatible(k, row.content, defaultContent[k])) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (merged as any)[k] = row.content;
          }
        }
        setContent(merged);
      }
    } catch {
      // keep defaults on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  const updateSection = useCallback(async <K extends SectionKey>(key: K, data: SiteContent[K]): Promise<boolean> => {
    if (!supabase) return false;
    const { error } = await supabase
      .from("content_sections")
      .upsert({ section_key: key, content: data as unknown });
    if (error) return false;
    setContent((prev) => ({ ...prev, [key]: data }));
    return true;
  }, []);

  const refreshContent = useCallback(async () => {
    setLoading(true);
    await fetchContent();
  }, [fetchContent]);

  return (
    <ContentContext.Provider value={{ content, loading, updateSection, refreshContent }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContentCtx() {
  return useContext(ContentContext);
}
