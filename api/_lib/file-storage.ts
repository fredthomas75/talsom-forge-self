import { getSupabaseAdmin } from "./supabase-server.js";

const BUCKET = "tenant-assets";
const SIGNED_URL_EXPIRY = 48 * 60 * 60; // 48 hours in seconds

export interface UploadedFile {
  url: string;
  path: string;
  size: number;
  name: string;
  type: string;
}

/**
 * Upload a generated file to Supabase Storage and return a signed URL.
 */
export async function uploadGeneratedFile(
  tenantId: string,
  fileName: string,
  buffer: Buffer,
  mimeType: string
): Promise<UploadedFile> {
  const supabase = getSupabaseAdmin();
  const timestamp = Date.now();
  const safeName = fileName.replace(/[^a-zA-Z0-9_\-\.]/g, "_");
  const storagePath = `${tenantId}/generated/${timestamp}_${safeName}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (uploadError) {
    console.error("[file-storage] upload failed:", uploadError);
    throw new Error(`File upload failed: ${uploadError.message}`);
  }

  // Create signed URL for download
  const { data: signedData, error: signError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, SIGNED_URL_EXPIRY, {
      download: safeName,
    });

  if (signError || !signedData?.signedUrl) {
    console.error("[file-storage] signed URL failed:", signError);
    throw new Error("Failed to create download URL");
  }

  return {
    url: signedData.signedUrl,
    path: storagePath,
    size: buffer.length,
    name: safeName,
    type: mimeType,
  };
}
