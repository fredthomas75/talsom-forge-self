import type { VercelRequest, VercelResponse } from "@vercel/node";
import { authenticateClient } from "../../_lib/client-auth.js";
import { getSupabaseAdmin } from "../../_lib/supabase-server.js";

// GET /api/client/usage?range=7d|30d|90d

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const ctx = await authenticateClient(req);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });

  const range = (req.query.range as string) || "30d";
  const days = range === "7d" ? 7 : range === "90d" ? 90 : 30;

  const since = new Date();
  since.setDate(since.getDate() - days);

  const supabase = getSupabaseAdmin();

  const { data: logs } = await supabase
    .from("usage_logs")
    .select("endpoint, tokens_used, created_at")
    .eq("tenant_id", ctx.tenantId)
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: true });

  const entries = logs ?? [];

  // Aggregate
  const apiCalls = entries.length;
  const tokensUsed = entries.reduce((sum, r) => sum + (r.tokens_used ?? 0), 0);

  // Daily breakdown
  const dailyMap: Record<string, { calls: number; tokens: number }> = {};
  for (const e of entries) {
    const day = e.created_at.slice(0, 10);
    if (!dailyMap[day]) dailyMap[day] = { calls: 0, tokens: 0 };
    dailyMap[day].calls++;
    dailyMap[day].tokens += e.tokens_used ?? 0;
  }
  const daily = Object.entries(dailyMap).map(([date, v]) => ({ date, ...v }));

  // By endpoint
  const endpointMap: Record<string, number> = {};
  for (const e of entries) {
    endpointMap[e.endpoint] = (endpointMap[e.endpoint] ?? 0) + 1;
  }
  const byEndpoint = Object.entries(endpointMap)
    .map(([endpoint, count]) => ({ endpoint, count }))
    .sort((a, b) => b.count - a.count);

  return res.status(200).json({ apiCalls, tokensUsed, daily, byEndpoint });
}
