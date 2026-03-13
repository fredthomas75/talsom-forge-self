import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  User, Building2, CreditCard, Loader2, Check, AlertCircle, ExternalLink,
  Cloud, Link2, Unlink, CheckCircle2,
} from "lucide-react";
import { C, HDR_FONT } from "@/lib/constants";
import { useLang, useTheme } from "@/lib/contexts";
import { useClient } from "../contexts/ClientContext";
import { clientI18n } from "../i18n";
import { useCloudIntegrations, type Provider } from "../hooks/useCloudIntegrations";

type Tab = "profile" | "tenant" | "plan" | "integrations";

const PLAN_FEATURES: Record<string, {
  name: { fr: string; en: string };
  price: { fr: string; en: string };
  annual?: { fr: string; en: string };
  features: { fr: string; en: string }[];
}> = {
  free: {
    name: { fr: "Explorer", en: "Explorer" },
    price: { fr: "Gratuit", en: "Free" },
    features: [
      { fr: "Chat AI Expert (10 msg/mois)", en: "AI Expert Chat (10 msg/month)" },
      { fr: "1 Quick Scan AI (partiel)", en: "1 Quick Scan AI (partial)" },
      { fr: "Acc\u00e8s marketplace (lecture seule)", en: "Marketplace access (read-only)" },
      { fr: "Support communautaire", en: "Community support" },
    ],
  },
  starter: {
    name: { fr: "Starter", en: "Starter" },
    price: { fr: "349$/mois", en: "$349/mo" },
    annual: { fr: "3 490$/an", en: "$3,490/yr" },
    features: [
      { fr: "Chat AI Expert (100 msg/mois)", en: "AI Expert Chat (100 msg/month)" },
      { fr: "3 Quick Scans AI complets/mois", en: "3 full Quick Scans AI/month" },
      { fr: "5 cr\u00e9dits consulting/mois", en: "5 consulting credits/month" },
      { fr: "Livrables AI (templates)", en: "AI Deliverables (templates)" },
      { fr: "Outils Marketplace \u00e0 la carte", en: "Marketplace tools \u00e0 la carte" },
      { fr: "Support email (48h)", en: "Email support (48h)" },
    ],
  },
  pro: {
    name: { fr: "Professional", en: "Professional" },
    price: { fr: "990$/mois", en: "$990/mo" },
    annual: { fr: "9 900$/an", en: "$9,900/yr" },
    features: [
      { fr: "Chat AI Expert illimit\u00e9", en: "Unlimited AI Expert Chat" },
      { fr: "Quick Scans AI illimit\u00e9s", en: "Unlimited Quick Scans AI" },
      { fr: "25 cr\u00e9dits consulting/mois", en: "25 consulting credits/month" },
      { fr: "Livrables AI complets (Excel, Word, PPTX)", en: "Full AI deliverables (Excel, Word, PPTX)" },
      { fr: "Ateliers virtuels co-facilit\u00e9s AI", en: "AI co-facilitated virtual workshops" },
      { fr: "Outils Marketplace (rabais 15-25%)", en: "Marketplace tools (15-25% discount)" },
      { fr: "Support prioritaire (24h)", en: "Priority support (24h)" },
    ],
  },
  enterprise: {
    name: { fr: "Entreprise", en: "Enterprise" },
    price: { fr: "Sur mesure", en: "Custom" },
    features: [
      { fr: "Tout Professional +", en: "Everything in Professional +" },
      { fr: "Consultants seniors d\u00e9di\u00e9s", en: "Dedicated senior consultants" },
      { fr: "Livrables personnalis\u00e9s \u00e0 votre marque", en: "Brand-customized deliverables" },
      { fr: "Ateliers et formations sur mesure", en: "Custom workshops and training" },
      { fr: "Outils Marketplace inclus", en: "Marketplace tools included" },
      { fr: "SLA garanti + support d\u00e9di\u00e9", en: "Guaranteed SLA + dedicated support" },
    ],
  },
};

// Google Workspace SVG logo
function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

// Microsoft 365 SVG logo
function MicrosoftLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
      <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
      <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
      <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
    </svg>
  );
}

export function SettingsPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const { user, tenant, session, refresh } = useClient();
  const bi = (v: { fr: string; en: string }) => (lang === "fr" ? v.fr : v.en);

  // Check URL params for integrations tab auto-select (after OAuth redirect)
  const [tab, setTab] = useState<Tab>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("tab") === "integrations") return "integrations";
    return "profile";
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Profile form
  const [profileName, setProfileName] = useState(user?.name ?? "");

  // Tenant form
  const [tenantName, setTenantName] = useState(tenant?.tenantName ?? "");
  const [billingEmail, setBillingEmail] = useState("");

  // Cloud integrations
  const cloud = useCloudIntegrations(session.access_token);
  const [connectingProvider, setConnectingProvider] = useState<Provider | null>(null);
  const [oauthSuccess, setOauthSuccess] = useState<string | null>(null);

  // Load integrations when tab is selected
  useEffect(() => {
    if (tab === "integrations") {
      cloud.fetchConnections();
      // Check for OAuth success/error from redirect
      const params = new URLSearchParams(window.location.search);
      const success = params.get("success");
      const oauthError = params.get("error");
      if (success) {
        setOauthSuccess(success);
        // Clean URL
        window.history.replaceState({}, "", window.location.pathname);
        setTimeout(() => setOauthSuccess(null), 4000);
      }
      if (oauthError) {
        setError(oauthError === "oauth_denied" ? bi({ fr: "Accès refusé", en: "Access denied" }) : oauthError);
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, [tab]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const body = tab === "profile"
        ? { name: profileName }
        : { tenantName, billingEmail };

      const res = await fetch("/api/client/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ tab, ...body }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Save failed");
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  };

  const handleCheckout = async (plan: string) => {
    try {
      const res = await fetch("/api/client/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {}
  };

  const handlePortal = async () => {
    try {
      const res = await fetch("/api/client/billing/portal", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {}
  };

  const handleConnect = async (provider: Provider) => {
    setConnectingProvider(provider);
    await cloud.connect(provider);
    setConnectingProvider(null);
  };

  const handleDisconnect = async (provider: Provider) => {
    if (!confirm(bi({ fr: `Déconnecter ${provider === "google" ? "Google Workspace" : "Microsoft 365"} ?`, en: `Disconnect ${provider === "google" ? "Google Workspace" : "Microsoft 365"}?` }))) return;
    await cloud.disconnect(provider);
  };

  const tabs: { key: Tab; label: string; icon: typeof User }[] = [
    { key: "profile", label: bi({ fr: "Profil", en: "Profile" }), icon: User },
    { key: "tenant", label: bi({ fr: "Entreprise", en: "Company" }), icon: Building2 },
    { key: "plan", label: bi(clientI18n.plan), icon: CreditCard },
    { key: "integrations", label: bi(clientI18n.integrations), icon: Cloud },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      <h1 className={`text-2xl font-bold tracking-tight mb-6 ${dark ? "text-white" : ""}`} style={{ ...HDR_FONT, color: dark ? undefined : C.green }}>
        {bi(clientI18n.settings)}
      </h1>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 flex-wrap">
        {tabs.map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={tab === key ? "default" : "ghost"}
            size="sm"
            onClick={() => setTab(key)}
            className="rounded-full text-xs gap-1.5"
            style={tab === key ? { background: C.green, color: "white" } : undefined}
          >
            <Icon className="w-3.5 h-3.5" />{label}
          </Button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "profile" && (
        <Card className={`rounded-xl border ${dark ? "bg-gray-900 border-white/5" : "border-gray-100"}`}>
          <CardContent className="p-6 space-y-4">
            {error && <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2"><AlertCircle className="w-4 h-4" />{error}</div>}
            <div>
              <label className={`text-xs font-medium mb-1.5 block ${dark ? "text-white/40" : "text-gray-500"}`}>{bi(clientI18n.name)}</label>
              <Input value={profileName} onChange={(e) => setProfileName(e.target.value)} className={`rounded-lg ${dark ? "bg-white/5 border-white/10 text-white" : ""}`} />
            </div>
            <div>
              <label className={`text-xs font-medium mb-1.5 block ${dark ? "text-white/40" : "text-gray-500"}`}>{bi(clientI18n.email)}</label>
              <Input value={user?.email ?? ""} disabled className="rounded-lg" />
              <p className={`text-[10px] mt-1 ${dark ? "text-white/20" : "text-gray-400"}`}>
                {bi({ fr: "Le courriel ne peut pas être modifié ici", en: "Email cannot be changed here" })}
              </p>
            </div>
            <Button onClick={handleSave} disabled={saving} className="rounded-full font-semibold border-0" style={{ background: C.yellow, color: C.green }}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <><Check className="w-4 h-4 mr-1" />{bi(clientI18n.save)}</> : bi(clientI18n.save)}
            </Button>
          </CardContent>
        </Card>
      )}

      {tab === "tenant" && (
        <Card className={`rounded-xl border ${dark ? "bg-gray-900 border-white/5" : "border-gray-100"}`}>
          <CardContent className="p-6 space-y-4">
            {error && <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2"><AlertCircle className="w-4 h-4" />{error}</div>}
            <div>
              <label className={`text-xs font-medium mb-1.5 block ${dark ? "text-white/40" : "text-gray-500"}`}>
                {bi({ fr: "Nom de l'entreprise", en: "Company name" })}
              </label>
              <Input value={tenantName} onChange={(e) => setTenantName(e.target.value)} className={`rounded-lg ${dark ? "bg-white/5 border-white/10 text-white" : ""}`} />
            </div>
            <div>
              <label className={`text-xs font-medium mb-1.5 block ${dark ? "text-white/40" : "text-gray-500"}`}>
                {bi({ fr: "Email de facturation", en: "Billing email" })}
              </label>
              <Input type="email" value={billingEmail} onChange={(e) => setBillingEmail(e.target.value)} className={`rounded-lg ${dark ? "bg-white/5 border-white/10 text-white" : ""}`} />
            </div>
            <Button onClick={handleSave} disabled={saving} className="rounded-full font-semibold border-0" style={{ background: C.yellow, color: C.green }}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : bi(clientI18n.save)}
            </Button>
          </CardContent>
        </Card>
      )}

      {tab === "plan" && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(PLAN_FEATURES).map(([key, plan]) => {
              const isCurrent = tenant?.plan === key;
              return (
                <Card key={key} className={`rounded-xl border transition-all ${isCurrent ? "ring-2 ring-[#003533]" : ""} ${dark ? "bg-gray-900 border-white/5" : "border-gray-100"}`}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`text-sm font-bold ${dark ? "text-white" : "text-gray-900"}`}>{bi(plan.name)}</h3>
                      {isCurrent && <Badge className="text-[9px] rounded-full border-0" style={{ background: C.green, color: C.yellow }}>Current</Badge>}
                    </div>
                    <p className="text-xl font-bold" style={{ ...HDR_FONT, color: C.green }}>{bi(plan.price)}</p>
                    {plan.annual && (
                      <p className={`text-[10px] mb-1 ${dark ? "text-white/25" : "text-gray-400"}`}>{bi(plan.annual)}</p>
                    )}
                    <Separator className={`mb-3 mt-2 ${dark ? "bg-white/5" : ""}`} />
                    <div className="space-y-1.5 mb-4">
                      {plan.features.map((f, i) => (
                        <p key={i} className={`text-[11px] ${dark ? "text-white/40" : "text-gray-500"}`}>✓ {bi(f)}</p>
                      ))}
                    </div>
                    {!isCurrent && key !== "enterprise" && (
                      <Button onClick={() => handleCheckout(key)} size="sm" className="w-full rounded-full text-xs border-0" style={{ background: C.yellow, color: C.green }}>
                        {bi(clientI18n.upgrade)}
                      </Button>
                    )}
                    {key === "enterprise" && !isCurrent && (
                      <a href="/#contact">
                        <Button variant="outline" size="sm" className="w-full rounded-full text-xs">
                          {bi({ fr: "Nous contacter", en: "Contact us" })}
                        </Button>
                      </a>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Stripe portal */}
          <Button onClick={handlePortal} variant="outline" className="rounded-full text-xs gap-1.5">
            <ExternalLink className="w-3.5 h-3.5" />
            {bi({ fr: "Gérer la facturation (Stripe)", en: "Manage billing (Stripe)" })}
          </Button>
        </div>
      )}

      {tab === "integrations" && (
        <div className="space-y-4">
          {/* Success banner */}
          {oauthSuccess && (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-xl px-4 py-3 border border-green-200">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {bi({
                fr: `${oauthSuccess === "google" ? "Google Workspace" : "Microsoft 365"} connecté avec succès !`,
                en: `${oauthSuccess === "google" ? "Google Workspace" : "Microsoft 365"} connected successfully!`,
              })}
            </div>
          )}

          {cloud.error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />{cloud.error}
            </div>
          )}

          <p className={`text-sm ${dark ? "text-white/50" : "text-gray-500"}`}>
            {bi({
              fr: "Connectez Google Workspace ou Microsoft 365 pour importer vos fichiers dans les conversations IA et exporter les livrables générés.",
              en: "Connect Google Workspace or Microsoft 365 to import your files into AI conversations and export generated deliverables.",
            })}
          </p>

          {/* Google Workspace card */}
          <IntegrationCard
            dark={dark}
            logo={<GoogleLogo className="w-8 h-8" />}
            title="Google Workspace"
            description={bi(clientI18n.googleDriveDesc)}
            provider="google"
            connection={cloud.getConnection("google")}
            loading={cloud.loading || connectingProvider === "google"}
            onConnect={() => handleConnect("google")}
            onDisconnect={() => handleDisconnect("google")}
            bi={bi}
          />

          {/* Microsoft 365 card */}
          <IntegrationCard
            dark={dark}
            logo={<MicrosoftLogo className="w-7 h-7" />}
            title="Microsoft 365"
            description={bi(clientI18n.oneDriveDesc)}
            provider="microsoft"
            connection={cloud.getConnection("microsoft")}
            loading={cloud.loading || connectingProvider === "microsoft"}
            onConnect={() => handleConnect("microsoft")}
            onDisconnect={() => handleDisconnect("microsoft")}
            bi={bi}
          />
        </div>
      )}
    </div>
  );
}

// ─── Integration Card ───────────────────────────────
function IntegrationCard({
  dark, logo, title, description, provider, connection, loading,
  onConnect, onDisconnect, bi,
}: {
  dark: boolean;
  logo: React.ReactNode;
  title: string;
  description: string;
  provider: Provider;
  connection: { account_email: string | null } | null;
  loading: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  bi: (v: { fr: string; en: string }) => string;
}) {
  const isConnected = !!connection;

  return (
    <Card className={`rounded-xl border ${dark ? "bg-gray-900 border-white/5" : "border-gray-100"}`}>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* Logo */}
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${dark ? "bg-white/5" : "bg-gray-50"}`}>
            {logo}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`text-sm font-bold ${dark ? "text-white" : "text-gray-900"}`}>{title}</h3>
              {isConnected ? (
                <Badge className="text-[10px] rounded-full border-0 gap-1" style={{ background: "#dcfce7", color: "#166534" }}>
                  <CheckCircle2 className="w-3 h-3" />
                  {bi(clientI18n.connected)}
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-[10px] rounded-full">
                  {bi(clientI18n.notConnected)}
                </Badge>
              )}
            </div>

            <p className={`text-xs mb-3 ${dark ? "text-white/40" : "text-gray-500"}`}>
              {description}
            </p>

            {isConnected && connection?.account_email && (
              <p className={`text-xs mb-3 ${dark ? "text-white/30" : "text-gray-400"}`}>
                {bi(clientI18n.connectedAs)} <span className="font-medium">{connection.account_email}</span>
              </p>
            )}

            <div className="flex gap-2">
              {isConnected ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDisconnect}
                  disabled={loading}
                  className={`rounded-full text-xs gap-1.5 ${dark ? "border-white/10 text-white/60 hover:text-red-400 hover:border-red-400/30" : "hover:text-red-600 hover:border-red-200"}`}
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Unlink className="w-3.5 h-3.5" />}
                  {bi(clientI18n.disconnect)}
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={onConnect}
                  disabled={loading}
                  className="rounded-full text-xs gap-1.5 border-0 font-semibold"
                  style={{ background: C.green, color: C.yellow }}
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Link2 className="w-3.5 h-3.5" />}
                  {provider === "google" ? bi(clientI18n.connectGoogle) : bi(clientI18n.connectMicrosoft)}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
