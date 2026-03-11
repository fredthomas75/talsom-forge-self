import type { VercelRequest, VercelResponse } from "@vercel/node";
import { authenticateClient } from "../../_lib/client-auth.js";
import { getSupabaseAdmin } from "../../_lib/supabase-server.js";
import { logAudit, ACTIONS } from "../../_lib/audit.js";

// POST /api/client/billing/checkout — creates Stripe Checkout Session

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ctx = await authenticateClient(req);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });
  if (ctx.role !== "owner") return res.status(403).json({ error: "Only owners can manage billing" });

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: "Stripe not configured" });
  }

  const { plan } = req.body ?? {};
  if (!plan) return res.status(400).json({ error: "Plan required" });

  // Map plan to Stripe price ID
  const priceMap: Record<string, string | undefined> = {
    starter: process.env.STRIPE_PRICE_STARTER,
    pro: process.env.STRIPE_PRICE_PRO,
    enterprise: process.env.STRIPE_PRICE_ENTERPRISE,
  };

  const priceId = priceMap[plan];
  if (!priceId) return res.status(400).json({ error: "Invalid plan or price not configured" });

  try {
    const stripe = (await import("stripe")).default;
    const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY);

    // Get or create Stripe customer
    const supabase = getSupabaseAdmin();
    const { data: tenant } = await supabase
      .from("tenants")
      .select("stripe_customer_id")
      .eq("id", ctx.tenantId)
      .single();

    let customerId = tenant?.stripe_customer_id;
    if (!customerId) {
      const customer = await stripeClient.customers.create({
        email: ctx.email,
        metadata: { tenant_id: ctx.tenantId },
      });
      customerId = customer.id;
      await supabase.from("tenants").update({ stripe_customer_id: customerId }).eq("id", ctx.tenantId);
    }

    const host = req.headers.host ?? "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";

    const session = await stripeClient.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${protocol}://${host}/client/settings?billing=success`,
      cancel_url: `${protocol}://${host}/client/settings?billing=cancelled`,
      metadata: { tenant_id: ctx.tenantId, plan },
    });

    logAudit({
      tenant_id: ctx.tenantId,
      user_id: ctx.userId,
      action: ACTIONS.CHECKOUT_START,
      resource_type: "billing",
      metadata: { plan, session_id: session.id },
    }, req);

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return res.status(500).json({ error: "Failed to create checkout session" });
  }
}
