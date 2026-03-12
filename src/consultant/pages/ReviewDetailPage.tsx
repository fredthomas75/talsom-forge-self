import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import {
  ArrowLeft, Loader2, UserPlus, CheckCircle2, AlertTriangle,
  Send, Save, FileText, PenLine, MessageSquare, Download, Eye,
  Upload, File, RefreshCw, X,
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
  original_file_url: string | null;
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

type LeftTab = "deliverable" | "modified" | "conversation";

const MAX_UPLOAD_SIZE = 10 * 1024 * 1024; // 10 MB

function readFileAsBase64(file: globalThis.File): Promise<{ name: string; data: string; mime: string; size: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1] ?? "";
      resolve({ name: file.name, data: base64, mime: file.type, size: file.size });
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
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
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Left panel tab
  const [leftTab, setLeftTab] = useState<LeftTab>("deliverable");
  // Modified content: edit vs preview
  const [editMode, setEditMode] = useState(true);

  // Editable fields
  const [reviewNotes, setReviewNotes] = useState("");
  const [clientFeedback, setClientFeedback] = useState("");
  const [modifiedContent, setModifiedContent] = useState("");
  const [modifiedFileUrl, setModifiedFileUrl] = useState<string | null>(null);
  const [modifiedFileName, setModifiedFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Track unsaved changes for beforeunload
  const [savedNotes, setSavedNotes] = useState("");
  const [savedFeedback, setSavedFeedback] = useState("");
  const [savedContent, setSavedContent] = useState("");

  const isDirty = reviewNotes !== savedNotes || clientFeedback !== savedFeedback || modifiedContent !== savedContent;

  useEffect(() => {
    if (!isDirty) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Deliver confirmation state
  const [deliverConfirmOpen, setDeliverConfirmOpen] = useState(false);

  // Show toast briefly
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

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
          const notes = data.review.review_notes ?? "";
          const feedback = data.review.client_feedback ?? "";
          const content = data.review.modified_content ?? data.review.original_content ?? "";
          setReviewNotes(notes);
          setClientFeedback(feedback);
          setModifiedContent(content);
          setSavedNotes(notes);
          setSavedFeedback(feedback);
          setSavedContent(content);
          setModifiedFileUrl(data.review.modified_file_url ?? null);
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
      const res = await fetch(`/api/consultant/reviews/${review.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ review_notes: reviewNotes, client_feedback: clientFeedback, modified_content: modifiedContent }),
      });
      if (res.ok) {
        setSavedNotes(reviewNotes);
        setSavedFeedback(clientFeedback);
        setSavedContent(modifiedContent);
        showToast(bi(consultantI18n.savedSuccess));
      }
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
      // Save content first
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
        showToast(bi(consultantI18n.deliveredSuccess));
      }
    } catch { /* ignore */ }
    finally { setDelivering(false); }
  };

  const handleReopen = async () => {
    if (!review) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/consultant/reviews/${review.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ status: "in_review" }),
      });
      if (res.ok) {
        setReview((r) => r ? { ...r, status: "in_review" } : r);
      }
    } catch { /* ignore */ }
    finally { setSaving(false); }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !review) return;
    e.target.value = "";

    if (file.size > MAX_UPLOAD_SIZE) {
      alert(lang === "fr" ? "Fichier trop volumineux (max 10 MB)" : "File too large (max 10 MB)");
      return;
    }

    setUploading(true);
    try {
      const { name, data, mime } = await readFileAsBase64(file);

      const res = await fetch(`/api/consultant/reviews/${review.id}/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ file_name: name, file_data: data, mime_type: mime }),
      });

      if (res.ok) {
        const result = await res.json();
        setModifiedFileUrl(result.file.url);
        setModifiedFileName(result.file.name);
        showToast(bi({ fr: "Fichier envoyé !", en: "File uploaded!" }));
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || "Upload failed");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
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

  const LEFT_TABS: { key: LeftTab; icon: typeof FileText; label: { fr: string; en: string } }[] = [
    { key: "deliverable", icon: FileText, label: consultantI18n.originalDeliverable },
    { key: "modified", icon: PenLine, label: consultantI18n.modifiedDeliverable },
    { key: "conversation", icon: MessageSquare, label: consultantI18n.conversation },
  ];

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

      {/* Toast */}
      {toast && (
        <div className="absolute top-16 right-4 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" />
            {toast}
          </div>
        </div>
      )}

      {/* Two-column layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* ══════════ Left: Deliverable content (60%) ══════════ */}
        <div className={`w-full md:w-3/5 flex flex-col border-r ${dark ? "border-white/5" : "border-gray-200"}`}>
          {/* Left tabs */}
          <div className={`flex items-center gap-0.5 px-3 pt-2 pb-0 border-b ${dark ? "border-white/5" : "border-gray-100"}`}>
            {LEFT_TABS.map(({ key, icon: TabIcon, label }) => (
              <button
                key={key}
                onClick={() => setLeftTab(key)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-lg transition-colors border-b-2 ${
                  leftTab === key
                    ? dark
                      ? "text-white border-white/60 bg-white/5"
                      : "text-gray-900 border-gray-900 bg-gray-50"
                    : dark
                      ? "text-white/30 border-transparent hover:text-white/60"
                      : "text-gray-400 border-transparent hover:text-gray-600"
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                {bi(label)}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <ScrollArea className="flex-1">
            {/* ── Original deliverable ── */}
            {leftTab === "deliverable" && (
              <div className="p-5">
                {review.original_content ? (
                  <>
                    <div className={`prose prose-sm max-w-none ${dark ? "prose-invert" : ""}`}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{review.original_content}</ReactMarkdown>
                    </div>
                    {review.original_file_url && (
                      <a
                        href={review.original_file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          dark ? "border-white/10 text-white/70 hover:bg-white/5" : "border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <Download className="w-4 h-4" />
                        {bi(consultantI18n.downloadFile)}
                      </a>
                    )}
                  </>
                ) : (
                  <div className={`text-center py-12 ${dark ? "text-white/20" : "text-gray-400"}`}>
                    <FileText className="w-8 h-8 mx-auto mb-3 opacity-40" />
                    <p className="text-sm">{bi(consultantI18n.noOriginalContent)}</p>
                    <p className="text-xs mt-1">
                      {bi(
                        { fr: "Consultez l'onglet Conversation pour voir l'échange complet.", en: "Check the Conversation tab to see the full exchange." }
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ── Modified deliverable (editor + preview + file upload) ── */}
            {leftTab === "modified" && (
              <div className="flex flex-col h-full">
                {/* Edit/Preview toggle */}
                <div className="flex items-center gap-1 px-4 pt-3 pb-2">
                  <button
                    onClick={() => setEditMode(true)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      editMode
                        ? dark ? "bg-white/10 text-white" : "bg-gray-200 text-gray-900"
                        : dark ? "text-white/30 hover:text-white/60" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <PenLine className="w-3 h-3" />
                    {bi(consultantI18n.editTab)}
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      !editMode
                        ? dark ? "bg-white/10 text-white" : "bg-gray-200 text-gray-900"
                        : dark ? "text-white/30 hover:text-white/60" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    {bi(consultantI18n.previewTab)}
                  </button>
                </div>

                {/* File upload zone */}
                <div className="px-4 pb-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.pdf,.docx,.pptx,.csv,.zip"
                    className="hidden"
                    onChange={handleFileUpload}
                  />

                  {modifiedFileUrl ? (
                    <div className={`flex items-center gap-3 p-3 rounded-lg border ${
                      dark ? "bg-emerald-950/20 border-emerald-500/20" : "bg-emerald-50 border-emerald-200"
                    }`}>
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: C.greenLight }}>
                        <File className="w-4 h-4" style={{ color: C.green }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold ${dark ? "text-white/60" : "text-gray-600"}`}>
                          {bi(consultantI18n.modifiedFile)}
                        </p>
                        <a href={modifiedFileUrl} target="_blank" rel="noopener noreferrer"
                          className="text-xs underline truncate block" style={{ color: C.green }}>
                          {modifiedFileName || bi(consultantI18n.downloadFile)}
                        </a>
                      </div>
                      {canEdit && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-colors ${
                              dark ? "border-white/10 text-white/50 hover:bg-white/5" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : bi(consultantI18n.replaceFile)}
                          </button>
                          <button
                            onClick={() => { setModifiedFileUrl(null); setModifiedFileName(null); }}
                            className={`p-1 rounded-lg transition-colors ${
                              dark ? "text-white/20 hover:text-white/50" : "text-gray-300 hover:text-gray-500"
                            }`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : canEdit ? (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed text-sm font-medium transition-colors ${
                        uploading
                          ? dark ? "border-white/10 text-white/20" : "border-gray-200 text-gray-300"
                          : dark ? "border-white/10 text-white/40 hover:border-white/20 hover:text-white/60" : "border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600"
                      }`}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {bi(consultantI18n.uploadingFile)}
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          {bi(consultantI18n.uploadModifiedFile)}
                        </>
                      )}
                    </button>
                  ) : null}
                </div>

                <div className="flex-1 px-4 pb-4">
                  {editMode ? (
                    <textarea
                      value={modifiedContent}
                      onChange={(e) => setModifiedContent(e.target.value)}
                      disabled={!canEdit}
                      className={`w-full h-[calc(100vh-18rem)] rounded-lg border text-sm p-4 resize-none font-mono leading-relaxed ${
                        dark
                          ? "bg-white/5 border-white/10 text-white placeholder:text-white/20"
                          : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                      } ${!canEdit ? "opacity-50 cursor-not-allowed" : ""}`}
                      placeholder={bi(
                        { fr: "Modifiez le livrable ici (Markdown supporté)...", en: "Edit the deliverable here (Markdown supported)..." }
                      )}
                    />
                  ) : (
                    <div className={`rounded-lg border p-5 min-h-[calc(100vh-18rem)] ${
                      dark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
                    }`}>
                      {modifiedContent ? (
                        <div className={`prose prose-sm max-w-none ${dark ? "prose-invert" : ""}`}>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{modifiedContent}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className={`text-sm italic ${dark ? "text-white/20" : "text-gray-400"}`}>
                          {bi({ fr: "Aucun contenu modifié", en: "No modified content" })}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Conversation history ── */}
            {leftTab === "conversation" && (
              <div className="p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className={`text-center py-12 ${dark ? "text-white/20" : "text-gray-400"}`}>
                    <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-40" />
                    <p className="text-sm">{bi({ fr: "Aucun message", en: "No messages" })}</p>
                  </div>
                ) : (
                  messages.map((m, i) => (
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
                  ))
                )}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* ══════════ Right: Actions panel (40%) ══════════ */}
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

              {/* Already assigned info */}
              {review.consultant_id && (
                <div className={`rounded-lg px-3 py-2 text-xs ${dark ? "bg-white/5 text-white/50" : "bg-gray-50 text-gray-500"}`}>
                  <span className="font-semibold">{bi(consultantI18n.consultant)} :</span> {review.consultant_name ?? "—"}
                  {review.assigned_at && (
                    <span className="ml-2">
                      · {new Date(review.assigned_at).toLocaleDateString(lang === "fr" ? "fr-CA" : "en-CA")}
                    </span>
                  )}
                </div>
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
                  } ${!canEdit ? "opacity-50 cursor-not-allowed" : ""}`}
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
                  } ${!canEdit ? "opacity-50 cursor-not-allowed" : ""}`}
                  placeholder={bi({ fr: "Commentaire pour le client (visible)...", en: "Feedback for the client (visible)..." })}
                />
              </div>

              {/* Action buttons — editable state */}
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
                      variant="outline" className={`rounded-full text-sm ${
                        dark
                          ? "text-orange-400 border-orange-400/30 hover:bg-orange-400/10"
                          : "text-orange-600 border-orange-200 hover:bg-orange-50"
                      }`}>
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      {bi(consultantI18n.requestRevision)}
                    </Button>
                  </div>

                  <Button onClick={() => setDeliverConfirmOpen(true)} disabled={delivering}
                    className="w-full rounded-full font-bold text-sm border-0"
                    style={{ background: C.green, color: C.yellow }}>
                    {delivering ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                    {bi(consultantI18n.deliver)}
                  </Button>
                </div>
              )}

              {/* Delivered state — show success + reopen */}
              {review.status === "delivered" && (
                <div className="space-y-3">
                  <div className={`text-center py-4 rounded-xl border ${
                    dark ? "bg-emerald-950/20 border-emerald-500/20" : "bg-emerald-50 border-emerald-200"
                  }`}>
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2" style={{ color: C.green }} />
                    <p className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-900"}`}>
                      {bi(consultantI18n.deliveredSuccess)}
                    </p>
                    <p className={`text-xs mt-1 ${dark ? "text-white/40" : "text-gray-500"}`}>
                      {review.delivered_at ? new Date(review.delivered_at).toLocaleString(lang === "fr" ? "fr-CA" : "en-CA") : ""}
                    </p>
                  </div>

                  {isAssigned && (
                    <div>
                      <Button onClick={handleReopen} disabled={saving} variant="outline"
                        className={`w-full rounded-full text-sm ${
                          dark ? "border-white/10 text-white/60 hover:bg-white/5" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}>
                        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                        {bi(consultantI18n.reopen)}
                      </Button>
                      <p className={`text-[10px] text-center mt-1.5 ${dark ? "text-white/20" : "text-gray-400"}`}>
                        {bi(consultantI18n.reopenDesc)}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Deliver confirmation dialog */}
      <ConfirmDialog
        open={deliverConfirmOpen}
        onOpenChange={setDeliverConfirmOpen}
        title={bi({ fr: "Livrer au client ?", en: "Deliver to client?" })}
        description={bi({ fr: "Le livrable modifié sera envoyé au client. Cette action est définitive.", en: "The modified deliverable will be sent to the client. This action is final." })}
        confirmLabel={bi({ fr: "Livrer", en: "Deliver" })}
        cancelLabel={bi({ fr: "Annuler", en: "Cancel" })}
        onConfirm={handleDeliver}
        dark={dark}
      />
    </div>
  );
}
