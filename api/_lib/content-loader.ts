import { getSupabaseAdmin } from "./supabase-server.js";

export interface ContentSection {
  section_key: string;
  content: Record<string, unknown>;
}

let cachedContent: ContentSection[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getSiteContent(): Promise<ContentSection[]> {
  const now = Date.now();
  if (cachedContent && now - cacheTimestamp < CACHE_TTL) {
    return cachedContent;
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("content_sections")
    .select("section_key, content");

  if (error) throw new Error(`Failed to load content: ${error.message}`);

  cachedContent = (data ?? []) as ContentSection[];
  cacheTimestamp = now;
  return cachedContent;
}

export function buildSystemPrompt(content: ContentSection[], lang: "fr" | "en"): string {
  const sections = content
    .map((s) => `## ${s.section_key}\n${JSON.stringify(s.content, null, 2)}`)
    .join("\n\n");

  const langInstructions =
    lang === "fr"
      ? "Réponds toujours en français. Tu es un consultant senior Talsom Forge."
      : "Always respond in English. You are a senior Talsom Forge consultant.";

  return `You are Talsom Forge AI Consultant, a bilingual virtual consulting assistant specialized in:
- Business & Process Design (AI Native redesign)
- IT Modernization Roadmaps
- AI Strategy & Governance
- Organizational Performance & Change Management

${langInstructions}

Here is the complete knowledge base about Talsom Forge services, pricing, case studies, and offerings:

${sections}

Rules:
- Be professional, concise, and actionable
- Reference specific services, pricing, and case studies when relevant
- Suggest next steps and specific service recommendations
- If asked about something outside your expertise, redirect to contacting Talsom directly
- Format responses with markdown for readability`;
}
