import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAdminUploadCategory } from "@/lib/admin-upload-categories";
import {
  listCloudinaryGalleryImages,
  updateCloudinaryGalleryImage,
} from "@/lib/cloudinary-gallery-admin";

export const runtime = "nodejs";

const galleryLogPrefix = "[admin-gallery-api]";

export async function PATCH(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        {
          ok: false,
          error: "Admin access is required.",
        },
        { status: 401 },
      );
    }

    const body = (await request.json().catch(() => null)) as {
      publicId?: unknown;
      title?: unknown;
      description?: unknown;
      category?: unknown;
    } | null;
    const publicId = typeof body?.publicId === "string" ? body.publicId : "";
    const title = typeof body?.title === "string" ? body.title.slice(0, 120) : "";
    const description =
      typeof body?.description === "string" ? body.description.slice(0, 500) : "";
    const category =
      typeof body?.category === "string" ? getAdminUploadCategory(body.category) : null;

    if (!publicId) {
      return NextResponse.json(
        {
          ok: false,
          error: "Cloudinary public ID is required.",
        },
        { status: 400 },
      );
    }

    if (!category) {
      return NextResponse.json(
        {
          ok: false,
          error: "Choose a valid photo category.",
        },
        { status: 400 },
      );
    }

    const images = await listCloudinaryGalleryImages();
    const currentImage = images.find((image) => image.publicId === publicId);

    if (!currentImage) {
      return NextResponse.json(
        {
          ok: false,
          error: "Image was not found in the Cloudinary gallery.",
        },
        { status: 404 },
      );
    }

    await updateCloudinaryGalleryImage({
      publicId,
      title,
      description,
      category: category.value,
      featured: currentImage.featured,
    });

    return NextResponse.json({
      ok: true,
      image: {
        ...currentImage,
        title: title || currentImage.filename,
        description,
        category: category.value,
        categoryLabel: category.label,
        tags: [
          "hue-website",
          category.value,
          ...(currentImage.featured ? ["featured=true"] : []),
        ],
      },
    });
  } catch (error) {
    console.error(`${galleryLogPrefix} Metadata update failed.`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Image metadata could not be updated.",
      },
      { status: 502 },
    );
  }
}
