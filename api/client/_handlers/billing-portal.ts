import type { VercelRequest, VercelResponse } from "@vercel/node";
import { authenticateClient } from "../../_lib/client-auth.js";
import { getSupabaseAdmin } from "../../_lib/supabase-server.js";

// GET /api/client/billing/portal — returns Stripe Customer Portal URL

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const ctx = await authenticateClient(req);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: "Stripe not configured" });
  }

  const supabase = getSupabaseAdmin();
  const { data: tenant } = await supabase
    .from("tenants")
    .select("stripe_customer_id")
    .eq("id", ctx.tenantId)
    .single();

  if (!tenant?.stripe_customer_id) {
    return res.status(400).json({ error: "No billing account found" });
  }

  try {
    const stripe = (await import("stripe")).default;
    const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY);

    const host = req.headers.host ?? "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";

    const session = await stripeClient.billingPortal.sessions.create({
      customer: tenant.stripe_customer_id,
      return_url: `${protocol}://${host}/client/settings`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe portal error:", err);
    return res.status(500).json({ error: "Failed to create portal session" });
  }
}
