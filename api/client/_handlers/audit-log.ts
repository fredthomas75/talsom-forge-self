import type { VercelRequest, VercelResponse } from "@vercel/node";
import { authenticateClient } from "../../_lib/client-auth.js";
import { getSupabaseAdmin } from "../../_lib/supabase-server.js";
import { handleCors } from "../../_lib/cors.js";

// GET /api/client/audit-log?limit=20&offset=0&action=

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res, "GET, OPTIONS")) return;
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const ctx = await authenticateClient(req);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });

  // Check audit feature
  if (ctx.quotas?.features?.audit_log === false) {
    return res.status(403).json({ error: "Audit log not available on your plan" });
  }

  const limit = Math.min(parseInt((req.query.limit as string) || "20"), 100);
  const offset = parseInt((req.query.offset as string) || "0");
  const actionFilter = req.query.action as string;

  const supabase = getSupabaseAdmin();

  try {
    let query = supabase
      .from("audit_logs")
      .select("id, action, resource_type, resource_id, user_id, ip_address, metadata, created_at")
      .eq("tenant_id", ctx.tenantId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (actionFilter) {
      query = query.ilike("action", `%${actionFilter}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[audit-log] query error:", error.message, error.details, error.hint);
      // If table doesn't exist, provide a clear message
      if (error.message?.includes("relation") && error.message?.includes("does not exist")) {
        return res.status(500).json({
          error: "Audit log table not found. Please run the database migration.",
          details: error.message,
        });
      }
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      entries: data ?? [],
      total: data?.length ?? 0,
      offset,
      limit,
    });
  } catch (err) {
    console.error("[audit-log] unexpected error:", err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : "Unknown server error",
    });
  }
}
