import type { VercelRequest, VercelResponse } from "@vercel/node";
import { authenticateClient } from "../../_lib/client-auth.js";
import { getSupabaseAdmin } from "../../_lib/supabase-server.js";
import { logAudit, ACTIONS } from "../../_lib/audit.js";
import { handleCors } from "../../_lib/cors.js";

// DELETE /api/client/keys/[id] — revoke an API key

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res, "DELETE, OPTIONS")) return;
  if (req.method !== "DELETE") return res.status(405).json({ error: "Method not allowed" });

  const ctx = await authenticateClient(req);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });

  // Only owners and admins
  if (ctx.role === "member") {
    return res.status(403).json({ error: "Only owners and admins can revoke API keys" });
  }

  const { id } = req.query;
  if (!id || typeof id !== "string") return res.status(400).json({ error: "Missing key ID" });

  const supabase = getSupabaseAdmin();

  // Verify ownership
  const { data: key } = await supabase
    .from("api_keys")
    .select("id, key_prefix, tenant_id")
    .eq("id", id)
    .eq("tenant_id", ctx.tenantId)
    .single();

  if (!key) return res.status(404).json({ error: "Key not found" });

  await supabase.from("api_keys").delete().eq("id", id);

  logAudit({
    tenant_id: ctx.tenantId,
    user_id: ctx.userId,
    action: ACTIONS.KEY_REVOKE,
    resource_type: "api_key",
    resource_id: key.key_prefix,
  }, req);

  return res.status(200).json({ deleted: true });
}
