import type { VercelRequest, VercelResponse } from "@vercel/node";
import { authenticateClient } from "../../_lib/client-auth.js";
import { TOOLS, executeTool } from "../../_lib/mcp-tools.js";
import { getSupabaseAdmin } from "../../_lib/supabase-server.js";
import { logAudit, ACTIONS } from "../../_lib/audit.js";

// POST /api/client/tools/query
// Execute an MCP tool with JWT auth + quota check

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ctx = await authenticateClient(req);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });

  // Check MCP tools feature
  if (ctx.quotas?.features?.mcp_tools === false) {
    return res.status(403).json({ error: "MCP tools not available on your plan. Upgrade to access." });
  }

  const { tool, args = {} } = req.body ?? {};
  if (!tool) return res.status(400).json({ error: "Missing tool name" });

  // Validate tool name
  const toolDef = TOOLS.find((t) => t.name === tool);
  if (!toolDef) return res.status(400).json({ error: `Unknown tool: ${tool}` });

  try {
    const result = await executeTool(tool, args);

    // Log usage
    const supabase = getSupabaseAdmin();
    supabase.from("usage_logs").insert({
      tenant_id: ctx.tenantId,
      endpoint: "/api/client/tools/query",
      model: "mcp-tool",
      tokens_used: 0,
    }).then(() => {});

    logAudit({
      tenant_id: ctx.tenantId,
      user_id: ctx.userId,
      action: ACTIONS.TOOL_QUERY,
      resource_type: "tool",
      resource_id: tool,
      metadata: { args },
    }, req);

    return res.status(200).json({ tool, result });
  } catch (err) {
    console.error("Tool query error:", err);
    return res.status(500).json({ error: "Tool execution failed" });
  }
}
