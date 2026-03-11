import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft, Loader2, UserPlus, CheckCircle2, AlertTriangle,
  Send, Save,
} from "lucide-react";
import { C, HDR_FONT } from "@/lib/constants";
import { useLang, useTheme } from "@/lib/contexts";
import { useConsultant } from "../contexts/ConsultantContext";
import { consultantI18n } from "../i18n";

interface ReviewData {
  id: string;
  conversation_id: string;
  tenant_id: string;
  user_id: string;
  tool_name: string;
  status: string;
  consultant_id: string | null;
  consultant_name: string | null;
  original_content: string | null;
  review_notes: string | null;
  client_feedback: string | null;
  modified_content: string | null;
  modified_file_url: string | null;
  requested_at: string;
  assigned_at: string | null;
  reviewed_at: string | null;
  delivered_at: string | null;
}

interface Message {
  role: string;
  content: string;
  created_at: string;
}

interface TenantInfo {
  name: string;
  plan: string;
}

export function ReviewDetailPage() {
  const { reviewId } = useParams<{ reviewId: string }>();
  const navigate = useNavigate();
  const { lang } = useLang();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const { user, session } = useConsultant();
  const bi = (v: { fr: string; en: string }) => (lang === "fr" ? v.fr : v.en);

  const [review, setReview] = useState<ReviewData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [tenant, setTenant] = useState<TenantInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [delivering, setDelivering] = useState(false);

  // Editable fields
  const [reviewNotes, setReviewNotes] = useState("");
  const [clientFeedback, setClientFeedback] = useState("");
  const [modifiedContent, setModifiedContent] = useState("");

  useEffect(() => {
    if (!reviewId) return;
    (async () => {
      try {
        const res = await fetch(`/api/consultant/reviews/${reviewId}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setReview(data.review);
          setMessages(data.messages ?? []);
          setTenant(data.tenant ?? null);
          setReviewNotes(data.review.review_notes ?? "");
          setClientFeedback(data.review.client_feedback ?? "");
          setModifiedContent(data.review.modified_content ?? data.review.original_content ?? "");
        }
      } catch { /* ignore */ }
      finally { setLoading(false); }
    })();
  }, [reviewId]);

  const handleAssign = async () => {
    if (!review) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/consultant/reviews/${review.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ action: "assign" }),
      });
      if (res.ok) {
        setReview((r) => r ? { ...r, status: "in_review", consultant_id: user!.consultantId, consultant_name: user!.name, assigned_at: new Date().toISOString() } : r);
      }
    } catch { /* ignore */ }
    finally { setSaving(false); }
  };

  const handleSave = async () => {
    if (!review) return;
    setSaving(true);
    try {
      await fetch(`/api/consultant/reviews/${review.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ review_notes: reviewNotes, client_feedback: clientFeedback, modified_content: modifiedContent }),
      });
    } catch { /* ignore */ }
    finally { setSaving(false); }
  };

  const handleStatusChange = async (status: string) => {
    if (!review) return;
    setSaving(true);
    try {
      await fetch(`/api/consultant/reviews/${review.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ status, review_notes: reviewNotes, client_feedback: clientFeedback, modified_content: modifiedContent }),
      });
      setReview((r) => r ? { ...r, status } : r);
    } catch { /* ignore */ }
    finally { setSaving(false); }
  };

  const handleDeliver = async () => {
    if (!review) return;
    setDelivering(true);
    try {
      // Save first
      await fetch(`/api/consultant/reviews/${review.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ review_notes: reviewNotes, client_feedback: clientFeedback, modified_content: modifiedContent }),
      });
      // Then deliver
      const res = await fetch(`/api/consultant/reviews/${review.id}/deliver`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        setReview((r) => r ? { ...r, status: "delivered", delivered_at: new Date().toISOString() } : r);
      }
    } catch { /* ignore */ }
    finally { setDelivering(false); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <Loader2 className={`w-5 h-5 animate-spin ${dark ? "text-white/30" : "text-gray-400"}`} />
      </div>
    );
  }

  if (!review) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <p className="text-red-500 text-sm">Review not found</p>
      </div>
    );
  }

  const isAssigned = review.consultant_id === user?.consultantId;
  const canEdit = isAssigned && !["delivered"].includes(review.status);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className={`flex items-center gap-3 px-4 py-3 border-b shrink-0 ${dark ? "border-white/5" : "border-gray-200"}`}>
        <Button variant="ghost" size="icon" onClick={() => navigate("/consultant/queue")}
          className={`rounded-lg ${dark ? "text-white/50" : "text-gray-500"}`}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold" style={{ ...HDR_FONT, color: C.green }}>
            {review.tool_name}
          </h2>
          <p className={`text-xs ${dark ? "text-white/40" : "text-gray-500"}`}>
            {tenant?.name ?? "—"} · {new Date(review.requested_at).toLocaleDateString(lang === "fr" ? "fr-CA" : "en-CA")}
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          {bi(consultantI18n[review.status as keyof typeof consultantI18n] ?? { fr: review.status, en: review.status })}
        </Badge>
      </div>

      {/* Two-column layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Conversation history (60%) */}
        <div className={`w-full md:w-3/5 border-r ${dark ? "border-white/5" : "border-gray-200"}`}>
          <div className={`px-4 py-2 border-b text-xs font-semibold ${dark ? "border-white/5 text-white/40" : "border-gray-100 text-gray-500"}`}>
            {bi(consultantI18n.conversationHistory)}
          </div>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "text-white"
                      : dark ? "bg-white/5 text-white/80" : "bg-gray-50 text-gray-800"
                  }`}
                  style={m.role === "user" ? { background: C.green } : undefined}>
                    {m.role === "assistant" ? (
                      <div className={`prose prose-sm max-w-none ${dark ? "prose-invert" : ""}`}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                      </div>
                    ) : m.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right: Actions panel (40%) */}
        <div className="hidden md:flex md:w-2/5 flex-col">
          <div className={`px-4 py-2 border-b text-xs font-semibold ${dark ? "border-white/5 text-white/40" : "border-gray-100 text-gray-500"}`}>
            {bi(consultantI18n.reviewActions)}
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {/* Assign button */}
              {!review.consultant_id && (
                <Button onClick={handleAssign} disabled={saving}
                  className="w-full rounded-full border-0 font-semibold"
                  style={{ background: C.green, color: C.yellow }}>
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserPlus className="w-4 h-4 mr-2" />}
                  {bi(consultantI18n.assignToMe)}
                </Button>
              )}

              {/* Internal notes */}
              <div>
                <label className={`text-xs font-semibold block mb-1.5 ${dark ? "text-white/50" : "text-gray-600"}`}>
                  {bi(consultantI18n.internalNotes)}
                </label>
                <textarea
                  value={reviewNotes} onChange={(e) => setReviewNotes(e.target.value)}
                  rows={3} disabled={!canEdit}
                  className={`w-full rounded-lg border text-sm p-2.5 resize-none ${
                    dark ? "bg-white/5 border-white/10 text-white placeholder:text-white/20" : "border-gray-200"
                  }`}
                  placeholder={bi({ fr: "Notes internes (invisible au client)...", en: "Internal notes (not visible to client)..." })}
                />
              </div>

              {/* Client feedback */}
              <div>
                <label className={`text-xs font-semibold block mb-1.5 ${dark ? "text-white/50" : "text-gray-600"}`}>
                  {bi(consultantI18n.clientFeedback)}
                </label>
                <textarea
                  value={clientFeedback} onChange={(e) => setClientFeedback(e.target.value)}
                  rows={3} disabled={!canEdit}
                  className={`w-full rounded-lg border text-sm p-2.5 resize-none ${
                    dark ? "bg-white/5 border-white/10 text-white placeholder:text-white/20" : "border-gray-200"
                  }`}
                  placeholder={bi({ fr: "Commentaire pour le client...", en: "Feedback for the client..." })}
                />
              </div>

              {/* Modified content */}
              <div>
                <label className={`text-xs font-semibold block mb-1.5 ${dark ? "text-white/50" : "text-gray-600"}`}>
                  {bi(consultantI18n.modifiedContent)}
                </label>
                <textarea
                  value={modifiedContent} onChange={(e) => setModifiedContent(e.target.value)}
                  rows={10} disabled={!canEdit}
                  className={`w-full rounded-lg border text-sm p-2.5 resize-none font-mono ${
                    dark ? "bg-white/5 border-white/10 text-white placeholder:text-white/20" : "border-gray-200"
                  }`}
                  placeholder={bi({ fr: "Contenu modifié / amélioré...", en: "Modified / improved content..." })}
                />
              </div>

              {/* Action buttons */}
              {canEdit && (
                <div className="space-y-2 pt-2">
                  <Button onClick={handleSave} disabled={saving} variant="outline" className="w-full rounded-full text-sm">
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    {bi(consultantI18n.saveChanges)}
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <Button onClick={() => handleStatusChange("approved")} disabled={saving}
                      className="rounded-full text-sm bg-green-600 hover:bg-green-700 text-white border-0">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      {bi(consultantI18n.approve)}
                    </Button>
                    <Button onClick={() => handleStatusChange("needs_revision")} disabled={saving}
                      variant="outline" className="rounded-full text-sm text-orange-600 border-orange-200 hover:bg-orange-50">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      {bi(consultantI18n.requestRevision)}
                    </Button>
                  </div>

                  <Button onClick={handleDeliver} disabled={delivering}
                    className="w-full rounded-full font-bold text-sm border-0"
                    style={{ background: C.green, color: C.yellow }}>
                    {delivering ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                    {bi(consultantI18n.deliver)}
                  </Button>
                </div>
              )}

              {review.status === "delivered" && (
                <div className="text-center py-4">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2" style={{ color: C.green }} />
                  <p className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-900"}`}>
                    {bi({ fr: "Livré", en: "Delivered" })}
                  </p>
                  <p className={`text-xs ${dark ? "text-white/40" : "text-gray-500"}`}>
                    {review.delivered_at ? new Date(review.delivered_at).toLocaleString(lang === "fr" ? "fr-CA" : "en-CA") : ""}
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
