import { getSiteContent, type ContentSection } from "./content-loader.js";

// ─── MCP TOOLS SHARED MODULE ────────────────────────
// Extracted from api/mcp/content.ts so both the public MCP endpoint
// and the client portal can use the same tool definitions + executor.

export const TOOLS = [
  {
    name: "get_services",
    description:
      "Get all Talsom Forge consulting services — AI Strategy & Governance, Business & Process Design (AI Native), IT Modernization & Microsoft AI Stack, Change Management",
    inputSchema: {
      type: "object" as const,
      properties: {
        lang: { type: "string", enum: ["fr", "en"], description: "Language for the response" },
      },
    },
  },
  {
    name: "get_methodology",
    description:
      "Get Talsom Forge engagement sequences — full engagement, quick Copilot deployment, governance-first, strategy & business case, AI-native process transformation, adoption recovery",
    inputSchema: {
      type: "object" as const,
      properties: { lang: { type: "string", enum: ["fr", "en"] } },
    },
  },
  {
    name: "get_deliverables",
    description:
      "Get all available Talsom Forge deliverables organized by phase — diagnostic, design, planning, deployment, process transformation, recurring",
    inputSchema: {
      type: "object" as const,
      properties: { lang: { type: "string", enum: ["fr", "en"] } },
    },
  },
  {
    name: "get_pricing",
    description:
      "Get Talsom Forge engagement models and pricing tiers — quick diagnostic, tactical, strategic, full transformation",
    inputSchema: {
      type: "object" as const,
      properties: { lang: { type: "string", enum: ["fr", "en"] } },
    },
  },
  {
    name: "get_faq",
    description: "Get frequently asked questions about Talsom Forge",
    inputSchema: {
      type: "object" as const,
      properties: { lang: { type: "string", enum: ["fr", "en"] } },
    },
  },
  {
    name: "get_benchmarks",
    description:
      "Get AI adoption benchmarks, ROI metrics, resistance stats, and industry-specific ROI data (financial services, manufacturing, healthcare, retail)",
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "get_compliance",
    description:
      "Get regulatory compliance information — Quebec Loi 25, EU AI Act, Canada federal status, EFVP/PIA requirements, penalties",
    inputSchema: {
      type: "object" as const,
      properties: { lang: { type: "string", enum: ["fr", "en"] } },
    },
  },
  {
    name: "get_change_framework",
    description:
      "Get Prosci ADKAR change management framework adapted for AI — 5 phases with targets and barriers, CLARC network roles",
    inputSchema: {
      type: "object" as const,
      properties: { lang: { type: "string", enum: ["fr", "en"] } },
    },
  },
  {
    name: "get_operating_model",
    description:
      "Get AI Target Operating Model — Hub & Spoke (CoE + business unit spokes), maturity levels, agentic roles, Frontier Firm vision",
    inputSchema: {
      type: "object" as const,
      properties: { lang: { type: "string", enum: ["fr", "en"] } },
    },
  },
  {
    name: "get_microsoft_stack",
    description:
      "Get Microsoft AI Stack overview — 5 tiers (Copilot 365, Foundry, Power Platform, Fabric, Security Copilot), deployment phases",
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "get_data_readiness",
    description:
      "Get data readiness assessment — 7 dimensions, 5 maturity levels, AI readiness mapping per tool tier",
    inputSchema: {
      type: "object" as const,
      properties: { lang: { type: "string", enum: ["fr", "en"] } },
    },
  },
  {
    name: "get_agentic_ai",
    description:
      "Get Agentic AI framework 2025-2026 — market context, AAA governance, risks, Microsoft Agent 365",
    inputSchema: {
      type: "object" as const,
      properties: { lang: { type: "string", enum: ["fr", "en"] } },
    },
  },
  {
    name: "search_content",
    description: "Full-text search across all Talsom Forge knowledge base sections",
    inputSchema: {
      type: "object" as const,
      properties: {
        query: { type: "string", description: "Search query" },
        lang: { type: "string", enum: ["fr", "en"] },
      },
      required: ["query"],
    },
  },
];

// Map tool names to section keys in the database
export const TOOL_TO_SECTION: Record<string, string> = {
  // ── Legacy MCP API tools (backward compat) ──
  get_services: "kb_services",
  get_methodology: "methodology",
  get_deliverables: "commands",
  get_pricing: "kb_pricing",
  get_faq: "kb_faq",
  get_benchmarks: "benchmarks",
  get_compliance: "compliance",
  get_change_framework: "changeFramework",
  get_operating_model: "operatingModel",
  get_microsoft_stack: "microsoftStack",
  get_data_readiness: "dataReadiness",
  get_agentic_ai: "agenticAI",

  // ── Plugin commands (26 deliverables) ──
  // Phase 1 — Diagnostic
  "new-client":                 "kb_services",
  "ai-maturity-assessment":     "benchmarks",
  "data-readiness-assessment":  "dataReadiness",
  "process-ai-diagnostic":      "processAiNative",
  // Phase 2 — Design
  "ai-governance-framework":    "compliance",
  "ai-governance-committee":    "compliance",
  "ai-operating-model":         "operatingModel",
  "ai-backlog":                 "aiBacklog",
  "ai-roadmap":                 "methodology",
  "ai-business-case":           "benchmarks",
  "ai-raci":                    "commands",
  "privacy-impact-assessment":  "efvp",
  "ai-vendor-assessment":       "commands",
  // Phase 3 — Planification
  "ai-talent-roadmap":          "commands",
  "change-management-plan":     "changeFramework",
  "ai-training-plan":           "commands",
  // Phase 4 — Déploiement
  "copilot-deployment":         "microsoftStack",
  "ai-impact-analysis":         "benchmarks",
  "resistance-management-plan": "changeFramework",
  // Transformation processus
  "process-ai-redesign":        "processAiNative",
  "process-ai-adoption":        "processAiNative",
  // Récurrent
  "ai-project-tracker":         "commands",
  "ai-portfolio-dashboard":     "commands",
  "client-status-report":       "commands",
  // Opérations
  "update-client":              "kb_services",
  "workshop-prep":              "methodology",
};

/**
 * Execute a single MCP tool by name.
 * Accepts pre-loaded content or fetches it automatically.
 */
export async function executeTool(
  name: string,
  args: Record<string, string>,
  content?: ContentSection[]
): Promise<unknown> {
  const sections = content ?? (await getSiteContent());

  const section = (key: string) =>
    sections.find((s) => s.section_key === key)?.content;

  // Check mapped tools first
  const sectionKey = TOOL_TO_SECTION[name];
  if (sectionKey) {
    return section(sectionKey) ?? { error: `Section '${sectionKey}' not found` };
  }

  if (name === "search_content") {
    const query = (args.query ?? "").toLowerCase();
    const results = sections
      .filter((s) => JSON.stringify(s.content).toLowerCase().includes(query))
      .map((s) => ({ section: s.section_key, content: s.content }));
    return results.length ? results : { message: "No results found", query };
  }

  return { error: `Unknown tool: ${name}` };
}
