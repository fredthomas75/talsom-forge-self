import type { VercelRequest, VercelResponse } from "@vercel/node";
import { authenticateConsultant } from "../../_lib/consultant-auth.js";
import { handleCors } from "../../_lib/cors.js";

// GET /api/consultant/me — consultant profile

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res, "GET, OPTIONS")) return;

  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const ctx = await authenticateConsultant(req);
  if (!ctx) return res.status(401).json({ error: "Unauthorized — not a consultant" });

  return res.status(200).json({
    userId: ctx.userId,
    email: ctx.email,
    consultantId: ctx.consultantId,
    name: ctx.name,
    specialties: ctx.specialties,
  });
}
