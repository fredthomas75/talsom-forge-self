import type { VercelRequest, VercelResponse } from "@vercel/node";
import { authenticateClient } from "../../_lib/client-auth.js";
import { getAnthropicClient, MODELS } from "../../_lib/anthropic.js";
import { getSiteContent } from "../../_lib/content-loader.js";
import { TOOL_TO_SECTION } from "../../_lib/mcp-tools.js";
import { TOOL_PROMPTS, buildToolSystemPrompt } from "../../_lib/tool-prompts.js";
import { getSupabaseAdmin } from "../../_lib/supabase-server.js";
import { logAudit, ACTIONS } from "../../_lib/audit.js";
import {
  FILE_GENERATION_TOOLS, generateExcel, generateWord, generatePptx,
  type GenerateWordInput, type GeneratePptxInput, type BrandContext,
} from "../../_lib/file-generators.js";
import { uploadGeneratedFile } from "../../_lib/file-storage.js";
import { handleCors } from "../../_lib/cors.js";
import { checkRateLimit } from "../../_lib/rate-limit.js";

// POST /api/client/tools/chat
// Conversational tool chat with SSE streaming.
// Supports multimodal: images, PDFs, and text-based file attachments.

interface AttachmentPayload {
  name: string;
  type: string;   // mime type
  data: string;   // base64
  size: number;
}

// Anthropic content block types
type ContentBlock =
  | { type: "text"; text: string }
  | { type: "image"; source: { type: "base64"; media_type: string; data: string } }
  | { type: "document"; source: { type: "base64"; media_type: "application/pdf"; data: string } };

const IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/gif", "image/webp"]);
const TEXT_TYPES = new Set([
  "text/plain", "text/csv", "text/markdown", "text/xml",
  "application/json", "application/xml",
]);
const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_ATTACHMENTS = 5;

function buildUserContentBlocks(
  textContent: string,
  attachments?: AttachmentPayload[]
): string | ContentBlock[] {
  if (!attachments || attachments.length === 0) return textContent;

  const blocks: ContentBlock[] = [];

  // Add file attachments first
  for (const att of attachments.slice(0, MAX_ATTACHMENTS)) {
    if (att.size > MAX_ATTACHMENT_SIZE) continue;

    if (IMAGE_TYPES.has(att.type)) {
      // Vision — image block
      blocks.push({
        type: "image",
        source: { type: "base64", media_type: att.type, data: att.data },
      });
    } else if (att.type === "application/pdf") {
      // PDF document block (Claude can read PDFs natively)
      blocks.push({
        type: "document",
        source: { type: "base64", media_type: "application/pdf", data: att.data },
      });
    } else if (TEXT_TYPES.has(att.type)) {
      // Text-based file — decode and include as text
      try {
        const decoded = Buffer.from(att.data, "base64").toString("utf-8");
        blocks.push({
          type: "text",
          text: `--- Contenu du fichier / File content: ${att.name} ---\n${decoded}\n--- Fin / End: ${att.name} ---`,
        });
      } catch {
        blocks.push({
          type: "text",
          text: `[Fichier ${att.name} non lisible / File ${att.name} unreadable]`,
        });
      }
    } else {
      // Unsupported type — mention it
      blocks.push({
        type: "text",
        text: `[Fichier joint / Attached file: ${att.name} (${att.type}) — format non supporté pour l'analyse directe / unsupported for direct analysis]`,
      });
    }
  }

  // Add user's text message
  if (textContent) {
    blocks.push({ type: "text", text: textContent });
  }

  return blocks;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res, "POST, OPTIONS")) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Rate limit: 20 tool-chat messages per minute per IP
  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || "unknown";
  const { allowed } = checkRateLimit(`tool-chat:${ip}`, 20, 60_000);
  if (!allowed) return res.status(429).json({ error: "Rate limit exceeded" });

  const ctx = await authenticateClient(req);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });

  const { toolName, messages, lang = "fr", conversationId, attachments } = req.body ?? {};

  if (!toolName || !TOOL_PROMPTS[toolName]) {
    return res.status(400).json({ error: `Invalid tool: ${toolName}` });
  }
  if (!messages?.length) {
    return res.status(400).json({ error: "Messages required" });
  }

  const supabase = getSupabaseAdmin();
  const toolConfig = TOOL_PROMPTS[toolName];
  let convoId = conversationId;

  // ── Create or reuse conversation ──
  if (!convoId) {
    const firstMsg = messages.find((m: { role: string }) => m.role === "user");
    const title = firstMsg?.content?.slice(0, 80) || toolName;

    const { data: convo, error: convoErr } = await supabase
      .from("chat_conversations")
      .insert({
        tenant_id: ctx.tenantId,
        user_id: ctx.userId,
        title,
        tool_name: toolName,
      })
      .select("id")
      .single();

    if (convoErr || !convo) {
      console.error("[tool-chat] create conversation failed:", convoErr);
      return res.status(500).json({ error: "Failed to create conversation" });
    }
    convoId = convo.id;

    logAudit({
      tenant_id: ctx.tenantId,
      user_id: ctx.userId,
      action: ACTIONS.TOOL_CHAT,
      resource_type: "tool_conversation",
      resource_id: convoId,
      metadata: { toolName },
    }, req);
  }

  // ── Save user message ──
  const lastUserMsg = messages[messages.length - 1];
  if (lastUserMsg?.role === "user") {
    const attachNames = (attachments as AttachmentPayload[] | undefined)
      ?.map((a) => a.name) ?? [];

    await supabase.from("chat_messages").insert({
      conversation_id: convoId,
      role: "user",
      content: lastUserMsg.content + (attachNames.length > 0
        ? `\n\n[📎 ${attachNames.join(", ")}]`
        : ""),
    });
  }

  // ── Build system prompt ──
  try {
    // 1. Load KB data for this tool
    const content = await getSiteContent();
    let kbData = "";

    const sectionKey = TOOL_TO_SECTION[toolName];
    if (sectionKey) {
      const section = content.find((s) => s.section_key === sectionKey);
      kbData = section ? JSON.stringify(section.content, null, 2) : "No data available for this section.";
    } else if (toolName === "search_content") {
      kbData = content
        .map((s) => `### ${s.section_key}\n${JSON.stringify(s.content, null, 2)}`)
        .join("\n\n");
    }

    // 2. Load tenant profile context (if exists)
    let tenantContext = "";
    const { data: profile } = await supabase
      .from("tenant_profile")
      .select("*")
      .eq("tenant_id", ctx.tenantId)
      .single();

    if (profile) {
      const parts = [`## Contexte Client / Client Context`];
      if (ctx.tenantName) parts.push(`- Entreprise / Company: ${ctx.tenantName}`);
      if (profile.industry) parts.push(`- Industrie / Industry: ${profile.industry}`);
      if (profile.company_size) parts.push(`- Taille / Size: ${profile.company_size}`);
      if (profile.headquarters) parts.push(`- Siège / HQ: ${profile.headquarters}`);
      if (profile.description) parts.push(`- Description: ${profile.description}`);
      if (profile.mission_statement) parts.push(`- Mission: ${profile.mission_statement}`);
      if (profile.target_audience) parts.push(`- Public cible / Target: ${profile.target_audience}`);
      if (profile.key_products) parts.push(`- Produits / Products: ${profile.key_products}`);
      if (profile.brand_tone) parts.push(`- Ton / Tone: ${profile.brand_tone}`);
      if (profile.custom_instructions) parts.push(`\n### Instructions spéciales / Custom Instructions\n${profile.custom_instructions}`);
      tenantContext = parts.join("\n");
    }

    // 3. Build the full system prompt
    const systemPrompt = buildToolSystemPrompt(toolConfig, kbData, lang as "fr" | "en", tenantContext || undefined);

    // ── Build messages for Anthropic ──
    const recentMessages = messages.slice(-10);

    // Convert messages, injecting attachments on the LAST user message only
    const anthropicMessages = recentMessages.map((m: { role: string; content: string }, idx: number) => {
      const isLastUser = m.role === "user" && idx === recentMessages.length - 1;

      return {
        role: m.role as "user" | "assistant",
        content: isLastUser
          ? buildUserContentBlocks(m.content, attachments as AttachmentPayload[] | undefined)
          : m.content,
      };
    });

    // ── Stream response with agentic tool_use loop ──
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Send conversationId first
    res.write(`data: ${JSON.stringify({ conversationId: convoId })}\n\n`);

    let fullResponse = "";
    const client = getAnthropicClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let currentMessages: any[] = [...anthropicMessages];
    const MAX_TOOL_ROUNDS = 3;
    let totalInputTokens = 0;
    let totalOutputTokens = 0;

    for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
      const stream = client.messages.stream({
        model: MODELS.DEFAULT,
        max_tokens: 8192,
        system: systemPrompt,
        messages: currentMessages,
        tools: FILE_GENERATION_TOOLS,
      });

      // Stream text deltas to client in real-time
      stream.on("text", (text) => {
        fullResponse += text;
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      });

      let finalMessage;
      try {
        finalMessage = await stream.finalMessage();
        // Accumulate token usage across tool-use rounds
        totalInputTokens += finalMessage.usage?.input_tokens ?? 0;
        totalOutputTokens += finalMessage.usage?.output_tokens ?? 0;
      } catch (streamErr) {
        console.error("[tool-chat] stream error:", streamErr);
        if (!res.writableEnded) {
          res.write(`data: ${JSON.stringify({ error: "Stream error" })}\n\n`);
        }
        break;
      }

      // If no tool_use or max rounds reached, we're done
      if (finalMessage.stop_reason !== "tool_use" || round === MAX_TOOL_ROUNDS) {
        break;
      }

      // ── Handle tool_use blocks ──
      const toolUseBlocks = finalMessage.content.filter(
        (b): b is { type: "tool_use"; id: string; name: string; input: Record<string, unknown> } =>
          b.type === "tool_use"
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const toolResults: any[] = [];

      // Brand context for file branding (company name, industry from tenant profile)
      const brandCtx: BrandContext = {
        companyName: ctx.tenantName || profile?.company_name || undefined,
        industry: profile?.industry || undefined,
      };

      for (const block of toolUseBlocks) {
        if (block.name === "generate_excel") {
          try {
            const input = block.input as { file_name: string; sheets: { name: string; columns: string[]; rows: (string | number | boolean | null)[][] }[] };
            const buffer = await generateExcel(input, brandCtx);
            const file = await uploadGeneratedFile(
              ctx.tenantId,
              `${input.file_name}.xlsx`,
              buffer,
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );

            res.write(`data: ${JSON.stringify({
              file: { name: file.name, url: file.url, size: file.size, type: file.type },
            })}\n\n`);

            toolResults.push({
              type: "tool_result",
              tool_use_id: block.id,
              content: `File "${file.name}" generated successfully (${(file.size / 1024).toFixed(1)} KB). The download link has been delivered to the user.`,
            });
          } catch (err) {
            console.error("[tool-chat] excel generation error:", err);
            toolResults.push({
              type: "tool_result",
              tool_use_id: block.id,
              content: `Error generating file: ${err instanceof Error ? err.message : "Unknown error"}`,
              is_error: true,
            });
          }
        } else if (block.name === "generate_word") {
          try {
            const input = block.input as GenerateWordInput;
            const buffer = await generateWord(input, brandCtx);
            const file = await uploadGeneratedFile(
              ctx.tenantId,
              `${input.file_name}.docx`,
              buffer,
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            );

            res.write(`data: ${JSON.stringify({
              file: { name: file.name, url: file.url, size: file.size, type: file.type },
            })}\n\n`);

            toolResults.push({
              type: "tool_result",
              tool_use_id: block.id,
              content: `File "${file.name}" generated successfully (${(file.size / 1024).toFixed(1)} KB). The download link has been delivered to the user.`,
            });
          } catch (err) {
            console.error("[tool-chat] word generation error:", err);
            toolResults.push({
              type: "tool_result",
              tool_use_id: block.id,
              content: `Error generating file: ${err instanceof Error ? err.message : "Unknown error"}`,
              is_error: true,
            });
          }
        } else if (block.name === "generate_pptx") {
          try {
            const input = block.input as GeneratePptxInput;
            const buffer = await generatePptx(input, brandCtx);
            const file = await uploadGeneratedFile(
              ctx.tenantId,
              `${input.file_name}.pptx`,
              buffer,
              "application/vnd.openxmlformats-officedocument.presentationml.presentation"
            );

            res.write(`data: ${JSON.stringify({
              file: { name: file.name, url: file.url, size: file.size, type: file.type },
            })}\n\n`);

            toolResults.push({
              type: "tool_result",
              tool_use_id: block.id,
              content: `File "${file.name}" generated successfully (${(file.size / 1024).toFixed(1)} KB). The download link has been delivered to the user.`,
            });
          } catch (err) {
            console.error("[tool-chat] pptx generation error:", err);
            toolResults.push({
              type: "tool_result",
              tool_use_id: block.id,
              content: `Error generating file: ${err instanceof Error ? err.message : "Unknown error"}`,
              is_error: true,
            });
          }
        }
      }

      // Append assistant content + tool results for next round
      currentMessages = [
        ...currentMessages,
        { role: "assistant" as const, content: finalMessage.content },
        { role: "user" as const, content: toolResults },
      ];
    }

    // ── Finalize ──
    res.write(`data: [DONE]\n\n`);
    res.end();

    // Save assistant response (text only, excludes tool_use blocks)
    supabase.from("chat_messages").insert({
      conversation_id: convoId,
      role: "assistant",
      content: fullResponse,
    }).then(() => {});

    supabase.from("chat_conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", convoId)
      .then(() => {});

    // Log usage with real token counts
    supabase.from("usage_logs").insert({
      tenant_id: ctx.tenantId,
      endpoint: "/api/client/tools/chat",
      model: MODELS.DEFAULT,
      tokens_used: totalInputTokens + totalOutputTokens,
      input_tokens: totalInputTokens,
      output_tokens: totalOutputTokens,
    }).then(() => {});
  } catch (error) {
    console.error("[tool-chat] error:", error);
    if (!res.headersSent) return res.status(500).json({ error: "Internal server error" });
    res.end();
  }
}
