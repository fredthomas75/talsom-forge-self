import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSupabaseAdmin } from "../../_lib/supabase-server.js";
import { logAudit, ACTIONS } from "../../_lib/audit.js";
import { handleCors } from "../../_lib/cors.js";

// POST /api/client/signup
// Server-side signup: creates user (admin API, auto-confirmed) + tenant + membership
// Bypasses Supabase email confirmation requirement.

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res, "POST, OPTIONS")) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { name, company, email, password, inviteToken } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  const supabase = getSupabaseAdmin();

  try {
    // 1. Create user via admin API (auto-confirmed, no email needed)
    const { data: userData, error: createErr } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, company },
    });

    if (createErr) {
      // Handle duplicate email
      if (createErr.message?.includes("already been registered") || createErr.message?.includes("already exists")) {
        return res.status(409).json({ error: "An account with this email already exists" });
      }
      console.error("[signup] createUser error:", createErr.message);
      return res.status(400).json({ error: createErr.message });
    }

    const user = userData.user;

    // 2. Handle invite or create new tenant
    if (inviteToken) {
      // Accept invitation
      const { data: invite } = await supabase
        .from("tenant_invitations")
        .select("*")
        .eq("token", inviteToken)
        .is("accepted_at", null)
        .single();

      if (!invite) {
        return res.status(400).json({ error: "Invalid or expired invitation" });
      }

      if (new Date(invite.expires_at) < new Date()) {
        return res.status(400).json({ error: "Invitation expired" });
      }

      // Create membership
      await supabase.from("tenant_members").insert({
        tenant_id: invite.tenant_id,
        user_id: user.id,
        role: invite.role ?? "member",
      });

      await supabase.from("tenant_invitations").update({ accepted_at: new Date().toISOString() }).eq("id", invite.id);

      logAudit({
        tenant_id: invite.tenant_id,
        user_id: user.id,
        action: ACTIONS.MEMBER_ACCEPT,
        resource_type: "invitation",
        resource_id: invite.id,
      }, req);
    } else {
      // Create new tenant
      const tenantName = company || name || email.split("@")[0] || "My Company";

      // Generate a URL-friendly slug (required: UNIQUE NOT NULL)
      const baseSlug = tenantName
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // strip accents
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 40) || "tenant";
      const slug = `${baseSlug}-${Date.now().toString(36)}`;

      const { data: tenant, error: tenantErr } = await supabase
        .from("tenants")
        .insert({
          name: tenantName,
          slug,
          plan: "free",
          billing_email: email,
          created_by: user.id,
        })
        .select("id")
        .single();

      if (tenantErr || !tenant) {
        console.error("[signup] tenant creation failed:", tenantErr);
        return res.status(500).json({ error: "Failed to create tenant" });
      }

      // Create owner membership
      await supabase.from("tenant_members").insert({
        tenant_id: tenant.id,
        user_id: user.id,
        role: "owner",
      });

      logAudit({
        tenant_id: tenant.id,
        user_id: user.id,
        action: ACTIONS.SIGNUP,
        resource_type: "tenant",
        resource_id: tenant.id,
        metadata: { company: tenantName },
      }, req);
    }

    // 3. Sign in the user to get a session
    // We use signInWithPassword via the admin client workaround:
    // Generate a session by calling the auth API directly
    const signInRes = await fetch(
      `${process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL}/auth/v1/token?grant_type=password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY ?? "",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!signInRes.ok) {
      // User created but can't sign in automatically — they'll need to sign in manually
      return res.status(201).json({ created: true, needsLogin: true });
    }

    const session = await signInRes.json();

    return res.status(201).json({
      created: true,
      session: {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_in: session.expires_in,
        user: {
          id: user.id,
          email: user.email,
        },
      },
    });
  } catch (err) {
    console.error("[signup] unexpected error:", err);
    return res.status(500).json({ error: "Signup failed" });
  }
}
