import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Shield, Loader2, ChevronLeft, ChevronRight,
  RefreshCw, AlertCircle, Activity,
} from "lucide-react";
import { C, HDR_FONT } from "@/lib/constants";
import { useLang, useTheme } from "@/lib/contexts";
import { useClient } from "../contexts/ClientContext";
import { clientI18n } from "../i18n";

interface AuditEntry {
  id: number;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  user_id: string | null;
  ip_address: string | null;
  created_at: string;
  metadata: Record<string, unknown>;
}

// Human-readable labels for audit actions
const ACTION_LABELS: Record<string, { fr: string; en: string }> = {
  "auth.login":          { fr: "Connexion",              en: "Login" },
  "auth.signup":         { fr: "Inscription",            en: "Sign up" },
  "auth.logout":         { fr: "Déconnexion",            en: "Logout" },
  "chat.create":         { fr: "Nouvelle conversation",  en: "New conversation" },
  "chat.message":        { fr: "Message envoyé",         en: "Message sent" },
  "chat.delete":         { fr: "Conversation supprimée", en: "Conversation deleted" },
  "tool.query":          { fr: "Requête assistant",      en: "Assistant query" },
  "tool.chat":           { fr: "Chat assistant IA",      en: "AI assistant chat" },
  "key.create":          { fr: "Clé API créée",          en: "API key created" },
  "key.revoke":          { fr: "Clé API révoquée",       en: "API key revoked" },
  "team.invite":         { fr: "Invitation envoyée",     en: "Invitation sent" },
  "team.accept":         { fr: "Invitation acceptée",    en: "Invitation accepted" },
  "team.remove":         { fr: "Membre retiré",          en: "Member removed" },
  "team.role_change":    { fr: "Rôle modifié",           en: "Role changed" },
  "settings.update":     { fr: "Paramètres modifiés",    en: "Settings updated" },
  "tenant.update":       { fr: "Organisation modifiée",  en: "Organization updated" },
  "billing.upgrade":     { fr: "Plan amélioré",          en: "Plan upgraded" },
  "billing.downgrade":   { fr: "Plan rétrogradé",        en: "Plan downgraded" },
  "billing.checkout_start": { fr: "Paiement initié",     en: "Checkout started" },
};

export function AuditLogPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const { session, quotas, loading: ctxLoading } = useClient();
  const bi = (v: { fr: string; en: string }) => (lang === "fr" ? v.fr : v.en);

  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [offset, setOffset] = useState(0);
  const limit = 20;

  // Only check feature gate once quotas are loaded
  const hasAudit = quotas ? quotas.features?.audit_log !== false : true; // default true for enterprise

  const fetchLogs = useCallback(async () => {
    // Wait for client context to finish loading
    if (ctxLoading) return;
    if (!hasAudit) { setLoading(false); return; }

    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
      if (filter) params.set("action", filter);

      const res = await fetch(`/api/client/audit-log?${params}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setEntries(data.entries ?? []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      console.error("[audit-log] fetch error:", msg);
    } finally {
      setLoading(false);
    }
  }, [ctxLoading, hasAudit, session.access_token, offset, filter]);

  // Re-fetch when dependencies change (including when ctxLoading finishes)
  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const actionIcon = (action: string) => {
    const icons: Record<string, string> = {
      "auth.": "🔐", "chat.": "💬", "tool.": "🤖", "key.": "🔑",
      "team.": "👥", "billing.": "💳", "settings.": "⚙️", "tenant.": "🏢",
    };
    for (const [prefix, emoji] of Object.entries(icons)) {
      if (action.startsWith(prefix)) return emoji;
    }
    return "📋";
  };

  // Plan gate
  if (!ctxLoading && !hasAudit) {
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        <h1 className={`text-2xl font-bold mb-4 ${dark ? "text-white" : ""}`} style={{ ...HDR_FONT, color: dark ? undefined : C.green }}>
          {bi(clientI18n.auditLog)}
        </h1>
        <Card className={`rounded-xl border ${dark ? "bg-gray-900 border-white/5" : "border-gray-100"}`}>
          <CardContent className="p-8 text-center">
            <Shield className={`w-8 h-8 mx-auto mb-3 ${dark ? "text-white/20" : "text-gray-300"}`} />
            <p className={`text-sm ${dark ? "text-white/40" : "text-gray-500"}`}>
              {bi({ fr: "Le journal d'audit est disponible à partir du plan Starter", en: "Audit log is available from the Starter plan" })}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${dark ? "text-white" : ""}`} style={{ ...HDR_FONT, color: dark ? undefined : C.green }}>
            {bi(clientI18n.auditLog)}
          </h1>
          <p className={`text-sm mt-1 ${dark ? "text-white/40" : "text-gray-500"}`}>
            {bi({ fr: "Historique des actions du portail", en: "Portal activity history" })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={filter}
            onChange={(e) => { setFilter(e.target.value); setOffset(0); }}
            placeholder={bi(clientI18n.search)}
            className={`w-48 rounded-lg text-xs ${dark ? "bg-white/5 border-white/10 text-white placeholder:text-white/20" : ""}`}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchLogs}
            disabled={loading}
            className="rounded-full"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""} ${dark ? "text-white/40" : "text-gray-400"}`} />
          </Button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className={`flex items-center gap-2 px-4 py-3 mb-4 rounded-xl border text-sm ${dark ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-red-50 border-red-100 text-red-600"}`}>
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={fetchLogs} className="ml-auto text-xs">
            {bi({ fr: "Réessayer", en: "Retry" })}
          </Button>
        </div>
      )}

      {loading || ctxLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className={`w-5 h-5 animate-spin ${dark ? "text-white/30" : "text-gray-400"}`} />
        </div>
      ) : entries.length === 0 && !error ? (
        <div className={`text-center py-16 rounded-xl border ${dark ? "border-white/5 bg-gray-900" : "border-gray-100 bg-white"}`}>
          <Activity className={`w-8 h-8 mx-auto mb-3 ${dark ? "text-white/20" : "text-gray-300"}`} />
          <p className={`text-sm font-medium mb-1 ${dark ? "text-white/50" : "text-gray-500"}`}>
            {filter
              ? bi({ fr: "Aucun résultat pour ce filtre", en: "No results for this filter" })
              : bi({ fr: "Aucune activité enregistrée", en: "No activity recorded yet" })
            }
          </p>
          {!filter && (
            <p className={`text-xs max-w-md mx-auto ${dark ? "text-white/25" : "text-gray-400"}`}>
              {bi({
                fr: "Les actions du portail (conversations, requêtes IA, gestion des clés API, invitations d'équipe) seront automatiquement tracées ici.",
                en: "Portal actions (conversations, AI queries, API key management, team invitations) will be automatically tracked here.",
              })}
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-2 mb-4">
            {entries.map((e) => {
              const label = ACTION_LABELS[e.action];
              return (
                <div key={e.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${dark ? "bg-gray-900 border border-white/5 hover:border-white/10" : "bg-white border border-gray-100 hover:border-gray-200"}`}>
                  <span className="text-sm shrink-0">{actionIcon(e.action)}</span>
                  <div className="flex-1 min-w-0">
                    <span className={`font-medium ${dark ? "text-white" : "text-gray-900"}`}>
                      {label ? bi(label) : e.action}
                    </span>
                    {e.resource_type && (
                      <Badge variant="outline" className={`ml-2 text-[9px] px-1.5 py-0 h-4 rounded-full ${dark ? "border-white/10 text-white/30" : ""}`}>
                        {e.resource_type}
                      </Badge>
                    )}
                    {e.metadata && typeof (e.metadata as Record<string, string>).toolName === "string" && (
                      <Badge variant="outline" className={`ml-1 text-[9px] px-1.5 py-0 h-4 rounded-full ${dark ? "border-purple-500/20 text-purple-400" : "border-purple-100 text-purple-600"}`}>
                        {(e.metadata as Record<string, string>).toolName}
                      </Badge>
                    )}
                  </div>
                  <span className={`text-[10px] shrink-0 ${dark ? "text-white/20" : "text-gray-400"}`}>
                    {e.ip_address?.slice(0, 15)}
                  </span>
                  <span className={`text-[10px] shrink-0 ${dark ? "text-white/20" : "text-gray-400"}`}>
                    {new Date(e.created_at).toLocaleString(lang === "fr" ? "fr-CA" : "en-CA", { dateStyle: "short", timeStyle: "short" })}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Pagination — only show when needed */}
          {(offset > 0 || entries.length >= limit) && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOffset(Math.max(0, offset - limit))}
                disabled={offset === 0}
                className={`rounded-lg text-xs ${dark ? "border-white/10 text-white/50 disabled:text-white/15 disabled:border-white/5" : "disabled:opacity-40"}`}
              >
                <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                {bi({ fr: "Précédent", en: "Previous" })}
              </Button>
              <span className={`text-xs px-3 ${dark ? "text-white/30" : "text-gray-400"}`}>
                {offset + 1} – {offset + entries.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOffset(offset + limit)}
                disabled={entries.length < limit}
                className={`rounded-lg text-xs ${dark ? "border-white/10 text-white/50 disabled:text-white/15 disabled:border-white/5" : "disabled:opacity-40"}`}
              >
                {bi({ fr: "Suivant", en: "Next" })}
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
