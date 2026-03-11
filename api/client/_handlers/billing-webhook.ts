import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSupabaseAdmin } from "../../_lib/supabase-server.js";

// POST /api/client/billing/webhook — Stripe webhook handler

export const config = { api: { bodyParser: false } };

async function getRawBody(req: VercelRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(500).json({ error: "Stripe not configured" });
  }

  try {
    const stripe = (await import("stripe")).default;
    const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY);

    const rawBody = await getRawBody(req);
    const sig = req.headers["stripe-signature"] as string;

    const event = stripeClient.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    const supabase = getSupabaseAdmin();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as unknown as Record<string, unknown>;
        const tenantId = (session.metadata as Record<string, string>)?.tenant_id;
        const plan = (session.metadata as Record<string, string>)?.plan;
        const subscriptionId = session.subscription as string;

        if (tenantId && plan) {
          await supabase.from("tenants").update({
            plan,
            stripe_subscription_id: subscriptionId,
          }).eq("id", tenantId);
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as unknown as Record<string, unknown>;
        const customerId = sub.customer as string;

        // Find tenant by Stripe customer ID
        const { data: tenant } = await supabase
          .from("tenants")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (tenant) {
          const status = sub.status as string;
          if (status === "canceled" || status === "unpaid") {
            await supabase.from("tenants").update({ plan: "free" }).eq("id", tenant.id);
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as unknown as Record<string, unknown>;
        const customerId = sub.customer as string;

        const { data: tenant } = await supabase
          .from("tenants")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (tenant) {
          await supabase.from("tenants").update({
            plan: "free",
            stripe_subscription_id: null,
          }).eq("id", tenant.id);
        }
        break;
      }
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(400).json({ error: "Webhook processing failed" });
  }
}
