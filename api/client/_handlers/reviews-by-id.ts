import type { VercelRequest, VercelResponse } from "@vercel/node";
import { authenticateClient } from "../../_lib/client-auth.js";
import { getSupabaseAdmin } from "../../_lib/supabase-server.js";

// GET /api/client/reviews/:id — review detail (client view)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const ctx = await authenticateClient(req);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });

  const { id } = req.query;
  if (!id || typeof id !== "string") return res.status(400).json({ error: "Missing review ID" });

  const supabase = getSupabaseAdmin();

  const { data: review } = await supabase
    .from("deliverable_reviews")
    .select("id, conversation_id, tool_name, status, consultant_id, client_feedback, modified_content, modified_file_url, requested_at, delivered_at, price_cents, currency, payment_status")
    .eq("id", id)
    .eq("tenant_id", ctx.tenantId)
    .eq("user_id", ctx.userId)
    .single();

  if (!review) return res.status(404).json({ error: "Review not found" });

  // Get consultant name
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
  });
}
