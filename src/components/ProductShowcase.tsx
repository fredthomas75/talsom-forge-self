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
  marketSize: string;
  cta: { fr: string; en: string };
}

const PRODUCTS: ProductCard[] = [
  {
    id: "transform",
    name: "Forge | Transform",
    tagline: { fr: "Gestion du changement mid-market", en: "Mid-market change management" },
    desc: {
      fr: "Le marché de $3.5B de la gestion du changement a un trou béant au milieu. Aucune plateforme ne combine méthodologie OCM, guidance d'adoption numérique, analytique AI et tarification transparente pour le mid-market.",
      en: "The $3.5B change management market has a gaping mid-market hole. No platform combines OCM methodology, digital adoption guidance, AI analytics, and transparent mid-market pricing.",
    },
    icon: ArrowLeftRight,
    gradient: "linear-gradient(135deg, #06B6D4, #0891B2)",
    accentColor: "#22D3EE",
    stats: [
      { value: "$3.5B", label: { fr: "Marché mondial", en: "Global market" } },
      { value: "17%", label: { fr: "CAGR projeté", en: "Projected CAGR" } },
      { value: "48%", label: { fr: "Praticiens utilisant l'IA", en: "Practitioners using AI" } },
    ],
    features: [
      { fr: "Évaluation de préparation au changement", en: "Change readiness assessment engine" },
      { fr: "Prédiction de résistance par IA", en: "AI-driven resistance prediction" },
      { fr: "Communications bilingues automatisées", en: "Automated bilingual communications" },
      { fr: "Tableaux de bord d'adoption → KPIs business", en: "Adoption dashboards → Business KPIs" },
    ],
    marketSize: "$110M",
    cta: { fr: "Découvrir Transform", en: "Discover Transform" },
  },
  {
    id: "discover",
    name: "Forge | Discover",
    tagline: { fr: "Découverte de cas d'usage IA", en: "AI use case discovery" },
    desc: {
      fr: "88% des organisations utilisent l'IA mais seulement 23% ont une stratégie formelle. Aucun produit SaaS self-service dominant n'existe pour la découverte systématique de cas d'usage IA — un marché \"Catégorie 0\".",
      en: "88% of organizations use AI but only 23% have a formal strategy. No dominant self-service SaaS product exists for systematic AI use case discovery — a \"Category 0\" market.",
    },
    icon: Lightbulb,
    gradient: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
    accentColor: "#A78BFA",
    stats: [
      { value: "$307B", label: { fr: "Dépenses IA 2025", en: "AI spending 2025" } },
      { value: "88%", label: { fr: "Organisations utilisant l'IA", en: "Organizations using AI" } },
      { value: "40%", label: { fr: "Projets IA annulés d'ici 2027", en: "AI projects cancelled by 2027" } },
    ],
    features: [
      { fr: "Évaluation de maturité IA gratuite", en: "Free AI maturity assessment" },
      { fr: "Bibliothèque de cas d'usage par industrie", en: "Industry-specific use case library" },
      { fr: "Scoring de faisabilité et ROI", en: "Feasibility & ROI scoring" },
      { fr: "Gouvernance IA intégrée", en: "Integrated AI governance" },
    ],
    marketSize: "$500M-$1B",
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
            {bi({ fr: "Deux produits pour deux marchés", en: "Two products for two markets" })}{" "}
            <span style={{ color: C.yellow }}>{bi({ fr: "sans leader dominant", en: "with no dominant player" })}</span>
          </h2>
          <p className={`text-lg leading-relaxed ${dark ? "text-white/45" : "text-gray-500"}`}>
            {bi({
              fr: "Talsom occupe une intersection rare — 15 ans d'IP consulting, opérations bilingues, crédibilité B Corp et plateforme IA pré-lancement — pour bâtir deux produits SaaS dans des marchés où aucun joueur ne domine.",
              en: "Talsom sits at a rare intersection — 15 years of consulting IP, bilingual operations, B Corp credibility, and a pre-launch AI platform — to build two SaaS products in markets where no player dominates.",
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

                  {/* Market opportunity callout */}
                  <div className={`rounded-xl p-3 mb-5 flex items-center gap-3 ${dark ? "bg-white/5" : "bg-gray-50"}`}>
                    <TrendingUp className="w-4 h-4 shrink-0" style={{ color: product.accentColor }} />
                    <div>
                      <span className={`text-xs font-semibold ${dark ? "text-white/70" : "text-gray-700"}`}>
                        {bi({ fr: "Marché adressable Canada", en: "Canada addressable market" })}:
                      </span>
                      <span className="text-xs font-bold ml-1.5" style={{ color: product.accentColor }}>{product.marketSize}</span>
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

        {/* Quebec advantage callout */}
        <div ref={ref} className="reveal mt-12 rounded-2xl p-8 relative overflow-hidden" style={{ background: dark ? "rgba(0,53,51,0.3)" : C.greenLight }}>
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-xl font-bold mb-3" style={{ ...HDR_FONT, color: dark ? "white" : C.green }}>
              {bi({ fr: "Le Québec comme tête de pont défendable", en: "Quebec as a defensible beachhead" })}
            </h3>
            <div className="grid sm:grid-cols-3 gap-6 mt-6">
              <div>
                <div className="text-2xl font-bold" style={{ ...HDR_FONT, color: C.yellow }}>
                  {bi({ fr: "Loi 96", en: "Bill 96" })}
                </div>
                <p className={`text-xs mt-1 ${dark ? "text-white/50" : "text-gray-600"}`}>
                  {bi({ fr: "Fossé de conformité : interfaces FR obligatoires pour les entreprises 25+ employés", en: "Compliance moat: mandatory FR interfaces for 25+ employee companies" })}
                </p>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ ...HDR_FONT, color: C.yellow }}>$900M</div>
                <p className={`text-xs mt-1 ${dark ? "text-white/50" : "text-gray-600"}`}>
                  {bi({ fr: "Budget QC 2025 pour l'automatisation, l'IA et la transformation numérique", en: "QC 2025 budget for automation, AI, and digital transformation" })}
                </p>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ ...HDR_FONT, color: C.yellow }}>14K+</div>
                <p className={`text-xs mt-1 ${dark ? "text-white/50" : "text-gray-600"}`}>
                  {bi({ fr: "Entreprises mid-market QC+ON (100-2000 employés)", en: "Mid-market enterprises QC+ON (100-2000 employees)" })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
