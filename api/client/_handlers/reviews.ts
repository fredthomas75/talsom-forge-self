import type { VercelRequest, VercelResponse } from "@vercel/node";
import { authenticateClient, hasFeature } from "../../_lib/client-auth.js";
import { getSupabaseAdmin } from "../../_lib/supabase-server.js";
import { logAudit, ACTIONS } from "../../_lib/audit.js";

// POST /api/client/reviews    — request a new review
// GET  /api/client/reviews    — list my reviews (?conversation=xxx)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();

  const ctx = await authenticateClient(req);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });

  const supabase = getSupabaseAdmin();

  if (req.method === "POST") {
    // Check feature access
    if (!hasFeature(ctx, "human_review")) {
      return res.status(403).json({ error: "Human review not available on your plan" });
    }

    const { conversationId, toolName, originalContent, originalFileUrl } = req.body ?? {};

    if (!conversationId || !toolName) {
      return res.status(400).json({ error: "Missing conversationId or toolName" });
    }

    // Verify conversation belongs to this user/tenant
    const { data: convo } = await supabase
      .from("chat_conversations")
      .select("id")
      .eq("id", conversationId)
      .eq("tenant_id", ctx.tenantId)
      .eq("user_id", ctx.userId)
      .single();

    if (!convo) return res.status(404).json({ error: "Conversation not found" });

    // Check for existing review on this conversation
    const { data: existing } = await supabase
      .from("deliverable_reviews")
      .select("id, status")
      .eq("conversation_id", conversationId)
      .limit(1)
      .single();

    if (existing) {
      return res.status(409).json({ error: "Review already exists", reviewId: existing.id, status: existing.status });
    }

    // Get pricing
    const { data: config } = await supabase
      .from("review_config")
      .select("value")
      .eq("key", "pricing")
      .single();

    const pricing = config?.value as { default_price_cents: number; currency: string; enterprise_included: boolean } | null;
    const priceCents = pricing?.default_price_cents ?? 14900;
    const currency = pricing?.currency ?? "cad";
    const paymentStatus = ctx.plan === "enterprise" && pricing?.enterprise_included ? "included" : "pending";

    // Create review
    const { data: review, error: insertErr } = await supabase
      .from("deliverable_reviews")
      .insert({
        conversation_id: conversationId,
        tenant_id: ctx.tenantId,
        user_id: ctx.userId,
        tool_name: toolName,
        original_content: originalContent ?? null,
        original_file_url: originalFileUrl ?? null,
        price_cents: priceCents,
        currency,
        payment_status: paymentStatus,
      })
      .select("id, status, requested_at")
      .single();

    if (insertErr) return res.status(500).json({ error: insertErr.message });

    logAudit({
      tenant_id: ctx.tenantId,
      user_id: ctx.userId,
      action: ACTIONS.REVIEW_REQUESTED,
      resource_type: "review",
      resource_id: review!.id,
      metadata: { toolName, priceCents, paymentStatus },
    }, req);

    return res.status(201).json({ review });
  }

  if (req.method === "GET") {
    const conversationId = req.query.conversation as string | undefined;
    const toolFilter = req.query.tool as string | undefined;
    const statusFilter = req.query.status as string | undefined;

    let query = supabase
      .from("deliverable_reviews")
      .select("id, conversation_id, tool_name, status, consultant_id, client_feedback, modified_content, modified_file_url, original_file_url, requested_at, delivered_at, price_cents, payment_status")
      .eq("tenant_id", ctx.tenantId)
      .eq("user_id", ctx.userId)
      .order("requested_at", { ascending: false });

    if (conversationId) query = query.eq("conversation_id", conversationId);
    if (toolFilter) query = query.eq("tool_name", toolFilter);
    if (statusFilter) query = query.eq("status", statusFilter);

    const { data: reviews, error } = await query.limit(50);
    if (error) return res.status(500).json({ error: error.message });

    // Enrich with consultant names for delivered reviews
    const consultantIds = [...new Set((reviews ?? []).filter((r) => r.consultant_id).map((r) => r.consultant_id!))];
    let consultantMap: Record<string, string> = {};
    if (consultantIds.length > 0) {
      const { data: consultants } = await supabase
        .from("consultants")
        .select("id, name")
        .in("id", consultantIds);
      consultantMap = Object.fromEntries((consultants ?? []).map((c) => [c.id, c.name]));
    }

    const enriched = (reviews ?? []).map((r) => ({
      ...r,
      consultant_name: r.consultant_id ? consultantMap[r.consultant_id] ?? null : null,
    }));

    return res.status(200).json({ reviews: enriched });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
