import { CheckCircle2, Clock, Eye, AlertTriangle, Loader2 } from "lucide-react";
import { C } from "@/lib/constants";

interface ReviewStatusBadgeProps {
  status: string;
  consultantName?: string | null;
  lang: "fr" | "en";
  className?: string;
}

const STATUS_CONFIG: Record<string, {
  icon: typeof CheckCircle2;
  labelFr: string;
  labelEn: string;
  bg: string;
  text: string;
  border: string;
}> = {
  pending: {
    icon: Clock,
    labelFr: "En attente de vérification",
    labelEn: "Awaiting verification",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  in_review: {
    icon: Eye,
    labelFr: "En cours de révision",
    labelEn: "Under review",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  approved: {
    icon: CheckCircle2,
    labelFr: "Approuvé",
    labelEn: "Approved",
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  needs_revision: {
    icon: AlertTriangle,
    labelFr: "Révision nécessaire",
    labelEn: "Needs revision",
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
  },
  delivered: {
    icon: CheckCircle2,
    labelFr: "Vérifié par",
    labelEn: "Verified by",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-300",
  },
};

export function ReviewStatusBadge({ status, consultantName, lang, className = "" }: ReviewStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  if (!config) return null;

  const Icon = config.icon;
  const label = lang === "fr" ? config.labelFr : config.labelEn;
  const isDelivered = status === "delivered";

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${config.bg} ${config.text} ${config.border} ${className}`}>
      {status === "in_review" ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Icon className="w-3.5 h-3.5" style={isDelivered ? { color: C.green } : undefined} />
      )}
      <span>
        {isDelivered && consultantName
          ? `✓ ${label} ${consultantName}`
          : label
        }
      </span>
    </div>
  );
}
