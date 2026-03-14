import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Search, Activity, Database,
  ShieldCheck, Users, GitBranch, ClipboardList, Map, Briefcase,
  Table2, Lock, Building2, GraduationCap, ArrowLeftRight, BookOpen,
  Rocket, BarChart3, Shield, Layers, X, Store, ExternalLink,
} from "lucide-react";
import { C, HDR_FONT } from "@/lib/constants";
import { useLang, useTheme } from "@/lib/contexts";
import { clientI18n } from "../i18n";

interface PluginCommand {
  command: string;
  label: { fr: string; en: string };
  output: { fr: string; en: string };
  icon: typeof Layers;
  phase: string;
}

const PHASES: Record<string, { fr: string; en: string; order: number }> = {
  diagnostic:   { fr: "Diagnostic",                              en: "Diagnostic",                      order: 1 },
  governance:   { fr: "Gouvernance IA",                          en: "AI Governance",                   order: 2 },
  design:       { fr: "Design",                                  en: "Design",                          order: 3 },
  change:       { fr: "Gestion du changement",                   en: "Change Management",               order: 4 },
  deployment:   { fr: "Déploiement",                             en: "Deployment",                      order: 5 },
};

const COMMANDS: PluginCommand[] = [
  // ── Phase 1 — Diagnostic ──
  { command: "ai-maturity-assessment",    phase: "diagnostic", icon: Activity,      label: { fr: "Maturité IA",                      en: "AI Maturity" },                       output: { fr: "Évaluation sur 6 dimensions avec scores et recommandations", en: "6-dimension assessment with scores and recommendations" } },
  { command: "data-readiness-assessment", phase: "diagnostic", icon: Database,      label: { fr: "Maturité des données",              en: "Data Readiness" },                    output: { fr: "Score sur 7 dimensions (qualité, gouvernance, sécurité, architecture...)", en: "Score across 7 dimensions (quality, governance, security, architecture...)" } },
  { command: "process-ai-diagnostic",     phase: "diagnostic", icon: Search,        label: { fr: "Diagnostic des processus",          en: "Process Diagnostic" },                output: { fr: "Scoring d'opportunité IA, maturité AI-native, mapping outils Microsoft", en: "AI opportunity scoring, AI-native maturity, Microsoft tools mapping" } },

  // ── Gouvernance IA ──
  { command: "ai-governance-framework",   phase: "governance", icon: ShieldCheck,   label: { fr: "Cadre de gouvernance IA",            en: "AI Governance Framework" },           output: { fr: "Framework complet avec politiques, classification des risques et processus", en: "Complete framework with policies, risk classification, and processes" } },
  { command: "ai-governance-committee",   phase: "governance", icon: Users,         label: { fr: "Comité de gouvernance IA",            en: "AI Governance Committee" },           output: { fr: "Mandat, composition, fréquence et processus décisionnel du comité", en: "Committee mandate, composition, frequency, and decision process" } },

  // ── Phase 2 — Design ──
  { command: "ai-operating-model",        phase: "design",     icon: GitBranch,     label: { fr: "Modèle opérationnel IA",             en: "AI Operating Model" },                output: { fr: "Design Hub & Spoke avec rôles, processus et plan de transition", en: "Hub & Spoke design with roles, processes, and transition plan" } },
  { command: "ai-backlog",                phase: "design",     icon: ClipboardList, label: { fr: "Backlog cas d'usage IA",              en: "AI Use Case Backlog" },               output: { fr: "Carnet de cas d'usage IA priorisé avec scoring et séquencement", en: "Prioritized AI use case backlog with scoring and sequencing" } },
  { command: "ai-roadmap",               phase: "design",     icon: Map,           label: { fr: "Feuille de route IA",                en: "AI Roadmap" },                        output: { fr: "Feuille de route IA phasée avec workstreams et jalons", en: "Phased AI roadmap with workstreams and milestones" } },
  { command: "ai-business-case",          phase: "design",     icon: Briefcase,     label: { fr: "Analyse de rentabilité IA",          en: "AI Business Case" },                  output: { fr: "Analyse de rentabilité avec ROI, analyse de sensibilité et risques", en: "Profitability analysis with ROI, sensitivity analysis, and risks" } },
  { command: "ai-raci",                   phase: "design",     icon: Table2,        label: { fr: "Matrice RACI",                       en: "RACI Matrix" },                       output: { fr: "Matrice RACI couvrant stratégie, développement, opérations, enablement", en: "RACI matrix covering strategy, development, operations, enablement" } },
  { command: "privacy-impact-assessment", phase: "design",     icon: Lock,          label: { fr: "Évaluation vie privée (EFVP)",       en: "Privacy Impact Assessment" },         output: { fr: "Rapport EFVP conforme Loi 25 / CAI pour projets IA", en: "PIA report compliant with Loi 25 / CAI for AI projects" } },
  { command: "ai-vendor-assessment",      phase: "design",     icon: Building2,     label: { fr: "Évaluation de fournisseurs IA",      en: "AI Vendor Assessment" },              output: { fr: "Grille d'évaluation comparative de solutions IA", en: "Comparative evaluation grid for AI solutions" } },

  // ── Gestion du changement ──
  { command: "ai-talent-roadmap",         phase: "change",     icon: GraduationCap, label: { fr: "Stratégie talents IA",               en: "AI Talent Strategy" },                output: { fr: "Dimensionnement de l'équipe cible avec parcours de développement", en: "Target team sizing with development paths" } },
  { command: "change-management-plan",    phase: "change",     icon: ArrowLeftRight,label: { fr: "Conduite du changement",              en: "Change Management Plan" },            output: { fr: "Plan structuré basé sur ADKAR pour déploiement IA", en: "Structured ADKAR-based plan for AI deployment" } },
  { command: "ai-training-plan",          phase: "change",     icon: BookOpen,      label: { fr: "Plan de formation IA",               en: "AI Training Plan" },                  output: { fr: "Parcours de formation et upskilling IA par rôle", en: "Training and AI upskilling paths by role" } },
  { command: "ai-impact-analysis",        phase: "change",     icon: BarChart3,     label: { fr: "Analyse d'impact",                   en: "Impact Analysis" },                   output: { fr: "Impact organisationnel (processus, rôles, culture, KPIs)", en: "Organizational impact (processes, roles, culture, KPIs)" } },
  { command: "resistance-management-plan",phase: "change",     icon: Shield,        label: { fr: "Gestion de la résistance",           en: "Resistance Management" },             output: { fr: "Diagnostic et plan tactique de gestion de la résistance", en: "Diagnostic and tactical resistance management plan" } },

  // ── Phase 4 — Déploiement ──
  { command: "copilot-deployment",        phase: "deployment", icon: Rocket,        label: { fr: "Déploiement Copilot 365",            en: "Copilot 365 Deployment" },            output: { fr: "Plan 4 phases (readiness, pilote, rollout, optimisation)", en: "4-phase plan (readiness, pilot, rollout, optimization)" } },
];

// ── Marketplace tools (standalone products) ──
interface MarketplaceTool {
  id: string;
  name: string;
  tagline: { fr: string; en: string };
  price: { fr: string; en: string };
  discount: string;
  icon: typeof Layers;
  features: { fr: string; en: string }[];
}

const MARKETPLACE_TOOLS: MarketplaceTool[] = [
  {
    id: "backlog",
    name: "AI Backlog Manager",
    tagline: { fr: "Gestion de portefeuille de cas d'usage", en: "Use case portfolio management" },
    price: { fr: "199$/mois", en: "$199/mo" },
    discount: "-25%",
    icon: ClipboardList,
    features: [
      { fr: "Scoring multicritère", en: "Multi-criteria scoring" },
      { fr: "Vues portefeuille", en: "Portfolio views" },
      { fr: "Suivi ROI", en: "ROI tracking" },
    ],
  },
  {
    id: "pia",
    name: "Privacy Impact Assessor",
    tagline: { fr: "EFVP automatisée Loi 25", en: "Automated Bill 25 PIA" },
    price: { fr: "À partir de 349$/mois", en: "From $349/mo" },
    discount: "-15%",
    icon: Lock,
    features: [
      { fr: "Conformité Loi 25", en: "Bill 25 compliance" },
      { fr: "Rapport automatisé", en: "Automated reports" },
      { fr: "Registre des risques", en: "Risk registry" },
    ],
  },
  {
    id: "governance-tool",
    name: "AI Governance Suite",
    tagline: { fr: "Gouvernance AI clé en main", en: "Turnkey AI governance" },
    price: { fr: "499$/mois", en: "$499/mo" },
    discount: "-20%",
    icon: ShieldCheck,
    features: [
      { fr: "Politiques AI", en: "AI policies" },
      { fr: "RACI automatisé", en: "Automated RACI" },
      { fr: "Audit trail", en: "Audit trail" },
    ],
  },
];

function groupByPhase(cmds: PluginCommand[]) {
  const groups: Record<string, PluginCommand[]> = {};
  for (const c of cmds) {
    if (!groups[c.phase]) groups[c.phase] = [];
    groups[c.phase].push(c);
  }
  return Object.entries(groups)
    .sort(([a], [b]) => PHASES[a].order - PHASES[b].order)
    .map(([key, commands]) => ({ key, label: PHASES[key], commands }));
}

export function ToolsPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const navigate = useNavigate();
  const bi = (v: { fr: string; en: string }) => (lang === "fr" ? v.fr : v.en);

  const [searchQuery, setSearchQuery] = useState("");
  const [phaseFilter, setPhaseFilter] = useState<string | null>(null);

  // Filter commands by search and phase
  const filteredCommands = useMemo(() => {
    let cmds = COMMANDS;
    if (phaseFilter) {
      cmds = cmds.filter((c) => c.phase === phaseFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      cmds = cmds.filter((c) =>
        bi(c.label).toLowerCase().includes(q) ||
        bi(c.output).toLowerCase().includes(q) ||
        c.command.includes(q)
      );
    }
    return cmds;
  }, [searchQuery, phaseFilter, lang]);

  const groups = groupByPhase(filteredCommands);
  const phaseKeys = Object.keys(PHASES);

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8">
      <div className="mb-6">
        <h1
          className={`text-2xl font-bold tracking-tight ${dark ? "text-white" : ""}`}
          style={{ ...HDR_FONT, color: dark ? undefined : C.green }}
        >
          {bi(clientI18n.tools)}
        </h1>
        <p className={`text-sm mt-1 ${dark ? "text-white/40" : "text-gray-500"}`}>
          {bi({
            fr: "18 outils spécialisés — chacun produit un livrable structuré et personnalisé",
            en: "18 specialized tools — each produces a structured, personalized deliverable",
          })}
        </p>
      </div>

      {/* Search + Phase filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${dark ? "text-white/30" : "text-gray-400"}`} />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={bi({ fr: "Rechercher un outil...", en: "Search tools..." })}
            className={`pl-9 rounded-xl ${dark ? "bg-white/5 border-white/10 text-white placeholder:text-white/20" : ""}`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${dark ? "text-white/30 hover:text-white/60" : "text-gray-400 hover:text-gray-600"}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="flex gap-1 flex-wrap">
          <Button
            variant="ghost" size="sm"
            onClick={() => setPhaseFilter(null)}
            className={`rounded-full text-xs ${!phaseFilter
              ? dark ? "bg-white/10 text-white" : "bg-gray-200 text-gray-900"
              : dark ? "text-white/40" : "text-gray-500"
            }`}
          >
            {bi({ fr: "Toutes", en: "All" })}
          </Button>
          {phaseKeys.map((key) => (
            <Button
              key={key}
              variant="ghost" size="sm"
              onClick={() => setPhaseFilter(phaseFilter === key ? null : key)}
              className={`rounded-full text-xs ${phaseFilter === key
                ? dark ? "bg-white/10 text-white" : "bg-gray-200 text-gray-900"
                : dark ? "text-white/40" : "text-gray-500"
              }`}
            >
              {bi(PHASES[key])}
            </Button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filteredCommands.length === 0 ? (
        <div className={`text-center py-16 rounded-xl border ${dark ? "border-white/5 bg-gray-900" : "border-gray-100 bg-white"}`}>
          <Search className={`w-8 h-8 mx-auto mb-3 ${dark ? "text-white/20" : "text-gray-300"}`} />
          <p className={`text-sm ${dark ? "text-white/30" : "text-gray-400"}`}>
            {bi({ fr: "Aucun outil trouvé", en: "No tools found" })}
          </p>
          <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(""); setPhaseFilter(null); }} className="mt-2 text-xs" style={{ color: C.green }}>
            {bi({ fr: "Réinitialiser les filtres", en: "Reset filters" })}
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map((group) => (
            <div key={group.key}>
              <div className="flex items-center gap-2 mb-3">
                <h2 className={`text-xs font-semibold uppercase tracking-wider ${dark ? "text-white/30" : "text-gray-400"}`}>
                  {bi(group.label)}
                </h2>
                <div className={`flex-1 h-px ${dark ? "bg-white/5" : "bg-gray-100"}`} />
                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 rounded-full ${dark ? "border-white/10 text-white/30" : ""}`}>
                  {group.commands.length}
                </Badge>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.commands.map((cmd) => (
                  <Card
                    key={`${group.key}-${cmd.command}`}
                    className={`cursor-pointer transition-all hover:shadow-md hover:scale-[1.01] rounded-xl border group ${
                      dark ? "bg-gray-900 border-white/5 hover:border-white/10" : "border-gray-100 hover:border-gray-200"
                    }`}
                    onClick={() => navigate(`/client/tools/${cmd.command}`)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${dark ? "bg-white/5 group-hover:bg-white/10" : "bg-gray-50 group-hover:bg-gray-100"}`}>
                          <cmd.icon className="w-4.5 h-4.5" style={{ color: C.green }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-900"}`}>
                            {bi(cmd.label)}
                          </CardTitle>
                        </div>
                        <ArrowRight className={`w-4 h-4 opacity-0 group-hover:opacity-50 transition-all group-hover:translate-x-0.5 ${dark ? "text-white" : "text-gray-400"}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className={`text-xs leading-relaxed ${dark ? "text-white/40" : "text-gray-500"}`}>
                        {bi(cmd.output)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Marketplace Section ── */}
      <div className="mt-12">
        <div className="flex items-center gap-2 mb-4">
          <Store className="w-5 h-5" style={{ color: C.yellow }} />
          <h2 className={`text-lg font-bold tracking-tight ${dark ? "text-white" : "text-gray-900"}`} style={HDR_FONT}>
            {bi({ fr: "Marketplace", en: "Marketplace" })}
          </h2>
          <div className={`flex-1 h-px ${dark ? "bg-white/5" : "bg-gray-100"}`} />
        </div>
        <p className={`text-xs mb-5 ${dark ? "text-white/30" : "text-gray-400"}`}>
          {bi({
            fr: "Outils spécialisés disponibles à la carte — rabais exclusifs pour les abonnés Forge",
            en: "Specialized tools available à la carte — exclusive discounts for Forge subscribers",
          })}
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MARKETPLACE_TOOLS.map((tool) => (
            <Card
              key={tool.id}
              className={`rounded-xl border group transition-all hover:shadow-md ${
                dark ? "bg-gray-900 border-white/5 hover:border-white/10" : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${dark ? "bg-white/5" : "bg-gray-50"}`}>
                    <tool.icon className="w-4.5 h-4.5" style={{ color: C.yellow }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-900"}`}>
                      {tool.name}
                    </CardTitle>
                    <p className={`text-[10px] ${dark ? "text-white/30" : "text-gray-400"}`}>
                      {bi(tool.tagline)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-sm font-bold ${dark ? "text-white" : "text-gray-900"}`}>{bi(tool.price)}</span>
                  <Badge className="text-[9px] px-1.5 py-0 h-4 rounded-full" style={{ background: `${C.green}20`, color: C.green, border: "none" }}>
                    {bi({ fr: `Forge ${tool.discount}`, en: `Forge ${tool.discount}` })}
                  </Badge>
                </div>
                <div className="space-y-1">
                  {tool.features.map((f, i) => (
                    <p key={i} className={`text-[11px] ${dark ? "text-white/40" : "text-gray-500"}`}>
                      ✓ {bi(f)}
                    </p>
                  ))}
                </div>
                <Button
                  variant="outline" size="sm"
                  className={`w-full mt-3 text-xs rounded-lg gap-1.5 ${dark ? "border-white/10 text-white/60 hover:bg-white/5" : ""}`}
                >
                  <ExternalLink className="w-3 h-3" />
                  {bi({ fr: "En savoir plus", en: "Learn more" })}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
