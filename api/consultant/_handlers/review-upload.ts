import type { VercelRequest, VercelResponse } from "@vercel/node";
import { authenticateConsultant } from "../../_lib/consultant-auth.js";
import { getSupabaseAdmin } from "../../_lib/supabase-server.js";
import { uploadGeneratedFile } from "../../_lib/file-storage.js";
import { handleCors } from "../../_lib/cors.js";

// POST /api/consultant/reviews/:id/upload — upload a modified file for a review

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res, "POST, OPTIONS")) return;

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ctx = await authenticateConsultant(req);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });

  const { id } = req.query;
  if (!id || typeof id !== "string") return res.status(400).json({ error: "Missing review ID" });

  const { file_name, file_data, mime_type } = req.body ?? {};

  if (!file_name || !file_data) {
    return res.status(400).json({ error: "Missing file_name or file_data (base64)" });
  }

  const supabase = getSupabaseAdmin();

  // Verify the review exists and is assigned to this consultant
  const { data: review } = await supabase
    .from("deliverable_reviews")
    .select("id, tenant_id, consultant_id, status")
    .eq("id", id)
    .single();

  if (!review) return res.status(404).json({ error: "Review not found" });

  if (review.consultant_id !== ctx.consultantId) {
    return res.status(403).json({ error: "Not assigned to you" });
  }

  if (review.status === "delivered") {
    return res.status(400).json({ error: "Review is already delivered. Reopen it first." });
  }

  // Decode base64
  const buffer = Buffer.from(file_data, "base64");
  if (buffer.length > MAX_FILE_SIZE) {
    return res.status(400).json({ error: "File too large. Maximum 10 MB." });
  }

  try {
    // Upload to Supabase Storage (uses the review's tenant_id for path)
    const uploaded = await uploadGeneratedFile(
      review.tenant_id,
      file_name,
      buffer,
      mime_type || "application/octet-stream"
    );

    // Update the review with the modified file URL
    const { error: updateErr } = await supabase
      .from("deliverable_reviews")
      .update({ modified_file_url: uploaded.url })
      .eq("id", id);

    if (updateErr) return res.status(500).json({ error: updateErr.message });

    return res.status(200).json({
      file: {
        url: uploaded.url,
        name: uploaded.name,
        size: uploaded.size,
        type: uploaded.type,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Upload failed";
    return res.status(500).json({ error: msg });
  }
}
