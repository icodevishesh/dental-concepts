import { v2 as cloudinary } from "cloudinary";
import { getDecryptedCredentials } from "./integration-settings";

export class IntegrationNotConfiguredError extends Error {}
export class IntegrationDisabledError extends Error {}
export class CloudinaryAuthError extends Error {}

export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

/**
 * Resolves Cloudinary credentials from the database first, falling back to
 * process.env.CLOUDINARY_* only when no database configuration exists yet.
 */
export async function getCloudinaryConfig(): Promise<CloudinaryConfig> {
  const stored = await getDecryptedCredentials("cloudinary");

  if (stored) {
    if (!stored.isEnabled) {
      throw new IntegrationDisabledError("The Cloudinary integration is disabled.");
    }
    const apiKey = stored.credentials.apiKey;
    const apiSecret = stored.credentials.apiSecret;
    const cloudName = stored.settings.cloudName;
    if (!cloudName || !apiKey || !apiSecret) {
      throw new IntegrationNotConfiguredError("Cloudinary integration is missing required credentials.");
    }
    return { cloudName, apiKey, apiSecret };
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new IntegrationNotConfiguredError("Cloudinary integration is not configured.");
  }
  return { cloudName, apiKey, apiSecret };
}

export async function cloudinaryIsConfigured(): Promise<boolean> {
  try {
    await getCloudinaryConfig();
    return true;
  } catch {
    return false;
  }
}

/**
 * Re-applies config from the database (or env fallback) on every call, since
 * credentials can now change at runtime via the admin panel — unlike the
 * previous module-level "configured once" cache, this always reflects the
 * latest saved values without requiring a server restart.
 */
export async function getCloudinaryClient() {
  const config = await getCloudinaryConfig();
  cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret,
    secure: true,
  });
  return cloudinary;
}

export async function testCloudinaryConnection(): Promise<{ ok: boolean; message: string }> {
  try {
    const client = await getCloudinaryClient();
    await client.api.ping();
    return { ok: true, message: "Connected to Cloudinary successfully." };
  } catch (err) {
    if (err instanceof IntegrationNotConfiguredError) {
      return { ok: false, message: "Cloudinary is not configured yet." };
    }
    if (err instanceof IntegrationDisabledError) {
      return { ok: false, message: "The Cloudinary integration is disabled." };
    }
    console.error("Cloudinary test connection failed:", err instanceof Error ? err.message : err);
    return { ok: false, message: "Could not connect to Cloudinary. Check the cloud name, API key, and API secret." };
  }
}
