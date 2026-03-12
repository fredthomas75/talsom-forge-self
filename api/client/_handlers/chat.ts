import type { VercelRequest, VercelResponse } from "@vercel/node";
import { authenticateClient } from "../../_lib/client-auth.js";
import { getAnthropicClient, MODELS } from "../../_lib/anthropic.js";
import { getSiteContent, buildSystemPrompt } from "../../_lib/content-loader.js";
import { getSupabaseAdmin } from "../../_lib/supabase-server.js";
import { logAudit, ACTIONS } from "../../_lib/audit.js";
import { handleCors } from "../../_lib/cors.js";
import { checkRateLimit } from "../../_lib/rate-limit.js";

// POST /api/client/chat
// Authenticated SSE streaming chat with conversation persistence

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res, "POST, OPTIONS")) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Rate limit: 30 messages per minute per IP
  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || "unknown";
  const { allowed } = checkRateLimit(`chat:${ip}`, 30, 60_000);
  if (!allowed) return res.status(429).json({ error: "Rate limit exceeded" });

  const ctx = await authenticateClient(req);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });

  const { messages, lang = "fr", conversationId } = req.body ?? {};
  if (!messages?.length) return res.status(400).json({ error: "Messages required" });

  const supabase = getSupabaseAdmin();
  let convoId = conversationId;

  // Create or update conversation
  if (!convoId) {
    // Auto-title from first user message
    const firstMsg = messages.find((m: { role: string }) => m.role === "user");
    const title = firstMsg?.content?.slice(0, 80) || "New conversation";

    const { data: convo, error: convoErr } = await supabase
      .from("chat_conversations")
      .insert({
        tenant_id: ctx.tenantId,
        user_id: ctx.userId,
        title,
      })
      .select("id")
      .single();

    if (convoErr || !convo) {
      return res.status(500).json({ error: "Failed to create conversation" });
    }
    convoId = convo.id;

    logAudit({
      tenant_id: ctx.tenantId,
      user_id: ctx.userId,
      action: ACTIONS.CHAT_CREATE,
      resource_type: "conversation",
      resource_id: convoId,
    }, req);
  }

  // Save user message
  const lastUserMsg = messages[messages.length - 1];
  if (lastUserMsg?.role === "user") {
    await supabase.from("chat_messages").insert({
      conversation_id: convoId,
      role: "user",
      content: lastUserMsg.content,
    });
  }

  // Streaming response
  try {
    const recentMessages = messages.slice(-10);
    const content = await getSiteContent();
    const systemPrompt = buildSystemPrompt(content, lang);
    const client = getAnthropicClient();

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Send conversationId first
    res.write(`data: ${JSON.stringify({ conversationId: convoId })}\n\n`);

    let fullResponse = "";

    const stream = client.messages.stream({
      model: MODELS.DEFAULT,
      max_tokens: 4096,
      system: systemPrompt,
      messages: recentMessages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    stream.on("text", (text) => {
      fullResponse += text;
      res.write(`data: ${JSON.stringify({ text })}\n\n`);
    });

    stream.on("error", (err) => {
      console.error("Chat stream error:", err);
      if (!res.writableEnded) {
        res.write(`data: ${JSON.stringify({ error: "Stream error" })}\n\n`);
        res.end();
      }
    });

    // Wait for the final message to capture token usage
    const finalMessage = await stream.finalMessage();
    const inputTokens = finalMessage.usage?.input_tokens ?? 0;
    const outputTokens = finalMessage.usage?.output_tokens ?? 0;

    res.write(`data: [DONE]\n\n`);
    res.end();

    // Save assistant message and log usage with real token counts
    supabase.from("chat_messages").insert({
      conversation_id: convoId,
      role: "assistant",
      content: fullResponse,
    }).then(() => {});

    supabase.from("chat_conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", convoId)
      .then(() => {});

    supabase.from("usage_logs").insert({
      tenant_id: ctx.tenantId,
      endpoint: "/api/client/chat",
      model: MODELS.DEFAULT,
      tokens_used: inputTokens + outputTokens,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
    }).then(() => {});

    logAudit({
      tenant_id: ctx.tenantId,
      user_id: ctx.userId,
      action: ACTIONS.CHAT_MESSAGE,
      resource_type: "conversation",
      resource_id: convoId,
    }, req);
  } catch (error) {
    console.error("Chat error:", error);
    if (!res.headersSent) return res.status(500).json({ error: "Internal server error" });
    res.end();
  }
}
