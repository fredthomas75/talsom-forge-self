import type { SiteContent } from "@/types/content";

export const defaultContent: SiteContent = {
  // ─── Hero ──────────────────────────────────────────
  hero: {
    badgeText: "Beta \u00b7 Virtual Consulting Platform",
    title: { fr: "Le consulting,", en: "Consulting," },
    titleAccent: { fr: "r\u00e9invent\u00e9.", en: "reinvented." },
    subtitle: {
      fr: "Acc\u00e9dez \u00e0 l\u2019expertise de consultants seniors, amplifi\u00e9e par l\u2019AI. Processus, modernisation, intelligence artificielle et performance organisationnelle \u2014 le tout sur une plateforme unique.",
      en: "Access senior consultant expertise, amplified by AI. Process design, modernization, artificial intelligence, and organizational performance \u2014 all on a single platform.",
    },
    ctaPrimary: { fr: "Explorer les services", en: "Explore services" },
    ctaSecondary: { fr: "Essayer le chat AI", en: "Try AI chat" },
  },

  // ─── Stats ─────────────────────────────────────────
  stats: [
    { value: "250+", label: { fr: "Mandats livr\u00e9s", en: "Engagements delivered" } },
    { value: "80+", label: { fr: "Clients actifs", en: "Active clients" } },
    { value: "8.5x", label: { fr: "ROI moyen", en: "Average ROI" } },
    { value: "96%", label: { fr: "Satisfaction client", en: "Client satisfaction" } },
  ],

  // ─── Nav ───────────────────────────────────────────
  nav: {
    links: [
      { label: { fr: "Services", en: "Services" }, href: "#services" },
      { label: { fr: "Marketplace", en: "Marketplace" }, href: "#marketplace" },
      { label: { fr: "AI Chat", en: "AI Chat" }, href: "#ai-chat" },
      { label: { fr: "Tarification", en: "Pricing" }, href: "#tarification" },
      { label: { fr: "Contact", en: "Contact" }, href: "#contact" },
    ],
    ctaLabel: { fr: "D\u00e9mo gratuite", en: "Free demo" },
  },

  // ─── TrustBar ──────────────────────────────────────
  trustbar: {
    label: { fr: "Ils nous font confiance", en: "Trusted by" },
    clients: [
      { name: "Desjardins", abbr: "D", color: "#00874E" },
      { name: "BNC", abbr: "BN", color: "#E31937" },
      { name: "Qu\u00e9becor", abbr: "Q", color: "#003DA5" },
      { name: "CGI", abbr: "CGI", color: "#E31937" },
      { name: "WSP", abbr: "WSP", color: "#00A94F" },
      { name: "Pomerleau", abbr: "P", color: "#0066B3" },
      { name: "STM", abbr: "STM", color: "#009DDC" },
      { name: "Beneva", abbr: "B", color: "#00A651" },
    ],
  },

  // ─── HowItWorks ────────────────────────────────────
  howItWorks: {
    badge: { fr: "Comment \u00e7a marche", en: "How it works" },
    title: { fr: "Du besoin au livrable en quelques clics", en: "From need to deliverable in a few clicks" },
    subtitle: {
      fr: "Notre plateforme combine l\u2019automatisation AI avec l\u2019expertise humaine pour vous livrer des r\u00e9sultats de qualit\u00e9 consulting, plus rapidement.",
      en: "Our platform combines AI automation with human expertise to deliver consulting-grade results, faster.",
    },
    steps: [
      { iconName: "Target", title: { fr: "Choisissez", en: "Choose" }, desc: { fr: "S\u00e9lectionnez un domaine d\u2019expertise parmi nos 4 cat\u00e9gories de services.", en: "Select an area of expertise from our 4 service categories." } },
      { iconName: "MessageSquare", title: { fr: "\u00c9changez", en: "Discuss" }, desc: { fr: "Affinez votre besoin avec nos consultants seniors et notre chat AI expert.", en: "Refine your needs with our senior consultants and expert AI chat." } },
      { iconName: "Zap", title: { fr: "Recevez", en: "Receive" }, desc: { fr: "Obtenez vos livrables co-produits par nos consultants et agents AI.", en: "Get your deliverables co-produced by our consultants and AI agents." } },
      { iconName: "TrendingUp", title: { fr: "It\u00e9rez", en: "Iterate" }, desc: { fr: "Am\u00e9liorez continuellement avec le suivi et les recommandations.", en: "Continuously improve with tracking and recommendations." } },
    ],
  },

  // ─── Services ──────────────────────────────────────
  services: {
    badge: { fr: "Services virtuels", en: "Virtual services" },
    title: { fr: "Du consulting virtuel,\npropuls\u00e9 par l'AI.", en: "Virtual consulting,\npowered by AI." },
    subtitle: {
      fr: "Choisissez parmi nos 4 domaines d\u2019expertise. Chaque service combine l\u2019accompagnement de consultants seniors avec la puissance de nos agents AI.",
      en: "Choose from our 4 areas of expertise. Each service combines senior consultant guidance with the power of our AI agents.",
    },
    items: [
      {
        id: "process-design",
        iconName: "Settings2",
        title: { fr: "Business et Process Design", en: "Business et Process Design" },
        subtitle: { fr: "Conception de processus et mod\u00e8le op\u00e9rationnel", en: "Process design and operating model" },
        desc: {
          fr: "Optimisez vos processus ou redesignez-les en mode AI Native : des agents AI (pr\u00e9diction, d\u00e9cision, ex\u00e9cution) \u00e0 chaque \u00e9tape, l\u2019humain ne g\u00e8re que les exceptions.",
          en: "Optimize your processes or redesign them AI Native: AI agents (prediction, decision, execution) at each step, humans only handle exceptions.",
        },
        tags: { fr: "Processus,AI Native,4-10 semaines", en: "Process,AI Native,4-10 weeks" },
        price: { fr: "\u00c0 partir de 15 000$", en: "Starting at $15,000" },
        popular: true,
      },
      {
        id: "modernisation",
        iconName: "Server",
        title: { fr: "Roadmap de modernisation", en: "Modernization Roadmap" },
        subtitle: { fr: "Strat\u00e9gie de modernisation technologique", en: "Technology modernization strategy" },
        desc: {
          fr: "Planifiez la modernisation de vos syst\u00e8mes h\u00e9rit\u00e9s et votre migration vers le cloud avec une feuille de route s\u00e9quenc\u00e9e et budg\u00e9tis\u00e9e.",
          en: "Plan the modernization of your legacy systems and cloud migration with a sequenced and budgeted roadmap.",
        },
        tags: { fr: "Cloud,Architecture,6-12 semaines", en: "Cloud,Architecture,6-12 weeks" },
        price: { fr: "\u00c0 partir de 15 000$", en: "Starting at $15,000" },
        popular: false,
      },
      {
        id: "roadmap-ia",
        iconName: "Brain",
        title: { fr: "Roadmap IA", en: "Roadmap IA" },
        subtitle: { fr: "Strat\u00e9gie et feuille de route AI", en: "AI strategy and roadmap" },
        desc: {
          fr: "D\u00e9finissez votre trajectoire AI avec une roadmap personnalis\u00e9e couvrant strat\u00e9gie, maturit\u00e9, gouvernance et d\u00e9ploiement d\u2019outils comme Copilot 365.",
          en: "Define your AI trajectory with a personalized roadmap covering strategy, maturity, governance, and tool deployment like Copilot 365.",
        },
        tags: { fr: "IA,Strat\u00e9gie,4-14 semaines", en: "AI,Strategy,4-14 weeks" },
        price: { fr: "\u00c0 partir de 8 000$", en: "Starting at $8,000" },
        popular: true,
      },
      {
        id: "performance-org",
        iconName: "Users",
        title: { fr: "Performance organisationnelle", en: "Organizational Performance" },
        subtitle: { fr: "Gestion du changement et leadership", en: "Change management and leadership" },
        desc: {
          fr: "Renforcez les capacit\u00e9s humaines de votre organisation : gestion du changement, design organisationnel, leadership et culture.",
          en: "Strengthen your organization\u2019s human capabilities: change management, organizational design, leadership, and culture.",
        },
        tags: { fr: "Changement,Leadership,Continu", en: "Change,Leadership,Ongoing" },
        price: { fr: "\u00c0 partir de 10 000$", en: "Starting at $10,000" },
        popular: false,
      },
    ],
    details: {
      "process-design": {
        extendedDesc: {
          fr: "Notre \u00e9quipe de consultants seniors con\u00e7oit et optimise vos processus d\u2019affaires \u00e0 travers des ateliers virtuels interactifs. Nous allons au-del\u00e0 de l\u2019optimisation classique : nous redesignons vos processus en mode AI Native, en positionnant des agents intelligents (pr\u00e9diction, d\u00e9cision, ex\u00e9cution) \u00e0 chaque \u00e9tape pour maximiser l\u2019automatisation et ne laisser que la gestion des exceptions aux employ\u00e9s.",
          en: "Our senior consultants design and optimize your business processes through interactive virtual workshops. We go beyond classic optimization: we redesign your processes in AI Native mode, positioning intelligent agents (prediction, decision, execution) at each step to maximize automation and leave only exception handling to employees.",
        },
        differentiator: {
          fr: "Notre approche AI Native repense chaque processus en pla\u00e7ant des agents AI au c\u0153ur du flux \u2014 pr\u00e9diction des issues, prise de d\u00e9cision automatis\u00e9e, ex\u00e9cution autonome. L\u2019humain intervient uniquement sur les exceptions et les d\u00e9cisions \u00e0 forte valeur ajout\u00e9e. R\u00e9sultat : des processus 5 \u00e0 10x plus rapides avec une qualit\u00e9 constante.",
          en: "Our AI Native approach rethinks each process by placing AI agents at the core of the flow \u2014 predicting outcomes, automating decisions, and executing autonomously. Humans only intervene on exceptions and high-value decisions. Result: processes 5-10x faster with consistent quality.",
        },
        phases: [
          { name: { fr: "Diagnostic & Cadrage", en: "Diagnostic & Scoping" }, duration: { fr: "2 semaines", en: "2 weeks" }, desc: { fr: "Entrevues parties prenantes, collecte documentaire et cartographie AS-IS des processus cibl\u00e9s.", en: "Stakeholder interviews, document collection, and AS-IS mapping of targeted processes." } },
          { name: { fr: "Ateliers de co-design", en: "Co-design Workshops" }, duration: { fr: "3-4 semaines", en: "3-4 weeks" }, desc: { fr: "Sessions virtuelles collaboratives avec agents AI pour concevoir le mod\u00e8le TO-BE et les quick wins.", en: "Collaborative virtual sessions with AI agents to design the TO-BE model and quick wins." } },
          { name: { fr: "Livraison & Feuille de route", en: "Delivery & Roadmap" }, duration: { fr: "2 semaines", en: "2 weeks" }, desc: { fr: "Documentation finale, plan de mise en \u0153uvre s\u00e9quenc\u00e9 et pr\u00e9sentation ex\u00e9cutive.", en: "Final documentation, sequenced implementation plan, and executive presentation." } },
        ],
        deliverables: [
          { fr: "Cartographie AS-IS / TO-BE des processus", en: "AS-IS / TO-BE process mapping" },
          { fr: "Analyse des goulots et recommandations", en: "Bottleneck analysis and recommendations" },
          { fr: "Mod\u00e8le op\u00e9rationnel cible", en: "Target operating model" },
          { fr: "Design de processus AI Native (agents + exceptions)", en: "AI Native process design (agents + exceptions)" },
          { fr: "Feuille de route de mise en \u0153uvre", en: "Implementation roadmap" },
          { fr: "Pr\u00e9sentation ex\u00e9cutive", en: "Executive presentation" },
        ],
        timeline: { fr: "6-10 semaines", en: "6-10 weeks" },
        idealFor: [
          { fr: "VP Op\u00e9rations / COO", en: "VP Operations / COO" },
          { fr: "Directeur Processus", en: "Process Director" },
          { fr: "Directeur Transformation", en: "Director of Transformation" },
        ],
        subServices: [
          {
            name: { fr: "Diagnostic de processus", en: "Process Diagnostic" },
            price: { fr: "15 000$", en: "$15,000" },
            desc: { fr: "Cartographie rapide AS-IS de 3 \u00e0 5 processus cl\u00e9s avec identification des goulots et quick wins.", en: "Rapid AS-IS mapping of 3-5 key processes with bottleneck identification and quick wins." },
            deliverables: [
              { fr: "Cartographies AS-IS (BPMN)", en: "AS-IS maps (BPMN)" },
              { fr: "Rapport d\u2019analyse des goulots", en: "Bottleneck analysis report" },
              { fr: "Liste de quick wins prioris\u00e9s", en: "Prioritized quick wins list" },
            ],
            timeline: { fr: "3-4 semaines", en: "3-4 weeks" },
          },
          {
            name: { fr: "Design de mod\u00e8le op\u00e9rationnel", en: "Operating Model Design" },
            price: { fr: "25 000$", en: "$25,000" },
            desc: { fr: "Conception compl\u00e8te du mod\u00e8le op\u00e9rationnel cible incluant structure, processus, gouvernance et technologie.", en: "Complete target operating model design including structure, processes, governance, and technology." },
            deliverables: [
              { fr: "Mod\u00e8le op\u00e9rationnel TO-BE", en: "TO-BE operating model" },
              { fr: "Blueprint organisationnel", en: "Organizational blueprint" },
              { fr: "Plan de transition", en: "Transition plan" },
            ],
            timeline: { fr: "6-8 semaines", en: "6-8 weeks" },
          },
          {
            name: { fr: "Automatisation de processus", en: "Process Automation" },
            price: { fr: "20 000$", en: "$20,000" },
            desc: { fr: "Identification et impl\u00e9mentation des opportunit\u00e9s d\u2019automatisation RPA et AI dans vos processus existants.", en: "Identification and implementation of RPA and AI automation opportunities in your existing processes." },
            deliverables: [
              { fr: "Analyse d\u2019automatisation", en: "Automation analysis" },
              { fr: "Plan d\u2019impl\u00e9mentation RPA/AI", en: "RPA/AI implementation plan" },
              { fr: "Estimation ROI par processus", en: "ROI estimation per process" },
            ],
            timeline: { fr: "4-6 semaines", en: "4-6 weeks" },
          },
          {
            name: { fr: "Redesign AI Native", en: "AI Native Redesign" },
            price: { fr: "30 000$", en: "$30,000" },
            desc: { fr: "Reconception compl\u00e8te d\u2019un processus en positionnant des agents AI (pr\u00e9diction, d\u00e9cision, ex\u00e9cution) \u00e0 chaque \u00e9tape \u2014 l\u2019humain ne g\u00e8re que les exceptions et les d\u00e9cisions strat\u00e9giques.", en: "Complete process redesign positioning AI agents (prediction, decision, execution) at each step \u2014 humans only handle exceptions and strategic decisions." },
            deliverables: [
              { fr: "Processus TO-BE AI Native (BPMN + agents)", en: "AI Native TO-BE process (BPMN + agents)" },
              { fr: "Matrice d\u00e9cisions humain vs. agent", en: "Human vs. agent decision matrix" },
              { fr: "Architecture des agents (pr\u00e9diction, d\u00e9cision, action)", en: "Agent architecture (prediction, decision, action)" },
              { fr: "Business case avec gains d\u2019automatisation", en: "Business case with automation gains" },
            ],
            timeline: { fr: "6-10 semaines", en: "6-10 weeks" },
          },
        ],
      },
      modernisation: {
        extendedDesc: {
          fr: "Nous planifions la modernisation de vos syst\u00e8mes h\u00e9rit\u00e9s et votre migration vers le cloud avec une feuille de route s\u00e9quenc\u00e9e, budg\u00e9tis\u00e9e et align\u00e9e sur vos priorit\u00e9s d\u2019affaires. Nos consultants combinent expertise en architecture d\u2019entreprise et outils d\u2019analyse AI pour des recommandations fond\u00e9es sur les donn\u00e9es.",
          en: "We plan the modernization of your legacy systems and cloud migration with a sequenced, budgeted roadmap aligned with your business priorities. Our consultants combine enterprise architecture expertise with AI analysis tools for data-driven recommendations.",
        },
        differentiator: {
          fr: "Notre plateforme AI analyse automatiquement votre parc applicatif, \u00e9value la dette technique et g\u00e9n\u00e8re des sc\u00e9narios de modernisation compar\u00e9s \u2014 vous gagnez des semaines d\u2019analyse manuelle et obtenez des recommandations bas\u00e9es sur des donn\u00e9es r\u00e9elles.",
          en: "Our AI platform automatically analyzes your application portfolio, evaluates technical debt, and generates compared modernization scenarios \u2014 you save weeks of manual analysis and get recommendations based on real data.",
        },
        phases: [
          { name: { fr: "Inventaire & \u00c9valuation", en: "Inventory & Assessment" }, duration: { fr: "3 semaines", en: "3 weeks" }, desc: { fr: "Cartographie du parc applicatif, \u00e9valuation de la dette technique et analyse des d\u00e9pendances.", en: "Application portfolio mapping, technical debt assessment, and dependency analysis." } },
          { name: { fr: "Strat\u00e9gie & Sc\u00e9narios", en: "Strategy & Scenarios" }, duration: { fr: "3 semaines", en: "3 weeks" }, desc: { fr: "D\u00e9finition de la cible, comparaison de sc\u00e9narios (cloud, hybride, refactoring) et analyse co\u00fbts-b\u00e9n\u00e9fices.", en: "Target definition, scenario comparison (cloud, hybrid, refactoring), and cost-benefit analysis." } },
          { name: { fr: "Roadmap & Gouvernance", en: "Roadmap & Governance" }, duration: { fr: "2 semaines", en: "2 weeks" }, desc: { fr: "Feuille de route s\u00e9quenc\u00e9e par vagues, estimation budg\u00e9taire et cadre de gouvernance.", en: "Wave-sequenced roadmap, budget estimation, and governance framework." } },
        ],
        deliverables: [
          { fr: "Cartographie du parc applicatif", en: "Application portfolio mapping" },
          { fr: "\u00c9valuation de la dette technique", en: "Technical debt assessment" },
          { fr: "Comparaison de sc\u00e9narios de modernisation", en: "Modernization scenario comparison" },
          { fr: "Roadmap de modernisation sur 18-24 mois", en: "18-24 month modernization roadmap" },
          { fr: "Estimation budg\u00e9taire par vague", en: "Wave-by-wave budget estimation" },
        ],
        timeline: { fr: "8-10 semaines", en: "8-10 weeks" },
        idealFor: [
          { fr: "CIO / VP TI", en: "CIO / VP IT" },
          { fr: "Directeur Architecture", en: "Architecture Director" },
          { fr: "VP Infrastructure", en: "VP Infrastructure" },
        ],
        subServices: [
          {
            name: { fr: "Audit de dette technique", en: "Technical Debt Audit" },
            price: { fr: "15 000$", en: "$15,000" },
            desc: { fr: "\u00c9valuation approfondie de votre dette technique avec scoring par application et recommandations de rem\u00e9diation.", en: "In-depth technical debt evaluation with per-application scoring and remediation recommendations." },
            deliverables: [
              { fr: "Rapport de dette technique", en: "Technical debt report" },
              { fr: "Scoring par application", en: "Per-application scoring" },
              { fr: "Plan de rem\u00e9diation prioris\u00e9", en: "Prioritized remediation plan" },
            ],
            timeline: { fr: "3-4 semaines", en: "3-4 weeks" },
          },
          {
            name: { fr: "Strat\u00e9gie cloud et migration", en: "Cloud Strategy & Migration" },
            price: { fr: "25 000$", en: "$25,000" },
            desc: { fr: "D\u00e9finition de votre strat\u00e9gie cloud (public, priv\u00e9, hybride) avec plan de migration s\u00e9quenc\u00e9.", en: "Definition of your cloud strategy (public, private, hybrid) with sequenced migration plan." },
            deliverables: [
              { fr: "Strat\u00e9gie cloud", en: "Cloud strategy" },
              { fr: "Plan de migration par vagues", en: "Wave-based migration plan" },
              { fr: "Analyse financi\u00e8re CapEx/OpEx", en: "CapEx/OpEx financial analysis" },
            ],
            timeline: { fr: "6-8 semaines", en: "6-8 weeks" },
          },
          {
            name: { fr: "Architecture d\u2019entreprise cible", en: "Target Enterprise Architecture" },
            price: { fr: "30 000$", en: "$30,000" },
            desc: { fr: "Conception de l\u2019architecture cible align\u00e9e sur votre strat\u00e9gie d\u2019affaires, incluant int\u00e9grations et s\u00e9curit\u00e9.", en: "Target architecture design aligned with your business strategy, including integrations and security." },
            deliverables: [
              { fr: "Architecture de r\u00e9f\u00e9rence", en: "Reference architecture" },
              { fr: "Mod\u00e8le d\u2019int\u00e9gration", en: "Integration model" },
              { fr: "Roadmap d\u2019impl\u00e9mentation", en: "Implementation roadmap" },
            ],
            timeline: { fr: "8-10 semaines", en: "8-10 weeks" },
          },
        ],
      },
      "roadmap-ia": {
        extendedDesc: {
          fr: "D\u00e9finissez votre trajectoire AI avec une roadmap personnalis\u00e9e couvrant strat\u00e9gie, maturit\u00e9, gouvernance et d\u00e9ploiement d\u2019outils. Nos consultants combinent leur expertise en intelligence artificielle avec notre plateforme de diagnostic pour des recommandations bas\u00e9es sur votre contexte r\u00e9el.",
          en: "Define your AI trajectory with a personalized roadmap covering strategy, maturity, governance, and tool deployment. Our consultants combine their artificial intelligence expertise with our diagnostic platform for recommendations based on your actual context.",
        },
        differentiator: {
          fr: "Notre diagnostic de maturit\u00e9 AI est propuls\u00e9 par des algorithmes qui comparent votre organisation \u00e0 plus de 200 benchmarks sectoriels \u2014 chaque recommandation est valid\u00e9e par des donn\u00e9es r\u00e9elles, puis enrichie par l\u2019exp\u00e9rience terrain de nos consultants.",
          en: "Our AI maturity diagnostic is powered by algorithms that compare your organization against 200+ industry benchmarks \u2014 each recommendation is validated by real data, then enriched by our consultants\u2019 field experience.",
        },
        phases: [
          { name: { fr: "D\u00e9couverte & Diagnostic", en: "Discovery & Diagnostic" }, duration: { fr: "2 semaines", en: "2 weeks" }, desc: { fr: "Analyse de votre environnement technologique, entrevues parties prenantes et \u00e9valuation de maturit\u00e9 AI.", en: "Analysis of your technology environment, stakeholder interviews, and AI maturity assessment." } },
          { name: { fr: "Id\u00e9ation & Priorisation", en: "Ideation & Prioritization" }, duration: { fr: "3 semaines", en: "3 weeks" }, desc: { fr: "Identification et scoring des cas d\u2019usage AI selon l\u2019impact business, la faisabilit\u00e9 technique et l\u2019effort requis.", en: "Identification and scoring of AI use cases based on business impact, technical feasibility, and required effort." } },
          { name: { fr: "Architecture & Planning", en: "Architecture & Planning" }, duration: { fr: "4 semaines", en: "4 weeks" }, desc: { fr: "Conception de l\u2019architecture cible, plan de donn\u00e9es, estimation budg\u00e9taire et planification par vagues.", en: "Target architecture design, data plan, budget estimation, and wave-based planning." } },
          { name: { fr: "Validation & Livraison", en: "Validation & Delivery" }, duration: { fr: "3 semaines", en: "3 weeks" }, desc: { fr: "Revue avec le comit\u00e9 ex\u00e9cutif, ajustements et livraison du document final.", en: "Executive committee review, adjustments, and final document delivery." } },
        ],
        deliverables: [
          { fr: "Roadmap AI sur 12-18 mois", en: "12-18 month AI roadmap" },
          { fr: "Matrice de priorisation des cas d\u2019usage", en: "Use case prioritization matrix" },
          { fr: "Estimation budg\u00e9taire par phase", en: "Phase-by-phase budget estimation" },
          { fr: "Architecture cible de donn\u00e9es et infrastructure", en: "Target data and infrastructure architecture" },
          { fr: "Plan de gouvernance AI", en: "AI governance plan" },
          { fr: "Pr\u00e9sentation ex\u00e9cutive", en: "Executive presentation" },
        ],
        timeline: { fr: "10-12 semaines", en: "10-12 weeks" },
        idealFor: [
          { fr: "VP Technologie / CIO", en: "VP Technology / CIO" },
          { fr: "Directeur Transformation", en: "Director of Transformation" },
          { fr: "Comit\u00e9 ex\u00e9cutif", en: "Executive committee" },
        ],
        subServices: [
          {
            name: { fr: "\u00c9valuation de maturit\u00e9 AI", en: "AI Maturity Assessment" },
            price: { fr: "8 000$", en: "$8,000" },
            desc: { fr: "Diagnostic de votre maturit\u00e9 AI sur 6 dimensions avec benchmark sectoriel et plan d\u2019action.", en: "Diagnostic of your AI maturity across 6 dimensions with industry benchmarking and action plan." },
            deliverables: [
              { fr: "Rapport de maturit\u00e9 AI", en: "AI maturity report" },
              { fr: "Benchmark sectoriel", en: "Industry benchmark" },
              { fr: "Plan d\u2019action prioris\u00e9", en: "Prioritized action plan" },
            ],
            timeline: { fr: "3-4 semaines", en: "3-4 weeks" },
          },
          {
            name: { fr: "Gouvernance AI", en: "AI Governance" },
            price: { fr: "15 000$", en: "$15,000" },
            desc: { fr: "Cadre de gouvernance complet : politiques d\u2019utilisation, conformit\u00e9 Loi 25 / EU AI Act, registre de mod\u00e8les.", en: "Complete governance framework: usage policies, Bill 25 / EU AI Act compliance, model registry." },
            deliverables: [
              { fr: "Politique d\u2019utilisation de l\u2019IA", en: "AI usage policy" },
              { fr: "Guide de conformit\u00e9", en: "Compliance guide" },
              { fr: "Matrice RACI", en: "RACI matrix" },
            ],
            timeline: { fr: "6-8 semaines", en: "6-8 weeks" },
          },
          {
            name: { fr: "D\u00e9ploiement Copilot 365", en: "Copilot 365 Deployment" },
            price: { fr: "20 000$", en: "$20,000" },
            desc: { fr: "Programme complet de d\u00e9ploiement Microsoft Copilot : audit technique, pilote, rollout par vagues et gestion du changement.", en: "Complete Microsoft Copilot deployment program: technical audit, pilot, wave-based rollout, and change management." },
            deliverables: [
              { fr: "Plan de d\u00e9ploiement", en: "Deployment plan" },
              { fr: "Programme de formation", en: "Training program" },
              { fr: "Dashboard d\u2019adoption", en: "Adoption dashboard" },
            ],
            timeline: { fr: "10-14 semaines", en: "10-14 weeks" },
          },
          {
            name: { fr: "Dossier d\u2019affaires AI", en: "AI Business Case" },
            price: { fr: "10 000$", en: "$10,000" },
            desc: { fr: "Dossier d\u2019affaires AI avec mod\u00e8le financier ROI, benchmarks sectoriels et pr\u00e9sentation ex\u00e9cutive.", en: "AI business case with ROI financial model, industry benchmarks, and executive presentation." },
            deliverables: [
              { fr: "Dossier d\u2019affaires complet", en: "Complete business case" },
              { fr: "Mod\u00e8le financier ROI", en: "ROI financial model" },
              { fr: "Pr\u00e9sentation ex\u00e9cutive", en: "Executive presentation" },
            ],
            timeline: { fr: "2-3 semaines", en: "2-3 weeks" },
          },
        ],
      },
      "performance-org": {
        extendedDesc: {
          fr: "Renforcez les capacit\u00e9s humaines de votre organisation pour r\u00e9ussir vos transformations. Notre approche combine expertise en gestion du changement, design organisationnel et d\u00e9veloppement du leadership avec des outils AI qui acc\u00e9l\u00e8rent les diagnostics et personnalisent les interventions.",
          en: "Strengthen your organization\u2019s human capabilities to succeed in your transformations. Our approach combines change management expertise, organizational design, and leadership development with AI tools that accelerate diagnostics and personalize interventions.",
        },
        differentiator: {
          fr: "Nos agents AI analysent les signaux organisationnels (sondages, communications, feedback) pour fournir des diagnostics en temps r\u00e9el et personnaliser les interventions de changement \u2014 chaque employ\u00e9 re\u00e7oit un parcours adapt\u00e9 \u00e0 son profil.",
          en: "Our AI agents analyze organizational signals (surveys, communications, feedback) to provide real-time diagnostics and personalize change interventions \u2014 each employee receives a journey adapted to their profile.",
        },
        phases: [
          { name: { fr: "Diagnostic organisationnel", en: "Organizational Diagnostic" }, duration: { fr: "2 semaines", en: "2 weeks" }, desc: { fr: "\u00c9valuation de la culture, de la readiness au changement et cartographie des parties prenantes.", en: "Culture assessment, change readiness evaluation, and stakeholder mapping." } },
          { name: { fr: "Strat\u00e9gie d\u2019intervention", en: "Intervention Strategy" }, duration: { fr: "2 semaines", en: "2 weeks" }, desc: { fr: "Plan de changement, programme de formation, r\u00e9seau d\u2019ambassadeurs et plan de communication.", en: "Change plan, training program, ambassador network, and communication plan." } },
          { name: { fr: "Ex\u00e9cution & Mesure", en: "Execution & Measurement" }, duration: { fr: "Continu", en: "Ongoing" }, desc: { fr: "D\u00e9ploiement du plan, coaching, formation et mesure d\u2019adoption en temps r\u00e9el.", en: "Plan deployment, coaching, training, and real-time adoption measurement." } },
        ],
        deliverables: [
          { fr: "Diagnostic organisationnel", en: "Organizational diagnostic" },
          { fr: "Plan de gestion du changement", en: "Change management plan" },
          { fr: "Programme de formation", en: "Training program" },
          { fr: "Dashboard d\u2019adoption en temps r\u00e9el", en: "Real-time adoption dashboard" },
          { fr: "Kit de communication", en: "Communication kit" },
        ],
        timeline: { fr: "Continu (min. 8 semaines)", en: "Ongoing (min. 8 weeks)" },
        idealFor: [
          { fr: "VP RH / CHRO", en: "VP HR / CHRO" },
          { fr: "Directeur Transformation", en: "Director of Transformation" },
          { fr: "VP Op\u00e9rations", en: "VP Operations" },
        ],
        subServices: [
          {
            name: { fr: "Gestion du changement", en: "Change Management" },
            price: { fr: "15 000$", en: "$15,000" },
            desc: { fr: "Programme complet de gestion du changement : analyse d\u2019impact, plan de communication, formation et mesure d\u2019adoption.", en: "Complete change management program: impact analysis, communication plan, training, and adoption measurement." },
            deliverables: [
              { fr: "Plan de changement", en: "Change plan" },
              { fr: "Kit de communication", en: "Communication kit" },
              { fr: "Dashboard d\u2019adoption", en: "Adoption dashboard" },
            ],
            timeline: { fr: "8-12 semaines", en: "8-12 weeks" },
          },
          {
            name: { fr: "Design organisationnel", en: "Organizational Design" },
            price: { fr: "20 000$", en: "$20,000" },
            desc: { fr: "Conception de la structure organisationnelle cible : r\u00f4les, responsabilit\u00e9s, gouvernance et m\u00e9canismes de coordination.", en: "Target organizational structure design: roles, responsibilities, governance, and coordination mechanisms." },
            deliverables: [
              { fr: "Organigramme cible", en: "Target org chart" },
              { fr: "Fiches de poste", en: "Job descriptions" },
              { fr: "Plan de transition", en: "Transition plan" },
            ],
            timeline: { fr: "6-8 semaines", en: "6-8 weeks" },
          },
          {
            name: { fr: "Programme de leadership", en: "Leadership Program" },
            price: { fr: "10 000$", en: "$10,000" },
            desc: { fr: "Programme de d\u00e9veloppement du leadership adapt\u00e9 \u00e0 votre contexte de transformation, avec coaching individuel et ateliers collectifs.", en: "Leadership development program adapted to your transformation context, with individual coaching and group workshops." },
            deliverables: [
              { fr: "Programme de d\u00e9veloppement", en: "Development program" },
              { fr: "Sessions de coaching", en: "Coaching sessions" },
              { fr: "\u00c9valuation 360\u00b0", en: "360\u00b0 assessment" },
            ],
            timeline: { fr: "Continu", en: "Ongoing" },
          },
        ],
      },
    },
  },

  // ─── Marketplace ───────────────────────────────────
  marketplace: {
    badge: { fr: "Marketplace", en: "Marketplace" },
    title: "Talsom Forge Hub",
    subtitle: {
      fr: "Nos outils AI propri\u00e9taires, con\u00e7us par des consultants pour des consultants. Int\u00e9grez-les dans vos processus ou utilisez-les en autonomie.",
      en: "Our proprietary AI tools, designed by consultants for consultants. Integrate them into your processes or use them independently.",
    },
    items: [
      {
        id: "hub",
        name: "Talsom Forge Hub",
        tagline: { fr: "Plateforme de consulting virtuel", en: "Virtual consulting platform" },
        desc: { fr: "Suite compl\u00e8te d\u2019outils AI pour le consulting : diagnostics automatis\u00e9s, g\u00e9n\u00e9ration de livrables, chat sp\u00e9cialis\u00e9 et tableaux de bord.", en: "Complete AI tool suite for consulting: automated diagnostics, deliverable generation, specialized chat, and dashboards." },
        features: { fr: "Diagnostics AI,G\u00e9n\u00e9ration de rapports,Chat expert,Tableaux de bord", en: "AI Diagnostics,Report Generation,Expert Chat,Dashboards" },
        tier: "Platform",
        badgeCls: "bg-[#FDF100]/15 text-[#FDF100] border-[#FDF100]/25",
      },
      {
        id: "backlog",
        name: "AI Backlog Manager",
        tagline: { fr: "Gestion de portefeuille de cas d\u2019usage", en: "Use case portfolio management" },
        desc: { fr: "Identifiez, priorisez et suivez vos cas d\u2019usage AI avec un framework de scoring et des vues portefeuille intelligentes.", en: "Identify, prioritize, and track your AI use cases with a scoring framework and intelligent portfolio views." },
        features: { fr: "Scoring multicrit\u00e8re,Vues portefeuille,Suivi ROI,Collaboration", en: "Multi-criteria Scoring,Portfolio Views,ROI Tracking,Collaboration" },
        tier: "Tool",
        badgeCls: "bg-emerald-400/15 text-emerald-300 border-emerald-400/25",
      },
      {
        id: "pia",
        name: "Privacy Impact Assessor",
        tagline: { fr: "EFVP automatis\u00e9e Loi 25", en: "Automated Bill 25 PIA" },
        desc: { fr: "G\u00e9n\u00e9rez des \u00e9valuations des facteurs relatifs \u00e0 la vie priv\u00e9e conformes \u00e0 la Loi 25 pour vos projets AI en quelques minutes.", en: "Generate privacy impact assessments compliant with Bill 25 for your AI projects in minutes." },
        features: { fr: "Conformit\u00e9 Loi 25,Rapport automatis\u00e9,Registre des risques,Suivi", en: "Bill 25 Compliance,Automated Reports,Risk Registry,Tracking" },
        tier: "Tool",
        badgeCls: "bg-amber-400/15 text-amber-300 border-amber-400/25",
      },
      {
        id: "governance-tool",
        name: "AI Governance Suite",
        tagline: { fr: "Gouvernance AI cl\u00e9 en main", en: "Turnkey AI governance" },
        desc: { fr: "Cadre de gouvernance complet avec mod\u00e8les de politiques, matrices RACI, registres de mod\u00e8les et tableaux de bord de conformit\u00e9.", en: "Complete governance framework with policy templates, RACI matrices, model registries, and compliance dashboards." },
        features: { fr: "Politiques AI,RACI automatis\u00e9,Registre de mod\u00e8les,Audit trail", en: "AI Policies,Automated RACI,Model Registry,Audit Trail" },
        tier: "Suite",
        badgeCls: "bg-[#D2D9D9]/15 text-[#D2D9D9] border-[#D2D9D9]/25",
      },
    ],
    details: {
      hub: {
        extendedDesc: {
          fr: "Talsom Forge Hub est la plateforme centrale qui int\u00e8gre tous nos outils AI. Elle offre un espace de travail unifi\u00e9 pour piloter vos initiatives de transformation AI : diagnostics automatis\u00e9s, g\u00e9n\u00e9ration de livrables personnalis\u00e9s, chat expert et tableaux de bord de suivi en temps r\u00e9el.",
          en: "Talsom Forge Hub is the central platform integrating all our AI tools. It offers a unified workspace to manage your AI transformation initiatives: automated diagnostics, personalized deliverable generation, expert chat, and real-time tracking dashboards.",
        },
        keyBenefits: [
          { title: { fr: "Espace de travail unifi\u00e9", en: "Unified workspace" }, desc: { fr: "Tous vos projets AI sur une seule plateforme, avec vue d\u2019ensemble et suivi.", en: "All your AI projects on one platform, with overview and tracking." } },
          { title: { fr: "Livrables g\u00e9n\u00e9r\u00e9s par AI", en: "AI-generated deliverables" }, desc: { fr: "Rapports, pr\u00e9sentations et documents g\u00e9n\u00e9r\u00e9s automatiquement et personnalis\u00e9s.", en: "Reports, presentations, and documents generated automatically and customized." } },
          { title: { fr: "Collaboration en temps r\u00e9el", en: "Real-time collaboration" }, desc: { fr: "Partagez et collaborez avec vos \u00e9quipes et consultants Talsom.", en: "Share and collaborate with your teams and Talsom consultants." } },
        ],
        integrations: ["Microsoft 365", "SharePoint", "Teams", "Power BI", "Slack", "Jira"],
        availability: { fr: "Beta priv\u00e9e", en: "Private beta" },
      },
      backlog: {
        extendedDesc: {
          fr: "AI Backlog Manager permet de centraliser, scorer et prioriser tous vos cas d\u2019usage AI dans un portefeuille structur\u00e9. Le framework de scoring multicrit\u00e8re \u00e9value chaque initiative selon l\u2019impact business, la faisabilit\u00e9 technique, l\u2019effort et l\u2019alignement strat\u00e9gique.",
          en: "AI Backlog Manager allows you to centralize, score, and prioritize all your AI use cases in a structured portfolio. The multi-criteria scoring framework evaluates each initiative based on business impact, technical feasibility, effort, and strategic alignment.",
        },
        keyBenefits: [
          { title: { fr: "Priorisation objective", en: "Objective prioritization" }, desc: { fr: "Framework de scoring sur 4 dimensions pour \u00e9liminer les biais de s\u00e9lection.", en: "4-dimension scoring framework to eliminate selection bias." } },
          { title: { fr: "Vue portefeuille", en: "Portfolio view" }, desc: { fr: "Visualisez tous vos cas d\u2019usage sur une matrice impact/effort interactive.", en: "Visualize all your use cases on an interactive impact/effort matrix." } },
          { title: { fr: "Suivi du ROI", en: "ROI tracking" }, desc: { fr: "Mesurez la valeur r\u00e9alis\u00e9e vs projet\u00e9e pour chaque initiative d\u00e9ploy\u00e9e.", en: "Measure realized vs projected value for each deployed initiative." } },
        ],
        integrations: ["Jira", "Azure DevOps", "Notion", "Excel", "Power BI"],
        availability: { fr: "Disponible", en: "Available" },
      },
      pia: {
        extendedDesc: {
          fr: "Privacy Impact Assessor automatise la production d\u2019\u00c9valuations des Facteurs relatifs \u00e0 la Vie Priv\u00e9e (EFVP) conformes \u00e0 la Loi 25. R\u00e9pondez \u00e0 un questionnaire guid\u00e9 et obtenez un rapport complet avec analyse de risques, mesures de mitigation et registre de conformit\u00e9.",
          en: "Privacy Impact Assessor automates the production of Privacy Impact Assessments (PIA) compliant with Quebec\u2019s Bill 25. Answer a guided questionnaire and get a complete report with risk analysis, mitigation measures, and compliance registry.",
        },
        keyBenefits: [
          { title: { fr: "Conformit\u00e9 acc\u00e9l\u00e9r\u00e9e", en: "Accelerated compliance" }, desc: { fr: "De plusieurs semaines \u00e0 quelques heures pour produire une EFVP compl\u00e8te.", en: "From several weeks to a few hours to produce a complete PIA." } },
          { title: { fr: "Registre centralis\u00e9", en: "Centralized registry" }, desc: { fr: "Tous vos projets AI avec leur statut de conformit\u00e9 sur un seul tableau de bord.", en: "All your AI projects with their compliance status on a single dashboard." } },
          { title: { fr: "Mises \u00e0 jour r\u00e9glementaires", en: "Regulatory updates" }, desc: { fr: "Le questionnaire \u00e9volue automatiquement avec les changements r\u00e9glementaires.", en: "The questionnaire automatically evolves with regulatory changes." } },
        ],
        integrations: ["OneTrust", "Microsoft Purview", "ServiceNow", "Excel"],
        availability: { fr: "Disponible", en: "Available" },
      },
      "governance-tool": {
        extendedDesc: {
          fr: "AI Governance Suite est une solution compl\u00e8te pour implanter et op\u00e9rer votre cadre de gouvernance AI. Elle inclut des mod\u00e8les de politiques pr\u00e9-r\u00e9dig\u00e9s, des workflows d\u2019approbation automatis\u00e9s, un registre de mod\u00e8les AI et des tableaux de bord de conformit\u00e9 en temps r\u00e9el.",
          en: "AI Governance Suite is a complete solution for implementing and operating your AI governance framework. It includes pre-drafted policy templates, automated approval workflows, an AI model registry, and real-time compliance dashboards.",
        },
        keyBenefits: [
          { title: { fr: "Politiques pr\u00eates \u00e0 l\u2019emploi", en: "Ready-to-use policies" }, desc: { fr: "Mod\u00e8les de politiques AI adapt\u00e9s aux standards canadiens et europ\u00e9ens.", en: "AI policy templates adapted to Canadian and European standards." } },
          { title: { fr: "Workflows automatis\u00e9s", en: "Automated workflows" }, desc: { fr: "Processus d\u2019approbation, revue \u00e9thique et classification des risques automatis\u00e9s.", en: "Automated approval processes, ethical review, and risk classification." } },
          { title: { fr: "Audit trail complet", en: "Complete audit trail" }, desc: { fr: "Tra\u00e7abilit\u00e9 compl\u00e8te de toutes les d\u00e9cisions et modifications de gouvernance.", en: "Full traceability of all governance decisions and changes." } },
        ],
        integrations: ["Microsoft 365", "ServiceNow", "Confluence", "Azure ML", "AWS SageMaker"],
        availability: { fr: "Beta", en: "Beta" },
      },
    },
  },

  // ─── Case Studies ──────────────────────────────────
  caseStudies: {
    badge: { fr: "\u00c9tudes de cas", en: "Case studies" },
    title: { fr: "Des r\u00e9sultats concrets, mesurables", en: "Concrete, measurable results" },
    subtitle: {
      fr: "D\u00e9couvrez comment nos clients ont transform\u00e9 leurs op\u00e9rations avec Talsom Forge.",
      en: "See how our clients have transformed their operations with Talsom Forge.",
    },
    items: [
      {
        client: "Desjardins",
        sector: { fr: "Services financiers", en: "Financial services" },
        title: { fr: "Refonte du processus order-to-cash", en: "Order-to-cash process redesign" },
        challenge: { fr: "Processus OTC de 12 jours avec 6 transferts manuels et 3 points de ressaisie.", en: "12-day OTC process with 6 manual handoffs and 3 data re-entry points." },
        solution: { fr: "Redesign AI Native avec agents de pr\u00e9diction et automatisation des approbations.", en: "AI Native redesign with prediction agents and approval automation." },
        results: [
          { metric: { fr: "-65%", en: "-65%" }, label: { fr: "Temps de cycle", en: "Cycle time" } },
          { metric: { fr: "3.2x", en: "3.2x" }, label: { fr: "ROI", en: "ROI" } },
          { metric: { fr: "8 sem.", en: "8 wks" }, label: { fr: "Livr\u00e9 en", en: "Delivered in" } },
        ],
        service: { fr: "Business et Process Design", en: "Business et Process Design" },
        color: "#00897B",
      },
      {
        client: "Pomerleau",
        sector: { fr: "Construction", en: "Construction" },
        title: { fr: "Roadmap de modernisation TI", en: "IT modernization roadmap" },
        challenge: { fr: "40% de dette technique et syst\u00e8mes h\u00e9rit\u00e9s bloquant l'innovation.", en: "40% technical debt and legacy systems blocking innovation." },
        solution: { fr: "Audit AI du parc applicatif et roadmap de migration cloud en 3 vagues.", en: "AI-powered application portfolio audit and 3-wave cloud migration roadmap." },
        results: [
          { metric: { fr: "-40%", en: "-40%" }, label: { fr: "Dette technique", en: "Technical debt" } },
          { metric: { fr: "2.8x", en: "2.8x" }, label: { fr: "ROI", en: "ROI" } },
          { metric: { fr: "18 mois", en: "18 months" }, label: { fr: "Horizon", en: "Horizon" } },
        ],
        service: { fr: "Roadmap de modernisation", en: "Modernization Roadmap" },
        color: "#1565C0",
      },
      {
        client: "Hydro-Qu\u00e9bec",
        sector: { fr: "\u00c9nergie", en: "Energy" },
        title: { fr: "Programme de gestion du changement", en: "Change management program" },
        challenge: { fr: "R\u00e9sistance au changement et faible adoption lors de la transformation num\u00e9rique.", en: "Change resistance and low adoption during digital transformation." },
        solution: { fr: "Ateliers virtuels co-facilit\u00e9s AI avec parcours personnalis\u00e9s par profil employ\u00e9.", en: "AI co-facilitated virtual workshops with employee-specific adoption journeys." },
        results: [
          { metric: { fr: "94%", en: "94%" }, label: { fr: "Taux d'adoption", en: "Adoption rate" } },
          { metric: { fr: "+3x", en: "+3x" }, label: { fr: "Productivit\u00e9 ateliers", en: "Workshop productivity" } },
          { metric: { fr: "12 sem.", en: "12 wks" }, label: { fr: "D\u00e9ploiement", en: "Deployment" } },
        ],
        service: { fr: "Performance organisationnelle", en: "Organizational Performance" },
        color: "#F57F17",
      },
    ],
  },

  // ─── Testimonials ──────────────────────────────────
  testimonials: {
    badge: { fr: "T\u00e9moignages", en: "Testimonials" },
    title: { fr: "Ce que disent nos clients", en: "What our clients say" },
    subtitle: {
      fr: "Des leaders de l\u2019industrie nous font confiance pour acc\u00e9l\u00e9rer leur transformation.",
      en: "Industry leaders trust us to accelerate their transformation.",
    },
    items: [
      {
        name: "Marie-Claire Dubois",
        role: { fr: "VP Transformation Digitale", en: "VP Digital Transformation" },
        company: "Desjardins",
        quote: {
          fr: "L\u2019accompagnement de Talsom Forge sur notre mod\u00e8le op\u00e9rationnel cible a \u00e9t\u00e9 d\u00e9terminant. La combinaison d\u2019ateliers virtuels et d\u2019outils AI a r\u00e9duit notre temps de diagnostic de plusieurs semaines.",
          en: "Talsom Forge\u2019s support on our target operating model was decisive. The combination of virtual workshops and AI tools reduced our diagnostic time by several weeks.",
        },
      },
      {
        name: "Jean-Philippe Tremblay",
        role: { fr: "CIO", en: "CIO" },
        company: "Pomerleau",
        quote: {
          fr: "La feuille de route de modernisation livr\u00e9e par Talsom Forge nous a permis de s\u00e9quencer nos investissements TI avec une rigueur qu\u2019on n\u2019avait pas avant. 40% de r\u00e9duction de notre dette technique en 18 mois.",
          en: "The modernization roadmap delivered by Talsom Forge allowed us to sequence our IT investments with a rigor we didn\u2019t have before. 40% reduction in technical debt in 18 months.",
        },
      },
      {
        name: "Isabelle Marchand",
        role: { fr: "Directrice RH", en: "HR Director" },
        company: "Hydro-Qu\u00e9bec",
        quote: {
          fr: "Le programme de gestion du changement accompagn\u00e9 par Talsom Forge a transform\u00e9 notre capacit\u00e9 d\u2019adoption. Nos \u00e9quipes ont vu la valeur d\u00e8s la premi\u00e8re session d\u2019atelier virtuel.",
          en: "The change management program supported by Talsom Forge transformed our adoption capability. Our teams saw the value from the very first virtual workshop session.",
        },
      },
    ],
  },

  // ─── Comparison ────────────────────────────────────
  comparison: {
    badge: { fr: "Pourquoi Talsom Forge", en: "Why Talsom Forge" },
    title: { fr: "Consulting traditionnel vs Talsom Forge", en: "Traditional consulting vs Talsom Forge" },
    subtitle: {
      fr: "L'expertise humaine, amplifi\u00e9e par l'AI. Moins cher, plus rapide, plus pr\u00e9cis.",
      en: "Human expertise, amplified by AI. More affordable, faster, more precise.",
    },
    traditionalLabel: { fr: "Consulting traditionnel", en: "Traditional consulting" },
    forgeLabel: "Talsom Forge",
    rows: [
      { label: { fr: "Dur\u00e9e typique d'un diagnostic", en: "Typical diagnostic duration" }, traditional: { fr: "4-6 semaines", en: "4-6 weeks" }, forge: { fr: "1-2 semaines", en: "1-2 weeks" } },
      { label: { fr: "Livrables g\u00e9n\u00e9r\u00e9s par s\u00e9ance", en: "Deliverables per session" }, traditional: { fr: "Manuels, post-atelier", en: "Manual, post-workshop" }, forge: { fr: "Automatis\u00e9s, en temps r\u00e9el", en: "Automated, real-time" } },
      { label: { fr: "Disponibilit\u00e9 des consultants", en: "Consultant availability" }, traditional: { fr: "Heures ouvrables", en: "Business hours" }, forge: { fr: "24/7 (AI) + heures ouvrables", en: "24/7 (AI) + business hours" } },
      { label: { fr: "Co\u00fbt d'un diagnostic processus", en: "Process diagnostic cost" }, traditional: { fr: "30 000$ - 60 000$", en: "$30,000 - $60,000" }, forge: { fr: "\u00c0 partir de 15 000$", en: "Starting at $15,000" } },
      { label: { fr: "Benchmark sectoriel int\u00e9gr\u00e9", en: "Built-in industry benchmarks" }, traditional: false, forge: true },
      { label: { fr: "Cartographies g\u00e9n\u00e9r\u00e9es par AI", en: "AI-generated process maps" }, traditional: false, forge: true },
      { label: { fr: "Rapports de s\u00e9ance instantan\u00e9s", en: "Instant session reports" }, traditional: false, forge: true },
      { label: { fr: "Suivi d'adoption en temps r\u00e9el", en: "Real-time adoption tracking" }, traditional: false, forge: true },
    ],
  },

  // ─── AI Chat ───────────────────────────────────────
  aiChat: {
    badge: "AI Chat Expert",
    title: { fr: "Votre consultant virtuel,\ndisponible 24/7.", en: "Your virtual consultant,\navailable 24/7." },
    subtitle: {
      fr: "Notre chat AI est entra\u00een\u00e9 sur des milliers de mandats de consulting : processus, modernisation, AI et performance organisationnelle. Il pose les bonnes questions et g\u00e9n\u00e8re des livrables pr\u00eats \u00e0 l\u2019emploi.",
      en: "Our AI chat is trained on thousands of consulting engagements: process, modernization, AI, and organizational performance. It asks the right questions and generates ready-to-use deliverables.",
    },
    features: [
      { iconName: "Brain", text: { fr: "Expertise processus, modernisation, AI et performance", en: "Process, modernization, AI, and performance expertise" } },
      { iconName: "BookOpen", text: { fr: "G\u00e9n\u00e9ration de diagnostics, roadmaps et analyses", en: "Diagnostic, roadmap, and analysis generation" } },
      { iconName: "Lock", text: { fr: "Conformit\u00e9 Loi 25, EU AI Act, RGPD", en: "Bill 25, EU AI Act, GDPR compliance" } },
      { iconName: "Globe", text: { fr: "Bilingue fran\u00e7ais / anglais", en: "Bilingual French / English" } },
    ],
    scenarios: [
      {
        key: "process",
        iconName: "Settings2",
        label: { fr: "Processus", en: "Process" },
        exchanges: {
          fr: [
            {
              user: "Notre processus order-to-cash est lent et plein d'\u00e9tapes manuelles. Pouvez-vous nous aider \u00e0 diagnostiquer le probl\u00e8me?",
              assistant: "Absolument! Commen\u00e7ons par un diagnostic rapide. D'apr\u00e8s les sympt\u00f4mes que vous d\u00e9crivez, voici ce que je vais analyser :\n\n1. **Cartographie du processus** \u2014 Je vais g\u00e9n\u00e9rer une carte de l'\u00e9tat actuel (AS-IS) de votre flux order-to-cash\n2. **Identification des goulots** \u2014 Transferts manuels, boucles d'approbation et ressaisies de donn\u00e9es\n3. **Comparaison benchmark** \u2014 Votre temps de cycle vs les standards de l'industrie\n4. **Gains rapides** \u2014 Candidats \u00e0 l'automatisation et \u00e0 la simplification\n\nPouvez-vous d\u00e9crire les \u00e9tapes principales depuis la r\u00e9ception d'une commande jusqu'au paiement?",
            },
            {
              user: "Oui, on re\u00e7oit les commandes par courriel, puis on les saisit manuellement dans notre ERP, on v\u00e9rifie l'inventaire, on envoie pour approbation, puis on exp\u00e9die. La facturation est faite s\u00e9par\u00e9ment par la comptabilit\u00e9.",
              assistant: "J'ai cartographi\u00e9 votre processus. Voici le diagnostic :\n\n**Rapport g\u00e9n\u00e9r\u00e9** \u2014 OTC_Diagnostic_Talsom.pdf\n\n**Constats cl\u00e9s :**\n\u2192 **6 transferts manuels** identifi\u00e9s (meilleure pratique : 2)\n\u2192 **Temps de cycle estim\u00e9 :** 8-12 jours (benchmark : 3-4 jours)\n\u2192 **Ressaisie de donn\u00e9es :** 3 points (commande, inventaire, facture)\n\n**Top 3 gains rapides :**\n1. Saisie automatis\u00e9e des commandes (parsing courriel + int\u00e9gration ERP) \u2014 \u00e9conomie de ~2 jours\n2. V\u00e9rification d'inventaire en temps r\u00e9el \u2014 \u00e9limine la v\u00e9rification manuelle\n3. Facturation automatique \u00e0 la confirmation d'exp\u00e9dition \u2014 \u00e9conomie de ~1.5 jours\n\n**Am\u00e9lioration estim\u00e9e :** R\u00e9duction de 55-65% du temps de cycle. Voulez-vous que je g\u00e9n\u00e8re le mod\u00e8le op\u00e9rationnel cible (TO-BE) avec une feuille de route de mise en \u0153uvre?",
            },
            {
              user: "Oui, g\u00e9n\u00e8re le mod\u00e8le cible et la feuille de route.",
              assistant: "Voici votre feuille de route de transformation :\n\n**Phase 1 \u2014 Gains rapides (4 semaines) :**\n\u2192 Saisie automatis\u00e9e des commandes via parsing courriel\n\u2192 Int\u00e9gration ERP pour inventaire en temps r\u00e9el\n\u2192 **Investissement :** ~25 000$ | **Impact :** -3 jours temps de cycle\n\n**Phase 2 \u2014 Refonte du processus (8 semaines) :**\n\u2192 Automatisation du workflow d'approbation\n\u2192 Facturation automatique \u00e0 l'exp\u00e9dition\n\u2192 **Investissement :** ~45 000$ | **Impact :** -2 jours suppl\u00e9mentaires\n\n**Phase 3 \u2014 Optimisation continue :**\n\u2192 Pr\u00e9vision de la demande par AI\n\u2192 Gestion pr\u00e9dictive des exceptions\n\n**ROI total projet\u00e9 :** 3.2x sur 12 mois. Le rapport complet avec la cartographie TO-BE est pr\u00eat. Souhaitez-vous planifier un atelier avec nos consultants pour valider la feuille de route?",
            },
          ],
          en: [
            {
              user: "Our order-to-cash process is slow and full of manual steps. Can you help us diagnose the problem?",
              assistant: "Absolutely! Let's start with a rapid diagnostic. Based on the symptoms you describe, here's what I'll analyze:\n\n1. **Process mapping** \u2014 I'll generate a current-state (AS-IS) map of your order-to-cash flow from your description\n2. **Bottleneck identification** \u2014 Manual handoffs, approval loops, and data re-entry points\n3. **Benchmark comparison** \u2014 Your cycle time vs industry standards\n4. **Quick-win opportunities** \u2014 Automation and simplification candidates\n\nCan you describe the main steps from when a customer places an order to when payment is received?",
            },
            {
              user: "Yes, we receive orders by email, then manually enter them in our ERP, verify inventory, send for approval, then ship. Invoicing is done separately in accounting.",
              assistant: "I've mapped your process. Here's the diagnostic:\n\n**Report generated** \u2014 OTC_Diagnostic_Talsom.pdf\n\n**Key findings:**\n\u2192 **6 manual handoffs** identified (industry best practice: 2)\n\u2192 **Estimated cycle time:** 8-12 days (benchmark: 3-4 days)\n\u2192 **Data re-entry:** 3 points (order, inventory, invoice)\n\n**Top 3 quick wins:**\n1. Automated order intake (email parsing + ERP integration) \u2014 saves ~2 days\n2. Real-time inventory check \u2014 eliminates manual verification\n3. Auto-invoicing on shipment confirmation \u2014 saves ~1.5 days\n\n**Estimated improvement:** 55-65% cycle time reduction. Want me to generate the target operating model (TO-BE) with an implementation roadmap?",
            },
            {
              user: "Yes, generate the target model and roadmap.",
              assistant: "Here's your transformation roadmap:\n\n**Phase 1 \u2014 Quick wins (4 weeks):**\n\u2192 Automated order intake via email parsing\n\u2192 ERP integration for real-time inventory\n\u2192 **Investment:** ~$25,000 | **Impact:** -3 days cycle time\n\n**Phase 2 \u2014 Process redesign (8 weeks):**\n\u2192 Approval workflow automation\n\u2192 Auto-invoicing on shipment\n\u2192 **Investment:** ~$45,000 | **Impact:** -2 days additional\n\n**Phase 3 \u2014 Continuous optimization:**\n\u2192 AI-powered demand forecasting\n\u2192 Predictive exception handling\n\n**Total projected ROI:** 3.2x over 12 months. The full report with TO-BE process map is ready. Would you like to schedule a workshop with our consultants to validate the roadmap?",
            },
          ],
        },
      },
      {
        key: "modernisation",
        iconName: "Server",
        label: { fr: "Modernisation", en: "Modernization" },
        exchanges: {
          fr: [
            { user: "On a beaucoup de dette technique et nos syst\u00e8mes legacy bloquent notre croissance. Par o\u00f9 commencer?", assistant: "Excellente question. Commen\u00e7ons par un audit de votre parc applicatif. Voici mon approche :\n\n1. **Inventaire applicatif** \u2014 Je vais classifier vos syst\u00e8mes par criticit\u00e9 et co\u00fbt de maintenance\n2. **Analyse de la dette technique** \u2014 Identifier les composants \u00e0 risque vs ceux encore viables\n3. **Matrice de migration** \u2014 Prioriser : moderniser, migrer au cloud, ou remplacer\n4. **Business case** \u2014 ROI estim\u00e9 par vague de transformation\n\nCombien d'applications avez-vous dans votre parc actuel? Et quel est votre pourcentage estim\u00e9 de syst\u00e8mes legacy (> 10 ans)?" },
            { user: "On a environ 45 applications. Je dirais 40% de syst\u00e8mes legacy, surtout notre ERP et notre CRM maison.", assistant: "J'ai analys\u00e9 votre profil. Voici le diagnostic :\n\n**Rapport g\u00e9n\u00e9r\u00e9** \u2014 Audit_TI_Talsom.pdf\n\n**Constats cl\u00e9s :**\n\u2192 **18 applications legacy** \u00e0 risque sur 45 (40%)\n\u2192 **Co\u00fbt de maintenance estim\u00e9 :** 2.5x celui d'un parc moderne\n\u2192 **ERP + CRM maison** = 65% de votre dette technique\n\n**Strat\u00e9gie recommand\u00e9e en 3 vagues :**\n\n**Vague 1 (0-6 mois) :** Migration CRM \u2192 SaaS (Salesforce/HubSpot)\n\u2192 **Impact :** -35% co\u00fbts maintenance, adoption imm\u00e9diate\n\n**Vague 2 (6-12 mois) :** Modernisation ERP (containerisation + API)\n\u2192 **Impact :** Int\u00e9grations modernes, r\u00e9duction risque\n\n**Vague 3 (12-18 mois) :** Consolidation et optimisation cloud\n\u2192 **Impact :** Architecture scalable, -40% dette technique totale\n\n**ROI projet\u00e9 :** 2.8x sur 18 mois. Souhaitez-vous la feuille de route d\u00e9taill\u00e9e avec le budget par vague?" },
            { user: "Oui, g\u00e9n\u00e8re la feuille de route avec les budgets.", assistant: "Voici votre roadmap de modernisation :\n\n**Vague 1 \u2014 CRM SaaS (6 mois) :**\n\u2192 Migration donn\u00e9es + personnalisations\n\u2192 Formation \u00e9quipes ventes et marketing\n\u2192 **Budget :** 120 000$ - 180 000$ | **\u00c9conomie annuelle :** 85 000$\n\n**Vague 2 \u2014 Modernisation ERP (6 mois) :**\n\u2192 Containerisation des modules critiques\n\u2192 Couche API pour int\u00e9grations\n\u2192 **Budget :** 250 000$ - 350 000$ | **\u00c9conomie annuelle :** 150 000$\n\n**Vague 3 \u2014 Consolidation cloud (6 mois) :**\n\u2192 Migration workloads restants\n\u2192 Optimisation et monitoring\n\u2192 **Budget :** 80 000$ - 120 000$ | **\u00c9conomie annuelle :** 60 000$\n\n**Budget total :** 450K$ - 650K$ | **\u00c9conomies annuelles :** 295K$/an\n**ROI :** Breakeven \u00e0 ~22 mois, 2.8x sur 36 mois\n\nLe rapport complet est pr\u00eat. Planifions un atelier de validation avec votre \u00e9quipe TI?" },
          ],
          en: [
            { user: "We have a lot of technical debt and legacy systems blocking our growth. Where should we start?", assistant: "Great question. Let's begin with an application portfolio audit. Here's my approach:\n\n1. **Application inventory** \u2014 I'll classify your systems by criticality and maintenance cost\n2. **Technical debt analysis** \u2014 Identify at-risk components vs still-viable ones\n3. **Migration matrix** \u2014 Prioritize: modernize, migrate to cloud, or replace\n4. **Business case** \u2014 Estimated ROI per transformation wave\n\nHow many applications are in your current portfolio? And what's your estimated percentage of legacy systems (> 10 years)?" },
            { user: "We have about 45 applications. I'd say 40% legacy, mainly our ERP and homegrown CRM.", assistant: "I've analyzed your profile. Here's the diagnostic:\n\n**Report generated** \u2014 IT_Audit_Talsom.pdf\n\n**Key findings:**\n\u2192 **18 legacy applications** at risk out of 45 (40%)\n\u2192 **Estimated maintenance cost:** 2.5x that of a modern portfolio\n\u2192 **ERP + homegrown CRM** = 65% of your technical debt\n\n**Recommended 3-wave strategy:**\n\n**Wave 1 (0-6 months):** CRM migration \u2192 SaaS (Salesforce/HubSpot)\n\u2192 **Impact:** -35% maintenance costs, immediate adoption\n\n**Wave 2 (6-12 months):** ERP modernization (containerization + API)\n\u2192 **Impact:** Modern integrations, reduced risk\n\n**Wave 3 (12-18 months):** Cloud consolidation and optimization\n\u2192 **Impact:** Scalable architecture, -40% total technical debt\n\n**Projected ROI:** 2.8x over 18 months. Would you like the detailed roadmap with budget per wave?" },
            { user: "Yes, generate the roadmap with budgets.", assistant: "Here's your modernization roadmap:\n\n**Wave 1 \u2014 CRM SaaS (6 months):**\n\u2192 Data migration + customizations\n\u2192 Sales and marketing team training\n\u2192 **Budget:** $120,000 - $180,000 | **Annual savings:** $85,000\n\n**Wave 2 \u2014 ERP Modernization (6 months):**\n\u2192 Containerization of critical modules\n\u2192 API layer for integrations\n\u2192 **Budget:** $250,000 - $350,000 | **Annual savings:** $150,000\n\n**Wave 3 \u2014 Cloud Consolidation (6 months):**\n\u2192 Remaining workload migration\n\u2192 Optimization and monitoring\n\u2192 **Budget:** $80,000 - $120,000 | **Annual savings:** $60,000\n\n**Total budget:** $450K - $650K | **Annual savings:** $295K/year\n**ROI:** Breakeven at ~22 months, 2.8x over 36 months\n\nThe full report is ready. Shall we schedule a validation workshop with your IT team?" },
          ],
        },
      },
      {
        key: "ia",
        iconName: "Brain",
        label: { fr: "IA / AI", en: "IA / AI" },
        exchanges: {
          fr: [
            { user: "On veut int\u00e9grer l'IA dans nos processus mais on ne sait pas par o\u00f9 commencer. Pouvez-vous nous guider?", assistant: "Bien s\u00fbr! La cl\u00e9 est de commencer par les cas d'usage \u00e0 fort impact et faible complexit\u00e9. Voici ma m\u00e9thode :\n\n1. **\u00c9valuation de maturit\u00e9 IA** \u2014 O\u00f9 en \u00eates-vous? (donn\u00e9es, infrastructure, comp\u00e9tences)\n2. **Identification des cas d'usage** \u2014 Par d\u00e9partement et processus\n3. **Matrice priorisation** \u2014 Impact business \u00d7 Faisabilit\u00e9 technique\n4. **Roadmap IA** \u2014 S\u00e9quen\u00e7age en 3 horizons\n\nDans quel secteur op\u00e9rez-vous et quels sont vos 2-3 enjeux business principaux?" },
            { user: "On est dans le manufacturier. Nos enjeux : pr\u00e9diction de la demande, qualit\u00e9 produit, et maintenance de nos \u00e9quipements.", assistant: "Excellent! Le manufacturier est l'un des secteurs avec le meilleur ROI en IA. Voici mon analyse :\n\n**Rapport g\u00e9n\u00e9r\u00e9** \u2014 Roadmap_IA_Manufacturier_Talsom.pdf\n\n**Maturit\u00e9 IA estim\u00e9e :** Niveau 2/5 (Exploratoire)\n\n**Top 3 cas d'usage prioris\u00e9s :**\n\n\ud83e\udd47 **Maintenance pr\u00e9dictive** (Impact: \u2605\u2605\u2605\u2605\u2605 | Faisabilit\u00e9: \u2605\u2605\u2605\u2605)\n\u2192 ROI estim\u00e9 : 4-6x | R\u00e9duction pannes : -40%\n\u2192 Donn\u00e9es requises : capteurs IoT, historique maintenance\n\n\ud83e\udd48 **Pr\u00e9diction de la demande** (Impact: \u2605\u2605\u2605\u2605 | Faisabilit\u00e9: \u2605\u2605\u2605\u2605)\n\u2192 ROI estim\u00e9 : 2-3x | Pr\u00e9cision stock : +30%\n\u2192 Donn\u00e9es requises : ventes historiques, saisonnalit\u00e9\n\n\ud83e\udd49 **Contr\u00f4le qualit\u00e9 par vision** (Impact: \u2605\u2605\u2605\u2605 | Faisabilit\u00e9: \u2605\u2605\u2605)\n\u2192 ROI estim\u00e9 : 3-4x | D\u00e9fauts d\u00e9tect\u00e9s : +60%\n\u2192 Donn\u00e9es requises : images produits, historique d\u00e9fauts\n\nVoulez-vous que je g\u00e9n\u00e8re la roadmap d\u00e9taill\u00e9e avec les investissements par horizon?" },
            { user: "Oui, avec les investissements et le calendrier.", assistant: "Voici votre Roadmap IA :\n\n**Horizon 1 \u2014 Quick wins (3-6 mois) :**\n\u2192 Maintenance pr\u00e9dictive (pilote sur 1 ligne)\n\u2192 Dashboard pr\u00e9dictif de la demande\n\u2192 **Investissement :** 80 000$ - 120 000$\n\u2192 **ROI attendu :** 2x d\u00e8s la 1\u00e8re ann\u00e9e\n\n**Horizon 2 \u2014 Scale (6-12 mois) :**\n\u2192 D\u00e9ploiement maintenance pr\u00e9dictive (toutes les lignes)\n\u2192 Vision par ordinateur pour contr\u00f4le qualit\u00e9\n\u2192 **Investissement :** 200 000$ - 300 000$\n\u2192 **ROI cumul\u00e9 :** 3.5x\n\n**Horizon 3 \u2014 Transformation (12-18 mois) :**\n\u2192 Jumeau num\u00e9rique de la production\n\u2192 Optimisation cha\u00eene d'approvisionnement par IA\n\u2192 **Investissement :** 150 000$ - 250 000$\n\n**Investissement total :** 430K$ - 670K$\n**ROI projet\u00e9 :** 4.2x sur 24 mois\n\nProchaine \u00e9tape : un atelier avec vos \u00e9quipes op\u00e9rations et TI pour valider les donn\u00e9es disponibles. On planifie?" },
          ],
          en: [
            { user: "We want to integrate AI into our processes but don't know where to start. Can you guide us?", assistant: "Of course! The key is to start with high-impact, low-complexity use cases. Here's my approach:\n\n1. **AI maturity assessment** \u2014 Where are you? (data, infrastructure, skills)\n2. **Use case identification** \u2014 By department and process\n3. **Prioritization matrix** \u2014 Business impact \u00d7 Technical feasibility\n4. **AI Roadmap** \u2014 Sequencing across 3 horizons\n\nWhat industry are you in, and what are your 2-3 main business challenges?" },
            { user: "We're in manufacturing. Our challenges: demand forecasting, product quality, and equipment maintenance.", assistant: "Excellent! Manufacturing is one of the sectors with the best AI ROI. Here's my analysis:\n\n**Report generated** \u2014 AI_Roadmap_Manufacturing_Talsom.pdf\n\n**Estimated AI maturity:** Level 2/5 (Exploratory)\n\n**Top 3 prioritized use cases:**\n\n\ud83e\udd47 **Predictive maintenance** (Impact: \u2605\u2605\u2605\u2605\u2605 | Feasibility: \u2605\u2605\u2605\u2605)\n\u2192 Estimated ROI: 4-6x | Downtime reduction: -40%\n\u2192 Required data: IoT sensors, maintenance history\n\n\ud83e\udd48 **Demand forecasting** (Impact: \u2605\u2605\u2605\u2605 | Feasibility: \u2605\u2605\u2605\u2605)\n\u2192 Estimated ROI: 2-3x | Inventory accuracy: +30%\n\u2192 Required data: historical sales, seasonality\n\n\ud83e\udd49 **Visual quality control** (Impact: \u2605\u2605\u2605\u2605 | Feasibility: \u2605\u2605\u2605)\n\u2192 Estimated ROI: 3-4x | Defect detection: +60%\n\u2192 Required data: product images, defect history\n\nWould you like me to generate the detailed roadmap with investments per horizon?" },
            { user: "Yes, with investments and timeline.", assistant: "Here's your AI Roadmap:\n\n**Horizon 1 \u2014 Quick wins (3-6 months):**\n\u2192 Predictive maintenance (pilot on 1 line)\n\u2192 Demand forecasting dashboard\n\u2192 **Investment:** $80,000 - $120,000\n\u2192 **Expected ROI:** 2x in year 1\n\n**Horizon 2 \u2014 Scale (6-12 months):**\n\u2192 Predictive maintenance rollout (all lines)\n\u2192 Computer vision for quality control\n\u2192 **Investment:** $200,000 - $300,000\n\u2192 **Cumulative ROI:** 3.5x\n\n**Horizon 3 \u2014 Transformation (12-18 months):**\n\u2192 Production digital twin\n\u2192 AI-powered supply chain optimization\n\u2192 **Investment:** $150,000 - $250,000\n\n**Total investment:** $430K - $670K\n**Projected ROI:** 4.2x over 24 months\n\nNext step: a workshop with your operations and IT teams to validate available data. Shall we schedule it?" },
          ],
        },
      },
      {
        key: "performance",
        iconName: "Users",
        label: { fr: "Performance", en: "Performance" },
        exchanges: {
          fr: [
            { user: "On lance une transformation num\u00e9rique majeure mais nos \u00e9quipes r\u00e9sistent au changement. Comment on g\u00e8re \u00e7a?", assistant: "La r\u00e9sistance au changement est le #1 facteur d'\u00e9chec des transformations. Voici mon approche structur\u00e9e :\n\n1. **Diagnostic d'adoption** \u2014 Identifier les freins par profil d'employ\u00e9\n2. **Cartographie des parties prenantes** \u2014 Alli\u00e9s, neutres, r\u00e9sistants\n3. **Plan de gestion du changement** \u2014 Personnalis\u00e9 par groupe\n4. **Mesure continue** \u2014 KPIs d'adoption en temps r\u00e9el\n\nCombien d'employ\u00e9s sont touch\u00e9s par la transformation et quels syst\u00e8mes/processus changent?" },
            { user: "Environ 800 employ\u00e9s. On d\u00e9ploie un nouveau CRM et on refond nos processus de vente.", assistant: "J'ai pr\u00e9par\u00e9 votre diagnostic. Voici l'analyse :\n\n**Rapport g\u00e9n\u00e9r\u00e9** \u2014 Diagnostic_Changement_Talsom.pdf\n\n**Profil de risque :**\n\u2192 **800 employ\u00e9s** impact\u00e9s \u2014 Transformation majeure\n\u2192 **Risque d'adoption estim\u00e9 :** \u00c9lev\u00e9 (CRM + processus simultan\u00e9ment)\n\u2192 **Groupes critiques :** \u00c9quipe ventes terrain (r\u00e9sistance anticip\u00e9e : haute)\n\n**Plan de gestion du changement recommand\u00e9 :**\n\n**Phase 1 \u2014 Pr\u00e9parer (4 semaines) :**\n\u2192 Ateliers de co-design avec les champions de chaque \u00e9quipe\n\u2192 Communication personnalis\u00e9e par profil (terrain vs bureau)\n\u2192 Formation des managers comme agents du changement\n\n**Phase 2 \u2014 D\u00e9ployer (8 semaines) :**\n\u2192 Parcours d'adoption gamifi\u00e9\n\u2192 Sessions de support par groupe de 15-20\n\u2192 Dashboard d'adoption en temps r\u00e9el\n\n**Phase 3 \u2014 Ancrer (6 semaines) :**\n\u2192 Coaching individuel pour les profils r\u00e9sistants\n\u2192 C\u00e9l\u00e9bration des quick wins\n\n**Taux d'adoption cible :** 90%+ \u00e0 12 semaines. Voulez-vous le plan d\u00e9taill\u00e9 avec le calendrier?" },
            { user: "Oui, avec le calendrier et les ressources n\u00e9cessaires.", assistant: "Voici votre plan de gestion du changement :\n\n**Semaines 1-4 \u2014 Pr\u00e9parer :**\n\u2192 4 ateliers de co-design (2h chacun)\n\u2192 Kit de communication (emails, vid\u00e9os, FAQ)\n\u2192 Formation de 12 champions internes\n\u2192 **Ressources :** 1 consultant senior + outils AI Talsom Forge\n\u2192 **Co\u00fbt :** 25 000$\n\n**Semaines 5-12 \u2014 D\u00e9ployer :**\n\u2192 40 sessions de formation (20 employ\u00e9s/session)\n\u2192 Parcours e-learning personnalis\u00e9 par profil\n\u2192 Support chatbot 24/7 via Talsom Forge\n\u2192 **Ressources :** 2 formateurs + plateforme AI\n\u2192 **Co\u00fbt :** 55 000$\n\n**Semaines 13-18 \u2014 Ancrer :**\n\u2192 Coaching cibl\u00e9 pour les 10-15% r\u00e9sistants\n\u2192 Optimisation bas\u00e9e sur les donn\u00e9es d'adoption\n\u2192 Rapport final avec recommandations\n\u2192 **Co\u00fbt :** 20 000$\n\n**Budget total :** 100 000$ | **Taux d'adoption cible :** 94%\n**ROI :** Chaque % d'adoption = ~15 000$ de productivit\u00e9 r\u00e9cup\u00e9r\u00e9e\n\nPr\u00eat \u00e0 lancer? On peut planifier le premier atelier de co-design d\u00e8s la semaine prochaine." },
          ],
          en: [
            { user: "We're launching a major digital transformation but our teams are resisting the change. How do we handle this?", assistant: "Change resistance is the #1 factor in transformation failure. Here's my structured approach:\n\n1. **Adoption diagnostic** \u2014 Identify barriers by employee profile\n2. **Stakeholder mapping** \u2014 Allies, neutrals, resistors\n3. **Change management plan** \u2014 Customized by group\n4. **Continuous measurement** \u2014 Real-time adoption KPIs\n\nHow many employees are affected by the transformation, and what systems/processes are changing?" },
            { user: "About 800 employees. We're deploying a new CRM and redesigning our sales processes.", assistant: "I've prepared your diagnostic. Here's the analysis:\n\n**Report generated** \u2014 Change_Diagnostic_Talsom.pdf\n\n**Risk profile:**\n\u2192 **800 employees** impacted \u2014 Major transformation\n\u2192 **Estimated adoption risk:** High (CRM + processes simultaneously)\n\u2192 **Critical groups:** Field sales team (anticipated resistance: high)\n\n**Recommended change management plan:**\n\n**Phase 1 \u2014 Prepare (4 weeks):**\n\u2192 Co-design workshops with team champions\n\u2192 Personalized communication by profile (field vs office)\n\u2192 Train managers as change agents\n\n**Phase 2 \u2014 Deploy (8 weeks):**\n\u2192 Gamified adoption journey\n\u2192 Support sessions for groups of 15-20\n\u2192 Real-time adoption dashboard\n\n**Phase 3 \u2014 Anchor (6 weeks):**\n\u2192 Individual coaching for resistant profiles\n\u2192 Quick wins celebration\n\n**Target adoption rate:** 90%+ at 12 weeks. Would you like the detailed plan with timeline?" },
            { user: "Yes, with timeline and required resources.", assistant: "Here's your change management plan:\n\n**Weeks 1-4 \u2014 Prepare:**\n\u2192 4 co-design workshops (2h each)\n\u2192 Communication kit (emails, videos, FAQ)\n\u2192 Train 12 internal champions\n\u2192 **Resources:** 1 senior consultant + Talsom Forge AI tools\n\u2192 **Cost:** $25,000\n\n**Weeks 5-12 \u2014 Deploy:**\n\u2192 40 training sessions (20 employees/session)\n\u2192 Personalized e-learning by profile\n\u2192 24/7 chatbot support via Talsom Forge\n\u2192 **Resources:** 2 trainers + AI platform\n\u2192 **Cost:** $55,000\n\n**Weeks 13-18 \u2014 Anchor:**\n\u2192 Targeted coaching for the 10-15% resistors\n\u2192 Data-driven optimization based on adoption metrics\n\u2192 Final report with recommendations\n\u2192 **Cost:** $20,000\n\n**Total budget:** $100,000 | **Target adoption rate:** 94%\n**ROI:** Each % of adoption = ~$15,000 in recovered productivity\n\nReady to launch? We can schedule the first co-design workshop as early as next week." },
          ],
        },
      },
    ],
  },

  // ─── Pricing ───────────────────────────────────────
  pricing: {
    badge: { fr: "Tarification", en: "Pricing" },
    title: { fr: "Un plan pour chaque ambition", en: "A plan for every ambition" },
    subtitle: { fr: "Commencez gratuitement, montez en puissance quand vous \u00eates pr\u00eats.", en: "Start free, scale up when you\u2019re ready." },
    plans: [
      {
        name: "Explorer",
        price: { fr: "Gratuit", en: "Free" },
        sub: { fr: "Pour d\u00e9couvrir", en: "To explore" },
        features: [
          { fr: "Chat AI (10 messages/mois)", en: "AI Chat (10 messages/month)" },
          { fr: "1 diagnostic d\u2019affaires", en: "1 business diagnostic" },
          { fr: "Acc\u00e8s marketplace (lecture)", en: "Marketplace access (read-only)" },
          { fr: "Support communautaire", en: "Community support" },
        ],
        cta: { fr: "Commencer gratuitement", en: "Start for free" },
        highlight: false,
      },
      {
        name: "Professional",
        price: { fr: "990$/mois", en: "$990/month" },
        sub: { fr: "Pour les \u00e9quipes", en: "For teams" },
        features: [
          { fr: "Chat AI illimit\u00e9", en: "Unlimited AI Chat" },
          { fr: "Diagnostics processus et maturit\u00e9", en: "Process and maturity diagnostics" },
          { fr: "G\u00e9n\u00e9ration de livrables", en: "Deliverable generation" },
          { fr: "5 services virtuels/mois", en: "5 virtual services/month" },
          { fr: "Support prioritaire", en: "Priority support" },
          { fr: "Ateliers virtuels co-facilit\u00e9s AI", en: "AI co-facilitated virtual workshops" },
        ],
        cta: { fr: "Essai gratuit 14 jours", en: "Free 14-day trial" },
        highlight: true,
      },
      {
        name: "Enterprise",
        price: { fr: "Sur mesure", en: "Custom" },
        sub: { fr: "Pour les grandes organisations", en: "For large organizations" },
        features: [
          { fr: "Tout Professional +", en: "Everything in Professional +" },
          { fr: "Consultants seniors d\u00e9di\u00e9s", en: "Dedicated senior consultants" },
          { fr: "Personnalisation compl\u00e8te", en: "Full customization" },
          { fr: "SLA garanti", en: "Guaranteed SLA" },
          { fr: "Ateliers et formations sur mesure", en: "Custom workshops and training" },
          { fr: "API & integrations", en: "API & integrations" },
        ],
        cta: { fr: "Contactez-nous", en: "Contact us" },
        highlight: false,
      },
    ],
  },

  // ─── FAQ ───────────────────────────────────────────
  faq: {
    badge: "FAQ",
    title: { fr: "Questions fr\u00e9quentes", en: "Frequently asked questions" },
    subtitle: { fr: "Tout ce que vous devez savoir pour commencer.", en: "Everything you need to know to get started." },
    items: [
      {
        q: { fr: "Qu\u2019est-ce que Talsom Forge exactement?", en: "What is Talsom Forge exactly?" },
        a: {
          fr: "Talsom Forge est une plateforme de consulting virtuel qui couvre 4 domaines d\u2019expertise : Business et Process Design, Modernisation technologique, Intelligence artificielle et Performance organisationnelle. Chaque mandat combine l\u2019accompagnement de consultants seniors avec la puissance de nos agents AI pour des livrables de qualit\u00e9, livr\u00e9s plus rapidement.",
          en: "Talsom Forge is a virtual consulting platform covering 4 areas of expertise: Business and Process Design, Technology Modernization, Artificial Intelligence, and Organizational Performance. Each engagement combines senior consultant guidance with the power of our AI agents for quality deliverables, delivered faster.",
        },
      },
      {
        q: { fr: "Comment fonctionnent les ateliers virtuels avec AI?", en: "How do virtual workshops with AI work?" },
        a: {
          fr: "Nos ateliers sont co-facilit\u00e9s par un consultant senior et des agents AI. L\u2019AI synth\u00e9tise les contributions en temps r\u00e9el, g\u00e9n\u00e8re des cartographies de processus, analyse les donn\u00e9es partag\u00e9es et produit un rapport de s\u00e9ance imm\u00e9diatement apr\u00e8s chaque atelier. Le r\u00e9sultat : des ateliers 3x plus productifs.",
          en: "Our workshops are co-facilitated by a senior consultant and AI agents. The AI synthesizes contributions in real time, generates process maps, analyzes shared data, and produces a session report immediately after each workshop. The result: workshops that are 3x more productive.",
        },
      },
      {
        q: { fr: "Est-ce que mes donn\u00e9es sont s\u00e9curis\u00e9es?", en: "Is my data secure?" },
        a: {
          fr: "Absolument. Vos donn\u00e9es sont h\u00e9berg\u00e9es au Canada, chiffr\u00e9es au repos et en transit, et ne sont jamais utilis\u00e9es pour entra\u00eener nos mod\u00e8les. Nous sommes conformes \u00e0 la Loi 25 et au RGPD. Chaque organisation dispose d\u2019un environnement isol\u00e9.",
          en: "Absolutely. Your data is hosted in Canada, encrypted at rest and in transit, and never used to train our models. We are compliant with Bill 25 and GDPR. Each organization has an isolated environment.",
        },
      },
      {
        q: { fr: "Quelle est la diff\u00e9rence entre un service virtuel et du consulting traditionnel?", en: "What\u2019s the difference between a virtual service and traditional consulting?" },
        a: {
          fr: "Les services virtuels combinent l\u2019expertise humaine de consultants seniors avec l\u2019automatisation AI. Vous obtenez des livrables de qualit\u00e9 consulting plus rapidement et \u00e0 moindre co\u00fbt. Les ateliers sont virtuels mais interactifs, enrichis par des agents AI qui dynamisent l\u2019output. Pour des mandats complexes, nos consultants interviennent en compl\u00e9ment.",
          en: "Virtual services combine senior consultant human expertise with AI automation. You get consulting-quality deliverables faster and at lower cost. Workshops are virtual but interactive, enhanced by AI agents that boost output. For complex engagements, our consultants step in to complement the platform.",
        },
      },
      {
        q: { fr: "Puis-je essayer avant de m\u2019engager?", en: "Can I try before committing?" },
        a: {
          fr: "Oui! Le plan Explorer est gratuit et inclut 10 messages de chat par mois, un diagnostic d\u2019affaires et l\u2019acc\u00e8s en lecture \u00e0 la marketplace. Vous pouvez aussi demander un essai gratuit de 14 jours du plan Professional.",
          en: "Yes! The Explorer plan is free and includes 10 chat messages per month, one business diagnostic, and read-only marketplace access. You can also request a free 14-day trial of the Professional plan.",
        },
      },
      {
        q: { fr: "Combien de temps prend un mandat typique?", en: "How long does a typical engagement take?" },
        a: {
          fr: "Cela d\u00e9pend du domaine. Un diagnostic de processus prend 3-4 semaines, une roadmap de modernisation 8-10 semaines, une Roadmap IA 10-12 semaines. Les outils de la marketplace (PIA, Backlog Manager) sont disponibles imm\u00e9diatement.",
          en: "It depends on the domain. A process diagnostic takes 3-4 weeks, a modernization roadmap 8-10 weeks, an AI Roadmap 10-12 weeks. Marketplace tools (PIA, Backlog Manager) are available immediately.",
        },
      },
    ],
  },

  // ─── Contact ───────────────────────────────────────
  contact: {
    badge: { fr: "Contact", en: "Contact" },
    title: { fr: "Parlons de votre projet", en: "Let\u2019s talk about your project" },
    subtitle: {
      fr: "Que vous souhaitiez une d\u00e9mo, un acc\u00e8s beta ou un accompagnement personnalis\u00e9, notre \u00e9quipe est disponible pour vous guider.",
      en: "Whether you want a demo, beta access, or personalized guidance, our team is available to help.",
    },
    contactInfo: [
      { iconName: "Mail", text: { fr: "info@talsom.com", en: "info@talsom.com" } },
      { iconName: "MapPin", text: { fr: "Montr\u00e9al, QC, Canada", en: "Montreal, QC, Canada" } },
      { iconName: "Globe", text: { fr: "talsom.com", en: "talsom.com" } },
    ],
    formLabels: {
      name: { fr: "Nom complet", en: "Full name" },
      email: { fr: "Courriel", en: "Email" },
      company: { fr: "Entreprise", en: "Company" },
      companyPlaceholder: { fr: "Votre entreprise", en: "Your company" },
      message: { fr: "Message", en: "Message" },
      messagePlaceholder: { fr: "D\u00e9crivez votre projet ou posez vos questions\u2026", en: "Describe your project or ask your questions\u2026" },
      submit: { fr: "Envoyer le message", en: "Send message" },
      sending: { fr: "Envoi en cours\u2026", en: "Sending\u2026" },
      success: { fr: "Message envoy\u00e9!", en: "Message sent!" },
      successSub: { fr: "Nous vous r\u00e9pondrons sous 24 heures.", en: "We\u2019ll get back to you within 24 hours." },
      note: { fr: "Nous r\u00e9pondons g\u00e9n\u00e9ralement sous 24h.", en: "We typically respond within 24 hours." },
    },
  },

  // ─── CTA Banner ────────────────────────────────────
  ctaBanner: {
    title: { fr: "Pr\u00eat \u00e0 transformer votre organisation?", en: "Ready to transform your organization?" },
    subtitle: {
      fr: "Rejoignez la beta et acc\u00e9dez \u00e0 l\u2019expertise de Talsom Forge \u2014 consultants seniors et AI, disponibles en quelques clics.",
      en: "Join the beta and access Talsom Forge expertise \u2014 senior consultants and AI, available in just a few clicks.",
    },
    ctaPrimary: { fr: "Demander un acc\u00e8s beta", en: "Request beta access" },
    ctaSecondary: { fr: "Planifier une d\u00e9mo", en: "Schedule a demo" },
  },

  // ─── Footer ────────────────────────────────────────
  footer: {
    tagline: { fr: "Plateforme de consulting virtuel.", en: "Virtual consulting platform." },
    columns: [
      {
        title: { fr: "Services", en: "Services" },
        links: [
          { fr: "Business et Process Design", en: "Business & Process Design" },
          { fr: "Roadmap de modernisation", en: "Modernization Roadmap" },
          { fr: "Roadmap IA", en: "AI Roadmap" },
          { fr: "Performance organisationnelle", en: "Organizational Performance" },
        ],
      },
      {
        title: { fr: "Marketplace", en: "Marketplace" },
        links: [
          { fr: "Talsom Forge Hub", en: "Talsom Forge Hub" },
          { fr: "AI Backlog Manager", en: "AI Backlog Manager" },
          { fr: "Privacy Assessor", en: "Privacy Assessor" },
          { fr: "Governance Suite", en: "Governance Suite" },
        ],
      },
      {
        title: { fr: "Entreprise", en: "Company" },
        links: [
          { fr: "\u00c0 propos", en: "About" },
          { fr: "Carri\u00e8res", en: "Careers" },
          { fr: "Blog", en: "Blog" },
          { fr: "Contact", en: "Contact" },
          { fr: "Mentions l\u00e9gales", en: "Legal" },
        ],
      },
    ],
    bottomLinks: [
      { fr: "Confidentialit\u00e9", en: "Privacy" },
      { fr: "Conditions", en: "Terms" },
      { fr: "Cookies", en: "Cookies" },
    ],
    copyright: {
      fr: "\u00a9 2026 Talsom. Tous droits r\u00e9serv\u00e9s. Plateforme beta \u2014 acc\u00e8s sur invitation.",
      en: "\u00a9 2026 Talsom. All rights reserved. Beta platform \u2014 invite only.",
    },
  },
};
