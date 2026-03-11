-- Seed content_sections with Talsom Forge AI Consulting knowledge base
-- Source: ai-consulting Cowork plugin (skills + commands, sans données clients)
-- Run in Supabase SQL Editor

-- Clear existing content
DELETE FROM content_sections;

-- 1. About Talsom Forge
INSERT INTO content_sections (section_key, content) VALUES ('about', '{
  "fr": {
    "name": "Talsom Forge",
    "tagline": "Cabinet de conseil en transformation numérique",
    "description": "Talsom Forge est une firme de conseil spécialisée en transformation numérique et stratégie AI, basée à Montréal. Nous accompagnons les organisations dans leur parcours AI avec une approche structurée combinant expertise technologique Microsoft, méthodologies éprouvées de conduite du changement (Prosci ADKAR) et gouvernance responsable de l''AI.",
    "expertise": "Notre plugin AI Consulting encode nos frameworks et méthodologies pour implémenter la stratégie AI, la gouvernance, les modèles opérationnels et le déploiement de la stack Microsoft AI dans les organisations d''envergure.",
    "bilingual": "Tous nos livrables sont disponibles en français (Canada) et en anglais (Canada).",
    "address": "80 rue Queen, suite 502, Montréal QC H3C 2N5",
    "phone": "514.303.0272",
    "website": "talsom.com"
  },
  "en": {
    "name": "Talsom Forge",
    "tagline": "Digital transformation consulting firm",
    "description": "Talsom Forge is a consulting firm specialized in digital transformation and AI strategy, based in Montreal. We guide organizations through their AI journey with a structured approach combining Microsoft technology expertise, proven change management methodologies (Prosci ADKAR), and responsible AI governance.",
    "expertise": "Our AI Consulting plugin encodes proven frameworks and methodologies for implementing AI strategy, governance, operating models, and Microsoft AI stack deployment within enterprise organizations.",
    "bilingual": "All deliverables available in French (Canada) and English (Canada).",
    "address": "80 Queen Street, Suite 502, Montreal QC H3C 2N5",
    "phone": "514.303.0272",
    "website": "talsom.com"
  }
}');

-- 2. Services (4 domaines)
INSERT INTO content_sections (section_key, content) VALUES ('kb_services', '{
  "fr": [
    {
      "id": "ai-strategy",
      "title": "AI Strategy & Governance",
      "description": "Cadre de gouvernance AI complet avec classification des risques en 4 niveaux, politiques d''utilisation responsable, conformité réglementaire (Loi 25 Québec, RGPD, EU AI Act), et gouvernance agentique (framework AAA: Authenticated, Authorized, Accountable). Inclut la structure Three Lines of Defence et le AI Governance Board.",
      "deliverables": ["Évaluation de maturité AI (6 dimensions)", "Cadre de gouvernance AI", "Matrice RACI AI", "Évaluation des facteurs relatifs à la vie privée (EFVP/PIA Loi 25)", "Cadre de gouvernance agentique", "Comité de gouvernance AI récurrent"],
      "frameworks": ["Gartner AI TRiSM", "Forrester AEGIS", "NIST AI RMF", "ISO 42001", "EU AI Act", "Loi 25 Québec", "Singapore Model AI Governance"]
    },
    {
      "id": "business-process-design",
      "title": "Business & Process Design (AI Native)",
      "description": "Transformation de processus standards en processus AI-native reconçus depuis zéro avec l''AI comme composant fondamental. Modèle de maturité à 5 niveaux (Manuel → Assisté → Augmenté → AI-native → Autonome). Scoring d''opportunité AI par étape de processus et mapping vers les outils Microsoft AI.",
      "deliverables": ["Diagnostic processus AI", "Redesign processus AI-native", "Plan d''adoption processus AI (ADKAR)", "Dashboard suivi projets AI"],
      "kpis": "Réduction temps de cycle 40-70%, réduction erreurs 50-80%, réduction coût 30-60%"
    },
    {
      "id": "it-modernization",
      "title": "IT Modernization & Microsoft AI Stack",
      "description": "Déploiement et gouvernance de l''écosystème Microsoft AI complet: Microsoft 365 Copilot (Wave 2, Agent Mode, Copilot Tasks), Microsoft Foundry (anciennement Azure AI Foundry), Power Platform AI (Copilot Studio), Microsoft Fabric AI, Security Copilot. Inclut les patterns multi-agents, MCP, et la roadmap agentique.",
      "deliverables": ["Plan de déploiement Copilot 365 (4 phases)", "Évaluation de maturité data", "Business case AI avec analyse ROI", "Roadmap AI phasée", "Évaluation de fournisseurs AI"],
      "stack": "Copilot 365, Azure OpenAI, Copilot Studio, AI Builder, Agent 365, Microsoft Foundry, Fabric AI, Security Copilot"
    },
    {
      "id": "change-management",
      "title": "Organizational Performance & Change Management",
      "description": "Méthodologie complète de conduite du changement pour les initiatives AI basée sur Prosci ADKAR. 63% des défis d''implémentation AI sont humains, pas techniques. Réseau de changement CLARC (Communicator, Liaison, Advocate, Resistance Manager, Coach). Gestion du portefeuille de changements et principe de saturation.",
      "deliverables": ["Plan de conduite du changement AI", "Plan de formation AI", "Plan de gestion de la résistance", "Roadmap talents AI", "Modèle opérationnel cible AI (Hub & Spoke)"],
      "benchmarks": "Adoption sans change management: 20-30%. Avec change management structuré: 60-70%. Coaching: double le taux de proficiency (38% → 70%+)"
    }
  ],
  "en": [
    {
      "id": "ai-strategy",
      "title": "AI Strategy & Governance",
      "description": "Comprehensive AI governance framework with 4-tier risk classification, responsible use policies, regulatory compliance (Quebec Loi 25, GDPR, EU AI Act), and agentic governance (AAA framework: Authenticated, Authorized, Accountable). Includes Three Lines of Defence structure and AI Governance Board.",
      "deliverables": ["AI Maturity Assessment (6 dimensions)", "AI Governance Framework", "AI RACI Matrix", "Privacy Impact Assessment (PIA/EFVP Loi 25)", "Agentic Governance Framework", "Recurring AI Governance Committee"],
      "frameworks": ["Gartner AI TRiSM", "Forrester AEGIS", "NIST AI RMF", "ISO 42001", "EU AI Act", "Quebec Loi 25", "Singapore Model AI Governance"]
    },
    {
      "id": "business-process-design",
      "title": "Business & Process Design (AI Native)",
      "description": "Transform standard processes into AI-native processes redesigned from scratch with AI as a foundational component. 5-level maturity model (Manual → Assisted → Augmented → AI-native → Autonomous). AI opportunity scoring per process step and mapping to Microsoft AI tools.",
      "deliverables": ["AI Process Diagnostic", "AI-Native Process Redesign", "AI Process Adoption Plan (ADKAR)", "AI Project Tracker Dashboard"],
      "kpis": "Cycle time reduction 40-70%, error reduction 50-80%, cost reduction 30-60%"
    },
    {
      "id": "it-modernization",
      "title": "IT Modernization & Microsoft AI Stack",
      "description": "Deployment and governance of the complete Microsoft AI ecosystem: Microsoft 365 Copilot (Wave 2, Agent Mode, Copilot Tasks), Microsoft Foundry (formerly Azure AI Foundry), Power Platform AI (Copilot Studio), Microsoft Fabric AI, Security Copilot. Includes multi-agent patterns, MCP, and agentic roadmap.",
      "deliverables": ["Copilot 365 Deployment Plan (4 phases)", "Data Maturity Assessment", "AI Business Case with ROI analysis", "Phased AI Roadmap", "AI Vendor Assessment"],
      "stack": "Copilot 365, Azure OpenAI, Copilot Studio, AI Builder, Agent 365, Microsoft Foundry, Fabric AI, Security Copilot"
    },
    {
      "id": "change-management",
      "title": "Organizational Performance & Change Management",
      "description": "Comprehensive change management methodology for AI initiatives based on Prosci ADKAR. 63% of AI implementation challenges are human, not technical. CLARC change network (Communicator, Liaison, Advocate, Resistance Manager, Coach). Change portfolio management and saturation principle.",
      "deliverables": ["AI Change Management Plan", "AI Training Plan", "Resistance Management Plan", "AI Talent Roadmap", "AI Target Operating Model (Hub & Spoke)"],
      "benchmarks": "Adoption without change management: 20-30%. With structured change management: 60-70%. Coaching: doubles proficiency rate (38% → 70%+)"
    }
  ]
}');

-- 3. Engagement Sequences (Methodology)
INSERT INTO content_sections (section_key, content) VALUES ('methodology', '{
  "fr": {
    "title": "Méthodologie de mandat",
    "description": "Nos mandats suivent des séquences éprouvées adaptées aux objectifs du client.",
    "sequences": [
      {
        "name": "Mandat complet (12-18 semaines)",
        "phases": ["Diagnostic initial (maturité AI + data)", "Design (gouvernance, modèle opérationnel, backlog AI)", "Planification (roadmap, business case, RACI, talents)", "Déploiement (Copilot, change management, formation)"]
      },
      {
        "name": "Déploiement Copilot rapide (4-6 semaines)",
        "phases": ["Diagnostic maturité AI", "EFVP (évaluation vie privée)", "Plan de déploiement Copilot", "Plan de changement + formation"]
      },
      {
        "name": "Gouvernance d''abord (6-8 semaines)",
        "phases": ["Diagnostic maturité AI", "Cadre de gouvernance AI", "RACI + EFVP", "Backlog AI + roadmap"]
      },
      {
        "name": "Stratégie & Business Case (4-6 semaines)",
        "phases": ["Diagnostic maturité AI", "Backlog AI", "Business case + analyse ROI", "Roadmap + modèle opérationnel"]
      },
      {
        "name": "Transformation processus AI-native (4-8 semaines)",
        "phases": ["Diagnostic processus AI", "Redesign processus AI-native", "Plan d''adoption", "Formation + analyse d''impact"]
      },
      {
        "name": "Récupération d''adoption (2-4 semaines)",
        "phases": ["Plan de gestion de la résistance", "Formation ciblée", "Plan de changement systémique"]
      }
    ],
    "approach": "Chaque livrable charge automatiquement le contexte client et ne demande que les informations manquantes. Tous les livrables sont bilingues (FR/EN)."
  },
  "en": {
    "title": "Engagement Methodology",
    "description": "Our engagements follow proven sequences adapted to client objectives.",
    "sequences": [
      {
        "name": "Full Engagement (12-18 weeks)",
        "phases": ["Initial Diagnostic (AI + data maturity)", "Design (governance, operating model, AI backlog)", "Planning (roadmap, business case, RACI, talent)", "Deployment (Copilot, change management, training)"]
      },
      {
        "name": "Quick Copilot Deployment (4-6 weeks)",
        "phases": ["AI Maturity Assessment", "PIA (Privacy Impact Assessment)", "Copilot Deployment Plan", "Change Management Plan + Training"]
      },
      {
        "name": "Governance-First (6-8 weeks)",
        "phases": ["AI Maturity Assessment", "AI Governance Framework", "RACI + PIA", "AI Backlog + Roadmap"]
      },
      {
        "name": "Strategy & Business Case (4-6 weeks)",
        "phases": ["AI Maturity Assessment", "AI Backlog", "Business Case + ROI analysis", "Roadmap + Operating Model"]
      },
      {
        "name": "AI-Native Process Transformation (4-8 weeks)",
        "phases": ["AI Process Diagnostic", "AI-Native Process Redesign", "Adoption Plan", "Training + Impact Analysis"]
      },
      {
        "name": "Adoption Recovery (2-4 weeks)",
        "phases": ["Resistance Management Plan", "Targeted Training", "Systemic Change Management Plan"]
      }
    ],
    "approach": "Each deliverable automatically loads client context and only asks for missing information. All deliverables are bilingual (FR/EN)."
  }
}');

-- 4. Available Commands/Deliverables
INSERT INTO content_sections (section_key, content) VALUES ('commands', '{
  "fr": {
    "title": "Livrables disponibles",
    "categories": [
      {
        "phase": "Phase 1 — Diagnostic",
        "commands": [
          {"name": "Évaluation de maturité AI", "description": "Évaluation sur 6 dimensions avec scores et recommandations"},
          {"name": "Évaluation de maturité data", "description": "Score sur 7 dimensions (qualité, accessibilité, gouvernance, sécurité, architecture, culture, opérations)"}
        ]
      },
      {
        "phase": "Phase 2 — Design",
        "commands": [
          {"name": "Cadre de gouvernance AI", "description": "Framework complet avec politiques, classification des risques et processus"},
          {"name": "Modèle opérationnel cible AI", "description": "Design Hub & Spoke avec rôles, processus et plan de transition"},
          {"name": "Backlog AI", "description": "Carnet de cas d''usage AI priorisé avec scoring et séquencement"},
          {"name": "Roadmap AI", "description": "Feuille de route AI phasée avec workstreams et jalons"},
          {"name": "Business case AI", "description": "Analyse de rentabilité avec ROI, analyse de sensibilité et risques"},
          {"name": "RACI AI", "description": "Matrice RACI couvrant stratégie, développement, opérations et enablement"},
          {"name": "EFVP (évaluation vie privée)", "description": "Rapport EFVP conforme Loi 25 / CAI pour projets AI"},
          {"name": "Évaluation de fournisseurs AI", "description": "Grille d''évaluation comparative de solutions AI"}
        ]
      },
      {
        "phase": "Phase 3 — Planification",
        "commands": [
          {"name": "Roadmap talents AI", "description": "Dimensionnement de l''équipe cible avec parcours de développement"},
          {"name": "Plan de conduite du changement", "description": "Plan structuré basé sur ADKAR pour déploiement AI"},
          {"name": "Plan de formation AI", "description": "Parcours de formation et upskilling AI par rôle"}
        ]
      },
      {
        "phase": "Phase 4 — Déploiement",
        "commands": [
          {"name": "Plan de déploiement Copilot 365", "description": "Plan 4 phases (readiness, pilote, rollout, optimisation)"},
          {"name": "Analyse d''impact AI", "description": "Impact organisationnel (processus, rôles, culture, KPIs)"},
          {"name": "Plan de gestion de la résistance", "description": "Diagnostic et plan tactique de gestion de la résistance"}
        ]
      },
      {
        "phase": "Transformation processus AI-native",
        "commands": [
          {"name": "Diagnostic processus AI", "description": "Scoring d''opportunité AI, maturité AI-native, mapping outils Microsoft"},
          {"name": "Redesign processus AI-native", "description": "Cartographie To-Be, architecture Copilot/Power Platform, plan de mise en œuvre"},
          {"name": "Plan d''adoption processus AI", "description": "Plan ADKAR pour la transition vers le processus AI-native"}
        ]
      },
      {
        "phase": "Récurrent",
        "commands": [
          {"name": "Dashboard projets AI", "description": "Suivi interactif Kanban/Gantt avec KPIs et graphiques"},
          {"name": "Dashboard portefeuille AI", "description": "Vue stratégique du portefeuille AI"},
          {"name": "Comité de gouvernance AI", "description": "Support récurrent pour comités de gouvernance"}
        ]
      }
    ]
  }
}');

-- 5. Key Frameworks & Benchmarks
INSERT INTO content_sections (section_key, content) VALUES ('benchmarks', '{
  "title": "Benchmarks et métriques clés (2025-2026)",
  "adoption": {
    "sans_change_management": "20-30% adoption à 3 mois",
    "avec_change_management": "60-70% adoption à 3 mois",
    "coaching_impact": "Double le taux de proficiency (38% → 70%+)",
    "sponsorship_impact": "+72% adoption quand résistance activement gérée",
    "sponsorship_failure": "43% des échecs d''adoption liés au manque de sponsorship"
  },
  "resistance": {
    "human_factors": "63% des défis AI sont humains (pas techniques)",
    "job_fear": "29% de la résistance liée à la peur de perdre son emploi",
    "technical": "Seulement 16% des défis sont purement techniques",
    "mid_managers": "Démographique la plus résistante — peur de perdre le contrôle"
  },
  "roi": {
    "copilot_365_roi": "116% à 457% ROI ajusté au risque (Forrester TEI)",
    "ai_spending_2026": "2 500 milliards $ mondiaux en 2026 (+44% YoY) — Gartner",
    "breakeven_or_loss": "72% des CIOs rapportent atteindre le seuil de rentabilité ou perdre de l''argent — Gartner",
    "high_performers": "Seulement 6% des organisations qualifiées de high performers en AI — McKinsey",
    "agentic_cancellation": "40% des projets AI agentiques annulés d''ici 2027 — Gartner",
    "workflow_redesign": "Le redesign des workflows a le plus grand impact sur l''EBIT — McKinsey"
  },
  "process_transformation": {
    "cycle_time_reduction": "40-70%",
    "error_reduction": "50-80%",
    "cost_reduction": "30-60%",
    "adoption_target": "> 70% à maturité"
  },
  "industry_roi": {
    "services_financiers": "Détection fraude: 9,6 Mds£ économies/an; réduction coûts: jusqu''à 20%",
    "manufacturier": "Maintenance prédictive: 300% ROI, payback 3-6 mois; qualité: 50% réduction défauts",
    "sante": "3,20$ pour 1$ investi en 14 mois; documentation clinique ambiante: 600M$ de valeur",
    "retail": "Personnalisation: 400% ROI moyen; efficience opérationnelle: 20-35% réduction coûts"
  }
}');

-- 6. Regulatory Compliance
INSERT INTO content_sections (section_key, content) VALUES ('compliance', '{
  "fr": {
    "title": "Conformité réglementaire AI",
    "loi_25": {
      "name": "Loi 25 (Québec) — Loi sur la protection des renseignements personnels",
      "status": "En vigueur — La plus stricte au Canada",
      "key_requirements": [
        "EFVP obligatoire pour tout projet traitant des renseignements personnels",
        "Consentement opt-in explicite requis pour technologies de suivi",
        "Information obligatoire avant collecte/utilisation de données personnelles",
        "Obligation d''informer pour décisions automatisées à impact significatif",
        "Droit de contestation des résultats algorithmiques",
        "Exigences spéciales pour transferts transfrontaliers (divulgation si infrastructure US)"
      ],
      "penalties": "Jusqu''à 10M$ CA ou 2% CA mondial (administratif); 25M$ CA ou 4% (pénal)",
      "ai_implications": "Copilot, RAG, agents AI — tous nécessitent une EFVP si des RP sont traitées"
    },
    "eu_ai_act": {
      "name": "EU AI Act",
      "tiers": ["Risque minimal (codes de conduite)", "Risque limité (transparence: chatbots, deepfakes)", "Risque élevé (emploi, crédit, éducation — conformité obligatoire)", "Risque inacceptable (interdit: scoring social, surveillance biométrique)"]
    },
    "canada_federal": {
      "status": "AUCUNE LOI FÉDÉRALE AI EN VIGUEUR (mars 2026)",
      "note": "Le projet C-27 (AIDA) a été terminé lors de la prorogation. Le Canada opère sous PIPEDA (2000). Recommander aux clients d''adopter proactivement les standards EU AI Act."
    }
  }
}');

-- 7. ADKAR Change Framework
INSERT INTO content_sections (section_key, content) VALUES ('changeFramework', '{
  "fr": {
    "title": "Framework de conduite du changement (Prosci ADKAR)",
    "model": [
      {"phase": "Awareness", "question": "Pourquoi l''AI, pourquoi maintenant, pourquoi moi?", "target": ">80% comprennent la raison", "barriers": "Peur de l''inconnu, préoccupations existentielles"},
      {"phase": "Desire", "question": "Je veux en faire partie", "target": ">70% engagés, <15% résistance active", "barriers": "Peur de perdre son emploi (29%), perte du contact humain"},
      {"phase": "Knowledge", "question": "Je sais comment utiliser l''AI", "target": ">75% réussissent l''évaluation de proficiency", "barriers": "38% d''échec sans formation suffisante, courbe d''apprentissage"},
      {"phase": "Ability", "question": "Je peux le faire au quotidien", "target": ">65% utilisation quotidienne au mois 3", "barriers": "Écart entre formation et application réelle"},
      {"phase": "Reinforcement", "question": "Je continue et m''améliore", "target": "Adoption stable au mois 6+", "barriers": "Demi-vie des compétences: 3-4 mois sans refresh"}
    ],
    "clarc_network": {
      "communicator": "Messages d''impact personnels, adresser peurs emploi (1 par initiative)",
      "liaison": "Pont exécutifs ↔ terrain, feedback réel (1 pour 50-100 utilisateurs)",
      "advocate": "Modèle d''enthousiasme, démonstration publique (1 pour 30-50 utilisateurs)",
      "resistance_manager": "Diagnostic et plan par niveau, mid-managers prioritaires (1 pour 100-150)",
      "coach": "Formation, prompt engineering, support continu (1 pour 25-30 utilisateurs)"
    }
  }
}');

-- 8. AI Operating Model (Hub & Spoke)
INSERT INTO content_sections (section_key, content) VALUES ('operatingModel', '{
  "fr": {
    "title": "Modèle opérationnel cible AI (Hub & Spoke)",
    "hub": {
      "role": "Centre d''Excellence AI (CoE)",
      "responsibilities": ["Stratégie & Standards", "Plateforme & Infrastructure", "Talents & Compétences", "Gouvernance & Éthique", "Enablement & Formation"],
      "agentic_roles": ["AI Agent Platform Manager", "Agent Security Officer", "Agent Quality Engineer"]
    },
    "spokes": {
      "role": "Équipes AI des unités d''affaires",
      "responsibilities": ["Identification de cas d''usage", "Livraison de solutions", "Expertise domaine", "Adoption & Changement", "Boucle de feedback"],
      "agentic_roles": ["Agent Owner", "Agent Trainer", "Agent Supervisor"]
    },
    "maturity_levels": [
      "Ad Hoc — Expériences isolées, pas de coordination",
      "Émergent — Première équipe centrale, standards initiaux",
      "Défini — Hub établi, gouvernance en place, processus reproductibles",
      "Géré — Modèle fédéré opérationnel, piloté par les métriques",
      "Optimisé — AI intégrée dans les opérations, amélioration continue"
    ],
    "frontier_firm": "Vision Microsoft 2025: organisations human-led, agent-operated. Humains définissent la stratégie. Agents exécutent et recommandent."
  }
}');

-- 9. Microsoft AI Stack Overview
INSERT INTO content_sections (section_key, content) VALUES ('microsoftStack', '{
  "title": "Stack Microsoft AI (mars 2026)",
  "tiers": [
    {
      "tier": "Tier 1: Microsoft 365 Copilot",
      "description": "AI de productivité intégrée dans Word, Excel, PowerPoint, Outlook, Teams",
      "highlights": ["Agent Mode dans Word/Excel/PowerPoint (GA 2026)", "Copilot Tasks — AI qui exécute en arrière-plan", "Copilot Chat gratuit pour tous les utilisateurs M365", "Word/Excel/PowerPoint Agents alimentés par Claude (Anthropic)"]
    },
    {
      "tier": "Tier 1.5: Copilot Wave 2 — Agents métier",
      "description": "Agents spécialisés par rôle",
      "highlights": ["Sales Agent, Service Agent, Finance Agent", "Workflows multi-agents dans M365 Copilot", "Microsoft 365 Copilot Tuning"]
    },
    {
      "tier": "Tier 2: Microsoft Foundry (ex-Azure AI Foundry)",
      "description": "Plateforme cloud pour solutions AI custom",
      "highlights": ["Multi-Agent Orchestration SDK (C#/Python)", "Foundry IQ — bases de connaissances intégrées", "1 400+ outils avec support MCP et A2A", "Agent Memory Service (Preview)", "Foundry Local pour environnements souverains"]
    },
    {
      "tier": "Tier 3: Power Platform AI",
      "description": "AI citizen developer low-code/no-code",
      "highlights": ["Copilot Studio — agents conversationnels", "AI Builder — modèles pré-construits", "Computer Use (Preview) — agents interagissant avec GUIs"]
    },
    {
      "tier": "Tier 4: Microsoft Fabric AI",
      "description": "Intelligence de données",
      "highlights": ["Fabric IQ — plateforme d''intelligence unifiée", "Data Agents — analystes virtuels", "AI Functions GA (sentiment, embeddings)"]
    },
    {
      "tier": "Tier 5: Security Copilot",
      "description": "Sécurité AI incluse dans M365 E5",
      "highlights": ["77+ agents de sécurité", "400 SCUs/mois par 1000 licences", "Phishing Triage Agent: détection 550% plus rapide"]
    }
  ],
  "copilot_deployment": {
    "phases": ["Phase 1: Readiness Assessment (4-6 sem)", "Phase 2: Pilot (4-8 sem, 50-300 users)", "Phase 3: Broad Rollout (8-16 sem, par vagues)", "Phase 4: Optimisation (continu)"],
    "success_criteria": "Adoption >70% actifs hebdomadaires, satisfaction >3.5/5, 3+ cas d''usage par département"
  }
}');

-- 10. Data Readiness
INSERT INTO content_sections (section_key, content) VALUES ('dataReadiness', '{
  "fr": {
    "title": "Maturité Data pour l''AI",
    "insight": "Data est le bloqueur #1 des déploiements AI. 65% des projets AI échouent à cause de problèmes de données.",
    "dimensions": [
      {"name": "Qualité des données", "weight": "20%", "description": "Exactitude, complétude, cohérence, fraîcheur"},
      {"name": "Accessibilité", "weight": "15%", "description": "Disponibilité, APIs, self-service, latence"},
      {"name": "Gouvernance des données", "weight": "20%", "description": "Politiques, ownership, stewardship, metadata"},
      {"name": "Sécurité & Vie privée", "weight": "15%", "description": "Classification, chiffrement, contrôles d''accès, Loi 25"},
      {"name": "Architecture", "weight": "15%", "description": "Intégration, cloud, temps réel, data lake/mesh"},
      {"name": "Culture & Littératie data", "weight": "10%", "description": "Décisions basées sur les données, formation, champions"},
      {"name": "Opérations data", "weight": "5%", "description": "ETL/ELT, monitoring, SLAs, incidents"}
    ],
    "levels": ["Ad Hoc", "Repeatable", "Defined", "Managed", "Optimised"],
    "ai_readiness_mapping": {
      "copilot_365": "Niveau 2 minimum",
      "power_platform": "Niveau 2-3",
      "custom_ml": "Niveau 3-4",
      "rag_knowledge_bases": "Niveau 3",
      "autonomous_agents": "Niveau 4-5"
    }
  }
}');

-- 11. Process AI-Native Transformation
INSERT INTO content_sections (section_key, content) VALUES ('processAiNative', '{
  "fr": {
    "title": "Transformation de processus AI-native",
    "philosophy": "Un processus AI-native n''est PAS un processus existant avec une couche AI. C''est un processus RECONÇU DEPUIS ZÉRO avec l''AI comme composant fondamental.",
    "principles": [
      "L''humain orchestre, valide et décide — l''AI prépare, analyse et exécute",
      "Les données circulent de manière fluide entre les outils AI",
      "Les tâches répétitives et à faible valeur sont déléguées à l''AI",
      "La boucle de feedback est continue : l''AI apprend des validations humaines"
    ],
    "maturity_levels": [
      {"level": 0, "name": "Manuel", "description": "Processus entièrement humain, pas d''automatisation"},
      {"level": 1, "name": "Assisté", "description": "Copilot utilisé ponctuellement, processus inchangé"},
      {"level": 2, "name": "Augmenté", "description": "AI intégrée aux étapes clés, recommandations aux points de décision"},
      {"level": 3, "name": "AI-native", "description": "Flux orchestré par l''AI, humain en validation/décision"},
      {"level": 4, "name": "Autonome", "description": "Agents autonomes, boucles de feedback automatiques, humain par exception"}
    ],
    "tool_mapping": {
      "redaction": "Copilot in Word/Outlook",
      "analyse_donnees": "Copilot in Excel/Power BI",
      "reunion": "Copilot in Teams",
      "presentation": "Copilot in PowerPoint",
      "recherche": "M365 Copilot Chat",
      "traitement_documents": "Azure AI Document Intelligence",
      "workflow": "Power Automate + AI Builder",
      "service_client": "Copilot Studio",
      "anomalies": "Azure AI + Power BI"
    }
  }
}');

-- 12. AI Backlog Management
INSERT INTO content_sections (section_key, content) VALUES ('aiBacklog', '{
  "fr": {
    "title": "Gestion du backlog AI",
    "scoring_model": [
      {"dimension": "Valeur business", "weight": "30%", "description": "Revenus, économies, réduction de risque, expérience client"},
      {"dimension": "Alignement stratégique", "weight": "20%", "description": "Alignement avec la stratégie et vision AI"},
      {"dimension": "Faisabilité", "weight": "20%", "description": "Maturité data, complexité technique, compétences"},
      {"dimension": "Délai de retour", "weight": "15%", "description": "Rapidité des résultats mesurables"},
      {"dimension": "Scalabilité", "weight": "15%", "description": "Potentiel d''expansion organisation-wide"},
      {"dimension": "Readiness au changement", "weight": "10-15%", "description": "Readiness organisationnelle, risque d''adoption"}
    ],
    "prioritization_matrix": {
      "quick_wins": "Haute valeur + Haute faisabilité → Faire en premier",
      "strategic_bets": "Haute valeur + Faible faisabilité → Planifier soigneusement",
      "low_hanging": "Faible valeur + Haute faisabilité → Si capacité disponible",
      "deprioritize": "Faible valeur + Faible faisabilité → Reporter"
    },
    "portfolio_mix": "40-50% quick wins, 30-40% différenciants, 10-20% transformation",
    "saturation_principle": "Limiter le changement à 30-40% de l''organisation simultanément, sinon adoption chute de 40-60%"
  }
}');

-- 13. Privacy Impact Assessment (EFVP)
INSERT INTO content_sections (section_key, content) VALUES ('efvp', '{
  "fr": {
    "title": "Évaluation des Facteurs relatifs à la Vie Privée (EFVP)",
    "legal_basis": "Obligatoire sous la Loi 25 du Québec pour tout projet traitant des renseignements personnels",
    "template": "Basé sur le modèle officiel de la Commission d''accès à l''information (CAI) v1.0",
    "sections": [
      "Résumé exécutif",
      "Description du projet AI",
      "Rôles et responsabilités",
      "Inventaire des renseignements personnels (cartographie des flux)",
      "Conformité (articles Loi 25 applicables)",
      "Risques et atténuation (scoring P × Gravité)",
      "Plan d''action avec responsables et échéances",
      "Approbation"
    ],
    "risk_scoring": {
      "method": "Probabilité × Gravité (1 à 5 chacun)",
      "levels": ["1-5: Faible (surveiller)", "6-10: Modéré (atténuer dans un délai raisonnable)", "11-15: Élevé (atténuer avant production)", "16-25: Critique (atténuer immédiatement ou abandonner)"]
    },
    "ai_risk_categories": [
      "Risques à la collecte (collecte excessive, consentement)",
      "Risques à l''utilisation (biais, profilage, décisions automatisées)",
      "Risques à la communication (sous-traitants cloud, transferts transfrontaliers)",
      "Risques à la conservation (rétention dans les logs/modèles)",
      "Risques spécifiques AI (shadow AI, prompt injection, model memorisation)"
    ],
    "output": "Rapport .docx formel + version .md — Classification: Confidentiel"
  }
}');

-- 14. FAQ
INSERT INTO content_sections (section_key, content) VALUES ('kb_faq', '{
  "fr": [
    {"q": "Qu''est-ce que Talsom Forge?", "a": "Talsom Forge est la division de conseil en transformation numérique et stratégie AI de Talsom, basée à Montréal. Nous accompagnons les organisations dans leur parcours AI avec des méthodologies éprouvées et une expertise Microsoft AI."},
    {"q": "Quels types de mandats offrez-vous?", "a": "Nous offrons des mandats de 2 à 18 semaines couvrant: diagnostic de maturité AI/data, gouvernance AI, déploiement Copilot 365, transformation de processus AI-native, conduite du changement, et modèles opérationnels cibles."},
    {"q": "Travaillez-vous avec quel stack technologique?", "a": "Nous sommes spécialisés dans l''écosystème Microsoft AI: Microsoft 365 Copilot, Microsoft Foundry (Azure AI), Power Platform (Copilot Studio, AI Builder), Microsoft Fabric, et Security Copilot. Nous couvrons aussi Azure OpenAI et les architectures RAG."},
    {"q": "Comment gérez-vous la conformité Loi 25?", "a": "Nous produisons des EFVP (Évaluation des Facteurs relatifs à la Vie Privée) conformes au modèle officiel de la CAI du Québec pour chaque projet AI traitant des renseignements personnels. La Loi 25 est la réglementation la plus stricte au Canada."},
    {"q": "Quelle est votre approche de conduite du changement?", "a": "Notre méthodologie est basée sur Prosci ADKAR avec le réseau CLARC (Communicator, Liaison, Advocate, Resistance Manager, Coach). 63% des défis AI sont humains — avec notre approche structurée, l''adoption passe de 20-30% à 60-70%."},
    {"q": "Qu''est-ce qu''un processus AI-native?", "a": "Un processus reconçu depuis zéro avec l''AI comme composant fondamental, pas un processus existant avec une couche AI ajoutée. L''humain orchestre et valide, l''AI prépare et exécute. Gains typiques: 40-70% réduction temps de cycle."},
    {"q": "Proposez-vous des mandats bilingues?", "a": "Oui, tous nos livrables sont disponibles en français (Canada) et en anglais (Canada). Claude adapte automatiquement la langue selon les préférences du client."},
    {"q": "Comment puis-je commencer?", "a": "Contactez-nous pour un diagnostic initial gratuit de 30 minutes. Nous évaluerons votre maturité AI et data, puis proposerons une séquence de mandats adaptée à vos objectifs."}
  ],
  "en": [
    {"q": "What is Talsom Forge?", "a": "Talsom Forge is Talsom''s digital transformation and AI strategy consulting division, based in Montreal. We guide organizations through their AI journey with proven methodologies and Microsoft AI expertise."},
    {"q": "What types of engagements do you offer?", "a": "We offer 2 to 18 week engagements covering: AI/data maturity diagnostic, AI governance, Copilot 365 deployment, AI-native process transformation, change management, and target operating models."},
    {"q": "What technology stack do you work with?", "a": "We specialize in the Microsoft AI ecosystem: Microsoft 365 Copilot, Microsoft Foundry (Azure AI), Power Platform (Copilot Studio, AI Builder), Microsoft Fabric, and Security Copilot. We also cover Azure OpenAI and RAG architectures."},
    {"q": "How do you handle Quebec Loi 25 compliance?", "a": "We produce PIAs (Privacy Impact Assessments / EFVP) compliant with the Quebec CAI official template for every AI project processing personal information. Loi 25 is the strictest regulation in Canada."},
    {"q": "What is your change management approach?", "a": "Our methodology is based on Prosci ADKAR with the CLARC network (Communicator, Liaison, Advocate, Resistance Manager, Coach). 63% of AI challenges are human — with our structured approach, adoption goes from 20-30% to 60-70%."},
    {"q": "What is an AI-native process?", "a": "A process redesigned from scratch with AI as a foundational component, not an existing process with an AI layer added. Humans orchestrate and validate, AI prepares and executes. Typical gains: 40-70% cycle time reduction."},
    {"q": "How can I get started?", "a": "Contact us for a free 30-minute initial diagnostic. We''ll assess your AI and data maturity, then propose an engagement sequence tailored to your objectives."}
  ]
}');

-- 15. Pricing/Engagement Model
INSERT INTO content_sections (section_key, content) VALUES ('kb_pricing', '{
  "fr": {
    "title": "Modèle d''engagement",
    "types": [
      {"name": "Diagnostic rapide", "duration": "1-2 semaines", "description": "Évaluation de maturité AI ou data, diagnostic processus AI, recommandations prioritaires"},
      {"name": "Mandat tactique", "duration": "2-6 semaines", "description": "Déploiement Copilot rapide, business case AI, gouvernance quick-start, récupération d''adoption"},
      {"name": "Mandat stratégique", "duration": "6-12 semaines", "description": "Gouvernance AI complète, modèle opérationnel cible, transformation processus AI-native"},
      {"name": "Transformation complète", "duration": "12-18 semaines", "description": "Parcours complet: diagnostic → design → planification → déploiement"}
    ],
    "note": "Contactez-nous pour un devis personnalisé adapté à la taille et aux besoins de votre organisation."
  },
  "en": {
    "title": "Engagement Model",
    "types": [
      {"name": "Quick Diagnostic", "duration": "1-2 weeks", "description": "AI or data maturity assessment, AI process diagnostic, priority recommendations"},
      {"name": "Tactical Engagement", "duration": "2-6 weeks", "description": "Quick Copilot deployment, AI business case, governance quick-start, adoption recovery"},
      {"name": "Strategic Engagement", "duration": "6-12 weeks", "description": "Full AI governance, target operating model, AI-native process transformation"},
      {"name": "Full Transformation", "duration": "12-18 weeks", "description": "Complete journey: diagnostic → design → planning → deployment"}
    ],
    "note": "Contact us for a customized quote adapted to your organization''s size and needs."
  }
}');

-- 16. Agentic AI (NEW 2025-2026)
INSERT INTO content_sections (section_key, content) VALUES ('agenticAI', '{
  "fr": {
    "title": "AI Agentique — Cadre 2025-2026",
    "market_context": {
      "adoption": "40% des apps enterprise intégreront des agents AI d''ici fin 2026 (Gartner)",
      "cancellation": "40% des projets agentiques annulés d''ici 2027 (coûts, contrôles insuffisants)",
      "production": "Seulement 14% des orgs ont des solutions agentiques prêtes, 11% en production",
      "spending": "15 000 milliards $ de dépenses B2B passeront par des échanges d''agents d''ici 2028"
    },
    "governance_framework": {
      "principles": "AAA: Authenticated (identité vérifiée), Authorized (moindre privilège), Accountable (pistes d''audit)",
      "controls": ["Inventaire centralisé de tous les agents (prévenir shadow agents)", "Classification par niveau d''autonomie (assisté → augmenté → autonome)", "Kill switches et circuits de désactivation d''urgence", "Revues d''accès régulières", "Audit logging de chaque action agent"],
      "risks": [
        {"risk": "Exposition données sensibles", "concern": "55%"},
        {"risk": "Actions non autorisées", "concern": "52%"},
        {"risk": "Mésusage de credentials", "concern": "45%"},
        {"risk": "Shadow agents non répertoriés", "concern": "40%"}
      ]
    },
    "microsoft_agent_365": {
      "description": "Plan de contrôle enterprise pour tous les agents",
      "capabilities": ["Registre centralisé avec télémétrie et dashboards", "Microsoft Entra Agent ID pour supervision IT", "Interopérabilité: Copilot Studio, Foundry, frameworks open-source", "Contrôles HITL (Human-in-the-Loop)"]
    }
  }
}');
