import { useState, useCallback } from "react";

// ─── CLOUD INTEGRATIONS HOOK ────────────────────────
// Manages OAuth connections + file browsing for Google / Microsoft

export type Provider = "google" | "microsoft";

export interface CloudConnection {
  id: string;
  provider: Provider;
  account_email: string | null;
  status: "active" | "revoked" | "expired";
  created_at: string;
}

export interface CloudFile {
  id: string;
  name: string;
  mimeType: string;
  size?: number;
  modifiedTime?: string;
  isFolder: boolean;
  webUrl?: string;
  iconUrl?: string;
}

export interface ExportResult {
  fileId: string;
  fileName: string;
  webUrl: string;
}

export function useCloudIntegrations(accessToken: string) {
  const [connections, setConnections] = useState<CloudConnection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const headers = { Authorization: `Bearer ${accessToken}` };
  const jsonHeaders = { ...headers, "Content-Type": "application/json" };

  // ── List connections ──
  const fetchConnections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/client/integrations", { headers });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setConnections(data.connections ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  // ── Initiate OAuth ──
  const connect = useCallback(async (provider: Provider) => {
    setError(null);
    try {
      const res = await fetch("/api/client/integrations/connect", {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify({ provider }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    }
  }, [accessToken]);

  // ── Disconnect ──
  const disconnect = useCallback(async (provider: Provider) => {
    setError(null);
    try {
      const res = await fetch(`/api/client/integrations/${provider}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || `HTTP ${res.status}`);
      }
      setConnections((prev) => prev.filter((c) => c.provider !== provider));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    }
  }, [accessToken]);

  // ── List files ──
  const listFiles = useCallback(async (
    provider: Provider, folderId?: string, query?: string
  ): Promise<CloudFile[]> => {
    const params = new URLSearchParams({ provider });
    if (folderId) params.set("folderId", folderId);
    if (query) params.set("query", query);

    const res = await fetch(`/api/client/integrations/files?${params}`, { headers });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error(d.error || `HTTP ${res.status}`);
    }
    const data = await res.json();
    return data.files ?? [];
  }, [accessToken]);

  // ── Download file (returns content as base64) ──
  const downloadFile = useCallback(async (
    provider: Provider, fileId: string, fileName: string, mimeType: string
  ): Promise<{ content: string; mimeType: string; size: number }> => {
    const params = new URLSearchParams({ provider, fileId, fileName, mimeType });
    const res = await fetch(`/api/client/integrations/download?${params}`, { headers });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error(d.error || `HTTP ${res.status}`);
    }
    return res.json();
  }, [accessToken]);

  // ── Export file to cloud ──
  const exportFile = useCallback(async (
    provider: Provider,
    fileName: string,
    content: string,
    mimeType?: string,
    folderId?: string,
    isBase64?: boolean
  ): Promise<ExportResult> => {
    const res = await fetch("/api/client/integrations/export", {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({ provider, fileName, content, mimeType, folderId, isBase64 }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error(d.error || `HTTP ${res.status}`);
    }
    return res.json();
  }, [accessToken]);

  // ── Helpers ──
  const isConnected = useCallback((provider: Provider) => {
    return connections.some((c) => c.provider === provider && c.status === "active");
  }, [connections]);

  const getConnection = useCallback((provider: Provider) => {
    return connections.find((c) => c.provider === provider && c.status === "active") ?? null;
  }, [connections]);

  return {
    connections, loading, error,
    fetchConnections, connect, disconnect,
    listFiles, downloadFile, exportFile,
    isConnected, getConnection,
  };
}
