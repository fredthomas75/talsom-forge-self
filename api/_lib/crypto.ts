import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

// ─── TOKEN ENCRYPTION (AES-256-GCM) ────────────────
// Encrypts OAuth tokens before storing in database.
// Each encryption generates a unique IV (12 bytes).
// Format: base64( IV + ciphertext + authTag )

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

function getKey(): Buffer {
  const hex = process.env.TOKEN_ENCRYPTION_KEY;
  if (!hex || hex.length < 32) {
    // Fallback: derive key from SUPABASE_SERVICE_ROLE_KEY (not ideal but functional)
    const fallback = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "default-key-change-me";
    return Buffer.from(fallback.slice(0, 32).padEnd(32, "0"), "utf-8");
  }
  return Buffer.from(hex, "hex");
}

export function encrypt(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  // IV + ciphertext + authTag → base64
  return Buffer.concat([iv, encrypted, tag]).toString("base64");
}

export function decrypt(encoded: string): string {
  const key = getKey();
  const buf = Buffer.from(encoded, "base64");

  const iv = buf.subarray(0, IV_LENGTH);
  const tag = buf.subarray(buf.length - TAG_LENGTH);
  const ciphertext = buf.subarray(IV_LENGTH, buf.length - TAG_LENGTH);

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
}
