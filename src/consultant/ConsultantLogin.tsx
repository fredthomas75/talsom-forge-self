import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { C, HDR_FONT } from "@/lib/constants";
import { useLang } from "@/lib/contexts";

const t = (lang: string, fr: string, en: string) => (lang === "fr" ? fr : en);

export function ConsultantLogin() {
  const { lang } = useLang();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError(t(lang, "Supabase non configuré", "Supabase not configured"));
      return;
    }
    setLoading(true);
    setError("");

    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (err) {
      setError(
        err.message === "Invalid login credentials"
          ? t(lang, "Email ou mot de passe invalide", "Invalid email or password")
          : err.message
      );
      return;
    }
    navigate("/consultant");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: C.green }}>
            <ShieldCheck className="w-7 h-7" style={{ color: C.yellow }} />
          </div>
          <h1 className="text-2xl font-bold" style={{ ...HDR_FONT, color: C.green }}>
            Talsom<span className="font-light opacity-70">Forge</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t(lang, "Portail consultant", "Consultant Portal")}
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
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">
              {t(lang, "Courriel", "Email")}
            </label>
            <Input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="consultant@talsom.com"
              className="rounded-lg" disabled={loading}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">
              {t(lang, "Mot de passe", "Password")}
            </label>
            <Input
              type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="rounded-lg" disabled={loading}
            />
          </div>
          <Button
            type="submit" disabled={loading}
            className="w-full rounded-full font-semibold border-0 hover:opacity-90 transition-opacity"
            style={{ background: C.yellow, color: C.green }}
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t(lang, "Connexion...", "Signing in...")}</>
            ) : (
              t(lang, "Se connecter", "Sign in")
            )}
          </Button>
        </form>

        <div className="text-xs text-gray-400 text-center mt-6">
          <a href="/" className="hover:text-gray-600 transition-colors">
            ← {t(lang, "Retour au site", "Back to site")}
          </a>
        </div>
      </div>
    </div>
  );
}
