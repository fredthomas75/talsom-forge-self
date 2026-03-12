import type { VercelRequest, VercelResponse } from "@vercel/node";
import { authenticateClient } from "../../_lib/client-auth.js";
import { getSupabaseAdmin } from "../../_lib/supabase-server.js";
import { logAudit, ACTIONS } from "../../_lib/audit.js";
import { handleCors } from "../../_lib/cors.js";

// PATCH  /api/client/team/[id] — change role
// DELETE /api/client/team/[id] — remove member

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res, "PATCH, DELETE, OPTIONS")) return;

  const ctx = await authenticateClient(req);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });
  if (ctx.role !== "owner") return res.status(403).json({ error: "Only owners can manage team" });

  const { id } = req.query;
  if (!id || typeof id !== "string") return res.status(400).json({ error: "Missing member ID" });

  const supabase = getSupabaseAdmin();

  // Verify member belongs to tenant
  const { data: member } = await supabase
    .from("tenant_members")
    .select("id, user_id, role")
    .eq("id", id)
    .eq("tenant_id", ctx.tenantId)
    .single();

  if (!member) return res.status(404).json({ error: "Member not found" });

  // Cannot modify self
  if (member.user_id === ctx.userId) {
    return res.status(400).json({ error: "Cannot modify your own membership" });
  }

  if (req.method === "PATCH") {
    const { role } = req.body ?? {};
    if (!role || !["admin", "member"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    await supabase.from("tenant_members").update({ role }).eq("id", id);

    logAudit({
      tenant_id: ctx.tenantId,
      user_id: ctx.userId,
      action: ACTIONS.MEMBER_ROLE_CHANGE,
      resource_type: "member",
      resource_id: id,
      metadata: { old_role: member.role, new_role: role },
    }, req);

    return res.status(200).json({ updated: true });
  }

  if (req.method === "DELETE") {
    await supabase.from("tenant_members").delete().eq("id", id);

    logAudit({
      tenant_id: ctx.tenantId,
      user_id: ctx.userId,
      action: ACTIONS.MEMBER_REMOVE,
      resource_type: "member",
      resource_id: id,
    }, req);

    return res.status(200).json({ deleted: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
