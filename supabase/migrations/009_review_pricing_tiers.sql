-- ============================================================
-- 009: Tiered Review Pricing
-- ============================================================
-- Replaces flat $149/review with 3 tiers based on tool complexity.
-- Market analysis (Canada 2025-2026):
--   Senior AI governance consultant: $150-300/hr
--   Effort per deliverable: 1-5h depending on complexity
--
-- Tiers:
--   Standard ($249) — diagnostics, matrices, analyses (~1-2h)
--   Premium  ($449) — policies, plans, committees (~2-3h)
--   Expert   ($649) — frameworks, roadmaps, strategies (~3-5h)

UPDATE review_config SET value = '{
  "tiers": {
    "standard": {"price_cents": 24900, "label_fr": "Standard", "label_en": "Standard"},
    "premium":  {"price_cents": 44900, "label_fr": "Premium",  "label_en": "Premium"},
    "expert":   {"price_cents": 64900, "label_fr": "Expert",   "label_en": "Expert"}
  },
  "tool_tiers": {
    "diagnostic-processus":      "standard",
    "analyse-parties-prenantes": "standard",
    "matrice-risques":           "standard",
    "analyse-concurrentielle":   "standard",
    "matrice-priorisation":      "standard",
    "evaluation-fournisseurs":   "standard",
    "recherche-ia":              "standard",
    "tableau-bord-ia":           "standard",
    "maturite-donnees":          "premium",
    "comite-gouvernance-ia":     "premium",
    "plan-formation-ia":         "premium",
    "politique-utilisation-ia":  "premium",
    "plan-donnees":              "premium",
    "business-case-ia":          "premium",
    "cadre-gouvernance-ia":      "expert",
    "plan-copilot-365":          "expert",
    "feuille-route-ia":          "expert",
    "plan-gestion-changement":   "expert"
  },
  "currency": "cad",
  "enterprise_included": true,
  "default_tier": "premium"
}'::jsonb
WHERE key = 'pricing';
