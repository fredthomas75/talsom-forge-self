import type { VercelRequest } from "@vercel/node";
import { getSupabaseAdmin } from "./supabase-server.js";

// ─── AUDIT LOGGING (LOI 25 COMPLIANCE) ──────────────
// Fire-and-forget audit trail for all client portal actions

export interface AuditEntry {
  tenant_id: string;
  user_id?: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  metadata?: Record<string, unknown>;
  ip_address?: string;
}

/** Extract client IP from Vercel request headers */
function getClientIp(req: VercelRequest): string {
  return (
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ??
    (req.headers["x-real-ip"] as string) ??
    "unknown"
  );
}

/**
 * Log an audit entry — fire-and-forget (no await needed).
 * Returns the promise in case caller wants to await.
 */
export async function logAudit(entry: AuditEntry, req?: VercelRequest): Promise<void> {
  const supabase = getSupabaseAdmin();

  const record = {
    tenant_id: entry.tenant_id,
    user_id: entry.user_id ?? null,
    action: entry.action,
    resource_type: entry.resource_type ?? null,
    resource_id: entry.resource_id ?? null,
    metadata: entry.metadata ?? {},
    ip_address: req ? getClientIp(req) : entry.ip_address ?? null,
  };

  const { error } = await supabase.from("audit_logs").insert(record);
  if (error) console.error("[audit] Failed to log:", error.message);
}

// ─── PREDEFINED ACTION CONSTANTS ─────────────────────
export const ACTIONS = {
  // Auth
  LOGIN: "auth.login",
  SIGNUP: "auth.signup",
  LOGOUT: "auth.logout",
  PASSWORD_CHANGE: "auth.password_change",

  // Chat
  CHAT_CREATE: "chat.create",
  CHAT_MESSAGE: "chat.message",
  CHAT_DELETE: "chat.delete",

  // MCP Tools
  TOOL_QUERY: "tool.query",
  TOOL_CHAT: "tool.chat",

  // API Keys
  KEY_CREATE: "key.create",
  KEY_REVOKE: "key.revoke",

  // Team
  MEMBER_INVITE: "team.invite",
  MEMBER_ACCEPT: "team.accept",
  MEMBER_REMOVE: "team.remove",
  MEMBER_ROLE_CHANGE: "team.role_change",

  // Settings
  SETTINGS_UPDATE: "settings.update",
  TENANT_UPDATE: "tenant.update",

  // Billing
  PLAN_UPGRADE: "billing.upgrade",
  PLAN_DOWNGRADE: "billing.downgrade",
  CHECKOUT_START: "billing.checkout_start",

  // Cloud Integrations
  INTEGRATION_CONNECT: "integration.connect",
  INTEGRATION_DISCONNECT: "integration.disconnect",
  INTEGRATION_FILE_IMPORT: "integration.file_import",
  INTEGRATION_FILE_EXPORT: "integration.file_export",

  // Human Review
  REVIEW_REQUESTED: "review.requested",
  REVIEW_ASSIGNED: "review.assigned",
  REVIEW_APPROVED: "review.approved",
  REVIEW_REJECTED: "review.rejected",
  REVIEW_DELIVERED: "review.delivered",
} as const;
