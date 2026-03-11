import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";

// ─── CLIENT PORTAL CONTEXT ──────────────────────────
// Fetches tenant context from /api/client/me on mount
// and provides it to all client portal pages.

export interface ClientUser {
  userId: string;
  email: string;
  name: string;
}

export interface ClientTenant {
  tenantId: string;
  tenantName: string;
  plan: string;
  role: "owner" | "admin" | "member";
}

export interface ClientQuotas {
  max_api_calls_per_month: number;
  max_tokens_per_month: number;
  max_team_members: number;
  max_api_keys: number;
  max_conversations: number;
  features: Record<string, boolean>;
}

export interface ClientContextData {
  user: ClientUser | null;
  tenant: ClientTenant | null;
  quotas: ClientQuotas | null;
  session: Session;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const ClientCtx = createContext<ClientContextData | null>(null);

export function useClient(): ClientContextData {
  const ctx = useContext(ClientCtx);
  if (!ctx) throw new Error("useClient must be used inside ClientProvider");
  return ctx;
}

export function ClientProvider({ session, children }: { session: Session; children: ReactNode }) {
  const [user, setUser] = useState<ClientUser | null>(null);
  const [tenant, setTenant] = useState<ClientTenant | null>(null);
  const [quotas, setQuotas] = useState<ClientQuotas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMe = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/client/me", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to load profile");
      }

      const data = await res.json();
      setUser({
        userId: data.userId,
        email: data.email,
        name: data.name ?? data.email.split("@")[0],
      });
      setTenant({
        tenantId: data.tenantId,
        tenantName: data.tenantName,
        plan: data.plan,
        role: data.role,
      });
      setQuotas(data.quotas ?? null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, [session.access_token]);

  return (
    <ClientCtx.Provider value={{ user, tenant, quotas, session, loading, error, refresh: fetchMe }}>
      {children}
    </ClientCtx.Provider>
  );
}
