import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAnthropicClient, MODELS } from "../_lib/anthropic.js";
import { getSiteContent, buildSystemPrompt } from "../_lib/content-loader.js";
import { authenticateTenant } from "../_lib/auth.js";
import { checkRateLimit } from "../_lib/rate-limit.js";
import { handleCors } from "../_lib/cors.js";

interface ChatRequestBody {
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  lang?: "fr" | "en";
  model?: "default" | "fast" | "complex";
  stream?: boolean;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  if (handleCors(req, res, "POST, OPTIONS")) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Authenticate tenant
  const tenant = await authenticateTenant(req);
  if (!tenant) {
    return res.status(401).json({ error: "Invalid API key. Provide X-API-Key header." });
  }

  if (!tenant.permissions.includes("chat")) {
    return res.status(403).json({ error: "Chat access not permitted" });
  }

  // Per-tenant rate limiting
  const { allowed, remaining } = checkRateLimit(
    `tenant:${tenant.tenantId}`,
    tenant.rateLimitPerMinute,
    60_000
  );
  res.setHeader("X-RateLimit-Remaining", remaining.toString());

  if (!allowed) {
    return res.status(429).json({ error: "Rate limit exceeded" });
  }

  try {
    const {
      messages,
      lang = "fr",
      model: modelChoice = "default",
      stream = true,
    } = req.body as ChatRequestBody;

    if (!messages?.length) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const recentMessages = messages.slice(-10);
    const content = await getSiteContent();
    const systemPrompt = buildSystemPrompt(content, lang);
    const client = getAnthropicClient();

    const modelId =
      modelChoice === "fast"
        ? MODELS.FAST
        : modelChoice === "complex"
          ? MODELS.COMPLEX
          : MODELS.DEFAULT;

    if (stream) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const apiStream = client.messages.stream({
        model: modelId,
        max_tokens: 1024,
        system: systemPrompt,
        messages: recentMessages.map((m) => ({ role: m.role, content: m.content })),
      });

      apiStream.on("text", (text) => {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      });

      apiStream.on("end", () => {
        res.write(`data: [DONE]\n\n`);
        res.end();
      });

      apiStream.on("error", (err) => {
        console.error("Stream error:", err);
        if (!res.writableEnded) {
          res.write(`data: ${JSON.stringify({ error: "Stream error" })}\n\n`);
          res.end();
        }
      });
    } else {
      // Non-streaming response
      const response = await client.messages.create({
        model: modelId,
        max_tokens: 1024,
        system: systemPrompt,
        messages: recentMessages.map((m) => ({ role: m.role, content: m.content })),
      });

      const text = response.content[0].type === "text" ? response.content[0].text : "";

      return res.status(200).json({
        content: text,
        model: modelId,
        usage: response.usage,
      });
    }
  } catch (error) {
    console.error("External chat error:", error);
    if (!res.headersSent) {
      return res.status(500).json({ error: "Internal server error" });
    }
    res.end();
  }
}
