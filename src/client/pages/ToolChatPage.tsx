import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Send, StopCircle, Plus, ArrowLeft, MessageSquare, Trash2, Loader2,
  Layers, BookOpen, Search, Paperclip, X, Image, File,
  Cloud, Download, ExternalLink, CheckCircle2, FileSpreadsheet,
  Activity, Database, ShieldCheck, Users, GitBranch,
  ClipboardList, Map, Briefcase, Table2, Lock, Building2,
  GraduationCap, ArrowLeftRight, Rocket, BarChart3, Shield,
} from "lucide-react";
import { C, HDR_FONT } from "@/lib/constants";
import { useLang, useTheme } from "@/lib/contexts";
import { useClient } from "../contexts/ClientContext";
import { useToolChat, type Attachment } from "../hooks/useToolChat";
import { useCloudIntegrations, type CloudFile, type Provider } from "../hooks/useCloudIntegrations";
import { CloudFilePicker } from "../components/CloudFilePicker";
import { ReviewRequestButton } from "../components/ReviewRequestButton";

// ─── Tool metadata — 18 plugin commands ──────────────
const TOOL_META: Record<string, { icon: typeof Layers; label: { fr: string; en: string }; desc: { fr: string; en: string } }> = {
  // Diagnostic
  "ai-maturity-assessment":     { icon: Activity,      label: { fr: "Maturité IA",                      en: "AI Maturity" },                       desc: { fr: "Évaluation 6 dimensions avec scores",                            en: "6-dimension assessment with scores" } },
  "data-readiness-assessment":  { icon: Database,      label: { fr: "Maturité des données",              en: "Data Readiness" },                    desc: { fr: "Score sur 7 dimensions data",                                     en: "Score across 7 data dimensions" } },
  "process-ai-diagnostic":     { icon: Search,        label: { fr: "Diagnostic des processus",          en: "Process Diagnostic" },                desc: { fr: "Scoring opportunité IA par processus",                            en: "AI opportunity scoring per process" } },
  // Gouvernance IA
  "ai-governance-framework":   { icon: ShieldCheck,   label: { fr: "Cadre de gouvernance IA",            en: "AI Governance Framework" },           desc: { fr: "Politiques, classification risques, processus",                   en: "Policies, risk classification, processes" } },
  "ai-governance-committee":   { icon: Users,         label: { fr: "Comité de gouvernance IA",            en: "AI Governance Committee" },           desc: { fr: "Mandat, composition, processus décisionnel",                      en: "Mandate, composition, decision process" } },
  // Design
  "ai-operating-model":        { icon: GitBranch,     label: { fr: "Modèle opérationnel IA",             en: "AI Operating Model" },                desc: { fr: "Hub & Spoke, rôles, plan de transition",                          en: "Hub & Spoke, roles, transition plan" } },
  "ai-backlog":                { icon: ClipboardList, label: { fr: "Backlog cas d'usage IA",              en: "AI Use Case Backlog" },               desc: { fr: "Cas d'usage IA priorisés avec scoring",                           en: "Prioritized AI use cases with scoring" } },
  "ai-roadmap":                { icon: Map,           label: { fr: "Feuille de route IA",                en: "AI Roadmap" },                        desc: { fr: "Feuille de route phasée avec jalons",                             en: "Phased roadmap with milestones" } },
  "ai-business-case":          { icon: Briefcase,     label: { fr: "Analyse de rentabilité IA",          en: "AI Business Case" },                  desc: { fr: "ROI, analyse de sensibilité, risques",                            en: "ROI, sensitivity analysis, risks" } },
  "ai-raci":                   { icon: Table2,        label: { fr: "Matrice RACI",                       en: "RACI Matrix" },                       desc: { fr: "Matrice RACI stratégie/développement/opérations",                 en: "RACI matrix strategy/development/operations" } },
  "privacy-impact-assessment": { icon: Lock,          label: { fr: "Évaluation vie privée (EFVP)",       en: "Privacy Impact Assessment" },         desc: { fr: "EFVP conforme Loi 25 / CAI",                                      en: "PIA compliant with Loi 25 / CAI" } },
  "ai-vendor-assessment":      { icon: Building2,     label: { fr: "Évaluation de fournisseurs IA",      en: "AI Vendor Assessment" },              desc: { fr: "Grille comparative de solutions IA",                              en: "Comparative AI solutions grid" } },
  // Gestion du changement
  "ai-talent-roadmap":         { icon: GraduationCap, label: { fr: "Stratégie talents IA",               en: "AI Talent Strategy" },                desc: { fr: "Équipe cible et parcours de développement",                       en: "Target team and development paths" } },
  "change-management-plan":    { icon: ArrowLeftRight,label: { fr: "Conduite du changement",              en: "Change Management Plan" },            desc: { fr: "Plan ADKAR pour déploiement IA",                                  en: "ADKAR plan for AI deployment" } },
  "ai-training-plan":          { icon: BookOpen,      label: { fr: "Plan de formation IA",               en: "AI Training Plan" },                  desc: { fr: "Formation et upskilling par rôle",                                en: "Training and upskilling by role" } },
  "ai-impact-analysis":        { icon: BarChart3,     label: { fr: "Analyse d'impact",                   en: "Impact Analysis" },                   desc: { fr: "Impact processus, rôles, culture, KPIs",                          en: "Impact on processes, roles, culture, KPIs" } },
  "resistance-management-plan":{ icon: Shield,        label: { fr: "Gestion de la résistance",           en: "Resistance Management" },             desc: { fr: "Diagnostic et plan tactique résistance",                          en: "Diagnostic and tactical resistance plan" } },
  // Déploiement
  "copilot-deployment":        { icon: Rocket,        label: { fr: "Déploiement Copilot 365",            en: "Copilot 365 Deployment" },            desc: { fr: "Plan 4 phases Copilot 365",                                       en: "4-phase Copilot 365 plan" } },
};

// Discovery questions are now auto-triggered via API call on mount.
// Static welcome messages removed — Claude generates personalized questions.

// ─── Helpers ──────────────────────────────────────────
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_FILES = 5;
const ACCEPT = ".pdf,.png,.jpg,.jpeg,.gif,.webp,.txt,.csv,.md,.json,.xml";

function isImageType(mime: string) {
  return /^image\/(png|jpe?g|gif|webp)$/.test(mime);
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function readFileAsBase64(file: globalThis.File): Promise<Attachment> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1] ?? "";
      resolve({ name: file.name, type: file.type, data: base64, size: file.size });
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

interface Conversation {
  id: string;
  title: string;
  updated_at: string;
}

export function ToolChatPage() {
  const { toolName } = useParams<{ toolName: string }>();
  const navigate = useNavigate();
  const { lang } = useLang();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const { session, quotas } = useClient();
  const bi = (v: { fr: string; en: string }) => (lang === "fr" ? v.fr : v.en);
  const hasHumanReview = quotas?.features?.human_review === true;

  const meta = TOOL_META[toolName ?? ""];
  const Icon = meta?.icon ?? Layers;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cloud integration state
  const cloud = useCloudIntegrations(session.access_token);
  const [showCloudPicker, setShowCloudPicker] = useState<Provider | null>(null);
  const [cloudImporting, setCloudImporting] = useState(false);
  const [exporting, setExporting] = useState<number | null>(null);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  const [showCloudMenu, setShowCloudMenu] = useState(false);

  // Human review state
  const [existingReview, setExistingReview] = useState<{
    id: string; status: string; consultant_name?: string | null;
    client_feedback?: string | null; modified_content?: string | null; modified_file_url?: string | null;
  } | null>(null);

  const { messages, isStreaming, error, conversationId, sendMessage, stop, reset, loadConversation } =
    useToolChat({ toolName: toolName ?? "", lang, accessToken: session.access_token });

  // Auto-start discovery phase: send init message on new chat
  const autoStartedRef = useRef(false);
  useEffect(() => {
    if (
      !autoStartedRef.current &&
      !selectedId &&
      !conversationId &&
      messages.length === 0 &&
      !isStreaming &&
      meta
    ) {
      autoStartedRef.current = true;
      const initPrompt = lang === "fr"
        ? "Bonjour, je souhaite utiliser cet outil. Pose-moi les questions de découverte pour personnaliser le livrable."
        : "Hello, I'd like to use this tool. Ask me the discovery questions to personalize the deliverable.";
      sendMessage(initPrompt);
    }
  }, [selectedId, conversationId, messages.length, isStreaming, meta, lang, sendMessage]);

  // Load cloud connections on mount
  useEffect(() => { cloud.fetchConnections(); }, []);

  // Redirect if invalid tool
  if (!meta) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-500 text-sm mb-4">Unknown tool: {toolName}</p>
          <Button onClick={() => navigate("/client/tools")} variant="outline" className="rounded-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {bi({ fr: "Retour aux assistants", en: "Back to assistants" })}
          </Button>
        </div>
      </div>
    );
  }

  // Fetch tool-specific conversations
  const fetchConvos = async () => {
    try {
      const res = await fetch(`/api/client/conversations?tool=${toolName}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations ?? []);
      }
    } catch {} finally {
      setLoadingConvos(false);
    }
  };

  useEffect(() => { fetchConvos(); }, [toolName]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load existing conversation
  const handleSelectConvo = async (id: string) => {
    setSelectedId(id);
    setShowHistory(false);
    try {
      const res = await fetch(`/api/client/conversations/${id}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        loadConversation(data.messages ?? [], id);
      }
    } catch {}
  };

  const handleNew = () => {
    setSelectedId(null);
    setShowHistory(false);
    setAttachments([]);
    autoStartedRef.current = false;
    reset();
  };

  const handleSend = () => {
    if (!input.trim() && attachments.length === 0) return;
    const msg = input.trim() || (attachments.length > 0
      ? bi({ fr: "Voici les fichiers joints. Analysez-les.", en: "Here are the attached files. Please analyze them." })
      : "");
    sendMessage(msg, attachments.length > 0 ? attachments : undefined);
    setInput("");
    setAttachments([]);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const remaining = MAX_FILES - attachments.length;
    const toProcess = files.slice(0, remaining);
    for (const file of toProcess) {
      if (file.size > MAX_FILE_SIZE) {
        alert(`${file.name} ${bi({ fr: "dépasse 10 MB", en: "exceeds 10 MB" })}`);
        continue;
      }
      try {
        const attachment = await readFileAsBase64(file);
        setAttachments((prev) => [...prev, attachment]);
      } catch { /* skip */ }
    }
    e.target.value = "";
  };

  // Cloud file import handler
  const handleCloudFileSelect = async (file: CloudFile) => {
    const provider = showCloudPicker;
    setShowCloudPicker(null);
    if (!provider) return;
    setCloudImporting(true);
    try {
      const downloaded = await cloud.downloadFile(provider, file.id, file.name, file.mimeType);
      const attachment: Attachment = {
        name: file.name,
        type: downloaded.mimeType || file.mimeType,
        data: downloaded.content,
        size: downloaded.size,
      };
      setAttachments((prev) => [...prev, attachment]);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Import failed");
    } finally {
      setCloudImporting(false);
    }
  };

  // Export assistant message to cloud
  const handleExport = async (messageIndex: number, provider: Provider) => {
    const msg = messages[messageIndex];
    if (!msg || msg.role !== "assistant") return;
    setExporting(messageIndex);
    try {
      const toolLabel = bi(meta.label).replace(/[^a-zA-Z0-9À-ÿ ]/g, "").trim();
      const fileName = `${toolLabel} - ${new Date().toISOString().slice(0, 10)}.md`;
      const result = await cloud.exportFile(provider, fileName, msg.content, "text/markdown");
      setExportSuccess(result.webUrl);
      setTimeout(() => setExportSuccess(null), 5000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Export failed");
    } finally {
      setExporting(null);
    }
  };

  const removeAttachment = (idx: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await fetch(`/api/client/conversations/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (selectedId === id) handleNew();
  };

  useEffect(() => {
    if (conversationId && !conversations.find((c) => c.id === conversationId)) {
      fetchConvos();
      setSelectedId(conversationId);
    }
  }, [conversationId]);

  // Fetch existing review when conversation is loaded
  useEffect(() => {
    const cid = conversationId || selectedId;
    if (!cid || !hasHumanReview) { setExistingReview(null); return; }
    (async () => {
      try {
        const res = await fetch(`/api/client/reviews?conversation=${cid}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setExistingReview(data.reviews?.[0] ?? null);
        }
      } catch { /* ignore */ }
    })();
  }, [conversationId, selectedId, hasHumanReview]);

  // Check if conversation has any generated files (for review button)
  const hasGeneratedFiles = messages.some((m) => m.role === "assistant" && m.files && m.files.length > 0);

  // Capture the last assistant message as the deliverable content for review
  const lastAssistantMsg = [...messages].reverse().find((m) => m.role === "assistant" && m.content);
  const deliverableContent = lastAssistantMsg?.content ?? "";
  const deliverableFileUrl = lastAssistantMsg?.files?.[0]?.url ?? undefined;

  const showLoading = messages.length === 0 && !error;
  const hasGoogle = cloud.isConnected("google");
  const hasMicrosoft = cloud.isConnected("microsoft");
  const hasAnyCloud = hasGoogle || hasMicrosoft;

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] md:h-screen">
      {/* ── Header ── */}
      <div className={`flex items-center gap-3 px-4 py-3 border-b shrink-0 ${dark ? "border-white/5" : "border-gray-200"}`}>
        <Button
          variant="ghost" size="icon"
          onClick={() => navigate("/client/tools")}
          className={`rounded-lg shrink-0 ${dark ? "text-white/50 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: C.greenLight }}>
          <Icon className="w-5 h-5" style={{ color: C.green }} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold truncate" style={{ ...HDR_FONT, color: C.green }}>{bi(meta.label)}</h2>
          <p className={`text-xs truncate ${dark ? "text-white/40" : "text-gray-500"}`}>{bi(meta.desc)}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="sm" onClick={() => setShowHistory(!showHistory)}
            className={`rounded-lg text-xs ${dark ? "text-white/50" : "text-gray-500"}`}>
            <MessageSquare className="w-3.5 h-3.5 mr-1" />
            {bi({ fr: "Historique", en: "History" })}
            {conversations.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0 h-4 rounded-full">{conversations.length}</Badge>
            )}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleNew} className="rounded-lg text-xs" style={{ color: C.green }}>
            <Plus className="w-3.5 h-3.5 mr-1" />{bi({ fr: "Nouveau", en: "New" })}
          </Button>
        </div>
      </div>

      {/* ── Export success banner ── */}
      {exportSuccess && (
        <div className={`px-4 py-2 border-b ${dark ? "border-white/5" : "border-gray-200"}`}>
          <div className="max-w-3xl mx-auto flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {bi({ fr: "Fichier exporté !", en: "File exported!" })}
            <a href={exportSuccess} target="_blank" rel="noopener noreferrer" className="ml-auto text-xs underline flex items-center gap-1">
              {bi({ fr: "Ouvrir", en: "Open" })} <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* ── Conversation history dropdown ── */}
      {showHistory && (
        <div className={`border-b px-4 py-2 ${dark ? "border-white/5 bg-gray-900/50" : "border-gray-200 bg-gray-50"}`}>
          <ScrollArea className="max-h-48">
            {loadingConvos ? (
              <div className="flex justify-center py-4">
                <Loader2 className={`w-4 h-4 animate-spin ${dark ? "text-white/30" : "text-gray-400"}`} />
              </div>
            ) : conversations.length === 0 ? (
              <p className={`text-xs text-center py-4 ${dark ? "text-white/20" : "text-gray-400"}`}>
                {bi({ fr: "Aucune conversation", en: "No conversations" })}
              </p>
            ) : (
              <div className="space-y-0.5">
                {conversations.map((c) => (
                  <button key={c.id} onClick={() => handleSelectConvo(c.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 group transition-colors ${
                      selectedId === c.id
                        ? dark ? "bg-white/10 text-white" : "bg-white text-gray-900 shadow-sm"
                        : dark ? "text-white/50 hover:bg-white/5" : "text-gray-600 hover:bg-white"
                    }`}>
                    <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate flex-1">{c.title}</span>
                    <Trash2 className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity"
                      onClick={(e) => handleDelete(c.id, e)} />
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      )}

      {/* ── Chat messages ── */}
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {showLoading && (
            <div className="flex justify-start">
              <div className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-relaxed ${dark ? "bg-white/5" : "bg-gray-50"}`}>
                <div className={`flex items-center gap-3 ${dark ? "text-white/50" : "text-gray-500"}`}>
                  <Loader2 className="w-4 h-4 animate-spin" style={{ color: C.green }} />
                  {bi({ fr: "Préparation des questions de découverte…", en: "Preparing discovery questions…" })}
                </div>
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[85%]">
                <div
                  className={`rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                    m.role === "user" ? "text-white" : dark ? "bg-white/5 text-white/80" : "bg-gray-50 text-gray-800"
                  }`}
                  style={m.role === "user" ? { background: C.green } : undefined}
                >
                  {m.role === "user" && m.attachments && m.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {m.attachments.map((a, j) => (
                        <span key={j} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/20">
                          {isImageType(a.type) ? <Image className="w-3 h-3" /> : <File className="w-3 h-3" />}
                          {a.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {m.role === "assistant" ? (
                    m.content ? (
                      <div className={`prose prose-sm max-w-none ${dark ? "prose-invert" : ""}`}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                      </div>
                    ) : isStreaming && i === messages.length - 1 ? (
                      <span className="inline-flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: C.green, animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: C.green, animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: C.green, animationDelay: "300ms" }} />
                      </span>
                    ) : null
                  ) : (
                    m.content
                  )}

                  {/* Generated file download cards */}
                  {m.files && m.files.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {m.files.map((f, fi) => (
                        <a
                          key={fi}
                          href={f.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-3 p-3 rounded-lg border transition-all hover:scale-[1.01] hover:shadow-md ${
                            dark
                              ? "bg-gray-800 border-white/10 hover:border-white/20"
                              : "bg-white border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ background: dark ? "rgba(0,53,51,0.3)" : C.greenLight }}
                          >
                            <FileSpreadsheet className="w-5 h-5" style={{ color: C.green }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${dark ? "text-white" : "text-gray-900"}`}>
                              {f.name}
                            </p>
                            <p className={`text-xs ${dark ? "text-white/40" : "text-gray-500"}`}>
                              {f.size < 1024 ? `${f.size} B` : `${(f.size / 1024).toFixed(1)} KB`}
                              {" · "}Excel (.xlsx)
                            </p>
                          </div>
                          <Download className={`w-4 h-4 ${dark ? "text-white/40" : "text-gray-400"}`} />
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Export buttons for assistant messages */}
                {m.role === "assistant" && m.content && !isStreaming && hasAnyCloud && (
                  <div className="mt-1.5 flex items-center gap-1">
                    {hasGoogle && (
                      <button onClick={() => handleExport(i, "google")} disabled={exporting === i}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] transition-colors ${
                          dark ? "text-white/30 hover:text-white/60 hover:bg-white/5" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                        }`}
                        title={bi({ fr: "Exporter vers Google Drive", en: "Export to Google Drive" })}>
                        {exporting === i ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                        Google Drive
                      </button>
                    )}
                    {hasMicrosoft && (
                      <button onClick={() => handleExport(i, "microsoft")} disabled={exporting === i}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] transition-colors ${
                          dark ? "text-white/30 hover:text-white/60 hover:bg-white/5" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                        }`}
                        title={bi({ fr: "Exporter vers OneDrive", en: "Export to OneDrive" })}>
                        {exporting === i ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                        OneDrive
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {error && (
            <div className="text-center">
              <Badge variant="destructive" className="text-xs">{error}</Badge>
            </div>
          )}

          {/* ── Human Review Request ── */}
          {hasHumanReview && hasGeneratedFiles && !isStreaming && (conversationId || selectedId) && (
            <ReviewRequestButton
              conversationId={conversationId || selectedId}
              toolName={toolName ?? ""}
              originalContent={deliverableContent}
              originalFileUrl={deliverableFileUrl}
              accessToken={session.access_token}
              lang={lang}
              existingReview={existingReview}
              dark={dark}
              onReviewCreated={(review) => setExistingReview(review)}
            />
          )}

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* ── Attachment chips ── */}
      {attachments.length > 0 && (
        <div className="px-4 pt-2">
          <div className="max-w-3xl mx-auto flex flex-wrap gap-1.5">
            {attachments.map((a, i) => (
              <span key={i} className={`inline-flex items-center gap-1.5 pl-2.5 pr-1 py-1 rounded-full text-xs ${
                dark ? "bg-white/10 text-white/70" : "bg-gray-100 text-gray-700"
              }`}>
                {isImageType(a.type) ? <Image className="w-3 h-3" /> : <File className="w-3 h-3" />}
                <span className="max-w-[120px] truncate">{a.name}</span>
                <span className={`text-[10px] ${dark ? "text-white/30" : "text-gray-400"}`}>{formatFileSize(a.size)}</span>
                <button onClick={() => removeAttachment(i)}
                  className={`ml-0.5 p-0.5 rounded-full transition-colors ${dark ? "hover:bg-white/20" : "hover:bg-gray-200"}`}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Cloud importing indicator ── */}
      {cloudImporting && (
        <div className="px-4 py-1.5">
          <div className={`max-w-3xl mx-auto flex items-center gap-2 text-xs ${dark ? "text-white/40" : "text-gray-500"}`}>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            {bi({ fr: "Importation du fichier...", en: "Importing file..." })}
          </div>
        </div>
      )}

      {/* ── Input ── */}
      <div className={`border-t p-4 shrink-0 ${dark ? "border-white/5" : "border-gray-200"}`}>
        <div className="max-w-3xl mx-auto flex gap-2">
          <input ref={fileInputRef} type="file" accept={ACCEPT} multiple className="hidden" onChange={handleFileSelect} />

          {/* Paperclip button */}
          <Button variant="ghost" size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isStreaming || attachments.length >= MAX_FILES}
            className={`rounded-xl shrink-0 ${dark ? "text-white/30 hover:text-white/60" : "text-gray-400 hover:text-gray-600"}`}
            title={bi({ fr: `Joindre un fichier (max ${MAX_FILES})`, en: `Attach a file (max ${MAX_FILES})` })}>
            <Paperclip className="w-4 h-4" />
          </Button>

          {/* Cloud import button */}
          {hasAnyCloud && (
            <div className="relative shrink-0">
              <Button variant="ghost" size="icon"
                onClick={() => {
                  if (hasGoogle && hasMicrosoft) { setShowCloudMenu(!showCloudMenu); }
                  else if (hasGoogle) { setShowCloudPicker("google"); }
                  else { setShowCloudPicker("microsoft"); }
                }}
                disabled={isStreaming || attachments.length >= MAX_FILES || cloudImporting}
                className={`rounded-xl ${dark ? "text-white/30 hover:text-white/60" : "text-gray-400 hover:text-gray-600"}`}
                title={bi({ fr: "Importer du cloud", en: "Import from cloud" })}>
                <Cloud className="w-4 h-4" />
              </Button>

              {showCloudMenu && (
                <div className={`absolute bottom-full left-0 mb-2 rounded-xl shadow-lg border py-1 w-48 z-10 ${
                  dark ? "bg-gray-900 border-white/10" : "bg-white border-gray-200"
                }`}>
                  {hasGoogle && (
                    <button onClick={() => { setShowCloudMenu(false); setShowCloudPicker("google"); }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 transition-colors ${
                        dark ? "text-white/70 hover:bg-white/5" : "text-gray-700 hover:bg-gray-50"
                      }`}>
                      <Cloud className="w-3.5 h-3.5" /> Google Drive
                    </button>
                  )}
                  {hasMicrosoft && (
                    <button onClick={() => { setShowCloudMenu(false); setShowCloudPicker("microsoft"); }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 transition-colors ${
                        dark ? "text-white/70 hover:bg-white/5" : "text-gray-700 hover:bg-gray-50"
                      }`}>
                      <Cloud className="w-3.5 h-3.5" /> OneDrive
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          <Input value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder={bi({ fr: "Posez votre question...", en: "Ask your question..." })}
            className={`rounded-xl flex-1 ${dark ? "bg-white/5 border-white/10 text-white placeholder:text-white/30" : ""}`}
            disabled={isStreaming} />
          {isStreaming ? (
            <Button onClick={stop} variant="outline" size="icon" className="rounded-xl shrink-0">
              <StopCircle className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSend} size="icon" className="rounded-xl shrink-0 border-0"
              style={{ background: C.green }} disabled={!input.trim() && attachments.length === 0}>
              <Send className="w-4 h-4" style={{ color: C.yellow }} />
            </Button>
          )}
        </div>
      </div>

      {/* ── Cloud File Picker Modal ── */}
      {showCloudPicker && (
        <CloudFilePicker
          provider={showCloudPicker}
          accessToken={session.access_token}
          lang={lang}
          onSelect={handleCloudFileSelect}
          onClose={() => setShowCloudPicker(null)}
        />
      )}
    </div>
  );
}
