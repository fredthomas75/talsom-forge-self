import type { VercelRequest, VercelResponse } from "@vercel/node";
import { authenticateTenant } from "../_lib/auth.js";
import { getSiteContent } from "../_lib/content-loader.js";
import { TOOLS, executeTool } from "../_lib/mcp-tools.js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Security headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-API-Key, Authorization");

  if (req.method === "OPTIONS") return res.status(204).end();

  // Authenticate
  const tenant = await authenticateTenant(req);
  if (!tenant) return res.status(401).json({ error: "Invalid API key" });
  if (!tenant.permissions.includes("mcp") && !tenant.permissions.includes("chat")) {
    return res.status(403).json({ error: "MCP access not permitted" });
  }

  // GET: Server info + tool listing
  if (req.method === "GET") {
    return res.status(200).json({
      name: "talsom-forge-knowledge",
      version: "2.0.0",
      description: "Talsom Forge AI Consulting knowledge base — 13 specialized tools covering AI strategy, governance, Microsoft stack, change management, and more",
      tools: TOOLS,
    });
  }

  // POST: MCP protocol
  if (req.method === "POST") {
    const { method, params } = req.body;

    if (method === "tools/list") {
      return res.status(200).json({ tools: TOOLS });
    }

    if (method === "tools/call") {
      const { name, arguments: args } = params ?? {};
      const content = await getSiteContent();
      const result = await executeTool(name, args ?? {}, content);
      return res.status(200).json({
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      });
    }

    return res.status(400).json({ error: "Unknown MCP method" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
