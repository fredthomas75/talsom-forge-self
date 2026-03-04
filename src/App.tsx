import { useState, useRef, useEffect, createContext, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  Brain,
  Shield,
  BarChart3,
  Users,
  Sparkles,
  ChevronRight,
  Send,
  Bot,
  MapPin,
  Zap,
  Target,
  Lock,
  BookOpen,
  CheckCircle2,
  ArrowUpRight,
  Menu,
  X,
  Globe,
  TrendingUp,
  MessageSquare,
  ChevronsRight,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════
   Talsom brand tokens — Charte Graphique 2024
   ═══════════════════════════════════════════════════════ */

const C = {
  green: "#003533",
  greenMid: "#00524F",
  greenLight: "#E6EDEC",
  yellow: "#FDF100",
  yellowDark: "#D4CC00",
  yellowLight: "#FEFCE8",
  silver: "#D2D9D9",
  silverLight: "#F0F3F3",
};

const HDR_FONT = { fontFamily: "'Space Grotesk', Arial, sans-serif" };

// ─── I18N ────────────────────────────────────────────

type Lang = "fr" | "en";
const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "fr", setLang: () => {} });
const useLang = () => useContext(LangContext);

/* Helper: pick value by lang */
function t(lang: Lang, fr: string, en: string) { return lang === "fr" ? fr : en; }

// ─── BILINGUAL DATA ─────────────────────────────────

function getServices(lang: Lang) {
  return [
    { id: "roadmap", icon: MapPin, title: "AI Roadmap", subtitle: t(lang, "Feuille de route stratégique", "Strategic roadmap"), desc: t(lang, "Définissez votre trajectoire de transformation AI avec une roadmap personnalisée, priorisée et alignée sur vos objectifs d'affaires.", "Define your AI transformation trajectory with a personalized, prioritized roadmap aligned with your business goals."), tags: t(lang, "Stratégie,Priorisation,12 semaines", "Strategy,Prioritization,12 weeks").split(","), price: t(lang, "À partir de 15 000$", "Starting at $15,000"), popular: true },
    { id: "maturity", icon: BarChart3, title: "AI Maturity Assessment", subtitle: t(lang, "Diagnostic de maturité", "Maturity diagnostic"), desc: t(lang, "Évaluez votre niveau de préparation AI à travers 6 dimensions clés : stratégie, données, technologie, talents, gouvernance et culture.", "Assess your AI readiness across 6 key dimensions: strategy, data, technology, talent, governance, and culture."), tags: t(lang, "Diagnostic,Benchmark,4 semaines", "Diagnostic,Benchmark,4 weeks").split(","), price: t(lang, "À partir de 8 000$", "Starting at $8,000"), popular: false },
    { id: "governance", icon: Shield, title: "AI Governance", subtitle: t(lang, "Cadre de gouvernance IA", "AI governance framework"), desc: t(lang, "Implantez un cadre de gouvernance AI responsable incluant politiques, RACI, comités et conformité réglementaire (Loi 25, EU AI Act).", "Implement a responsible AI governance framework including policies, RACI, committees, and regulatory compliance (Bill 25, EU AI Act)."), tags: t(lang, "Conformité,Éthique,8 semaines", "Compliance,Ethics,8 weeks").split(","), price: t(lang, "À partir de 12 000$", "Starting at $12,000"), popular: false },
    { id: "copilot", icon: Sparkles, title: "Copilot 365 Deployment", subtitle: t(lang, "Déploiement Microsoft Copilot", "Microsoft Copilot deployment"), desc: t(lang, "Accélérez l'adoption de Microsoft 365 Copilot avec un plan de déploiement structuré, de la préparation des données à la gestion du changement.", "Accelerate Microsoft 365 Copilot adoption with a structured deployment plan, from data preparation to change management."), tags: t(lang, "Microsoft,Adoption,10 semaines", "Microsoft,Adoption,10 weeks").split(","), price: t(lang, "À partir de 20 000$", "Starting at $20,000"), popular: true },
    { id: "business-case", icon: TrendingUp, title: "AI Business Case", subtitle: t(lang, "Analyse de rentabilité", "ROI analysis"), desc: t(lang, "Construisez un dossier d'affaires solide avec analyse ROI, projection de valeur et cadre de mesure pour justifier vos investissements AI.", "Build a solid business case with ROI analysis, value projection, and measurement framework to justify your AI investments."), tags: t(lang, "ROI,Valeur,3 semaines", "ROI,Value,3 weeks").split(","), price: t(lang, "À partir de 6 000$", "Starting at $6,000"), popular: false },
    { id: "change", icon: Users, title: "Change Management AI", subtitle: t(lang, "Conduite du changement", "Change management"), desc: t(lang, "Assurez l'adoption réussie de vos initiatives AI avec un plan de changement complet : communication, formation, résistance et mesure.", "Ensure successful adoption of your AI initiatives with a comprehensive change plan: communication, training, resistance management, and measurement."), tags: t(lang, "Adoption,Formation,Continu", "Adoption,Training,Ongoing").split(","), price: t(lang, "À partir de 10 000$", "Starting at $10,000"), popular: false },
  ];
}

function getMarketplace(lang: Lang) {
  return [
    { id: "hub", name: "Talsom Forge Hub", tagline: t(lang, "Plateforme de consulting virtuel", "Virtual consulting platform"), desc: t(lang, "Suite complète d'outils AI pour le consulting : diagnostics automatisés, génération de livrables, chat spécialisé et tableaux de bord.", "Complete AI tool suite for consulting: automated diagnostics, deliverable generation, specialized chat, and dashboards."), features: t(lang, "Diagnostics AI,Génération de rapports,Chat expert,Tableaux de bord", "AI Diagnostics,Report Generation,Expert Chat,Dashboards").split(","), tier: "Platform", badgeCls: "bg-[#FDF100]/15 text-[#FDF100] border-[#FDF100]/25" },
    { id: "backlog", name: "AI Backlog Manager", tagline: t(lang, "Gestion de portefeuille de cas d'usage", "Use case portfolio management"), desc: t(lang, "Identifiez, priorisez et suivez vos cas d'usage AI avec un framework de scoring et des vues portefeuille intelligentes.", "Identify, prioritize, and track your AI use cases with a scoring framework and intelligent portfolio views."), features: t(lang, "Scoring multicritère,Vues portefeuille,Suivi ROI,Collaboration", "Multi-criteria Scoring,Portfolio Views,ROI Tracking,Collaboration").split(","), tier: "Tool", badgeCls: "bg-emerald-400/15 text-emerald-300 border-emerald-400/25" },
    { id: "pia", name: "Privacy Impact Assessor", tagline: t(lang, "EFVP automatisée Loi 25", "Automated Bill 25 PIA"), desc: t(lang, "Générez des évaluations des facteurs relatifs à la vie privée conformes à la Loi 25 pour vos projets AI en quelques minutes.", "Generate privacy impact assessments compliant with Bill 25 for your AI projects in minutes."), features: t(lang, "Conformité Loi 25,Rapport automatisé,Registre des risques,Suivi", "Bill 25 Compliance,Automated Reports,Risk Registry,Tracking").split(","), tier: "Tool", badgeCls: "bg-amber-400/15 text-amber-300 border-amber-400/25" },
    { id: "governance-tool", name: "AI Governance Suite", tagline: t(lang, "Gouvernance AI clé en main", "Turnkey AI governance"), desc: t(lang, "Cadre de gouvernance complet avec modèles de politiques, matrices RACI, registres de modèles et tableaux de bord de conformité.", "Complete governance framework with policy templates, RACI matrices, model registries, and compliance dashboards."), features: t(lang, "Politiques AI,RACI automatisé,Registre de modèles,Audit trail", "AI Policies,Automated RACI,Model Registry,Audit Trail").split(","), tier: "Suite", badgeCls: "bg-[#D2D9D9]/15 text-[#D2D9D9] border-[#D2D9D9]/25" },
  ];
}

function getChatExchanges(lang: Lang): { user: string; assistant: string }[] {
  if (lang === "en") return [
    {
      user: "I want to deploy Microsoft Copilot in my 500-person organization. Where do I start?",
      assistant: "Great choice! For a Copilot 365 deployment at this scale, I recommend a 4-phase approach:\n\n1. **Readiness assessment** — Audit your M365 environment, SharePoint/OneDrive data quality, current licenses\n2. **Targeted pilot** — 50 power users over 4-6 weeks\n3. **Progressive rollout** — Waves of 100-150 users with tailored training\n4. **Continuous optimization** — Adoption measurement, prompt tuning, best practices\n\nWould you like me to generate a detailed deployment plan with timeline and budget estimate?",
    },
    {
      user: "Yes, generate the full plan with budget estimate.",
      assistant: "I'm preparing your Copilot 365 deployment plan. Here's an overview:\n\n**Plan generated** — Copilot365_Deployment_Talsom.pdf\n\n**Estimated budget:**\n→ Copilot licenses (500 users): ~$450,000/year\n→ Talsom support: $45,000\n→ Training & change management: $25,000\n→ **Year 1 total: ~$520,000**\n\n**Projected ROI:** Productivity gain of 8-12h/month/user, estimated 2.1x return over 18 months.\n\nThe document is ready. Would you also like the risk analysis and change management plan?",
    },
    {
      user: "Yes, include the risk analysis.",
      assistant: "Here are the key risks identified for your deployment:\n\n**High risks:**\n→ Insufficient SharePoint data quality — **mitigation:** pre-deployment audit and cleanup\n→ Team resistance to change — **mitigation:** department ambassadors + targeted training\n\n**Moderate risks:**\n→ License budget overrun — **mitigation:** measured pilot before annual commitment\n→ Microsoft vendor dependency — **mitigation:** multi-cloud governance\n\nI can generate the full report with risk matrix and mitigation plan. Would you like to receive it as PDF?",
    },
  ];
  return [
    {
      user: "Je veux déployer Microsoft Copilot dans mon organisation de 500 personnes. Par où commencer?",
      assistant: "Excellent choix! Pour un déploiement Copilot 365 à cette échelle, je recommande une approche en 4 phases :\n\n1. **Évaluation de préparation** — Audit de votre environnement M365, qualité des données SharePoint/OneDrive, licences actuelles\n2. **Pilote ciblé** — 50 utilisateurs power-users sur 4-6 semaines\n3. **Déploiement progressif** — Vagues de 100-150 utilisateurs avec formation adaptée\n4. **Optimisation continue** — Mesure d'adoption, ajustement des prompts, bonnes pratiques\n\nVoulez-vous que je génère un plan de déploiement détaillé avec échéancier et budget estimé?",
    },
    {
      user: "Oui, génère-moi le plan complet avec l'estimation budgétaire.",
      assistant: "Je prépare votre plan de déploiement Copilot 365. Voici un aperçu :\n\n**Plan généré** — Copilot365_Deployment_Talsom.pdf\n\n**Budget estimé :**\n→ Licences Copilot (500 users) : ~450 000$ /an\n→ Accompagnement Talsom : 45 000$\n→ Formation & change management : 25 000$\n→ **Total Année 1 : ~520 000$**\n\n**ROI projeté :** Gain de productivité de 8-12h/mois/utilisateur, retour estimé de 2.1x sur 18 mois.\n\nLe document est prêt. Voulez-vous aussi l'analyse de risques et le plan de gestion du changement?",
    },
    {
      user: "Oui, inclus l'analyse de risques.",
      assistant: "Voici les principaux risques identifiés pour votre déploiement :\n\n**Risques élevés :**\n→ Qualité des données SharePoint insuffisante — **mitigation :** audit et nettoyage pré-déploiement\n→ Résistance au changement des équipes — **mitigation :** ambassadeurs par département + formation ciblée\n\n**Risques modérés :**\n→ Dépassement de budget licences — **mitigation :** pilote mesuré avant engagement annuel\n→ Dépendance fournisseur Microsoft — **mitigation :** gouvernance multi-cloud\n\nJe peux générer le rapport complet avec matrice de risques et plan de mitigation. Souhaitez-vous le recevoir en PDF?",
    },
  ];
}

function getStats(lang: Lang) {
  return [
    { value: "150+", label: t(lang, "Projets AI livrés", "AI projects delivered") },
    { value: "42", label: t(lang, "Clients actifs", "Active clients") },
    { value: "8.5x", label: t(lang, "ROI moyen", "Average ROI") },
    { value: "96%", label: t(lang, "Satisfaction client", "Client satisfaction") },
  ];
}

function getPlans(lang: Lang) {
  return [
    { name: "Explorer", price: t(lang, "Gratuit", "Free"), sub: t(lang, "Pour découvrir", "To explore"), features: [t(lang, "Chat AI (10 messages/mois)", "AI Chat (10 messages/month)"), t(lang, "1 diagnostic de maturité", "1 maturity diagnostic"), t(lang, "Accès marketplace (lecture)", "Marketplace access (read-only)"), t(lang, "Support communautaire", "Community support")], cta: t(lang, "Commencer gratuitement", "Start for free"), highlight: false },
    { name: "Professional", price: t(lang, "990$/mois", "$990/month"), sub: t(lang, "Pour les équipes", "For teams"), features: [t(lang, "Chat AI illimité", "Unlimited AI Chat"), t(lang, "Tous les diagnostics", "All diagnostics"), t(lang, "Génération de livrables", "Deliverable generation"), t(lang, "5 services virtuels/mois", "5 virtual services/month"), t(lang, "Support prioritaire", "Priority support"), t(lang, "Intégration Microsoft 365", "Microsoft 365 integration")], cta: t(lang, "Essai gratuit 14 jours", "Free 14-day trial"), highlight: true },
    { name: "Enterprise", price: t(lang, "Sur mesure", "Custom"), sub: t(lang, "Pour les grandes organisations", "For large organizations"), features: [t(lang, "Tout Professional +", "Everything in Professional +"), t(lang, "Consultants dédiés", "Dedicated consultants"), t(lang, "Personnalisation complète", "Full customization"), t(lang, "SLA garanti", "Guaranteed SLA"), t(lang, "Formation sur site", "On-site training"), "API & integrations"], cta: t(lang, "Contactez-nous", "Contact us"), highlight: false },
  ];
}

// ─── NAV ─────────────────────────────────────────────

function Nav() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = lang === "fr"
    ? [{ label: "Services", href: "#services" }, { label: "Marketplace", href: "#marketplace" }, { label: "AI Chat", href: "#ai-chat" }, { label: "Tarification", href: "#tarification" }]
    : [{ label: "Services", href: "#services" }, { label: "Marketplace", href: "#marketplace" }, { label: "AI Chat", href: "#ai-chat" }, { label: "Pricing", href: "#tarification" }];

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-lg shadow-sm border-b" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.green }}>
            <Brain className="w-5 h-5" style={{ color: C.yellow }} />
          </div>
          <span className={`font-semibold text-lg tracking-tight ${scrolled ? "text-gray-900" : "text-white"}`} style={HDR_FONT}>
            Talsom<span className="font-light opacity-70">Forge</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.label} href={l.href} className={`text-sm font-medium transition-colors ${scrolled ? "text-gray-500 hover:text-gray-900" : "text-white/60 hover:text-white"}`}>
              {l.label}
            </a>
          ))}

          {/* Language toggle */}
          <div className={`flex items-center gap-0.5 text-xs font-semibold rounded-full border px-1 py-0.5 ${scrolled ? "border-gray-200" : "border-white/15"}`}>
            <button onClick={() => setLang("fr")} className={`px-2 py-0.5 rounded-full transition-all ${lang === "fr" ? "text-white" : scrolled ? "text-gray-400 hover:text-gray-600" : "text-white/40 hover:text-white/70"}`} style={lang === "fr" ? { background: C.green } : undefined}>FR</button>
            <button onClick={() => setLang("en")} className={`px-2 py-0.5 rounded-full transition-all ${lang === "en" ? "text-white" : scrolled ? "text-gray-400 hover:text-gray-600" : "text-white/40 hover:text-white/70"}`} style={lang === "en" ? { background: C.green } : undefined}>EN</button>
          </div>

          <Button size="sm" className="rounded-full px-5 font-semibold border-0 hover:opacity-90" style={{ background: C.yellow, color: C.green }}>
            {t(lang, "Démo gratuite", "Free demo")}
          </Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label={open ? t(lang, "Fermer le menu", "Close menu") : t(lang, "Ouvrir le menu", "Open menu")}>
          {open ? <X className={`w-5 h-5 ${scrolled ? "text-gray-900" : "text-white"}`} /> : <Menu className={`w-5 h-5 ${scrolled ? "text-gray-900" : "text-white"}`} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t p-4 space-y-3">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="block text-sm text-gray-700 py-2" onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          {/* Mobile lang toggle */}
          <div className="flex items-center gap-2 py-2">
            <button onClick={() => setLang("fr")} className={`text-xs font-semibold px-3 py-1 rounded-full ${lang === "fr" ? "text-white" : "text-gray-400 border border-gray-200"}`} style={lang === "fr" ? { background: C.green } : undefined}>FR</button>
            <button onClick={() => setLang("en")} className={`text-xs font-semibold px-3 py-1 rounded-full ${lang === "en" ? "text-white" : "text-gray-400 border border-gray-200"}`} style={lang === "en" ? { background: C.green } : undefined}>EN</button>
          </div>
          <Button className="w-full rounded-full font-semibold" style={{ background: C.yellow, color: C.green }}>{t(lang, "Démo gratuite", "Free demo")}</Button>
        </div>
      )}
    </nav>
  );
}

// ─── HERO ────────────────────────────────────────────

function Hero() {
  const { lang } = useLang();
  const stats = getStats(lang);
  return (
    <section className="bg-hero relative overflow-hidden min-h-screen flex items-center">
      <div className="absolute inset-0 chevron-pattern" />
      <div className="absolute top-1/3 -left-40 w-[480px] h-[480px] rounded-full opacity-[0.18] blur-[140px]" style={{ background: C.yellow }} />
      <div className="absolute bottom-1/4 -right-40 w-[480px] h-[480px] rounded-full opacity-[0.10] blur-[140px]" style={{ background: "#4AE0D2" }} />

      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-24 w-full">
        <div className="max-w-3xl">
          <Badge variant="outline" className="mb-6 text-white/50 border-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs tracking-widest uppercase">
            <ChevronsRight className="w-3 h-3 mr-1.5 inline" style={{ color: C.yellow }} />
            Beta · Virtual Consulting Platform
          </Badge>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight mb-6" style={HDR_FONT}>
            {t(lang, "Le consulting AI,", "AI consulting,")}{" "}
            <span className="text-gradient">{t(lang, "réinventé.", "reinvented.")}</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/50 leading-relaxed mb-10 max-w-xl">
            {t(lang,
              "Accédez à l'expertise AI de Talsom Forge en libre-service. Services virtuels, outils spécialisés et chat AI expert — le tout sur une plateforme unique.",
              "Access Talsom Forge AI expertise on-demand. Virtual services, specialized tools, and expert AI chat — all on a single platform."
            )}
          </p>

          <div className="flex flex-wrap gap-4 mb-16">
            <a href="#services">
              <Button size="lg" className="rounded-full px-8 h-12 text-base font-semibold hover:opacity-90 border-0" style={{ background: C.yellow, color: C.green }}>
                {t(lang, "Explorer les services", "Explore services")} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="#ai-chat">
              <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base text-white border-white/12 bg-white/5 hover:bg-white/10 hover:text-white">
                {t(lang, "Essayer le chat AI", "Try AI chat")}
              </Button>
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold tracking-tight" style={{ ...HDR_FONT, color: C.yellow }}>{s.value}</div>
                <div className="text-sm text-white/35 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── TRUST BAR ───────────────────────────────────────

function TrustBar() {
  const { lang } = useLang();
  return (
    <section className="bg-white border-b py-8">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] text-center mb-6">{t(lang, "Ils nous font confiance", "Trusted by")}</p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-30">
          {["Desjardins", "BNC", "Québecor", "CGI", "WSP", "Pomerleau", "STM", "Beneva"].map((n) => (
            <span key={n} className="text-lg font-semibold text-gray-900 tracking-tight">{n}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SERVICES ────────────────────────────────────────

function ServicesSection() {
  const { lang } = useLang();
  const services = getServices(lang);
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <Badge className="mb-4 border-0 rounded-full px-3 text-xs font-semibold" style={{ background: C.yellowLight, color: C.green }}>{t(lang, "Services virtuels", "Virtual services")}</Badge>
          <h2 className="text-4xl font-bold tracking-tight mb-4" style={{ ...HDR_FONT, color: C.green }}>
            {lang === "fr" ? <>Des services AI à la carte,<br />livrés virtuellement.</> : <>À la carte AI services,<br />delivered virtually.</>}
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed">
            {t(lang,
              "Choisissez les expertises dont vous avez besoin. Chaque service combine l'intelligence artificielle de notre plateforme avec l'accompagnement de nos consultants.",
              "Choose the expertise you need. Each service combines our platform's artificial intelligence with the guidance of our consultants."
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((svc) => (
            <Card key={svc.id} className="group relative border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden">
              {svc.popular && (
                <div className="absolute top-4 right-4">
                  <Badge className="border-0 rounded-full text-[10px] px-2.5 font-semibold" style={{ background: C.green, color: C.yellow }}>{t(lang, "Populaire", "Popular")}</Badge>
                </div>
              )}
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mb-3">
                  <svc.icon className="w-5 h-5 text-gray-400" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">{svc.title}</CardTitle>
                <p className="text-xs text-gray-400 font-medium">{svc.subtitle}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{svc.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {svc.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px] rounded-full bg-gray-50 text-gray-500 border-0 px-2.5">{tag}</Badge>
                  ))}
                </div>
                <Separator className="mb-4" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">{svc.price}</span>
                  <Button variant="ghost" size="sm" className="rounded-full px-3 text-xs font-semibold" style={{ color: C.green }}>
                    {t(lang, "Découvrir", "Discover")} <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ────────────────────────────────────

function HowItWorks() {
  const { lang } = useLang();
  const steps = lang === "fr"
    ? [
        { icon: Target, title: "Choisissez", desc: "Sélectionnez un service ou un outil AI depuis notre marketplace." },
        { icon: MessageSquare, title: "Échangez", desc: "Affinez votre besoin avec notre chat AI spécialisé en consulting." },
        { icon: Zap, title: "Recevez", desc: "Obtenez vos livrables générés par AI et validés par nos experts." },
        { icon: TrendingUp, title: "Itérez", desc: "Améliorez continuellement avec le suivi et les recommandations." },
      ]
    : [
        { icon: Target, title: "Choose", desc: "Select an AI service or tool from our marketplace." },
        { icon: MessageSquare, title: "Discuss", desc: "Refine your needs with our consulting-specialized AI chat." },
        { icon: Zap, title: "Receive", desc: "Get your AI-generated deliverables validated by our experts." },
        { icon: TrendingUp, title: "Iterate", desc: "Continuously improve with tracking and recommendations." },
      ];

  return (
    <section className="py-24" style={{ background: C.silverLight }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge className="mb-4 border-0 rounded-full px-3 text-xs font-semibold" style={{ background: C.greenLight, color: C.green }}>{t(lang, "Comment ça marche", "How it works")}</Badge>
          <h2 className="text-4xl font-bold tracking-tight mb-4" style={{ ...HDR_FONT, color: C.green }}>{t(lang, "Du besoin au livrable en quelques clics", "From need to deliverable in a few clicks")}</h2>
          <p className="text-gray-500">{t(lang, "Notre plateforme combine l'automatisation AI avec l'expertise humaine pour vous livrer des résultats de qualité consulting, plus rapidement.", "Our platform combines AI automation with human expertise to deliver consulting-grade results, faster.")}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={step.title} className="relative">
              {i < steps.length - 1 && <div className="hidden lg:block absolute top-8 left-[calc(50%+32px)] w-[calc(100%-64px)] h-px" style={{ background: C.silver }} />}
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center mx-auto mb-4 relative">
                  <step.icon className="w-7 h-7" style={{ color: C.green }} />
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center" style={{ background: C.yellow, color: C.green }}>
                    {i + 1}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── MARKETPLACE ─────────────────────────────────────

function MarketplaceSection() {
  const { lang } = useLang();
  const products = getMarketplace(lang);
  return (
    <section id="marketplace" className="bg-dark-section py-24 relative overflow-hidden">
      <div className="absolute inset-0 chevron-pattern opacity-50" />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <Badge className="mb-4 bg-white/5 text-white/50 border-white/8 rounded-full px-3 text-xs">Marketplace</Badge>
          <h2 className="text-4xl font-bold text-white tracking-tight mb-4" style={HDR_FONT}>
            Talsom Forge <span style={{ color: C.yellow }}>Hub</span>
          </h2>
          <p className="text-lg text-white/40 leading-relaxed">{t(lang, "Nos outils AI propriétaires, conçus par des consultants pour des consultants. Intégrez-les dans vos processus ou utilisez-les en autonomie.", "Our proprietary AI tools, designed by consultants for consultants. Integrate them into your processes or use them independently.")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {products.map((p) => (
            <div key={p.id} className="glass-card rounded-2xl p-6 hover:bg-white/[0.06] transition-all duration-300 group">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge className={`${p.badgeCls} border rounded-full text-[10px] px-2.5 mb-3`}>{p.tier}</Badge>
                  <h3 className="text-xl font-semibold text-white mb-1">{p.name}</h3>
                  <p className="text-sm text-white/35">{p.tagline}</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-white/15 group-hover:text-white/50 transition-colors" />
              </div>
              <p className="text-sm text-white/45 leading-relaxed mb-5">{p.desc}</p>
              <div className="grid grid-cols-2 gap-2 mb-5">
                {p.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-xs text-white/45">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: C.yellow }} />
                    {f}
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="rounded-full border-white/8 text-white/60 bg-transparent hover:bg-white/8 hover:text-white w-full">{t(lang, "En savoir plus", "Learn more")}</Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── AI CHAT ─────────────────────────────────────────

type ChatMsg = { role: "user" | "assistant"; text: string };

function AIChatSection() {
  const { lang } = useLang();
  const exchanges = getChatExchanges(lang);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [inputVal, setInputVal] = useState(exchanges[0]?.user ?? "");
  const [typing, setTyping] = useState(false);
  const [exchangeIdx, setExchangeIdx] = useState(0);
  const [demoEnded, setDemoEnded] = useState(false);
  const chatEnd = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const isInitialMount = useRef(true);
  const prevLang = useRef(lang);

  // Reset demo when language changes
  useEffect(() => {
    if (prevLang.current !== lang) {
      prevLang.current = lang;
      busy.current = false;
      setMessages([]);
      setExchangeIdx(0);
      setDemoEnded(false);
      setTyping(false);
      isInitialMount.current = true;
      const newExchanges = getChatExchanges(lang);
      setInputVal(newExchanges[0]?.user ?? "");
    }
  }, [lang]);

  useEffect(() => {
    if (isInitialMount.current) { isInitialMount.current = false; return; }
    chatEnd.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, typing]);

  const restart = () => {
    busy.current = false;
    setMessages([]);
    setInputVal(exchanges[0]?.user ?? "");
    setExchangeIdx(0);
    setDemoEnded(false);
    setTyping(false);
    isInitialMount.current = true;
  };

  const handleSend = () => {
    if (busy.current || demoEnded) return;
    if (exchangeIdx >= exchanges.length) { setDemoEnded(true); return; }

    const exchange = exchanges[exchangeIdx];
    busy.current = true;

    setMessages((prev) => [...prev, { role: "user", text: exchange.user }]);
    setInputVal("");

    setTimeout(() => { setTyping(true); }, 400);

    const typingDuration = Math.min(1200 + exchange.assistant.length * 2, 3000);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { role: "assistant", text: exchange.assistant }]);

      const nextIdx = exchangeIdx + 1;
      setExchangeIdx(nextIdx);
      busy.current = false;

      if (nextIdx >= exchanges.length) {
        setDemoEnded(true);
        setInputVal("");
      } else {
        setInputVal(exchanges[nextIdx].user);
      }
    }, typingDuration);
  };

  const chatFeatures = lang === "fr"
    ? [
        { icon: Brain, text: "Expertise AI, data et transformation digitale" },
        { icon: BookOpen, text: "Génération de rapports, roadmaps et analyses" },
        { icon: Lock, text: "Conformité Loi 25, EU AI Act, RGPD" },
        { icon: Globe, text: "Bilingue français / anglais" },
      ]
    : [
        { icon: Brain, text: "AI, data, and digital transformation expertise" },
        { icon: BookOpen, text: "Report, roadmap, and analysis generation" },
        { icon: Lock, text: "Bill 25, EU AI Act, GDPR compliance" },
        { icon: Globe, text: "Bilingual French / English" },
      ];

  return (
    <section id="ai-chat" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="lg:sticky lg:top-32">
            <Badge className="mb-4 border-0 rounded-full px-3 text-xs font-semibold" style={{ background: C.yellowLight, color: C.green }}>AI Chat Expert</Badge>
            <h2 className="text-4xl font-bold tracking-tight mb-4" style={{ ...HDR_FONT, color: C.green }}>
              {lang === "fr" ? <>Un consultant AI,<br />disponible 24/7.</> : <>An AI consultant,<br />available 24/7.</>}
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed mb-8">{t(lang, "Notre chat AI est entraîné sur des milliers de projets de transformation digitale et AI. Il comprend votre contexte, pose les bonnes questions et génère des livrables prêts à l'emploi.", "Our AI chat is trained on thousands of digital transformation and AI projects. It understands your context, asks the right questions, and generates ready-to-use deliverables.")}</p>
            <div className="space-y-4">
              {chatFeatures.map((it) => (
                <div key={it.text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: C.greenLight }}>
                    <it.icon className="w-4 h-4" style={{ color: C.green }} />
                  </div>
                  <span className="text-sm text-gray-600">{it.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-lg" style={{ background: C.silverLight }}>
            <div className="px-5 py-4 border-b border-gray-100 bg-white flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: C.green }}>
                <Bot className="w-5 h-5" style={{ color: C.yellow }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Talsom Forge Consultant</p>
                <p className="text-[11px] flex items-center gap-1" style={{ color: C.greenMid }}>
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#4AE0D2" }} /> {t(lang, "En ligne", "Online")}
                </p>
              </div>
              <Badge className="ml-auto border-0 text-[10px] rounded-full font-semibold" style={{ background: C.yellowLight, color: C.green }}>Demo</Badge>
            </div>

            <div className="h-[440px] overflow-y-auto px-5 py-5 space-y-4">
              {messages.length === 0 && !typing && (
                <div className="flex justify-start chat-bubble-in">
                  <div className="max-w-[85%] rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed bg-white border border-gray-100 text-gray-700 shadow-sm">
                    {t(lang,
                      "Bonjour! Je suis votre consultant AI Talsom Forge. Cliquez **Envoyer** pour démarrer la démo interactive.",
                      "Hello! I'm your Talsom Forge AI consultant. Click **Send** to start the interactive demo."
                    ).split(/\*\*(.*?)\*\*/g).map((part, pi) =>
                      pi % 2 === 1 ? <strong key={pi}>{part}</strong> : part
                    )}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={`chat-bubble-in flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === "user" ? "text-white rounded-br-md" : "bg-white border border-gray-100 text-gray-700 rounded-bl-md shadow-sm"}`} style={m.role === "user" ? { background: C.green } : undefined}>
                    {m.text.split("\n").map((line, li) => (
                      <span key={li}>
                        {li > 0 && <br />}
                        {line.split(/\*\*(.*?)\*\*/g).map((part, pi) =>
                          pi % 2 === 1 ? <strong key={pi}>{part}</strong> : part
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start chat-bubble-in">
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                    <div className="flex gap-1.5">
                      {[0, 150, 300].map((d) => <span key={d} className="w-2 h-2 rounded-full animate-bounce" style={{ background: C.silver, animationDelay: `${d}ms` }} />)}
                    </div>
                  </div>
                </div>
              )}

              {demoEnded && (
                <div className="chat-bubble-in flex flex-col items-center gap-3 py-4">
                  <p className="text-xs text-gray-400">{t(lang, "Fin de la démo interactive", "End of interactive demo")}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="rounded-full text-xs border-gray-200" onClick={restart}>
                      {t(lang, "Recommencer la démo", "Restart demo")}
                    </Button>
                    <Button size="sm" className="rounded-full text-xs border-0 hover:opacity-90" style={{ background: C.yellow, color: C.green }}>
                      {t(lang, "Accéder au chat complet", "Access full chat")}
                    </Button>
                  </div>
                </div>
              )}
              <div ref={chatEnd} />
            </div>

            <div className="border-t border-gray-100 bg-white p-4">
              <div className="flex gap-2">
                <Input
                  placeholder={demoEnded ? t(lang, "Démo terminée — recommencez ou accédez au chat complet", "Demo ended — restart or access full chat") : t(lang, "Posez une question sur l'AI…", "Ask an AI question…")}
                  value={inputVal}
                  readOnly
                  onKeyDown={(e: React.KeyboardEvent) => e.key === "Enter" && handleSend()}
                  className="rounded-full border-gray-200 bg-gray-50 text-sm cursor-default"
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={busy.current || demoEnded}
                  className="rounded-full shrink-0 hover:opacity-90 border-0 disabled:opacity-40"
                  style={{ background: C.green, color: C.yellow }}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 text-center">
                {demoEnded
                  ? t(lang, "Merci d'avoir exploré la démo!", "Thanks for exploring the demo!")
                  : `${t(lang, "Démo interactive", "Interactive demo")} · ${t(lang, "Étape", "Step")} ${exchangeIdx + 1}/${exchanges.length}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PRICING ─────────────────────────────────────────

function Pricing() {
  const { lang } = useLang();
  const plans = getPlans(lang);

  return (
    <section id="tarification" className="py-24" style={{ background: C.silverLight }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge className="mb-4 border-0 rounded-full px-3 text-xs font-semibold" style={{ background: C.yellowLight, color: C.green }}>{t(lang, "Tarification", "Pricing")}</Badge>
          <h2 className="text-4xl font-bold tracking-tight mb-4" style={{ ...HDR_FONT, color: C.green }}>{t(lang, "Un plan pour chaque ambition", "A plan for every ambition")}</h2>
          <p className="text-gray-500">{t(lang, "Commencez gratuitement, montez en puissance quand vous êtes prêts.", "Start free, scale up when you're ready.")}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((p) => (
            <Card key={p.name} className={`rounded-2xl overflow-hidden ${p.highlight ? "border-2 shadow-xl relative" : "border-gray-100"}`} style={p.highlight ? { borderColor: C.green } : undefined}>
              {p.highlight && <div className="absolute top-0 inset-x-0 h-1" style={{ background: `linear-gradient(90deg, ${C.green}, ${C.yellow})` }} />}
              <CardHeader>
                <p className="text-sm font-medium text-gray-400 mb-1">{p.sub}</p>
                <CardTitle className="text-xl font-bold text-gray-900">{p.name}</CardTitle>
                <p className="text-3xl font-bold mt-2" style={{ ...HDR_FONT, color: C.green }}>{p.price}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  {p.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: C.greenMid }} />
                      {f}
                    </div>
                  ))}
                </div>
                <Button className={`w-full rounded-full font-semibold ${p.highlight ? "hover:opacity-90 border-0" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"}`} style={p.highlight ? { background: C.yellow, color: C.green } : undefined}>
                  {p.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ─────────────────────────────────────────────

function CTABanner() {
  const { lang } = useLang();
  return (
    <section className="bg-hero py-24 relative overflow-hidden">
      <div className="absolute inset-0 chevron-pattern opacity-40" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full opacity-[0.15] blur-[140px]" style={{ background: C.yellow }} />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.08] blur-[140px]" style={{ background: "#4AE0D2" }} />
      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-white tracking-tight mb-4" style={HDR_FONT}>{t(lang, "Prêt à transformer votre approche AI?", "Ready to transform your AI approach?")}</h2>
        <p className="text-lg text-white/45 mb-8">{t(lang, "Rejoignez la beta et accédez à l'expertise AI de Talsom Forge, disponible en quelques clics.", "Join the beta and access Talsom Forge AI expertise, available in just a few clicks.")}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" className="rounded-full px-8 h-12 font-semibold hover:opacity-90 border-0" style={{ background: C.yellow, color: C.green }}>
            {t(lang, "Demander un accès beta", "Request beta access")} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-white border-white/12 bg-white/5 hover:bg-white/10 hover:text-white">
            {t(lang, "Planifier une démo", "Schedule a demo")}
          </Button>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────

function Footer() {
  const { lang } = useLang();
  const footerCols = lang === "fr"
    ? [
        { title: "Services", links: ["AI Roadmap", "Maturity Assessment", "Governance", "Copilot Deployment", "Business Case"] },
        { title: "Marketplace", links: ["Talsom Forge Hub", "AI Backlog Manager", "Privacy Assessor", "Governance Suite"] },
        { title: "Entreprise", links: ["À propos", "Carrières", "Blog", "Contact", "Mentions légales"] },
      ]
    : [
        { title: "Services", links: ["AI Roadmap", "Maturity Assessment", "Governance", "Copilot Deployment", "Business Case"] },
        { title: "Marketplace", links: ["Talsom Forge Hub", "AI Backlog Manager", "Privacy Assessor", "Governance Suite"] },
        { title: "Company", links: ["About", "Careers", "Blog", "Contact", "Legal"] },
      ];
  const bottomLinks = lang === "fr" ? ["Confidentialité", "Conditions", "Cookies"] : ["Privacy", "Terms", "Cookies"];

  return (
    <footer className="bg-dark-section border-t border-white/5 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.greenMid }}>
                <Brain className="w-4 h-4" style={{ color: C.yellow }} />
              </div>
              <span className="font-semibold text-white text-lg" style={HDR_FONT}>Talsom<span className="font-light opacity-70">Forge</span></span>
            </div>
            <p className="text-sm text-white/30 leading-relaxed">{t(lang, "Plateforme de consulting virtuel.", "Virtual consulting platform.")}<br />Montréal, Québec.</p>
            <div className="flex gap-0.5 mt-4">
              {[0.2, 0.35, 0.5].map((op) => (
                <ChevronsRight key={op} className="w-4 h-4" style={{ color: C.yellow, opacity: op }} />
              ))}
            </div>
          </div>
          {footerCols.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold text-white/60 mb-4">{col.title}</p>
              <div className="space-y-2.5">
                {col.links.map((l) => <a key={l} href="#" className="block text-sm text-white/30 hover:text-white/55 transition-colors">{l}</a>)}
              </div>
            </div>
          ))}
        </div>
        <Separator className="bg-white/5 mb-6" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-white/20">{t(lang, "© 2026 Talsom. Tous droits réservés. Plateforme beta — accès sur invitation.", "© 2026 Talsom. All rights reserved. Beta platform — invite only.")}</p>
          <div className="flex gap-4">
            {bottomLinks.map((l) => <a key={l} href="#" className="text-xs text-white/20 hover:text-white/45 transition-colors">{l}</a>)}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── APP ─────────────────────────────────────────────

export default function App() {
  const [lang, setLang] = useState<Lang>("fr");

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <div className="min-h-screen">
        <Nav />
        <Hero />
        <TrustBar />
        <ServicesSection />
        <HowItWorks />
        <MarketplaceSection />
        <AIChatSection />
        <Pricing />
        <CTABanner />
        <Footer />
      </div>
    </LangContext.Provider>
  );
}
