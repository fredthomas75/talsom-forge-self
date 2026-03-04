import { useState, useRef, useEffect, createContext, useContext, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  ArrowRight,
  Brain,
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
  Clock,
  Layers,
  Moon,
  Sun,
  Mail,
  Building2,
  User,
  Quote,
  Settings2,
  Server,
  Briefcase,
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

// ─── DARK MODE ───────────────────────────────────────

type Theme = "light" | "dark";
const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({ theme: "light", toggle: () => {} });
const useTheme = () => useContext(ThemeContext);

// ─── SCROLL REVEAL HOOK ─────────────────────────────

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    // observe stagger children
    el.querySelectorAll(":scope > .reveal").forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ─── BILINGUAL DATA ─────────────────────────────────

function getServices(lang: Lang) {
  return [
    { id: "process-design", icon: Settings2, title: "Business et Process Design", subtitle: t(lang, "Conception de processus et modèle opérationnel", "Process design and operating model"), desc: t(lang, "Optimisez vos processus d'affaires et concevez votre modèle opérationnel cible grâce à des ateliers virtuels co-facilités par nos consultants et agents AI.", "Optimize your business processes and design your target operating model through virtual workshops co-facilitated by our consultants and AI agents."), tags: t(lang, "Processus,Opérations,4-10 semaines", "Process,Operations,4-10 weeks").split(","), price: t(lang, "À partir de 15 000$", "Starting at $15,000"), popular: true },
    { id: "modernisation", icon: Server, title: t(lang, "Roadmap de modernisation", "Modernization Roadmap"), subtitle: t(lang, "Stratégie de modernisation technologique", "Technology modernization strategy"), desc: t(lang, "Planifiez la modernisation de vos systèmes hérités et votre migration vers le cloud avec une feuille de route séquencée et budgétisée.", "Plan the modernization of your legacy systems and cloud migration with a sequenced and budgeted roadmap."), tags: t(lang, "Cloud,Architecture,6-12 semaines", "Cloud,Architecture,6-12 weeks").split(","), price: t(lang, "À partir de 15 000$", "Starting at $15,000"), popular: false },
    { id: "roadmap-ia", icon: Brain, title: "Roadmap IA", subtitle: t(lang, "Stratégie et feuille de route AI", "AI strategy and roadmap"), desc: t(lang, "Définissez votre trajectoire AI avec une roadmap personnalisée couvrant stratégie, maturité, gouvernance et déploiement d'outils comme Copilot 365.", "Define your AI trajectory with a personalized roadmap covering strategy, maturity, governance, and tool deployment like Copilot 365."), tags: t(lang, "IA,Stratégie,4-14 semaines", "AI,Strategy,4-14 weeks").split(","), price: t(lang, "À partir de 8 000$", "Starting at $8,000"), popular: true },
    { id: "performance-org", icon: Users, title: t(lang, "Performance organisationnelle", "Organizational Performance"), subtitle: t(lang, "Gestion du changement et leadership", "Change management and leadership"), desc: t(lang, "Renforcez les capacités humaines de votre organisation : gestion du changement, design organisationnel, leadership et culture.", "Strengthen your organization's human capabilities: change management, organizational design, leadership, and culture."), tags: t(lang, "Changement,Leadership,Continu", "Change,Leadership,Ongoing").split(","), price: t(lang, "À partir de 10 000$", "Starting at $10,000"), popular: false },
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
      user: "Our order-to-cash process is slow and full of manual steps. Can you help us diagnose the problem?",
      assistant: "Absolutely! Let's start with a rapid diagnostic. Based on the symptoms you describe, here's what I'll analyze:\n\n1. **Process mapping** — I'll generate a current-state (AS-IS) map of your order-to-cash flow from your description\n2. **Bottleneck identification** — Manual handoffs, approval loops, and data re-entry points\n3. **Benchmark comparison** — Your cycle time vs industry standards\n4. **Quick-win opportunities** — Automation and simplification candidates\n\nCan you describe the main steps from when a customer places an order to when payment is received?",
    },
    {
      user: "Yes, we receive orders by email, then manually enter them in our ERP, verify inventory, send for approval, then ship. Invoicing is done separately in accounting.",
      assistant: "I've mapped your process. Here's the diagnostic:\n\n**Report generated** — OTC_Diagnostic_Talsom.pdf\n\n**Key findings:**\n→ **6 manual handoffs** identified (industry best practice: 2)\n→ **Estimated cycle time:** 8-12 days (benchmark: 3-4 days)\n→ **Data re-entry:** 3 points (order, inventory, invoice)\n\n**Top 3 quick wins:**\n1. Automated order intake (email parsing + ERP integration) — saves ~2 days\n2. Real-time inventory check — eliminates manual verification\n3. Auto-invoicing on shipment confirmation — saves ~1.5 days\n\n**Estimated improvement:** 55-65% cycle time reduction. Want me to generate the target operating model (TO-BE) with an implementation roadmap?",
    },
    {
      user: "Yes, generate the target model and roadmap.",
      assistant: "Here's your transformation roadmap:\n\n**Phase 1 — Quick wins (4 weeks):**\n→ Automated order intake via email parsing\n→ ERP integration for real-time inventory\n→ **Investment:** ~$25,000 | **Impact:** -3 days cycle time\n\n**Phase 2 — Process redesign (8 weeks):**\n→ Approval workflow automation\n→ Auto-invoicing on shipment\n→ **Investment:** ~$45,000 | **Impact:** -2 days additional\n\n**Phase 3 — Continuous optimization:**\n→ AI-powered demand forecasting\n→ Predictive exception handling\n\n**Total projected ROI:** 3.2x over 12 months. The full report with TO-BE process map is ready. Would you like to schedule a workshop with our consultants to validate the roadmap?",
    },
  ];
  return [
    {
      user: "Notre processus order-to-cash est lent et plein d'étapes manuelles. Pouvez-vous nous aider à diagnostiquer le problème?",
      assistant: "Absolument! Commençons par un diagnostic rapide. D'après les symptômes que vous décrivez, voici ce que je vais analyser :\n\n1. **Cartographie du processus** — Je vais générer une carte de l'état actuel (AS-IS) de votre flux order-to-cash\n2. **Identification des goulots** — Transferts manuels, boucles d'approbation et ressaisies de données\n3. **Comparaison benchmark** — Votre temps de cycle vs les standards de l'industrie\n4. **Gains rapides** — Candidats à l'automatisation et à la simplification\n\nPouvez-vous décrire les étapes principales depuis la réception d'une commande jusqu'au paiement?",
    },
    {
      user: "Oui, on reçoit les commandes par courriel, puis on les saisit manuellement dans notre ERP, on vérifie l'inventaire, on envoie pour approbation, puis on expédie. La facturation est faite séparément par la comptabilité.",
      assistant: "J'ai cartographié votre processus. Voici le diagnostic :\n\n**Rapport généré** — OTC_Diagnostic_Talsom.pdf\n\n**Constats clés :**\n→ **6 transferts manuels** identifiés (meilleure pratique : 2)\n→ **Temps de cycle estimé :** 8-12 jours (benchmark : 3-4 jours)\n→ **Ressaisie de données :** 3 points (commande, inventaire, facture)\n\n**Top 3 gains rapides :**\n1. Saisie automatisée des commandes (parsing courriel + intégration ERP) — économie de ~2 jours\n2. Vérification d'inventaire en temps réel — élimine la vérification manuelle\n3. Facturation automatique à la confirmation d'expédition — économie de ~1.5 jours\n\n**Amélioration estimée :** Réduction de 55-65% du temps de cycle. Voulez-vous que je génère le modèle opérationnel cible (TO-BE) avec une feuille de route de mise en œuvre?",
    },
    {
      user: "Oui, génère le modèle cible et la feuille de route.",
      assistant: "Voici votre feuille de route de transformation :\n\n**Phase 1 — Gains rapides (4 semaines) :**\n→ Saisie automatisée des commandes via parsing courriel\n→ Intégration ERP pour inventaire en temps réel\n→ **Investissement :** ~25 000$ | **Impact :** -3 jours temps de cycle\n\n**Phase 2 — Refonte du processus (8 semaines) :**\n→ Automatisation du workflow d'approbation\n→ Facturation automatique à l'expédition\n→ **Investissement :** ~45 000$ | **Impact :** -2 jours supplémentaires\n\n**Phase 3 — Optimisation continue :**\n→ Prévision de la demande par AI\n→ Gestion prédictive des exceptions\n\n**ROI total projeté :** 3.2x sur 12 mois. Le rapport complet avec la cartographie TO-BE est prêt. Souhaitez-vous planifier un atelier avec nos consultants pour valider la feuille de route?",
    },
  ];
}

function getStats(lang: Lang) {
  return [
    { value: "250+", label: t(lang, "Mandats livrés", "Engagements delivered") },
    { value: "80+", label: t(lang, "Clients actifs", "Active clients") },
    { value: "8.5x", label: t(lang, "ROI moyen", "Average ROI") },
    { value: "96%", label: t(lang, "Satisfaction client", "Client satisfaction") },
  ];
}

function getPlans(lang: Lang) {
  return [
    { name: "Explorer", price: t(lang, "Gratuit", "Free"), sub: t(lang, "Pour découvrir", "To explore"), features: [t(lang, "Chat AI (10 messages/mois)", "AI Chat (10 messages/month)"), t(lang, "1 diagnostic d'affaires", "1 business diagnostic"), t(lang, "Accès marketplace (lecture)", "Marketplace access (read-only)"), t(lang, "Support communautaire", "Community support")], cta: t(lang, "Commencer gratuitement", "Start for free"), highlight: false },
    { name: "Professional", price: t(lang, "990$/mois", "$990/month"), sub: t(lang, "Pour les équipes", "For teams"), features: [t(lang, "Chat AI illimité", "Unlimited AI Chat"), t(lang, "Diagnostics processus et maturité", "Process and maturity diagnostics"), t(lang, "Génération de livrables", "Deliverable generation"), t(lang, "5 services virtuels/mois", "5 virtual services/month"), t(lang, "Support prioritaire", "Priority support"), t(lang, "Ateliers virtuels co-facilités AI", "AI co-facilitated virtual workshops")], cta: t(lang, "Essai gratuit 14 jours", "Free 14-day trial"), highlight: true },
    { name: "Enterprise", price: t(lang, "Sur mesure", "Custom"), sub: t(lang, "Pour les grandes organisations", "For large organizations"), features: [t(lang, "Tout Professional +", "Everything in Professional +"), t(lang, "Consultants seniors dédiés", "Dedicated senior consultants"), t(lang, "Personnalisation complète", "Full customization"), t(lang, "SLA garanti", "Guaranteed SLA"), t(lang, "Ateliers et formations sur mesure", "Custom workshops and training"), "API & integrations"], cta: t(lang, "Contactez-nous", "Contact us"), highlight: false },
  ];
}

function getTestimonials(lang: Lang) {
  return [
    { name: "Marie-Claire Dubois", role: t(lang, "VP Transformation Digitale", "VP Digital Transformation"), company: "Desjardins", quote: t(lang, "L'accompagnement de Talsom Forge sur notre modèle opérationnel cible a été déterminant. La combinaison d'ateliers virtuels et d'outils AI a réduit notre temps de diagnostic de plusieurs semaines.", "Talsom Forge's support on our target operating model was decisive. The combination of virtual workshops and AI tools reduced our diagnostic time by several weeks.") },
    { name: "Jean-Philippe Tremblay", role: "CIO", company: "Pomerleau", quote: t(lang, "La feuille de route de modernisation livrée par Talsom Forge nous a permis de séquencer nos investissements TI avec une rigueur qu'on n'avait pas avant. 40% de réduction de notre dette technique en 18 mois.", "The modernization roadmap delivered by Talsom Forge allowed us to sequence our IT investments with a rigor we didn't have before. 40% reduction in technical debt in 18 months.") },
    { name: "Isabelle Marchand", role: t(lang, "Directrice RH", "HR Director"), company: "Hydro-Québec", quote: t(lang, "Le programme de gestion du changement accompagné par Talsom Forge a transformé notre capacité d'adoption. Nos équipes ont vu la valeur dès la première session d'atelier virtuel.", "The change management program supported by Talsom Forge transformed our adoption capability. Our teams saw the value from the very first virtual workshop session.") },
  ];
}

function getFAQ(lang: Lang) {
  return [
    { q: t(lang, "Qu'est-ce que Talsom Forge exactement?", "What is Talsom Forge exactly?"), a: t(lang, "Talsom Forge est une plateforme de consulting virtuel qui couvre 4 domaines d'expertise : Business et Process Design, Modernisation technologique, Intelligence artificielle et Performance organisationnelle. Chaque mandat combine l'accompagnement de consultants seniors avec la puissance de nos agents AI pour des livrables de qualité, livrés plus rapidement.", "Talsom Forge is a virtual consulting platform covering 4 areas of expertise: Business and Process Design, Technology Modernization, Artificial Intelligence, and Organizational Performance. Each engagement combines senior consultant guidance with the power of our AI agents for quality deliverables, delivered faster.") },
    { q: t(lang, "Comment fonctionnent les ateliers virtuels avec AI?", "How do virtual workshops with AI work?"), a: t(lang, "Nos ateliers sont co-facilités par un consultant senior et des agents AI. L'AI synthétise les contributions en temps réel, génère des cartographies de processus, analyse les données partagées et produit un rapport de séance immédiatement après chaque atelier. Le résultat : des ateliers 3x plus productifs.", "Our workshops are co-facilitated by a senior consultant and AI agents. The AI synthesizes contributions in real time, generates process maps, analyzes shared data, and produces a session report immediately after each workshop. The result: workshops that are 3x more productive.") },
    { q: t(lang, "Est-ce que mes données sont sécurisées?", "Is my data secure?"), a: t(lang, "Absolument. Vos données sont hébergées au Canada, chiffrées au repos et en transit, et ne sont jamais utilisées pour entraîner nos modèles. Nous sommes conformes à la Loi 25 et au RGPD. Chaque organisation dispose d'un environnement isolé.", "Absolutely. Your data is hosted in Canada, encrypted at rest and in transit, and never used to train our models. We are compliant with Bill 25 and GDPR. Each organization has an isolated environment.") },
    { q: t(lang, "Quelle est la différence entre un service virtuel et du consulting traditionnel?", "What's the difference between a virtual service and traditional consulting?"), a: t(lang, "Les services virtuels combinent l'expertise humaine de consultants seniors avec l'automatisation AI. Vous obtenez des livrables de qualité consulting plus rapidement et à moindre coût. Les ateliers sont virtuels mais interactifs, enrichis par des agents AI qui dynamisent l'output. Pour des mandats complexes, nos consultants interviennent en complément.", "Virtual services combine senior consultant human expertise with AI automation. You get consulting-quality deliverables faster and at lower cost. Workshops are virtual but interactive, enhanced by AI agents that boost output. For complex engagements, our consultants step in to complement the platform.") },
    { q: t(lang, "Puis-je essayer avant de m'engager?", "Can I try before committing?"), a: t(lang, "Oui! Le plan Explorer est gratuit et inclut 10 messages de chat par mois, un diagnostic d'affaires et l'accès en lecture à la marketplace. Vous pouvez aussi demander un essai gratuit de 14 jours du plan Professional.", "Yes! The Explorer plan is free and includes 10 chat messages per month, one business diagnostic, and read-only marketplace access. You can also request a free 14-day trial of the Professional plan.") },
    { q: t(lang, "Combien de temps prend un mandat typique?", "How long does a typical engagement take?"), a: t(lang, "Cela dépend du domaine. Un diagnostic de processus prend 3-4 semaines, une roadmap de modernisation 8-10 semaines, une Roadmap IA 10-12 semaines. Les outils de la marketplace (PIA, Backlog Manager) sont disponibles immédiatement.", "It depends on the domain. A process diagnostic takes 3-4 weeks, a modernization roadmap 8-10 weeks, an AI Roadmap 10-12 weeks. Marketplace tools (PIA, Backlog Manager) are available immediately.") },
  ];
}

// ─── SERVICE & MARKETPLACE DETAIL DATA ──────────────

type SubService = { name: string; price: string; desc: string; deliverables: string[]; timeline: string };
type CategoryDetail = { extendedDesc: string; differentiator: string; phases: { name: string; duration: string; desc: string }[]; deliverables: string[]; timeline: string; idealFor: string[]; subServices: SubService[] };

function getServiceDetails(lang: Lang): Record<string, CategoryDetail> {
  return {
    "process-design": {
      extendedDesc: t(lang,
        "Notre équipe de consultants seniors conçoit et optimise vos processus d'affaires à travers des ateliers virtuels interactifs. Les agents AI cartographient vos flux en temps réel, identifient les goulots d'étranglement et génèrent les livrables de chaque séance automatiquement.",
        "Our senior consultants design and optimize your business processes through interactive virtual workshops. AI agents map your flows in real time, identify bottlenecks, and automatically generate each session's deliverables."
      ),
      differentiator: t(lang,
        "Nos ateliers sont co-facilités par un consultant senior et des agents AI qui synthétisent les contributions en temps réel — cartographies de processus, analyses de données et rapports de séance sont produits immédiatement après chaque atelier.",
        "Our workshops are co-facilitated by a senior consultant and AI agents that synthesize contributions in real time — process maps, data analyses, and session reports are produced immediately after each workshop."
      ),
      phases: [
        { name: t(lang, "Diagnostic & Cadrage", "Diagnostic & Scoping"), duration: t(lang, "2 semaines", "2 weeks"), desc: t(lang, "Entrevues parties prenantes, collecte documentaire et cartographie AS-IS des processus ciblés.", "Stakeholder interviews, document collection, and AS-IS mapping of targeted processes.") },
        { name: t(lang, "Ateliers de co-design", "Co-design Workshops"), duration: t(lang, "3-4 semaines", "3-4 weeks"), desc: t(lang, "Sessions virtuelles collaboratives avec agents AI pour concevoir le modèle TO-BE et les quick wins.", "Collaborative virtual sessions with AI agents to design the TO-BE model and quick wins.") },
        { name: t(lang, "Livraison & Feuille de route", "Delivery & Roadmap"), duration: t(lang, "2 semaines", "2 weeks"), desc: t(lang, "Documentation finale, plan de mise en œuvre séquencé et présentation exécutive.", "Final documentation, sequenced implementation plan, and executive presentation.") },
      ],
      deliverables: [
        t(lang, "Cartographie AS-IS / TO-BE des processus", "AS-IS / TO-BE process mapping"),
        t(lang, "Analyse des goulots et recommandations", "Bottleneck analysis and recommendations"),
        t(lang, "Modèle opérationnel cible", "Target operating model"),
        t(lang, "Feuille de route de mise en œuvre", "Implementation roadmap"),
        t(lang, "Présentation exécutive", "Executive presentation"),
      ],
      timeline: t(lang, "6-8 semaines", "6-8 weeks"),
      idealFor: [t(lang, "VP Opérations / COO", "VP Operations / COO"), t(lang, "Directeur Processus", "Process Director"), t(lang, "Directeur Transformation", "Director of Transformation")],
      subServices: [
        { name: t(lang, "Diagnostic de processus", "Process Diagnostic"), price: t(lang, "15 000$", "$15,000"), desc: t(lang, "Cartographie rapide AS-IS de 3 à 5 processus clés avec identification des goulots et quick wins.", "Rapid AS-IS mapping of 3-5 key processes with bottleneck identification and quick wins."), deliverables: [t(lang, "Cartographies AS-IS (BPMN)", "AS-IS maps (BPMN)"), t(lang, "Rapport d'analyse des goulots", "Bottleneck analysis report"), t(lang, "Liste de quick wins priorisés", "Prioritized quick wins list")], timeline: t(lang, "3-4 semaines", "3-4 weeks") },
        { name: t(lang, "Design de modèle opérationnel", "Operating Model Design"), price: t(lang, "25 000$", "$25,000"), desc: t(lang, "Conception complète du modèle opérationnel cible incluant structure, processus, gouvernance et technologie.", "Complete target operating model design including structure, processes, governance, and technology."), deliverables: [t(lang, "Modèle opérationnel TO-BE", "TO-BE operating model"), t(lang, "Blueprint organisationnel", "Organizational blueprint"), t(lang, "Plan de transition", "Transition plan")], timeline: t(lang, "6-8 semaines", "6-8 weeks") },
        { name: t(lang, "Automatisation de processus", "Process Automation"), price: t(lang, "20 000$", "$20,000"), desc: t(lang, "Identification et implémentation des opportunités d'automatisation RPA et AI dans vos processus existants.", "Identification and implementation of RPA and AI automation opportunities in your existing processes."), deliverables: [t(lang, "Analyse d'automatisation", "Automation analysis"), t(lang, "Plan d'implémentation RPA/AI", "RPA/AI implementation plan"), t(lang, "Estimation ROI par processus", "ROI estimation per process")], timeline: t(lang, "4-6 semaines", "4-6 weeks") },
      ],
    },
    modernisation: {
      extendedDesc: t(lang,
        "Nous planifions la modernisation de vos systèmes hérités et votre migration vers le cloud avec une feuille de route séquencée, budgétisée et alignée sur vos priorités d'affaires. Nos consultants combinent expertise en architecture d'entreprise et outils d'analyse AI pour des recommandations fondées sur les données.",
        "We plan the modernization of your legacy systems and cloud migration with a sequenced, budgeted roadmap aligned with your business priorities. Our consultants combine enterprise architecture expertise with AI analysis tools for data-driven recommendations."
      ),
      differentiator: t(lang,
        "Notre plateforme AI analyse automatiquement votre parc applicatif, évalue la dette technique et génère des scénarios de modernisation comparés — vous gagnez des semaines d'analyse manuelle et obtenez des recommandations basées sur des données réelles.",
        "Our AI platform automatically analyzes your application portfolio, evaluates technical debt, and generates compared modernization scenarios — you save weeks of manual analysis and get recommendations based on real data."
      ),
      phases: [
        { name: t(lang, "Inventaire & Évaluation", "Inventory & Assessment"), duration: t(lang, "3 semaines", "3 weeks"), desc: t(lang, "Cartographie du parc applicatif, évaluation de la dette technique et analyse des dépendances.", "Application portfolio mapping, technical debt assessment, and dependency analysis.") },
        { name: t(lang, "Stratégie & Scénarios", "Strategy & Scenarios"), duration: t(lang, "3 semaines", "3 weeks"), desc: t(lang, "Définition de la cible, comparaison de scénarios (cloud, hybride, refactoring) et analyse coûts-bénéfices.", "Target definition, scenario comparison (cloud, hybrid, refactoring), and cost-benefit analysis.") },
        { name: t(lang, "Roadmap & Gouvernance", "Roadmap & Governance"), duration: t(lang, "2 semaines", "2 weeks"), desc: t(lang, "Feuille de route séquencée par vagues, estimation budgétaire et cadre de gouvernance.", "Wave-sequenced roadmap, budget estimation, and governance framework.") },
      ],
      deliverables: [
        t(lang, "Cartographie du parc applicatif", "Application portfolio mapping"),
        t(lang, "Évaluation de la dette technique", "Technical debt assessment"),
        t(lang, "Comparaison de scénarios de modernisation", "Modernization scenario comparison"),
        t(lang, "Roadmap de modernisation sur 18-24 mois", "18-24 month modernization roadmap"),
        t(lang, "Estimation budgétaire par vague", "Wave-by-wave budget estimation"),
      ],
      timeline: t(lang, "8-10 semaines", "8-10 weeks"),
      idealFor: [t(lang, "CIO / VP TI", "CIO / VP IT"), t(lang, "Directeur Architecture", "Architecture Director"), t(lang, "VP Infrastructure", "VP Infrastructure")],
      subServices: [
        { name: t(lang, "Audit de dette technique", "Technical Debt Audit"), price: t(lang, "15 000$", "$15,000"), desc: t(lang, "Évaluation approfondie de votre dette technique avec scoring par application et recommandations de remédiation.", "In-depth technical debt evaluation with per-application scoring and remediation recommendations."), deliverables: [t(lang, "Rapport de dette technique", "Technical debt report"), t(lang, "Scoring par application", "Per-application scoring"), t(lang, "Plan de remédiation priorisé", "Prioritized remediation plan")], timeline: t(lang, "3-4 semaines", "3-4 weeks") },
        { name: t(lang, "Stratégie cloud et migration", "Cloud Strategy & Migration"), price: t(lang, "25 000$", "$25,000"), desc: t(lang, "Définition de votre stratégie cloud (public, privé, hybride) avec plan de migration séquencé.", "Definition of your cloud strategy (public, private, hybrid) with sequenced migration plan."), deliverables: [t(lang, "Stratégie cloud", "Cloud strategy"), t(lang, "Plan de migration par vagues", "Wave-based migration plan"), t(lang, "Analyse financière CapEx/OpEx", "CapEx/OpEx financial analysis")], timeline: t(lang, "6-8 semaines", "6-8 weeks") },
        { name: t(lang, "Architecture d'entreprise cible", "Target Enterprise Architecture"), price: t(lang, "30 000$", "$30,000"), desc: t(lang, "Conception de l'architecture cible alignée sur votre stratégie d'affaires, incluant intégrations et sécurité.", "Target architecture design aligned with your business strategy, including integrations and security."), deliverables: [t(lang, "Architecture de référence", "Reference architecture"), t(lang, "Modèle d'intégration", "Integration model"), t(lang, "Roadmap d'implémentation", "Implementation roadmap")], timeline: t(lang, "8-10 semaines", "8-10 weeks") },
      ],
    },
    "roadmap-ia": {
      extendedDesc: t(lang,
        "Définissez votre trajectoire AI avec une roadmap personnalisée couvrant stratégie, maturité, gouvernance et déploiement d'outils. Nos consultants combinent leur expertise en intelligence artificielle avec notre plateforme de diagnostic pour des recommandations basées sur votre contexte réel.",
        "Define your AI trajectory with a personalized roadmap covering strategy, maturity, governance, and tool deployment. Our consultants combine their artificial intelligence expertise with our diagnostic platform for recommendations based on your actual context."
      ),
      differentiator: t(lang,
        "Notre diagnostic de maturité AI est propulsé par des algorithmes qui comparent votre organisation à plus de 200 benchmarks sectoriels — chaque recommandation est validée par des données réelles, puis enrichie par l'expérience terrain de nos consultants.",
        "Our AI maturity diagnostic is powered by algorithms that compare your organization against 200+ industry benchmarks — each recommendation is validated by real data, then enriched by our consultants' field experience."
      ),
      phases: [
        { name: t(lang, "Découverte & Diagnostic", "Discovery & Diagnostic"), duration: t(lang, "2 semaines", "2 weeks"), desc: t(lang, "Analyse de votre environnement technologique, entrevues parties prenantes et évaluation de maturité AI.", "Analysis of your technology environment, stakeholder interviews, and AI maturity assessment.") },
        { name: t(lang, "Idéation & Priorisation", "Ideation & Prioritization"), duration: t(lang, "3 semaines", "3 weeks"), desc: t(lang, "Identification et scoring des cas d'usage AI selon l'impact business, la faisabilité technique et l'effort requis.", "Identification and scoring of AI use cases based on business impact, technical feasibility, and required effort.") },
        { name: t(lang, "Architecture & Planning", "Architecture & Planning"), duration: t(lang, "4 semaines", "4 weeks"), desc: t(lang, "Conception de l'architecture cible, plan de données, estimation budgétaire et planification par vagues.", "Target architecture design, data plan, budget estimation, and wave-based planning.") },
        { name: t(lang, "Validation & Livraison", "Validation & Delivery"), duration: t(lang, "3 semaines", "3 weeks"), desc: t(lang, "Revue avec le comité exécutif, ajustements et livraison du document final.", "Executive committee review, adjustments, and final document delivery.") },
      ],
      deliverables: [
        t(lang, "Roadmap AI sur 12-18 mois", "12-18 month AI roadmap"),
        t(lang, "Matrice de priorisation des cas d'usage", "Use case prioritization matrix"),
        t(lang, "Estimation budgétaire par phase", "Phase-by-phase budget estimation"),
        t(lang, "Architecture cible de données et infrastructure", "Target data and infrastructure architecture"),
        t(lang, "Plan de gouvernance AI", "AI governance plan"),
        t(lang, "Présentation exécutive", "Executive presentation"),
      ],
      timeline: t(lang, "10-12 semaines", "10-12 weeks"),
      idealFor: [t(lang, "VP Technologie / CIO", "VP Technology / CIO"), t(lang, "Directeur Transformation", "Director of Transformation"), t(lang, "Comité exécutif", "Executive committee")],
      subServices: [
        { name: t(lang, "Évaluation de maturité AI", "AI Maturity Assessment"), price: t(lang, "8 000$", "$8,000"), desc: t(lang, "Diagnostic de votre maturité AI sur 6 dimensions avec benchmark sectoriel et plan d'action.", "Diagnostic of your AI maturity across 6 dimensions with industry benchmarking and action plan."), deliverables: [t(lang, "Rapport de maturité AI", "AI maturity report"), t(lang, "Benchmark sectoriel", "Industry benchmark"), t(lang, "Plan d'action priorisé", "Prioritized action plan")], timeline: t(lang, "3-4 semaines", "3-4 weeks") },
        { name: t(lang, "Gouvernance AI", "AI Governance"), price: t(lang, "15 000$", "$15,000"), desc: t(lang, "Cadre de gouvernance complet : politiques d'utilisation, conformité Loi 25 / EU AI Act, registre de modèles.", "Complete governance framework: usage policies, Bill 25 / EU AI Act compliance, model registry."), deliverables: [t(lang, "Politique d'utilisation de l'IA", "AI usage policy"), t(lang, "Guide de conformité", "Compliance guide"), t(lang, "Matrice RACI", "RACI matrix")], timeline: t(lang, "6-8 semaines", "6-8 weeks") },
        { name: t(lang, "Déploiement Copilot 365", "Copilot 365 Deployment"), price: t(lang, "20 000$", "$20,000"), desc: t(lang, "Programme complet de déploiement Microsoft Copilot : audit technique, pilote, rollout par vagues et gestion du changement.", "Complete Microsoft Copilot deployment program: technical audit, pilot, wave-based rollout, and change management."), deliverables: [t(lang, "Plan de déploiement", "Deployment plan"), t(lang, "Programme de formation", "Training program"), t(lang, "Dashboard d'adoption", "Adoption dashboard")], timeline: t(lang, "10-14 semaines", "10-14 weeks") },
        { name: t(lang, "Dossier d'affaires AI", "AI Business Case"), price: t(lang, "10 000$", "$10,000"), desc: t(lang, "Dossier d'affaires AI avec modèle financier ROI, benchmarks sectoriels et présentation exécutive.", "AI business case with ROI financial model, industry benchmarks, and executive presentation."), deliverables: [t(lang, "Dossier d'affaires complet", "Complete business case"), t(lang, "Modèle financier ROI", "ROI financial model"), t(lang, "Présentation exécutive", "Executive presentation")], timeline: t(lang, "2-3 semaines", "2-3 weeks") },
      ],
    },
    "performance-org": {
      extendedDesc: t(lang,
        "Renforcez les capacités humaines de votre organisation pour réussir vos transformations. Notre approche combine expertise en gestion du changement, design organisationnel et développement du leadership avec des outils AI qui accélèrent les diagnostics et personnalisent les interventions.",
        "Strengthen your organization's human capabilities to succeed in your transformations. Our approach combines change management expertise, organizational design, and leadership development with AI tools that accelerate diagnostics and personalize interventions."
      ),
      differentiator: t(lang,
        "Nos agents AI analysent les signaux organisationnels (sondages, communications, feedback) pour fournir des diagnostics en temps réel et personnaliser les interventions de changement — chaque employé reçoit un parcours adapté à son profil.",
        "Our AI agents analyze organizational signals (surveys, communications, feedback) to provide real-time diagnostics and personalize change interventions — each employee receives a journey adapted to their profile."
      ),
      phases: [
        { name: t(lang, "Diagnostic organisationnel", "Organizational Diagnostic"), duration: t(lang, "2 semaines", "2 weeks"), desc: t(lang, "Évaluation de la culture, de la readiness au changement et cartographie des parties prenantes.", "Culture assessment, change readiness evaluation, and stakeholder mapping.") },
        { name: t(lang, "Stratégie d'intervention", "Intervention Strategy"), duration: t(lang, "2 semaines", "2 weeks"), desc: t(lang, "Plan de changement, programme de formation, réseau d'ambassadeurs et plan de communication.", "Change plan, training program, ambassador network, and communication plan.") },
        { name: t(lang, "Exécution & Mesure", "Execution & Measurement"), duration: t(lang, "Continu", "Ongoing"), desc: t(lang, "Déploiement du plan, coaching, formation et mesure d'adoption en temps réel.", "Plan deployment, coaching, training, and real-time adoption measurement.") },
      ],
      deliverables: [
        t(lang, "Diagnostic organisationnel", "Organizational diagnostic"),
        t(lang, "Plan de gestion du changement", "Change management plan"),
        t(lang, "Programme de formation", "Training program"),
        t(lang, "Dashboard d'adoption en temps réel", "Real-time adoption dashboard"),
        t(lang, "Kit de communication", "Communication kit"),
      ],
      timeline: t(lang, "Continu (min. 8 semaines)", "Ongoing (min. 8 weeks)"),
      idealFor: [t(lang, "VP RH / CHRO", "VP HR / CHRO"), t(lang, "Directeur Transformation", "Director of Transformation"), t(lang, "VP Opérations", "VP Operations")],
      subServices: [
        { name: t(lang, "Gestion du changement", "Change Management"), price: t(lang, "15 000$", "$15,000"), desc: t(lang, "Programme complet de gestion du changement : analyse d'impact, plan de communication, formation et mesure d'adoption.", "Complete change management program: impact analysis, communication plan, training, and adoption measurement."), deliverables: [t(lang, "Plan de changement", "Change plan"), t(lang, "Kit de communication", "Communication kit"), t(lang, "Dashboard d'adoption", "Adoption dashboard")], timeline: t(lang, "8-12 semaines", "8-12 weeks") },
        { name: t(lang, "Design organisationnel", "Organizational Design"), price: t(lang, "20 000$", "$20,000"), desc: t(lang, "Conception de la structure organisationnelle cible : rôles, responsabilités, gouvernance et mécanismes de coordination.", "Target organizational structure design: roles, responsibilities, governance, and coordination mechanisms."), deliverables: [t(lang, "Organigramme cible", "Target org chart"), t(lang, "Fiches de poste", "Job descriptions"), t(lang, "Plan de transition", "Transition plan")], timeline: t(lang, "6-8 semaines", "6-8 weeks") },
        { name: t(lang, "Programme de leadership", "Leadership Program"), price: t(lang, "10 000$", "$10,000"), desc: t(lang, "Programme de développement du leadership adapté à votre contexte de transformation, avec coaching individuel et ateliers collectifs.", "Leadership development program adapted to your transformation context, with individual coaching and group workshops."), deliverables: [t(lang, "Programme de développement", "Development program"), t(lang, "Sessions de coaching", "Coaching sessions"), t(lang, "Évaluation 360°", "360° assessment")], timeline: t(lang, "Continu", "Ongoing") },
      ],
    },
  };
}

function getMarketplaceDetails(lang: Lang): Record<string, { extendedDesc: string; keyBenefits: { title: string; desc: string }[]; integrations: string[]; availability: string }> {
  return {
    hub: {
      extendedDesc: t(lang, "Talsom Forge Hub est la plateforme centrale qui intègre tous nos outils AI. Elle offre un espace de travail unifié pour piloter vos initiatives de transformation AI : diagnostics automatisés, génération de livrables personnalisés, chat expert et tableaux de bord de suivi en temps réel.", "Talsom Forge Hub is the central platform integrating all our AI tools. It offers a unified workspace to manage your AI transformation initiatives: automated diagnostics, personalized deliverable generation, expert chat, and real-time tracking dashboards."),
      keyBenefits: [
        { title: t(lang, "Espace de travail unifié", "Unified workspace"), desc: t(lang, "Tous vos projets AI sur une seule plateforme, avec vue d'ensemble et suivi.", "All your AI projects on one platform, with overview and tracking.") },
        { title: t(lang, "Livrables générés par AI", "AI-generated deliverables"), desc: t(lang, "Rapports, présentations et documents générés automatiquement et personnalisés.", "Reports, presentations, and documents generated automatically and customized.") },
        { title: t(lang, "Collaboration en temps réel", "Real-time collaboration"), desc: t(lang, "Partagez et collaborez avec vos équipes et consultants Talsom.", "Share and collaborate with your teams and Talsom consultants.") },
      ],
      integrations: ["Microsoft 365", "SharePoint", "Teams", "Power BI", "Slack", "Jira"],
      availability: t(lang, "Beta privée", "Private beta"),
    },
    backlog: {
      extendedDesc: t(lang, "AI Backlog Manager permet de centraliser, scorer et prioriser tous vos cas d'usage AI dans un portefeuille structuré. Le framework de scoring multicritère évalue chaque initiative selon l'impact business, la faisabilité technique, l'effort et l'alignement stratégique.", "AI Backlog Manager allows you to centralize, score, and prioritize all your AI use cases in a structured portfolio. The multi-criteria scoring framework evaluates each initiative based on business impact, technical feasibility, effort, and strategic alignment."),
      keyBenefits: [
        { title: t(lang, "Priorisation objective", "Objective prioritization"), desc: t(lang, "Framework de scoring sur 4 dimensions pour éliminer les biais de sélection.", "4-dimension scoring framework to eliminate selection bias.") },
        { title: t(lang, "Vue portefeuille", "Portfolio view"), desc: t(lang, "Visualisez tous vos cas d'usage sur une matrice impact/effort interactive.", "Visualize all your use cases on an interactive impact/effort matrix.") },
        { title: t(lang, "Suivi du ROI", "ROI tracking"), desc: t(lang, "Mesurez la valeur réalisée vs projetée pour chaque initiative déployée.", "Measure realized vs projected value for each deployed initiative.") },
      ],
      integrations: ["Jira", "Azure DevOps", "Notion", "Excel", "Power BI"],
      availability: t(lang, "Disponible", "Available"),
    },
    pia: {
      extendedDesc: t(lang, "Privacy Impact Assessor automatise la production d'Évaluations des Facteurs relatifs à la Vie Privée (EFVP) conformes à la Loi 25. Répondez à un questionnaire guidé et obtenez un rapport complet avec analyse de risques, mesures de mitigation et registre de conformité.", "Privacy Impact Assessor automates the production of Privacy Impact Assessments (PIA) compliant with Quebec's Bill 25. Answer a guided questionnaire and get a complete report with risk analysis, mitigation measures, and compliance registry."),
      keyBenefits: [
        { title: t(lang, "Conformité accélérée", "Accelerated compliance"), desc: t(lang, "De plusieurs semaines à quelques heures pour produire une EFVP complète.", "From several weeks to a few hours to produce a complete PIA.") },
        { title: t(lang, "Registre centralisé", "Centralized registry"), desc: t(lang, "Tous vos projets AI avec leur statut de conformité sur un seul tableau de bord.", "All your AI projects with their compliance status on a single dashboard.") },
        { title: t(lang, "Mises à jour réglementaires", "Regulatory updates"), desc: t(lang, "Le questionnaire évolue automatiquement avec les changements réglementaires.", "The questionnaire automatically evolves with regulatory changes.") },
      ],
      integrations: ["OneTrust", "Microsoft Purview", "ServiceNow", "Excel"],
      availability: t(lang, "Disponible", "Available"),
    },
    "governance-tool": {
      extendedDesc: t(lang, "AI Governance Suite est une solution complète pour implanter et opérer votre cadre de gouvernance AI. Elle inclut des modèles de politiques pré-rédigés, des workflows d'approbation automatisés, un registre de modèles AI et des tableaux de bord de conformité en temps réel.", "AI Governance Suite is a complete solution for implementing and operating your AI governance framework. It includes pre-drafted policy templates, automated approval workflows, an AI model registry, and real-time compliance dashboards."),
      keyBenefits: [
        { title: t(lang, "Politiques prêtes à l'emploi", "Ready-to-use policies"), desc: t(lang, "Modèles de politiques AI adaptés aux standards canadiens et européens.", "AI policy templates adapted to Canadian and European standards.") },
        { title: t(lang, "Workflows automatisés", "Automated workflows"), desc: t(lang, "Processus d'approbation, revue éthique et classification des risques automatisés.", "Automated approval processes, ethical review, and risk classification.") },
        { title: t(lang, "Audit trail complet", "Complete audit trail"), desc: t(lang, "Traçabilité complète de toutes les décisions et modifications de gouvernance.", "Full traceability of all governance decisions and changes.") },
      ],
      integrations: ["Microsoft 365", "ServiceNow", "Confluence", "Azure ML", "AWS SageMaker"],
      availability: t(lang, "Beta", "Beta"),
    },
  };
}

// ─── NAV ─────────────────────────────────────────────

function Nav() {
  const { lang, setLang } = useLang();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = lang === "fr"
    ? [{ label: "Services", href: "#services" }, { label: "Marketplace", href: "#marketplace" }, { label: "AI Chat", href: "#ai-chat" }, { label: "Tarification", href: "#tarification" }, { label: "Contact", href: "#contact" }]
    : [{ label: "Services", href: "#services" }, { label: "Marketplace", href: "#marketplace" }, { label: "AI Chat", href: "#ai-chat" }, { label: "Pricing", href: "#tarification" }, { label: "Contact", href: "#contact" }];

  const dark = theme === "dark";

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? (dark ? "bg-gray-950/90 backdrop-blur-lg shadow-sm border-b border-white/5" : "bg-white/90 backdrop-blur-lg shadow-sm border-b") : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.green }}>
            <Brain className="w-5 h-5" style={{ color: C.yellow }} />
          </div>
          <span className={`font-semibold text-lg tracking-tight ${scrolled ? (dark ? "text-white" : "text-gray-900") : "text-white"}`} style={HDR_FONT}>
            Talsom<span className="font-light opacity-70">Forge</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.label} href={l.href} className={`text-sm font-medium transition-colors ${scrolled ? (dark ? "text-white/50 hover:text-white" : "text-gray-500 hover:text-gray-900") : "text-white/60 hover:text-white"}`}>
              {l.label}
            </a>
          ))}

          {/* Language toggle */}
          <div className={`flex items-center gap-0.5 text-xs font-semibold rounded-full border px-1 py-0.5 ${scrolled ? (dark ? "border-white/10" : "border-gray-200") : "border-white/15"}`}>
            <button onClick={() => setLang("fr")} className={`px-2 py-0.5 rounded-full transition-all ${lang === "fr" ? "text-white" : scrolled ? (dark ? "text-white/40 hover:text-white/70" : "text-gray-400 hover:text-gray-600") : "text-white/40 hover:text-white/70"}`} style={lang === "fr" ? { background: C.green } : undefined}>FR</button>
            <button onClick={() => setLang("en")} className={`px-2 py-0.5 rounded-full transition-all ${lang === "en" ? "text-white" : scrolled ? (dark ? "text-white/40 hover:text-white/70" : "text-gray-400 hover:text-gray-600") : "text-white/40 hover:text-white/70"}`} style={lang === "en" ? { background: C.green } : undefined}>EN</button>
          </div>

          {/* Dark mode toggle */}
          <button onClick={toggle} className={`p-2 rounded-full transition-colors ${scrolled ? (dark ? "text-white/50 hover:text-white hover:bg-white/5" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100") : "text-white/50 hover:text-white hover:bg-white/10"}`} aria-label="Toggle theme">
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <a href="#contact">
            <Button size="sm" className="rounded-full px-5 font-semibold border-0 hover:opacity-90 transition-opacity" style={{ background: C.yellow, color: C.green }}>
              {t(lang, "Démo gratuite", "Free demo")}
            </Button>
          </a>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button onClick={toggle} className={`p-2 rounded-full ${scrolled ? (dark ? "text-white" : "text-gray-900") : "text-white"}`} aria-label="Toggle theme">
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button onClick={() => setOpen(!open)} aria-label={open ? t(lang, "Fermer le menu", "Close menu") : t(lang, "Ouvrir le menu", "Open menu")}>
            {open ? <X className={`w-5 h-5 ${scrolled ? (dark ? "text-white" : "text-gray-900") : "text-white"}`} /> : <Menu className={`w-5 h-5 ${scrolled ? (dark ? "text-white" : "text-gray-900") : "text-white"}`} />}
          </button>
        </div>
      </div>

      {open && (
        <div className={`md:hidden border-t p-4 space-y-3 ${dark ? "bg-gray-950 border-white/5" : "bg-white"}`}>
          {links.map((l) => (
            <a key={l.label} href={l.href} className={`block text-sm py-2 ${dark ? "text-white/70" : "text-gray-700"}`} onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          {/* Mobile lang toggle */}
          <div className="flex items-center gap-2 py-2">
            <button onClick={() => setLang("fr")} className={`text-xs font-semibold px-3 py-1 rounded-full ${lang === "fr" ? "text-white" : (dark ? "text-white/40 border border-white/10" : "text-gray-400 border border-gray-200")}`} style={lang === "fr" ? { background: C.green } : undefined}>FR</button>
            <button onClick={() => setLang("en")} className={`text-xs font-semibold px-3 py-1 rounded-full ${lang === "en" ? "text-white" : (dark ? "text-white/40 border border-white/10" : "text-gray-400 border border-gray-200")}`} style={lang === "en" ? { background: C.green } : undefined}>EN</button>
          </div>
          <a href="#contact" onClick={() => setOpen(false)}>
            <Button className="w-full rounded-full font-semibold" style={{ background: C.yellow, color: C.green }}>{t(lang, "Démo gratuite", "Free demo")}</Button>
          </a>
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
            {t(lang, "Le consulting virtuel,", "Virtual consulting,")}{" "}
            <span className="text-gradient">{t(lang, "réinventé.", "reinvented.")}</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/50 leading-relaxed mb-10 max-w-xl">
            {t(lang,
              "Accédez à l'expertise de consultants seniors, amplifiée par l'AI. Processus, modernisation, intelligence artificielle et performance organisationnelle — le tout sur une plateforme unique.",
              "Access senior consultant expertise, amplified by AI. Process design, modernization, artificial intelligence, and organizational performance — all on a single platform."
            )}
          </p>

          <div className="flex flex-wrap gap-4 mb-16">
            <a href="#services">
              <Button size="lg" className="rounded-full px-8 h-12 text-base font-semibold hover:opacity-90 border-0 transition-opacity" style={{ background: C.yellow, color: C.green }}>
                {t(lang, "Explorer les services", "Explore services")} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="#ai-chat">
              <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base text-white border-white/12 bg-white/5 hover:bg-white/10 hover:text-white transition-all">
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
  const { theme } = useTheme();
  const dark = theme === "dark";
  return (
    <section className={`border-b py-8 ${dark ? "bg-gray-950 border-white/5" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-6">
        <p className={`text-[10px] uppercase tracking-[0.2em] text-center mb-6 ${dark ? "text-white/25" : "text-gray-400"}`}>{t(lang, "Ils nous font confiance", "Trusted by")}</p>
        <div className={`flex flex-wrap items-center justify-center gap-x-12 gap-y-4 ${dark ? "opacity-20" : "opacity-30"}`}>
          {["Desjardins", "BNC", "Québecor", "CGI", "WSP", "Pomerleau", "STM", "Beneva"].map((n) => (
            <span key={n} className={`text-lg font-semibold tracking-tight ${dark ? "text-white" : "text-gray-900"}`}>{n}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SERVICE DETAIL SHEET ────────────────────────────

function ServiceDetailContent({ serviceId }: { serviceId: string }) {
  const { lang } = useLang();
  const services = getServices(lang);
  const allDetails = getServiceDetails(lang);
  const svc = services.find((s) => s.id === serviceId);
  const detail = allDetails[serviceId];
  if (!svc || !detail) return null;

  return (
    <ScrollArea className="h-full">
      <div className="p-6">
        <SheetHeader className="pr-6 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: C.greenLight }}>
              <svc.icon className="w-6 h-6" style={{ color: C.green }} />
            </div>
            <div className="flex-1">
              <SheetTitle className="text-xl font-bold" style={{ ...HDR_FONT, color: C.green }}>{svc.title}</SheetTitle>
              <SheetDescription className="text-xs">{svc.subtitle}</SheetDescription>
            </div>
          </div>
          {svc.popular && (
            <Badge className="mt-2 border-0 rounded-full text-[10px] px-2.5 font-semibold w-fit" style={{ background: C.green, color: C.yellow }}>{t(lang, "Populaire", "Popular")}</Badge>
          )}
        </SheetHeader>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {svc.tags.map((tag) => <Badge key={tag} variant="secondary" className="text-[10px] rounded-full bg-gray-50 text-gray-500 border-0 px-2.5">{tag}</Badge>)}
        </div>

        <p className="text-sm text-gray-600 leading-relaxed mb-5">{detail.extendedDesc}</p>

        {/* Differentiator callout */}
        <div className="rounded-xl p-4 mb-5 flex gap-3" style={{ background: C.greenLight }}>
          <Sparkles className="w-5 h-5 shrink-0 mt-0.5" style={{ color: C.green }} />
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: C.green }}>{t(lang, "Humain + AI : notre différenciateur", "Human + AI: our differentiator")}</p>
            <p className="text-xs leading-relaxed" style={{ color: C.greenMid }}>{detail.differentiator}</p>
          </div>
        </div>
        <Separator />

        {/* Sub-services accordion */}
        {detail.subServices.length > 0 && (
          <div className="py-5">
            <h4 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: C.green }}>
              <Briefcase className="w-4 h-4" />
              {t(lang, "Sous-services disponibles", "Available sub-services")}
            </h4>
            <Accordion type="single" collapsible className="space-y-2">
              {detail.subServices.map((sub, i) => (
                <AccordionItem key={i} value={`sub-${i}`} className="border border-gray-100 rounded-xl px-4 data-[state=open]:border-gray-200 data-[state=open]:bg-gray-50/50">
                  <AccordionTrigger className="text-sm font-semibold text-left py-3 hover:no-underline text-gray-900">
                    <div className="flex items-center gap-2 flex-1">
                      <span>{sub.name}</span>
                      <Badge variant="outline" className="text-[10px] px-2 py-0 h-5 rounded-full ml-auto mr-2">{sub.price}</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <p className="text-xs text-gray-500 leading-relaxed mb-3">{sub.desc}</p>
                    <div className="space-y-1.5 mb-3">
                      {sub.deliverables.map((d) => (
                        <div key={d} className="flex items-center gap-2 text-xs text-gray-600">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: C.greenMid }} />
                          {d}
                        </div>
                      ))}
                    </div>
                    <Badge variant="outline" className="text-[10px] px-2 py-0 h-5 rounded-full">
                      <Clock className="w-3 h-3 mr-1" />
                      {sub.timeline}
                    </Badge>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
        <Separator />

        {/* Phases */}
        <div className="py-5">
          <h4 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: C.green }}>
            <Layers className="w-4 h-4" />
            {t(lang, "Notre approche", "Our approach")}
          </h4>
          <div className="space-y-4">
            {detail.phases.map((phase, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5" style={{ background: C.yellow, color: C.green }}>{i + 1}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-gray-900">{phase.name}</p>
                    <Badge variant="outline" className="text-[10px] px-2 py-0 h-5 rounded-full">{phase.duration}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{phase.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Separator />

        {/* Deliverables */}
        <div className="py-5">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: C.green }}>
            <CheckCircle2 className="w-4 h-4" />
            {t(lang, "Livrables", "Deliverables")}
          </h4>
          <div className="space-y-2">
            {detail.deliverables.map((d) => (
              <div key={d} className="flex items-start gap-2.5 text-sm text-gray-600">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: C.greenMid }} />
                {d}
              </div>
            ))}
          </div>
        </div>
        <Separator />

        {/* Ideal for */}
        <div className="py-5">
          <h4 className="text-sm font-semibold mb-3" style={{ color: C.green }}>{t(lang, "Idéal pour", "Ideal for")}</h4>
          <div className="flex flex-wrap gap-2">
            {detail.idealFor.map((p) => (
              <Badge key={p} variant="secondary" className="rounded-full text-xs bg-gray-50 text-gray-600 px-3">{p}</Badge>
            ))}
          </div>
        </div>
        <Separator />

        {/* Footer CTA */}
        <div className="pt-5 pb-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">{t(lang, "À partir de", "Starting at")}</p>
              <p className="text-lg font-bold" style={{ ...HDR_FONT, color: C.green }}>{svc.price}</p>
            </div>
            <Badge variant="outline" className="text-xs rounded-full px-3 flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              {detail.timeline}
            </Badge>
          </div>
          <a href="#contact">
            <Button className="w-full rounded-full font-semibold hover:opacity-90 border-0 mb-2 transition-opacity" style={{ background: C.yellow, color: C.green }}>
              {t(lang, "Demander une consultation", "Request a consultation")} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
          <a href="#contact">
            <Button variant="outline" className="w-full rounded-full text-sm">
              {t(lang, "Planifier un appel", "Schedule a call")}
            </Button>
          </a>
        </div>
      </div>
    </ScrollArea>
  );
}

// ─── MARKETPLACE DETAIL SHEET ────────────────────────

function MarketplaceDetailContent({ productId }: { productId: string }) {
  const { lang } = useLang();
  const products = getMarketplace(lang);
  const allDetails = getMarketplaceDetails(lang);
  const product = products.find((p) => p.id === productId);
  const detail = allDetails[productId];
  if (!product || !detail) return null;

  return (
    <ScrollArea className="h-full">
      <div className="p-6">
        <SheetHeader className="pr-6 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={`${product.badgeCls} border rounded-full text-[10px] px-2.5`}>{product.tier}</Badge>
            <Badge className="rounded-full text-[10px] px-2.5 border" style={{ background: C.yellowLight, color: C.green, borderColor: C.yellowDark + "40" }}>{detail.availability}</Badge>
          </div>
          <SheetTitle className="text-xl font-bold" style={{ ...HDR_FONT, color: C.green }}>{product.name}</SheetTitle>
          <SheetDescription>{product.tagline}</SheetDescription>
        </SheetHeader>

        {/* Screenshot placeholder */}
        <div className="mb-5 rounded-xl border border-gray-100 h-40 flex items-center justify-center" style={{ background: C.silverLight }}>
          <div className="text-center text-gray-300">
            <Bot className="w-8 h-8 mx-auto mb-2" />
            <p className="text-xs">{t(lang, "Aperçu à venir", "Preview coming soon")}</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed mb-5">{detail.extendedDesc}</p>
        <Separator />

        {/* Features */}
        <div className="py-5">
          <h4 className="text-sm font-semibold mb-3" style={{ color: C.green }}>{t(lang, "Fonctionnalités", "Features")}</h4>
          <div className="space-y-2">
            {product.features.map((f) => (
              <div key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: C.yellow }} />
                {f}
              </div>
            ))}
          </div>
        </div>
        <Separator />

        {/* Key benefits */}
        <div className="py-5">
          <h4 className="text-sm font-semibold mb-3" style={{ color: C.green }}>{t(lang, "Avantages clés", "Key benefits")}</h4>
          <div className="space-y-4">
            {detail.keyBenefits.map((b, i) => (
              <div key={i}>
                <p className="text-sm font-medium text-gray-900">{b.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <Separator />

        {/* Integrations */}
        <div className="py-5">
          <h4 className="text-sm font-semibold mb-3" style={{ color: C.green }}>{t(lang, "Intégrations", "Integrations")}</h4>
          <div className="flex flex-wrap gap-2">
            {detail.integrations.map((intg) => (
              <Badge key={intg} variant="secondary" className="rounded-full text-xs bg-gray-50 text-gray-600 px-3">{intg}</Badge>
            ))}
          </div>
        </div>
        <Separator />

        {/* Footer CTA */}
        <div className="pt-5 pb-2">
          <a href="#contact">
            <Button className="w-full rounded-full font-semibold hover:opacity-90 border-0 mb-2 transition-opacity" style={{ background: C.green, color: C.yellow }}>
              {t(lang, "Demander un accès", "Request access")} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
          <Button variant="outline" className="w-full rounded-full text-sm">
            {t(lang, "Voir la documentation", "View documentation")}
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}

// ─── SERVICES ────────────────────────────────────────

function ServicesSection() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const services = getServices(lang);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const ref = useReveal();
  return (
    <section id="services" className={`py-24 ${dark ? "bg-gray-950" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div ref={ref} className="reveal max-w-2xl mb-16">
          <Badge className="mb-4 border-0 rounded-full px-3 text-xs font-semibold" style={{ background: C.yellowLight, color: C.green }}>{t(lang, "Services virtuels", "Virtual services")}</Badge>
          <h2 className={`text-4xl font-bold tracking-tight mb-4 ${dark ? "text-white" : ""}`} style={{ ...HDR_FONT, color: dark ? undefined : C.green }}>
            {lang === "fr" ? <>Du consulting virtuel,<br />propulsé par l'AI.</> : <>Virtual consulting,<br />powered by AI.</>}
          </h2>
          <p className={`text-lg leading-relaxed ${dark ? "text-white/45" : "text-gray-500"}`}>
            {t(lang,
              "Choisissez parmi nos 4 domaines d'expertise. Chaque service combine l'accompagnement de consultants seniors avec la puissance de nos agents AI.",
              "Choose from our 4 areas of expertise. Each service combines senior consultant guidance with the power of our AI agents."
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 reveal-stagger">
          {services.map((svc) => (
            <Card key={svc.id} className={`reveal group relative border hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden ${dark ? "bg-gray-900 border-white/5 hover:border-white/10" : "border-gray-100 hover:border-gray-200"}`}>
              {svc.popular && (
                <div className="absolute top-4 right-4">
                  <Badge className="border-0 rounded-full text-[10px] px-2.5 font-semibold" style={{ background: C.green, color: C.yellow }}>{t(lang, "Populaire", "Popular")}</Badge>
                </div>
              )}
              <CardHeader className="pb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 ${dark ? "bg-white/5" : "bg-gray-50"}`}>
                  <svc.icon className={`w-5 h-5 ${dark ? "text-white/40" : "text-gray-400"}`} />
                </div>
                <CardTitle className={`text-lg font-semibold ${dark ? "text-white" : "text-gray-900"}`}>{svc.title}</CardTitle>
                <p className={`text-xs font-medium ${dark ? "text-white/30" : "text-gray-400"}`}>{svc.subtitle}</p>
              </CardHeader>
              <CardContent>
                <p className={`text-sm leading-relaxed mb-4 ${dark ? "text-white/45" : "text-gray-500"}`}>{svc.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {svc.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className={`text-[10px] rounded-full border-0 px-2.5 ${dark ? "bg-white/5 text-white/40" : "bg-gray-50 text-gray-500"}`}>{tag}</Badge>
                  ))}
                </div>
                <Separator className={dark ? "bg-white/5" : ""} />
                <div className="flex items-center justify-between mt-4">
                  <span className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-900"}`}>{svc.price}</span>
                  <Button variant="ghost" size="sm" className="rounded-full px-3 text-xs font-semibold hover:scale-105 transition-transform" style={{ color: dark ? C.yellow : C.green }} onClick={() => setSelectedId(svc.id)}>
                    {t(lang, "Découvrir", "Discover")} <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Sheet open={!!selectedId} onOpenChange={(open) => { if (!open) setSelectedId(null); }}>
        <SheetContent side="right" className="w-full sm:max-w-xl p-0">
          {selectedId && <ServiceDetailContent serviceId={selectedId} />}
        </SheetContent>
      </Sheet>
    </section>
  );
}

// ─── HOW IT WORKS ────────────────────────────────────

function HowItWorks() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const ref = useReveal();
  const steps = lang === "fr"
    ? [
        { icon: Target, title: "Choisissez", desc: "Sélectionnez un domaine d'expertise parmi nos 4 catégories de services." },
        { icon: MessageSquare, title: "Échangez", desc: "Affinez votre besoin avec nos consultants seniors et notre chat AI expert." },
        { icon: Zap, title: "Recevez", desc: "Obtenez vos livrables co-produits par nos consultants et agents AI." },
        { icon: TrendingUp, title: "Itérez", desc: "Améliorez continuellement avec le suivi et les recommandations." },
      ]
    : [
        { icon: Target, title: "Choose", desc: "Select an area of expertise from our 4 service categories." },
        { icon: MessageSquare, title: "Discuss", desc: "Refine your needs with our senior consultants and expert AI chat." },
        { icon: Zap, title: "Receive", desc: "Get your deliverables co-produced by our consultants and AI agents." },
        { icon: TrendingUp, title: "Iterate", desc: "Continuously improve with tracking and recommendations." },
      ];

  return (
    <section className="py-24" style={{ background: dark ? "#071716" : C.silverLight }}>
      <div className="max-w-7xl mx-auto px-6">
        <div ref={ref} className="reveal text-center max-w-2xl mx-auto mb-16">
          <Badge className="mb-4 border-0 rounded-full px-3 text-xs font-semibold" style={{ background: dark ? "rgba(0,53,51,0.5)" : C.greenLight, color: dark ? C.yellow : C.green }}>{t(lang, "Comment ça marche", "How it works")}</Badge>
          <h2 className={`text-4xl font-bold tracking-tight mb-4 ${dark ? "text-white" : ""}`} style={{ ...HDR_FONT, color: dark ? undefined : C.green }}>{t(lang, "Du besoin au livrable en quelques clics", "From need to deliverable in a few clicks")}</h2>
          <p className={dark ? "text-white/40" : "text-gray-500"}>{t(lang, "Notre plateforme combine l'automatisation AI avec l'expertise humaine pour vous livrer des résultats de qualité consulting, plus rapidement.", "Our platform combines AI automation with human expertise to deliver consulting-grade results, faster.")}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 reveal-stagger">
          {steps.map((step, i) => (
            <div key={step.title} className="reveal relative">
              {i < steps.length - 1 && <div className="hidden lg:block absolute top-8 left-[calc(50%+32px)] w-[calc(100%-64px)] h-px" style={{ background: dark ? "rgba(255,255,255,0.06)" : C.silver }} />}
              <div className="text-center">
                <div className={`w-16 h-16 rounded-2xl border shadow-sm flex items-center justify-center mx-auto mb-4 relative group hover:scale-105 transition-transform duration-300 ${dark ? "bg-gray-900 border-white/5" : "bg-white border-gray-100"}`}>
                  <step.icon className="w-7 h-7" style={{ color: dark ? C.yellow : C.green }} />
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center" style={{ background: C.yellow, color: C.green }}>
                    {i + 1}
                  </div>
                </div>
                <h3 className={`font-semibold mb-2 ${dark ? "text-white" : "text-gray-900"}`}>{step.title}</h3>
                <p className={`text-sm leading-relaxed ${dark ? "text-white/40" : "text-gray-500"}`}>{step.desc}</p>
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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const ref = useReveal();
  return (
    <section id="marketplace" className="bg-dark-section py-24 relative overflow-hidden">
      <div className="absolute inset-0 chevron-pattern opacity-50" />
      <div className="relative max-w-7xl mx-auto px-6">
        <div ref={ref} className="reveal max-w-2xl mb-16">
          <Badge className="mb-4 bg-white/5 text-white/50 border-white/8 rounded-full px-3 text-xs">Marketplace</Badge>
          <h2 className="text-4xl font-bold text-white tracking-tight mb-4" style={HDR_FONT}>
            Talsom Forge <span style={{ color: C.yellow }}>Hub</span>
          </h2>
          <p className="text-lg text-white/40 leading-relaxed">{t(lang, "Nos outils AI propriétaires, conçus par des consultants pour des consultants. Intégrez-les dans vos processus ou utilisez-les en autonomie.", "Our proprietary AI tools, designed by consultants for consultants. Integrate them into your processes or use them independently.")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 reveal-stagger">
          {products.map((p) => (
            <div key={p.id} className="reveal glass-card rounded-2xl p-6 hover:bg-white/[0.06] transition-all duration-300 group hover:translate-y-[-2px]">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge className={`${p.badgeCls} border rounded-full text-[10px] px-2.5 mb-3`}>{p.tier}</Badge>
                  <h3 className="text-xl font-semibold text-white mb-1">{p.name}</h3>
                  <p className="text-sm text-white/35">{p.tagline}</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-white/15 group-hover:text-white/50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
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
              <Button variant="outline" size="sm" className="rounded-full border-white/8 text-white/60 bg-transparent hover:bg-white/8 hover:text-white w-full transition-all" onClick={() => setSelectedId(p.id)}>{t(lang, "En savoir plus", "Learn more")}</Button>
            </div>
          ))}
        </div>
      </div>

      <Sheet open={!!selectedId} onOpenChange={(open) => { if (!open) setSelectedId(null); }}>
        <SheetContent side="right" className="w-full sm:max-w-xl p-0">
          {selectedId && <MarketplaceDetailContent productId={selectedId} />}
        </SheetContent>
      </Sheet>
    </section>
  );
}

// ─── TESTIMONIALS ────────────────────────────────────

function Testimonials() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const testimonials = getTestimonials(lang);
  const ref = useReveal();

  return (
    <section className={`py-24 ${dark ? "bg-gray-950" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div ref={ref} className="reveal text-center max-w-2xl mx-auto mb-16">
          <Badge className="mb-4 border-0 rounded-full px-3 text-xs font-semibold" style={{ background: C.yellowLight, color: C.green }}>{t(lang, "Témoignages", "Testimonials")}</Badge>
          <h2 className={`text-4xl font-bold tracking-tight mb-4 ${dark ? "text-white" : ""}`} style={{ ...HDR_FONT, color: dark ? undefined : C.green }}>{t(lang, "Ce que disent nos clients", "What our clients say")}</h2>
          <p className={dark ? "text-white/40" : "text-gray-500"}>{t(lang, "Des leaders de l'industrie nous font confiance pour accélérer leur transformation.", "Industry leaders trust us to accelerate their transformation.")}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 reveal-stagger">
          {testimonials.map((tm) => (
            <Card key={tm.name} className={`reveal rounded-2xl border transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] ${dark ? "bg-gray-900 border-white/5" : "border-gray-100"}`}>
              <CardContent className="pt-6">
                <Quote className="w-8 h-8 mb-4 opacity-15" style={{ color: C.yellow }} />
                <p className={`text-sm leading-relaxed mb-6 ${dark ? "text-white/60" : "text-gray-600"}`}>{tm.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: C.greenLight, color: C.green }}>
                    {tm.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-900"}`}>{tm.name}</p>
                    <p className={`text-xs ${dark ? "text-white/35" : "text-gray-400"}`}>{tm.role} · {tm.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
  const { theme } = useTheme();
  const dark = theme === "dark";
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
  const ref = useReveal();

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
        { icon: Brain, text: "Expertise processus, modernisation, AI et performance" },
        { icon: BookOpen, text: "Génération de diagnostics, roadmaps et analyses" },
        { icon: Lock, text: "Conformité Loi 25, EU AI Act, RGPD" },
        { icon: Globe, text: "Bilingue français / anglais" },
      ]
    : [
        { icon: Brain, text: "Process, modernization, AI, and performance expertise" },
        { icon: BookOpen, text: "Diagnostic, roadmap, and analysis generation" },
        { icon: Lock, text: "Bill 25, EU AI Act, GDPR compliance" },
        { icon: Globe, text: "Bilingual French / English" },
      ];

  return (
    <section id="ai-chat" className={`py-24 ${dark ? "bg-gray-950" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div ref={ref} className="reveal lg:sticky lg:top-32">
            <Badge className="mb-4 border-0 rounded-full px-3 text-xs font-semibold" style={{ background: C.yellowLight, color: C.green }}>AI Chat Expert</Badge>
            <h2 className={`text-4xl font-bold tracking-tight mb-4 ${dark ? "text-white" : ""}`} style={{ ...HDR_FONT, color: dark ? undefined : C.green }}>
              {lang === "fr" ? <>Votre consultant virtuel,<br />disponible 24/7.</> : <>Your virtual consultant,<br />available 24/7.</>}
            </h2>
            <p className={`text-lg leading-relaxed mb-8 ${dark ? "text-white/45" : "text-gray-500"}`}>{t(lang, "Notre chat AI est entraîné sur des milliers de mandats de consulting : processus, modernisation, AI et performance organisationnelle. Il pose les bonnes questions et génère des livrables prêts à l'emploi.", "Our AI chat is trained on thousands of consulting engagements: process, modernization, AI, and organizational performance. It asks the right questions and generates ready-to-use deliverables.")}</p>
            <div className="space-y-4">
              {chatFeatures.map((it) => (
                <div key={it.text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: dark ? "rgba(0,53,51,0.5)" : C.greenLight }}>
                    <it.icon className="w-4 h-4" style={{ color: dark ? C.yellow : C.green }} />
                  </div>
                  <span className={`text-sm ${dark ? "text-white/60" : "text-gray-600"}`}>{it.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-2xl border overflow-hidden shadow-lg ${dark ? "border-white/5" : "border-gray-100"}`} style={{ background: dark ? "#0a1f1e" : C.silverLight }}>
            <div className={`px-5 py-4 border-b flex items-center gap-3 ${dark ? "bg-gray-900 border-white/5" : "bg-white border-gray-100"}`}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: C.green }}>
                <Bot className="w-5 h-5" style={{ color: C.yellow }} />
              </div>
              <div>
                <p className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-900"}`}>Talsom Forge Consultant</p>
                <p className="text-[11px] flex items-center gap-1" style={{ color: C.greenMid }}>
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#4AE0D2" }} /> {t(lang, "En ligne", "Online")}
                </p>
              </div>
              <Badge className="ml-auto border-0 text-[10px] rounded-full font-semibold" style={{ background: C.yellowLight, color: C.green }}>Demo</Badge>
            </div>

            <div className="h-[440px] overflow-y-auto px-5 py-5 space-y-4">
              {messages.length === 0 && !typing && (
                <div className="flex justify-start chat-bubble-in">
                  <div className={`max-w-[85%] rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed shadow-sm ${dark ? "bg-gray-900 border border-white/5 text-white/70" : "bg-white border border-gray-100 text-gray-700"}`}>
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
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === "user" ? "text-white rounded-br-md" : (dark ? "bg-gray-900 border border-white/5 text-white/70 rounded-bl-md" : "bg-white border border-gray-100 text-gray-700 rounded-bl-md shadow-sm")}`} style={m.role === "user" ? { background: C.green } : undefined}>
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
                  <div className={`rounded-2xl rounded-bl-md px-4 py-3 shadow-sm ${dark ? "bg-gray-900 border border-white/5" : "bg-white border border-gray-100"}`}>
                    <div className="flex gap-1.5">
                      {[0, 150, 300].map((d) => <span key={d} className="w-2 h-2 rounded-full animate-bounce" style={{ background: C.silver, animationDelay: `${d}ms` }} />)}
                    </div>
                  </div>
                </div>
              )}

              {demoEnded && (
                <div className="chat-bubble-in flex flex-col items-center gap-3 py-4">
                  <p className={`text-xs ${dark ? "text-white/25" : "text-gray-400"}`}>{t(lang, "Fin de la démo interactive", "End of interactive demo")}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className={`rounded-full text-xs ${dark ? "border-white/10" : "border-gray-200"}`} onClick={restart}>
                      {t(lang, "Recommencer la démo", "Restart demo")}
                    </Button>
                    <Button size="sm" className="rounded-full text-xs border-0 hover:opacity-90 transition-opacity" style={{ background: C.yellow, color: C.green }}>
                      {t(lang, "Accéder au chat complet", "Access full chat")}
                    </Button>
                  </div>
                </div>
              )}
              <div ref={chatEnd} />
            </div>

            <div className={`border-t p-4 ${dark ? "bg-gray-900 border-white/5" : "bg-white border-gray-100"}`}>
              <div className="flex gap-2">
                <Input
                  placeholder={demoEnded ? t(lang, "Démo terminée — recommencez ou accédez au chat complet", "Demo ended — restart or access full chat") : t(lang, "Posez une question sur vos enjeux d'affaires…", "Ask a question about your business challenges…")}
                  value={inputVal}
                  readOnly
                  onKeyDown={(e: React.KeyboardEvent) => e.key === "Enter" && handleSend()}
                  className={`rounded-full text-sm cursor-default ${dark ? "border-white/10 bg-white/5 text-white" : "border-gray-200 bg-gray-50"}`}
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={busy.current || demoEnded}
                  className="rounded-full shrink-0 hover:opacity-90 border-0 disabled:opacity-40 transition-opacity"
                  style={{ background: C.green, color: C.yellow }}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className={`text-[10px] mt-2 text-center ${dark ? "text-white/20" : "text-gray-400"}`}>
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
  const { theme } = useTheme();
  const dark = theme === "dark";
  const plans = getPlans(lang);
  const ref = useReveal();

  return (
    <section id="tarification" className="py-24" style={{ background: dark ? "#071716" : C.silverLight }}>
      <div className="max-w-7xl mx-auto px-6">
        <div ref={ref} className="reveal text-center max-w-2xl mx-auto mb-16">
          <Badge className="mb-4 border-0 rounded-full px-3 text-xs font-semibold" style={{ background: C.yellowLight, color: C.green }}>{t(lang, "Tarification", "Pricing")}</Badge>
          <h2 className={`text-4xl font-bold tracking-tight mb-4 ${dark ? "text-white" : ""}`} style={{ ...HDR_FONT, color: dark ? undefined : C.green }}>{t(lang, "Un plan pour chaque ambition", "A plan for every ambition")}</h2>
          <p className={dark ? "text-white/40" : "text-gray-500"}>{t(lang, "Commencez gratuitement, montez en puissance quand vous êtes prêts.", "Start free, scale up when you're ready.")}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto reveal-stagger">
          {plans.map((p) => (
            <Card key={p.name} className={`reveal rounded-2xl overflow-hidden transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl ${p.highlight ? "border-2 shadow-xl relative" : ""} ${dark ? "bg-gray-900 border-white/5" : "border-gray-100"}`} style={p.highlight ? { borderColor: C.green } : undefined}>
              {p.highlight && <div className="absolute top-0 inset-x-0 h-1" style={{ background: `linear-gradient(90deg, ${C.green}, ${C.yellow})` }} />}
              <CardHeader>
                <p className={`text-sm font-medium mb-1 ${dark ? "text-white/30" : "text-gray-400"}`}>{p.sub}</p>
                <CardTitle className={`text-xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>{p.name}</CardTitle>
                <p className="text-3xl font-bold mt-2" style={{ ...HDR_FONT, color: dark ? C.yellow : C.green }}>{p.price}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  {p.features.map((f) => (
                    <div key={f} className={`flex items-start gap-2.5 text-sm ${dark ? "text-white/50" : "text-gray-600"}`}>
                      <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: C.greenMid }} />
                      {f}
                    </div>
                  ))}
                </div>
                <Button className={`w-full rounded-full font-semibold transition-all ${p.highlight ? "hover:opacity-90 border-0" : (dark ? "bg-white/5 border border-white/10 text-white hover:bg-white/10" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50")}`} style={p.highlight ? { background: C.yellow, color: C.green } : undefined}>
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

// ─── FAQ ─────────────────────────────────────────────

function FAQSection() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const faq = getFAQ(lang);
  const ref = useReveal();

  return (
    <section className={`py-24 ${dark ? "bg-gray-950" : "bg-white"}`}>
      <div className="max-w-3xl mx-auto px-6">
        <div ref={ref} className="reveal text-center mb-16">
          <Badge className="mb-4 border-0 rounded-full px-3 text-xs font-semibold" style={{ background: C.yellowLight, color: C.green }}>FAQ</Badge>
          <h2 className={`text-4xl font-bold tracking-tight mb-4 ${dark ? "text-white" : ""}`} style={{ ...HDR_FONT, color: dark ? undefined : C.green }}>{t(lang, "Questions fréquentes", "Frequently asked questions")}</h2>
          <p className={dark ? "text-white/40" : "text-gray-500"}>{t(lang, "Tout ce que vous devez savoir pour commencer.", "Everything you need to know to get started.")}</p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faq.map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className={`border rounded-xl px-5 transition-all ${dark ? "border-white/5 data-[state=open]:border-white/10 data-[state=open]:bg-white/[0.02]" : "border-gray-100 data-[state=open]:border-gray-200 data-[state=open]:bg-gray-50/50"}`}>
              <AccordionTrigger className={`text-sm font-semibold text-left py-4 hover:no-underline ${dark ? "text-white" : "text-gray-900"}`}>
                {item.q}
              </AccordionTrigger>
              <AccordionContent className={`text-sm leading-relaxed pb-4 ${dark ? "text-white/50" : "text-gray-500"}`}>
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

// ─── CONTACT FORM ────────────────────────────────────

function ContactSection() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [sent, setSent] = useState(false);
  const ref = useReveal();

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // In production, connect to email API (Resend, EmailJS, etc.)
    // For now, open mailto
    const subject = encodeURIComponent(`[Talsom Forge] ${t(lang, "Demande de", "Request from")} ${form.name}`);
    const body = encodeURIComponent(`${t(lang, "Nom", "Name")}: ${form.name}\n${t(lang, "Courriel", "Email")}: ${form.email}\n${t(lang, "Entreprise", "Company")}: ${form.company}\n\n${form.message}`);
    window.open(`mailto:info@talsom.com?subject=${subject}&body=${body}`, "_blank");
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  }, [form, lang]);

  return (
    <section id="contact" className="py-24" style={{ background: dark ? "#071716" : C.silverLight }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <div ref={ref} className="reveal">
            <Badge className="mb-4 border-0 rounded-full px-3 text-xs font-semibold" style={{ background: C.yellowLight, color: C.green }}>{t(lang, "Contact", "Contact")}</Badge>
            <h2 className={`text-4xl font-bold tracking-tight mb-4 ${dark ? "text-white" : ""}`} style={{ ...HDR_FONT, color: dark ? undefined : C.green }}>
              {t(lang, "Parlons de votre projet", "Let's talk about your project")}
            </h2>
            <p className={`text-lg leading-relaxed mb-8 ${dark ? "text-white/45" : "text-gray-500"}`}>
              {t(lang,
                "Que vous souhaitiez une démo, un accès beta ou un accompagnement personnalisé, notre équipe est disponible pour vous guider.",
                "Whether you want a demo, beta access, or personalized guidance, our team is available to help."
              )}
            </p>
            <div className="space-y-4">
              {[
                { icon: Mail, text: "info@talsom.com" },
                { icon: MapPin, text: t(lang, "Montréal, QC, Canada", "Montreal, QC, Canada") },
                { icon: Globe, text: t(lang, "talsom.com", "talsom.com") },
              ].map((c) => (
                <div key={c.text} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: dark ? "rgba(0,53,51,0.5)" : C.greenLight }}>
                    <c.icon className="w-4 h-4" style={{ color: dark ? C.yellow : C.green }} />
                  </div>
                  <span className={`text-sm ${dark ? "text-white/60" : "text-gray-600"}`}>{c.text}</span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className={`rounded-2xl border p-6 space-y-4 ${dark ? "bg-gray-900 border-white/5" : "bg-white border-gray-100"}`}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={`text-xs font-medium mb-1.5 block ${dark ? "text-white/50" : "text-gray-500"}`}>
                  <User className="w-3 h-3 inline mr-1" />{t(lang, "Nom complet", "Full name")}
                </label>
                <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jean Dupont" className={`rounded-lg ${dark ? "bg-white/5 border-white/10 text-white placeholder:text-white/20" : ""}`} />
              </div>
              <div>
                <label className={`text-xs font-medium mb-1.5 block ${dark ? "text-white/50" : "text-gray-500"}`}>
                  <Mail className="w-3 h-3 inline mr-1" />{t(lang, "Courriel", "Email")}
                </label>
                <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jean@entreprise.com" className={`rounded-lg ${dark ? "bg-white/5 border-white/10 text-white placeholder:text-white/20" : ""}`} />
              </div>
            </div>
            <div>
              <label className={`text-xs font-medium mb-1.5 block ${dark ? "text-white/50" : "text-gray-500"}`}>
                <Building2 className="w-3 h-3 inline mr-1" />{t(lang, "Entreprise", "Company")}
              </label>
              <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder={t(lang, "Votre entreprise", "Your company")} className={`rounded-lg ${dark ? "bg-white/5 border-white/10 text-white placeholder:text-white/20" : ""}`} />
            </div>
            <div>
              <label className={`text-xs font-medium mb-1.5 block ${dark ? "text-white/50" : "text-gray-500"}`}>
                <MessageSquare className="w-3 h-3 inline mr-1" />{t(lang, "Message", "Message")}
              </label>
              <textarea
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={4}
                placeholder={t(lang, "Décrivez votre projet ou posez vos questions…", "Describe your project or ask your questions…")}
                className={`w-full rounded-lg border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring ${dark ? "bg-white/5 border-white/10 text-white placeholder:text-white/20" : "border-gray-200 bg-gray-50"}`}
              />
            </div>
            <Button type="submit" className="w-full rounded-full font-semibold hover:opacity-90 border-0 transition-all" style={{ background: C.yellow, color: C.green }}>
              {sent ? (
                <><CheckCircle2 className="w-4 h-4 mr-2" />{t(lang, "Message ouvert!", "Message opened!")}</>
              ) : (
                <><Send className="w-4 h-4 mr-2" />{t(lang, "Envoyer le message", "Send message")}</>
              )}
            </Button>
            <p className={`text-[10px] text-center ${dark ? "text-white/20" : "text-gray-400"}`}>
              {t(lang, "Nous répondons généralement sous 24h.", "We typically respond within 24 hours.")}
            </p>
          </form>
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
        <h2 className="text-4xl font-bold text-white tracking-tight mb-4" style={HDR_FONT}>{t(lang, "Prêt à transformer votre organisation?", "Ready to transform your organization?")}</h2>
        <p className="text-lg text-white/45 mb-8">{t(lang, "Rejoignez la beta et accédez à l'expertise de Talsom Forge — consultants seniors et AI, disponibles en quelques clics.", "Join the beta and access Talsom Forge expertise — senior consultants and AI, available in just a few clicks.")}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#contact">
            <Button size="lg" className="rounded-full px-8 h-12 font-semibold hover:opacity-90 border-0 transition-opacity" style={{ background: C.yellow, color: C.green }}>
              {t(lang, "Demander un accès beta", "Request beta access")} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
          <a href="#contact">
            <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-white border-white/12 bg-white/5 hover:bg-white/10 hover:text-white transition-all">
              {t(lang, "Planifier une démo", "Schedule a demo")}
            </Button>
          </a>
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
        { title: "Services", links: ["Business et Process Design", "Roadmap de modernisation", "Roadmap IA", "Performance organisationnelle"] },
        { title: "Marketplace", links: ["Talsom Forge Hub", "AI Backlog Manager", "Privacy Assessor", "Governance Suite"] },
        { title: "Entreprise", links: ["À propos", "Carrières", "Blog", "Contact", "Mentions légales"] },
      ]
    : [
        { title: "Services", links: ["Business & Process Design", "Modernization Roadmap", "AI Roadmap", "Organizational Performance"] },
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
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("talsom-theme");
      if (saved === "dark" || saved === "light") return saved;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("talsom-theme", theme);
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => t === "dark" ? "light" : "dark"), []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <LangContext.Provider value={{ lang, setLang }}>
        <div className="min-h-screen">
          <Nav />
          <Hero />
          <TrustBar />
          <ServicesSection />
          <HowItWorks />
          <MarketplaceSection />
          <Testimonials />
          <AIChatSection />
          <Pricing />
          <FAQSection />
          <ContactSection />
          <CTABanner />
          <Footer />
        </div>
      </LangContext.Provider>
    </ThemeContext.Provider>
  );
}
