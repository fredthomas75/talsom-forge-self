import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity, Cpu, MessageSquare, Users,
  ArrowRight, Bot, Key, UserPlus,
  TrendingUp, ArrowLeftRight, Lightbulb,
} from "lucide-react";
import { ErrorRetry } from "@/components/ErrorRetry";
import { C, HDR_FONT } from "@/lib/constants";
import { useLang, useTheme } from "@/lib/contexts";
import { useClient } from "../contexts/ClientContext";
import { clientI18n } from "../i18n";

interface DashboardStats {
  apiCalls: number;
  tokensUsed: number;
  conversations: number;
  teamMembers: number;
  recentActivity: { action: string; date: string; resource_type?: string }[];
}

export function DashboardPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const { user, tenant, quotas, session } = useClient();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const bi = (v: { fr: string; en: string }) => (lang === "fr" ? v.fr : v.en);

  const fetchStats = async () => {
    setFetchError(false);
    setLoading(true);
    try {
      const res = await fetch("/api/client/dashboard", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        setStats(await res.json());
      } else {
        setFetchError(true);
      }
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, [session.access_token]);

  const formatNum = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toString();
  };

  const isUnlimited = (n: number) => n === -1;

  const metricsCards = [
    {
      label: bi(clientI18n.apiCalls),
      value: stats?.apiCalls ?? 0,
      max: quotas?.max_api_calls_per_month ?? 0,
      icon: Activity,
      color: C.green,
    },
    {
      label: bi(clientI18n.tokensUsed),
      value: stats?.tokensUsed ?? 0,
      max: quotas?.max_tokens_per_month ?? 0,
      icon: Cpu,
      color: C.greenMid,
    },
    {
      label: bi(clientI18n.conversations),
      value: stats?.conversations ?? 0,
      max: quotas?.max_conversations ?? 0,
      icon: MessageSquare,
      color: "#2563EB",
    },
    {
      label: bi(clientI18n.teamMembers),
      value: stats?.teamMembers ?? 1,
      max: quotas?.max_team_members ?? 1,
      icon: Users,
      color: "#7C3AED",
    },
  ];

  const quickActions = [
    { label: bi(clientI18n.startChat), icon: MessageSquare, path: "/client/chat" },
    { label: bi(clientI18n.browseTools), icon: Bot, path: "/client/tools" },
    { label: "Forge | Transform", icon: ArrowLeftRight, path: "/client/transform" },
    { label: "Forge | Discover", icon: Lightbulb, path: "/client/discover" },
    { label: bi(clientI18n.manageKeys), icon: Key, path: "/client/keys" },
    { label: bi(clientI18n.inviteMember), icon: UserPlus, path: "/client/team" },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-2xl font-bold tracking-tight ${dark ? "text-white" : ""}`} style={{ ...HDR_FONT, color: dark ? undefined : C.green }}>
          {bi(clientI18n.welcomeBack)}, {user?.name ?? user?.email?.split("@")[0]}
        </h1>
        <p className={`text-sm mt-1 ${dark ? "text-white/40" : "text-gray-500"}`}>
          {bi(clientI18n.dashboardSubtitle)}
        </p>
      </div>

      {/* Plan badge */}
      {tenant && (
        <div className={`flex items-center gap-3 mb-6 px-4 py-3 rounded-xl ${dark ? "bg-white/5" : "bg-white border border-gray-100"}`}>
          <Badge className="rounded-full border-0 px-3 text-xs font-semibold" style={{ background: C.green, color: C.yellow }}>
            {bi(clientI18n[tenant.plan as keyof typeof clientI18n] ?? { fr: tenant.plan, en: tenant.plan })}
          </Badge>
          <span className={`text-sm ${dark ? "text-white/50" : "text-gray-500"}`}>
            {tenant.tenantName}
          </span>
          {tenant.plan !== "enterprise" && (
            <Button
              size="sm"
              variant="ghost"
              className="ml-auto text-xs rounded-full"
              style={{ color: C.green }}
              onClick={() => navigate("/client/settings")}
            >
              {bi(clientI18n.upgrade)} <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          )}
        </div>
      )}

      {/* Error state */}
      {fetchError && (
        <div className="mb-6">
          <ErrorRetry
            message={bi({ fr: "Impossible de charger les statistiques", en: "Failed to load statistics" })}
            onRetry={fetchStats}
            retryLabel={bi({ fr: "Réessayer", en: "Retry" })}
            dark={dark}
          />
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metricsCards.map((m) => {
          const pct = isUnlimited(m.max) ? 0 : m.max > 0 ? Math.min((m.value / m.max) * 100, 100) : 0;
          return (
            <Card key={m.label} className={`rounded-xl border ${dark ? "bg-gray-900 border-white/5" : "border-gray-100"}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-medium ${dark ? "text-white/40" : "text-gray-500"}`}>{m.label}</span>
                  <m.icon className="w-4 h-4" style={{ color: m.color }} />
                </div>
                <p className={`text-2xl font-bold ${dark ? "text-white" : "text-gray-900"}`} style={HDR_FONT}>
                  {loading ? "—" : formatNum(m.value)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${dark ? "bg-white/5" : "bg-gray-100"}`}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: isUnlimited(m.max) ? "5%" : `${pct}%`,
                        background: pct > 90 ? "#EF4444" : pct > 70 ? "#F59E0B" : m.color,
                      }}
                    />
                  </div>
                  <span className={`text-[10px] ${dark ? "text-white/30" : "text-gray-400"}`}>
                    {isUnlimited(m.max) ? bi(clientI18n.unlimited) : formatNum(m.max)}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick actions + Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick actions */}
        <div>
          <h3 className={`text-sm font-semibold mb-3 ${dark ? "text-white" : "text-gray-900"}`}>
            {bi(clientI18n.quickActions)}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {quickActions.map((a) => (
              <button
                key={a.path}
                onClick={() => navigate(a.path)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-left text-sm font-medium transition-colors ${
                  dark
                    ? "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                    : "bg-white border border-gray-100 text-gray-700 hover:border-gray-200 hover:shadow-sm"
                }`}
              >
                <a.icon className="w-4 h-4 shrink-0" style={{ color: C.green }} />
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div>
          <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${dark ? "text-white" : "text-gray-900"}`}>
            <TrendingUp className="w-4 h-4" style={{ color: C.green }} />
            {bi(clientI18n.recentActivity)}
          </h3>
          <div className={`rounded-xl p-4 space-y-3 ${dark ? "bg-white/5" : "bg-white border border-gray-100"}`}>
            {!stats?.recentActivity?.length ? (
              <p className={`text-xs text-center py-4 ${dark ? "text-white/30" : "text-gray-400"}`}>
                {bi(clientI18n.noResults)}
              </p>
            ) : (
              stats.recentActivity.slice(0, 5).map((a, i) => (
                <div key={i} className={`flex items-center justify-between text-xs ${dark ? "text-white/50" : "text-gray-500"}`}>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: C.green }} />
                    <span className={dark ? "text-white/70" : "text-gray-700"}>{a.action}</span>
                    {a.resource_type && (
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 rounded-full">
                        {a.resource_type}
                      </Badge>
                    )}
                  </div>
                  <span>{new Date(a.date).toLocaleDateString(lang === "fr" ? "fr-CA" : "en-CA")}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
