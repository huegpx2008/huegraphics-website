import "server-only";

import { createHash } from "node:crypto";
import {
  getAdminUploadCategory,
  type AdminUploadCategory,
} from "@/lib/admin-upload-categories";

const cloudinaryBaseFolder = "hue-graphics-website";

type CloudinaryUploadInput = {
  file: File;
  category: AdminUploadCategory;
  title: string;
  description: string;
};

type CloudinaryUploadResponse = {
  secure_url?: string;
  public_id?: string;
  width?: number;
  height?: number;
  format?: string;
  error?: {
    message?: string;
  };
};

const cloudinaryLogPrefix = "[admin-upload]";

function getCloudinaryConfig() {
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME?.trim() || "",
    apiKey: process.env.CLOUDINARY_API_KEY?.trim() || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET?.trim() || "",
  };
}

export function getMissingCloudinaryUploadEnvVars() {
  const config = getCloudinaryConfig();
  const missing: string[] = [];

  if (!config.cloudName) missing.push("CLOUDINARY_CLOUD_NAME");
  if (!config.apiKey) missing.push("CLOUDINARY_API_KEY");
  if (!config.apiSecret) missing.push("CLOUDINARY_API_SECRET");

  return missing;
}

export function isCloudinaryUploadConfigured() {
  return getMissingCloudinaryUploadEnvVars().length === 0;
}

function sanitizeContextValue(value: string) {
  return value.trim().replace(/[|=]/g, "-").replace(/\s+/g, " ");
}

function signUploadParameters(
  parameters: Record<string, string | number>,
  apiSecret: string,
) {
  const serialized = Object.entries(parameters)
    .filter(([, value]) => value !== "")
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1")
    .update(`${serialized}${apiSecret}`)
    .digest("hex");
}

export async function uploadAdminImageToCloudinary({
  file,
  category,
  title,
  description,
}: CloudinaryUploadInput) {
  const config = getCloudinaryConfig();
  const missingEnvVars = getMissingCloudinaryUploadEnvVars();

  if (missingEnvVars.length) {
    console.error(`${cloudinaryLogPrefix} Cloudinary configuration is missing.`, {
      missingEnvVars,
    });
    throw new Error(
      `Cloudinary uploads are not configured on this server. Missing: ${missingEnvVars.join(
        ", ",
      )}.`,
    );
  }

  const categoryDetails = getAdminUploadCategory(category);

  if (!categoryDetails) {
    throw new Error("Choose a valid photo category.");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = `${cloudinaryBaseFolder}/${categoryDetails.value}`;
  const tags = ["hue-website", categoryDetails.value].join(",");
  const contextParts = [
    title ? `title=${sanitizeContextValue(title)}` : "",
    description ? `description=${sanitizeContextValue(description)}` : "",
    `category=${sanitizeContextValue(categoryDetails.label)}`,
  ].filter(Boolean);
  const parameters: Record<string, string | number> = {
    folder,
    tags,
    timestamp,
    context: contextParts.join("|"),
  };
  const signature = signUploadParameters(parameters, config.apiSecret);
  const cloudinaryForm = new FormData();

  cloudinaryForm.set("file", file);
  cloudinaryForm.set("api_key", config.apiKey);
  cloudinaryForm.set("signature", signature);

  Object.entries(parameters).forEach(([key, value]) => {
    cloudinaryForm.set(key, String(value));
  });

  const uploadUrl = `https://api.cloudinary.com/v1_1/${encodeURIComponent(
    config.cloudName,
  )}/image/upload`;
  const response = await fetch(
    uploadUrl,
    {
      method: "POST",
      body: cloudinaryForm,
      cache: "no-store",
    },
  );
  const responseText = await response.text();
  const contentType = response.headers.get("content-type") || "";
  let result: CloudinaryUploadResponse = {};

  if (responseText) {
    try {
      result = JSON.parse(responseText) as CloudinaryUploadResponse;
    } catch (parseError) {
      console.error(`${cloudinaryLogPrefix} Cloudinary returned non-JSON.`, {
        status: response.status,
        statusText: response.statusText,
        contentType,
        uploadUrl,
        responsePreview: responseText.slice(0, 500),
        error:
          parseError instanceof Error ? parseError.message : String(parseError),
      });

      throw new Error(
        `Cloudinary returned an unexpected response (${response.status}). Check the Cloudinary cloud name and upload credentials.`,
      );
    }
  }

  if (!response.ok || !result.secure_url || !result.public_id) {
    console.error(`${cloudinaryLogPrefix} Cloudinary upload failed.`, {
      status: response.status,
      statusText: response.statusText,
      contentType,
      cloudinaryError: result.error?.message,
      responsePreview: responseText.slice(0, 500),
    });

    throw new Error(
      result.error?.message || "Cloudinary could not upload this image.",
    );
  }

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    category: categoryDetails.label,
    folder,
    tags: tags.split(","),
  };
}
