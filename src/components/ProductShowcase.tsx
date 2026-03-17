import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeftRight, Lightbulb, CheckCircle2, TrendingUp, Globe, Zap } from "lucide-react";
import { C, HDR_FONT } from "@/lib/constants";
import { useTheme } from "@/lib/contexts";
import { useReveal } from "@/hooks/useReveal";
import { useBi } from "@/hooks/useContent";

interface ProductCard {
  id: string;
  name: string;
  tagline: { fr: string; en: string };
  desc: { fr: string; en: string };
  icon: typeof ArrowLeftRight;
  gradient: string;
  accentColor: string;
  stats: { value: string; label: { fr: string; en: string } }[];
  features: { fr: string; en: string }[];

  cta: { fr: string; en: string };
}

const PRODUCTS: ProductCard[] = [
  {
    id: "transform",
    name: "Forge | Transform",
    tagline: { fr: "Réussissez chaque transformation", en: "Make every transformation succeed" },
    desc: {
      fr: "Vos projets de changement méritent mieux qu'un tableur et un plan de communication générique. Transform pilote chaque étape — de l'évaluation de préparation à l'adoption terrain — avec l'IA comme copilote et des tableaux de bord en temps réel.",
      en: "Your change projects deserve more than a spreadsheet and a generic comms plan. Transform guides every step — from readiness assessment to field adoption — with AI as copilot and real-time dashboards.",
    },
    icon: ArrowLeftRight,
    gradient: "linear-gradient(135deg, #06B6D4, #0891B2)",
    accentColor: "#22D3EE",
    stats: [
      { value: "70%", label: { fr: "Projets de changement échouent", en: "Change projects fail" } },
      { value: "3x", label: { fr: "Plus rapide qu'un plan manuel", en: "Faster than manual planning" } },
      { value: "100%", label: { fr: "Bilingue FR/EN natif", en: "Natively bilingual FR/EN" } },
    ],
    features: [
      { fr: "Score de préparation en temps réel par équipe", en: "Real-time readiness score per team" },
      { fr: "Prédiction de résistance alimentée par l'IA", en: "AI-powered resistance prediction" },
      { fr: "Communications bilingues générées automatiquement", en: "Auto-generated bilingual communications" },
      { fr: "Tableaux de bord d'adoption liés aux KPIs business", en: "Adoption dashboards linked to business KPIs" },
    ],
    cta: { fr: "Découvrir Transform", en: "Discover Transform" },
  },
  {
    id: "discover",
    name: "Forge | Discover",
    tagline: { fr: "Trouvez vos meilleurs cas d'usage IA", en: "Find your best AI use cases" },
    desc: {
      fr: "Arrêtez de deviner où l'IA peut vous aider. Discover analyse votre organisation, identifie les cas d'usage à fort impact et vous donne un plan d'action concret — en commençant par un quiz gratuit de 10 minutes.",
      en: "Stop guessing where AI can help. Discover analyzes your organization, identifies high-impact use cases, and gives you a concrete action plan — starting with a free 10-minute quiz.",
    },
    icon: Lightbulb,
    gradient: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
    accentColor: "#A78BFA",
    stats: [
      { value: "10 min", label: { fr: "Quiz gratuit pour commencer", en: "Free quiz to get started" } },
      { value: "50+", label: { fr: "Cas d'usage par industrie", en: "Use cases per industry" } },
      { value: "5x", label: { fr: "ROI moyen sur 12 mois", en: "Average ROI over 12 months" } },
    ],
    features: [
      { fr: "Quiz de maturité IA gratuit et instantané", en: "Free and instant AI maturity quiz" },
      { fr: "Cas d'usage matchés à votre industrie et contexte", en: "Use cases matched to your industry and context" },
      { fr: "Score de faisabilité et estimation de ROI automatiques", en: "Automatic feasibility score and ROI estimation" },
      { fr: "Cadre de gouvernance IA intégré dès le départ", en: "Built-in AI governance framework from day one" },
    ],
    cta: { fr: "Découvrir Discover", en: "Explore Discover" },
  },
];

export function ProductShowcase() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const bi = useBi();
  const ref = useReveal();

  return (
    <section id="products" className={`py-24 relative overflow-hidden ${dark ? "bg-gray-950" : "bg-white"}`}>
      {/* Decorative gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-[0.06] blur-[120px]" style={{ background: "#22D3EE" }} />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-[0.06] blur-[120px]" style={{ background: "#8B5CF6" }} />

      <div className="relative max-w-7xl mx-auto px-6">
        <div ref={ref} className="reveal text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4 border-0 rounded-full px-3 text-xs font-semibold" style={{ background: C.yellowLight, color: C.green }}>
            <Zap className="w-3 h-3 mr-1 inline" />
            {bi({ fr: "Produits phares", en: "Flagship products" })}
          </Badge>
          <h2 className={`text-4xl font-bold tracking-tight mb-4 ${dark ? "text-white" : ""}`} style={{ ...HDR_FONT, color: dark ? undefined : C.green }}>
            {bi({ fr: "Transformez plus vite.", en: "Transform faster." })}{" "}
            <span style={{ color: C.yellow }}>{bi({ fr: "Innovez plus intelligemment.", en: "Innovate smarter." })}</span>
          </h2>
          <p className={`text-lg leading-relaxed ${dark ? "text-white/45" : "text-gray-500"}`}>
            {bi({
              fr: "Deux produits conçus par 15 ans de terrain en transformation numérique. Bilingues par défaut, propulsés par l'IA, et pensés pour les entreprises qui veulent passer à l'action.",
              en: "Two products built from 15 years of hands-on digital transformation. Bilingual by default, AI-powered, and designed for organizations ready to take action.",
            })}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 reveal-stagger">
          {PRODUCTS.map((product) => {
            const Icon = product.icon;
            return (
              <div
                key={product.id}
                className={`reveal rounded-2xl overflow-hidden border transition-all duration-300 hover:translate-y-[-4px] hover:shadow-2xl ${
                  dark ? "bg-gray-900 border-white/5 hover:border-white/15" : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-xl"
                }`}
              >
                {/* Gradient header */}
                <div className="p-6 pb-5 relative" style={{ background: product.gradient }}>
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 0l10 10-10 10L0 10z' fill='white' fill-opacity='0.1'/%3E%3C/svg%3E\")" }} />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white" style={HDR_FONT}>{product.name}</h3>
                        <p className="text-xs text-white/70">{bi(product.tagline)}</p>
                      </div>
                    </div>
                    <p className="text-sm text-white/80 leading-relaxed">{bi(product.desc)}</p>
                  </div>
                </div>

                {/* Stats row */}
                <div className={`grid grid-cols-3 border-b ${dark ? "border-white/5" : "border-gray-100"}`}>
                  {product.stats.map((stat, i) => (
                    <div key={i} className={`p-4 text-center ${i < 2 ? (dark ? "border-r border-white/5" : "border-r border-gray-100") : ""}`}>
                      <div className="text-lg font-bold" style={{ ...HDR_FONT, color: product.accentColor }}>{stat.value}</div>
                      <div className={`text-[10px] mt-0.5 ${dark ? "text-white/30" : "text-gray-400"}`}>{bi(stat.label)}</div>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div className="p-6">
                  <div className="space-y-2.5 mb-6">
                    {product.features.map((f, i) => (
                      <div key={i} className={`flex items-center gap-2.5 text-sm ${dark ? "text-white/60" : "text-gray-600"}`}>
                        <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: product.accentColor }} />
                        {bi(f)}
                      </div>
                    ))}
                  </div>

                  {/* Trust callout */}
                  <div className={`rounded-xl p-3 mb-5 flex items-center gap-3 ${dark ? "bg-white/5" : "bg-gray-50"}`}>
                    <TrendingUp className="w-4 h-4 shrink-0" style={{ color: product.accentColor }} />
                    <div>
                      <span className={`text-xs font-semibold ${dark ? "text-white/70" : "text-gray-700"}`}>
                        {bi({ fr: "Conçu au Québec", en: "Built in Quebec" })}
                      </span>
                      <span className={`text-xs ml-1.5 ${dark ? "text-white/50" : "text-gray-500"}`}>
                        {bi({ fr: "· 100% bilingue · Conforme Loi 25", en: "· 100% bilingual · Bill 25 compliant" })}
                      </span>
                    </div>
                    <Globe className={`w-3.5 h-3.5 ml-auto ${dark ? "text-white/20" : "text-gray-300"}`} />
                  </div>

                  <a href="#marketplace">
                    <Button className="w-full rounded-full font-semibold hover:opacity-90 border-0 transition-opacity" style={{ background: product.gradient, color: "white" }}>
                      {bi(product.cta)} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Why clients trust us */}
        <div ref={ref} className="reveal mt-12 rounded-2xl p-8 relative overflow-hidden" style={{ background: dark ? "rgba(0,53,51,0.3)" : C.greenLight }}>
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-xl font-bold mb-3" style={{ ...HDR_FONT, color: dark ? "white" : C.green }}>
              {bi({ fr: "Pourquoi nos clients nous choisissent", en: "Why our clients choose us" })}
            </h3>
            <div className="grid sm:grid-cols-3 gap-6 mt-6">
              <div>
                <div className="text-2xl font-bold" style={{ ...HDR_FONT, color: C.yellow }}>15+</div>
                <p className={`text-xs mt-1 ${dark ? "text-white/50" : "text-gray-600"}`}>
                  {bi({ fr: "Années d'expertise terrain en transformation numérique", en: "Years of hands-on digital transformation expertise" })}
                </p>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ ...HDR_FONT, color: C.yellow }}>FR/EN</div>
                <p className={`text-xs mt-1 ${dark ? "text-white/50" : "text-gray-600"}`}>
                  {bi({ fr: "Plateforme 100% bilingue, conforme à la Loi 96 et Loi 25", en: "100% bilingual platform, compliant with Bill 96 and Bill 25" })}
                </p>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ ...HDR_FONT, color: C.yellow }}>B Corp</div>
                <p className={`text-xs mt-1 ${dark ? "text-white/50" : "text-gray-600"}`}>
                  {bi({ fr: "Certifié B Corp — technologie responsable et impact positif", en: "B Corp certified — responsible technology and positive impact" })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
