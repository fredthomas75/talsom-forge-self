import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, ArrowLeftRight, Gauge, Network, HeartPulse,
  MessageCircle, BarChart3, Scale, CheckCircle2, TrendingUp, Globe,
} from "lucide-react";
import { C, HDR_FONT } from "@/lib/constants";
import { useLang, useTheme } from "@/lib/contexts";

const TRANSFORM_TOOLS = [
  { command: "change-readiness-assessment", icon: Gauge, label: { fr: "Évaluation de préparation", en: "Readiness Assessment" }, desc: { fr: "Score de préparation quantifié avec capacité d'absorption organisationnelle", en: "Quantified readiness score with organizational absorption capacity" } },
  { command: "stakeholder-mapping", icon: Network, label: { fr: "Cartographie des parties prenantes", en: "Stakeholder Mapping" }, desc: { fr: "Cartes d'influence dynamiques avec identification des populations à risque", en: "Dynamic influence maps with at-risk population identification" } },
  { command: "resistance-prediction", icon: HeartPulse, label: { fr: "Prédiction de résistance", en: "Resistance Prediction" }, desc: { fr: "Modélisation prédictive des hotspots de résistance et courbes d'adoption", en: "Predictive modeling of resistance hotspots and adoption curves" } },
  { command: "change-communications", icon: MessageCircle, label: { fr: "Communications de changement", en: "Change Communications" }, desc: { fr: "Plan de communication bilingue par canal et segment", en: "Bilingual communication plan by channel and segment" } },
  { command: "adoption-dashboard", icon: BarChart3, label: { fr: "Tableau de bord d'adoption", en: "Adoption Dashboard" }, desc: { fr: "Métriques de changement liées aux KPIs opérationnels", en: "Change metrics linked to operational KPIs" } },
  { command: "change-saturation-analysis", icon: Scale, label: { fr: "Analyse de saturation", en: "Saturation Analysis" }, desc: { fr: "Détection de fatigue organisationnelle multi-changements", en: "Multi-change organizational fatigue detection" } },
];

const STATS = [
  { value: "$3.5B", label: { fr: "Marché mondial", en: "Global market" } },
  { value: "17%", label: { fr: "CAGR", en: "CAGR" } },
  { value: "48%", label: { fr: "Praticiens utilisant l'IA", en: "Practitioners using AI" } },
  { value: "$110M", label: { fr: "Marché Canada", en: "Canada market" } },
];

export function TransformPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const navigate = useNavigate();
  const bi = (v: { fr: string; en: string }) => (lang === "fr" ? v.fr : v.en);

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8">
      {/* Header with gradient */}
      <div className="rounded-2xl overflow-hidden mb-8" style={{ background: "linear-gradient(135deg, #06B6D4, #0891B2)" }}>
        <div className="p-8 relative">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 0l10 10-10 10L0 10z' fill='white' fill-opacity='0.1'/%3E%3C/svg%3E\")" }} />
          <div className="relative flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
              <ArrowLeftRight className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <Badge className="mb-2 bg-white/20 text-white border-white/30 rounded-full text-[10px] px-2.5">Product</Badge>
              <h1 className="text-3xl font-bold text-white mb-2" style={HDR_FONT}>Forge | Transform</h1>
              <p className="text-white/80 text-sm leading-relaxed max-w-2xl">
                {bi({
                  fr: "Plateforme complète de gestion du changement mid-market. Combinez méthodologie OCM, prédiction de résistance par IA, communications bilingues et tableaux de bord d'adoption — sans certification requise.",
                  en: "Complete mid-market change management platform. Combine OCM methodology, AI resistance prediction, bilingual communications, and adoption dashboards — no certification required.",
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

      {/* Key differentiators */}
      <div className={`rounded-xl p-5 mb-8 ${dark ? "bg-white/5" : "bg-cyan-50 border border-cyan-100"}`}>
        <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${dark ? "text-white" : "text-gray-900"}`}>
          <TrendingUp className="w-4 h-4" style={{ color: "#06B6D4" }} />
          {bi({ fr: "Pourquoi le marché est ouvert", en: "Why the market is wide open" })}
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { fr: "Aucune plateforme ne combine OCM + adoption numérique + analytique IA + prix mid-market", en: "No platform combines OCM + digital adoption + AI analytics + mid-market pricing" },
            { fr: "Gestion de portefeuille de changements et saturation organisationnelle reste manuelle", en: "Change portfolio and organizational saturation management remains manual" },
            { fr: "Génération de contenu bilingue avec adaptation culturelle québécoise — conformité Loi 96", en: "Bilingual content generation with Quebec cultural adaptation — Bill 96 compliance" },
            { fr: "Lien entre métriques d'adoption et KPIs business (productivité, tickets, roulement)", en: "Link between adoption metrics and business KPIs (productivity, tickets, turnover)" },
          ].map((gap, i) => (
            <div key={i} className={`flex items-start gap-2 text-xs ${dark ? "text-white/50" : "text-gray-600"}`}>
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "#06B6D4" }} />
              {bi(gap)}
            </div>
          ))}
        </div>
      </div>

      {/* Tools grid */}
      <div className="mb-4">
        <h2 className={`text-lg font-bold tracking-tight mb-1 ${dark ? "text-white" : "text-gray-900"}`} style={HDR_FONT}>
          {bi({ fr: "Outils Transform", en: "Transform Tools" })}
        </h2>
        <p className={`text-xs ${dark ? "text-white/30" : "text-gray-400"}`}>
          {bi({ fr: "6 outils spécialisés pour la gestion du changement", en: "6 specialized change management tools" })}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {TRANSFORM_TOOLS.map((tool) => (
          <Card
            key={tool.command}
            className={`cursor-pointer transition-all hover:shadow-md hover:scale-[1.01] rounded-xl border group ${
              dark ? "bg-gray-900 border-white/5 hover:border-white/10" : "border-gray-100 hover:border-gray-200"
            }`}
            onClick={() => navigate(`/client/tools/${tool.command}`)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${dark ? "bg-cyan-500/10 group-hover:bg-cyan-500/20" : "bg-cyan-50 group-hover:bg-cyan-100"}`}>
                  <tool.icon className="w-4 h-4" style={{ color: "#06B6D4" }} />
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

      {/* Competitive positioning */}
      <div className={`mt-8 rounded-xl border p-5 ${dark ? "border-white/5 bg-gray-900" : "border-gray-100 bg-white"}`}>
        <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${dark ? "text-white" : "text-gray-900"}`}>
          <Globe className="w-4 h-4" style={{ color: "#06B6D4" }} />
          {bi({ fr: "Positionnement vs concurrents", en: "Competitive positioning" })}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className={dark ? "text-white/40" : "text-gray-400"}>
                <th className="text-left py-2 pr-4 font-medium">{bi({ fr: "Concurrent", en: "Competitor" })}</th>
                <th className="text-left py-2 pr-4 font-medium">{bi({ fr: "Coût annuel", en: "Annual Cost" })}</th>
                <th className="text-left py-2 pr-4 font-medium">{bi({ fr: "Profondeur IA", en: "AI Depth" })}</th>
                <th className="text-left py-2 font-medium">{bi({ fr: "Changement humain", en: "People-Side Change" })}</th>
              </tr>
            </thead>
            <tbody className={dark ? "text-white/60" : "text-gray-600"}>
              {[
                ["Prosci Proxima", "$4,500+ (cert)", "Kaiya AI", "★★★★★"],
                ["WalkMe (SAP)", "$50K-$150K+", "WalkMeX", "★★☆☆☆"],
                ["Howspace", "Gratuit-$8,400", "Text analysis", "★★★★☆"],
                ["Forge | Transform", "$4,188-$17,988", "AI-first natif", "★★★★★"],
              ].map(([name, cost, ai, change], i) => (
                <tr key={i} className={`border-t ${i === 3 ? "font-semibold" : ""} ${dark ? "border-white/5" : "border-gray-100"}`} style={i === 3 ? { color: "#06B6D4" } : undefined}>
                  <td className="py-2 pr-4">{name}</td>
                  <td className="py-2 pr-4">{cost}</td>
                  <td className="py-2 pr-4">{ai}</td>
                  <td className="py-2">{change}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
