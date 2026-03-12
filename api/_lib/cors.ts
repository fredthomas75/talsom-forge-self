import type { VercelRequest, VercelResponse } from "@vercel/node";

const ALLOWED_ORIGINS = [
  "https://talsom-forge-self.vercel.app",
  "https://talsomforge.com",
  "http://localhost:5173",
  "http://localhost:3000",
];

/** Set CORS headers and handle OPTIONS preflight. Returns true if request was handled (OPTIONS). */
export function handleCors(req: VercelRequest, res: VercelResponse, methods = "GET, POST, PUT, DELETE, OPTIONS"): boolean {
  const origin = req.headers.origin as string | undefined;
  const allowedOrigin = origin && ALLOWED_ORIGINS.some((o) => origin.startsWith(o))
    ? origin
    : ALLOWED_ORIGINS[0];

  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", methods);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-API-Key");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }
  return false;
}
