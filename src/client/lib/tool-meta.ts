import {
  Layers, BookOpen, Search,
  Activity, Database, ShieldCheck, Users, GitBranch,
  ClipboardList, Map, Briefcase, Table2, Lock, Building2,
  GraduationCap, ArrowLeftRight, Rocket, BarChart3, Shield,
} from "lucide-react";

// ─── Tool metadata — 18 plugin commands ──────────────
export const TOOL_META: Record<string, { icon: typeof Layers; label: { fr: string; en: string }; desc: { fr: string; en: string } }> = {
  // Diagnostic
  "ai-maturity-assessment":     { icon: Activity,      label: { fr: "Maturité IA",                      en: "AI Maturity" },                       desc: { fr: "Évaluation 6 dimensions avec scores",                            en: "6-dimension assessment with scores" } },
  "data-readiness-assessment":  { icon: Database,      label: { fr: "Maturité des données",              en: "Data Readiness" },                    desc: { fr: "Score sur 7 dimensions data",                                     en: "Score across 7 data dimensions" } },
  "process-ai-diagnostic":     { icon: Search,        label: { fr: "Diagnostic des processus",          en: "Process Diagnostic" },                desc: { fr: "Scoring opportunité IA par processus",                            en: "AI opportunity scoring per process" } },
  // Gouvernance IA
  "ai-governance-framework":   { icon: ShieldCheck,   label: { fr: "Cadre de gouvernance IA",            en: "AI Governance Framework" },           desc: { fr: "Politiques, classification risques, processus",                   en: "Policies, risk classification, processes" } },
  "ai-governance-committee":   { icon: Users,         label: { fr: "Comité de gouvernance IA",            en: "AI Governance Committee" },           desc: { fr: "Mandat, composition, processus décisionnel",                      en: "Mandate, composition, decision process" } },
  // Design
  "ai-operating-model":        { icon: GitBranch,     label: { fr: "Modèle opérationnel IA",             en: "AI Operating Model" },                desc: { fr: "Hub & Spoke, rôles, plan de transition",                          en: "Hub & Spoke, roles, transition plan" } },
  "ai-backlog":                { icon: ClipboardList, label: { fr: "Backlog cas d'usage IA",              en: "AI Use Case Backlog" },               desc: { fr: "Cas d'usage IA priorisés avec scoring",                           en: "Prioritized AI use cases with scoring" } },
  "ai-roadmap":                { icon: Map,           label: { fr: "Feuille de route IA",                en: "AI Roadmap" },                        desc: { fr: "Feuille de route phasée avec jalons",                             en: "Phased roadmap with milestones" } },
  "ai-business-case":          { icon: Briefcase,     label: { fr: "Analyse de rentabilité IA",          en: "AI Business Case" },                  desc: { fr: "ROI, analyse de sensibilité, risques",                            en: "ROI, sensitivity analysis, risks" } },
  "ai-raci":                   { icon: Table2,        label: { fr: "Matrice RACI",                       en: "RACI Matrix" },                       desc: { fr: "Matrice RACI stratégie/développement/opérations",                 en: "RACI matrix strategy/development/operations" } },
  "privacy-impact-assessment": { icon: Lock,          label: { fr: "Évaluation vie privée (EFVP)",       en: "Privacy Impact Assessment" },         desc: { fr: "EFVP conforme Loi 25 / CAI",                                      en: "PIA compliant with Loi 25 / CAI" } },
  "ai-vendor-assessment":      { icon: Building2,     label: { fr: "Évaluation de fournisseurs IA",      en: "AI Vendor Assessment" },              desc: { fr: "Grille comparative de solutions IA",                              en: "Comparative AI solutions grid" } },
  // Gestion du changement
  "ai-talent-roadmap":         { icon: GraduationCap, label: { fr: "Stratégie talents IA",               en: "AI Talent Strategy" },                desc: { fr: "Équipe cible et parcours de développement",                       en: "Target team and development paths" } },
  "change-management-plan":    { icon: ArrowLeftRight,label: { fr: "Conduite du changement",              en: "Change Management Plan" },            desc: { fr: "Plan ADKAR pour déploiement IA",                                  en: "ADKAR plan for AI deployment" } },
  "ai-training-plan":          { icon: BookOpen,      label: { fr: "Plan de formation IA",               en: "AI Training Plan" },                  desc: { fr: "Formation et upskilling par rôle",                                en: "Training and upskilling by role" } },
  "ai-impact-analysis":        { icon: BarChart3,     label: { fr: "Analyse d'impact",                   en: "Impact Analysis" },                   desc: { fr: "Impact processus, rôles, culture, KPIs",                          en: "Impact on processes, roles, culture, KPIs" } },
  "resistance-management-plan":{ icon: Shield,        label: { fr: "Gestion de la résistance",           en: "Resistance Management" },             desc: { fr: "Diagnostic et plan tactique résistance",                          en: "Diagnostic and tactical resistance plan" } },
  // Déploiement
  "copilot-deployment":        { icon: Rocket,        label: { fr: "Déploiement Copilot 365",            en: "Copilot 365 Deployment" },            desc: { fr: "Plan 4 phases Copilot 365",                                       en: "4-phase Copilot 365 plan" } },
};
