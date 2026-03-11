import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createHmac, randomUUID } from "crypto";
import { authenticateClient, hasFeature } from "../../_lib/client-auth.js";
import { logAudit } from "../../_lib/audit.js";
import {
  buildAuthUrl, exchangeCode, storeTokens,
  getValidAccessToken, listConnections, revokeConnection,
  type Provider,
} from "../../_lib/oauth-tokens.js";
import {
  listFiles, downloadFile, uploadFile, getUserEmail,
} from "../../_lib/cloud-providers.js";

// ─── INTEGRATIONS HANDLER ───────────────────────────
// Routes: /api/client/integrations[/sub-path]
// Handles OAuth flow, file browsing, download, and export

const HMAC_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "fallback-hmac-secret";

function signState(payload: string): string {
  const hmac = createHmac("sha256", HMAC_SECRET).update(payload).digest("hex");
  return Buffer.from(JSON.stringify({ p: payload, h: hmac })).toString("base64url");
}

function verifyState(encoded: string): string | null {
  try {
    const { p, h } = JSON.parse(Buffer.from(encoded, "base64url").toString());
    const expected = createHmac("sha256", HMAC_SECRET).update(p).digest("hex");
    if (h !== expected) return null;
    return p;
  } catch {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();

  const seg1 = (req.query._seg1 as string) ?? "";
  const seg2 = (req.query._seg2 as string) ?? "";

  // ── OAuth Callback (GET, no auth — user redirected from Google/Microsoft)
  if (seg1 === "callback" && req.method === "GET") {
    return handleCallback(req, res);
  }

  // All other routes require authentication
  const ctx = await authenticateClient(req);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });

  // Feature gate
  if (!hasFeature(ctx, "cloud_integrations")) {
    return res.status(403).json({ error: "Cloud integrations not available on your plan" });
  }

  // ── List Connections (GET /api/client/integrations)
  if (!seg1 && req.method === "GET") {
    const connections = await listConnections(ctx.tenantId, ctx.userId);
    return res.status(200).json({ connections });
  }

  // ── Initiate OAuth (POST /api/client/integrations/connect)
  if (seg1 === "connect" && req.method === "POST") {
    return handleConnect(req, res, ctx);
  }

  // ── Disconnect (DELETE /api/client/integrations/google or /microsoft)
  if ((seg1 === "google" || seg1 === "microsoft") && req.method === "DELETE") {
    return handleDisconnect(req, res, ctx, seg1 as Provider);
  }

  // ── List Files (GET /api/client/integrations/files?provider=...&folderId=...&query=...)
  if (seg1 === "files" && req.method === "GET") {
    return handleListFiles(req, res, ctx);
  }

  // ── Download File (GET /api/client/integrations/download?provider=...&fileId=...&fileName=...&mimeType=...)
  if (seg1 === "download" && req.method === "GET") {
    return handleDownload(req, res, ctx);
  }

  // ── Export / Upload (POST /api/client/integrations/export)
  if (seg1 === "export" && req.method === "POST") {
    return handleExport(req, res, ctx);
  }

  return res.status(404).json({ error: "Not found" });
}

// ─── Connect: Generate Auth URL ──────────────────────

async function handleConnect(
  req: VercelRequest, res: VercelResponse, ctx: any
) {
  const { provider } = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  if (provider !== "google" && provider !== "microsoft") {
    return res.status(400).json({ error: "Invalid provider" });
  }

  const statePayload = JSON.stringify({
    tenantId: ctx.tenantId,
    userId: ctx.userId,
    provider,
    nonce: randomUUID(),
  });

  const state = signState(statePayload);
  const url = buildAuthUrl(provider, state);

  logAudit({
    tenant_id: ctx.tenantId,
    user_id: ctx.userId,
    action: "integration.connect_start",
    resource_type: "oauth",
    metadata: { provider },
  }, req);

  return res.status(200).json({ url });
}

// ─── Callback: Exchange Code for Tokens ──────────────

async function handleCallback(req: VercelRequest, res: VercelResponse) {
  const { code, state, error: oauthError } = req.query;

  if (oauthError) {
    console.error("[integrations] OAuth error:", oauthError);
    return res.redirect(302, "/client/settings?tab=integrations&error=oauth_denied");
  }

  if (!code || !state) {
    return res.redirect(302, "/client/settings?tab=integrations&error=missing_params");
  }

  // Verify state HMAC
  const payload = verifyState(state as string);
  if (!payload) {
    return res.redirect(302, "/client/settings?tab=integrations&error=invalid_state");
  }

  const { tenantId, userId, provider } = JSON.parse(payload);
  if (!tenantId || !userId || !provider) {
    return res.redirect(302, "/client/settings?tab=integrations&error=invalid_state");
  }

  try {
    // Exchange code for tokens
    const tokens = await exchangeCode(provider, code as string);

    // Get user email from the provider
    const email = await getUserEmail(provider, tokens.access_token);

    // Store encrypted tokens
    await storeTokens(tenantId, userId, provider, tokens, email ?? undefined);

    // Audit log
    logAudit({
      tenant_id: tenantId,
      user_id: userId,
      action: "integration.connect",
      resource_type: "oauth",
      metadata: { provider, email },
    });

    return res.redirect(302, `/client/settings?tab=integrations&success=${provider}`);
  } catch (err) {
    console.error("[integrations] Callback error:", err);
    return res.redirect(302, `/client/settings?tab=integrations&error=token_exchange_failed`);
  }
}

// ─── Disconnect ──────────────────────────────────────

async function handleDisconnect(
  req: VercelRequest, res: VercelResponse, ctx: any, provider: Provider
) {
  try {
    await revokeConnection(ctx.tenantId, ctx.userId, provider);

    logAudit({
      tenant_id: ctx.tenantId,
      user_id: ctx.userId,
      action: "integration.disconnect",
      resource_type: "oauth",
      metadata: { provider },
    }, req);

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
}

// ─── List Files ──────────────────────────────────────

async function handleListFiles(
  req: VercelRequest, res: VercelResponse, ctx: any
) {
  const provider = req.query.provider as Provider;
  const folderId = req.query.folderId as string | undefined;
  const query = req.query.query as string | undefined;

  if (provider !== "google" && provider !== "microsoft") {
    return res.status(400).json({ error: "Invalid provider" });
  }

  const conn = await getValidAccessToken(ctx.tenantId, ctx.userId, provider);
  if (!conn) {
    return res.status(401).json({ error: "Not connected to " + provider, reconnect: true });
  }

  try {
    const files = await listFiles(provider, conn.access_token, folderId, query);
    return res.status(200).json({ files });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
}

// ─── Download File ───────────────────────────────────

async function handleDownload(
  req: VercelRequest, res: VercelResponse, ctx: any
) {
  const provider = req.query.provider as Provider;
  const fileId = req.query.fileId as string;
  const fileName = req.query.fileName as string;
  const mimeType = req.query.mimeType as string;

  if (!provider || !fileId || !fileName) {
    return res.status(400).json({ error: "Missing provider, fileId, or fileName" });
  }

  const conn = await getValidAccessToken(ctx.tenantId, ctx.userId, provider);
  if (!conn) {
    return res.status(401).json({ error: "Not connected to " + provider, reconnect: true });
  }

  try {
    const file = await downloadFile(provider, conn.access_token, fileId, fileName, mimeType ?? "");

    logAudit({
      tenant_id: ctx.tenantId,
      user_id: ctx.userId,
      action: "integration.file_import",
      resource_type: "file",
      resource_id: fileId,
      metadata: { provider, fileName, mimeType, size: file.size },
    }, req);

    return res.status(200).json(file);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
}

// ─── Export ──────────────────────────────────────────

async function handleExport(
  req: VercelRequest, res: VercelResponse, ctx: any
) {
  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const { provider, folderId, fileName, content, mimeType, isBase64 } = body;

  if (!provider || !fileName || !content) {
    return res.status(400).json({ error: "Missing provider, fileName, or content" });
  }

  const conn = await getValidAccessToken(ctx.tenantId, ctx.userId, provider);
  if (!conn) {
    return res.status(401).json({ error: "Not connected to " + provider, reconnect: true });
  }

  try {
    const result = await uploadFile(
      provider, conn.access_token,
      fileName, content, mimeType ?? "text/markdown",
      folderId, isBase64
    );

    logAudit({
      tenant_id: ctx.tenantId,
      user_id: ctx.userId,
      action: "integration.file_export",
      resource_type: "file",
      resource_id: result.fileId,
      metadata: { provider, fileName, webUrl: result.webUrl },
    }, req);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
}
