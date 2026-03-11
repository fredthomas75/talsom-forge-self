import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAnthropicClient, MODELS } from "../_lib/anthropic.js";
import { getSupabaseAdmin } from "../_lib/supabase-server.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Verify admin auth via Supabase JWT
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const supabase = getSupabaseAdmin();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));

  if (authError || !user) {
    return res.status(401).json({ error: "Invalid token" });
  }

  try {
    const { prompt, sectionKey, fieldPath, lang = "fr" } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const client = getAnthropicClient();

    const response = await client.messages.create({
      model: MODELS.DEFAULT,
      max_tokens: 2048,
      system: `You are a content writer for Talsom Forge, a bilingual (FR/EN) virtual consulting platform.
Generate content in ${lang === "fr" ? "French" : "English"}.
The content should be professional, concise, and aligned with Talsom's brand voice.
Talsom Forge specializes in: Business & Process Design, IT Modernization, AI Strategy & Governance, Organizational Performance.
Return ONLY the generated text, no explanations or wrapping.`,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    return res.status(200).json({ generated: text, sectionKey, fieldPath });
  } catch (error) {
    console.error("Generate error:", error);
    return res.status(500).json({ error: "Generation failed" });
  }
}
