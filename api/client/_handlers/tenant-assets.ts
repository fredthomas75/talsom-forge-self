import type { VercelRequest, VercelResponse } from "@vercel/node";
import { authenticateClient } from "../../_lib/client-auth.js";
import { getSupabaseAdmin } from "../../_lib/supabase-server.js";
import { logAudit, ACTIONS } from "../../_lib/audit.js";
import { handleCors } from "../../_lib/cors.js";

// GET    /api/client/customization/assets — list assets
// POST   /api/client/customization/assets — upload asset (base64 body)
// DELETE /api/client/customization/assets/:id — delete asset

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res, "GET, POST, DELETE, OPTIONS")) return;

  const ctx = await authenticateClient(req);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });

  const supabase = getSupabaseAdmin();

  // GET: List all assets
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("tenant_assets")
      .select("id, asset_type, file_name, file_url, file_size, mime_type, metadata, created_at")
      .eq("tenant_id", ctx.tenantId)
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ assets: data ?? [] });
  }

  // POST: Upload new asset
  if (req.method === "POST") {
    if (ctx.role === "member") {
      return res.status(403).json({ error: "Only owners and admins can upload assets" });
    }

    const { asset_type, file_name, file_data, mime_type } = req.body ?? {};

    if (!asset_type || !file_name || !file_data) {
      return res.status(400).json({ error: "asset_type, file_name, and file_data (base64) are required" });
    }

    const validTypes = ["brand_guide", "logo", "template_pptx", "template_docx", "reference_doc"];
    if (!validTypes.includes(asset_type)) {
      return res.status(400).json({ error: `Invalid asset_type. Must be one of: ${validTypes.join(", ")}` });
    }

    // Decode base64
    const buffer = Buffer.from(file_data, "base64");
    const fileSize = buffer.length;

    // Max 10MB per file
    if (fileSize > 10 * 1024 * 1024) {
      return res.status(400).json({ error: "File too large. Maximum 10MB." });
    }

    // Upload to Supabase Storage
    const storagePath = `${ctx.tenantId}/${asset_type}/${Date.now()}_${file_name}`;
    const { error: uploadErr } = await supabase.storage
      .from("tenant-assets")
      .upload(storagePath, buffer, {
        contentType: mime_type || "application/octet-stream",
        upsert: false,
      });

    if (uploadErr) {
      console.error("[tenant-assets] upload error:", uploadErr);
      return res.status(500).json({ error: "Failed to upload file" });
    }

    // Get public URL (signed URL for private buckets)
    const { data: urlData } = supabase.storage
      .from("tenant-assets")
      .getPublicUrl(storagePath);

    const fileUrl = urlData?.publicUrl ?? storagePath;

    // Insert metadata
    const { data: asset, error: insertErr } = await supabase
      .from("tenant_assets")
      .insert({
        tenant_id: ctx.tenantId,
        asset_type,
        file_name,
        file_url: fileUrl,
        file_size: fileSize,
        mime_type: mime_type || "application/octet-stream",
        uploaded_by: ctx.userId,
      })
      .select("*")
      .single();

    if (insertErr) {
      console.error("[tenant-assets] insert error:", insertErr);
      return res.status(500).json({ error: "Failed to save asset metadata" });
    }

    logAudit({
      tenant_id: ctx.tenantId,
      user_id: ctx.userId,
      action: ACTIONS.TENANT_UPDATE,
      resource_type: "tenant_asset",
      resource_id: asset.id,
      metadata: { asset_type, file_name, file_size: fileSize },
    }, req);

    return res.status(201).json({ asset });
  }

  // DELETE: Remove asset by id
  if (req.method === "DELETE") {
    if (ctx.role === "member") {
      return res.status(403).json({ error: "Only owners and admins can delete assets" });
    }

    const assetId = req.query.id as string;
    if (!assetId) return res.status(400).json({ error: "Asset ID required" });

    // Get asset to find storage path
    const { data: asset } = await supabase
      .from("tenant_assets")
      .select("*")
      .eq("id", assetId)
      .eq("tenant_id", ctx.tenantId)
      .single();

    if (!asset) return res.status(404).json({ error: "Asset not found" });

    // Delete from storage (try to extract path from URL)
    const storagePath = asset.file_url.includes(ctx.tenantId)
      ? asset.file_url.split("tenant-assets/")[1] ?? asset.file_url
      : `${ctx.tenantId}/${asset.asset_type}/${asset.file_name}`;

    await supabase.storage.from("tenant-assets").remove([storagePath]);

    // Delete metadata row
    const { error: delErr } = await supabase
      .from("tenant_assets")
      .delete()
      .eq("id", assetId)
      .eq("tenant_id", ctx.tenantId);

    if (delErr) {
      console.error("[tenant-assets] delete error:", delErr);
      return res.status(500).json({ error: "Failed to delete asset" });
    }

    logAudit({
      tenant_id: ctx.tenantId,
      user_id: ctx.userId,
      action: ACTIONS.TENANT_UPDATE,
      resource_type: "tenant_asset",
      resource_id: assetId,
      metadata: { deleted: true, file_name: asset.file_name },
    }, req);

    return res.status(200).json({ deleted: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
