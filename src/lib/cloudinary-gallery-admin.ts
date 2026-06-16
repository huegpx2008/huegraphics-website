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
const baseTag = "hue-website";
const galleryLogPrefix = "[admin-gallery]";

type CloudinaryResource = {
  public_id: string;
  secure_url: string;
  created_at?: string;
  tags?: string[];
  context?: {
    custom?: Record<string, string>;
  };
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
};

type CloudinaryListResponse = {
  resources?: CloudinaryResource[];
  next_cursor?: string;
  error?: {
    message?: string;
  };
};

type CloudinaryMutationResponse = {
  public_id?: string;
  secure_url?: string;
  result?: string;
  error?: {
    message?: string;
  };
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

export type AdminGalleryUpdateInput = {
  publicId: string;
  title: string;
  description: string;
  category: AdminUploadCategory;
  featured?: boolean;
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

function assertCloudinaryConfigured() {
  const missingEnvVars = getMissingCloudinaryUploadEnvVars();

  if (missingEnvVars.length) {
    console.error(`${galleryLogPrefix} Cloudinary configuration is missing.`, {
      missingEnvVars,
    });
    throw new Error(
      `Cloudinary gallery is not configured. Missing: ${missingEnvVars.join(
        ", ",
      )}.`,
    );
  }

  return getCloudinaryConfig();
}

function sanitizeContextValue(value: string) {
  return value.trim().replace(/[|=]/g, "-").replace(/\s+/g, " ");
}

function signParameters(parameters: Record<string, string | number>) {
  const { apiSecret } = assertCloudinaryConfigured();
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
  const contentType = response.headers.get("content-type") || "";

  try {
    const payload = (responseText ? JSON.parse(responseText) : {}) as T & {
      error?: { message?: string };
    };

    if (!response.ok) {
      console.error(`${galleryLogPrefix} Cloudinary ${operation} failed.`, {
        status: response.status,
        statusText: response.statusText,
        contentType,
        cloudinaryError: payload.error?.message,
        responsePreview: responseText.slice(0, 500),
      });
      throw new Error(
        payload.error?.message || `Cloudinary ${operation} failed.`,
      );
    }

    return payload;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error(`${galleryLogPrefix} Cloudinary returned non-JSON.`, {
        operation,
        status: response.status,
        statusText: response.statusText,
        contentType,
        responsePreview: responseText.slice(0, 500),
      });
      throw new Error(
        `Cloudinary returned an unexpected response while trying to ${operation}.`,
      );
    }

    throw error;
  }
}

function filenameFromPublicId(publicId: string) {
  return publicId.split("/").pop() || publicId;
}

function categoryFromResource(resource: CloudinaryResource) {
  const categoryTag = resource.tags?.find((tag) => getAdminUploadCategory(tag));

  if (categoryTag) {
    return categoryTag as AdminUploadCategory;
  }

  const folderCategory = resource.public_id.split("/")[1] || "";
  const folderMatch = getAdminUploadCategory(folderCategory);

  if (folderMatch) {
    return folderMatch.value;
  }

  return adminUploadCategories[0].value;
}

function normalizeResource(resource: CloudinaryResource): AdminGalleryImage {
  const context = resource.context?.custom || {};
  const category = categoryFromResource(resource);
  const categoryDetails =
    getAdminUploadCategory(category) || adminUploadCategories[0];
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

function tagsForImage(category: AdminUploadCategory, featured: boolean) {
  return [
    baseTag,
    category,
    ...(featured ? [featuredTag] : []),
  ].join(",");
}

function contextForImage(
  title: string,
  description: string,
  category: AdminUploadCategory,
) {
  const categoryDetails = getAdminUploadCategory(category);
  const contextParts = [
    title ? `title=${sanitizeContextValue(title)}` : "",
    description ? `description=${sanitizeContextValue(description)}` : "",
    `category=${sanitizeContextValue(categoryDetails?.label || category)}`,
  ].filter(Boolean);

  return contextParts.join("|");
}

export function getAdminGalleryCategories() {
  return adminUploadCategories;
}

export function getFeaturedTag() {
  return featuredTag;
}

export async function listCloudinaryGalleryImages() {
  const config = assertCloudinaryConfigured();
  const resources: CloudinaryResource[] = [];
  let nextCursor = "";
  let pageCount = 0;

  do {
    const url = new URL(
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(
        config.cloudName,
      )}/resources/image/upload`,
    );
    url.searchParams.set("prefix", `${cloudinaryBaseFolder}/`);
    url.searchParams.set("max_results", "100");
    url.searchParams.set("tags", "true");
    url.searchParams.set("context", "true");

    if (nextCursor) {
      url.searchParams.set("next_cursor", nextCursor);
    }

    const response = await fetch(url, {
      headers: {
        Authorization: authHeader(config.apiKey, config.apiSecret),
      },
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
  featured = false,
}: AdminGalleryUpdateInput) {
  const config = assertCloudinaryConfigured();
  const timestamp = Math.floor(Date.now() / 1000);
  const parameters: Record<string, string | number> = {
    public_id: publicId,
    type: "upload",
    tags: tagsForImage(category, featured),
    context: contextForImage(title, description, category),
    timestamp,
  };
  const signature = signParameters(parameters);
  const formData = new FormData();

  Object.entries(parameters).forEach(([key, value]) => {
    formData.set(key, String(value));
  });
  formData.set("api_key", config.apiKey);
  formData.set("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(
      config.cloudName,
    )}/image/explicit`,
    {
      method: "POST",
      body: formData,
      cache: "no-store",
    },
  );
  const payload = await readCloudinaryJson<CloudinaryMutationResponse>(
    response,
    "update gallery image metadata",
  );

  return payload;
}

export async function toggleCloudinaryGalleryImageFeatured(
  image: AdminGalleryImage,
  featured: boolean,
) {
  return updateCloudinaryGalleryImage({
    publicId: image.publicId,
    title: image.title,
    description: image.description,
    category: image.category,
    featured,
  });
}

export async function deleteCloudinaryGalleryImage(publicId: string) {
  const config = assertCloudinaryConfigured();
  const timestamp = Math.floor(Date.now() / 1000);
  const parameters: Record<string, string | number> = {
    public_id: publicId,
    timestamp,
  };
  const signature = signParameters(parameters);
  const formData = new FormData();

  Object.entries(parameters).forEach(([key, value]) => {
    formData.set(key, String(value));
  });
  formData.set("api_key", config.apiKey);
  formData.set("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(
      config.cloudName,
    )}/image/destroy`,
    {
      method: "POST",
      body: formData,
      cache: "no-store",
    },
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
