import { createContext, useContext } from "react";
import type { Lang } from "@/lib/constants";

// ─── I18N CONTEXT ────────────────────────────────────

export const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "fr", setLang: () => {} });
export const useLang = () => useContext(LangContext);

// ─── DARK MODE ───────────────────────────────────────

export type Theme = "light" | "dark";
export const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({ theme: "light", toggle: () => {} });
export const useTheme = () => useContext(ThemeContext);
