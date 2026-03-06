import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Brain, Send, Bot, Lock, BookOpen, Globe, Settings2, Server, Users } from "lucide-react";
import { C, HDR_FONT, t } from "@/lib/constants";
import { useLang, useTheme } from "@/lib/contexts";
import { useReveal } from "@/hooks/useReveal";
import { getChatExchanges } from "@/data/content";

export type ChatMsg = { role: "user" | "assistant"; text: string };

type ScenarioKey = "process" | "modernisation" | "ia" | "performance";

function getScenarioExchanges(lang: "fr" | "en", scenario: ScenarioKey): { user: string; assistant: string }[] {
  if (scenario === "process") return getChatExchanges(lang);

  const scenarios: Record<Exclude<ScenarioKey, "process">, { fr: { user: string; assistant: string }[]; en: { user: string; assistant: string }[] }> = {
    modernisation: {
      fr: [
        { user: "On a beaucoup de dette technique et nos systèmes legacy bloquent notre croissance. Par où commencer?", assistant: "Excellente question. Commençons par un audit de votre parc applicatif. Voici mon approche :\n\n1. **Inventaire applicatif** — Je vais classifier vos systèmes par criticité et coût de maintenance\n2. **Analyse de la dette technique** — Identifier les composants à risque vs ceux encore viables\n3. **Matrice de migration** — Prioriser : moderniser, migrer au cloud, ou remplacer\n4. **Business case** — ROI estimé par vague de transformation\n\nCombien d'applications avez-vous dans votre parc actuel? Et quel est votre pourcentage estimé de systèmes legacy (> 10 ans)?" },
        { user: "On a environ 45 applications. Je dirais 40% de systèmes legacy, surtout notre ERP et notre CRM maison.", assistant: "J'ai analysé votre profil. Voici le diagnostic :\n\n**Rapport généré** — Audit_TI_Talsom.pdf\n\n**Constats clés :**\n→ **18 applications legacy** à risque sur 45 (40%)\n→ **Coût de maintenance estimé :** 2.5x celui d'un parc moderne\n→ **ERP + CRM maison** = 65% de votre dette technique\n\n**Stratégie recommandée en 3 vagues :**\n\n**Vague 1 (0-6 mois) :** Migration CRM → SaaS (Salesforce/HubSpot)\n→ **Impact :** -35% coûts maintenance, adoption immédiate\n\n**Vague 2 (6-12 mois) :** Modernisation ERP (containerisation + API)\n→ **Impact :** Intégrations modernes, réduction risque\n\n**Vague 3 (12-18 mois) :** Consolidation et optimisation cloud\n→ **Impact :** Architecture scalable, -40% dette technique totale\n\n**ROI projeté :** 2.8x sur 18 mois. Souhaitez-vous la feuille de route détaillée avec le budget par vague?" },
        { user: "Oui, génère la feuille de route avec les budgets.", assistant: "Voici votre roadmap de modernisation :\n\n**Vague 1 — CRM SaaS (6 mois) :**\n→ Migration données + personnalisations\n→ Formation équipes ventes et marketing\n→ **Budget :** 120 000$ - 180 000$ | **Économie annuelle :** 85 000$\n\n**Vague 2 — Modernisation ERP (6 mois) :**\n→ Containerisation des modules critiques\n→ Couche API pour intégrations\n→ **Budget :** 250 000$ - 350 000$ | **Économie annuelle :** 150 000$\n\n**Vague 3 — Consolidation cloud (6 mois) :**\n→ Migration workloads restants\n→ Optimisation et monitoring\n→ **Budget :** 80 000$ - 120 000$ | **Économie annuelle :** 60 000$\n\n**Budget total :** 450K$ - 650K$ | **Économies annuelles :** 295K$/an\n**ROI :** Breakeven à ~22 mois, 2.8x sur 36 mois\n\nLe rapport complet est prêt. Planifions un atelier de validation avec votre équipe TI?" },
      ],
      en: [
        { user: "We have a lot of technical debt and legacy systems blocking our growth. Where should we start?", assistant: "Great question. Let's begin with an application portfolio audit. Here's my approach:\n\n1. **Application inventory** — I'll classify your systems by criticality and maintenance cost\n2. **Technical debt analysis** — Identify at-risk components vs still-viable ones\n3. **Migration matrix** — Prioritize: modernize, migrate to cloud, or replace\n4. **Business case** — Estimated ROI per transformation wave\n\nHow many applications are in your current portfolio? And what's your estimated percentage of legacy systems (> 10 years)?" },
        { user: "We have about 45 applications. I'd say 40% legacy, mainly our ERP and homegrown CRM.", assistant: "I've analyzed your profile. Here's the diagnostic:\n\n**Report generated** — IT_Audit_Talsom.pdf\n\n**Key findings:**\n→ **18 legacy applications** at risk out of 45 (40%)\n→ **Estimated maintenance cost:** 2.5x that of a modern portfolio\n→ **ERP + homegrown CRM** = 65% of your technical debt\n\n**Recommended 3-wave strategy:**\n\n**Wave 1 (0-6 months):** CRM migration → SaaS (Salesforce/HubSpot)\n→ **Impact:** -35% maintenance costs, immediate adoption\n\n**Wave 2 (6-12 months):** ERP modernization (containerization + API)\n→ **Impact:** Modern integrations, reduced risk\n\n**Wave 3 (12-18 months):** Cloud consolidation and optimization\n→ **Impact:** Scalable architecture, -40% total technical debt\n\n**Projected ROI:** 2.8x over 18 months. Would you like the detailed roadmap with budget per wave?" },
        { user: "Yes, generate the roadmap with budgets.", assistant: "Here's your modernization roadmap:\n\n**Wave 1 — CRM SaaS (6 months):**\n→ Data migration + customizations\n→ Sales and marketing team training\n→ **Budget:** $120,000 - $180,000 | **Annual savings:** $85,000\n\n**Wave 2 — ERP Modernization (6 months):**\n→ Containerization of critical modules\n→ API layer for integrations\n→ **Budget:** $250,000 - $350,000 | **Annual savings:** $150,000\n\n**Wave 3 — Cloud Consolidation (6 months):**\n→ Remaining workload migration\n→ Optimization and monitoring\n→ **Budget:** $80,000 - $120,000 | **Annual savings:** $60,000\n\n**Total budget:** $450K - $650K | **Annual savings:** $295K/year\n**ROI:** Breakeven at ~22 months, 2.8x over 36 months\n\nThe full report is ready. Shall we schedule a validation workshop with your IT team?" },
      ],
    },
    ia: {
      fr: [
        { user: "On veut intégrer l'IA dans nos processus mais on ne sait pas par où commencer. Pouvez-vous nous guider?", assistant: "Bien sûr! La clé est de commencer par les cas d'usage à fort impact et faible complexité. Voici ma méthode :\n\n1. **Évaluation de maturité IA** — Où en êtes-vous? (données, infrastructure, compétences)\n2. **Identification des cas d'usage** — Par département et processus\n3. **Matrice priorisation** — Impact business × Faisabilité technique\n4. **Roadmap IA** — Séquençage en 3 horizons\n\nDans quel secteur opérez-vous et quels sont vos 2-3 enjeux business principaux?" },
        { user: "On est dans le manufacturier. Nos enjeux : prédiction de la demande, qualité produit, et maintenance de nos équipements.", assistant: "Excellent! Le manufacturier est l'un des secteurs avec le meilleur ROI en IA. Voici mon analyse :\n\n**Rapport généré** — Roadmap_IA_Manufacturier_Talsom.pdf\n\n**Maturité IA estimée :** Niveau 2/5 (Exploratoire)\n\n**Top 3 cas d'usage priorisés :**\n\n🥇 **Maintenance prédictive** (Impact: ★★★★★ | Faisabilité: ★★★★)\n→ ROI estimé : 4-6x | Réduction pannes : -40%\n→ Données requises : capteurs IoT, historique maintenance\n\n🥈 **Prédiction de la demande** (Impact: ★★★★ | Faisabilité: ★★★★)\n→ ROI estimé : 2-3x | Précision stock : +30%\n→ Données requises : ventes historiques, saisonnalité\n\n🥉 **Contrôle qualité par vision** (Impact: ★★★★ | Faisabilité: ★★★)\n→ ROI estimé : 3-4x | Défauts détectés : +60%\n→ Données requises : images produits, historique défauts\n\nVoulez-vous que je génère la roadmap détaillée avec les investissements par horizon?" },
        { user: "Oui, avec les investissements et le calendrier.", assistant: "Voici votre Roadmap IA :\n\n**Horizon 1 — Quick wins (3-6 mois) :**\n→ Maintenance prédictive (pilote sur 1 ligne)\n→ Dashboard prédictif de la demande\n→ **Investissement :** 80 000$ - 120 000$\n→ **ROI attendu :** 2x dès la 1ère année\n\n**Horizon 2 — Scale (6-12 mois) :**\n→ Déploiement maintenance prédictive (toutes les lignes)\n→ Vision par ordinateur pour contrôle qualité\n→ **Investissement :** 200 000$ - 300 000$\n→ **ROI cumulé :** 3.5x\n\n**Horizon 3 — Transformation (12-18 mois) :**\n→ Jumeau numérique de la production\n→ Optimisation chaîne d'approvisionnement par IA\n→ **Investissement :** 150 000$ - 250 000$\n\n**Investissement total :** 430K$ - 670K$\n**ROI projeté :** 4.2x sur 24 mois\n\nProchaine étape : un atelier avec vos équipes opérations et TI pour valider les données disponibles. On planifie?" },
      ],
      en: [
        { user: "We want to integrate AI into our processes but don't know where to start. Can you guide us?", assistant: "Of course! The key is to start with high-impact, low-complexity use cases. Here's my approach:\n\n1. **AI maturity assessment** — Where are you? (data, infrastructure, skills)\n2. **Use case identification** — By department and process\n3. **Prioritization matrix** — Business impact × Technical feasibility\n4. **AI Roadmap** — Sequencing across 3 horizons\n\nWhat industry are you in, and what are your 2-3 main business challenges?" },
        { user: "We're in manufacturing. Our challenges: demand forecasting, product quality, and equipment maintenance.", assistant: "Excellent! Manufacturing is one of the sectors with the best AI ROI. Here's my analysis:\n\n**Report generated** — AI_Roadmap_Manufacturing_Talsom.pdf\n\n**Estimated AI maturity:** Level 2/5 (Exploratory)\n\n**Top 3 prioritized use cases:**\n\n🥇 **Predictive maintenance** (Impact: ★★★★★ | Feasibility: ★★★★)\n→ Estimated ROI: 4-6x | Downtime reduction: -40%\n→ Required data: IoT sensors, maintenance history\n\n🥈 **Demand forecasting** (Impact: ★★★★ | Feasibility: ★★★★)\n→ Estimated ROI: 2-3x | Inventory accuracy: +30%\n→ Required data: historical sales, seasonality\n\n🥉 **Visual quality control** (Impact: ★★★★ | Feasibility: ★★★)\n→ Estimated ROI: 3-4x | Defect detection: +60%\n→ Required data: product images, defect history\n\nWould you like me to generate the detailed roadmap with investments per horizon?" },
        { user: "Yes, with investments and timeline.", assistant: "Here's your AI Roadmap:\n\n**Horizon 1 — Quick wins (3-6 months):**\n→ Predictive maintenance (pilot on 1 line)\n→ Demand forecasting dashboard\n→ **Investment:** $80,000 - $120,000\n→ **Expected ROI:** 2x in year 1\n\n**Horizon 2 — Scale (6-12 months):**\n→ Predictive maintenance rollout (all lines)\n→ Computer vision for quality control\n→ **Investment:** $200,000 - $300,000\n→ **Cumulative ROI:** 3.5x\n\n**Horizon 3 — Transformation (12-18 months):**\n→ Production digital twin\n→ AI-powered supply chain optimization\n→ **Investment:** $150,000 - $250,000\n\n**Total investment:** $430K - $670K\n**Projected ROI:** 4.2x over 24 months\n\nNext step: a workshop with your operations and IT teams to validate available data. Shall we schedule it?" },
      ],
    },
    performance: {
      fr: [
        { user: "On lance une transformation numérique majeure mais nos équipes résistent au changement. Comment on gère ça?", assistant: "La résistance au changement est le #1 facteur d'échec des transformations. Voici mon approche structurée :\n\n1. **Diagnostic d'adoption** — Identifier les freins par profil d'employé\n2. **Cartographie des parties prenantes** — Alliés, neutres, résistants\n3. **Plan de gestion du changement** — Personnalisé par groupe\n4. **Mesure continue** — KPIs d'adoption en temps réel\n\nCombien d'employés sont touchés par la transformation et quels systèmes/processus changent?" },
        { user: "Environ 800 employés. On déploie un nouveau CRM et on refond nos processus de vente.", assistant: "J'ai préparé votre diagnostic. Voici l'analyse :\n\n**Rapport généré** — Diagnostic_Changement_Talsom.pdf\n\n**Profil de risque :**\n→ **800 employés** impactés — Transformation majeure\n→ **Risque d'adoption estimé :** Élevé (CRM + processus simultanément)\n→ **Groupes critiques :** Équipe ventes terrain (résistance anticipée : haute)\n\n**Plan de gestion du changement recommandé :**\n\n**Phase 1 — Préparer (4 semaines) :**\n→ Ateliers de co-design avec les champions de chaque équipe\n→ Communication personnalisée par profil (terrain vs bureau)\n→ Formation des managers comme agents du changement\n\n**Phase 2 — Déployer (8 semaines) :**\n→ Parcours d'adoption gamifié\n→ Sessions de support par groupe de 15-20\n→ Dashboard d'adoption en temps réel\n\n**Phase 3 — Ancrer (6 semaines) :**\n→ Coaching individuel pour les profils résistants\n→ Célébration des quick wins\n\n**Taux d'adoption cible :** 90%+ à 12 semaines. Voulez-vous le plan détaillé avec le calendrier?" },
        { user: "Oui, avec le calendrier et les ressources nécessaires.", assistant: "Voici votre plan de gestion du changement :\n\n**Semaines 1-4 — Préparer :**\n→ 4 ateliers de co-design (2h chacun)\n→ Kit de communication (emails, vidéos, FAQ)\n→ Formation de 12 champions internes\n→ **Ressources :** 1 consultant senior + outils AI Talsom Forge\n→ **Coût :** 25 000$\n\n**Semaines 5-12 — Déployer :**\n→ 40 sessions de formation (20 employés/session)\n→ Parcours e-learning personnalisé par profil\n→ Support chatbot 24/7 via Talsom Forge\n→ **Ressources :** 2 formateurs + plateforme AI\n→ **Coût :** 55 000$\n\n**Semaines 13-18 — Ancrer :**\n→ Coaching ciblé pour les 10-15% résistants\n→ Optimisation basée sur les données d'adoption\n→ Rapport final avec recommandations\n→ **Coût :** 20 000$\n\n**Budget total :** 100 000$ | **Taux d'adoption cible :** 94%\n**ROI :** Chaque % d'adoption = ~15 000$ de productivité récupérée\n\nPrêt à lancer? On peut planifier le premier atelier de co-design dès la semaine prochaine." },
      ],
      en: [
        { user: "We're launching a major digital transformation but our teams are resisting the change. How do we handle this?", assistant: "Change resistance is the #1 factor in transformation failure. Here's my structured approach:\n\n1. **Adoption diagnostic** — Identify barriers by employee profile\n2. **Stakeholder mapping** — Allies, neutrals, resistors\n3. **Change management plan** — Customized by group\n4. **Continuous measurement** — Real-time adoption KPIs\n\nHow many employees are affected by the transformation, and what systems/processes are changing?" },
        { user: "About 800 employees. We're deploying a new CRM and redesigning our sales processes.", assistant: "I've prepared your diagnostic. Here's the analysis:\n\n**Report generated** — Change_Diagnostic_Talsom.pdf\n\n**Risk profile:**\n→ **800 employees** impacted — Major transformation\n→ **Estimated adoption risk:** High (CRM + processes simultaneously)\n→ **Critical groups:** Field sales team (anticipated resistance: high)\n\n**Recommended change management plan:**\n\n**Phase 1 — Prepare (4 weeks):**\n→ Co-design workshops with team champions\n→ Personalized communication by profile (field vs office)\n→ Train managers as change agents\n\n**Phase 2 — Deploy (8 weeks):**\n→ Gamified adoption journey\n→ Support sessions for groups of 15-20\n→ Real-time adoption dashboard\n\n**Phase 3 — Anchor (6 weeks):**\n→ Individual coaching for resistant profiles\n→ Quick wins celebration\n\n**Target adoption rate:** 90%+ at 12 weeks. Would you like the detailed plan with timeline?" },
        { user: "Yes, with timeline and required resources.", assistant: "Here's your change management plan:\n\n**Weeks 1-4 — Prepare:**\n→ 4 co-design workshops (2h each)\n→ Communication kit (emails, videos, FAQ)\n→ Train 12 internal champions\n→ **Resources:** 1 senior consultant + Talsom Forge AI tools\n→ **Cost:** $25,000\n\n**Weeks 5-12 — Deploy:**\n→ 40 training sessions (20 employees/session)\n→ Personalized e-learning by profile\n→ 24/7 chatbot support via Talsom Forge\n→ **Resources:** 2 trainers + AI platform\n→ **Cost:** $55,000\n\n**Weeks 13-18 — Anchor:**\n→ Targeted coaching for the 10-15% resistors\n→ Data-driven optimization based on adoption metrics\n→ Final report with recommendations\n→ **Cost:** $20,000\n\n**Total budget:** $100,000 | **Target adoption rate:** 94%\n**ROI:** Each % of adoption = ~$15,000 in recovered productivity\n\nReady to launch? We can schedule the first co-design workshop as early as next week." },
      ],
    },
  };

  return scenarios[scenario][lang];
}

export function AIChatSection() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [activeScenario, setActiveScenario] = useState<ScenarioKey>("process");
  const exchanges = getScenarioExchanges(lang, activeScenario);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [inputVal, setInputVal] = useState(exchanges[0]?.user ?? "");
  const [typing, setTyping] = useState(false);
  const [exchangeIdx, setExchangeIdx] = useState(0);
  const [demoEnded, setDemoEnded] = useState(false);
  const chatEnd = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const isInitialMount = useRef(true);
  const prevLang = useRef(lang);
  const prevScenario = useRef(activeScenario);
  const ref = useReveal();

  const scenarioTabs: { key: ScenarioKey; icon: typeof Settings2; label: string }[] = [
    { key: "process", icon: Settings2, label: t(lang, "Processus", "Process") },
    { key: "modernisation", icon: Server, label: t(lang, "Modernisation", "Modernization") },
    { key: "ia", icon: Brain, label: "IA / AI" },
    { key: "performance", icon: Users, label: t(lang, "Performance", "Performance") },
  ];

  // Reset demo when language or scenario changes
  useEffect(() => {
    if (prevLang.current !== lang || prevScenario.current !== activeScenario) {
      prevLang.current = lang;
      prevScenario.current = activeScenario;
      busy.current = false;
      setMessages([]);
      setExchangeIdx(0);
      setDemoEnded(false);
      setTyping(false);
      isInitialMount.current = true;
      const newExchanges = getScenarioExchanges(lang, activeScenario);
      setInputVal(newExchanges[0]?.user ?? "");
    }
  }, [lang, activeScenario]);

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
            <p className={`text-lg leading-relaxed mb-8 ${dark ? "text-white/45" : "text-gray-500"}`}>{t(lang, "Notre chat AI est entraîné sur des milliers de mandats de consulting : processus, modernisation, AI et performance organisationnelle. Il pose les bonnes questions et génère des livrables prêts à l\u2019emploi.", "Our AI chat is trained on thousands of consulting engagements: process, modernization, AI, and organizational performance. It asks the right questions and generates ready-to-use deliverables.")}</p>
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
            {/* Scenario tabs */}
            <div className={`flex border-b overflow-x-auto ${dark ? "bg-gray-900/50 border-white/5" : "bg-gray-50 border-gray-100"}`}>
              {scenarioTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveScenario(tab.key)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-all border-b-2 ${
                    activeScenario === tab.key
                      ? (dark ? "text-white border-current" : "border-current")
                      : (dark ? "text-white/30 hover:text-white/50 border-transparent" : "text-gray-400 hover:text-gray-600 border-transparent")
                  }`}
                  style={activeScenario === tab.key ? { color: dark ? C.yellow : C.green } : undefined}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

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

            <div className="h-[420px] overflow-y-auto px-5 py-5 space-y-4">
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
                  placeholder={demoEnded ? t(lang, "Démo terminée — recommencez ou accédez au chat complet", "Demo ended — restart or access full chat") : t(lang, "Posez une question sur vos enjeux d\u2019affaires\u2026", "Ask a question about your business challenges\u2026")}
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
                  ? t(lang, "Merci d\u2019avoir exploré la démo!", "Thanks for exploring the demo!")
                  : `${t(lang, "Démo interactive", "Interactive demo")} · ${t(lang, "Étape", "Step")} ${exchangeIdx + 1}/${exchanges.length}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
