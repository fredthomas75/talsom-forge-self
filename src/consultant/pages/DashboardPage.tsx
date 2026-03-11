import { useState, useEffect } from "react";
import { Clock, CheckCircle2, Activity, Gauge, Shield, Package } from "lucide-react";
import { C, HDR_FONT } from "@/lib/constants";
import { useLang, useTheme } from "@/lib/contexts";
import { useConsultant } from "../contexts/ConsultantContext";
import { consultantI18n } from "../i18n";

interface DashboardStats {
  pending: number;
  myActive: number;
  completedThisMonth: number;
  avgHours: number;
  slaPercent: number;
  totalDelivered: number;
}

export function DashboardPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const { user, session } = useConsultant();
  const bi = (v: { fr: string; en: string }) => (lang === "fr" ? v.fr : v.en);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/consultant/dashboard", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) setStats(await res.json());
      } catch { /* ignore */ }
      finally { setLoading(false); }
    })();
  }, []);

  const cards = [
    { label: consultantI18n.pendingReviews, value: stats?.pending ?? 0, icon: Clock, color: "#f59e0b" },
    { label: consultantI18n.myActiveReviews, value: stats?.myActive ?? 0, icon: Activity, color: "#3b82f6" },
    { label: consultantI18n.completedThisMonth, value: stats?.completedThisMonth ?? 0, icon: CheckCircle2, color: "#10b981" },
    { label: consultantI18n.avgTurnaround, value: `${stats?.avgHours ?? 0}h`, icon: Gauge, color: "#8b5cf6" },
    { label: consultantI18n.slaCompliance, value: `${stats?.slaPercent ?? 100}%`, icon: Shield, color: C.green },
    { label: consultantI18n.totalDelivered, value: stats?.totalDelivered ?? 0, icon: Package, color: "#ec4899" },
  ];

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ ...HDR_FONT, color: C.green }}>
          {bi({ fr: `Bonjour, ${user?.name?.split(" ")[0] ?? ""}`, en: `Hello, ${user?.name?.split(" ")[0] ?? ""}` })}
        </h1>
        <p className={`text-sm mt-1 ${dark ? "text-white/40" : "text-gray-500"}`}>
          {bi({ fr: "Voici un aperçu de votre activité de révision.", en: "Here's an overview of your review activity." })}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map(({ label, value, icon: Icon, color }, i) => (
          <div key={i} className={`rounded-xl border p-5 ${dark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}>
            <div className="flex items-center justify-between mb-3">
              <p className={`text-xs font-medium ${dark ? "text-white/40" : "text-gray-500"}`}>
                {bi(label)}
              </p>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${dark ? "text-white" : "text-gray-900"}`} style={HDR_FONT}>
              {loading ? "—" : value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
