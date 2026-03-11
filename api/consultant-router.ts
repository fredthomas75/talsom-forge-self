import type { VercelRequest, VercelResponse } from "@vercel/node";

// ─── CATCH-ALL ROUTER FOR /api/consultant/* ────────────
// Same pattern as client-router.ts — single serverless function
// Vercel rewrites /api/consultant/:path* → /api/consultant-router?_path=:path*

import meHandler from "./consultant/_handlers/me.js";
import dashboardHandler from "./consultant/_handlers/dashboard.js";
import queueHandler from "./consultant/_handlers/queue.js";
import reviewHandler from "./consultant/_handlers/review.js";
import reviewDeliverHandler from "./consultant/_handlers/review-deliver.js";
import reviewUploadHandler from "./consultant/_handlers/review-upload.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const rawPath = (req.query._path as string) ?? "";
  const segments = rawPath.split("/").filter(Boolean);

  const seg0 = segments[0] ?? "";
  const seg1 = segments[1] ?? "";

  switch (seg0) {
    case "me":
      return meHandler(req, res);

    case "dashboard":
      return dashboardHandler(req, res);

    case "queue":
      return queueHandler(req, res);

    case "reviews":
      if (seg1) {
        req.query.id = seg1;
        // Check for /reviews/:id/deliver or /reviews/:id/upload
        if (segments[2] === "deliver") {
          return reviewDeliverHandler(req, res);
        }
        if (segments[2] === "upload") {
          return reviewUploadHandler(req, res);
        }
        return reviewHandler(req, res);
      }
      break;
  }

  return res.status(404).json({ error: "Not found" });
}
