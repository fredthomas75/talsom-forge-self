import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import {
  Key, Plus, Trash2, Copy, Check, Eye, EyeOff, Loader2, AlertCircle,
} from "lucide-react";
import { C, HDR_FONT } from "@/lib/constants";
import { useLang, useTheme } from "@/lib/contexts";
import { useClient } from "../contexts/ClientContext";
import { clientI18n } from "../i18n";

interface ApiKey {
  id: string;
  key_prefix: string;
  label: string;
  created_at: string;
  last_used_at: string | null;
  expires_at: string | null;
}

export function ApiKeysPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const { session, quotas } = useClient();
  const bi = (v: { fr: string; en: string }) => (lang === "fr" ? v.fr : v.en);

  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState("");

  const fetchKeys = async () => {
    try {
      const res = await fetch("/api/client/keys", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) setKeys((await res.json()).keys ?? []);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchKeys(); }, []);

  const handleCreate = async () => {
    if (!newLabel.trim()) return;
    setCreating(true);
    setError("");

    try {
      const res = await fetch("/api/client/keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ label: newLabel }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setNewKey(data.key);
      fetchKeys();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setCreating(false);
    }
  };

  const [revokeTarget, setRevokeTarget] = useState<string | null>(null);

  const confirmRevoke = async () => {
    if (!revokeTarget) return;
    await fetch(`/api/client/keys/${revokeTarget}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    setKeys((prev) => prev.filter((k) => k.id !== revokeTarget));
    setRevokeTarget(null);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const maxKeys = quotas?.max_api_keys ?? 1;
  const canCreate = maxKeys === -1 || keys.length < maxKeys;

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${dark ? "text-white" : ""}`} style={{ ...HDR_FONT, color: dark ? undefined : C.green }}>
            {bi(clientI18n.apiKeys)}
          </h1>
          <p className={`text-sm mt-1 ${dark ? "text-white/40" : "text-gray-500"}`}>
            {bi({ fr: `${keys.length} clé(s) sur ${maxKeys === -1 ? "∞" : maxKeys}`, en: `${keys.length} key(s) of ${maxKeys === -1 ? "∞" : maxKeys}` })}
          </p>
        </div>
        <Button
          onClick={() => { setCreateOpen(true); setNewKey(null); setNewLabel(""); setError(""); }}
          disabled={!canCreate}
          className="rounded-full font-semibold border-0"
          style={{ background: C.yellow, color: C.green }}
        >
          <Plus className="w-4 h-4 mr-2" />
          {bi(clientI18n.create)}
        </Button>
      </div>

      {/* Keys list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className={`w-5 h-5 animate-spin ${dark ? "text-white/30" : "text-gray-400"}`} />
        </div>
      ) : keys.length === 0 ? (
        <div className={`text-center py-16 rounded-xl border ${dark ? "border-white/5 bg-gray-900" : "border-gray-100 bg-white"}`}>
          <Key className={`w-8 h-8 mx-auto mb-3 ${dark ? "text-white/20" : "text-gray-300"}`} />
          <p className={`text-sm ${dark ? "text-white/30" : "text-gray-400"}`}>
            {bi({ fr: "Aucune clé API créée", en: "No API keys created" })}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {keys.map((k) => (
            <Card key={k.id} className={`rounded-xl border ${dark ? "bg-gray-900 border-white/5" : "border-gray-100"}`}>
              <CardContent className="p-4 flex items-center gap-4">
                <Key className="w-5 h-5 shrink-0" style={{ color: C.green }} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-900"}`}>{k.label}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <code className={`text-xs font-mono ${dark ? "text-white/30" : "text-gray-400"}`}>{k.key_prefix}••••••••</code>
                    <span className={`text-[10px] ${dark ? "text-white/20" : "text-gray-300"}`}>
                      {bi({ fr: "Créée le", en: "Created" })} {new Date(k.created_at).toLocaleDateString(lang === "fr" ? "fr-CA" : "en-CA")}
                    </span>
                    {k.last_used_at && (
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 rounded-full">
                        {bi({ fr: "Dernière utilisation", en: "Last used" })}: {new Date(k.last_used_at).toLocaleDateString(lang === "fr" ? "fr-CA" : "en-CA")}
                      </Badge>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setRevokeTarget(k.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Revoke confirmation */}
      <ConfirmDialog
        open={!!revokeTarget}
        onOpenChange={(open) => { if (!open) setRevokeTarget(null); }}
        title={bi({ fr: "Révoquer cette clé API ?", en: "Revoke this API key?" })}
        description={bi({ fr: "Les applications utilisant cette clé ne pourront plus accéder à l'API.", en: "Applications using this key will no longer be able to access the API." })}
        confirmLabel={bi({ fr: "Révoquer", en: "Revoke" })}
        cancelLabel={bi({ fr: "Annuler", en: "Cancel" })}
        destructive
        onConfirm={confirmRevoke}
        dark={dark}
      />

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className={dark ? "bg-gray-950 border-white/10" : ""}>
          <DialogHeader>
            <DialogTitle style={{ color: C.green }}>
              {bi({ fr: "Créer une clé API", en: "Create API Key" })}
            </DialogTitle>
            <DialogDescription>
              {bi({ fr: "La clé ne sera affichée qu'une seule fois", en: "The key will only be shown once" })}
            </DialogDescription>
          </DialogHeader>

          {newKey ? (
            <div className="space-y-4">
              <div className={`p-4 rounded-xl ${dark ? "bg-white/5" : "bg-gray-50"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-medium ${dark ? "text-white/40" : "text-gray-500"}`}>
                    {bi({ fr: "Votre clé API", en: "Your API key" })}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => setShowKey(!showKey)} className="h-6 px-2">
                    {showKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </Button>
                </div>
                <code className={`text-sm font-mono block break-all ${dark ? "text-white/80" : "text-gray-800"}`}>
                  {showKey ? newKey : "••••••••••••••••••••••••••••••••"}
                </code>
              </div>
              <Button onClick={() => handleCopy(newKey)} variant="outline" className="w-full rounded-full">
                {copied ? <><Check className="w-4 h-4 mr-2" />{bi(clientI18n.copied)}</> : <><Copy className="w-4 h-4 mr-2" />{bi(clientI18n.copy)}</>}
              </Button>
            </div>
          ) : (
            <>
              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}
              <Input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder={bi({ fr: "Nom de la clé (ex: Production)", en: "Key name (e.g. Production)" })}
                className={`rounded-lg ${dark ? "bg-white/5 border-white/10 text-white" : ""}`}
              />
              <DialogFooter>
                <Button
                  onClick={handleCreate}
                  disabled={creating || !newLabel.trim()}
                  className="rounded-full font-semibold border-0"
                  style={{ background: C.yellow, color: C.green }}
                >
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : bi(clientI18n.create)}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
