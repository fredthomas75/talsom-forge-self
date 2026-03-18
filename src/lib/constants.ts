/* ═══════════════════════════════════════════════════════
   Talsom brand tokens — Charte Graphique 2024
   ═══════════════════════════════════════════════════════ */

export const C = {
  green: "#003533",
  greenMid: "#00524F",
  greenLight: "#E6EDEC",
  yellow: "#FDF100",
  yellowDark: "#D4CC00",
  yellowLight: "#FEFCE8",
  silver: "#D2D9D9",
  silverLight: "#F0F3F3",
};

export const HDR_FONT = { fontFamily: "'Space Grotesk', Arial, sans-serif" };

/* ─── Product accent colors ─────────────────────────── */
export const PRODUCT_COLORS = {
  transform: { primary: "#06B6D4", secondary: "#0891B2", gradient: "linear-gradient(135deg, #06B6D4, #0891B2)" },
  discover:  { primary: "#8B5CF6", secondary: "#7C3AED", gradient: "linear-gradient(135deg, #8B5CF6, #7C3AED)" },
} as const;

// ─── I18N ────────────────────────────────────────────

export type Lang = "fr" | "en";

/* Helper: pick value by lang */
export function t(lang: Lang, fr: string, en: string) { return lang === "fr" ? fr : en; }
