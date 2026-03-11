// ─── CONSULTANT PORTAL i18n ────────────────────────
// All FR/EN strings for the consultant backoffice

export const consultantI18n = {
  // Sidebar
  dashboard: { fr: "Tableau de bord", en: "Dashboard" },
  queue: { fr: "File d'attente", en: "Review Queue" },
  portal: { fr: "Portail consultant", en: "Consultant Portal" },

  // Common
  signOut: { fr: "Déconnexion", en: "Sign out" },
  backToSite: { fr: "Retour au site", en: "Back to site" },
  loading: { fr: "Chargement...", en: "Loading..." },

  // Dashboard
  pendingReviews: { fr: "Reviews en attente", en: "Pending Reviews" },
  myActiveReviews: { fr: "Mes reviews actives", en: "My Active Reviews" },
  completedThisMonth: { fr: "Complétées ce mois", en: "Completed This Month" },
  avgTurnaround: { fr: "Temps moyen (h)", en: "Avg Turnaround (h)" },
  slaCompliance: { fr: "SLA %", en: "SLA %" },
  totalDelivered: { fr: "Total livrés", en: "Total Delivered" },

  // Queue
  client: { fr: "Client", en: "Client" },
  tool: { fr: "Outil", en: "Tool" },
  status: { fr: "Statut", en: "Status" },
  requestDate: { fr: "Date demande", en: "Request Date" },
  consultant: { fr: "Consultant", en: "Consultant" },
  slaRemaining: { fr: "SLA restant", en: "SLA Remaining" },
  all: { fr: "Tous", en: "All" },
  filterByStatus: { fr: "Filtrer par statut", en: "Filter by status" },
  noReviews: { fr: "Aucune review", en: "No reviews" },

  // Status labels
  pending: { fr: "En attente", en: "Pending" },
  in_review: { fr: "En révision", en: "In Review" },
  approved: { fr: "Approuvé", en: "Approved" },
  needs_revision: { fr: "Révision nécessaire", en: "Needs Revision" },
  delivered: { fr: "Livré", en: "Delivered" },

  // Review detail
  assignToMe: { fr: "M'assigner", en: "Assign to Me" },
  internalNotes: { fr: "Notes internes", en: "Internal Notes" },
  clientFeedback: { fr: "Feedback client", en: "Client Feedback" },
  modifiedContent: { fr: "Contenu modifié", en: "Modified Content" },
  approve: { fr: "Approuver", en: "Approve" },
  requestRevision: { fr: "Demander révision", en: "Request Revision" },
  deliver: { fr: "Livrer au client", en: "Deliver to Client" },
  conversationHistory: { fr: "Historique conversation", en: "Conversation History" },
  reviewActions: { fr: "Actions", en: "Actions" },
  saveChanges: { fr: "Sauvegarder", en: "Save Changes" },
  unassigned: { fr: "Non assigné", en: "Unassigned" },

  // Review detail tabs
  originalDeliverable: { fr: "Livrable original", en: "Original Deliverable" },
  modifiedDeliverable: { fr: "Livrable modifié", en: "Modified Deliverable" },
  conversation: { fr: "Conversation", en: "Conversation" },
  noOriginalContent: { fr: "Aucun contenu original enregistré", en: "No original content recorded" },
  previewTab: { fr: "Aperçu", en: "Preview" },
  editTab: { fr: "Éditer", en: "Edit" },
  originalFile: { fr: "Fichier original", en: "Original File" },
  downloadFile: { fr: "Télécharger", en: "Download" },
} as const;

export type ConsultantI18nKey = keyof typeof consultantI18n;
