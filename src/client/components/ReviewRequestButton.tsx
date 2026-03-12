import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck, Loader2, Download, ChevronDown, ChevronUp,
  MessageSquare, FileSpreadsheet, Sparkles,
} from "lucide-react";
import { C, HDR_FONT } from "@/lib/constants";
import { ReviewStatusBadge } from "./ReviewStatusBadge";

interface ReviewData {
  id: string;
  status: string;
  consultant_name?: string | null;
  client_feedback?: string | null;
  modified_content?: string | null;
  modified_file_url?: string | null;
  original_file_url?: string | null;
}

interface ToolPricing {
  tier: string;
  price_cents: number;
  label_fr: string;
  label_en: string;
  currency: string;
  enterprise_included: boolean;
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

const TIER_COLORS: Record<string, { bg: string; text: string; darkBg: string }> = {
  standard: { bg: "bg-blue-50", text: "text-blue-700", darkBg: "bg-blue-500/10" },
  premium:  { bg: "bg-amber-50", text: "text-amber-700", darkBg: "bg-amber-500/10" },
  expert:   { bg: "bg-purple-50", text: "text-purple-700", darkBg: "bg-purple-500/10" },
};

function formatPrice(cents: number, currency: string, lang: "fr" | "en"): string {
  const amount = (cents / 100).toFixed(0);
  if (lang === "fr") return `${amount} $ ${currency.toUpperCase()}`;
  return `$${amount} ${currency.toUpperCase()}`;
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
  const [pricing, setPricing] = useState<ToolPricing | null>(null);
  const bi = (fr: string, en: string) => (lang === "fr" ? fr : en);

  // Fetch pricing for this tool
  useEffect(() => {
    if (existingReview || !conversationId || !toolName) return;
    (async () => {
      try {
        const res = await fetch(`/api/client/review-pricing?tool=${toolName}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          setPricing(data);
        }
      } catch { /* fallback to default display */ }
    })();
  }, [toolName, conversationId, existingReview]);

  if (!conversationId) return null;

  // ── Delivered: show the verified deliverable ──
  if (existingReview?.status === "delivered") {
    const hasModifiedContent = !!existingReview.modified_content?.trim();
    const hasModifiedFile = !!existingReview.modified_file_url;
    const hasFeedback = !!existingReview.client_feedback?.trim();

    // The file to download: modified if available, otherwise original (consultant approved it as-is)
    const downloadUrl = existingReview.modified_file_url || existingReview.original_file_url;
    const hasDownloadableFile = !!downloadUrl;
    const isModifiedFile = hasModifiedFile;

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

        {/* ── PRIMARY ACTION: Download file ── */}
        {hasDownloadableFile && (
          <div className={`px-5 py-4 border-t ${dark ? "border-white/5" : "border-emerald-100"}`}>
            <a
              href={downloadUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all hover:scale-[1.01] hover:shadow-md ${
                dark
                  ? "bg-emerald-950/30 border-emerald-500/30 hover:border-emerald-500/50"
                  : "bg-white border-emerald-200 hover:border-emerald-400 hover:shadow-emerald-100"
              }`}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: dark ? "rgba(0,53,51,0.5)" : C.greenLight }}
              >
                <FileSpreadsheet className="w-6 h-6" style={{ color: C.green }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold ${dark ? "text-white" : "text-gray-900"}`} style={HDR_FONT}>
                  {isModifiedFile
                    ? bi("Livrable modifié par le consultant", "Deliverable modified by consultant")
                    : bi("Livrable validé par le consultant", "Deliverable validated by consultant")
                  }
                </p>
                <p className={`text-xs mt-0.5 ${dark ? "text-white/40" : "text-gray-500"}`}>
                  {bi("Cliquez pour télécharger le fichier", "Click to download the file")}
                </p>
              </div>
              <div className="shrink-0">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: C.green }}
                >
                  <Download className="w-5 h-5" style={{ color: C.yellow }} />
                </div>
              </div>
            </a>
          </div>
        )}

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

        {/* ── View modified text content (expandable) ── */}
        {hasModifiedContent && (
          <div className={`border-t ${dark ? "border-white/5" : "border-emerald-100"}`}>
            <button
              onClick={() => setShowContent(!showContent)}
              className={`w-full px-5 py-2.5 flex items-center gap-1.5 text-xs font-medium transition-colors ${
                dark ? "text-white/40 hover:text-white/60 hover:bg-white/5" : "text-gray-500 hover:text-gray-700 hover:bg-emerald-50/50"
              }`}
            >
              {showContent ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {showContent
                ? bi("Masquer le contenu texte", "Hide text content")
                : bi("Voir le contenu texte vérifié", "View verified text content")
              }
            </button>

            {showContent && (
              <div className={`px-5 py-4 border-t max-h-[600px] overflow-y-auto ${dark ? "border-white/5" : "border-emerald-100"}`}>
                <div className={`prose prose-sm max-w-none ${dark ? "prose-invert" : ""}`}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {existingReview.modified_content!}
                  </ReactMarkdown>
                </div>
              </div>
            )}
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

  // ── No review yet — show request button with dynamic pricing ──
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

  // Tier display
  const tierKey = pricing?.tier ?? "premium";
  const tierColor = TIER_COLORS[tierKey] ?? TIER_COLORS.premium;
  const tierLabel = pricing
    ? (lang === "fr" ? pricing.label_fr : pricing.label_en)
    : bi("Premium", "Premium");
  const priceDisplay = pricing
    ? (pricing.enterprise_included
        ? bi("Inclus dans votre forfait", "Included in your plan")
        : formatPrice(pricing.price_cents, pricing.currency, lang))
    : bi("449 $ CAD", "$449 CAD");
  const isIncluded = pricing?.enterprise_included ?? false;

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
          <div className="flex items-center gap-2 flex-wrap">
            <p className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-900"}`} style={HDR_FONT}>
              {bi("Vérification par un consultant", "Consultant Verification")}
            </p>
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              dark ? `${tierColor.darkBg} ${tierColor.text}` : `${tierColor.bg} ${tierColor.text}`
            }`}>
              <Sparkles className="w-2.5 h-2.5" />
              {tierLabel}
            </span>
          </div>
          <p className={`text-xs mt-0.5 ${dark ? "text-white/40" : "text-gray-500"}`}>
            {bi(
              "Un consultant Talsom vérifie, améliore et certifie votre livrable. Délai : 48h.",
              "A Talsom consultant verifies, improves and certifies your deliverable. Turnaround: 48h."
            )}
          </p>
          <p className={`text-xs mt-1.5 font-bold ${isIncluded ? "" : ""}`} style={{ color: C.green }}>
            {priceDisplay}
            {!isIncluded && (
              <span className={`font-normal ml-1 ${dark ? "text-white/30" : "text-gray-400"}`}>
                / {bi("livrable", "deliverable")}
              </span>
            )}
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
