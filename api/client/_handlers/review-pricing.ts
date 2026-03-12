import type { VercelRequest, VercelResponse } from "@vercel/node";
import { authenticateClient, hasFeature } from "../../_lib/client-auth.js";
import { getSupabaseAdmin } from "../../_lib/supabase-server.js";
import { handleCors } from "../../_lib/cors.js";

// GET /api/client/review-pricing          — returns all tiers
// GET /api/client/review-pricing?tool=xxx — returns price for specific tool

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res, "GET, OPTIONS")) return;
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const ctx = await authenticateClient(req);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });

  const supabase = getSupabaseAdmin();

  // Fetch pricing config
  const { data: config } = await supabase
    .from("review_config")
    .select("value")
    .eq("key", "pricing")
    .single();

  const pricing = config?.value as {
    tiers?: Record<string, { price_cents: number; label_fr: string; label_en: string }>;
    tool_tiers?: Record<string, string>;
    currency?: string;
    enterprise_included?: boolean;
    default_tier?: string;
    // Legacy flat price
    default_price_cents?: number;
  } | null;

  // Determine if enterprise (included)
  const isEnterprise = ctx.plan === "enterprise" && pricing?.enterprise_included;
  const hasFeatureAccess = hasFeature(ctx, "human_review");

  const toolParam = req.query.tool as string | undefined;

  // If tiers exist, return tiered pricing
  if (pricing?.tiers && pricing?.tool_tiers) {
    const tiers = pricing.tiers;
    const toolTiers = pricing.tool_tiers;
    const currency = pricing.currency ?? "cad";
    const defaultTier = pricing.default_tier ?? "premium";

    if (toolParam) {
      // Return pricing for specific tool
      const tierKey = toolTiers[toolParam] ?? defaultTier;
      const tier = tiers[tierKey];
      return res.status(200).json({
        tool: toolParam,
        tier: tierKey,
        price_cents: isEnterprise ? 0 : (tier?.price_cents ?? 44900),
        label_fr: tier?.label_fr ?? tierKey,
        label_en: tier?.label_en ?? tierKey,
        currency,
        enterprise_included: isEnterprise,
        has_feature: hasFeatureAccess,
      });
    }

    // Return all tiers + tool mapping
    const tiersWithPrices = Object.fromEntries(
      Object.entries(tiers).map(([key, tier]) => [
        key,
        { ...tier, price_cents: isEnterprise ? 0 : tier.price_cents },
      ])
    );

    return res.status(200).json({
      tiers: tiersWithPrices,
      tool_tiers: toolTiers,
      currency,
      enterprise_included: isEnterprise,
      default_tier: defaultTier,
      has_feature: hasFeatureAccess,
    });
  }

  // Fallback: legacy flat pricing
  const flatPrice = pricing?.default_price_cents ?? 14900;
  return res.status(200).json({
    tiers: null,
    flat_price_cents: isEnterprise ? 0 : flatPrice,
    currency: pricing?.currency ?? "cad",
    enterprise_included: isEnterprise,
    has_feature: hasFeatureAccess,
  });
}
