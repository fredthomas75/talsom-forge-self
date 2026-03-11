import type { VercelRequest } from "@vercel/node";
import { getSupabaseAdmin } from "./supabase-server.js";

// ─── CLIENT PORTAL AUTH ─────────────────────────────
// Bearer JWT → supabase.auth.getUser() → join tenant_members → return context

export interface ClientContext {
  userId: string;
  email: string;
  tenantId: string;
  tenantName: string;
  plan: string;
  role: "owner" | "admin" | "member";
  quotas: {
    max_api_calls_per_month: number;
    max_tokens_per_month: number;
    max_team_members: number;
    max_api_keys: number;
    max_conversations: number;
    features: Record<string, boolean>;
  } | null;
}

export async function authenticateClient(
  req: VercelRequest
): Promise<ClientContext | null> {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return null;

  const token = auth.slice(7);
  const supabase = getSupabaseAdmin();

  // 1. Verify JWT and get user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);

  if (userError || !user) return null;

  // 2. Find tenant membership
  const { data: membership, error: memError } = await supabase
    .from("tenant_members")
    .select("tenant_id, role")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (memError || !membership) return null;

  // 3. Get tenant info
  const { data: tenant, error: tenantError } = await supabase
    .from("tenants")
    .select("name, plan")
    .eq("id", membership.tenant_id)
    .single();

  if (tenantError || !tenant) return null;

  // 4. Get plan quotas
  const { data: quotas } = await supabase
    .from("plan_quotas")
    .select("*")
    .eq("plan", tenant.plan)
    .single();

  return {
    userId: user.id,
    email: user.email ?? "",
    tenantId: membership.tenant_id,
    tenantName: tenant.name,
    plan: tenant.plan,
    role: membership.role,
    quotas: quotas
      ? {
          max_api_calls_per_month: quotas.max_api_calls_per_month,
          max_tokens_per_month: quotas.max_tokens_per_month,
          max_team_members: quotas.max_team_members,
          max_api_keys: quotas.max_api_keys,
          max_conversations: quotas.max_conversations,
          features: quotas.features ?? {},
        }
      : null,
  };
}

/** Quick check: does the user have a specific feature enabled by their plan? */
export function hasFeature(ctx: ClientContext, feature: string): boolean {
  return ctx.quotas?.features?.[feature] === true;
}

/** Check if quota value is unlimited (-1 means unlimited) */
export function isUnlimited(value: number): boolean {
  return value === -1;
}
