import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const VERSION_PREFIX = "v1";

export class EncryptionConfigError extends Error {}
export class DecryptionError extends Error {}

function getKey(): Buffer {
  const hex = process.env.INTEGRATION_ENCRYPTION_KEY;
  if (!hex || hex.length !== 64 || !/^[0-9a-fA-F]+$/.test(hex)) {
    throw new EncryptionConfigError(
      "INTEGRATION_ENCRYPTION_KEY is missing or invalid. It must be a 64-character hex string, e.g. from `openssl rand -hex 32`."
    );
  }
  return Buffer.from(hex, "hex");
}

export function isEncryptionConfigured(): boolean {
  try {
    getKey();
    return true;
  } catch {
    return false;
  }
}

/** AES-256-GCM encrypt. Output format: v1:<iv_b64>:<authTag_b64>:<ciphertext_b64> */
export function encrypt(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [VERSION_PREFIX, iv.toString("base64"), tag.toString("base64"), ciphertext.toString("base64")].join(":");
}

export function decrypt(payload: string): string {
  const key = getKey();
  const parts = payload.split(":");
  if (parts.length !== 4 || parts[0] !== VERSION_PREFIX) {
    throw new DecryptionError("Invalid encrypted payload format.");
  }
  const [, ivB64, tagB64, ciphertextB64] = parts;
  try {
    const iv = Buffer.from(ivB64, "base64");
    const tag = Buffer.from(tagB64, "base64");
    const ciphertext = Buffer.from(ciphertextB64, "base64");
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return plaintext.toString("utf8");
  } catch {
    // Never leak the underlying crypto error (could hint at key material); same message for
    // tampered ciphertext, wrong key, or corrupted data.
    throw new DecryptionError("Failed to decrypt value — the encryption key may be wrong, or the stored data was tampered with.");
  }
}
