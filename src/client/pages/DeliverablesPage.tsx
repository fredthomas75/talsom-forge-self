import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Loader2, Download, FileSpreadsheet, Layers, ArrowRight,
  MessageSquare, ChevronDown, ChevronUp, ShieldCheck, Bot,
  Clock, PackageCheck,
} from "lucide-react";
import { C, HDR_FONT } from "@/lib/constants";
import { useLang, useTheme } from "@/lib/contexts";
import { useClient } from "../contexts/ClientContext";
import { clientI18n } from "../i18n";
import { TOOL_META } from "../lib/tool-meta";
import { ReviewStatusBadge } from "../components/ReviewStatusBadge";
import { ReviewRequestButton } from "../components/ReviewRequestButton";

interface ReviewItem {
  id: string;
  conversation_id: string;
  tool_name: string;
  status: string;
  consultant_name?: string | null;
  client_feedback?: string | null;
  modified_content?: string | null;
  modified_file_url?: string | null;
  original_file_url?: string | null;
  requested_at: string;
  delivered_at?: string | null;
  price_cents: number;
  payment_status: string;
}

const STATUS_TABS = ["all", "pending", "in_review", "delivered"] as const;

export function DeliverablesPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const { session, quotas } = useClient();
  const navigate = useNavigate();
  const bi = (v: { fr: string; en: string }) => (lang === "fr" ? v.fr : v.en);
  const hasHumanReview = quotas?.features?.human_review === true;

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [toolFilter, setToolFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Fetch all reviews
  useEffect(() => {
    if (!hasHumanReview) { setLoading(false); return; }
    (async () => {
      try {
        const res = await fetch("/api/client/reviews", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setReviews(data.reviews ?? []);
        }
      } catch { /* ignore */ }
      finally { setLoading(false); }
    })();
  }, [hasHumanReview]);

  // Derived data
  const filteredReviews = reviews.filter((r) => {
    if (statusFilter === "in_review") {
      // Group: in_review + approved + needs_revision (all "in progress" states)
      if (r.status !== "in_review" && r.status !== "approved" && r.status !== "needs_revision") return false;
    } else if (statusFilter !== "all" && r.status !== statusFilter) {
      return false;
    }
    if (toolFilter !== "all" && r.tool_name !== toolFilter) return false;
    return true;
  });

  const toolsInReviews = [...new Set(reviews.map((r) => r.tool_name))];

  const counts = {
    all: reviews.length,
    pending: reviews.filter((r) => r.status === "pending").length,
    in_review: reviews.filter((r) => r.status === "in_review" || r.status === "approved" || r.status === "needs_revision").length,
    delivered: reviews.filter((r) => r.status === "delivered").length,
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(lang === "fr" ? "fr-CA" : "en-CA", { day: "numeric", month: "short", year: "numeric" });
  };

  // Feature not available
  if (!hasHumanReview) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className={`rounded-2xl p-8 text-center ${dark ? "bg-white/5" : "bg-gray-50"}`}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: C.greenLight }}>
            <PackageCheck className="w-7 h-7" style={{ color: C.green }} />
          </div>
          <h2 className={`text-lg font-bold mb-2 ${dark ? "text-white" : "text-gray-900"}`} style={HDR_FONT}>
            {bi(clientI18n.deliverables)}
          </h2>
          <p className={`text-sm mb-4 ${dark ? "text-white/50" : "text-gray-500"}`}>
            {bi(clientI18n.featureNotAvailable)}
          </p>
          <button
            onClick={() => navigate("/client/settings")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border-0 transition-opacity hover:opacity-90"
            style={{ background: C.green, color: C.yellow }}
          >
            {bi(clientI18n.upgrade)}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* ── Header ── */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: C.greenLight }}>
            <PackageCheck className="w-5 h-5" style={{ color: C.green }} />
          </div>
          <div>
            <h1 className={`text-xl font-bold ${dark ? "text-white" : "text-gray-900"}`} style={HDR_FONT}>
              {bi(clientI18n.deliverables)}
            </h1>
            <p className={`text-sm ${dark ? "text-white/40" : "text-gray-500"}`}>
              {bi(clientI18n.deliverablesDesc)}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className={`w-6 h-6 animate-spin ${dark ? "text-white/30" : "text-gray-400"}`} />
        </div>
      ) : reviews.length === 0 ? (
        /* ── Empty state ── */
        <div className={`rounded-2xl p-8 text-center ${dark ? "bg-white/5" : "bg-gray-50"}`}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: C.greenLight }}>
            <ShieldCheck className="w-7 h-7" style={{ color: C.green }} />
          </div>
          <h3 className={`text-base font-bold mb-1.5 ${dark ? "text-white" : "text-gray-900"}`} style={HDR_FONT}>
            {bi(clientI18n.noDeliverables)}
          </h3>
          <p className={`text-sm mb-4 ${dark ? "text-white/40" : "text-gray-500"}`}>
            {bi(clientI18n.noDeliverablesDesc)}
          </p>
          <button
            onClick={() => navigate("/client/tools")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border-0 transition-opacity hover:opacity-90"
            style={{ background: C.green, color: C.yellow }}
          >
            <Bot className="w-4 h-4" />
            {bi(clientI18n.browseTools)}
          </button>
        </div>
      ) : (
        <>
          {/* ── Stat counters ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {STATUS_TABS.map((tab) => {
              const active = statusFilter === tab;
              const labels: Record<string, { fr: string; en: string }> = {
                all: clientI18n.allStatuses,
                pending: clientI18n.reviewPending,
                in_review: clientI18n.reviewInProgress,
                delivered: clientI18n.reviewDelivered,
              };
              return (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`rounded-xl p-3 text-left transition-all border-2 ${
                    active
                      ? dark ? "border-emerald-500/40 bg-emerald-950/30" : "border-emerald-300 bg-emerald-50"
                      : dark ? "border-white/5 bg-white/5 hover:border-white/10" : "border-gray-100 bg-white hover:border-gray-200"
                  }`}
                >
                  <p className={`text-2xl font-bold ${dark ? "text-white" : "text-gray-900"}`} style={HDR_FONT}>
                    {counts[tab]}
                  </p>
                  <p className={`text-xs mt-0.5 ${active ? "font-semibold" : ""} ${dark ? "text-white/50" : "text-gray-500"}`}>
                    {tab === "delivered" && counts[tab] > 0
                      ? bi({ fr: "Livrés", en: "Delivered" })
                      : bi(labels[tab])
                    }
                  </p>
                </button>
              );
            })}
          </div>

          {/* ── Tool filter ── */}
          {toolsInReviews.length > 1 && (
            <div className="mb-4">
              <select
                value={toolFilter}
                onChange={(e) => setToolFilter(e.target.value)}
                className={`text-sm rounded-lg px-3 py-1.5 border ${
                  dark ? "bg-white/5 border-white/10 text-white" : "bg-white border-gray-200 text-gray-700"
                }`}
              >
                <option value="all">{bi(clientI18n.allTools)}</option>
                {toolsInReviews.map((tool) => {
                  const meta = TOOL_META[tool];
                  return (
                    <option key={tool} value={tool}>
                      {meta ? bi(meta.label) : tool}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {/* ── Deliverable cards ── */}
          <div className="space-y-3">
            {filteredReviews.map((review) => {
              const meta = TOOL_META[review.tool_name];
              const Icon = meta?.icon ?? Layers;
              const isDelivered = review.status === "delivered";
              const downloadUrl = review.modified_file_url || review.original_file_url;
              const hasModifiedContent = !!review.modified_content?.trim();
              const hasFeedback = !!review.client_feedback?.trim();
              const isExpanded = expandedId === review.id;

              return (
                <div
                  key={review.id}
                  className={`rounded-2xl border-2 overflow-hidden transition-all ${
                    isDelivered
                      ? dark ? "border-emerald-500/30 bg-emerald-950/10" : "border-emerald-200 bg-white"
                      : dark ? "border-white/5 bg-white/5" : "border-gray-100 bg-white"
                  }`}
                >
                  {/* Card header */}
                  <div className="px-4 py-3 flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: dark ? "rgba(0,53,51,0.3)" : C.greenLight }}
                    >
                      <Icon className="w-5 h-5" style={{ color: C.green }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-sm font-bold ${dark ? "text-white" : "text-gray-900"}`} style={HDR_FONT}>
                          {meta ? bi(meta.label) : review.tool_name}
                        </p>
                        <ReviewStatusBadge
                          status={review.status}
                          consultantName={review.consultant_name}
                          lang={lang}
                        />
                      </div>
                      <div className={`flex items-center gap-3 text-xs mt-0.5 ${dark ? "text-white/40" : "text-gray-400"}`}>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {bi(clientI18n.requestedOn)} {formatDate(review.requested_at)}
                        </span>
                        {review.delivered_at && (
                          <span>
                            {bi(clientI18n.deliveredOn)} {formatDate(review.delivered_at)}
                          </span>
                        )}
                        {review.consultant_name && !isDelivered && (
                          <span>{bi(clientI18n.assignedTo)} {review.consultant_name}</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isDelivered && downloadUrl && (
                        <a
                          href={downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border-0 transition-opacity hover:opacity-90"
                          style={{ background: C.green, color: C.yellow }}
                        >
                          <Download className="w-3.5 h-3.5" />
                          {bi(clientI18n.downloadVerified)}
                        </a>
                      )}
                      {/* Expand button: for delivered (feedback/content) OR non-delivered (progress tracker) */}
                      {(isDelivered ? (hasModifiedContent || hasFeedback) : true) && (
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : review.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                            isExpanded
                              ? dark ? "bg-white/10 text-white/70" : "bg-gray-100 text-gray-700"
                              : dark ? "text-white/40 hover:text-white/70 hover:bg-white/5" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          {!isDelivered && !isExpanded && bi(clientI18n.viewProgress)}
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/client/tools/${review.tool_name}`)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                          dark ? "border-white/10 text-white/50 hover:text-white/80 hover:bg-white/5" : "border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <ArrowRight className="w-3 h-3" />
                        {bi(clientI18n.goToTool)}
                      </button>
                    </div>
                  </div>

                  {/* Expanded content: non-delivered → progress tracker */}
                  {isExpanded && !isDelivered && (
                    <div className={`border-t px-4 py-3 ${dark ? "border-white/5" : "border-gray-100"}`}>
                      <ReviewRequestButton
                        conversationId={review.conversation_id}
                        toolName={review.tool_name}
                        accessToken={session.access_token}
                        lang={lang}
                        existingReview={review}
                        dark={dark}
                      />
                    </div>
                  )}

                  {/* Expanded content: delivered */}
                  {isExpanded && isDelivered && (
                    <div className={`border-t ${dark ? "border-white/5" : "border-gray-100"}`}>
                      {/* Feedback */}
                      {hasFeedback && (
                        <div className={`px-4 py-3 ${dark ? "bg-white/[0.02]" : "bg-gray-50/50"}`}>
                          <div className="flex items-start gap-2">
                            <MessageSquare className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${dark ? "text-white/30" : "text-gray-400"}`} />
                            <div>
                              <p className={`text-[10px] font-semibold uppercase tracking-wider mb-0.5 ${dark ? "text-white/30" : "text-gray-400"}`}>
                                {bi(clientI18n.consultantFeedback)}
                              </p>
                              <p className={`text-sm leading-relaxed ${dark ? "text-white/70" : "text-gray-700"}`}>
                                {review.client_feedback}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Modified content */}
                      {hasModifiedContent && (
                        <div className={`px-4 py-3 border-t max-h-[400px] overflow-y-auto ${dark ? "border-white/5" : "border-gray-100"}`}>
                          <p className={`text-[10px] font-semibold uppercase tracking-wider mb-2 ${dark ? "text-white/30" : "text-gray-400"}`}>
                            {bi({ fr: "Contenu modifié par le consultant", en: "Content modified by consultant" })}
                          </p>
                          <div className={`prose prose-sm max-w-none ${dark ? "prose-invert" : ""}`}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {review.modified_content!}
                            </ReactMarkdown>
                          </div>
                        </div>
                      )}

                      {/* Download card (if file exists) */}
                      {downloadUrl && (
                        <div className={`px-4 py-3 border-t ${dark ? "border-white/5" : "border-gray-100"}`}>
                          <a
                            href={downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all hover:scale-[1.01] hover:shadow-md ${
                              dark
                                ? "bg-emerald-950/30 border-emerald-500/30 hover:border-emerald-500/50"
                                : "bg-white border-emerald-200 hover:border-emerald-400 hover:shadow-emerald-100"
                            }`}
                          >
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                              style={{ background: dark ? "rgba(0,53,51,0.5)" : C.greenLight }}
                            >
                              <FileSpreadsheet className="w-5 h-5" style={{ color: C.green }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-bold ${dark ? "text-white" : "text-gray-900"}`} style={HDR_FONT}>
                                {review.modified_file_url
                                  ? bi({ fr: "Livrable modifié par le consultant", en: "Deliverable modified by consultant" })
                                  : bi({ fr: "Livrable validé par le consultant", en: "Deliverable validated by consultant" })
                                }
                              </p>
                              <p className={`text-xs mt-0.5 ${dark ? "text-white/40" : "text-gray-500"}`}>
                                {bi({ fr: "Cliquez pour télécharger", en: "Click to download" })}
                              </p>
                            </div>
                            <div className="shrink-0">
                              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: C.green }}>
                                <Download className="w-4 h-4" style={{ color: C.yellow }} />
                              </div>
                            </div>
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredReviews.length === 0 && reviews.length > 0 && (
            <div className={`rounded-xl p-6 text-center ${dark ? "bg-white/5" : "bg-gray-50"}`}>
              <p className={`text-sm ${dark ? "text-white/40" : "text-gray-500"}`}>
                {bi(clientI18n.noResults)}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
