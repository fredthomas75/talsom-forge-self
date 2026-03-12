import type { VercelRequest, VercelResponse } from "@vercel/node";
import { authenticateConsultant } from "../../_lib/consultant-auth.js";
import { getSupabaseAdmin } from "../../_lib/supabase-server.js";
import { handleCors } from "../../_lib/cors.js";

// GET /api/consultant/queue — list reviews with filters

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res, "GET, OPTIONS")) return;

  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const ctx = await authenticateConsultant(req);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });

  const supabase = getSupabaseAdmin();
  const status = req.query.status as string | undefined;
  const tool = req.query.tool as string | undefined;

  // Build query
  let query = supabase
    .from("deliverable_reviews")
    .select("id, conversation_id, tenant_id, user_id, tool_name, status, consultant_id, requested_at, assigned_at, reviewed_at, delivered_at, price_cents, payment_status")
    .order("requested_at", { ascending: true }); // oldest first for SLA

  if (status) query = query.eq("status", status);
  if (tool) query = query.eq("tool_name", tool);

  const { data: reviews, error } = await query.limit(100);
  if (error) return res.status(500).json({ error: error.message });

  // Enrich with tenant names
  const tenantIds = [...new Set((reviews ?? []).map((r) => r.tenant_id))];
  const consultantIds = [...new Set((reviews ?? []).filter((r) => r.consultant_id).map((r) => r.consultant_id!))];

  const [tenantsResult, consultantsResult] = await Promise.all([
    tenantIds.length > 0
      ? supabase.from("tenants").select("id, name").in("id", tenantIds)
      : Promise.resolve({ data: [] }),
    consultantIds.length > 0
      ? supabase.from("consultants").select("id, name").in("id", consultantIds)
      : Promise.resolve({ data: [] }),
  ]);

  const tenantMap = Object.fromEntries((tenantsResult.data ?? []).map((t) => [t.id, t.name]));
  const consultantMap = Object.fromEntries((consultantsResult.data ?? []).map((c) => [c.id, c.name]));

  const enriched = (reviews ?? []).map((r) => ({
    ...r,
    tenant_name: tenantMap[r.tenant_id] ?? "Unknown",
    consultant_name: r.consultant_id ? consultantMap[r.consultant_id] ?? null : null,
  }));

  return res.status(200).json({ reviews: enriched });
}
