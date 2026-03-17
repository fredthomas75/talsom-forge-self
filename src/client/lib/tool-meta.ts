import {
  Layers, BookOpen, Search,
  Activity, Database, ShieldCheck, Users, GitBranch,
  ClipboardList, Map, Briefcase, Table2, Lock, Building2,
  GraduationCap, ArrowLeftRight, Rocket, BarChart3, Shield,
  Gauge, Network, HeartPulse, MessageCircle, Scale,
  Sparkles, Lightbulb, Target, LineChart, Compass, FileSearch,
  Package,
} from "lucide-react";

// ─── Tool metadata — 31 plugin commands ──────────────
export const TOOL_META: Record<string, { icon: typeof Layers; label: { fr: string; en: string }; desc: { fr: string; en: string } }> = {
  // ── Forge | Transform ──
  "change-readiness-assessment": { icon: Gauge,          label: { fr: "Évaluation de préparation",         en: "Readiness Assessment" },              desc: { fr: "Score de préparation au changement sur 5 dimensions",              en: "Change readiness score across 5 dimensions" } },
  "stakeholder-mapping":         { icon: Network,        label: { fr: "Cartographie parties prenantes",    en: "Stakeholder Mapping" },               desc: { fr: "Cartes d'influence avec réseau CLARC",                             en: "Influence maps with CLARC network" } },
  "resistance-prediction":       { icon: HeartPulse,     label: { fr: "Prédiction de résistance",          en: "Resistance Prediction" },             desc: { fr: "Hotspots de résistance et courbes d'adoption",                     en: "Resistance hotspots and adoption curves" } },
  "change-communications":       { icon: MessageCircle,  label: { fr: "Communications de changement",      en: "Change Communications" },             desc: { fr: "Plan de communication bilingue par phase ADKAR",                   en: "Bilingual communication plan by ADKAR phase" } },
  "adoption-dashboard":          { icon: BarChart3,      label: { fr: "Tableau de bord d'adoption",        en: "Adoption Dashboard" },                desc: { fr: "Métriques d'adoption liées aux KPIs business",                     en: "Adoption metrics linked to business KPIs" } },
  "change-saturation-analysis":  { icon: Scale,          label: { fr: "Analyse de saturation",             en: "Saturation Analysis" },               desc: { fr: "Détection de fatigue organisationnelle multi-changements",         en: "Multi-change organizational fatigue detection" } },
  // ── Forge | Discover ──
  "ai-readiness-quiz":           { icon: Sparkles,       label: { fr: "Quiz maturité IA",                  en: "AI Readiness Quiz" },                 desc: { fr: "Quiz 10 min avec score et 3 cas d'usage suggérés",                 en: "10-min quiz with score and 3 suggested use cases" } },
  "ai-use-case-library":         { icon: Lightbulb,      label: { fr: "Bibliothèque de cas d'usage",       en: "Use Case Library" },                  desc: { fr: "50+ cas d'usage matchés à votre industrie",                        en: "50+ use cases matched to your industry" } },
  "ai-feasibility-scoring":      { icon: Target,         label: { fr: "Scoring de faisabilité",            en: "Feasibility Scoring" },               desc: { fr: "Évaluation 5 dimensions par cas d'usage",                          en: "5-dimension evaluation per use case" } },
  "ai-roi-estimation":           { icon: LineChart,      label: { fr: "Estimation ROI",                    en: "ROI Estimation" },                    desc: { fr: "Modélisation financière réaliste avec coûts cachés",               en: "Realistic financial modeling with hidden costs" } },
  "ai-portfolio-dashboard":      { icon: Compass,        label: { fr: "Portefeuille IA",                   en: "AI Portfolio" },                      desc: { fr: "Suivi des initiatives de la découverte au déploiement",            en: "Initiative tracking from discovery to deployment" } },
  "ai-governance-assessment":    { icon: FileSearch,     label: { fr: "Évaluation gouvernance IA",         en: "AI Governance Assessment" },          desc: { fr: "Risques, conformité Loi 25, éthique par cas d'usage",              en: "Risks, Bill 25 compliance, ethics per use case" } },
  // ── AI Use Case Packaging ──
  "ai-usecase-package":          { icon: Package,        label: { fr: "Package cas d'usage IA",            en: "AI Use Case Package" },               desc: { fr: "Note technique + fiche professionnelle à partir d'un cas brut",    en: "Technical note + professional brief from raw input" } },
  // ── Diagnostic ──
  "ai-maturity-assessment":      { icon: Activity,       label: { fr: "Maturité IA",                       en: "AI Maturity" },                       desc: { fr: "Évaluation 6 dimensions avec scores",                             en: "6-dimension assessment with scores" } },
  "data-readiness-assessment":   { icon: Database,       label: { fr: "Maturité des données",               en: "Data Readiness" },                    desc: { fr: "Score sur 7 dimensions data",                                      en: "Score across 7 data dimensions" } },
  "process-ai-diagnostic":       { icon: Search,         label: { fr: "Diagnostic des processus",           en: "Process Diagnostic" },                desc: { fr: "Scoring opportunité IA par processus",                             en: "AI opportunity scoring per process" } },
  // Gouvernance IA
  "ai-governance-framework":     { icon: ShieldCheck,    label: { fr: "Cadre de gouvernance IA",            en: "AI Governance Framework" },           desc: { fr: "Politiques, classification risques, processus",                    en: "Policies, risk classification, processes" } },
  "ai-governance-committee":     { icon: Users,          label: { fr: "Comité de gouvernance IA",           en: "AI Governance Committee" },           desc: { fr: "Mandat, composition, processus décisionnel",                       en: "Mandate, composition, decision process" } },
  // Design
  "ai-operating-model":          { icon: GitBranch,      label: { fr: "Modèle opérationnel IA",            en: "AI Operating Model" },                desc: { fr: "Hub & Spoke, rôles, plan de transition",                           en: "Hub & Spoke, roles, transition plan" } },
  "ai-backlog":                  { icon: ClipboardList,  label: { fr: "Backlog cas d'usage IA",             en: "AI Use Case Backlog" },               desc: { fr: "Cas d'usage IA priorisés avec scoring",                            en: "Prioritized AI use cases with scoring" } },
  "ai-roadmap":                  { icon: Map,            label: { fr: "Feuille de route IA",               en: "AI Roadmap" },                        desc: { fr: "Feuille de route phasée avec jalons",                              en: "Phased roadmap with milestones" } },
  "ai-business-case":            { icon: Briefcase,      label: { fr: "Analyse de rentabilité IA",         en: "AI Business Case" },                  desc: { fr: "ROI, analyse de sensibilité, risques",                             en: "ROI, sensitivity analysis, risks" } },
  "ai-raci":                     { icon: Table2,         label: { fr: "Matrice RACI",                      en: "RACI Matrix" },                       desc: { fr: "Matrice RACI stratégie/développement/opérations",                  en: "RACI matrix strategy/development/operations" } },
  "privacy-impact-assessment":   { icon: Lock,           label: { fr: "Évaluation vie privée (EFVP)",      en: "Privacy Impact Assessment" },         desc: { fr: "EFVP conforme Loi 25 / CAI",                                       en: "PIA compliant with Loi 25 / CAI" } },
  "ai-vendor-assessment":        { icon: Building2,      label: { fr: "Évaluation de fournisseurs IA",     en: "AI Vendor Assessment" },              desc: { fr: "Grille comparative de solutions IA",                               en: "Comparative AI solutions grid" } },
  // Gestion du changement
  "ai-talent-roadmap":           { icon: GraduationCap,  label: { fr: "Stratégie talents IA",              en: "AI Talent Strategy" },                desc: { fr: "Équipe cible et parcours de développement",                        en: "Target team and development paths" } },
  "change-management-plan":      { icon: ArrowLeftRight, label: { fr: "Conduite du changement",             en: "Change Management Plan" },            desc: { fr: "Plan ADKAR pour déploiement IA",                                   en: "ADKAR plan for AI deployment" } },
  "ai-training-plan":            { icon: BookOpen,       label: { fr: "Plan de formation IA",              en: "AI Training Plan" },                  desc: { fr: "Formation et upskilling par rôle",                                 en: "Training and upskilling by role" } },
  "ai-impact-analysis":          { icon: BarChart3,      label: { fr: "Analyse d'impact",                  en: "Impact Analysis" },                   desc: { fr: "Impact processus, rôles, culture, KPIs",                           en: "Impact on processes, roles, culture, KPIs" } },
  "resistance-management-plan":  { icon: Shield,         label: { fr: "Gestion de la résistance",          en: "Resistance Management" },             desc: { fr: "Diagnostic et plan tactique résistance",                           en: "Diagnostic and tactical resistance plan" } },
  // Déploiement
  "copilot-deployment":          { icon: Rocket,         label: { fr: "Déploiement Copilot 365",           en: "Copilot 365 Deployment" },            desc: { fr: "Plan 4 phases Copilot 365",                                        en: "4-phase Copilot 365 plan" } },
};
