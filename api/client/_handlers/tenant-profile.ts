import type { VercelRequest, VercelResponse } from "@vercel/node";
import { authenticateClient } from "../../_lib/client-auth.js";
import { getSupabaseAdmin } from "../../_lib/supabase-server.js";
import { logAudit, ACTIONS } from "../../_lib/audit.js";

// GET  /api/client/customization/profile — get tenant profile
// PATCH /api/client/customization/profile — upsert tenant profile

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();

  const ctx = await authenticateClient(req);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });

  const supabase = getSupabaseAdmin();

  // GET: Return profile
  if (req.method === "GET") {
    const { data } = await supabase
      .from("tenant_profile")
      .select("*")
      .eq("tenant_id", ctx.tenantId)
      .single();

    return res.status(200).json({ profile: data ?? null });
  }

  // PATCH: Upsert profile (owner/admin only)
  if (req.method === "PATCH") {
    if (ctx.role === "member") {
      return res.status(403).json({ error: "Only owners and admins can update the profile" });
    }

    const {
      industry, company_size, headquarters, description,
      mission_statement, target_audience, key_products,
      brand_tone, brand_colors, custom_instructions,
    } = req.body ?? {};

    const profileData = {
      tenant_id: ctx.tenantId,
      industry: industry ?? null,
      company_size: company_size ?? null,
      headquarters: headquarters ?? null,
      description: description ?? null,
      mission_statement: mission_statement ?? null,
      target_audience: target_audience ?? null,
      key_products: key_products ?? null,
      brand_tone: brand_tone ?? "professional",
      brand_colors: brand_colors ?? {},
      custom_instructions: custom_instructions ?? null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("tenant_profile")
      .upsert(profileData, { onConflict: "tenant_id" })
      .select("*")
      .single();

    if (error) {
      console.error("[tenant-profile] upsert error:", error);
      return res.status(500).json({ error: "Failed to save profile" });
    }

    logAudit({
      tenant_id: ctx.tenantId,
      user_id: ctx.userId,
      action: ACTIONS.TENANT_UPDATE,
      resource_type: "tenant_profile",
      resource_id: data.id,
      metadata: { fields: Object.keys(req.body ?? {}) },
    }, req);

    return res.status(200).json({ profile: data });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
