import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAnthropicClient, MODELS } from "./_lib/anthropic.js";
import { getSiteContent, buildSystemPrompt } from "./_lib/content-loader.js";
import { checkRateLimit } from "./_lib/rate-limit.js";
import { getSupabaseAdmin } from "./_lib/supabase-server.js";
import { handleCors } from "_lib/cors.js";

interface ChatRequestBody {
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  lang: "fr" | "en";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res, "POST, OPTIONS")) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || "unknown";
  const { allowed, remaining } = checkRateLimit(ip, 20, 60_000);
  res.setHeader("X-RateLimit-Remaining", remaining.toString());

  if (!allowed) {
    return res.status(429).json({ error: "Rate limit exceeded. Try again in a minute." });
  }

  try {
    const { messages, lang = "fr" } = req.body as ChatRequestBody;

    if (!messages?.length) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    // Keep only last 10 messages to stay within context limits
    const recentMessages = messages.slice(-10);

    const content = await getSiteContent();
    const systemPrompt = buildSystemPrompt(content, lang);
    const client = getAnthropicClient();

    // Streaming SSE response
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = client.messages.stream({
      model: MODELS.DEFAULT,
      max_tokens: 1024,
      system: systemPrompt,
      messages: recentMessages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    stream.on("text", (text) => {
      res.write(`data: ${JSON.stringify({ text })}\n\n`);
    });

    stream.on("error", (err) => {
      console.error("Stream error:", err);
      if (!res.writableEnded) {
        res.write(`data: ${JSON.stringify({ error: "Stream error" })}\n\n`);
        res.end();
      }
    });

    // Wait for final message to capture token usage
    const finalMessage = await stream.finalMessage();
    const inputTokens = finalMessage.usage?.input_tokens ?? 0;
    const outputTokens = finalMessage.usage?.output_tokens ?? 0;

    res.write(`data: [DONE]\n\n`);
    res.end();

    // Log usage with real token counts (fire and forget)
    try {
      const sb = getSupabaseAdmin();
      sb.from("usage_logs").insert({
        endpoint: "/api/chat",
        model: MODELS.DEFAULT,
        tokens_used: inputTokens + outputTokens,
        input_tokens: inputTokens,
        output_tokens: outputTokens,
      }).then(() => {});
    } catch { /* ignore logging errors */ }
  } catch (error) {
    console.error("Chat error:", error);
    if (!res.headersSent) {
      return res.status(500).json({ error: "Internal server error" });
    }
    res.end();
  }
}
