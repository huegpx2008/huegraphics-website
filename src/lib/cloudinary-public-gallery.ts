import "server-only";

import { getAdminUploadCategory } from "@/lib/admin-upload-categories";
import { getMissingCloudinaryUploadEnvVars } from "@/lib/cloudinary-admin-upload";

const cloudinaryBaseFolder = "hue-graphics-website";
const publicGalleryLogPrefix = "[public-cloudinary-gallery]";

type PublicCloudinaryResource = {
  public_id: string;
  secure_url: string;
  created_at?: string;
  tags?: string[];
  context?: {
    custom?: Record<string, string>;
  };
};

type PublicCloudinaryListResponse = {
  resources?: PublicCloudinaryResource[];
  next_cursor?: string;
  error?: {
    message?: string;
  };
};

export type PublicCloudinaryGalleryImage = {
  src: string;
  alt: string;
  title: string;
  description: string;
  category: string;
  publicId: string;
  uploadedAt: string;
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

function optimizedCloudinaryUrl(url: string) {
  return url.replace("/image/upload/", "/image/upload/f_auto,q_auto,c_fill,w_1200/");
}

function filenameFromPublicId(publicId: string) {
  return publicId.split("/").pop() || publicId;
}

function normalizeImage(resource: PublicCloudinaryResource) {
  const context = resource.context?.custom || {};
  const filename = filenameFromPublicId(resource.public_id);
  const categoryValue =
    resource.tags?.find((tag) => getAdminUploadCategory(tag)) ||
    resource.public_id.split("/")[1] ||
    "";
  const category = getAdminUploadCategory(categoryValue);
  const title = context.title || filename;
  const description = context.description || "";

  return {
    src: optimizedCloudinaryUrl(resource.secure_url),
    alt: title,
    title,
    description,
    category: category?.label || "Project",
    publicId: resource.public_id,
    uploadedAt: resource.created_at || "",
  };
}

async function readCloudinaryJson<T>(response: Response, operation: string) {
  const responseText = await response.text();

  try {
    const payload = (responseText ? JSON.parse(responseText) : {}) as T & {
      error?: { message?: string };
    };

    if (!response.ok) {
      console.error(`${publicGalleryLogPrefix} Cloudinary ${operation} failed.`, {
        status: response.status,
        statusText: response.statusText,
        cloudinaryError: payload.error?.message,
      });
      return null;
    }

    return payload;
  } catch (error) {
    console.error(`${publicGalleryLogPrefix} Cloudinary returned non-JSON.`, {
      operation,
      status: response.status,
      statusText: response.statusText,
      error: error instanceof Error ? error.message : String(error),
      responsePreview: responseText.slice(0, 300),
    });
    return null;
  }
}

export async function getCloudinaryGalleryImagesByTag(tag: string) {
  const missingEnvVars = getMissingCloudinaryUploadEnvVars();

  if (missingEnvVars.length) {
    return [];
  }

  try {
    const config = getCloudinaryConfig();
    const images: PublicCloudinaryResource[] = [];
    let nextCursor = "";
    let pageCount = 0;

    do {
      const url = new URL(
        `https://api.cloudinary.com/v1_1/${encodeURIComponent(
          config.cloudName,
        )}/resources/image/tags/${encodeURIComponent(tag)}`,
      );
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
        next: {
          revalidate: 300,
        },
      });
      const payload = await readCloudinaryJson<PublicCloudinaryListResponse>(
        response,
        `list ${tag} images`,
      );

      if (!payload) {
        return [];
      }

      images.push(
        ...(payload.resources || []).filter((resource) =>
          resource.public_id.startsWith(`${cloudinaryBaseFolder}/`),
        ),
      );
      nextCursor = payload.next_cursor || "";
      pageCount += 1;
    } while (nextCursor && pageCount < 3);

    return images
      .map(normalizeImage)
      .sort((left, right) => right.uploadedAt.localeCompare(left.uploadedAt));
  } catch (error) {
    console.error(`${publicGalleryLogPrefix} Gallery fetch failed.`, {
      tag,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}
