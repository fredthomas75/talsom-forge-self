import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Cpu, ArrowDownToLine, ArrowUpFromLine, Loader2, Coins } from "lucide-react";
import { C, HDR_FONT } from "@/lib/constants";
import { useLang, useTheme } from "@/lib/contexts";
import { useClient } from "../contexts/ClientContext";
import { clientI18n } from "../i18n";

interface UsageData {
  apiCalls: number;
  tokensUsed: number;
  inputTokens: number;
  outputTokens: number;
  daily: { date: string; calls: number; tokens: number; input: number; output: number }[];
  byEndpoint: { endpoint: string; count: number; tokens: number }[];
}

export function UsagePage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const { session, quotas } = useClient();
  const bi = (v: { fr: string; en: string }) => (lang === "fr" ? v.fr : v.en);

  const [data, setData] = useState<UsageData | null>(null);
  const [range, setRange] = useState<"7d" | "30d" | "90d">("30d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/client/usage?range=${range}`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [range, session.access_token]);

  const formatNum = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toString();
  };

  const isUnlimited = (n: number) => n === -1;

  // Simple SVG bar chart
  const renderChart = () => {
    if (!data?.daily?.length) return null;
    const maxCalls = Math.max(...data.daily.map((d) => d.calls), 1);
    const barW = Math.max(6, Math.floor(500 / data.daily.length) - 2);

    return (
      <svg viewBox={`0 0 ${data.daily.length * (barW + 2)} 120`} className="w-full h-32">
        {data.daily.map((d, i) => {
          const h = (d.calls / maxCalls) * 100;
          return (
            <g key={i}>
              <rect
                x={i * (barW + 2)}
                y={110 - h}
                width={barW}
                height={h}
                rx={2}
                fill={C.green}
                opacity={0.7}
              />
              {i % Math.ceil(data.daily.length / 7) === 0 && (
                <text
                  x={i * (barW + 2) + barW / 2}
                  y={118}
                  textAnchor="middle"
                  fontSize="6"
                  fill={dark ? "rgba(255,255,255,0.3)" : "#999"}
                >
                  {d.date.slice(5)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${dark ? "text-white" : ""}`} style={{ ...HDR_FONT, color: dark ? undefined : C.green }}>
            {bi(clientI18n.usage)}
          </h1>
          <p className={`text-sm mt-1 ${dark ? "text-white/40" : "text-gray-500"}`}>
            {bi(clientI18n.thisMonth)}
          </p>
        </div>
        <div className="flex gap-1">
          {(["7d", "30d", "90d"] as const).map((r) => (
            <Button
              key={r}
              variant={range === r ? "default" : "ghost"}
              size="sm"
              onClick={() => setRange(r)}
              className="text-xs rounded-full px-3"
              style={range === r ? { background: C.green, color: "white" } : undefined}
            >
              {r}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className={`w-5 h-5 animate-spin ${dark ? "text-white/30" : "text-gray-400"}`} />
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {[
              { label: bi(clientI18n.apiCalls), value: data?.apiCalls ?? 0, max: quotas?.max_api_calls_per_month ?? 0, icon: Activity, showBar: true },
              { label: bi(clientI18n.tokensUsed), value: data?.tokensUsed ?? 0, max: quotas?.max_tokens_per_month ?? 0, icon: Cpu, showBar: true },
              { label: bi({ fr: "Crédits consulting", en: "Consulting Credits" }), value: quotas?.consulting_credits_per_month ? (quotas.consulting_credits_per_month === -1 ? 0 : 0) : 0, max: quotas?.consulting_credits_per_month ?? 0, icon: Coins, showBar: true },
              { label: bi({ fr: "Tokens entrée", en: "Input Tokens" }), value: data?.inputTokens ?? 0, max: 0, icon: ArrowDownToLine, showBar: false },
              { label: bi({ fr: "Tokens sortie", en: "Output Tokens" }), value: data?.outputTokens ?? 0, max: 0, icon: ArrowUpFromLine, showBar: false },
            ].map((m) => {
              const pct = isUnlimited(m.max) ? 0 : m.max > 0 ? Math.min((m.value / m.max) * 100, 100) : 0;
              return (
                <Card key={m.label} className={`rounded-xl border ${dark ? "bg-gray-900 border-white/5" : "border-gray-100"}`}>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <m.icon className="w-4 h-4" style={{ color: C.green }} />
                      <span className={`text-xs font-medium ${dark ? "text-white/40" : "text-gray-500"}`}>{m.label}</span>
                    </div>
                    <p className={`text-3xl font-bold mb-2 ${dark ? "text-white" : "text-gray-900"}`} style={HDR_FONT}>
                      {formatNum(m.value)}
                    </p>
                    {m.showBar && (
                      <>
                        <div className={`h-2 rounded-full overflow-hidden mb-1 ${dark ? "bg-white/5" : "bg-gray-100"}`}>
                          <div className="h-full rounded-full transition-all" style={{ width: isUnlimited(m.max) ? "3%" : `${pct}%`, background: pct > 90 ? "#EF4444" : C.green }} />
                        </div>
                        <p className={`text-[10px] ${dark ? "text-white/20" : "text-gray-400"}`}>
                          {bi(clientI18n.of)} {isUnlimited(m.max) ? bi(clientI18n.unlimited) : formatNum(m.max)}
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Chart */}
          <Card className={`rounded-xl border mb-6 ${dark ? "bg-gray-900 border-white/5" : "border-gray-100"}`}>
            <CardContent className="p-5">
              <h3 className={`text-sm font-semibold mb-4 ${dark ? "text-white" : "text-gray-900"}`}>
                {bi({ fr: "Appels API par jour", en: "API Calls per Day" })}
              </h3>
              {renderChart() || (
                <p className={`text-xs text-center py-8 ${dark ? "text-white/20" : "text-gray-400"}`}>
                  {bi(clientI18n.noResults)}
                </p>
              )}
            </CardContent>
          </Card>

          {/* By endpoint */}
          {data?.byEndpoint && data.byEndpoint.length > 0 && (
            <Card className={`rounded-xl border ${dark ? "bg-gray-900 border-white/5" : "border-gray-100"}`}>
              <CardContent className="p-5">
                <h3 className={`text-sm font-semibold mb-3 ${dark ? "text-white" : "text-gray-900"}`}>
                  {bi({ fr: "Par endpoint", en: "By endpoint" })}
                </h3>
                <div className="space-y-2">
                  {data.byEndpoint.map((e) => (
                    <div key={e.endpoint} className="flex items-center justify-between gap-3">
                      <code className={`text-xs font-mono ${dark ? "text-white/50" : "text-gray-600"}`}>{e.endpoint}</code>
                      <div className="flex items-center gap-2 shrink-0">
                        {e.tokens > 0 && (
                          <span className={`text-[10px] ${dark ? "text-white/30" : "text-gray-400"}`}>
                            {formatNum(e.tokens)} tokens
                          </span>
                        )}
                        <Badge variant="outline" className="text-xs rounded-full">{e.count}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
