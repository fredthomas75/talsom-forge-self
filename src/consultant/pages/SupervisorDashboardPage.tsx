import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock, CheckCircle2, Activity, Gauge, Shield, Package,
  Users, TrendingUp, AlertTriangle, BarChart3,
} from "lucide-react";
import { C, HDR_FONT } from "@/lib/constants";
import { useLang, useTheme } from "@/lib/contexts";
import { useConsultant } from "../contexts/ConsultantContext";
import { consultantI18n } from "../i18n";

interface TeamMember {
  consultantId: string;
  name: string;
  email: string;
  specialties: string[];
  role: string;
  activeReviews: number;
  completedThisMonth: number;
  avgHours: number;
  slaPercent: number;
}

interface ConsolidatedStats {
  totalPending: number;
  totalActive: number;
  totalCompletedThisMonth: number;
  avgTeamTurnaround: number;
  teamSlaPercent: number;
  totalDelivered: number;
  overdueCount: number;
  teamMembers: TeamMember[];
  productBreakdown: { product: string; count: number }[];
}

export function SupervisorDashboardPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const { session } = useConsultant();
  const bi = (v: { fr: string; en: string }) => (lang === "fr" ? v.fr : v.en);

  const [stats, setStats] = useState<ConsolidatedStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/consultant/supervisor/dashboard", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) setStats(await res.json());
      } catch { /* ignore */ }
      finally { setLoading(false); }
    })();
  }, []);

  // Fallback demo data for display when API not ready
  const demoStats: ConsolidatedStats = stats ?? {
    totalPending: 12,
    totalActive: 8,
    totalCompletedThisMonth: 34,
    avgTeamTurnaround: 18,
    teamSlaPercent: 94,
    totalDelivered: 187,
    overdueCount: 2,
    teamMembers: [
      { consultantId: "1", name: "Marie-Claire Dubois", email: "mc@talsom.com", specialties: ["AI Strategy", "Governance"], role: "consultant", activeReviews: 3, completedThisMonth: 12, avgHours: 14, slaPercent: 97 },
      { consultantId: "2", name: "Jean-François Tremblay", email: "jf@talsom.com", specialties: ["Change Management", "OCM"], role: "consultant", activeReviews: 2, completedThisMonth: 9, avgHours: 22, slaPercent: 91 },
      { consultantId: "3", name: "Sophie Chen", email: "sc@talsom.com", specialties: ["Process Design", "Technology"], role: "consultant", activeReviews: 3, completedThisMonth: 13, avgHours: 16, slaPercent: 95 },
    ],
    productBreakdown: [
      { product: "AI Strategy Tools", count: 18 },
      { product: "Forge | Transform", count: 12 },
      { product: "Forge | Discover", count: 8 },
      { product: "Governance", count: 6 },
    ],
  };

  const summaryCards = [
    { label: { fr: "En attente (équipe)", en: "Pending (team)" }, value: demoStats.totalPending, icon: Clock, color: "#f59e0b" },
    { label: { fr: "Actives (équipe)", en: "Active (team)" }, value: demoStats.totalActive, icon: Activity, color: "#3b82f6" },
    { label: { fr: "Complétées ce mois", en: "Completed this month" }, value: demoStats.totalCompletedThisMonth, icon: CheckCircle2, color: "#10b981" },
    { label: { fr: "Temps moyen (h)", en: "Avg turnaround (h)" }, value: `${demoStats.avgTeamTurnaround}h`, icon: Gauge, color: "#8b5cf6" },
    { label: { fr: "SLA équipe %", en: "Team SLA %" }, value: `${demoStats.teamSlaPercent}%`, icon: Shield, color: C.green },
    { label: { fr: "En retard", en: "Overdue" }, value: demoStats.overdueCount, icon: AlertTriangle, color: demoStats.overdueCount > 0 ? "#ef4444" : "#10b981" },
  ];

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ ...HDR_FONT, color: dark ? "white" : C.green }}>
            {bi({ fr: "Tableau de bord superviseur", en: "Supervisor Dashboard" })}
          </h1>
          <p className={`text-sm mt-1 ${dark ? "text-white/40" : "text-gray-500"}`}>
            {bi({ fr: "Vue consolidée de l'activité de l'équipe", en: "Consolidated view of team activity" })}
          </p>
        </div>
        <Badge className="rounded-full border-0 px-3 text-xs font-semibold" style={{ background: C.green, color: C.yellow }}>
          {bi({ fr: "Superviseur", en: "Supervisor" })}
        </Badge>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {summaryCards.map(({ label, value, icon: Icon, color }, i) => (
          <Card key={i} className={`rounded-xl border ${dark ? "bg-gray-900 border-white/5" : "border-gray-100"}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-medium ${dark ? "text-white/40" : "text-gray-400"}`}>{bi(label)}</span>
                <Icon className="w-3.5 h-3.5" style={{ color }} />
              </div>
              <p className={`text-xl font-bold ${dark ? "text-white" : "text-gray-900"}`} style={HDR_FONT}>
                {loading ? "—" : value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Team performance table */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4" style={{ color: C.green }} />
            <h2 className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-900"}`}>
              {bi({ fr: "Performance de l'équipe", en: "Team Performance" })}
            </h2>
          </div>

          <div className={`rounded-xl border overflow-hidden ${dark ? "border-white/5" : "border-gray-100"}`}>
            <table className="w-full">
              <thead>
                <tr className={dark ? "bg-white/5" : "bg-gray-50"}>
                  <th className={`text-left text-[10px] font-semibold uppercase tracking-wider px-4 py-3 ${dark ? "text-white/40" : "text-gray-400"}`}>
                    {bi({ fr: "Consultant", en: "Consultant" })}
                  </th>
                  <th className={`text-center text-[10px] font-semibold uppercase tracking-wider px-3 py-3 ${dark ? "text-white/40" : "text-gray-400"}`}>
                    {bi({ fr: "Actives", en: "Active" })}
                  </th>
                  <th className={`text-center text-[10px] font-semibold uppercase tracking-wider px-3 py-3 ${dark ? "text-white/40" : "text-gray-400"}`}>
                    {bi({ fr: "Ce mois", en: "This month" })}
                  </th>
                  <th className={`text-center text-[10px] font-semibold uppercase tracking-wider px-3 py-3 ${dark ? "text-white/40" : "text-gray-400"}`}>
                    {bi({ fr: "Moy. (h)", en: "Avg (h)" })}
                  </th>
                  <th className={`text-center text-[10px] font-semibold uppercase tracking-wider px-3 py-3 ${dark ? "text-white/40" : "text-gray-400"}`}>
                    SLA
                  </th>
                </tr>
              </thead>
              <tbody>
                {demoStats.teamMembers.map((member) => (
                  <tr key={member.consultantId} className={`border-t ${dark ? "border-white/5 hover:bg-white/5" : "border-gray-100 hover:bg-gray-50"} transition-colors`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: C.green, color: C.yellow }}>
                          {member.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${dark ? "text-white" : "text-gray-900"}`}>{member.name}</p>
                          <div className="flex gap-1 mt-0.5">
                            {member.specialties.slice(0, 2).map(s => (
                              <Badge key={s} variant="outline" className="text-[9px] px-1.5 py-0 h-4 rounded-full">{s}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center px-3 py-3">
                      <Badge className="rounded-full text-xs" style={{ background: "#3b82f620", color: "#3b82f6", border: "none" }}>
                        {member.activeReviews}
                      </Badge>
                    </td>
                    <td className={`text-center text-sm font-medium px-3 py-3 ${dark ? "text-white" : "text-gray-900"}`}>
                      {member.completedThisMonth}
                    </td>
                    <td className={`text-center text-sm px-3 py-3 ${dark ? "text-white/60" : "text-gray-600"}`}>
                      {member.avgHours}h
                    </td>
                    <td className="text-center px-3 py-3">
                      <span className={`text-sm font-semibold ${member.slaPercent >= 95 ? "text-green-500" : member.slaPercent >= 90 ? "text-amber-500" : "text-red-500"}`}>
                        {member.slaPercent}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product breakdown */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4" style={{ color: C.green }} />
            <h2 className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-900"}`}>
              {bi({ fr: "Répartition par produit", en: "Product Breakdown" })}
            </h2>
          </div>

          <div className={`rounded-xl border p-4 space-y-3 ${dark ? "border-white/5 bg-gray-900" : "border-gray-100 bg-white"}`}>
            {demoStats.productBreakdown.map((p, i) => {
              const max = Math.max(...demoStats.productBreakdown.map(x => x.count));
              const pct = (p.count / max) * 100;
              const colors = ["#06B6D4", "#8B5CF6", "#F59E0B", "#10B981"];
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-medium ${dark ? "text-white/70" : "text-gray-700"}`}>{p.product}</span>
                    <span className={`text-xs font-bold ${dark ? "text-white" : "text-gray-900"}`}>{p.count}</span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${dark ? "bg-white/5" : "bg-gray-100"}`}>
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: colors[i % colors.length] }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick stats */}
          <div className={`mt-4 rounded-xl border p-4 ${dark ? "border-white/5 bg-gray-900" : "border-gray-100 bg-white"}`}>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4" style={{ color: C.green }} />
              <span className={`text-xs font-semibold ${dark ? "text-white" : "text-gray-900"}`}>
                {bi({ fr: "Tendance", en: "Trend" })}
              </span>
            </div>
            <div className="space-y-2">
              <div className={`flex justify-between text-xs ${dark ? "text-white/50" : "text-gray-500"}`}>
                <span>{bi({ fr: "Total livré (tous temps)", en: "Total delivered (all time)" })}</span>
                <span className="font-bold" style={{ color: C.green }}>{demoStats.totalDelivered}</span>
              </div>
              <div className={`flex justify-between text-xs ${dark ? "text-white/50" : "text-gray-500"}`}>
                <span>{bi({ fr: "Consultants actifs", en: "Active consultants" })}</span>
                <span className="font-bold" style={{ color: C.green }}>{demoStats.teamMembers.length}</span>
              </div>
              <div className={`flex justify-between text-xs ${dark ? "text-white/50" : "text-gray-500"}`}>
                <span>{bi({ fr: "Capacité restante", en: "Remaining capacity" })}</span>
                <span className="font-bold" style={{ color: "#10b981" }}>
                  {Math.max(0, demoStats.teamMembers.length * 5 - demoStats.totalActive)} reviews
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
