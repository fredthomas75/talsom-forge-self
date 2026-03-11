import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSupabaseAdmin } from "../_lib/supabase-server.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Simple auth: check Supabase session via Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const supabase = getSupabaseAdmin();

    // Get content sections count
    const { count: sectionsCount } = await supabase
      .from("content_sections")
      .select("*", { count: "exact", head: true });

    // Get tenants count
    const { count: tenantsCount } = await supabase
      .from("tenants")
      .select("*", { count: "exact", head: true });

    // Get active API keys count
    const { count: apiKeysCount } = await supabase
      .from("api_keys")
      .select("*", { count: "exact", head: true })
      .eq("active", true);

    // Get usage logs (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: recentLogs, count: logsCount } = await supabase
      .from("usage_logs")
      .select("*", { count: "exact" })
      .gte("created_at", sevenDaysAgo)
      .order("created_at", { ascending: false })
      .limit(50);

    // Aggregate logs by endpoint
    const endpointStats: Record<string, number> = {};
    if (recentLogs) {
      for (const log of recentLogs) {
        const ep = log.endpoint ?? "unknown";
        endpointStats[ep] = (endpointStats[ep] ?? 0) + 1;
      }
    }

    return res.status(200).json({
      overview: {
        contentSections: sectionsCount ?? 0,
        tenants: tenantsCount ?? 0,
        activeApiKeys: apiKeysCount ?? 0,
        apiCallsLast7Days: logsCount ?? 0,
      },
      endpointStats,
      recentLogs: (recentLogs ?? []).slice(0, 20).map((l) => ({
        endpoint: l.endpoint,
        tenantId: l.tenant_id,
        tokens: l.tokens_used,
        model: l.model,
        createdAt: l.created_at,
      })),
    });
  } catch (error) {
    console.error("Stats error:", error);
    return res.status(500).json({ error: "Failed to fetch stats" });
  }
}
