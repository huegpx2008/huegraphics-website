import "server-only";

import { createHash } from "node:crypto";
import {
  adminUploadCategories,
  getAdminUploadCategory,
  type AdminUploadCategory,
} from "@/lib/admin-upload-categories";
import { getMissingCloudinaryUploadEnvVars } from "@/lib/cloudinary-admin-upload";

const cloudinaryBaseFolder = "hue-graphics-website";
const featuredTag = "featured=true";

type CloudinaryResource = {
  public_id: string;
  secure_url: string;
  created_at?: string;
  tags?: string[];
  context?: { custom?: Record<string, string> };
  width?: number;
  height?: number;
  format?: string;
};

type CloudinaryListResponse = {
  resources?: CloudinaryResource[];
  next_cursor?: string;
  error?: { message?: string };
};

type CloudinaryMutationResponse = {
  result?: string;
  error?: { message?: string };
};

export type AdminGalleryImage = {
  publicId: string;
  url: string;
  title: string;
  description: string;
  category: AdminUploadCategory;
  categoryLabel: string;
  uploadedAt: string;
  tags: string[];
  featured: boolean;
  filename: string;
  width?: number;
  height?: number;
  format?: string;
};

function getCloudinaryConfig() {
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME?.trim() || "",
    apiKey: process.env.CLOUDINARY_API_KEY?.trim() || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET?.trim() || "",
  };
}

function authHeader(apiKey: string, apiSecret: string) {
  return `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`;
}

function assertConfigured() {
  const missingEnvVars = getMissingCloudinaryUploadEnvVars();
  if (missingEnvVars.length) {
    throw new Error(`Cloudinary gallery is not configured. Missing: ${missingEnvVars.join(", ")}.`);
  }
  return getCloudinaryConfig();
}

function signParameters(parameters: Record<string, string | number>) {
  const { apiSecret } = assertConfigured();
  const serialized = Object.entries(parameters)
    .filter(([, value]) => value !== "")
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1")
    .update(`${serialized}${apiSecret}`)
    .digest("hex");
}

async function readCloudinaryJson<T>(response: Response, operation: string) {
  const responseText = await response.text();
  let payload: T & { error?: { message?: string } };

  try {
    payload = JSON.parse(responseText || "{}") as T & {
      error?: { message?: string };
    };
  } catch {
    throw new Error(`Cloudinary returned an unexpected response while trying to ${operation}.`);
  }

  if (!response.ok) {
    throw new Error(payload.error?.message || `Cloudinary ${operation} failed.`);
  }

  return payload;
}

function filenameFromPublicId(publicId: string) {
  return publicId.split("/").pop() || publicId;
}

function categoryFromResource(resource: CloudinaryResource) {
  const categoryTag = resource.tags?.find((tag) => getAdminUploadCategory(tag));
  if (categoryTag) return categoryTag as AdminUploadCategory;

  const folderCategory = resource.public_id.split("/")[1] || "";
  return getAdminUploadCategory(folderCategory)?.value || adminUploadCategories[0].value;
}

function normalizeResource(resource: CloudinaryResource): AdminGalleryImage {
  const context = resource.context?.custom || {};
  const category = categoryFromResource(resource);
  const categoryDetails = getAdminUploadCategory(category) || adminUploadCategories[0];
  const filename = filenameFromPublicId(resource.public_id);

  return {
    publicId: resource.public_id,
    url: resource.secure_url,
    title: context.title || filename,
    description: context.description || "",
    category: categoryDetails.value,
    categoryLabel: categoryDetails.label,
    uploadedAt: resource.created_at || "",
    tags: resource.tags || [],
    featured: Boolean(resource.tags?.includes(featuredTag)),
    filename,
    width: resource.width,
    height: resource.height,
    format: resource.format,
  };
}

function sanitizeContextValue(value: string) {
  return value.trim().replace(/[|=]/g, "-").replace(/\s+/g, " ");
}

function tagsForImage(category: AdminUploadCategory, featured: boolean) {
  return ["hue-website", category, ...(featured ? [featuredTag] : [])].join(",");
}

function contextForImage(title: string, description: string, category: AdminUploadCategory) {
  const categoryDetails = getAdminUploadCategory(category);
  return [
    title ? `title=${sanitizeContextValue(title)}` : "",
    description ? `description=${sanitizeContextValue(description)}` : "",
    `category=${sanitizeContextValue(categoryDetails?.label || category)}`,
  ]
    .filter(Boolean)
    .join("|");
}

export function getAdminGalleryCategories() {
  return adminUploadCategories;
}

export async function listCloudinaryGalleryImages() {
  const config = assertConfigured();
  const resources: CloudinaryResource[] = [];
  let nextCursor = "";
  let pageCount = 0;

  do {
    const url = new URL(
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(config.cloudName)}/resources/image/upload`,
    );
    url.searchParams.set("prefix", `${cloudinaryBaseFolder}/`);
    url.searchParams.set("max_results", "100");
    url.searchParams.set("tags", "true");
    url.searchParams.set("context", "true");
    if (nextCursor) url.searchParams.set("next_cursor", nextCursor);

    const response = await fetch(url, {
      headers: { Authorization: authHeader(config.apiKey, config.apiSecret) },
      cache: "no-store",
    });
    const payload = await readCloudinaryJson<CloudinaryListResponse>(
      response,
      "list gallery images",
    );

    resources.push(...(payload.resources || []));
    nextCursor = payload.next_cursor || "";
    pageCount += 1;
  } while (nextCursor && pageCount < 5);

  return resources
    .map(normalizeResource)
    .sort((left, right) => right.uploadedAt.localeCompare(left.uploadedAt));
}

export async function updateCloudinaryGalleryImage({
  publicId,
  title,
  description,
  category,
  featured,
}: {
  publicId: string;
  title: string;
  description: string;
  category: AdminUploadCategory;
  featured: boolean;
}) {
  const config = assertConfigured();
  const timestamp = Math.floor(Date.now() / 1000);
  const parameters = {
    public_id: publicId,
    type: "upload",
    tags: tagsForImage(category, featured),
    context: contextForImage(title, description, category),
    timestamp,
  };
  const signature = signParameters(parameters);
  const formData = new FormData();

  Object.entries(parameters).forEach(([key, value]) => formData.set(key, String(value)));
  formData.set("api_key", config.apiKey);
  formData.set("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(config.cloudName)}/image/explicit`,
    { method: "POST", body: formData, cache: "no-store" },
  );

  return readCloudinaryJson<CloudinaryMutationResponse>(
    response,
    "update gallery image metadata",
  );
}

export async function deleteCloudinaryGalleryImage(publicId: string) {
  const config = assertConfigured();
  const timestamp = Math.floor(Date.now() / 1000);
  const parameters = { public_id: publicId, timestamp };
  const signature = signParameters(parameters);
  const formData = new FormData();

  Object.entries(parameters).forEach(([key, value]) => formData.set(key, String(value)));
  formData.set("api_key", config.apiKey);
  formData.set("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(config.cloudName)}/image/destroy`,
    { method: "POST", body: formData, cache: "no-store" },
  );
  const payload = await readCloudinaryJson<CloudinaryMutationResponse>(
    response,
    "delete gallery image",
  );

  if (payload.result !== "ok" && payload.result !== "not found") {
    throw new Error("Cloudinary could not delete this image.");
  }

  return payload;
}
