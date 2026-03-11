import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";

// ─── CONSULTANT PORTAL CONTEXT ────────────────────
// Fetches consultant profile from /api/consultant/me on mount.

export interface ConsultantUser {
  userId: string;
  email: string;
  consultantId: string;
  name: string;
  specialties: string[];
}

export interface ConsultantContextData {
  user: ConsultantUser | null;
  session: Session;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const ConsultantCtx = createContext<ConsultantContextData | null>(null);

export function useConsultant(): ConsultantContextData {
  const ctx = useContext(ConsultantCtx);
  if (!ctx) throw new Error("useConsultant must be used inside ConsultantProvider");
  return ctx;
}

export function ConsultantProvider({ session, children }: { session: Session; children: ReactNode }) {
  const [user, setUser] = useState<ConsultantUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMe = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/consultant/me", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Not a consultant");
      }

      const data = await res.json();
      setUser({
        userId: data.userId,
        email: data.email,
        consultantId: data.consultantId,
        name: data.name,
        specialties: data.specialties ?? [],
      });
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
    <ConsultantCtx.Provider value={{ user, session, loading, error, refresh: fetchMe }}>
      {children}
    </ConsultantCtx.Provider>
  );
}
