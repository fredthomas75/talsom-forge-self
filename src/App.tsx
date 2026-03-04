import { useState, useRef, useEffect } from "react";
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
} from "lucide-react";

/* ═══════════════════════════════════════════════════════
   Talsom brand color tokens (used inline throughout)
   coral:       #E8604C / hsl(8,76%,60%)
   coral-dark:  #D04A38
   coral-light: #FFF0ED
   charcoal:    #1C1C2E
   teal:        #2A9D8F
   teal-light:  #E8F6F4
   warm-gray:   #F7F5F3
   ═══════════════════════════════════════════════════════ */

const C = {
  coral: "#E8604C",
  coralDark: "#D04A38",
  coralLight: "#FFF0ED",
  charcoal: "#1C1C2E",
  charcoalMid: "#2A2A42",
  teal: "#2A9D8F",
  tealLight: "#E8F6F4",
  warmGray: "#F7F5F3",
};

// ─── DATA ────────────────────────────────────────────

const SERVICES = [
  { id: "roadmap", icon: MapPin, title: "AI Roadmap", subtitle: "Feuille de route stratégique", desc: "Définissez votre trajectoire de transformation AI avec une roadmap personnalisée, priorisée et alignée sur vos objectifs d'affaires.", tags: ["Stratégie", "Priorisation", "12 semaines"], price: "À partir de 15 000$", popular: true },
  { id: "maturity", icon: BarChart3, title: "AI Maturity Assessment", subtitle: "Diagnostic de maturité", desc: "Évaluez votre niveau de préparation AI à travers 6 dimensions clés : stratégie, données, technologie, talents, gouvernance et culture.", tags: ["Diagnostic", "Benchmark", "4 semaines"], price: "À partir de 8 000$", popular: false },
  { id: "governance", icon: Shield, title: "AI Governance", subtitle: "Cadre de gouvernance IA", desc: "Implantez un cadre de gouvernance AI responsable incluant politiques, RACI, comités et conformité réglementaire (Loi 25, EU AI Act).", tags: ["Conformité", "Éthique", "8 semaines"], price: "À partir de 12 000$", popular: false },
  { id: "copilot", icon: Sparkles, title: "Copilot 365 Deployment", subtitle: "Déploiement Microsoft Copilot", desc: "Accélérez l'adoption de Microsoft 365 Copilot avec un plan de déploiement structuré, de la préparation des données à la gestion du changement.", tags: ["Microsoft", "Adoption", "10 semaines"], price: "À partir de 20 000$", popular: true },
  { id: "business-case", icon: TrendingUp, title: "AI Business Case", subtitle: "Analyse de rentabilité", desc: "Construisez un dossier d'affaires solide avec analyse ROI, projection de valeur et cadre de mesure pour justifier vos investissements AI.", tags: ["ROI", "Valeur", "3 semaines"], price: "À partir de 6 000$", popular: false },
  { id: "change", icon: Users, title: "Change Management AI", subtitle: "Conduite du changement", desc: "Assurez l'adoption réussie de vos initiatives AI avec un plan de changement complet : communication, formation, résistance et mesure.", tags: ["Adoption", "Formation", "Continu"], price: "À partir de 10 000$", popular: false },
];

const MARKETPLACE_PRODUCTS = [
  { id: "hub", name: "Talsom AI Hub", tagline: "Plateforme de consulting virtuel", desc: "Suite complète d'outils AI pour le consulting : diagnostics automatisés, génération de livrables, chat spécialisé et tableaux de bord.", features: ["Diagnostics AI", "Génération de rapports", "Chat expert", "Tableaux de bord"], tier: "Platform", badgeCls: "bg-[#E8604C]/10 text-[#E8604C] border-[#E8604C]/20" },
  { id: "backlog", name: "AI Backlog Manager", tagline: "Gestion de portefeuille de cas d'usage", desc: "Identifiez, priorisez et suivez vos cas d'usage AI avec un framework de scoring et des vues portefeuille intelligentes.", features: ["Scoring multicritère", "Vues portefeuille", "Suivi ROI", "Collaboration"], tier: "Tool", badgeCls: "bg-[#2A9D8F]/10 text-[#2A9D8F] border-[#2A9D8F]/20" },
  { id: "pia", name: "Privacy Impact Assessor", tagline: "EFVP automatisée Loi 25", desc: "Générez des évaluations des facteurs relatifs à la vie privée conformes à la Loi 25 pour vos projets AI en quelques minutes.", features: ["Conformité Loi 25", "Rapport automatisé", "Registre des risques", "Suivi"], tier: "Tool", badgeCls: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  { id: "governance-tool", name: "AI Governance Suite", tagline: "Gouvernance AI clé en main", desc: "Cadre de gouvernance complet avec modèles de politiques, matrices RACI, registres de modèles et tableaux de bord de conformité.", features: ["Politiques AI", "RACI automatisé", "Registre de modèles", "Audit trail"], tier: "Suite", badgeCls: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
];

const CHAT_DEMO_MESSAGES = [
  { role: "user" as const, text: "Je veux déployer Microsoft Copilot dans mon organisation de 500 personnes. Par où commencer?" },
  { role: "assistant" as const, text: "Excellent choix! Pour un déploiement Copilot 365 à cette échelle, je recommande une approche en 4 phases :\n\n1. **Évaluation de préparation** — Audit de votre environnement M365, qualité des données SharePoint/OneDrive, licences actuelles\n2. **Pilote ciblé** — 50 utilisateurs power-users sur 4-6 semaines\n3. **Déploiement progressif** — Vagues de 100-150 utilisateurs avec formation adaptée\n4. **Optimisation continue** — Mesure d'adoption, ajustement des prompts, bonnes pratiques\n\nVoulez-vous que je génère un plan de déploiement détaillé avec échéancier et budget estimé?" },
  { role: "user" as const, text: "Oui, génère-moi le plan complet avec l'estimation budgétaire." },
  { role: "assistant" as const, text: "Je prépare votre plan de déploiement Copilot 365. Voici un aperçu :\n\n📋 **Plan généré** — Copilot365_Deployment_Talsom.pdf\n\n**Budget estimé :**\n→ Licences Copilot (500 users) : ~450 000$ /an\n→ Accompagnement Talsom : 45 000$\n→ Formation & change management : 25 000$\n→ **Total Année 1 : ~520 000$**\n\n**ROI projeté :** Gain de productivité de 8-12h/mois/utilisateur, retour estimé de 2.1x sur 18 mois.\n\nLe document est prêt. Voulez-vous aussi l'analyse de risques et le plan de gestion du changement?" },
];

const STATS = [
  { value: "150+", label: "Projets AI livrés" },
  { value: "42", label: "Clients actifs" },
  { value: "8.5x", label: "ROI moyen" },
  { value: "96%", label: "Satisfaction client" },
];

const HDR_FONT = { fontFamily: "'Space Grotesk', system-ui, sans-serif" };

// ─── NAV ─────────────────────────────────────────────

function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["Services", "Marketplace", "AI Chat", "Tarification"];

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-lg shadow-sm border-b" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.coral }}>
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className={`font-semibold text-lg tracking-tight ${scrolled ? "text-gray-900" : "text-white"}`} style={HDR_FONT}>
            Talsom<span className="font-light opacity-70">AI</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s/g, "-")}`} className={`text-sm font-medium transition-colors ${scrolled ? "text-gray-500 hover:text-gray-900" : "text-white/60 hover:text-white"}`}>
              {l}
            </a>
          ))}
          <Button size="sm" className="text-white rounded-full px-5" style={{ background: C.coral }}>
            Démo gratuite
          </Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}>
          {open ? <X className={`w-5 h-5 ${scrolled ? "text-gray-900" : "text-white"}`} /> : <Menu className={`w-5 h-5 ${scrolled ? "text-gray-900" : "text-white"}`} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t p-4 space-y-3">
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s/g, "-")}`} className="block text-sm text-gray-700 py-2" onClick={() => setOpen(false)}>{l}</a>
          ))}
          <Button className="w-full text-white rounded-full" style={{ background: C.coral }}>Démo gratuite</Button>
        </div>
      )}
    </nav>
  );
}

// ─── HERO ────────────────────────────────────────────

function Hero() {
  return (
    <section className="bg-hero relative overflow-hidden min-h-screen flex items-center">
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)", backgroundSize: "72px 72px" }} />
      {/* Glow orbs */}
      <div className="absolute top-1/3 -left-40 w-[480px] h-[480px] rounded-full opacity-15 blur-[140px]" style={{ background: C.coral }} />
      <div className="absolute bottom-1/4 -right-40 w-[480px] h-[480px] rounded-full opacity-[0.12] blur-[140px]" style={{ background: C.teal }} />

      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-24 w-full">
        <div className="max-w-3xl">
          <Badge variant="outline" className="mb-6 text-white/50 border-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs tracking-widest uppercase">
            Beta · Virtual Consulting Platform
          </Badge>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight mb-6" style={HDR_FONT}>
            Le consulting AI,{" "}
            <span className="text-gradient">réinventé.</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/50 leading-relaxed mb-10 max-w-xl">
            Accédez à l'expertise AI de Talsom en libre-service. Services virtuels, outils spécialisés et chat AI expert — le tout sur une plateforme unique.
          </p>

          <div className="flex flex-wrap gap-4 mb-16">
            <Button size="lg" className="text-white rounded-full px-8 h-12 text-base hover:opacity-90" style={{ background: C.coral }}>
              Explorer les services <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base text-white border-white/12 bg-white/5 hover:bg-white/10 hover:text-white">
              Essayer le chat AI
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold text-white tracking-tight" style={HDR_FONT}>{s.value}</div>
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
  return (
    <section className="bg-white border-b py-8">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] text-center mb-6">Ils nous font confiance</p>
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
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <Badge className="mb-4 border-0 rounded-full px-3 text-xs" style={{ background: C.coralLight, color: C.coral }}>Services virtuels</Badge>
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-4" style={HDR_FONT}>
            Des services AI à la carte,<br />livrés virtuellement.
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed">
            Choisissez les expertises dont vous avez besoin. Chaque service combine l'intelligence artificielle de notre plateforme avec l'accompagnement de nos consultants.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((svc) => (
            <Card key={svc.id} className="group relative border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden">
              {svc.popular && (
                <div className="absolute top-4 right-4">
                  <Badge className="text-white border-0 rounded-full text-[10px] px-2.5" style={{ background: C.teal }}>Populaire</Badge>
                </div>
              )}
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 group-hover:bg-[#FFF0ED] flex items-center justify-center mb-3 transition-colors">
                  <svc.icon className="w-5 h-5 text-gray-500 group-hover:text-[#E8604C] transition-colors" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">{svc.title}</CardTitle>
                <p className="text-xs text-gray-400 font-medium">{svc.subtitle}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{svc.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {svc.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="text-[10px] rounded-full bg-gray-50 text-gray-500 border-0 px-2.5">{t}</Badge>
                  ))}
                </div>
                <Separator className="mb-4" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">{svc.price}</span>
                  <Button variant="ghost" size="sm" className="hover:bg-[#FFF0ED] rounded-full px-3 text-xs" style={{ color: C.coral }}>
                    Découvrir <ChevronRight className="w-3 h-3 ml-1" />
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
  const steps = [
    { icon: Target, title: "Choisissez", desc: "Sélectionnez un service ou un outil AI depuis notre marketplace." },
    { icon: MessageSquare, title: "Échangez", desc: "Affinez votre besoin avec notre chat AI spécialisé en consulting." },
    { icon: Zap, title: "Recevez", desc: "Obtenez vos livrables générés par AI et validés par nos experts." },
    { icon: TrendingUp, title: "Itérez", desc: "Améliorez continuellement avec le suivi et les recommandations." },
  ];

  return (
    <section className="py-24" style={{ background: C.warmGray }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge className="mb-4 border-0 rounded-full px-3 text-xs" style={{ background: C.tealLight, color: C.teal }}>Comment ça marche</Badge>
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-4" style={HDR_FONT}>Du besoin au livrable en quelques clics</h2>
          <p className="text-gray-500">Notre plateforme combine l'automatisation AI avec l'expertise humaine pour vous livrer des résultats de qualité consulting, plus rapidement.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={step.title} className="relative">
              {i < steps.length - 1 && <div className="hidden lg:block absolute top-8 left-[calc(50%+32px)] w-[calc(100%-64px)] h-px bg-gray-200" />}
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center mx-auto mb-4 relative">
                  <step.icon className="w-7 h-7" style={{ color: C.coral }} />
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ background: C.coral }}>
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
  return (
    <section id="marketplace" className="bg-dark-section py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <Badge className="mb-4 bg-white/5 text-white/50 border-white/8 rounded-full px-3 text-xs">Marketplace</Badge>
          <h2 className="text-4xl font-bold text-white tracking-tight mb-4" style={HDR_FONT}>Talsom AI Hub</h2>
          <p className="text-lg text-white/40 leading-relaxed">Nos outils AI propriétaires, conçus par des consultants pour des consultants. Intégrez-les dans vos processus ou utilisez-les en autonomie.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {MARKETPLACE_PRODUCTS.map((p) => (
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
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: C.teal }} />
                    {f}
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="rounded-full border-white/8 text-white/60 bg-transparent hover:bg-white/8 hover:text-white w-full">En savoir plus</Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── AI CHAT ─────────────────────────────────────────

function AIChatSection() {
  const [messages, setMessages] = useState(CHAT_DEMO_MESSAGES.slice(0, 1));
  const [inputVal, setInputVal] = useState("");
  const [typing, setTyping] = useState(false);
  const chatEnd = useRef<HTMLDivElement>(null);
  const idx = useRef(1);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const addNext = () => {
    if (idx.current >= CHAT_DEMO_MESSAGES.length) return;
    setTyping(true);
    setTimeout(() => { setMessages((p) => [...p, CHAT_DEMO_MESSAGES[idx.current]]); idx.current += 1; setTyping(false); }, 1200);
  };

  const handleSend = () => {
    if (idx.current >= CHAT_DEMO_MESSAGES.length) return;
    const next = CHAT_DEMO_MESSAGES[idx.current];
    if (next.role === "user") {
      setMessages((p) => [...p, next]); idx.current += 1; setInputVal("");
      setTimeout(addNext, 500);
    } else { addNext(); setInputVal(""); }
  };

  return (
    <section id="ai-chat" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left copy */}
          <div className="lg:sticky lg:top-32">
            <Badge className="mb-4 border-0 rounded-full px-3 text-xs" style={{ background: C.coralLight, color: C.coral }}>AI Chat Expert</Badge>
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-4" style={HDR_FONT}>Un consultant AI,<br />disponible 24/7.</h2>
            <p className="text-lg text-gray-500 leading-relaxed mb-8">Notre chat AI est entraîné sur des milliers de projets de transformation digitale et AI. Il comprend votre contexte, pose les bonnes questions et génère des livrables prêts à l'emploi.</p>
            <div className="space-y-4">
              {[
                { icon: Brain, text: "Expertise AI, data et transformation digitale" },
                { icon: BookOpen, text: "Génération de rapports, roadmaps et analyses" },
                { icon: Lock, text: "Conformité Loi 25, EU AI Act, RGPD" },
                { icon: Globe, text: "Bilingue français / anglais" },
              ].map((it) => (
                <div key={it.text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                    <it.icon className="w-4 h-4" style={{ color: C.coral }} />
                  </div>
                  <span className="text-sm text-gray-600">{it.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat panel */}
          <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-lg" style={{ background: C.warmGray }}>
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 bg-white flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: C.coral }}>
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Talsom AI Consultant</p>
                <p className="text-[11px] flex items-center gap-1" style={{ color: C.teal }}>
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: C.teal }} /> En ligne
                </p>
              </div>
              <Badge className="ml-auto border-0 text-[10px] rounded-full" style={{ background: C.coralLight, color: C.coral }}>Beta</Badge>
            </div>

            {/* Messages */}
            <div className="h-[440px] overflow-y-auto px-5 py-5 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`chat-bubble-in flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === "user" ? "text-white rounded-br-md" : "bg-white border border-gray-100 text-gray-700 rounded-bl-md shadow-sm"}`} style={m.role === "user" ? { background: C.coral } : undefined}>
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
                      {[0, 150, 300].map((d) => <span key={d} className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEnd} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-100 bg-white p-4">
              <div className="flex gap-2">
                <Input placeholder="Posez une question sur l'AI…" value={inputVal} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputVal(e.target.value)} onKeyDown={(e: React.KeyboardEvent) => e.key === "Enter" && handleSend()} className="rounded-full border-gray-200 bg-gray-50 text-sm" />
                <Button size="icon" onClick={handleSend} className="rounded-full text-white shrink-0 hover:opacity-90" style={{ background: C.coral }}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 text-center">Démo interactive · Cliquez envoyer pour voir la conversation</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PRICING ─────────────────────────────────────────

function Pricing() {
  const plans = [
    { name: "Explorer", price: "Gratuit", sub: "Pour découvrir", features: ["Chat AI (10 messages/mois)", "1 diagnostic de maturité", "Accès marketplace (lecture)", "Support communautaire"], cta: "Commencer gratuitement", highlight: false },
    { name: "Professional", price: "990$/mois", sub: "Pour les équipes", features: ["Chat AI illimité", "Tous les diagnostics", "Génération de livrables", "5 services virtuels/mois", "Support prioritaire", "Intégration Microsoft 365"], cta: "Essai gratuit 14 jours", highlight: true },
    { name: "Enterprise", price: "Sur mesure", sub: "Pour les grandes organisations", features: ["Tout Professional +", "Consultants dédiés", "Personnalisation complète", "SLA garanti", "Formation sur site", "API & intégrations"], cta: "Contactez-nous", highlight: false },
  ];

  return (
    <section id="tarification" className="py-24" style={{ background: C.warmGray }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge className="mb-4 border-0 rounded-full px-3 text-xs" style={{ background: C.coralLight, color: C.coral }}>Tarification</Badge>
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-4" style={HDR_FONT}>Un plan pour chaque ambition</h2>
          <p className="text-gray-500">Commencez gratuitement, montez en puissance quand vous êtes prêts.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((p) => (
            <Card key={p.name} className={`rounded-2xl overflow-hidden ${p.highlight ? "border-2 shadow-xl relative" : "border-gray-100"}`} style={p.highlight ? { borderColor: C.coral } : undefined}>
              {p.highlight && <div className="absolute top-0 inset-x-0 h-1" style={{ background: `linear-gradient(90deg, ${C.coral}, ${C.teal})` }} />}
              <CardHeader>
                <p className="text-sm font-medium text-gray-400 mb-1">{p.sub}</p>
                <CardTitle className="text-xl font-bold text-gray-900">{p.name}</CardTitle>
                <p className="text-3xl font-bold text-gray-900 mt-2" style={HDR_FONT}>{p.price}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  {p.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: C.teal }} />
                      {f}
                    </div>
                  ))}
                </div>
                <Button className={`w-full rounded-full ${p.highlight ? "text-white hover:opacity-90" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"}`} style={p.highlight ? { background: C.coral } : undefined}>
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
  return (
    <section className="bg-hero py-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full opacity-[0.12] blur-[140px]" style={{ background: C.coral }} />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-10 blur-[140px]" style={{ background: C.teal }} />
      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-white tracking-tight mb-4" style={HDR_FONT}>Prêt à transformer votre approche AI?</h2>
        <p className="text-lg text-white/45 mb-8">Rejoignez la beta et accédez à l'expertise AI de Talsom, disponible en quelques clics.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 rounded-full px-8 h-12 font-semibold">
            Demander un accès beta <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-white border-white/12 bg-white/5 hover:bg-white/10 hover:text-white">
            Planifier une démo
          </Button>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-dark-section border-t border-white/5 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.coral }}>
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-white text-lg" style={HDR_FONT}>Talsom<span className="font-light opacity-70">AI</span></span>
            </div>
            <p className="text-sm text-white/30 leading-relaxed">Plateforme de consulting virtuel AI.<br />Montréal, Québec.</p>
          </div>
          {[
            { title: "Services", links: ["AI Roadmap", "Maturity Assessment", "Governance", "Copilot Deployment", "Business Case"] },
            { title: "Marketplace", links: ["Talsom AI Hub", "AI Backlog Manager", "Privacy Assessor", "Governance Suite"] },
            { title: "Entreprise", links: ["À propos", "Carrières", "Blog", "Contact", "Mentions légales"] },
          ].map((col) => (
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
          <p className="text-xs text-white/20">© 2026 Talsom. Tous droits réservés. Plateforme beta — accès sur invitation.</p>
          <div className="flex gap-4">
            {["Confidentialité", "Conditions", "Cookies"].map((l) => <a key={l} href="#" className="text-xs text-white/20 hover:text-white/45 transition-colors">{l}</a>)}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── APP ─────────────────────────────────────────────

export default function App() {
  return (
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
  );
}
