import type { Lang } from "@/lib/constants";
import { t } from "@/lib/constants";

export function getMarketplace(lang: Lang) {
  return [
    { id: "hub", name: "Talsom Forge Hub", tagline: t(lang, "Plateforme de consulting virtuel", "Virtual consulting platform"), desc: t(lang, "Suite compl\u00e8te de 20+ outils AI : chat multimodal, livrables personnalis\u00e9s en Excel/Word/PPTX \u00e0 vos couleurs, revue consultant et portail client.", "Complete suite of 20+ AI tools: multimodal chat, branded deliverables in Excel/Word/PPTX, consultant review, and client portal."), features: t(lang, "20+ outils AI,Livrables multi-formats,Chat multimodal,Revue consultant", "20+ AI Tools,Multi-format Deliverables,Multimodal Chat,Consultant Review").split(","), tier: "Platform", badgeCls: "bg-[#FDF100]/15 text-[#FDF100] border-[#FDF100]/25" },
    { id: "backlog", name: "AI Backlog Manager", tagline: t(lang, "Gestion de portefeuille de cas d\u2019usage", "Use case portfolio management"), desc: t(lang, "Identifiez, priorisez et suivez vos cas d\u2019usage AI avec un framework de scoring et des vues portefeuille intelligentes.", "Identify, prioritize, and track your AI use cases with a scoring framework and intelligent portfolio views."), features: t(lang, "Scoring multicrit\u00e8re,Vues portefeuille,Suivi ROI,Collaboration", "Multi-criteria Scoring,Portfolio Views,ROI Tracking,Collaboration").split(","), tier: "Tool", badgeCls: "bg-emerald-400/15 text-emerald-300 border-emerald-400/25", price: t(lang, "199$/mois", "$199/month"), forgeDiscount: "-25%" },
    { id: "pia", name: "Privacy Impact Assessor", tagline: t(lang, "EFVP automatis\u00e9e Loi 25", "Automated Bill 25 PIA"), desc: t(lang, "G\u00e9n\u00e9rez des \u00e9valuations des facteurs relatifs \u00e0 la vie priv\u00e9e conformes \u00e0 la Loi 25 pour vos projets AI en quelques minutes.", "Generate privacy impact assessments compliant with Bill 25 for your AI projects in minutes."), features: t(lang, "Conformit\u00e9 Loi 25,Rapport automatis\u00e9,Registre des risques,Suivi", "Bill 25 Compliance,Automated Reports,Risk Registry,Tracking").split(","), tier: "Tool", badgeCls: "bg-amber-400/15 text-amber-300 border-amber-400/25", price: t(lang, "\u00c0 partir de 349$/mois", "Starting at $349/month"), forgeDiscount: "-15%" },
    { id: "governance-tool", name: "AI Governance Suite", tagline: t(lang, "Gouvernance AI cl\u00e9 en main", "Turnkey AI governance"), desc: t(lang, "Cadre de gouvernance complet avec mod\u00e8les de politiques, matrices RACI, registres de mod\u00e8les et tableaux de bord de conformit\u00e9.", "Complete governance framework with policy templates, RACI matrices, model registries, and compliance dashboards."), features: t(lang, "Politiques AI,RACI automatis\u00e9,Registre de mod\u00e8les,Audit trail", "AI Policies,Automated RACI,Model Registry,Audit Trail").split(","), tier: "Suite", badgeCls: "bg-[#D2D9D9]/15 text-[#D2D9D9] border-[#D2D9D9]/25", price: t(lang, "499$/mois", "$499/month"), forgeDiscount: "-20%" },
  ];
}

export function getMarketplaceDetails(lang: Lang): Record<string, { extendedDesc: string; keyBenefits: { title: string; desc: string }[]; integrations: string[]; availability: string }> {
  return {
    hub: {
      extendedDesc: t(lang, "Talsom Forge Hub int\u00e8gre 20+ outils AI sp\u00e9cialis\u00e9s. Chat multimodal (images, PDF, fichiers), g\u00e9n\u00e9ration de livrables en Excel, Word et PowerPoint personnalis\u00e9s \u00e0 vos couleurs et logo, circuit de revue par des consultants seniors, et portail client avec suivi en temps r\u00e9el.", "Talsom Forge Hub integrates 20+ specialized AI tools. Multimodal chat (images, PDF, files), deliverable generation in Excel, Word, and PowerPoint customized with your brand colors and logo, consultant review workflow, and client portal with real-time tracking."),
      keyBenefits: [
        { title: t(lang, "Livrables multi-formats personnalis\u00e9s", "Branded multi-format deliverables"), desc: t(lang, "Documents Excel, Word et PowerPoint g\u00e9n\u00e9r\u00e9s automatiquement \u00e0 vos couleurs et logo.", "Excel, Word, and PowerPoint documents auto-generated with your brand colors and logo.") },
        { title: t(lang, "Chat multimodal avec 20+ outils AI", "Multimodal chat with 20+ AI tools"), desc: t(lang, "Joignez images, PDF et fichiers. Acc\u00e9dez \u00e0 des outils sp\u00e9cialis\u00e9s : RACI, gouvernance, maturit\u00e9, backlog et plus.", "Attach images, PDF, and files. Access specialized tools: RACI, governance, maturity, backlog, and more.") },
        { title: t(lang, "Revue par des consultants seniors", "Senior consultant review"), desc: t(lang, "Demandez une revue d\u2019expert pour bonifier vos livrables. Suivi int\u00e9gr\u00e9 dans votre portail.", "Request expert review to enhance your deliverables. Tracking built into your portal.") },
      ],
      integrations: ["Microsoft 365", "Google Drive", "OneDrive", "SharePoint", "Teams", "Power BI"],
      availability: t(lang, "Beta priv\u00e9e", "Private beta"),
    },
    backlog: {
      extendedDesc: t(lang, "AI Backlog Manager permet de centraliser, scorer et prioriser tous vos cas d\u2019usage AI dans un portefeuille structur\u00e9. Le framework de scoring multicrit\u00e8re \u00e9value chaque initiative selon l\u2019impact business, la faisabilit\u00e9 technique, l\u2019effort et l\u2019alignement strat\u00e9gique.", "AI Backlog Manager allows you to centralize, score, and prioritize all your AI use cases in a structured portfolio. The multi-criteria scoring framework evaluates each initiative based on business impact, technical feasibility, effort, and strategic alignment."),
      keyBenefits: [
        { title: t(lang, "Priorisation objective", "Objective prioritization"), desc: t(lang, "Framework de scoring sur 4 dimensions pour \u00e9liminer les biais de s\u00e9lection.", "4-dimension scoring framework to eliminate selection bias.") },
        { title: t(lang, "Vue portefeuille", "Portfolio view"), desc: t(lang, "Visualisez tous vos cas d\u2019usage sur une matrice impact/effort interactive.", "Visualize all your use cases on an interactive impact/effort matrix.") },
        { title: t(lang, "Suivi du ROI", "ROI tracking"), desc: t(lang, "Mesurez la valeur r\u00e9alis\u00e9e vs projet\u00e9e pour chaque initiative d\u00e9ploy\u00e9e.", "Measure realized vs projected value for each deployed initiative.") },
      ],
      integrations: ["Jira", "Azure DevOps", "Notion", "Excel", "Power BI"],
      availability: t(lang, "Disponible", "Available"),
    },
    pia: {
      extendedDesc: t(lang, "Privacy Impact Assessor automatise la production d\u2019\u00c9valuations des Facteurs relatifs \u00e0 la Vie Priv\u00e9e (EFVP) conformes \u00e0 la Loi 25. R\u00e9pondez \u00e0 un questionnaire guid\u00e9 et obtenez un rapport complet avec analyse de risques, mesures de mitigation et registre de conformit\u00e9.", "Privacy Impact Assessor automates the production of Privacy Impact Assessments (PIA) compliant with Quebec\u2019s Bill 25. Answer a guided questionnaire and get a complete report with risk analysis, mitigation measures, and compliance registry."),
      keyBenefits: [
        { title: t(lang, "Conformit\u00e9 acc\u00e9l\u00e9r\u00e9e", "Accelerated compliance"), desc: t(lang, "De plusieurs semaines \u00e0 quelques heures pour produire une EFVP compl\u00e8te.", "From several weeks to a few hours to produce a complete PIA.") },
        { title: t(lang, "Registre centralis\u00e9", "Centralized registry"), desc: t(lang, "Tous vos projets AI avec leur statut de conformit\u00e9 sur un seul tableau de bord.", "All your AI projects with their compliance status on a single dashboard.") },
        { title: t(lang, "Mises \u00e0 jour r\u00e9glementaires", "Regulatory updates"), desc: t(lang, "Le questionnaire \u00e9volue automatiquement avec les changements r\u00e9glementaires.", "The questionnaire automatically evolves with regulatory changes.") },
      ],
      integrations: ["OneTrust", "Microsoft Purview", "ServiceNow", "Excel"],
      availability: t(lang, "Disponible", "Available"),
    },
    "governance-tool": {
      extendedDesc: t(lang, "AI Governance Suite est une solution compl\u00e8te pour implanter et op\u00e9rer votre cadre de gouvernance AI. Elle inclut des mod\u00e8les de politiques pr\u00e9-r\u00e9dig\u00e9s, des workflows d\u2019approbation automatis\u00e9s, un registre de mod\u00e8les AI et des tableaux de bord de conformit\u00e9 en temps r\u00e9el.", "AI Governance Suite is a complete solution for implementing and operating your AI governance framework. It includes pre-drafted policy templates, automated approval workflows, an AI model registry, and real-time compliance dashboards."),
      keyBenefits: [
        { title: t(lang, "Politiques pr\u00eates \u00e0 l\u2019emploi", "Ready-to-use policies"), desc: t(lang, "Mod\u00e8les de politiques AI adapt\u00e9s aux standards canadiens et europ\u00e9ens.", "AI policy templates adapted to Canadian and European standards.") },
        { title: t(lang, "Workflows automatis\u00e9s", "Automated workflows"), desc: t(lang, "Processus d\u2019approbation, revue \u00e9thique et classification des risques automatis\u00e9s.", "Automated approval processes, ethical review, and risk classification.") },
        { title: t(lang, "Audit trail complet", "Complete audit trail"), desc: t(lang, "Tra\u00e7abilit\u00e9 compl\u00e8te de toutes les d\u00e9cisions et modifications de gouvernance.", "Full traceability of all governance decisions and changes.") },
      ],
      integrations: ["Microsoft 365", "ServiceNow", "Confluence", "Azure ML", "AWS SageMaker"],
      availability: t(lang, "Beta", "Beta"),
    },
  };
}
