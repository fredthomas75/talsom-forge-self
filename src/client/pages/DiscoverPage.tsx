import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight, Lightbulb, Sparkles, Target, LineChart,
  Compass, FileSearch, CheckCircle2, TrendingUp, Globe, Package,
} from "lucide-react";
import { HDR_FONT } from "@/lib/constants";
import { useLang, useTheme } from "@/lib/contexts";

const DISCOVER_TOOLS = [
  { command: "ai-readiness-quiz", icon: Sparkles, label: { fr: "Quiz maturité IA", en: "AI Readiness Quiz" }, desc: { fr: "Évaluation 10 minutes avec score de maturité et 3 suggestions de cas d'usage", en: "10-minute assessment with maturity score and 3 use case suggestions" } },
  { command: "ai-use-case-library", icon: Lightbulb, label: { fr: "Bibliothèque de cas d'usage", en: "Use Case Library" }, desc: { fr: "50+ cas d'usage par industrie matchés au contexte spécifique du client", en: "50+ use cases per industry matched to client-specific context" } },
  { command: "ai-feasibility-scoring", icon: Target, label: { fr: "Scoring de faisabilité", en: "Feasibility Scoring" }, desc: { fr: "Évaluation 5 dimensions : données, complexité, infra, organisation, réglementaire", en: "5-dimension evaluation: data, complexity, infra, organization, regulatory" } },
  { command: "ai-roi-estimation", icon: LineChart, label: { fr: "Estimation ROI", en: "ROI Estimation" }, desc: { fr: "Modélisation ROI incluant coûts de données, inférence et HITL", en: "ROI modeling including data prep costs, inference, and HITL" } },
  { command: "ai-portfolio-dashboard", icon: Compass, label: { fr: "Portefeuille IA", en: "AI Portfolio" }, desc: { fr: "Suivi des initiatives de la découverte au déploiement", en: "Initiative tracking from discovery to deployment" } },
  { command: "ai-governance-assessment", icon: FileSearch, label: { fr: "Évaluation gouvernance IA", en: "AI Governance Assessment" }, desc: { fr: "Risques, conformité Loi 25 et considérations éthiques par cas d'usage", en: "Risks, Bill 25 compliance, and ethical considerations per use case" } },
  { command: "ai-usecase-package", icon: Package, label: { fr: "Package cas d'usage IA", en: "AI Use Case Package" }, desc: { fr: "Note technique + fiche professionnelle à partir d'un cas d'usage brut", en: "Technical note + professional brief from raw use case input" } },
];

const STATS = [
  { value: "$307B", label: { fr: "Dépenses IA 2025", en: "AI spending 2025" } },
  { value: "88%", label: { fr: "Organisations utilisant l'IA", en: "Orgs using AI" } },
  { value: "23%", label: { fr: "Avec stratégie formelle", en: "With formal strategy" } },
  { value: "40%", label: { fr: "Projets IA annulés d'ici 2027", en: "AI projects cancelled by 2027" } },
];

export function DiscoverPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const navigate = useNavigate();
  const bi = (v: { fr: string; en: string }) => (lang === "fr" ? v.fr : v.en);

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8">
      {/* Header with gradient */}
      <div className="rounded-2xl overflow-hidden mb-8" style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)" }}>
        <div className="p-8 relative">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 0l10 10-10 10L0 10z' fill='white' fill-opacity='0.1'/%3E%3C/svg%3E\")" }} />
          <div className="relative flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
              <Lightbulb className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <Badge className="mb-2 bg-white/20 text-white border-white/30 rounded-full text-[10px] px-2.5">Product</Badge>
              <h1 className="text-3xl font-bold text-white mb-2" style={HDR_FONT}>Forge | Discover</h1>
              <p className="text-white/80 text-sm leading-relaxed max-w-2xl">
                {bi({
                  fr: "Productisez ce que les firmes de conseil vendent pour six chiffres. Évaluation de maturité IA, bibliothèque de cas d'usage par industrie, scoring de faisabilité et ROI — accessible au mid-market.",
                  en: "Productize what consulting firms sell for six figures. AI maturity assessment, industry use case library, feasibility & ROI scoring — accessible to mid-market.",
                })}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            {STATS.map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <div className="text-lg font-bold text-white" style={HDR_FONT}>{s.value}</div>
                <div className="text-[10px] text-white/60">{bi(s.label)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market opportunity */}
      <div className={`rounded-xl p-5 mb-8 ${dark ? "bg-white/5" : "bg-violet-50 border border-violet-100"}`}>
        <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${dark ? "text-white" : "text-gray-900"}`}>
          <TrendingUp className="w-4 h-4" style={{ color: "#8B5CF6" }} />
          {bi({ fr: "Un marché \"Catégorie 0\" sans leader", en: "A \"Category 0\" market with no leader" })}
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { fr: "Aucun produit SaaS self-service pour la découverte systématique de cas d'usage IA", en: "No self-service SaaS product for systematic AI use case discovery" },
            { fr: "Les outils de consulting sont verrouillés derrière des mandats à $50K-$250K", en: "Consulting tools are locked behind $50K-$250K engagements" },
            { fr: "Les plateformes AI/ML (Dataiku, DataRobot) ne font pas de découverte", en: "AI/ML platforms (Dataiku, DataRobot) don't do discovery" },
            { fr: "Bibliothèques de cas d'usage par industrie accessibles seulement chez Gartner ($30K+) ou McKinsey ($100K+)", en: "Industry use case libraries only accessible at Gartner ($30K+) or McKinsey ($100K+)" },
          ].map((gap, i) => (
            <div key={i} className={`flex items-start gap-2 text-xs ${dark ? "text-white/50" : "text-gray-600"}`}>
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "#8B5CF6" }} />
              {bi(gap)}
            </div>
          ))}
        </div>
      </div>

      {/* Tools grid */}
      <div className="mb-4">
        <h2 className={`text-lg font-bold tracking-tight mb-1 ${dark ? "text-white" : "text-gray-900"}`} style={HDR_FONT}>
          {bi({ fr: "Outils Discover", en: "Discover Tools" })}
        </h2>
        <p className={`text-xs ${dark ? "text-white/30" : "text-gray-400"}`}>
          {bi({ fr: "6 outils spécialisés pour la découverte et priorisation de cas d'usage IA", en: "6 specialized tools for AI use case discovery and prioritization" })}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {DISCOVER_TOOLS.map((tool) => (
          <Card
            key={tool.command}
            className={`cursor-pointer transition-all hover:shadow-md hover:scale-[1.01] rounded-xl border group ${
              dark ? "bg-gray-900 border-white/5 hover:border-white/10" : "border-gray-100 hover:border-gray-200"
            }`}
            onClick={() => navigate(`/client/tools/${tool.command}`)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${dark ? "bg-violet-500/10 group-hover:bg-violet-500/20" : "bg-violet-50 group-hover:bg-violet-100"}`}>
                  <tool.icon className="w-4 h-4" style={{ color: "#8B5CF6" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-900"}`}>
                    {bi(tool.label)}
                  </CardTitle>
                </div>
                <ArrowRight className={`w-4 h-4 opacity-0 group-hover:opacity-50 transition-all group-hover:translate-x-0.5 ${dark ? "text-white" : "text-gray-400"}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className={`text-xs leading-relaxed ${dark ? "text-white/40" : "text-gray-500"}`}>
                {bi(tool.desc)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Funnel callout */}
      <div className={`mt-8 rounded-xl border p-5 ${dark ? "border-white/5 bg-gray-900" : "border-gray-100 bg-white"}`}>
        <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${dark ? "text-white" : "text-gray-900"}`}>
          <Globe className="w-4 h-4" style={{ color: "#8B5CF6" }} />
          {bi({ fr: "L'entonnoir de conversion", en: "The conversion funnel" })}
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { step: "1", title: { fr: "Évaluation gratuite", en: "Free assessment" }, desc: { fr: "Quiz maturité IA → score + 3 cas d'usage. 5,000-10,000 complétions/an au Canada.", en: "AI maturity quiz → score + 3 use cases. 5,000-10,000 completions/year in Canada." } },
            { step: "2", title: { fr: "Plateforme payante", en: "Paid platform" }, desc: { fr: "Accès complet à la bibliothèque, scoring ROI, portefeuille IA. ACV moyen $15,000.", en: "Full library access, ROI scoring, AI portfolio. Average ACV $15,000." } },
            { step: "3", title: { fr: "Crédits consulting", en: "Consulting credits" }, desc: { fr: "Revue par un stratégiste IA Talsom. +40-60% de revenus additionnels.", en: "Review by a Talsom AI strategist. +40-60% additional revenue." } },
          ].map((item) => (
            <div key={item.step} className={`rounded-xl p-4 ${dark ? "bg-white/5" : "bg-gray-50"}`}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-2" style={{ background: "#8B5CF6", color: "white" }}>{item.step}</div>
              <p className={`text-xs font-semibold mb-1 ${dark ? "text-white" : "text-gray-900"}`}>{bi(item.title)}</p>
              <p className={`text-[11px] leading-relaxed ${dark ? "text-white/40" : "text-gray-500"}`}>{bi(item.desc)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
