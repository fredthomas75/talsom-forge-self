import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Loader2, Download, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { C, HDR_FONT } from "@/lib/constants";
import { ReviewStatusBadge } from "./ReviewStatusBadge";

interface ReviewData {
  id: string;
  status: string;
  consultant_name?: string | null;
  client_feedback?: string | null;
  modified_content?: string | null;
  modified_file_url?: string | null;
}

interface ReviewRequestButtonProps {
  conversationId: string | null;
  toolName: string;
  originalContent?: string;
  originalFileUrl?: string;
  accessToken: string;
  lang: "fr" | "en";
  existingReview?: ReviewData | null;
  dark?: boolean;
  onReviewCreated?: (review: ReviewData) => void;
}

export function ReviewRequestButton({
  conversationId,
  toolName,
  originalContent,
  originalFileUrl,
  accessToken,
  lang,
  existingReview,
  dark = false,
  onReviewCreated,
}: ReviewRequestButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showContent, setShowContent] = useState(false);
  const bi = (fr: string, en: string) => (lang === "fr" ? fr : en);

  if (!conversationId) return null;

  // ── Delivered: show the verified deliverable ──
  if (existingReview?.status === "delivered") {
    const hasModifiedContent = !!existingReview.modified_content?.trim();
    const hasModifiedFile = !!existingReview.modified_file_url;
    const hasFeedback = !!existingReview.client_feedback?.trim();

    return (
      <div
        className={`mt-4 rounded-2xl overflow-hidden border-2 ${
          dark ? "border-emerald-500/30 bg-emerald-950/20" : "border-emerald-200 bg-emerald-50/50"
        }`}
      >
        {/* ── Header: Verified badge + consultant name ── */}
        <div
          className={`px-5 py-4 flex items-start gap-3 ${
            dark ? "bg-emerald-950/30" : "bg-emerald-50"
          }`}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: dark ? "rgba(0,53,51,0.5)" : C.greenLight }}
          >
            <ShieldCheck className="w-6 h-6" style={{ color: C.green }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <ReviewStatusBadge
                status="delivered"
                consultantName={existingReview.consultant_name}
                lang={lang}
              />
            </div>
            <p className={`text-xs mt-1.5 ${dark ? "text-white/40" : "text-gray-500"}`}>
              {bi(
                "Ce livrable a été vérifié, amélioré et certifié par un consultant Talsom.",
                "This deliverable has been verified, improved and certified by a Talsom consultant."
              )}
            </p>
          </div>
        </div>

        {/* ── Client feedback from consultant ── */}
        {hasFeedback && (
          <div className={`px-5 py-3 border-t ${dark ? "border-white/5" : "border-emerald-100"}`}>
            <div className="flex items-start gap-2">
              <MessageSquare className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${dark ? "text-white/30" : "text-gray-400"}`} />
              <div>
                <p className={`text-[10px] font-semibold uppercase tracking-wider mb-0.5 ${dark ? "text-white/30" : "text-gray-400"}`}>
                  {bi("Commentaire du consultant", "Consultant feedback")}
                </p>
                <p className={`text-sm leading-relaxed ${dark ? "text-white/70" : "text-gray-700"}`}>
                  {existingReview.client_feedback}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Actions: View content + Download file ── */}
        <div className={`px-5 py-3 border-t flex items-center gap-2 flex-wrap ${dark ? "border-white/5" : "border-emerald-100"}`}>
          {hasModifiedContent && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowContent(!showContent)}
              className={`rounded-full text-xs gap-1.5 ${
                dark
                  ? "border-white/10 text-white/70 hover:bg-white/5"
                  : "border-emerald-200 text-emerald-800 hover:bg-emerald-50"
              }`}
            >
              {showContent ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  {bi("Masquer le contenu", "Hide content")}
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  {bi("Voir le livrable vérifié", "View verified deliverable")}
                </>
              )}
            </Button>
          )}

          {hasModifiedFile && (
            <a
              href={existingReview.modified_file_url!}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                dark
                  ? "border-white/10 text-white/70 hover:bg-white/5"
                  : "border-emerald-200 text-emerald-800 hover:bg-emerald-50"
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              {bi("Télécharger le livrable vérifié", "Download verified deliverable")}
            </a>
          )}
        </div>

        {/* ── Modified content (markdown rendered) ── */}
        {showContent && hasModifiedContent && (
          <div className={`border-t ${dark ? "border-white/5" : "border-emerald-100"}`}>
            <div className={`px-5 py-4 max-h-[600px] overflow-y-auto`}>
              <div className={`prose prose-sm max-w-none ${dark ? "prose-invert" : ""}`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {existingReview.modified_content!}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Existing review (non-delivered) — show status ──
  if (existingReview) {
    return (
      <div className={`mt-4 rounded-xl p-4 border ${dark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"}`}>
        <ReviewStatusBadge
          status={existingReview.status}
          consultantName={existingReview.consultant_name}
          lang={lang}
        />

        {/* Show client feedback if available */}
        {existingReview.client_feedback && (
          <div className={`mt-3 text-sm rounded-lg p-3 ${dark ? "bg-white/5 text-white/70" : "bg-white text-gray-700"}`}>
            <p className={`text-xs font-semibold mb-1 ${dark ? "text-white/40" : "text-gray-500"}`}>
              {bi("Commentaire du consultant", "Consultant feedback")}
            </p>
            {existingReview.client_feedback}
          </div>
        )}
      </div>
    );
  }

  // ── No review yet — show request button ──
  const handleRequest = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/client/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          conversationId,
          toolName,
          originalContent,
          originalFileUrl,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      onReviewCreated?.({
        id: data.review.id,
        status: data.review.status,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`mt-4 rounded-xl p-4 border ${dark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"}`}>
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: dark ? "rgba(0,53,51,0.3)" : C.greenLight }}
        >
          <ShieldCheck className="w-5 h-5" style={{ color: C.green }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-900"}`} style={HDR_FONT}>
            {bi("Vérification par un consultant", "Consultant Verification")}
          </p>
          <p className={`text-xs mt-0.5 ${dark ? "text-white/40" : "text-gray-500"}`}>
            {bi(
              "Un consultant Talsom vérifie, améliore et certifie votre livrable. Délai : 48h.",
              "A Talsom consultant verifies, improves and certifies your deliverable. Turnaround: 48h."
            )}
          </p>
          <p className="text-xs mt-1 font-semibold" style={{ color: C.green }}>
            149 $ CAD / {bi("livrable", "deliverable")}
          </p>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-2">{error}</p>
      )}

      <Button
        onClick={handleRequest}
        disabled={loading}
        className="mt-3 w-full rounded-full border-0 font-semibold text-sm hover:opacity-90 transition-opacity"
        style={{ background: C.green, color: C.yellow }}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {bi("Envoi...", "Sending...")}
          </>
        ) : (
          <>
            <ShieldCheck className="w-4 h-4 mr-2" />
            {bi("Demander une vérification", "Request verification")}
          </>
        )}
      </Button>
    </div>
  );
}
