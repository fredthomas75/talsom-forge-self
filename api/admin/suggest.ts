import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAnthropicClient, MODELS } from "../_lib/anthropic.js";
import { getSupabaseAdmin } from "../_lib/supabase-server.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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
    const { currentContent, fieldLabel, sectionKey, count = 3 } = req.body;

    if (!currentContent || !fieldLabel) {
      return res.status(400).json({ error: "currentContent and fieldLabel are required" });
    }

    const client = getAnthropicClient();

    const response = await client.messages.create({
      model: MODELS.FAST,
      max_tokens: 1024,
      system: `You are a content suggestion engine for Talsom Forge, a bilingual virtual consulting platform.
Generate exactly ${count} alternative text suggestions for the given field.
Return a JSON array of strings. No markdown, no explanations, just the JSON array.`,
      messages: [
        {
          role: "user",
          content: `Section: ${sectionKey}\nField: ${fieldLabel}\nCurrent value: "${currentContent}"\n\nGenerate ${count} improved alternatives.`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "[]";

    try {
      const suggestions = JSON.parse(text);
      return res.status(200).json({ suggestions });
    } catch {
      return res.status(200).json({ suggestions: [text] });
    }
  } catch (error) {
    console.error("Suggest error:", error);
    return res.status(500).json({ error: "Suggestion failed" });
  }
}
