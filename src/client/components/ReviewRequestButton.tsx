import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Loader2 } from "lucide-react";
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
  const bi = (fr: string, en: string) => (lang === "fr" ? fr : en);

  if (!conversationId) return null;

  // Already has a review
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

        {/* Show modified content link if delivered */}
        {existingReview.status === "delivered" && existingReview.modified_file_url && (
          <a
            href={existingReview.modified_file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium underline"
            style={{ color: C.green }}
          >
            {bi("Télécharger le livrable vérifié", "Download verified deliverable")}
          </a>
        )}
      </div>
    );
  }

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
