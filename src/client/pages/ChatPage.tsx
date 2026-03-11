import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Send, StopCircle, Plus, MessageSquare, Trash2, Loader2,
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
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, isStreaming, error, conversationId, sendMessage, stop, reset, loadConversation } =
    useClientChat({ lang, accessToken: session.access_token });

  // Fetch conversations list
  const fetchConvos = async () => {
    try {
      const res = await fetch("/api/client/conversations", {
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

  useEffect(() => { fetchConvos(); }, []);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load a conversation
  const handleSelectConvo = async (id: string) => {
    setSelectedId(id);
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

  // New conversation
  const handleNew = () => {
    setSelectedId(null);
    reset();
  };

  // Send
  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  // Delete conversation
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await fetch(`/api/client/conversations/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (selectedId === id) handleNew();
  };

  // Update convos list when we get a new conversationId
  useEffect(() => {
    if (conversationId && !conversations.find((c) => c.id === conversationId)) {
      fetchConvos();
      setSelectedId(conversationId);
    }
  }, [conversationId]);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] md:h-screen">
      {/* Conversations sidebar */}
      <div className={`hidden md:flex w-64 flex-col border-r ${dark ? "border-white/5 bg-gray-950" : "border-gray-200 bg-white"}`}>
        <div className="p-3">
          <Button
            onClick={handleNew}
            className="w-full rounded-lg text-sm font-semibold border-0"
            style={{ background: C.yellow, color: C.green }}
          >
            <Plus className="w-4 h-4 mr-2" />
            {bi({ fr: "Nouvelle conversation", en: "New conversation" })}
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="px-2 space-y-0.5">
            {loadingConvos ? (
              <div className="flex justify-center py-8">
                <Loader2 className={`w-4 h-4 animate-spin ${dark ? "text-white/30" : "text-gray-400"}`} />
              </div>
            ) : conversations.length === 0 ? (
              <p className={`text-xs text-center py-8 ${dark ? "text-white/20" : "text-gray-400"}`}>
                {bi(clientI18n.noResults)}
              </p>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelectConvo(c.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 group transition-colors ${
                    selectedId === c.id
                      ? dark ? "bg-white/10 text-white" : "bg-gray-100 text-gray-900"
                      : dark ? "text-white/50 hover:bg-white/5" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate flex-1">{c.title}</span>
                  <Trash2
                    className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity"
                    onClick={(e) => handleDelete(c.id, e)}
                  />
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
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
    </div>
  );
}
