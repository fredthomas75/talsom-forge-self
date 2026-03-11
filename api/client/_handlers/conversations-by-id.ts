import type { VercelRequest, VercelResponse } from "@vercel/node";
import { authenticateClient } from "../../_lib/client-auth.js";
import { getSupabaseAdmin } from "../../_lib/supabase-server.js";
import { logAudit, ACTIONS } from "../../_lib/audit.js";

// GET    /api/client/conversations/[id] — get messages
// DELETE /api/client/conversations/[id] — delete conversation

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();

  const ctx = await authenticateClient(req);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });

  const { id } = req.query;
  if (!id || typeof id !== "string") return res.status(400).json({ error: "Missing conversation ID" });

  const supabase = getSupabaseAdmin();

  // Verify ownership
  const { data: convo } = await supabase
    .from("chat_conversations")
    .select("id, tenant_id, user_id")
    .eq("id", id)
    .eq("tenant_id", ctx.tenantId)
    .eq("user_id", ctx.userId)
    .single();

  if (!convo) return res.status(404).json({ error: "Conversation not found" });

  if (req.method === "GET") {
    const { data: messages, error } = await supabase
      .from("chat_messages")
      .select("role, content, created_at")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ messages: messages ?? [] });
  }

  if (req.method === "DELETE") {
    // Delete messages first, then conversation
    await supabase.from("chat_messages").delete().eq("conversation_id", id);
    await supabase.from("chat_conversations").delete().eq("id", id);

    logAudit({
      tenant_id: ctx.tenantId,
      user_id: ctx.userId,
      action: ACTIONS.CHAT_DELETE,
      resource_type: "conversation",
      resource_id: id,
    }, req);

    return res.status(200).json({ deleted: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
