import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";
import { authenticateClient } from "../../_lib/client-auth.js";
import { getSupabaseAdmin } from "../../_lib/supabase-server.js";
import { logAudit, ACTIONS } from "../../_lib/audit.js";

// POST /api/client/team/invite — create invitation, return copyable link

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ctx = await authenticateClient(req);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });

  // Only owners can invite
  if (ctx.role !== "owner" && ctx.role !== "admin") {
    return res.status(403).json({ error: "Only owners and admins can invite" });
  }

  // Check team quota
  const supabase = getSupabaseAdmin();
  const { count } = await supabase
    .from("tenant_members")
    .select("id", { count: "exact", head: true })
    .eq("tenant_id", ctx.tenantId);

  const maxMembers = ctx.quotas?.max_team_members ?? 1;
  if (maxMembers !== -1 && (count ?? 0) >= maxMembers) {
    return res.status(403).json({ error: "Team member limit reached. Upgrade your plan." });
  }

  const { email, role = "member" } = req.body ?? {};
  if (!email) return res.status(400).json({ error: "Email required" });
  if (!["admin", "member"].includes(role)) return res.status(400).json({ error: "Invalid role" });

  // Generate token
  const token = crypto.randomBytes(32).toString("hex");

  const { error: insertErr } = await supabase.from("tenant_invitations").insert({
    tenant_id: ctx.tenantId,
    email,
    role,
    invited_by: ctx.userId,
    token,
  });

  if (insertErr) {
    console.error("Invite error:", insertErr);
    return res.status(500).json({ error: "Failed to create invitation" });
  }

  logAudit({
    tenant_id: ctx.tenantId,
    user_id: ctx.userId,
    action: ACTIONS.MEMBER_INVITE,
    resource_type: "invitation",
    metadata: { email, role },
  }, req);

  // Build invite link
  const host = req.headers.host ?? "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const link = `${protocol}://${host}/client/signup?invite=${token}`;

  return res.status(201).json({ link, token });
}
