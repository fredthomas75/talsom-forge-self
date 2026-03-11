import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

export const MODELS = {
  DEFAULT: "claude-sonnet-4-20250514",
  COMPLEX: "claude-opus-4-20250514",
  FAST: "claude-haiku-4-5-20250414",
} as const;
