import type { VercelRequest, VercelResponse } from "@vercel/node";
import { authenticateConsultant } from "../../_lib/consultant-auth.js";
import { getSupabaseAdmin } from "../../_lib/supabase-server.js";
import { handleCors } from "../../_lib/cors.js";

// GET /api/consultant/dashboard — aggregate stats

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res, "GET, OPTIONS")) return;

  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const ctx = await authenticateConsultant(req);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });

  const supabase = getSupabaseAdmin();

  // Get all reviews for stats
  const { data: reviews } = await supabase
    .from("deliverable_reviews")
    .select("id, status, consultant_id, requested_at, delivered_at");

  const all = reviews ?? [];

  // Counts
  const pending = all.filter((r) => r.status === "pending").length;
  const myActive = all.filter(
    (r) => r.consultant_id === ctx.consultantId && ["in_review", "approved", "needs_revision"].includes(r.status)
  ).length;

  // Completed this month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const completedThisMonth = all.filter(
    (r) => r.status === "delivered" && r.delivered_at && r.delivered_at >= startOfMonth
  ).length;

  // Average turnaround (hours) for delivered reviews
  const delivered = all.filter((r) => r.status === "delivered" && r.delivered_at && r.requested_at);
  let avgHours = 0;
  if (delivered.length > 0) {
    const totalMs = delivered.reduce((sum, r) => {
      return sum + (new Date(r.delivered_at!).getTime() - new Date(r.requested_at!).getTime());
    }, 0);
    avgHours = Math.round(totalMs / delivered.length / (1000 * 60 * 60));
  }

  // SLA compliance (delivered within 48h target)
  const slaTarget = 48 * 60 * 60 * 1000; // 48 hours in ms
  const withinSla = delivered.filter((r) => {
    const diff = new Date(r.delivered_at!).getTime() - new Date(r.requested_at!).getTime();
    return diff <= slaTarget;
  }).length;
  const slaPercent = delivered.length > 0 ? Math.round((withinSla / delivered.length) * 100) : 100;

  return res.status(200).json({
    pending,
    myActive,
    completedThisMonth,
    avgHours,
    slaPercent,
    totalDelivered: delivered.length,
  });
}
