import type { VercelRequest, VercelResponse } from "@vercel/node";
import { authenticateConsultant } from "../../_lib/consultant-auth.js";
import { getSupabaseAdmin } from "../../_lib/supabase-server.js";
import { logAudit, ACTIONS } from "../../_lib/audit.js";
import { handleCors } from "../../_lib/cors.js";

// POST /api/consultant/reviews/:id/deliver — mark as delivered

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res, "POST, OPTIONS")) return;

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ctx = await authenticateConsultant(req);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });

  const { id } = req.query;
  if (!id || typeof id !== "string") return res.status(400).json({ error: "Missing review ID" });

  const supabase = getSupabaseAdmin();

  // Verify the review exists and is assigned to this consultant
  const { data: review } = await supabase
    .from("deliverable_reviews")
    .select("id, tenant_id, consultant_id, status")
    .eq("id", id)
    .single();

  if (!review) return res.status(404).json({ error: "Review not found" });

  if (review.consultant_id !== ctx.consultantId) {
    return res.status(403).json({ error: "Not assigned to you" });
  }

  if (!["in_review", "approved"].includes(review.status)) {
    return res.status(400).json({ error: "Review must be in_review or approved before delivery" });
  }

  const now = new Date().toISOString();

  const { error: updateErr } = await supabase
    .from("deliverable_reviews")
    .update({
      status: "delivered",
      delivered_at: now,
      reviewed_at: review.status !== "approved" ? now : undefined,
    })
    .eq("id", id);

  if (updateErr) return res.status(500).json({ error: updateErr.message });

  logAudit({
    tenant_id: review.tenant_id,
    user_id: ctx.userId,
    action: ACTIONS.REVIEW_DELIVERED,
    resource_type: "review",
    resource_id: id,
    metadata: { consultant: ctx.name },
  }, req);

  return res.status(200).json({ delivered: true });
}
