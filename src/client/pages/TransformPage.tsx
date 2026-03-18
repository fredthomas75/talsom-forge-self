import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight, ArrowLeftRight, Gauge, Network, HeartPulse,
  MessageCircle, BarChart3, Scale, CheckCircle2, Shield,
} from "lucide-react";
import { HDR_FONT, PRODUCT_COLORS } from "@/lib/constants";
import { useTheme } from "@/lib/contexts";
import { useBi } from "@/hooks/useContent";

const PC = PRODUCT_COLORS.transform;

const TRANSFORM_TOOLS = [
  { command: "change-readiness-assessment", icon: Gauge, label: { fr: "Évaluation de préparation", en: "Readiness Assessment" }, desc: { fr: "Mesurez la capacité de vos équipes à absorber le changement — score en temps réel par département", en: "Measure your teams' capacity to absorb change — real-time score per department" } },
  { command: "stakeholder-mapping", icon: Network, label: { fr: "Cartographie des parties prenantes", en: "Stakeholder Mapping" }, desc: { fr: "Identifiez vos champions et anticipez les résistances avec des cartes d'influence dynamiques", en: "Identify your champions and anticipate resistance with dynamic influence maps" } },
  { command: "resistance-prediction", icon: HeartPulse, label: { fr: "Prédiction de résistance", en: "Resistance Prediction" }, desc: { fr: "L'IA prédit où la résistance va émerger et recommande des interventions ciblées", en: "AI predicts where resistance will emerge and recommends targeted interventions" } },
  { command: "change-communications", icon: MessageCircle, label: { fr: "Communications de changement", en: "Change Communications" }, desc: { fr: "Générez des messages prêts-à-envoyer en FR et EN, adaptés par audience et phase", en: "Generate ready-to-send messages in FR and EN, tailored by audience and phase" } },
  { command: "adoption-dashboard", icon: BarChart3, label: { fr: "Tableau de bord d'adoption", en: "Adoption Dashboard" }, desc: { fr: "Suivez l'adoption en temps réel et reliez-la à vos KPIs business (productivité, satisfaction)", en: "Track adoption in real time and link it to your business KPIs (productivity, satisfaction)" } },
  { command: "change-saturation-analysis", icon: Scale, label: { fr: "Analyse de saturation", en: "Saturation Analysis" }, desc: { fr: "Détectez la fatigue organisationnelle avant qu'elle ne fasse dérailler vos projets", en: "Detect organizational fatigue before it derails your projects" } },
];

const STATS = [
  { value: "70%", label: { fr: "Des projets de changement échouent", en: "Of change projects fail" } },
  { value: "3x", label: { fr: "Plus rapide qu'un plan manuel", en: "Faster than manual planning" } },
  { value: "100%", label: { fr: "Bilingue FR/EN natif", en: "Natively bilingual FR/EN" } },
  { value: "6", label: { fr: "Outils IA spécialisés", en: "Specialized AI tools" } },
];

const BENEFITS = [
  { fr: "Pas besoin de certification — l'IA intègre la méthodologie OCM pour vous", en: "No certification needed — AI integrates OCM methodology for you" },
  { fr: "Communications bilingues FR/EN générées automatiquement, adaptées au Québec", en: "Bilingual FR/EN communications auto-generated, adapted for Quebec" },
  { fr: "Détection de saturation — sachez quand vos équipes sont en surcharge de changements", en: "Saturation detection — know when your teams are overloaded with changes" },
  { fr: "Métriques d'adoption reliées directement à vos KPIs business (productivité, rétention)", en: "Adoption metrics directly linked to your business KPIs (productivity, retention)" },
];

export function TransformPage() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const navigate = useNavigate();
  const bi = useBi();

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8">
      {/* Header with gradient */}
      <div className="rounded-2xl overflow-hidden mb-8" style={{ background: PC.gradient }}>
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
                  fr: "70% des projets de changement échouent. Transform vous donne les outils IA pour piloter chaque étape — évaluation de préparation, communications ciblées, suivi d'adoption — et faire partie des 30% qui réussissent.",
                  en: "70% of change projects fail. Transform gives you AI tools to guide every step — readiness assessment, targeted communications, adoption tracking — and be among the 30% that succeed.",
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

      {/* Why Transform is different */}
      <div className={`rounded-xl p-5 mb-8 ${dark ? "bg-white/5" : "bg-cyan-50 border border-cyan-100"}`}>
        <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${dark ? "text-white" : "text-gray-900"}`}>
          <Shield className="w-4 h-4" style={{ color: PC.primary }} />
          {bi({ fr: "Pourquoi Transform est différent", en: "Why Transform is different" })}
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {BENEFITS.map((benefit, i) => (
            <div key={i} className={`flex items-start gap-2 text-xs ${dark ? "text-white/50" : "text-gray-600"}`}>
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: PC.primary }} />
              {bi(benefit)}
            </div>
          ))}
        </div>
      </div>

      {/* Tools grid */}
      <div className="mb-4">
        <h2 className={`text-lg font-bold tracking-tight mb-1 ${dark ? "text-white" : "text-gray-900"}`} style={HDR_FONT}>
          {bi({ fr: "Vos outils Transform", en: "Your Transform Tools" })}
        </h2>
        <p className={`text-xs ${dark ? "text-white/30" : "text-gray-400"}`}>
          {bi({ fr: "6 outils IA pour réussir chaque projet de changement", en: "6 AI tools to make every change project succeed" })}
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
                  <tool.icon className="w-4 h-4" style={{ color: PC.primary }} />
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
    </div>
  );
}
