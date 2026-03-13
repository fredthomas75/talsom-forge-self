import { Settings2, Server, Brain, Users } from "lucide-react";
import type { Lang } from "@/lib/constants";
import { t } from "@/lib/constants";

export type SubService = { name: string; price: string; credits?: number; desc: string; deliverables: string[]; timeline: string };
export type CategoryDetail = { extendedDesc: string; differentiator: string; phases: { name: string; duration: string; desc: string }[]; deliverables: string[]; timeline: string; idealFor: string[]; subServices: SubService[] };

export function getServices(lang: Lang) {
  return [
    { id: "process-design", icon: Settings2, title: "Business et Process Design", subtitle: t(lang, "Conception de processus et mod\u00e8le op\u00e9rationnel", "Process design and operating model"), desc: t(lang, "Optimisez vos processus ou redesignez-les en mode AI Native : des agents AI (pr\u00e9diction, d\u00e9cision, ex\u00e9cution) \u00e0 chaque \u00e9tape, l\u2019humain ne g\u00e8re que les exceptions.", "Optimize your processes or redesign them AI Native: AI agents (prediction, decision, execution) at each step, humans only handle exceptions."), tags: t(lang, "Processus,AI Native,4-10 semaines", "Process,AI Native,4-10 weeks").split(","), price: t(lang, "\u00c0 partir de 15 000$", "Starting at $15,000"), popular: true },
    { id: "modernisation", icon: Server, title: t(lang, "Roadmap de modernisation", "Modernization Roadmap"), subtitle: t(lang, "Strat\u00e9gie de modernisation technologique", "Technology modernization strategy"), desc: t(lang, "Planifiez la modernisation de vos syst\u00e8mes h\u00e9rit\u00e9s et votre migration vers le cloud avec une feuille de route s\u00e9quenc\u00e9e et budg\u00e9tis\u00e9e.", "Plan the modernization of your legacy systems and cloud migration with a sequenced and budgeted roadmap."), tags: t(lang, "Cloud,Architecture,6-12 semaines", "Cloud,Architecture,6-12 weeks").split(","), price: t(lang, "\u00c0 partir de 15 000$", "Starting at $15,000"), popular: false },
    { id: "roadmap-ia", icon: Brain, title: "Roadmap IA", subtitle: t(lang, "Strat\u00e9gie et feuille de route AI", "AI strategy and roadmap"), desc: t(lang, "D\u00e9finissez votre trajectoire AI avec une roadmap personnalis\u00e9e couvrant strat\u00e9gie, maturit\u00e9, gouvernance et d\u00e9ploiement d\u2019outils comme Copilot 365.", "Define your AI trajectory with a personalized roadmap covering strategy, maturity, governance, and tool deployment like Copilot 365."), tags: t(lang, "IA,Strat\u00e9gie,4-14 semaines", "AI,Strategy,4-14 weeks").split(","), price: t(lang, "\u00c0 partir de 8 000$", "Starting at $8,000"), popular: true },
    { id: "performance-org", icon: Users, title: t(lang, "Performance organisationnelle", "Organizational Performance"), subtitle: t(lang, "Gestion du changement et leadership", "Change management and leadership"), desc: t(lang, "Renforcez les capacit\u00e9s humaines de votre organisation : gestion du changement, design organisationnel, leadership et culture.", "Strengthen your organization\u2019s human capabilities: change management, organizational design, leadership, and culture."), tags: t(lang, "Changement,Leadership,Continu", "Change,Leadership,Ongoing").split(","), price: t(lang, "\u00c0 partir de 10 000$", "Starting at $10,000"), popular: false },
  ];
}

export function getServiceDetails(lang: Lang): Record<string, CategoryDetail> {
  return {
    "process-design": {
      extendedDesc: t(lang,
        "Notre \u00e9quipe de consultants seniors con\u00e7oit et optimise vos processus d\u2019affaires \u00e0 travers des ateliers virtuels interactifs. Nous allons au-del\u00e0 de l\u2019optimisation classique : nous redesignons vos processus en mode AI Native, en positionnant des agents intelligents (pr\u00e9diction, d\u00e9cision, ex\u00e9cution) \u00e0 chaque \u00e9tape pour maximiser l\u2019automatisation et ne laisser que la gestion des exceptions aux employ\u00e9s.",
        "Our senior consultants design and optimize your business processes through interactive virtual workshops. We go beyond classic optimization: we redesign your processes in AI Native mode, positioning intelligent agents (prediction, decision, execution) at each step to maximize automation and leave only exception handling to employees."
      ),
      differentiator: t(lang,
        "Notre approche AI Native repense chaque processus en pla\u00e7ant des agents AI au c\u0153ur du flux \u2014 pr\u00e9diction des issues, prise de d\u00e9cision automatis\u00e9e, ex\u00e9cution autonome. L\u2019humain intervient uniquement sur les exceptions et les d\u00e9cisions \u00e0 forte valeur ajout\u00e9e. R\u00e9sultat : des processus 5 \u00e0 10x plus rapides avec une qualit\u00e9 constante.",
        "Our AI Native approach rethinks each process by placing AI agents at the core of the flow \u2014 predicting outcomes, automating decisions, and executing autonomously. Humans only intervene on exceptions and high-value decisions. Result: processes 5-10x faster with consistent quality."
      ),
      phases: [
        { name: t(lang, "Diagnostic & Cadrage", "Diagnostic & Scoping"), duration: t(lang, "2 semaines", "2 weeks"), desc: t(lang, "Entrevues parties prenantes, collecte documentaire et cartographie AS-IS des processus cibl\u00e9s.", "Stakeholder interviews, document collection, and AS-IS mapping of targeted processes.") },
        { name: t(lang, "Ateliers de co-design", "Co-design Workshops"), duration: t(lang, "3-4 semaines", "3-4 weeks"), desc: t(lang, "Sessions virtuelles collaboratives avec agents AI pour concevoir le mod\u00e8le TO-BE et les quick wins.", "Collaborative virtual sessions with AI agents to design the TO-BE model and quick wins.") },
        { name: t(lang, "Livraison & Feuille de route", "Delivery & Roadmap"), duration: t(lang, "2 semaines", "2 weeks"), desc: t(lang, "Documentation finale, plan de mise en \u0153uvre s\u00e9quenc\u00e9 et pr\u00e9sentation ex\u00e9cutive.", "Final documentation, sequenced implementation plan, and executive presentation.") },
      ],
      deliverables: [
        t(lang, "Cartographie AS-IS / TO-BE des processus", "AS-IS / TO-BE process mapping"),
        t(lang, "Analyse des goulots et recommandations", "Bottleneck analysis and recommendations"),
        t(lang, "Mod\u00e8le op\u00e9rationnel cible", "Target operating model"),
        t(lang, "Design de processus AI Native (agents + exceptions)", "AI Native process design (agents + exceptions)"),
        t(lang, "Feuille de route de mise en \u0153uvre", "Implementation roadmap"),
        t(lang, "Pr\u00e9sentation ex\u00e9cutive", "Executive presentation"),
      ],
      timeline: t(lang, "6-10 semaines", "6-10 weeks"),
      idealFor: [t(lang, "VP Op\u00e9rations / COO", "VP Operations / COO"), t(lang, "Directeur Processus", "Process Director"), t(lang, "Directeur Transformation", "Director of Transformation")],
      subServices: [
        { name: t(lang, "Diagnostic de processus", "Process Diagnostic"), price: t(lang, "15 000$", "$15,000"), credits: 150, desc: t(lang, "Cartographie rapide AS-IS de 3 \u00e0 5 processus cl\u00e9s avec identification des goulots et quick wins.", "Rapid AS-IS mapping of 3-5 key processes with bottleneck identification and quick wins."), deliverables: [t(lang, "Cartographies AS-IS (BPMN)", "AS-IS maps (BPMN)"), t(lang, "Rapport d\u2019analyse des goulots", "Bottleneck analysis report"), t(lang, "Liste de quick wins prioris\u00e9s", "Prioritized quick wins list")], timeline: t(lang, "3-4 semaines", "3-4 weeks") },
        { name: t(lang, "Design de mod\u00e8le op\u00e9rationnel", "Operating Model Design"), price: t(lang, "25 000$", "$25,000"), credits: 250, desc: t(lang, "Conception compl\u00e8te du mod\u00e8le op\u00e9rationnel cible incluant structure, processus, gouvernance et technologie.", "Complete target operating model design including structure, processes, governance, and technology."), deliverables: [t(lang, "Mod\u00e8le op\u00e9rationnel TO-BE", "TO-BE operating model"), t(lang, "Blueprint organisationnel", "Organizational blueprint"), t(lang, "Plan de transition", "Transition plan")], timeline: t(lang, "6-8 semaines", "6-8 weeks") },
        { name: t(lang, "Automatisation de processus", "Process Automation"), price: t(lang, "20 000$", "$20,000"), credits: 200, desc: t(lang, "Identification et impl\u00e9mentation des opportunit\u00e9s d\u2019automatisation RPA et AI dans vos processus existants.", "Identification and implementation of RPA and AI automation opportunities in your existing processes."), deliverables: [t(lang, "Analyse d\u2019automatisation", "Automation analysis"), t(lang, "Plan d\u2019impl\u00e9mentation RPA/AI", "RPA/AI implementation plan"), t(lang, "Estimation ROI par processus", "ROI estimation per process")], timeline: t(lang, "4-6 semaines", "4-6 weeks") },
        { name: t(lang, "Redesign AI Native", "AI Native Redesign"), price: t(lang, "30 000$", "$30,000"), credits: 300, desc: t(lang, "Reconception compl\u00e8te d\u2019un processus en positionnant des agents AI (pr\u00e9diction, d\u00e9cision, ex\u00e9cution) \u00e0 chaque \u00e9tape \u2014 l\u2019humain ne g\u00e8re que les exceptions et les d\u00e9cisions strat\u00e9giques.", "Complete process redesign positioning AI agents (prediction, decision, execution) at each step \u2014 humans only handle exceptions and strategic decisions."), deliverables: [t(lang, "Processus TO-BE AI Native (BPMN + agents)", "AI Native TO-BE process (BPMN + agents)"), t(lang, "Matrice d\u00e9cisions humain vs. agent", "Human vs. agent decision matrix"), t(lang, "Architecture des agents (pr\u00e9diction, d\u00e9cision, action)", "Agent architecture (prediction, decision, action)"), t(lang, "Business case avec gains d\u2019automatisation", "Business case with automation gains")], timeline: t(lang, "6-10 semaines", "6-10 weeks") },
      ],
    },
    modernisation: {
      extendedDesc: t(lang,
        "Nous planifions la modernisation de vos syst\u00e8mes h\u00e9rit\u00e9s et votre migration vers le cloud avec une feuille de route s\u00e9quenc\u00e9e, budg\u00e9tis\u00e9e et align\u00e9e sur vos priorit\u00e9s d\u2019affaires. Nos consultants combinent expertise en architecture d\u2019entreprise et outils d\u2019analyse AI pour des recommandations fond\u00e9es sur les donn\u00e9es.",
        "We plan the modernization of your legacy systems and cloud migration with a sequenced, budgeted roadmap aligned with your business priorities. Our consultants combine enterprise architecture expertise with AI analysis tools for data-driven recommendations."
      ),
      differentiator: t(lang,
        "Notre plateforme AI analyse automatiquement votre parc applicatif, \u00e9value la dette technique et g\u00e9n\u00e8re des sc\u00e9narios de modernisation compar\u00e9s \u2014 vous gagnez des semaines d\u2019analyse manuelle et obtenez des recommandations bas\u00e9es sur des donn\u00e9es r\u00e9elles.",
        "Our AI platform automatically analyzes your application portfolio, evaluates technical debt, and generates compared modernization scenarios \u2014 you save weeks of manual analysis and get recommendations based on real data."
      ),
      phases: [
        { name: t(lang, "Inventaire & \u00c9valuation", "Inventory & Assessment"), duration: t(lang, "3 semaines", "3 weeks"), desc: t(lang, "Cartographie du parc applicatif, \u00e9valuation de la dette technique et analyse des d\u00e9pendances.", "Application portfolio mapping, technical debt assessment, and dependency analysis.") },
        { name: t(lang, "Strat\u00e9gie & Sc\u00e9narios", "Strategy & Scenarios"), duration: t(lang, "3 semaines", "3 weeks"), desc: t(lang, "D\u00e9finition de la cible, comparaison de sc\u00e9narios (cloud, hybride, refactoring) et analyse co\u00fbts-b\u00e9n\u00e9fices.", "Target definition, scenario comparison (cloud, hybrid, refactoring), and cost-benefit analysis.") },
        { name: t(lang, "Roadmap & Gouvernance", "Roadmap & Governance"), duration: t(lang, "2 semaines", "2 weeks"), desc: t(lang, "Feuille de route s\u00e9quenc\u00e9e par vagues, estimation budg\u00e9taire et cadre de gouvernance.", "Wave-sequenced roadmap, budget estimation, and governance framework.") },
      ],
      deliverables: [
        t(lang, "Cartographie du parc applicatif", "Application portfolio mapping"),
        t(lang, "\u00c9valuation de la dette technique", "Technical debt assessment"),
        t(lang, "Comparaison de sc\u00e9narios de modernisation", "Modernization scenario comparison"),
        t(lang, "Roadmap de modernisation sur 18-24 mois", "18-24 month modernization roadmap"),
        t(lang, "Estimation budg\u00e9taire par vague", "Wave-by-wave budget estimation"),
      ],
      timeline: t(lang, "8-10 semaines", "8-10 weeks"),
      idealFor: [t(lang, "CIO / VP TI", "CIO / VP IT"), t(lang, "Directeur Architecture", "Architecture Director"), t(lang, "VP Infrastructure", "VP Infrastructure")],
      subServices: [
        { name: t(lang, "Audit de dette technique", "Technical Debt Audit"), price: t(lang, "15 000$", "$15,000"), credits: 150, desc: t(lang, "\u00c9valuation approfondie de votre dette technique avec scoring par application et recommandations de rem\u00e9diation.", "In-depth technical debt evaluation with per-application scoring and remediation recommendations."), deliverables: [t(lang, "Rapport de dette technique", "Technical debt report"), t(lang, "Scoring par application", "Per-application scoring"), t(lang, "Plan de rem\u00e9diation prioris\u00e9", "Prioritized remediation plan")], timeline: t(lang, "3-4 semaines", "3-4 weeks") },
        { name: t(lang, "Strat\u00e9gie cloud et migration", "Cloud Strategy & Migration"), price: t(lang, "25 000$", "$25,000"), credits: 250, desc: t(lang, "D\u00e9finition de votre strat\u00e9gie cloud (public, priv\u00e9, hybride) avec plan de migration s\u00e9quenc\u00e9.", "Definition of your cloud strategy (public, private, hybrid) with sequenced migration plan."), deliverables: [t(lang, "Strat\u00e9gie cloud", "Cloud strategy"), t(lang, "Plan de migration par vagues", "Wave-based migration plan"), t(lang, "Analyse financi\u00e8re CapEx/OpEx", "CapEx/OpEx financial analysis")], timeline: t(lang, "6-8 semaines", "6-8 weeks") },
        { name: t(lang, "Architecture d\u2019entreprise cible", "Target Enterprise Architecture"), price: t(lang, "30 000$", "$30,000"), credits: 300, desc: t(lang, "Conception de l\u2019architecture cible align\u00e9e sur votre strat\u00e9gie d\u2019affaires, incluant int\u00e9grations et s\u00e9curit\u00e9.", "Target architecture design aligned with your business strategy, including integrations and security."), deliverables: [t(lang, "Architecture de r\u00e9f\u00e9rence", "Reference architecture"), t(lang, "Mod\u00e8le d\u2019int\u00e9gration", "Integration model"), t(lang, "Roadmap d\u2019impl\u00e9mentation", "Implementation roadmap")], timeline: t(lang, "8-10 semaines", "8-10 weeks") },
      ],
    },
    "roadmap-ia": {
      extendedDesc: t(lang,
        "D\u00e9finissez votre trajectoire AI avec une roadmap personnalis\u00e9e couvrant strat\u00e9gie, maturit\u00e9, gouvernance et d\u00e9ploiement d\u2019outils. Nos consultants combinent leur expertise en intelligence artificielle avec notre plateforme de diagnostic pour des recommandations bas\u00e9es sur votre contexte r\u00e9el.",
        "Define your AI trajectory with a personalized roadmap covering strategy, maturity, governance, and tool deployment. Our consultants combine their artificial intelligence expertise with our diagnostic platform for recommendations based on your actual context."
      ),
      differentiator: t(lang,
        "Notre diagnostic de maturit\u00e9 AI est propuls\u00e9 par des algorithmes qui comparent votre organisation \u00e0 plus de 200 benchmarks sectoriels \u2014 chaque recommandation est valid\u00e9e par des donn\u00e9es r\u00e9elles, puis enrichie par l\u2019exp\u00e9rience terrain de nos consultants.",
        "Our AI maturity diagnostic is powered by algorithms that compare your organization against 200+ industry benchmarks \u2014 each recommendation is validated by real data, then enriched by our consultants\u2019 field experience."
      ),
      phases: [
        { name: t(lang, "D\u00e9couverte & Diagnostic", "Discovery & Diagnostic"), duration: t(lang, "2 semaines", "2 weeks"), desc: t(lang, "Analyse de votre environnement technologique, entrevues parties prenantes et \u00e9valuation de maturit\u00e9 AI.", "Analysis of your technology environment, stakeholder interviews, and AI maturity assessment.") },
        { name: t(lang, "Id\u00e9ation & Priorisation", "Ideation & Prioritization"), duration: t(lang, "3 semaines", "3 weeks"), desc: t(lang, "Identification et scoring des cas d\u2019usage AI selon l\u2019impact business, la faisabilit\u00e9 technique et l\u2019effort requis.", "Identification and scoring of AI use cases based on business impact, technical feasibility, and required effort.") },
        { name: t(lang, "Architecture & Planning", "Architecture & Planning"), duration: t(lang, "4 semaines", "4 weeks"), desc: t(lang, "Conception de l\u2019architecture cible, plan de donn\u00e9es, estimation budg\u00e9taire et planification par vagues.", "Target architecture design, data plan, budget estimation, and wave-based planning.") },
        { name: t(lang, "Validation & Livraison", "Validation & Delivery"), duration: t(lang, "3 semaines", "3 weeks"), desc: t(lang, "Revue avec le comit\u00e9 ex\u00e9cutif, ajustements et livraison du document final.", "Executive committee review, adjustments, and final document delivery.") },
      ],
      deliverables: [
        t(lang, "Roadmap AI sur 12-18 mois", "12-18 month AI roadmap"),
        t(lang, "Matrice de priorisation des cas d\u2019usage", "Use case prioritization matrix"),
        t(lang, "Estimation budg\u00e9taire par phase", "Phase-by-phase budget estimation"),
        t(lang, "Architecture cible de donn\u00e9es et infrastructure", "Target data and infrastructure architecture"),
        t(lang, "Plan de gouvernance AI", "AI governance plan"),
        t(lang, "Pr\u00e9sentation ex\u00e9cutive", "Executive presentation"),
      ],
      timeline: t(lang, "10-12 semaines", "10-12 weeks"),
      idealFor: [t(lang, "VP Technologie / CIO", "VP Technology / CIO"), t(lang, "Directeur Transformation", "Director of Transformation"), t(lang, "Comit\u00e9 ex\u00e9cutif", "Executive committee")],
      subServices: [
        { name: t(lang, "\u00c9valuation de maturit\u00e9 AI", "AI Maturity Assessment"), price: t(lang, "8 000$", "$8,000"), credits: 80, desc: t(lang, "Diagnostic de votre maturit\u00e9 AI sur 6 dimensions avec benchmark sectoriel et plan d\u2019action.", "Diagnostic of your AI maturity across 6 dimensions with industry benchmarking and action plan."), deliverables: [t(lang, "Rapport de maturit\u00e9 AI", "AI maturity report"), t(lang, "Benchmark sectoriel", "Industry benchmark"), t(lang, "Plan d\u2019action prioris\u00e9", "Prioritized action plan")], timeline: t(lang, "3-4 semaines", "3-4 weeks") },
        { name: t(lang, "Gouvernance AI", "AI Governance"), price: t(lang, "15 000$", "$15,000"), credits: 150, desc: t(lang, "Cadre de gouvernance complet : politiques d\u2019utilisation, conformit\u00e9 Loi 25 / EU AI Act, registre de mod\u00e8les.", "Complete governance framework: usage policies, Bill 25 / EU AI Act compliance, model registry."), deliverables: [t(lang, "Politique d\u2019utilisation de l\u2019IA", "AI usage policy"), t(lang, "Guide de conformit\u00e9", "Compliance guide"), t(lang, "Matrice RACI", "RACI matrix")], timeline: t(lang, "6-8 semaines", "6-8 weeks") },
        { name: t(lang, "D\u00e9ploiement Copilot 365", "Copilot 365 Deployment"), price: t(lang, "20 000$", "$20,000"), credits: 200, desc: t(lang, "Programme complet de d\u00e9ploiement Microsoft Copilot : audit technique, pilote, rollout par vagues et gestion du changement.", "Complete Microsoft Copilot deployment program: technical audit, pilot, wave-based rollout, and change management."), deliverables: [t(lang, "Plan de d\u00e9ploiement", "Deployment plan"), t(lang, "Programme de formation", "Training program"), t(lang, "Dashboard d\u2019adoption", "Adoption dashboard")], timeline: t(lang, "10-14 semaines", "10-14 weeks") },
        { name: t(lang, "Dossier d\u2019affaires AI", "AI Business Case"), price: t(lang, "10 000$", "$10,000"), credits: 100, desc: t(lang, "Dossier d\u2019affaires AI avec mod\u00e8le financier ROI, benchmarks sectoriels et pr\u00e9sentation ex\u00e9cutive.", "AI business case with ROI financial model, industry benchmarks, and executive presentation."), deliverables: [t(lang, "Dossier d\u2019affaires complet", "Complete business case"), t(lang, "Mod\u00e8le financier ROI", "ROI financial model"), t(lang, "Pr\u00e9sentation ex\u00e9cutive", "Executive presentation")], timeline: t(lang, "2-3 semaines", "2-3 weeks") },
      ],
    },
    "performance-org": {
      extendedDesc: t(lang,
        "Renforcez les capacit\u00e9s humaines de votre organisation pour r\u00e9ussir vos transformations. Notre approche combine expertise en gestion du changement, design organisationnel et d\u00e9veloppement du leadership avec des outils AI qui acc\u00e9l\u00e8rent les diagnostics et personnalisent les interventions.",
        "Strengthen your organization\u2019s human capabilities to succeed in your transformations. Our approach combines change management expertise, organizational design, and leadership development with AI tools that accelerate diagnostics and personalize interventions."
      ),
      differentiator: t(lang,
        "Nos agents AI analysent les signaux organisationnels (sondages, communications, feedback) pour fournir des diagnostics en temps r\u00e9el et personnaliser les interventions de changement \u2014 chaque employ\u00e9 re\u00e7oit un parcours adapt\u00e9 \u00e0 son profil.",
        "Our AI agents analyze organizational signals (surveys, communications, feedback) to provide real-time diagnostics and personalize change interventions \u2014 each employee receives a journey adapted to their profile."
      ),
      phases: [
        { name: t(lang, "Diagnostic organisationnel", "Organizational Diagnostic"), duration: t(lang, "2 semaines", "2 weeks"), desc: t(lang, "\u00c9valuation de la culture, de la readiness au changement et cartographie des parties prenantes.", "Culture assessment, change readiness evaluation, and stakeholder mapping.") },
        { name: t(lang, "Strat\u00e9gie d\u2019intervention", "Intervention Strategy"), duration: t(lang, "2 semaines", "2 weeks"), desc: t(lang, "Plan de changement, programme de formation, r\u00e9seau d\u2019ambassadeurs et plan de communication.", "Change plan, training program, ambassador network, and communication plan.") },
        { name: t(lang, "Ex\u00e9cution & Mesure", "Execution & Measurement"), duration: t(lang, "Continu", "Ongoing"), desc: t(lang, "D\u00e9ploiement du plan, coaching, formation et mesure d\u2019adoption en temps r\u00e9el.", "Plan deployment, coaching, training, and real-time adoption measurement.") },
      ],
      deliverables: [
        t(lang, "Diagnostic organisationnel", "Organizational diagnostic"),
        t(lang, "Plan de gestion du changement", "Change management plan"),
        t(lang, "Programme de formation", "Training program"),
        t(lang, "Dashboard d\u2019adoption en temps r\u00e9el", "Real-time adoption dashboard"),
        t(lang, "Kit de communication", "Communication kit"),
      ],
      timeline: t(lang, "Continu (min. 8 semaines)", "Ongoing (min. 8 weeks)"),
      idealFor: [t(lang, "VP RH / CHRO", "VP HR / CHRO"), t(lang, "Directeur Transformation", "Director of Transformation"), t(lang, "VP Op\u00e9rations", "VP Operations")],
      subServices: [
        { name: t(lang, "Gestion du changement", "Change Management"), price: t(lang, "15 000$", "$15,000"), credits: 150, desc: t(lang, "Programme complet de gestion du changement : analyse d\u2019impact, plan de communication, formation et mesure d\u2019adoption.", "Complete change management program: impact analysis, communication plan, training, and adoption measurement."), deliverables: [t(lang, "Plan de changement", "Change plan"), t(lang, "Kit de communication", "Communication kit"), t(lang, "Dashboard d\u2019adoption", "Adoption dashboard")], timeline: t(lang, "8-12 semaines", "8-12 weeks") },
        { name: t(lang, "Design organisationnel", "Organizational Design"), price: t(lang, "20 000$", "$20,000"), credits: 200, desc: t(lang, "Conception de la structure organisationnelle cible : r\u00f4les, responsabilit\u00e9s, gouvernance et m\u00e9canismes de coordination.", "Target organizational structure design: roles, responsibilities, governance, and coordination mechanisms."), deliverables: [t(lang, "Organigramme cible", "Target org chart"), t(lang, "Fiches de poste", "Job descriptions"), t(lang, "Plan de transition", "Transition plan")], timeline: t(lang, "6-8 semaines", "6-8 weeks") },
        { name: t(lang, "Programme de leadership", "Leadership Program"), price: t(lang, "10 000$", "$10,000"), credits: 100, desc: t(lang, "Programme de d\u00e9veloppement du leadership adapt\u00e9 \u00e0 votre contexte de transformation, avec coaching individuel et ateliers collectifs.", "Leadership development program adapted to your transformation context, with individual coaching and group workshops."), deliverables: [t(lang, "Programme de d\u00e9veloppement", "Development program"), t(lang, "Sessions de coaching", "Coaching sessions"), t(lang, "\u00c9valuation 360\u00b0", "360\u00b0 assessment")], timeline: t(lang, "Continu", "Ongoing") },
      ],
    },
  };
}
