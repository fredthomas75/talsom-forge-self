import type { VercelRequest } from "@vercel/node";
import { getSupabaseAdmin } from "./supabase-server.js";

// ─── CONSULTANT PORTAL AUTH ─────────────────────────
// Bearer JWT → supabase.auth.getUser() → join consultants → return context
// Consultants are cross-tenant Talsom staff — they can see all tenants' reviews.

export interface ConsultantContext {
  userId: string;
  email: string;
  consultantId: string;
  name: string;
  specialties: string[];
}

export async function authenticateConsultant(
  req: VercelRequest
): Promise<ConsultantContext | null> {
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

  // 2. Find active consultant record
  const { data: consultant, error: consultantError } = await supabase
    .from("consultants")
    .select("id, name, email, specialties")
    .eq("user_id", user.id)
    .eq("active", true)
    .single();

  if (consultantError || !consultant) return null;

  return {
    userId: user.id,
    email: consultant.email,
    consultantId: consultant.id,
    name: consultant.name,
    specialties: consultant.specialties ?? [],
  };
}
