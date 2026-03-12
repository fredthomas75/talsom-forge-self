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
  Users, UserPlus, Trash2, Copy, Check, Loader2, AlertCircle, Crown, ShieldCheck,
} from "lucide-react";
import { C, HDR_FONT } from "@/lib/constants";
import { useLang, useTheme } from "@/lib/contexts";
import { useClient } from "../contexts/ClientContext";
import { clientI18n } from "../i18n";

interface Member {
  id: string;
  user_id: string;
  role: string;
  email?: string;
  accepted_at: string;
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  expires_at: string;
  token: string;
}

export function TeamPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const { session, tenant, quotas } = useClient();
  const bi = (v: { fr: string; en: string }) => (lang === "fr" ? v.fr : v.en);

  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "member">("member");
  const [inviting, setInviting] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const fetchTeam = async () => {
    try {
      const res = await fetch("/api/client/team", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members ?? []);
        setInvitations(data.invitations ?? []);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTeam(); }, []);

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setError("");

    try {
      const res = await fetch("/api/client/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setInviteLink(data.link);
      fetchTeam();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setInviting(false);
    }
  };

  const [removeTarget, setRemoveTarget] = useState<string | null>(null);

  const confirmRemove = async () => {
    if (!removeTarget) return;
    await fetch(`/api/client/team/${removeTarget}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    setRemoveTarget(null);
    fetchTeam();
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const roleIcon = (role: string) => {
    if (role === "owner") return <Crown className="w-3.5 h-3.5" style={{ color: C.yellow }} />;
    if (role === "admin") return <ShieldCheck className="w-3.5 h-3.5" style={{ color: C.green }} />;
    return <Users className="w-3.5 h-3.5" />;
  };

  const maxMembers = quotas?.max_team_members ?? 1;
  const canInvite = maxMembers === -1 || members.length < maxMembers;
  const isOwner = tenant?.role === "owner";

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${dark ? "text-white" : ""}`} style={{ ...HDR_FONT, color: dark ? undefined : C.green }}>
            {bi(clientI18n.team)}
          </h1>
          <p className={`text-sm mt-1 ${dark ? "text-white/40" : "text-gray-500"}`}>
            {bi({ fr: `${members.length} membre(s) sur ${maxMembers === -1 ? "∞" : maxMembers}`, en: `${members.length} member(s) of ${maxMembers === -1 ? "∞" : maxMembers}` })}
          </p>
        </div>
        {isOwner && (
          <Button
            onClick={() => { setInviteOpen(true); setInviteLink(null); setInviteEmail(""); setError(""); }}
            disabled={!canInvite}
            className="rounded-full font-semibold border-0"
            style={{ background: C.yellow, color: C.green }}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            {bi(clientI18n.inviteMember)}
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className={`w-5 h-5 animate-spin ${dark ? "text-white/30" : "text-gray-400"}`} />
        </div>
      ) : (
        <>
          {/* Members */}
          <div className="space-y-3 mb-8">
            {members.map((m) => (
              <Card key={m.id} className={`rounded-xl border ${dark ? "bg-gray-900 border-white/5" : "border-gray-100"}`}>
                <CardContent className="p-4 flex items-center gap-4">
                  {roleIcon(m.role)}
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-900"}`}>{m.email || m.user_id.slice(0, 8)}</p>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 rounded-full mt-0.5">{m.role}</Badge>
                  </div>
                  {isOwner && m.role !== "owner" && (
                    <Button variant="ghost" size="sm" onClick={() => setRemoveTarget(m.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pending invitations */}
          {invitations.length > 0 && (
            <>
              <h3 className={`text-sm font-semibold mb-3 ${dark ? "text-white/50" : "text-gray-500"}`}>
                {bi({ fr: "Invitations en attente", en: "Pending invitations" })}
              </h3>
              <div className="space-y-2">
                {invitations.map((inv) => (
                  <div key={inv.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${dark ? "bg-white/5 text-white/50" : "bg-gray-50 text-gray-600"}`}>
                    <span className="flex-1">{inv.email}</span>
                    <Badge variant="outline" className="text-[10px] rounded-full">{inv.role}</Badge>
                    <span className={`text-[10px] ${dark ? "text-white/20" : "text-gray-400"}`}>
                      {bi({ fr: "Expire le", en: "Expires" })} {new Date(inv.expires_at).toLocaleDateString(lang === "fr" ? "fr-CA" : "en-CA")}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Remove member confirmation */}
      <ConfirmDialog
        open={!!removeTarget}
        onOpenChange={(open) => { if (!open) setRemoveTarget(null); }}
        title={bi({ fr: "Retirer ce membre ?", en: "Remove this member?" })}
        description={bi({ fr: "Ce membre n'aura plus accès au portail client.", en: "This member will no longer have access to the client portal." })}
        confirmLabel={bi({ fr: "Retirer", en: "Remove" })}
        cancelLabel={bi({ fr: "Annuler", en: "Cancel" })}
        destructive
        onConfirm={confirmRemove}
        dark={dark}
      />

      {/* Invite dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className={dark ? "bg-gray-950 border-white/10" : ""}>
          <DialogHeader>
            <DialogTitle style={{ color: C.green }}>{bi(clientI18n.inviteMember)}</DialogTitle>
            <DialogDescription>
              {bi({ fr: "Un lien d'invitation sera généré", en: "An invite link will be generated" })}
            </DialogDescription>
          </DialogHeader>

          {inviteLink ? (
            <div className="space-y-4">
              <div className={`p-4 rounded-xl ${dark ? "bg-white/5" : "bg-gray-50"}`}>
                <p className={`text-xs font-medium mb-2 ${dark ? "text-white/40" : "text-gray-500"}`}>
                  {bi({ fr: "Lien d'invitation", en: "Invite link" })}
                </p>
                <code className={`text-xs block break-all ${dark ? "text-white/70" : "text-gray-700"}`}>{inviteLink}</code>
              </div>
              <Button onClick={() => handleCopy(inviteLink)} variant="outline" className="w-full rounded-full">
                {copied ? <><Check className="w-4 h-4 mr-2" />{bi(clientI18n.copied)}</> : <><Copy className="w-4 h-4 mr-2" />{bi(clientI18n.copy)}</>}
              </Button>
            </div>
          ) : (
            <>
              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />{error}
                </div>
              )}
              <Input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="email@example.com" className={`rounded-lg ${dark ? "bg-white/5 border-white/10 text-white" : ""}`} />
              <div className="flex gap-2">
                {(["member", "admin"] as const).map((r) => (
                  <Button key={r} variant={inviteRole === r ? "default" : "outline"} size="sm" onClick={() => setInviteRole(r)} className="rounded-full text-xs flex-1"
                    style={inviteRole === r ? { background: C.green, color: "white" } : undefined}
                  >
                    {r}
                  </Button>
                ))}
              </div>
              <DialogFooter>
                <Button onClick={handleInvite} disabled={inviting || !inviteEmail.trim()} className="rounded-full font-semibold border-0" style={{ background: C.yellow, color: C.green }}>
                  {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : bi(clientI18n.inviteMember)}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
