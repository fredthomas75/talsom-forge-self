import type { VercelRequest, VercelResponse } from "@vercel/node";
import { authenticateClient } from "../../_lib/client-auth.js";
import { getSupabaseAdmin } from "../../_lib/supabase-server.js";
import { logAudit, ACTIONS } from "../../_lib/audit.js";
import { handleCors } from "../../_lib/cors.js";

// GET   /api/client/settings — get current settings
// PATCH /api/client/settings — update profile or tenant

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res, "GET, PATCH, OPTIONS")) return;

  const ctx = await authenticateClient(req);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });

  const supabase = getSupabaseAdmin();

  if (req.method === "GET") {
    const { data: tenant } = await supabase
      .from("tenants")
      .select("name, billing_email, logo_url")
      .eq("id", ctx.tenantId)
      .single();

    return res.status(200).json({
      profile: { name: "", email: ctx.email },
      tenant: tenant ?? {},
    });
  }

  if (req.method === "PATCH") {
    const { tab, name, tenantName, billingEmail } = req.body ?? {};

    if (tab === "profile" && name) {
      // Update user metadata
      await supabase.auth.admin.updateUserById(ctx.userId, {
        user_metadata: { name },
      });

      logAudit({
        tenant_id: ctx.tenantId,
        user_id: ctx.userId,
        action: ACTIONS.SETTINGS_UPDATE,
        resource_type: "profile",
        metadata: { name },
      }, req);
    }

    if (tab === "tenant") {
      if (ctx.role !== "owner" && ctx.role !== "admin") {
        return res.status(403).json({ error: "Only owners and admins can update tenant" });
      }

      const updates: Record<string, string> = {};
      if (tenantName) updates.name = tenantName;
      if (billingEmail) updates.billing_email = billingEmail;

      if (Object.keys(updates).length > 0) {
        await supabase.from("tenants").update(updates).eq("id", ctx.tenantId);

        logAudit({
          tenant_id: ctx.tenantId,
          user_id: ctx.userId,
          action: ACTIONS.TENANT_UPDATE,
          resource_type: "tenant",
          resource_id: ctx.tenantId,
          metadata: updates,
        }, req);
      }
    }

    return res.status(200).json({ updated: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
