import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight, Lightbulb, Sparkles, Target, LineChart,
  Compass, FileSearch, CheckCircle2, Package, Zap,
} from "lucide-react";
import { HDR_FONT } from "@/lib/constants";
import { useLang, useTheme } from "@/lib/contexts";

const DISCOVER_TOOLS = [
  { command: "ai-readiness-quiz", icon: Sparkles, label: { fr: "Quiz maturité IA", en: "AI Readiness Quiz" }, desc: { fr: "10 minutes pour savoir où vous en êtes — score de maturité + 3 cas d'usage recommandés", en: "10 minutes to know where you stand — maturity score + 3 recommended use cases" } },
  { command: "ai-use-case-library", icon: Lightbulb, label: { fr: "Bibliothèque de cas d'usage", en: "Use Case Library" }, desc: { fr: "50+ cas d'usage matchés à votre industrie, fonction et niveau de maturité", en: "50+ use cases matched to your industry, function, and maturity level" } },
  { command: "ai-feasibility-scoring", icon: Target, label: { fr: "Scoring de faisabilité", en: "Feasibility Scoring" }, desc: { fr: "Séparez les vrais quick wins des faux amis — score sur 5 dimensions", en: "Separate real quick wins from false friends — score across 5 dimensions" } },
  { command: "ai-roi-estimation", icon: LineChart, label: { fr: "Estimation ROI", en: "ROI Estimation" }, desc: { fr: "Modélisation financière réaliste incluant les coûts que les autres oublient", en: "Realistic financial modeling including the costs others forget" } },
  { command: "ai-portfolio-dashboard", icon: Compass, label: { fr: "Portefeuille IA", en: "AI Portfolio" }, desc: { fr: "Vue d'ensemble de toutes vos initiatives IA, de la découverte au déploiement", en: "Overview of all your AI initiatives, from discovery to deployment" } },
  { command: "ai-governance-assessment", icon: FileSearch, label: { fr: "Évaluation gouvernance IA", en: "AI Governance Assessment" }, desc: { fr: "Évaluez les risques et la conformité Loi 25 avant de lancer chaque projet", en: "Assess risks and Bill 25 compliance before launching each project" } },
  { command: "ai-usecase-package", icon: Package, label: { fr: "Package cas d'usage IA", en: "AI Use Case Package" }, desc: { fr: "Transformez une idée brute en note technique + fiche professionnelle", en: "Transform a raw idea into a technical note + professional brief" } },
];

const STATS = [
  { value: "10 min", label: { fr: "Quiz gratuit pour commencer", en: "Free quiz to get started" } },
  { value: "50+", label: { fr: "Cas d'usage par industrie", en: "Use cases per industry" } },
  { value: "5x", label: { fr: "ROI moyen sur 12 mois", en: "Average ROI over 12 months" } },
  { value: "7", label: { fr: "Outils IA spécialisés", en: "Specialized AI tools" } },
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
                  fr: "Vous savez que l'IA peut transformer votre entreprise, mais par où commencer ? Discover vous guide du quiz gratuit au plan d'action concret — cas d'usage, faisabilité, ROI, gouvernance.",
                  en: "You know AI can transform your business, but where to start? Discover guides you from the free quiz to a concrete action plan — use cases, feasibility, ROI, governance.",
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

      {/* What Discover does for you */}
      <div className={`rounded-xl p-5 mb-8 ${dark ? "bg-white/5" : "bg-violet-50 border border-violet-100"}`}>
        <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${dark ? "text-white" : "text-gray-900"}`}>
          <Zap className="w-4 h-4" style={{ color: "#8B5CF6" }} />
          {bi({ fr: "Ce que Discover fait pour vous", en: "What Discover does for you" })}
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { fr: "Passez de \"l'IA c'est intéressant\" à un portefeuille priorisé de cas d'usage concrets", en: "Go from \"AI is interesting\" to a prioritized portfolio of concrete use cases" },
            { fr: "Chaque cas d'usage est évalué sur 5 dimensions avec un score de faisabilité clair", en: "Every use case is evaluated across 5 dimensions with a clear feasibility score" },
            { fr: "Modélisation ROI réaliste — incluant les coûts de données, inférence et supervision humaine", en: "Realistic ROI modeling — including data, inference, and human oversight costs" },
            { fr: "Gouvernance intégrée dès le départ — risques, conformité Loi 25, considérations éthiques", en: "Governance built in from day one — risks, Bill 25 compliance, ethical considerations" },
          ].map((benefit, i) => (
            <div key={i} className={`flex items-start gap-2 text-xs ${dark ? "text-white/50" : "text-gray-600"}`}>
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "#8B5CF6" }} />
              {bi(benefit)}
            </div>
          ))}
        </div>
      </div>

      {/* Tools grid */}
      <div className="mb-4">
        <h2 className={`text-lg font-bold tracking-tight mb-1 ${dark ? "text-white" : "text-gray-900"}`} style={HDR_FONT}>
          {bi({ fr: "Vos outils Discover", en: "Your Discover Tools" })}
        </h2>
        <p className={`text-xs ${dark ? "text-white/30" : "text-gray-400"}`}>
          {bi({ fr: "7 outils IA pour trouver et prioriser vos meilleurs cas d'usage", en: "7 AI tools to find and prioritize your best use cases" })}
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

      {/* Your journey */}
      <div className={`mt-8 rounded-xl border p-5 ${dark ? "border-white/5 bg-gray-900" : "border-gray-100 bg-white"}`}>
        <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${dark ? "text-white" : "text-gray-900"}`}>
          <Sparkles className="w-4 h-4" style={{ color: "#8B5CF6" }} />
          {bi({ fr: "Votre parcours", en: "Your journey" })}
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { step: "1", title: { fr: "Commencez gratuitement", en: "Start for free" }, desc: { fr: "Le Quiz de maturité IA vous donne un score et 3 cas d'usage recommandés en 10 minutes.", en: "The AI Maturity Quiz gives you a score and 3 recommended use cases in 10 minutes." } },
            { step: "2", title: { fr: "Explorez et priorisez", en: "Explore and prioritize" }, desc: { fr: "Accédez à la bibliothèque complète, scorez la faisabilité et estimez le ROI de chaque cas.", en: "Access the full library, score feasibility, and estimate ROI for each case." } },
            { step: "3", title: { fr: "Passez à l'action", en: "Take action" }, desc: { fr: "Générez un package professionnel par cas d'usage et faites-le valider par un expert Talsom.", en: "Generate a professional package per use case and have it validated by a Talsom expert." } },
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
