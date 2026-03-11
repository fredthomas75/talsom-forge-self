import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { C, HDR_FONT } from "@/lib/constants";
import { useLang } from "@/lib/contexts";

const t = (lang: string, fr: string, en: string) => (lang === "fr" ? fr : en);

export function ClientSignup() {
  const { lang } = useLang();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("invite");

  const [form, setForm] = useState({ name: "", company: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError(t(lang, "Supabase non configuré", "Supabase not configured"));
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError(t(lang, "Les mots de passe ne correspondent pas", "Passwords do not match"));
      return;
    }
    if (form.password.length < 8) {
      setError(t(lang, "Le mot de passe doit contenir au moins 8 caractères", "Password must be at least 8 characters"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Server-side signup: creates user (auto-confirmed) + tenant + membership
      const res = await fetch("/api/client/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          company: form.company,
          email: form.email,
          password: form.password,
          inviteToken: inviteToken ?? undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error === "An account with this email already exists"
            ? t(lang, "Un compte avec ce courriel existe déjà", "An account with this email already exists")
            : data.error || "Signup failed"
        );
      }

      if (data.session) {
        // Set session in Supabase client so ProtectedRoute picks it up
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
        navigate("/client");
      } else if (data.needsLogin) {
        // Account created but couldn't auto-sign-in — redirect to login
        navigate("/client/login");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="w-full max-w-sm mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: C.green }}>
            <Brain className="w-7 h-7" style={{ color: C.yellow }} />
          </div>
          <h1 className="text-2xl font-bold" style={{ ...HDR_FONT, color: C.green }}>
            {t(lang, "Créer un compte", "Create an account")}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {inviteToken
              ? t(lang, "Vous avez été invité à rejoindre une équipe", "You've been invited to join a team")
              : t(lang, "Commencez gratuitement", "Get started for free")}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">{t(lang, "Nom complet", "Full name")}</label>
            <Input required value={form.name} onChange={set("name")} placeholder="Jean Dupont" className="rounded-lg" disabled={loading} />
          </div>
          {!inviteToken && (
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">{t(lang, "Nom de l'entreprise", "Company name")}</label>
              <Input required value={form.company} onChange={set("company")} placeholder="Acme Inc." className="rounded-lg" disabled={loading} />
            </div>
          )}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">{t(lang, "Courriel", "Email")}</label>
            <Input type="email" required value={form.email} onChange={set("email")} placeholder="nom@entreprise.com" className="rounded-lg" disabled={loading} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">{t(lang, "Mot de passe", "Password")}</label>
            <Input type="password" required value={form.password} onChange={set("password")} placeholder="Min. 8 caractères" className="rounded-lg" disabled={loading} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">{t(lang, "Confirmer le mot de passe", "Confirm password")}</label>
            <Input type="password" required value={form.confirmPassword} onChange={set("confirmPassword")} placeholder="••••••••" className="rounded-lg" disabled={loading} />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full font-semibold border-0 hover:opacity-90 transition-opacity"
            style={{ background: C.yellow, color: C.green }}
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t(lang, "Création...", "Creating...")}</>
            ) : (
              t(lang, "Créer mon compte", "Create my account")
            )}
          </Button>
        </form>

        {/* Links */}
        <div className="text-xs text-gray-400 text-center mt-6 space-y-2">
          <p>
            {t(lang, "Déjà un compte ?", "Already have an account?")}{" "}
            <Link to="/client/login" className="font-medium hover:text-gray-600 transition-colors" style={{ color: C.green }}>
              {t(lang, "Se connecter", "Sign in")}
            </Link>
          </p>
          <p>
            <a href="/" className="hover:text-gray-600 transition-colors">
              ← {t(lang, "Retour au site", "Back to site")}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
