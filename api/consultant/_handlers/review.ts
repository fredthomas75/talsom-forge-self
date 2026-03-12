import type { VercelRequest, VercelResponse } from "@vercel/node";
import { authenticateConsultant } from "../../_lib/consultant-auth.js";
import { getSupabaseAdmin } from "../../_lib/supabase-server.js";
import { logAudit, ACTIONS } from "../../_lib/audit.js";
import { handleCors } from "../../_lib/cors.js";

// GET  /api/consultant/reviews/:id — full review detail + conversation messages
// PUT  /api/consultant/reviews/:id — update review (assign, modify, approve, etc.)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res, "GET, PUT, OPTIONS")) return;

  const ctx = await authenticateConsultant(req);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });

  const { id } = req.query;
  if (!id || typeof id !== "string") return res.status(400).json({ error: "Missing review ID" });

  const supabase = getSupabaseAdmin();

  // Fetch the review
  const { data: review, error: fetchErr } = await supabase
    .from("deliverable_reviews")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchErr || !review) return res.status(404).json({ error: "Review not found" });

  if (req.method === "GET") {
    // Fetch conversation messages for context
    const { data: messages } = await supabase
      .from("chat_messages")
      .select("role, content, created_at")
      .eq("conversation_id", review.conversation_id)
      .order("created_at", { ascending: true });

    // Fetch tenant info
    const { data: tenant } = await supabase
      .from("tenants")
      .select("name, plan")
      .eq("id", review.tenant_id)
      .single();

    // Fetch consultant name if assigned
    let consultantName = null;
    if (review.consultant_id) {
      const { data: consultant } = await supabase
        .from("consultants")
        .select("name")
        .eq("id", review.consultant_id)
        .single();
      consultantName = consultant?.name ?? null;
    }

    return res.status(200).json({
      review: {
        ...review,
        consultant_name: consultantName,
      },
      tenant: tenant ?? null,
      messages: messages ?? [],
    });
  }

  if (req.method === "PUT") {
    const body = req.body ?? {};
    const updates: Record<string, unknown> = {};

    // Assign consultant
    if (body.action === "assign") {
      updates.consultant_id = ctx.consultantId;
      updates.status = "in_review";
      updates.assigned_at = new Date().toISOString();

      logAudit({
        tenant_id: review.tenant_id,
        user_id: ctx.userId,
        action: ACTIONS.REVIEW_ASSIGNED,
        resource_type: "review",
        resource_id: id,
        metadata: { consultant: ctx.name },
      }, req);
    }

    // Update content
    if (body.modified_content !== undefined) updates.modified_content = body.modified_content;
    if (body.review_notes !== undefined) updates.review_notes = body.review_notes;
    if (body.client_feedback !== undefined) updates.client_feedback = body.client_feedback;
    if (body.modified_file_url !== undefined) updates.modified_file_url = body.modified_file_url;

    // Status change
    if (body.status && ["in_review", "approved", "needs_revision"].includes(body.status)) {
      updates.status = body.status;
      if (body.status === "approved") {
        updates.reviewed_at = new Date().toISOString();
        logAudit({
          tenant_id: review.tenant_id,
          user_id: ctx.userId,
          action: ACTIONS.REVIEW_APPROVED,
          resource_type: "review",
          resource_id: id,
        }, req);
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No updates provided" });
    }

    const { error: updateErr } = await supabase
      .from("deliverable_reviews")
      .update(updates)
      .eq("id", id);

    if (updateErr) return res.status(500).json({ error: updateErr.message });

    return res.status(200).json({ updated: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
