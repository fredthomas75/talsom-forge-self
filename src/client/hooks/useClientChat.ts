import { useState, useRef, useCallback } from "react";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface UseClientChatOptions {
  lang: "fr" | "en";
  accessToken: string;
  conversationId?: string | null;
}

export function useClientChat({ lang, accessToken, conversationId }: UseClientChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentConvoId, setCurrentConvoId] = useState<string | null>(conversationId ?? null);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!userMessage.trim() || isStreaming) return;

      setError(null);
      const newMessages: ChatMessage[] = [...messages, { role: "user", content: userMessage }];
      setMessages(newMessages);
      setIsStreaming(true);
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      try {
        abortRef.current = new AbortController();

        const response = await fetch("/api/client/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            messages: newMessages,
            lang,
            conversationId: currentConvoId,
          }),
          signal: abortRef.current.signal,
        });

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          throw new Error(errBody.error || `HTTP ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) throw new Error("No reader available");

        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  setMessages((prev) => {
                    const updated = [...prev];
                    const last = updated[updated.length - 1];
                    if (last.role === "assistant") {
                      updated[updated.length - 1] = { ...last, content: last.content + parsed.text };
                    }
                    return updated;
                  });
                }
                if (parsed.conversationId) {
                  setCurrentConvoId(parsed.conversationId);
                }
              } catch {
                // skip malformed chunk
              }
            }
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        setError(errorMsg);
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && !last.content) return prev.slice(0, -1);
          return prev;
        });
      } finally {
        setIsStreaming(false);
      }
    },
    [messages, isStreaming, lang, accessToken, currentConvoId]
  );

  const stop = useCallback(() => { abortRef.current?.abort(); }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
    setIsStreaming(false);
    setCurrentConvoId(null);
  }, []);

  const loadConversation = useCallback((msgs: ChatMessage[], convoId: string) => {
    setMessages(msgs);
    setCurrentConvoId(convoId);
    setError(null);
  }, []);

  return {
    messages, isStreaming, error, conversationId: currentConvoId,
    sendMessage, stop, reset, loadConversation,
  };
}
