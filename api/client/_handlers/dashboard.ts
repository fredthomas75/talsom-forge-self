import type { VercelRequest, VercelResponse } from "@vercel/node";
import { authenticateClient } from "../../_lib/client-auth.js";
import { getSupabaseAdmin } from "../../_lib/supabase-server.js";
import { handleCors } from "../../_lib/cors.js";

// GET /api/client/dashboard
// Returns aggregated stats for the client dashboard

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res, "GET, OPTIONS")) return;
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const ctx = await authenticateClient(req);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });

  const supabase = getSupabaseAdmin();

  // Run queries in parallel
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [usageResult, teamResult, convosResult, activityResult] = await Promise.all([
    // API calls + tokens this month from usage_logs
    supabase
      .from("usage_logs")
      .select("tokens_used")
      .eq("tenant_id", ctx.tenantId)
      .gte("created_at", startOfMonth.toISOString()),

    // Team member count
    supabase
      .from("tenant_members")
      .select("id", { count: "exact", head: true })
      .eq("tenant_id", ctx.tenantId),

    // Conversation count
    supabase
      .from("chat_conversations")
      .select("id", { count: "exact", head: true })
      .eq("tenant_id", ctx.tenantId),

    // Recent audit log entries
    supabase
      .from("audit_logs")
      .select("action, resource_type, created_at")
      .eq("tenant_id", ctx.tenantId)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  // Aggregate usage
  const usageLogs = usageResult.data ?? [];
  const apiCalls = usageLogs.length;
  const tokensUsed = usageLogs.reduce((sum, r) => sum + (r.tokens_used ?? 0), 0);

  return res.status(200).json({
    apiCalls,
    tokensUsed,
    conversations: convosResult.count ?? 0,
    teamMembers: teamResult.count ?? 1,
    recentActivity: (activityResult.data ?? []).map((a) => ({
      action: a.action,
      resource_type: a.resource_type,
      date: a.created_at,
    })),
  });
}
