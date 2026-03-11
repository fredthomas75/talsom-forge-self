import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSupabaseAdmin } from "../../_lib/supabase-server.js";
import { logAudit, ACTIONS } from "../../_lib/audit.js";

// POST /api/client/accept-invite
// Validates an invitation token and creates a tenant_member.

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // 1. Verify JWT
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "Missing token" });

  const supabase = getSupabaseAdmin();
  const { data: { user }, error: userErr } = await supabase.auth.getUser(auth.slice(7));
  if (userErr || !user) return res.status(401).json({ error: "Invalid token" });

  // 2. Validate invitation token
  const { token } = req.body ?? {};
  if (!token) return res.status(400).json({ error: "Missing invitation token" });

  const { data: invite, error: inviteErr } = await supabase
    .from("tenant_invitations")
    .select("*")
    .eq("token", token)
    .is("accepted_at", null)
    .single();

  if (inviteErr || !invite) {
    return res.status(404).json({ error: "Invitation not found or already used" });
  }

  // 3. Check expiry
  if (new Date(invite.expires_at) < new Date()) {
    return res.status(410).json({ error: "Invitation has expired" });
  }

  // 4. Check user not already a member
  const { data: existing } = await supabase
    .from("tenant_members")
    .select("id")
    .eq("tenant_id", invite.tenant_id)
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (existing) {
    return res.status(409).json({ error: "Already a member of this team" });
  }

  // 5. Create tenant_member
  const { error: memberErr } = await supabase
    .from("tenant_members")
    .insert({
      tenant_id: invite.tenant_id,
      user_id: user.id,
      role: invite.role,
      invited_by: invite.invited_by,
      invited_at: invite.created_at,
    });

  if (memberErr) {
    console.error("[accept-invite] member creation failed:", memberErr);
    return res.status(500).json({ error: "Failed to join team" });
  }

  // 6. Mark invitation as accepted
  await supabase
    .from("tenant_invitations")
    .update({ accepted_at: new Date().toISOString() })
    .eq("id", invite.id);

  // 7. Audit log
  logAudit({
    tenant_id: invite.tenant_id,
    user_id: user.id,
    action: ACTIONS.MEMBER_ACCEPT,
    resource_type: "invitation",
    resource_id: invite.id,
    metadata: { role: invite.role, invited_by: invite.invited_by },
  }, req);

  // 8. Get tenant name
  const { data: tenant } = await supabase
    .from("tenants")
    .select("name, plan")
    .eq("id", invite.tenant_id)
    .single();

  return res.status(200).json({
    tenantId: invite.tenant_id,
    tenantName: tenant?.name ?? "Team",
    plan: tenant?.plan ?? "free",
    role: invite.role,
  });
}
