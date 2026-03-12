import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ErrorRetry } from "@/components/ErrorRetry";
import {
  Send, StopCircle, Plus, MessageSquare, Trash2, Loader2,
  Menu, Search, Pencil, Check, X,
} from "lucide-react";
import { C } from "@/lib/constants";
import { useLang, useTheme } from "@/lib/contexts";
import { useClient } from "../contexts/ClientContext";
import { useClientChat } from "../hooks/useClientChat";
import { clientI18n } from "../i18n";

interface Conversation {
  id: string;
  title: string;
  updated_at: string;
}

export function ChatPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const { session } = useClient();
  const bi = (v: { fr: string; en: string }) => (lang === "fr" ? v.fr : v.en);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, isStreaming, error, conversationId, sendMessage, stop, reset, loadConversation } =
    useClientChat({ lang, accessToken: session.access_token });

  // Fetch conversations list
  const fetchConvos = async () => {
    setFetchError(false);
    try {
      const res = await fetch("/api/client/conversations", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations ?? []);
      } else {
        setFetchError(true);
      }
    } catch {
      setFetchError(true);
    } finally {
      setLoadingConvos(false);
    }
  };

  useEffect(() => { fetchConvos(); }, []);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load a conversation
  const handleSelectConvo = async (id: string) => {
    setSelectedId(id);
    setMobileOpen(false);
    try {
      const res = await fetch(`/api/client/conversations/${id}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        loadConversation(data.messages ?? [], id);
      }
    } catch { /* handled by empty state */ }
  };

  // New conversation
  const handleNew = () => {
    setSelectedId(null);
    setMobileOpen(false);
    reset();
  };

  // Send
  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  // Delete conversation (with confirmation)
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/client/conversations/${deleteTarget}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    setConversations((prev) => prev.filter((c) => c.id !== deleteTarget));
    if (selectedId === deleteTarget) handleNew();
    setDeleteTarget(null);
  };

  // Rename conversation
  const handleRename = async (id: string) => {
    if (!renameValue.trim()) { setRenamingId(null); return; }
    await fetch(`/api/client/conversations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ title: renameValue.trim() }),
    });
    setConversations((prev) => prev.map((c) => c.id === id ? { ...c, title: renameValue.trim() } : c));
    setRenamingId(null);
  };

  // Update convos list when we get a new conversationId
  useEffect(() => {
    if (conversationId && !conversations.find((c) => c.id === conversationId)) {
      fetchConvos();
      setSelectedId(conversationId);
    }
  }, [conversationId]);

  // Filter conversations by search query
  const filteredConvos = searchQuery
    ? conversations.filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : conversations;

  // Shared sidebar content
  const SidebarInner = () => (
    <>
      <div className="p-3 space-y-2">
        <Button
          onClick={handleNew}
          className="w-full rounded-lg text-sm font-semibold border-0"
          style={{ background: C.yellow, color: C.green }}
        >
          <Plus className="w-4 h-4 mr-2" />
          {bi({ fr: "Nouvelle conversation", en: "New conversation" })}
        </Button>
        {/* Search conversations */}
        <div className="relative">
          <Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${dark ? "text-white/30" : "text-gray-400"}`} />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={bi({ fr: "Rechercher...", en: "Search..." })}
            className={`pl-8 h-8 text-xs rounded-lg ${dark ? "bg-white/5 border-white/10 text-white placeholder:text-white/20" : "bg-gray-50 border-gray-100"}`}
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-2 space-y-0.5">
          {loadingConvos ? (
            <div className="flex justify-center py-8">
              <Loader2 className={`w-4 h-4 animate-spin ${dark ? "text-white/30" : "text-gray-400"}`} />
            </div>
          ) : fetchError ? (
            <ErrorRetry
              message={bi({ fr: "Erreur de chargement", en: "Failed to load" })}
              onRetry={() => { setLoadingConvos(true); fetchConvos(); }}
              retryLabel={bi({ fr: "Réessayer", en: "Retry" })}
              dark={dark}
            />
          ) : filteredConvos.length === 0 ? (
            <p className={`text-xs text-center py-8 ${dark ? "text-white/20" : "text-gray-400"}`}>
              {searchQuery ? bi({ fr: "Aucun résultat", en: "No results" }) : bi(clientI18n.noResults)}
            </p>
          ) : (
            filteredConvos.map((c) => (
              <div key={c.id}>
                {renamingId === c.id ? (
                  <div className="flex items-center gap-1 px-2 py-1">
                    <Input
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleRename(c.id); if (e.key === "Escape") setRenamingId(null); }}
                      className={`h-7 text-xs rounded-md flex-1 ${dark ? "bg-white/10 border-white/10 text-white" : ""}`}
                      autoFocus
                    />
                    <button onClick={() => handleRename(c.id)} className="p-1 rounded text-green-500 hover:bg-green-50">
                      <Check className="w-3 h-3" />
                    </button>
                    <button onClick={() => setRenamingId(null)} className="p-1 rounded text-gray-400 hover:bg-gray-100">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleSelectConvo(c.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 group transition-colors ${
                      selectedId === c.id
                        ? dark ? "bg-white/10 text-white" : "bg-gray-100 text-gray-900"
                        : dark ? "text-white/50 hover:bg-white/5" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate flex-1">{c.title}</span>
                    <Pencil
                      className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-40 hover:!opacity-80 transition-opacity"
                      onClick={(e) => { e.stopPropagation(); setRenamingId(c.id); setRenameValue(c.title); }}
                    />
                    <Trash2
                      className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-40 hover:!opacity-80 transition-opacity text-red-500"
                      onClick={(e) => { e.stopPropagation(); setDeleteTarget(c.id); }}
                    />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </>
  );

  return (
    <div className="flex h-[calc(100vh-3.5rem)] md:h-screen">
      {/* Desktop conversations sidebar */}
      <div className={`hidden md:flex w-64 flex-col border-r ${dark ? "border-white/5 bg-gray-950" : "border-gray-200 bg-white"}`}>
        <SidebarInner />
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header with sidebar sheet trigger */}
        <div className={`md:hidden flex items-center gap-2 px-3 py-2 border-b ${dark ? "border-white/5" : "border-gray-200"}`}>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-lg shrink-0">
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className={`w-72 p-0 ${dark ? "bg-gray-950 border-white/5" : ""}`}>
              <div className="flex flex-col h-full">
                <SidebarInner />
              </div>
            </SheetContent>
          </Sheet>
          <span className={`text-sm truncate flex-1 ${dark ? "text-white/50" : "text-gray-500"}`}>
            {selectedId ? conversations.find((c) => c.id === selectedId)?.title ?? "Chat" : bi({ fr: "Nouvelle conversation", en: "New conversation" })}
          </span>
          <Button variant="ghost" size="icon" onClick={handleNew} className="rounded-lg shrink-0">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-20">
                <MessageSquare className="w-10 h-10 mx-auto mb-3" style={{ color: C.green, opacity: 0.3 }} />
                <p className={`text-sm ${dark ? "text-white/30" : "text-gray-400"}`}>
                  {bi({ fr: "Posez une question pour commencer", en: "Ask a question to get started" })}
                </p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "text-white"
                    : dark ? "bg-white/5 text-white/80" : "bg-gray-50 text-gray-800"
                }`} style={m.role === "user" ? { background: C.green } : undefined}>
                  {m.content || (isStreaming && i === messages.length - 1 ? (
                    <span className="inline-flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: C.green, animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: C.green, animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: C.green, animationDelay: "300ms" }} />
                    </span>
                  ) : "")}
                </div>
              </div>
            ))}
            {error && (
              <div className="text-center">
                <Badge variant="destructive" className="text-xs">{error}</Badge>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className={`border-t p-4 ${dark ? "border-white/5" : "border-gray-200"}`}>
          <div className="max-w-3xl mx-auto flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={bi({ fr: "Posez votre question...", en: "Ask your question..." })}
              className={`rounded-xl flex-1 ${dark ? "bg-white/5 border-white/10 text-white placeholder:text-white/30" : ""}`}
              disabled={isStreaming}
            />
            {isStreaming ? (
              <Button onClick={stop} variant="outline" size="icon" className="rounded-xl shrink-0">
                <StopCircle className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleSend} size="icon" className="rounded-xl shrink-0 border-0" style={{ background: C.green }} disabled={!input.trim()}>
                <Send className="w-4 h-4" style={{ color: C.yellow }} />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title={bi({ fr: "Supprimer la conversation ?", en: "Delete conversation?" })}
        description={bi({ fr: "Cette action est irréversible. Tous les messages seront perdus.", en: "This action cannot be undone. All messages will be lost." })}
        confirmLabel={bi({ fr: "Supprimer", en: "Delete" })}
        cancelLabel={bi({ fr: "Annuler", en: "Cancel" })}
        destructive
        onConfirm={confirmDelete}
        dark={dark}
      />
    </div>
  );
}
