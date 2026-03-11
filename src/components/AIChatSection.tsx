import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Send, Bot, RotateCcw, Square } from "lucide-react";
import { C, HDR_FONT } from "@/lib/constants";
import { useLang, useTheme } from "@/lib/contexts";
import { useReveal } from "@/hooks/useReveal";
import { useSection, useBi } from "@/hooks/useContent";
import { getIcon } from "@/lib/iconMap";
import { useChat } from "@/hooks/useChat";

export type ChatMsg = { role: "user" | "assistant"; text: string };

export function AIChatSection() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const chatData = useSection('aiChat');
  const bi = useBi();
  const ref = useReveal();

  // Mode: "demo" (scripted) or "live" (real AI)
  const [mode, setMode] = useState<"demo" | "live">("demo");

  // ─── Demo state ───────────────────────────────────
  const [activeScenario, setActiveScenario] = useState(chatData.scenarios[0]?.key ?? "process");
  const currentScenario = chatData.scenarios.find(s => s.key === activeScenario);
  const exchanges = currentScenario?.exchanges[lang] ?? [];
  const [demoMessages, setDemoMessages] = useState<ChatMsg[]>([]);
  const [demoInput, setDemoInput] = useState(exchanges[0]?.user ?? "");
  const [typing, setTyping] = useState(false);
  const [exchangeIdx, setExchangeIdx] = useState(0);
  const [demoEnded, setDemoEnded] = useState(false);
  const busy = useRef(false);
  const isInitialMount = useRef(true);
  const prevLang = useRef(lang);
  const prevScenario = useRef(activeScenario);

  // ─── Live chat state ──────────────────────────────
  const { messages: liveMessages, isStreaming, error: chatError, sendMessage, stop, reset: resetChat } = useChat({ lang });
  const [liveInput, setLiveInput] = useState("");

  const chatEnd = useRef<HTMLDivElement>(null);

  // Reset demo when language or scenario changes
  useEffect(() => {
    if (prevLang.current !== lang || prevScenario.current !== activeScenario) {
      prevLang.current = lang;
      prevScenario.current = activeScenario;
      busy.current = false;
      setDemoMessages([]);
      setExchangeIdx(0);
      setDemoEnded(false);
      setTyping(false);
      isInitialMount.current = true;
      const sc = chatData.scenarios.find(s => s.key === activeScenario);
      const newExchanges = sc?.exchanges[lang] ?? [];
      setDemoInput(newExchanges[0]?.user ?? "");
    }
  }, [lang, activeScenario, chatData]);

  // Scroll to bottom on new messages
  const messages = mode === "demo" ? demoMessages : liveMessages;
  useEffect(() => {
    if (isInitialMount.current && mode === "demo") { isInitialMount.current = false; return; }
    chatEnd.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, typing, isStreaming, mode]);

  const restartDemo = () => {
    busy.current = false;
    setDemoMessages([]);
    setDemoInput(exchanges[0]?.user ?? "");
    setExchangeIdx(0);
    setDemoEnded(false);
    setTyping(false);
    isInitialMount.current = true;
  };

  const handleDemoSend = () => {
    if (busy.current || demoEnded) return;
    if (exchangeIdx >= exchanges.length) { setDemoEnded(true); return; }

    const exchange = exchanges[exchangeIdx];
    busy.current = true;

    setDemoMessages((prev) => [...prev, { role: "user", text: exchange.user }]);
    setDemoInput("");

    setTimeout(() => { setTyping(true); }, 400);

    const typingDuration = Math.min(1200 + exchange.assistant.length * 2, 3000);
    setTimeout(() => {
      setTyping(false);
      setDemoMessages((prev) => [...prev, { role: "assistant", text: exchange.assistant }]);

      const nextIdx = exchangeIdx + 1;
      setExchangeIdx(nextIdx);
      busy.current = false;

      if (nextIdx >= exchanges.length) {
        setDemoEnded(true);
        setDemoInput("");
      } else {
        setDemoInput(exchanges[nextIdx].user);
      }
    }, typingDuration);
  };

  const handleLiveSend = () => {
    if (!liveInput.trim() || isStreaming) return;
    sendMessage(liveInput);
    setLiveInput("");
  };

  const switchToLive = () => {
    setMode("live");
    resetChat();
    setLiveInput("");
  };

  const switchToDemo = () => {
    setMode("demo");
    restartDemo();
  };

  // Render a message bubble (shared between demo and live)
  const renderMessage = (m: { role: string; text?: string; content?: string }, i: number) => {
    const text = m.text ?? (m as { content?: string }).content ?? "";
    return (
      <div key={i} className={`chat-bubble-in flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
        <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === "user" ? "text-white rounded-br-md" : (dark ? "bg-gray-900 border border-white/5 text-white/70 rounded-bl-md" : "bg-white border border-gray-100 text-gray-700 rounded-bl-md shadow-sm")}`} style={m.role === "user" ? { background: C.green } : undefined}>
          {text.split("\n").map((line, li) => (
            <span key={li}>
              {li > 0 && <br />}
              {line.split(/\*\*(.*?)\*\*/g).map((part, pi) =>
                pi % 2 === 1 ? <strong key={pi}>{part}</strong> : part
              )}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section id="ai-chat" className={`py-24 ${dark ? "bg-gray-950" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div ref={ref} className="reveal lg:sticky lg:top-32">
            <Badge className="mb-4 border-0 rounded-full px-3 text-xs font-semibold" style={{ background: C.yellowLight, color: C.green }}>{chatData.badge}</Badge>
            <h2 className={`text-4xl font-bold tracking-tight mb-4 ${dark ? "text-white" : ""}`} style={{ ...HDR_FONT, color: dark ? undefined : C.green }}>
              {bi(chatData.title)}
            </h2>
            <p className={`text-lg leading-relaxed mb-8 ${dark ? "text-white/45" : "text-gray-500"}`}>{bi(chatData.subtitle)}</p>
            <div className="space-y-4">
              {chatData.features.map((f, i) => {
                const FeatureIcon = getIcon(f.iconName);
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: dark ? "rgba(0,53,51,0.5)" : C.greenLight }}>
                      <FeatureIcon className="w-4 h-4" style={{ color: dark ? C.yellow : C.green }} />
                    </div>
                    <span className={`text-sm ${dark ? "text-white/60" : "text-gray-600"}`}>{bi(f.text)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`rounded-2xl border overflow-hidden shadow-lg ${dark ? "border-white/5" : "border-gray-100"}`} style={{ background: dark ? "#0a1f1e" : C.silverLight }}>
            {/* Scenario tabs (demo mode only) */}
            {mode === "demo" && (
              <div className={`flex border-b overflow-x-auto ${dark ? "bg-gray-900/50 border-white/5" : "bg-gray-50 border-gray-100"}`}>
                {chatData.scenarios.map((s) => {
                  const TabIcon = getIcon(s.iconName);
                  return (
                    <button
                      key={s.key}
                      onClick={() => setActiveScenario(s.key)}
                      className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-all border-b-2 ${
                        activeScenario === s.key
                          ? (dark ? "text-white border-current" : "border-current")
                          : (dark ? "text-white/30 hover:text-white/50 border-transparent" : "text-gray-400 hover:text-gray-600 border-transparent")
                      }`}
                      style={activeScenario === s.key ? { color: dark ? C.yellow : C.green } : undefined}
                    >
                      <TabIcon className="w-3.5 h-3.5" />
                      {bi(s.label)}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Header */}
            <div className={`px-5 py-4 border-b flex items-center gap-3 ${dark ? "bg-gray-900 border-white/5" : "bg-white border-gray-100"}`}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: C.green }}>
                <Bot className="w-5 h-5" style={{ color: C.yellow }} />
              </div>
              <div>
                <p className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-900"}`}>Talsom Forge Consultant</p>
                <p className="text-[11px] flex items-center gap-1" style={{ color: C.greenMid }}>
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: mode === "live" ? "#4AE0D2" : "#4AE0D2" }} />
                  {mode === "live"
                    ? bi({ fr: "IA active", en: "AI active" })
                    : bi({ fr: "En ligne", en: "Online" })}
                </p>
              </div>
              <Badge
                className="ml-auto border-0 text-[10px] rounded-full font-semibold cursor-pointer"
                style={{
                  background: mode === "live" ? C.green : C.yellowLight,
                  color: mode === "live" ? C.yellow : C.green,
                }}
                onClick={() => mode === "live" ? switchToDemo() : switchToLive()}
              >
                {mode === "live" ? "Live AI" : "Demo"}
              </Badge>
            </div>

            {/* Messages area */}
            <div className="h-[420px] overflow-y-auto px-5 py-5 space-y-4">
              {/* Demo mode */}
              {mode === "demo" && (
                <>
                  {demoMessages.length === 0 && !typing && (
                    <div className="flex justify-start chat-bubble-in">
                      <div className={`max-w-[85%] rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed shadow-sm ${dark ? "bg-gray-900 border border-white/5 text-white/70" : "bg-white border border-gray-100 text-gray-700"}`}>
                        {bi({
                          fr: "Bonjour! Je suis votre consultant AI Talsom Forge. Cliquez **Envoyer** pour démarrer la démo interactive.",
                          en: "Hello! I'm your Talsom Forge AI consultant. Click **Send** to start the interactive demo."
                        }).split(/\*\*(.*?)\*\*/g).map((part, pi) =>
                          pi % 2 === 1 ? <strong key={pi}>{part}</strong> : part
                        )}
                      </div>
                    </div>
                  )}
                  {demoMessages.map((m, i) => renderMessage(m, i))}
                </>
              )}

              {/* Live mode */}
              {mode === "live" && (
                <>
                  {liveMessages.length === 0 && !isStreaming && (
                    <>
                      <div className="flex justify-start chat-bubble-in">
                        <div className={`max-w-[85%] rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed shadow-sm ${dark ? "bg-gray-900 border border-white/5 text-white/70" : "bg-white border border-gray-100 text-gray-700"}`}>
                          {bi({
                            fr: "Bonjour! Je suis votre consultant AI Talsom Forge, alimenté par Claude. Posez-moi vos questions sur nos services, tarifs, ou enjeux d'affaires.",
                            en: "Hello! I'm your Talsom Forge AI consultant, powered by Claude. Ask me about our services, pricing, or business challenges."
                          }).split(/\*\*(.*?)\*\*/g).map((part, pi) =>
                            pi % 2 === 1 ? <strong key={pi}>{part}</strong> : part
                          )}
                        </div>
                      </div>
                      {/* Suggested questions */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(lang === "fr"
                          ? ["Comment fonctionne le modèle Hub & Spoke?", "Qu'est-ce que le framework ADKAR?", "Quels sont vos services?", "Comment déployer Copilot 365?"]
                          : ["How does the Hub & Spoke model work?", "What is the ADKAR framework?", "What services do you offer?", "How to deploy Copilot 365?"]
                        ).map((q) => (
                          <button
                            key={q}
                            onClick={() => { sendMessage(q); }}
                            className={`text-xs px-3 py-1.5 rounded-full border transition-all hover:scale-105 ${dark ? "border-white/10 text-white/50 hover:text-white hover:bg-white/5" : "border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                  {liveMessages.map((m, i) => renderMessage({ role: m.role, text: m.content }, i))}
                  {chatError && (
                    <div className="flex justify-center">
                      <p className="text-xs text-red-400 bg-red-400/10 rounded-full px-3 py-1">{chatError}</p>
                    </div>
                  )}
                </>
              )}

              {/* Typing indicator (demo mode) */}
              {mode === "demo" && typing && (
                <div className="flex justify-start chat-bubble-in">
                  <div className={`rounded-2xl rounded-bl-md px-4 py-3 shadow-sm ${dark ? "bg-gray-900 border border-white/5" : "bg-white border border-gray-100"}`}>
                    <div className="flex gap-1.5">
                      {[0, 150, 300].map((d) => <span key={d} className="w-2 h-2 rounded-full animate-bounce" style={{ background: C.silver, animationDelay: `${d}ms` }} />)}
                    </div>
                  </div>
                </div>
              )}

              {/* Streaming indicator (live mode) */}
              {mode === "live" && isStreaming && liveMessages[liveMessages.length - 1]?.content === "" && (
                <div className="flex justify-start chat-bubble-in">
                  <div className={`rounded-2xl rounded-bl-md px-4 py-3 shadow-sm ${dark ? "bg-gray-900 border border-white/5" : "bg-white border border-gray-100"}`}>
                    <div className="flex gap-1.5">
                      {[0, 150, 300].map((d) => <span key={d} className="w-2 h-2 rounded-full animate-bounce" style={{ background: C.silver, animationDelay: `${d}ms` }} />)}
                    </div>
                  </div>
                </div>
              )}

              {/* Demo ended */}
              {mode === "demo" && demoEnded && (
                <div className="chat-bubble-in flex flex-col items-center gap-3 py-4">
                  <p className={`text-xs ${dark ? "text-white/25" : "text-gray-400"}`}>{bi({ fr: "Fin de la démo interactive", en: "End of interactive demo" })}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className={`rounded-full text-xs ${dark ? "border-white/10" : "border-gray-200"}`} onClick={restartDemo}>
                      {bi({ fr: "Recommencer la démo", en: "Restart demo" })}
                    </Button>
                    <Button size="sm" className="rounded-full text-xs border-0 hover:opacity-90 transition-opacity" style={{ background: C.yellow, color: C.green }} onClick={switchToLive}>
                      {bi({ fr: "Accéder au chat complet", en: "Access full chat" })}
                    </Button>
                  </div>
                </div>
              )}
              <div ref={chatEnd} />
            </div>

            {/* Input area */}
            <div className={`border-t p-4 ${dark ? "bg-gray-900 border-white/5" : "bg-white border-gray-100"}`}>
              <div className="flex gap-2">
                {mode === "demo" ? (
                  <>
                    <Input
                      placeholder={demoEnded ? bi({ fr: "Démo terminée — recommencez ou accédez au chat complet", en: "Demo ended — restart or access full chat" }) : bi({ fr: "Posez une question sur vos enjeux d\u2019affaires\u2026", en: "Ask a question about your business challenges\u2026" })}
                      value={demoInput}
                      readOnly
                      onKeyDown={(e: React.KeyboardEvent) => e.key === "Enter" && handleDemoSend()}
                      className={`rounded-full text-sm cursor-default ${dark ? "border-white/10 bg-white/5 text-white" : "border-gray-200 bg-gray-50"}`}
                    />
                    <Button
                      size="icon"
                      onClick={handleDemoSend}
                      disabled={busy.current || demoEnded}
                      className="rounded-full shrink-0 hover:opacity-90 border-0 disabled:opacity-40 transition-opacity"
                      style={{ background: C.green, color: C.yellow }}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Input
                      placeholder={bi({ fr: "Posez votre question\u2026", en: "Ask your question\u2026" })}
                      value={liveInput}
                      onChange={(e) => setLiveInput(e.target.value)}
                      onKeyDown={(e: React.KeyboardEvent) => e.key === "Enter" && handleLiveSend()}
                      className={`rounded-full text-sm ${dark ? "border-white/10 bg-white/5 text-white placeholder:text-white/30" : "border-gray-200 bg-gray-50"}`}
                      disabled={isStreaming}
                    />
                    {isStreaming ? (
                      <Button
                        size="icon"
                        onClick={stop}
                        className="rounded-full shrink-0 hover:opacity-90 border-0 transition-opacity"
                        style={{ background: C.green, color: C.yellow }}
                      >
                        <Square className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        size="icon"
                        onClick={handleLiveSend}
                        disabled={!liveInput.trim()}
                        className="rounded-full shrink-0 hover:opacity-90 border-0 disabled:opacity-40 transition-opacity"
                        style={{ background: C.green, color: C.yellow }}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => { resetChat(); setLiveInput(""); }}
                      className={`rounded-full shrink-0 ${dark ? "border-white/10" : "border-gray-200"}`}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
              <p className={`text-[10px] mt-2 text-center ${dark ? "text-white/20" : "text-gray-400"}`}>
                {mode === "demo"
                  ? (demoEnded
                      ? bi({ fr: "Merci d\u2019avoir exploré la démo!", en: "Thanks for exploring the demo!" })
                      : `${bi({ fr: "Démo interactive", en: "Interactive demo" })} · ${bi({ fr: "Étape", en: "Step" })} ${exchangeIdx + 1}/${exchanges.length}`)
                  : bi({ fr: "Propulsé par Claude AI · Talsom Forge", en: "Powered by Claude AI · Talsom Forge" })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
