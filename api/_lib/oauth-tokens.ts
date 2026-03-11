import { getSupabaseAdmin } from "./supabase-server.js";
import { encrypt, decrypt } from "./crypto.js";

// ─── OAUTH TOKEN MANAGEMENT ────────────────────────
// Handles token storage, retrieval, and refresh for Google & Microsoft

export type Provider = "google" | "microsoft";

interface OAuthConnection {
  id: string;
  provider: Provider;
  access_token: string;   // decrypted
  refresh_token: string;  // decrypted
  token_expires_at: string | null;
  account_email: string | null;
  scopes: string[];
  status: string;
}

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope?: string;
}

// ─── Build Authorization URL ─────────────────────────

export function buildAuthUrl(provider: Provider, state: string): string {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://talsom-force-self.vercel.app";

  const redirectUri = `${baseUrl}/api/client/integrations/callback`;

  if (provider === "google") {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID ?? "",
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.file openid email",
      access_type: "offline",
      prompt: "consent",
      state,
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }

  // Microsoft
  const tenantId = process.env.MICROSOFT_TENANT_ID ?? "common";
  const params = new URLSearchParams({
    client_id: process.env.MICROSOFT_CLIENT_ID ?? "",
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "Files.ReadWrite.All offline_access openid email User.Read",
    state,
  });
  return `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?${params}`;
}

// ─── Exchange Authorization Code ─────────────────────

export async function exchangeCode(provider: Provider, code: string): Promise<TokenResponse> {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://talsom-force-self.vercel.app";

  const redirectUri = `${baseUrl}/api/client/integrations/callback`;

  if (provider === "google") {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID ?? "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Google token exchange failed: ${err}`);
    }
    return res.json();
  }

  // Microsoft
  const tenantId = process.env.MICROSOFT_TENANT_ID ?? "common";
  const res = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.MICROSOFT_CLIENT_ID ?? "",
      client_secret: process.env.MICROSOFT_CLIENT_SECRET ?? "",
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Microsoft token exchange failed: ${err}`);
  }
  return res.json();
}

// ─── Refresh Access Token ────────────────────────────

async function refreshAccessToken(provider: Provider, refreshToken: string): Promise<TokenResponse> {
  if (provider === "google") {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        client_id: process.env.GOOGLE_CLIENT_ID ?? "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        grant_type: "refresh_token",
      }),
    });
    if (!res.ok) throw new Error("Google refresh failed");
    return res.json();
  }

  const tenantId = process.env.MICROSOFT_TENANT_ID ?? "common";
  const res = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: process.env.MICROSOFT_CLIENT_ID ?? "",
      client_secret: process.env.MICROSOFT_CLIENT_SECRET ?? "",
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error("Microsoft refresh failed");
  return res.json();
}

// ─── Store Tokens ────────────────────────────────────

export async function storeTokens(
  tenantId: string,
  userId: string,
  provider: Provider,
  tokens: TokenResponse,
  accountEmail?: string
): Promise<void> {
  const supabase = getSupabaseAdmin();
  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

  const record = {
    tenant_id: tenantId,
    user_id: userId,
    provider,
    access_token_enc: encrypt(tokens.access_token),
    refresh_token_enc: encrypt(tokens.refresh_token ?? ""),
    token_expires_at: expiresAt,
    scopes: tokens.scope?.split(" ") ?? [],
    account_email: accountEmail ?? null,
    status: "active",
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("tenant_oauth_connections")
    .upsert(record, { onConflict: "tenant_id,user_id,provider" });

  if (error) throw new Error(`Failed to store tokens: ${error.message}`);
}

// ─── Get Valid Access Token (auto-refresh) ───────────

export async function getValidAccessToken(
  tenantId: string,
  userId: string,
  provider: Provider
): Promise<OAuthConnection | null> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("tenant_oauth_connections")
    .select("*")
    .eq("tenant_id", tenantId)
    .eq("user_id", userId)
    .eq("provider", provider)
    .eq("status", "active")
    .single();

  if (error || !data) return null;

  const accessToken = decrypt(data.access_token_enc);
  const refreshToken = decrypt(data.refresh_token_enc);

  // Check if token is about to expire (5 min buffer)
  const expiresAt = data.token_expires_at ? new Date(data.token_expires_at).getTime() : 0;
  const needsRefresh = expiresAt < Date.now() + 5 * 60 * 1000;

  if (needsRefresh && refreshToken) {
    try {
      const newTokens = await refreshAccessToken(provider, refreshToken);
      const newExpiresAt = new Date(Date.now() + newTokens.expires_in * 1000).toISOString();

      // Update stored tokens
      const updateData: Record<string, string> = {
        access_token_enc: encrypt(newTokens.access_token),
        token_expires_at: newExpiresAt,
        updated_at: new Date().toISOString(),
      };

      // Microsoft sometimes returns a new refresh token
      if (newTokens.refresh_token) {
        updateData.refresh_token_enc = encrypt(newTokens.refresh_token);
      }

      await supabase
        .from("tenant_oauth_connections")
        .update(updateData)
        .eq("id", data.id);

      return {
        id: data.id,
        provider,
        access_token: newTokens.access_token,
        refresh_token: newTokens.refresh_token ?? refreshToken,
        token_expires_at: newExpiresAt,
        account_email: data.account_email,
        scopes: data.scopes ?? [],
        status: "active",
      };
    } catch (err) {
      // Refresh failed — mark as expired
      await supabase
        .from("tenant_oauth_connections")
        .update({ status: "expired", updated_at: new Date().toISOString() })
        .eq("id", data.id);
      return null;
    }
  }

  return {
    id: data.id,
    provider,
    access_token: accessToken,
    refresh_token: refreshToken,
    token_expires_at: data.token_expires_at,
    account_email: data.account_email,
    scopes: data.scopes ?? [],
    status: "active",
  };
}

// ─── List Connections ────────────────────────────────

export async function listConnections(tenantId: string, userId: string) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("tenant_oauth_connections")
    .select("id, provider, account_email, scopes, status, created_at, updated_at")
    .eq("tenant_id", tenantId)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data ?? [];
}

// ─── Revoke Connection ───────────────────────────────

export async function revokeConnection(tenantId: string, userId: string, provider: Provider) {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("tenant_oauth_connections")
    .update({ status: "revoked", updated_at: new Date().toISOString() })
    .eq("tenant_id", tenantId)
    .eq("user_id", userId)
    .eq("provider", provider);

  if (error) throw new Error(`Failed to revoke: ${error.message}`);
}
