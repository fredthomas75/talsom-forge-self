import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErrorRetry } from "@/components/ErrorRetry";
import {
  Loader2, Clock, Eye, CheckCircle2, AlertTriangle, Package,
  Search, X, ArrowUpDown,
} from "lucide-react";
import { C, HDR_FONT } from "@/lib/constants";
import { useLang, useTheme } from "@/lib/contexts";
import { useConsultant } from "../contexts/ConsultantContext";
import { consultantI18n } from "../i18n";

interface Review {
  id: string;
  conversation_id: string;
  tenant_id: string;
  tool_name: string;
  status: string;
  consultant_id: string | null;
  requested_at: string;
  tenant_name: string;
  consultant_name: string | null;
}

const STATUS_ICON: Record<string, typeof Clock> = {
  pending: Clock,
  in_review: Eye,
  approved: CheckCircle2,
  needs_revision: AlertTriangle,
  delivered: Package,
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  in_review: "bg-blue-100 text-blue-800 border-blue-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  needs_revision: "bg-orange-100 text-orange-800 border-orange-200",
  delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

const STATUSES = ["", "pending", "in_review", "approved", "needs_revision", "delivered"];

export function QueuePage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const { session } = useConsultant();
  const navigate = useNavigate();
  const bi = (v: { fr: string; en: string }) => (lang === "fr" ? v.fr : v.en);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<"date" | "sla">("date");
  const [sortAsc, setSortAsc] = useState(false);

  const fetchQueue = async () => {
    setFetchError(false);
    try {
      const url = statusFilter
        ? `/api/consultant/queue?status=${statusFilter}`
        : "/api/consultant/queue";
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews ?? []);
      } else {
        setFetchError(true);
      }
    } catch { setFetchError(true); }
    finally { setLoading(false); }
  };

  useEffect(() => { setLoading(true); fetchQueue(); }, [statusFilter]);

  const filteredReviews = useMemo(() => {
    let list = reviews;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.tenant_name.toLowerCase().includes(q) ||
          r.tool_name.toLowerCase().includes(q) ||
          (r.consultant_name ?? "").toLowerCase().includes(q)
      );
    }
    list = [...list].sort((a, b) => {
      if (sortKey === "sla") {
        const slaA = Date.now() - new Date(a.requested_at).getTime();
        const slaB = Date.now() - new Date(b.requested_at).getTime();
        return sortAsc ? slaA - slaB : slaB - slaA;
      }
      const da = new Date(a.requested_at).getTime();
      const db = new Date(b.requested_at).getTime();
      return sortAsc ? da - db : db - da;
    });
    return list;
  }, [reviews, search, sortKey, sortAsc]);

  const toggleSort = (key: "date" | "sla") => {
    if (sortKey === key) { setSortAsc(!sortAsc); }
    else { setSortKey(key); setSortAsc(false); }
  };

  const getSlaRemaining = (requestedAt: string) => {
    const target = 48 * 60 * 60 * 1000; // 48h in ms
    const elapsed = Date.now() - new Date(requestedAt).getTime();
    const remaining = target - elapsed;
    if (remaining <= 0) return { text: bi({ fr: "Dépassé", en: "Overdue" }), overdue: true };
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    return { text: `${hours}h`, overdue: false };
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ ...HDR_FONT, color: C.green }}>
            {bi(consultantI18n.queue)}
          </h1>
          <p className={`text-sm mt-1 ${dark ? "text-white/40" : "text-gray-500"}`}>
            {bi({ fr: `${reviews.length} review(s)`, en: `${reviews.length} review(s)` })}
          </p>
        </div>

        {/* Sort controls */}
        <div className="flex gap-1">
          {(["date", "sla"] as const).map((k) => (
            <Button key={k} variant="ghost" size="sm" onClick={() => toggleSort(k)}
              className={`rounded-full text-xs gap-1 ${sortKey === k ? dark ? "bg-white/10 text-white" : "bg-gray-200 text-gray-900" : dark ? "text-white/40" : "text-gray-500"}`}>
              <ArrowUpDown className="w-3 h-3" />
              {k === "date" ? bi({ fr: "Date", en: "Date" }) : bi({ fr: "SLA", en: "SLA" })}
              {sortKey === k && (sortAsc ? "↑" : "↓")}
            </Button>
          ))}
        </div>
      </div>

      {/* Search + status filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${dark ? "text-white/30" : "text-gray-400"}`} />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={bi({ fr: "Rechercher client, outil...", en: "Search client, tool..." })}
            className={`pl-9 pr-8 rounded-full ${dark ? "bg-white/5 border-white/10 text-white placeholder:text-white/30" : ""}`}
          />
          {search && (
            <button onClick={() => setSearch("")} className={`absolute right-3 top-1/2 -translate-y-1/2 ${dark ? "text-white/30 hover:text-white" : "text-gray-400 hover:text-gray-600"}`}>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex gap-1 flex-wrap">
          {STATUSES.map((s) => (
            <Button
              key={s || "all"} variant="ghost" size="sm"
              onClick={() => setStatusFilter(s)}
              className={`rounded-full text-xs ${statusFilter === s
                ? dark ? "bg-white/10 text-white" : "bg-gray-200 text-gray-900"
                : dark ? "text-white/40" : "text-gray-500"
              }`}
            >
              {s ? bi(consultantI18n[s as keyof typeof consultantI18n] ?? { fr: s, en: s }) : bi(consultantI18n.all)}
            </Button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {fetchError && (
        <div className="mb-6">
          <ErrorRetry
            message={bi({ fr: "Impossible de charger la file d'attente", en: "Failed to load review queue" })}
            onRetry={fetchQueue}
            retryLabel={bi({ fr: "Réessayer", en: "Retry" })}
            dark={dark}
          />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className={`w-5 h-5 animate-spin ${dark ? "text-white/30" : "text-gray-400"}`} />
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className={`text-center py-12 text-sm ${dark ? "text-white/30" : "text-gray-400"}`}>
          {search ? bi({ fr: "Aucun résultat", en: "No results" }) : bi(consultantI18n.noReviews)}
          {search && (
            <div className="mt-2">
              <Button variant="ghost" size="sm" onClick={() => setSearch("")} className="rounded-full text-xs" style={{ color: C.green }}>
                {bi({ fr: "Réinitialiser la recherche", en: "Reset search" })}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredReviews.map((r) => {
            const Icon = STATUS_ICON[r.status] ?? Clock;
            const sla = getSlaRemaining(r.requested_at);
            return (
              <button
                key={r.id}
                onClick={() => navigate(`/consultant/reviews/${r.id}`)}
                className={`w-full text-left rounded-xl border p-4 transition-all hover:shadow-md ${
                  dark ? "bg-white/5 border-white/10 hover:border-white/20" : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: dark ? "rgba(0,53,51,0.3)" : C.greenLight }}>
                    <Icon className="w-5 h-5" style={{ color: C.green }} />
                  </div>

                  <div className="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-5 gap-2">
                    <div>
                      <p className={`text-[10px] ${dark ? "text-white/30" : "text-gray-400"}`}>{bi(consultantI18n.client)}</p>
                      <p className={`text-sm font-medium truncate ${dark ? "text-white" : "text-gray-900"}`}>{r.tenant_name}</p>
                    </div>
                    <div>
                      <p className={`text-[10px] ${dark ? "text-white/30" : "text-gray-400"}`}>{bi(consultantI18n.tool)}</p>
                      <p className={`text-sm truncate ${dark ? "text-white/70" : "text-gray-700"}`}>{r.tool_name}</p>
                    </div>
                    <div>
                      <p className={`text-[10px] ${dark ? "text-white/30" : "text-gray-400"}`}>{bi(consultantI18n.status)}</p>
                      <Badge variant="outline" className={`text-[10px] ${STATUS_COLORS[r.status] ?? ""}`}>
                        {bi(consultantI18n[r.status as keyof typeof consultantI18n] ?? { fr: r.status, en: r.status })}
                      </Badge>
                    </div>
                    <div className="hidden md:block">
                      <p className={`text-[10px] ${dark ? "text-white/30" : "text-gray-400"}`}>{bi(consultantI18n.consultant)}</p>
                      <p className={`text-sm truncate ${dark ? "text-white/50" : "text-gray-500"}`}>
                        {r.consultant_name ?? bi(consultantI18n.unassigned)}
                      </p>
                    </div>
                    <div className="hidden md:block">
                      <p className={`text-[10px] ${dark ? "text-white/30" : "text-gray-400"}`}>{bi(consultantI18n.slaRemaining)}</p>
                      <p className={`text-sm font-medium ${sla.overdue ? "text-red-500" : dark ? "text-white/70" : "text-gray-700"}`}>
                        {sla.text}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
