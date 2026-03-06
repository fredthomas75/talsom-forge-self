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
          if (k in defaultContent) {
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
