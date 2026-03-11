import type { VercelRequest, VercelResponse } from "@vercel/node";
import { authenticateClient } from "../../_lib/client-auth.js";
import { getSupabaseAdmin } from "../../_lib/supabase-server.js";
import { logAudit, ACTIONS } from "../../_lib/audit.js";

// GET /api/client/me
// Returns the full client context: user + tenant + quotas + plan
// If user is authenticated but has no tenant_member, auto-onboards them.

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  // Try normal auth first
  const ctx = await authenticateClient(req);
  if (ctx) {
    // Log portal access (fire-and-forget)
    logAudit({
      tenant_id: ctx.tenantId,
      user_id: ctx.userId,
      action: ACTIONS.LOGIN,
      resource_type: "portal",
      metadata: { plan: ctx.plan, role: ctx.role },
    }, req);

    return res.status(200).json({
      userId: ctx.userId,
      email: ctx.email,
      tenantId: ctx.tenantId,
      tenantName: ctx.tenantName,
      plan: ctx.plan,
      role: ctx.role,
      quotas: ctx.quotas,
    });
  }

  // If auth failed, check if user exists but has no membership (incomplete onboarding)
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });

  const supabase = getSupabaseAdmin();
  const { data: { user }, error: userErr } = await supabase.auth.getUser(auth.slice(7));
  if (userErr || !user) return res.status(401).json({ error: "Unauthorized" });

  // User is valid but no tenant_member → auto-onboard
  const { data: existing } = await supabase
    .from("tenant_members")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (existing) {
    // Membership exists but authenticateClient still failed — something else wrong
    return res.status(500).json({ error: "Authentication error, please try again" });
  }

  // Create tenant + membership automatically
  const companyName = user.user_metadata?.company || user.user_metadata?.name || user.email?.split("@")[0] || "My Company";

  const { data: tenant, error: tenantErr } = await supabase
    .from("tenants")
    .insert({
      name: companyName,
      plan: "free",
      billing_email: user.email,
      created_by: user.id,
    })
    .select("id, name, plan")
    .single();

  if (tenantErr || !tenant) {
    console.error("[me] auto-onboard tenant failed:", tenantErr);
    return res.status(500).json({ error: "Auto-onboarding failed" });
  }

  await supabase.from("tenant_members").insert({
    tenant_id: tenant.id,
    user_id: user.id,
    role: "owner",
  });

  // Fetch quotas for the plan
  const { data: quotas } = await supabase
    .from("plan_quotas")
    .select("*")
    .eq("plan", tenant.plan)
    .single();

  return res.status(200).json({
    userId: user.id,
    email: user.email,
    tenantId: tenant.id,
    tenantName: tenant.name,
    plan: tenant.plan,
    role: "owner",
    quotas: quotas ?? null,
  });
}
