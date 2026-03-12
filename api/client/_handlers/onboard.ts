import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSupabaseAdmin } from "../../_lib/supabase-server.js";
import { logAudit, ACTIONS } from "../../_lib/audit.js";
import { handleCors } from "../../_lib/cors.js";

// POST /api/client/onboard
// Creates a new tenant + tenant_member(owner) after signup.
// Optionally creates a Stripe customer if STRIPE_SECRET_KEY is set.

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res, "POST, OPTIONS")) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // 1. Verify JWT
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "Missing token" });

  const supabase = getSupabaseAdmin();
  const { data: { user }, error: userErr } = await supabase.auth.getUser(auth.slice(7));
  if (userErr || !user) return res.status(401).json({ error: "Invalid token" });

  // 2. Check not already onboarded
  const { data: existing } = await supabase
    .from("tenant_members")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (existing) return res.status(409).json({ error: "Already onboarded" });

  // 3. Create tenant
  const { name, company } = req.body ?? {};
  const tenantName = company || name || user.email?.split("@")[0] || "My Company";

  const { data: tenant, error: tenantErr } = await supabase
    .from("tenants")
    .insert({
      name: tenantName,
      plan: "free",
      billing_email: user.email,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (tenantErr || !tenant) {
    console.error("[onboard] tenant creation failed:", tenantErr);
    return res.status(500).json({ error: "Failed to create tenant" });
  }

  // 4. Create tenant_member(owner)
  const { error: memberErr } = await supabase
    .from("tenant_members")
    .insert({
      tenant_id: tenant.id,
      user_id: user.id,
      role: "owner",
    });

  if (memberErr) {
    console.error("[onboard] member creation failed:", memberErr);
    return res.status(500).json({ error: "Failed to create membership" });
  }

  // 5. Optional: Create Stripe customer
  let stripeCustomerId: string | null = null;
  if (process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = (await import("stripe")).default;
      const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY);
      const customer = await stripeClient.customers.create({
        email: user.email ?? undefined,
        name: tenantName,
        metadata: { tenant_id: tenant.id },
      });
      stripeCustomerId = customer.id;

      await supabase
        .from("tenants")
        .update({ stripe_customer_id: customer.id })
        .eq("id", tenant.id);
    } catch (err) {
      console.error("[onboard] Stripe customer creation failed:", err);
      // Non-blocking: continue without Stripe
    }
  }

  // 6. Audit log
  logAudit({
    tenant_id: tenant.id,
    user_id: user.id,
    action: ACTIONS.SIGNUP,
    resource_type: "tenant",
    resource_id: tenant.id,
    metadata: { company: tenantName, stripe_customer_id: stripeCustomerId },
  }, req);

  return res.status(201).json({
    tenantId: tenant.id,
    tenantName,
    plan: "free",
    role: "owner",
  });
}
