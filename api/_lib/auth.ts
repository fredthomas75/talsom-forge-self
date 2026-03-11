import type { VercelRequest } from "@vercel/node";
import { getSupabaseAdmin } from "./supabase-server.js";
import crypto from "crypto";

export interface TenantContext {
  tenantId: string;
  permissions: string[];
  rateLimitPerMinute: number;
}

export async function authenticateTenant(
  req: VercelRequest
): Promise<TenantContext | null> {
  const apiKey = req.headers["x-api-key"] as string;
  if (!apiKey) return null;

  const keyHash = crypto.createHash("sha256").update(apiKey).digest("hex");
  const keyPrefix = apiKey.substring(0, 8);

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("api_keys")
    .select("tenant_id, permissions, rate_limit_per_minute, expires_at")
    .eq("key_hash", keyHash)
    .eq("key_prefix", keyPrefix)
    .single();

  if (error || !data) return null;
  if (data.expires_at && new Date(data.expires_at) < new Date()) return null;

  // Update last_used_at asynchronously
  supabase
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("key_hash", keyHash)
    .then(() => {});

  return {
    tenantId: data.tenant_id,
    permissions: data.permissions ?? ["chat"],
    rateLimitPerMinute: data.rate_limit_per_minute ?? 60,
  };
}
