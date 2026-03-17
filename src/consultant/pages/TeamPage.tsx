import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  UserPlus, Mail, Search, X, CheckCircle2,
  Clock, Shield, Briefcase, Loader2,
} from "lucide-react";
import { C, HDR_FONT } from "@/lib/constants";
import { useLang, useTheme } from "@/lib/contexts";
import { useConsultant } from "../contexts/ConsultantContext";

interface TeamMember {
  consultantId: string;
  name: string;
  email: string;
  role: string;
  specialties: string[];
  activeReviews: number;
  completedTotal: number;
  avgHours: number;
  slaPercent: number;
  status: "active" | "inactive";
}

export function TeamPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const { session } = useConsultant();
  const bi = (v: { fr: string; en: string }) => (lang === "fr" ? v.fr : v.en);

  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"consultant" | "supervisor">("consultant");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/consultant/team", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setTeam(data.consultants ?? []);
        }
      } catch { /* ignore */ }
      finally { setLoading(false); }
    })();
  }, []);

  // Fallback demo data
  const teamMembers: TeamMember[] = team.length > 0 ? team : [
    { consultantId: "1", name: "Marie-Claire Dubois", email: "mc.dubois@talsom.com", role: "supervisor", specialties: ["AI Strategy", "Governance", "Data"], activeReviews: 3, completedTotal: 87, avgHours: 14, slaPercent: 97, status: "active" },
    { consultantId: "2", name: "Jean-François Tremblay", email: "jf.tremblay@talsom.com", role: "consultant", specialties: ["Change Management", "OCM", "Training"], activeReviews: 2, completedTotal: 54, avgHours: 22, slaPercent: 91, status: "active" },
    { consultantId: "3", name: "Sophie Chen", email: "s.chen@talsom.com", role: "consultant", specialties: ["Process Design", "Technology", "Cloud"], activeReviews: 3, completedTotal: 72, avgHours: 16, slaPercent: 95, status: "active" },
    { consultantId: "4", name: "Alexandre Bouchard", email: "a.bouchard@talsom.com", role: "consultant", specialties: ["AI Strategy", "Business Case"], activeReviews: 0, completedTotal: 23, avgHours: 20, slaPercent: 88, status: "inactive" },
  ];

  const filtered = search.trim()
    ? teamMembers.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()))
    : teamMembers;

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    try {
      await fetch("/api/consultant/team/invite", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
    } catch { /* ignore */ }
    setInviteEmail("");
    setShowInvite(false);
  };

  const roleColors: Record<string, { bg: string; text: string }> = {
    supervisor: { bg: `${C.green}20`, text: C.green },
    consultant: { bg: "#3b82f620", text: "#3b82f6" },
    admin: { bg: "#8b5cf620", text: "#8b5cf6" },
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ ...HDR_FONT, color: dark ? "white" : C.green }}>
            {bi({ fr: "Gestion de l'équipe", en: "Team Management" })}
          </h1>
          <p className={`text-sm mt-1 ${dark ? "text-white/40" : "text-gray-500"}`}>
            {bi({ fr: `${teamMembers.length} consultants`, en: `${teamMembers.length} consultants` })}
          </p>
        </div>
        <Button
          size="sm"
          className="rounded-full gap-1.5 border-0"
          style={{ background: C.green, color: C.yellow }}
          onClick={() => setShowInvite(!showInvite)}
        >
          <UserPlus className="w-3.5 h-3.5" />
          {bi({ fr: "Inviter", en: "Invite" })}
        </Button>
      </div>

      {/* Invite form */}
      {showInvite && (
        <Card className={`mb-6 rounded-xl ${dark ? "bg-gray-900 border-white/5" : "border-gray-100"}`}>
          <CardContent className="p-4">
            <h3 className={`text-sm font-semibold mb-3 ${dark ? "text-white" : "text-gray-900"}`}>
              {bi({ fr: "Inviter un consultant", en: "Invite a consultant" })}
            </h3>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${dark ? "text-white/30" : "text-gray-400"}`} />
                <Input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="email@talsom.com"
                  className={`pl-9 rounded-lg ${dark ? "bg-white/5 border-white/10 text-white" : ""}`}
                />
              </div>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as "consultant" | "supervisor")}
                className={`rounded-lg px-3 text-sm border ${dark ? "bg-white/5 border-white/10 text-white" : "border-gray-200"}`}
              >
                <option value="consultant">{bi({ fr: "Consultant", en: "Consultant" })}</option>
                <option value="supervisor">{bi({ fr: "Superviseur", en: "Supervisor" })}</option>
              </select>
              <Button onClick={handleInvite} className="rounded-lg" style={{ background: C.green, color: C.yellow }}>
                {bi({ fr: "Envoyer", en: "Send" })}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative max-w-sm mb-6">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${dark ? "text-white/30" : "text-gray-400"}`} />
        <Input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder={bi({ fr: "Rechercher un consultant...", en: "Search consultants..." })}
          className={`pl-9 rounded-full ${dark ? "bg-white/5 border-white/10 text-white placeholder:text-white/30" : ""}`}
        />
        {search && (
          <button onClick={() => setSearch("")} className={`absolute right-3 top-1/2 -translate-y-1/2 ${dark ? "text-white/30" : "text-gray-400"}`}>
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className={`w-5 h-5 animate-spin ${dark ? "text-white/30" : "text-gray-400"}`} />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((member) => {
            const rc = roleColors[member.role] ?? roleColors.consultant;
            return (
              <Card key={member.consultantId} className={`rounded-xl border transition-all hover:shadow-md ${dark ? "bg-gray-900 border-white/5 hover:border-white/10" : "border-gray-100 hover:border-gray-200"}`}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{ background: C.green, color: C.yellow }}>
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-semibold truncate ${dark ? "text-white" : "text-gray-900"}`}>{member.name}</p>
                        {member.status === "inactive" && (
                          <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 rounded-full text-gray-400 border-gray-300">
                            {bi({ fr: "Inactif", en: "Inactive" })}
                          </Badge>
                        )}
                      </div>
                      <p className={`text-xs truncate ${dark ? "text-white/40" : "text-gray-500"}`}>{member.email}</p>
                      <Badge className="mt-1 text-[9px] px-1.5 py-0 h-4 rounded-full border-0" style={{ background: rc.bg, color: rc.text }}>
                        {member.role === "supervisor" ? bi({ fr: "Superviseur", en: "Supervisor" }) : bi({ fr: "Consultant", en: "Consultant" })}
                      </Badge>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {member.specialties.map(s => (
                      <Badge key={s} variant="outline" className={`text-[9px] px-1.5 py-0 h-4 rounded-full ${dark ? "border-white/10 text-white/40" : ""}`}>
                        {s}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { icon: Briefcase, value: member.activeReviews, label: bi({ fr: "Actives", en: "Active" }) },
                      { icon: CheckCircle2, value: member.completedTotal, label: bi({ fr: "Total", en: "Total" }) },
                      { icon: Clock, value: `${member.avgHours}h`, label: bi({ fr: "Moy.", en: "Avg" }) },
                      { icon: Shield, value: `${member.slaPercent}%`, label: "SLA" },
                    ].map((stat, i) => (
                      <div key={i} className="text-center">
                        <p className={`text-sm font-bold ${dark ? "text-white" : "text-gray-900"}`}>{stat.value}</p>
                        <p className={`text-[9px] ${dark ? "text-white/30" : "text-gray-400"}`}>{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
