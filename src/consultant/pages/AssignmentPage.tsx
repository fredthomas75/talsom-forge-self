import { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Search, X, UserPlus, ArrowRight, ChevronDown,
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
  consultant_name: string | null;
  requested_at: string;
  tenant_name: string;
}

interface ConsultantOption {
  consultantId: string;
  name: string;
  specialties: string[];
  activeCount: number;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  in_review: "bg-blue-100 text-blue-800 border-blue-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  needs_revision: "bg-orange-100 text-orange-800 border-orange-200",
  delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

export function AssignmentPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const { session } = useConsultant();
  const bi = (v: { fr: string; en: string }) => (lang === "fr" ? v.fr : v.en);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [consultants, setConsultants] = useState<ConsultantOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  // Fetch unassigned/all reviews and consultant list
  useEffect(() => {
    (async () => {
      try {
        const [reviewsRes, consultantsRes] = await Promise.all([
          fetch("/api/consultant/queue", { headers: { Authorization: `Bearer ${session.access_token}` } }),
          fetch("/api/consultant/team", { headers: { Authorization: `Bearer ${session.access_token}` } }),
        ]);
        if (reviewsRes.ok) {
          const data = await reviewsRes.json();
          setReviews(data.reviews ?? []);
        }
        if (consultantsRes.ok) {
          const data = await consultantsRes.json();
          setConsultants(data.consultants ?? []);
        }
      } catch { /* ignore */ }
      finally { setLoading(false); }
    })();
  }, []);

  // Fallback demo consultants
  const availableConsultants: ConsultantOption[] = consultants.length > 0 ? consultants : [
    { consultantId: "1", name: "Marie-Claire Dubois", specialties: ["AI Strategy", "Governance"], activeCount: 3 },
    { consultantId: "2", name: "Jean-François Tremblay", specialties: ["Change Management", "OCM"], activeCount: 2 },
    { consultantId: "3", name: "Sophie Chen", specialties: ["Process Design", "Technology"], activeCount: 3 },
  ];

  const handleAssign = async (reviewId: string, consultantId: string) => {
    setAssigningId(reviewId);
    try {
      await fetch(`/api/consultant/reviews/${reviewId}/assign`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ consultantId }),
      });
      // Update local state
      const consultant = availableConsultants.find(c => c.consultantId === consultantId);
      setReviews(prev => prev.map(r =>
        r.id === reviewId ? { ...r, consultant_id: consultantId, consultant_name: consultant?.name ?? null, status: r.status === "pending" ? "in_review" : r.status } : r
      ));
    } catch { /* ignore */ }
    finally {
      setAssigningId(null);
      setShowDropdown(null);
    }
  };

  const filteredReviews = useMemo(() => {
    if (!search.trim()) return reviews;
    const q = search.toLowerCase();
    return reviews.filter(r =>
      r.tenant_name.toLowerCase().includes(q) ||
      r.tool_name.toLowerCase().includes(q) ||
      (r.consultant_name ?? "").toLowerCase().includes(q)
    );
  }, [reviews, search]);

  const unassigned = filteredReviews.filter(r => !r.consultant_id);
  const assigned = filteredReviews.filter(r => !!r.consultant_id);

  const getSlaRemaining = (requestedAt: string) => {
    const target = 48 * 60 * 60 * 1000;
    const elapsed = Date.now() - new Date(requestedAt).getTime();
    const remaining = target - elapsed;
    if (remaining <= 0) return { text: bi({ fr: "Dépassé", en: "Overdue" }), overdue: true };
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    return { text: `${hours}h`, overdue: false };
  };

  const renderReviewRow = (r: Review, showAssignBtn: boolean) => {
    const sla = getSlaRemaining(r.requested_at);
    return (
      <div
        key={r.id}
        className={`rounded-xl border p-4 transition-all ${dark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}
      >
        <div className="flex items-center gap-4">
          <div className="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-5 gap-2 items-center">
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
              <p className={`text-[10px] ${dark ? "text-white/30" : "text-gray-400"}`}>SLA</p>
              <p className={`text-sm font-medium ${sla.overdue ? "text-red-500" : dark ? "text-white/70" : "text-gray-700"}`}>
                {sla.text}
              </p>
            </div>
            <div className="hidden md:block">
              {showAssignBtn ? (
                <div className="relative">
                  <Button
                    size="sm" variant="outline"
                    className={`rounded-full text-xs gap-1 ${dark ? "border-white/10" : ""}`}
                    style={{ color: C.green }}
                    onClick={() => setShowDropdown(showDropdown === r.id ? null : r.id)}
                    disabled={assigningId === r.id}
                  >
                    {assigningId === r.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <>
                        <UserPlus className="w-3 h-3" />
                        {bi({ fr: "Assigner", en: "Assign" })}
                        <ChevronDown className="w-3 h-3" />
                      </>
                    )}
                  </Button>
                  {showDropdown === r.id && (
                    <div className={`absolute right-0 top-full mt-1 z-50 w-64 rounded-xl border shadow-lg py-1 ${dark ? "bg-gray-900 border-white/10" : "bg-white border-gray-200"}`}>
                      {availableConsultants.map(c => (
                        <button
                          key={c.consultantId}
                          onClick={() => handleAssign(r.id, c.consultantId)}
                          className={`w-full text-left px-3 py-2 flex items-center gap-2 transition-colors ${dark ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
                        >
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ background: C.green, color: C.yellow }}>
                            {c.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-medium truncate ${dark ? "text-white" : "text-gray-900"}`}>{c.name}</p>
                            <p className={`text-[10px] ${dark ? "text-white/30" : "text-gray-400"}`}>
                              {c.activeCount} {bi({ fr: "actives", en: "active" })}
                            </p>
                          </div>
                          <ArrowRight className={`w-3 h-3 ${dark ? "text-white/20" : "text-gray-300"}`} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <p className={`text-[10px] ${dark ? "text-white/30" : "text-gray-400"}`}>{bi(consultantI18n.consultant)}</p>
                  <p className={`text-sm truncate ${dark ? "text-white/60" : "text-gray-600"}`}>
                    {r.consultant_name ?? bi(consultantI18n.unassigned)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ ...HDR_FONT, color: dark ? "white" : C.green }}>
          {bi({ fr: "Assignation des reviews", en: "Review Assignment" })}
        </h1>
        <p className={`text-sm mt-1 ${dark ? "text-white/40" : "text-gray-500"}`}>
          {bi({ fr: "Assignez les reviews en attente aux consultants de votre équipe", en: "Assign pending reviews to your team consultants" })}
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-6">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${dark ? "text-white/30" : "text-gray-400"}`} />
        <Input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder={bi({ fr: "Rechercher...", en: "Search..." })}
          className={`pl-9 rounded-full ${dark ? "bg-white/5 border-white/10 text-white placeholder:text-white/30" : ""}`}
        />
        {search && (
          <button onClick={() => setSearch("")} className={`absolute right-3 top-1/2 -translate-y-1/2 ${dark ? "text-white/30" : "text-gray-400"}`}>
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className={`w-5 h-5 animate-spin ${dark ? "text-white/30" : "text-gray-400"}`} />
        </div>
      ) : (
        <>
          {/* Unassigned reviews */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <h2 className={`text-xs font-semibold uppercase tracking-wider ${dark ? "text-white/30" : "text-gray-400"}`}>
                {bi({ fr: "Non assignées", en: "Unassigned" })}
              </h2>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 rounded-full" style={{ borderColor: "#f59e0b", color: "#f59e0b" }}>
                {unassigned.length}
              </Badge>
              <div className={`flex-1 h-px ${dark ? "bg-white/5" : "bg-gray-100"}`} />
            </div>
            {unassigned.length === 0 ? (
              <p className={`text-sm text-center py-6 ${dark ? "text-white/30" : "text-gray-400"}`}>
                {bi({ fr: "Toutes les reviews sont assignées", en: "All reviews are assigned" })}
              </p>
            ) : (
              <div className="space-y-2">
                {unassigned.map(r => renderReviewRow(r, true))}
              </div>
            )}
          </div>

          {/* Assigned reviews */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className={`text-xs font-semibold uppercase tracking-wider ${dark ? "text-white/30" : "text-gray-400"}`}>
                {bi({ fr: "Assignées", en: "Assigned" })}
              </h2>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 rounded-full" style={{ borderColor: "#3b82f6", color: "#3b82f6" }}>
                {assigned.length}
              </Badge>
              <div className={`flex-1 h-px ${dark ? "bg-white/5" : "bg-gray-100"}`} />
            </div>
            {assigned.length === 0 ? (
              <p className={`text-sm text-center py-6 ${dark ? "text-white/30" : "text-gray-400"}`}>
                {bi({ fr: "Aucune review assignée", en: "No assigned reviews" })}
              </p>
            ) : (
              <div className="space-y-2">
                {assigned.map(r => renderReviewRow(r, false))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
