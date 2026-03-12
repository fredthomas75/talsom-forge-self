import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";
import { authenticateClient } from "../../_lib/client-auth.js";
import { getSupabaseAdmin } from "../../_lib/supabase-server.js";
import { logAudit, ACTIONS } from "../../_lib/audit.js";
import { handleCors } from "../../_lib/cors.js";

// GET  /api/client/keys — list keys (prefix only)
// POST /api/client/keys — create key (returns full key ONCE)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res, "GET, POST, OPTIONS")) return;

  const ctx = await authenticateClient(req);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });

  const supabase = getSupabaseAdmin();

  // GET: List keys
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("api_keys")
      .select("id, key_prefix, permissions, created_at, last_used_at, expires_at")
      .eq("tenant_id", ctx.tenantId)
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    // Add label from permissions or key_prefix
    const keys = (data ?? []).map((k) => ({
      id: k.id,
      key_prefix: k.key_prefix,
      label: k.permissions?.[0] === "label" ? k.permissions[1] : k.key_prefix,
      created_at: k.created_at,
      last_used_at: k.last_used_at,
      expires_at: k.expires_at,
    }));

    return res.status(200).json({ keys });
  }

  // POST: Create key
  if (req.method === "POST") {
    // Check quota
    const { count } = await supabase
      .from("api_keys")
      .select("id", { count: "exact", head: true })
      .eq("tenant_id", ctx.tenantId);

    const maxKeys = ctx.quotas?.max_api_keys ?? 1;
    if (maxKeys !== -1 && (count ?? 0) >= maxKeys) {
      return res.status(403).json({ error: "API key limit reached. Upgrade your plan." });
    }

    // Only owners and admins can create keys
    if (ctx.role === "member") {
      return res.status(403).json({ error: "Only owners and admins can create API keys" });
    }

    const { label = "API Key" } = req.body ?? {};

    // Generate key
    const rawKey = `tf_${crypto.randomBytes(32).toString("hex")}`;
    const keyPrefix = rawKey.substring(0, 8);
    const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex");

    const { error: insertErr } = await supabase.from("api_keys").insert({
      tenant_id: ctx.tenantId,
      key_hash: keyHash,
      key_prefix: keyPrefix,
      permissions: ["label", label, "chat", "mcp"],
      rate_limit_per_minute: 60,
    });

    if (insertErr) {
      console.error("Key creation error:", insertErr);
      return res.status(500).json({ error: "Failed to create key" });
    }

    logAudit({
      tenant_id: ctx.tenantId,
      user_id: ctx.userId,
      action: ACTIONS.KEY_CREATE,
      resource_type: "api_key",
      resource_id: keyPrefix,
      metadata: { label },
    }, req);

    // Return the full key ONCE
    return res.status(201).json({ key: rawKey, prefix: keyPrefix });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
