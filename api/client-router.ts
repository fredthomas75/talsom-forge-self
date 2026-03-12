import type { VercelRequest, VercelResponse } from "@vercel/node";

// ─── CATCH-ALL ROUTER FOR /api/client/* ─────────────────
// Consolidates all client API endpoints into a single Vercel serverless function
// to stay within Vercel Hobby plan's 12-function limit.
// Vercel rewrites /api/client/:path* → /api/client-router?_path=:path*

import meHandler from "./client/_handlers/me.js";
import signupHandler from "./client/_handlers/signup.js";
import onboardHandler from "./client/_handlers/onboard.js";
import acceptInviteHandler from "./client/_handlers/accept-invite.js";
import dashboardHandler from "./client/_handlers/dashboard.js";
import chatHandler from "./client/_handlers/chat.js";
import conversationsHandler from "./client/_handlers/conversations.js";
import conversationsByIdHandler from "./client/_handlers/conversations-by-id.js";
import toolsQueryHandler from "./client/_handlers/tools-query.js";
import toolChatHandler from "./client/_handlers/tool-chat.js";
import keysHandler from "./client/_handlers/keys.js";
import keysByIdHandler from "./client/_handlers/keys-by-id.js";
import usageHandler from "./client/_handlers/usage.js";
import teamHandler from "./client/_handlers/team.js";
import teamInviteHandler from "./client/_handlers/team-invite.js";
import teamByIdHandler from "./client/_handlers/team-by-id.js";
import settingsHandler from "./client/_handlers/settings.js";
import auditLogHandler from "./client/_handlers/audit-log.js";
import billingCheckoutHandler from "./client/_handlers/billing-checkout.js";
import billingPortalHandler from "./client/_handlers/billing-portal.js";
import billingWebhookHandler from "./client/_handlers/billing-webhook.js";
import tenantProfileHandler from "./client/_handlers/tenant-profile.js";
import tenantAssetsHandler from "./client/_handlers/tenant-assets.js";
import integrationsHandler from "./client/_handlers/integrations.js";
import reviewsHandler from "./client/_handlers/reviews.js";
import reviewsByIdHandler from "./client/_handlers/reviews-by-id.js";
import reviewPricingHandler from "./client/_handlers/review-pricing.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Parse path from rewrite query param: /api/client/billing/checkout → _path="billing/checkout"
  const rawPath = (req.query._path as string) ?? "";
  const segments = rawPath.split("/").filter(Boolean);

  const seg0 = segments[0] ?? "";
  const seg1 = segments[1] ?? "";
  const seg2 = segments[2] ?? "";

  // Route to appropriate handler
  switch (seg0) {
    // ── Auth & Profile ──
    case "me":
      return meHandler(req, res);

    case "signup":
      return signupHandler(req, res);

    case "onboard":
      return onboardHandler(req, res);

    case "accept-invite":
      return acceptInviteHandler(req, res);

    // ── Dashboard ──
    case "dashboard":
      return dashboardHandler(req, res);

    // ── Chat (SSE streaming) ──
    case "chat":
      return chatHandler(req, res);

    // ── Conversations ──
    case "conversations":
      if (seg1) {
        req.query.id = seg1;
        return conversationsByIdHandler(req, res);
      }
      return conversationsHandler(req, res);

    // ── MCP Tools ──
    case "tools":
      if (seg1 === "query") return toolsQueryHandler(req, res);
      if (seg1 === "chat") return toolChatHandler(req, res);
      break;

    // ── API Keys ──
    case "keys":
      if (seg1) {
        req.query.id = seg1;
        return keysByIdHandler(req, res);
      }
      return keysHandler(req, res);

    // ── Usage ──
    case "usage":
      return usageHandler(req, res);

    // ── Team ──
    case "team":
      if (seg1 === "invite") return teamInviteHandler(req, res);
      if (seg1) {
        req.query.id = seg1;
        return teamByIdHandler(req, res);
      }
      return teamHandler(req, res);

    // ── Settings ──
    case "settings":
      return settingsHandler(req, res);

    // ── Audit Log ──
    case "audit-log":
      return auditLogHandler(req, res);

    // ── Cloud Integrations (Google Workspace / Microsoft 365) ──
    case "integrations":
      req.query._seg1 = seg1;
      req.query._seg2 = seg2;
      return integrationsHandler(req, res);

    // ── Customization (tenant profile + assets) ──
    case "customization":
      if (seg1 === "profile") return tenantProfileHandler(req, res);
      if (seg1 === "assets") {
        if (seg2) { req.query.id = seg2; }
        return tenantAssetsHandler(req, res);
      }
      break;

    // ── Human Reviews ──
    case "review-pricing":
      return reviewPricingHandler(req, res);

    case "reviews":
      if (seg1) {
        req.query.id = seg1;
        return reviewsByIdHandler(req, res);
      }
      return reviewsHandler(req, res);

    // ── Billing ──
    case "billing":
      if (seg1 === "checkout") return billingCheckoutHandler(req, res);
      if (seg1 === "portal") return billingPortalHandler(req, res);
      if (seg1 === "webhook") return billingWebhookHandler(req, res);
      break;
  }

  return res.status(404).json({ error: "Not found" });
}
