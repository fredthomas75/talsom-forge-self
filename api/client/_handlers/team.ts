import type { VercelRequest, VercelResponse } from "@vercel/node";
import { authenticateClient } from "../../_lib/client-auth.js";
import { getSupabaseAdmin } from "../../_lib/supabase-server.js";

// GET /api/client/team — list members + pending invitations

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const ctx = await authenticateClient(req);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });

  const supabase = getSupabaseAdmin();

  const [membersResult, invitationsResult] = await Promise.all([
    supabase
      .from("tenant_members")
      .select("id, user_id, role, accepted_at")
      .eq("tenant_id", ctx.tenantId)
      .order("accepted_at", { ascending: true }),
    supabase
      .from("tenant_invitations")
      .select("id, email, role, expires_at, token")
      .eq("tenant_id", ctx.tenantId)
      .is("accepted_at", null)
      .order("created_at", { ascending: false }),
  ]);

  return res.status(200).json({
    members: membersResult.data ?? [],
    invitations: invitationsResult.data ?? [],
  });
}
