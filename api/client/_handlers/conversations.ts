import type { VercelRequest, VercelResponse } from "@vercel/node";
import { authenticateClient } from "../../_lib/client-auth.js";
import { getSupabaseAdmin } from "../../_lib/supabase-server.js";

// GET  /api/client/conversations — list conversations
// Uses query param ?id=xxx for single conversation detail

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();

  const ctx = await authenticateClient(req);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });

  const supabase = getSupabaseAdmin();

  // GET: List conversations
  // Optional ?tool=get_services to filter by tool name
  if (req.method === "GET") {
    const toolFilter = req.query.tool as string | undefined;

    let query = supabase
      .from("chat_conversations")
      .select("id, title, tool_name, updated_at")
      .eq("tenant_id", ctx.tenantId)
      .eq("user_id", ctx.userId)
      .order("updated_at", { ascending: false })
      .limit(50);

    if (toolFilter) {
      query = query.eq("tool_name", toolFilter);
    }

    const { data, error } = await query;

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ conversations: data ?? [] });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
