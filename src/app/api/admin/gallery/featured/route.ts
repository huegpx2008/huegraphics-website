import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  listCloudinaryGalleryImages,
  toggleCloudinaryGalleryImageFeatured,
} from "@/lib/cloudinary-gallery-admin";

export const runtime = "nodejs";

const galleryLogPrefix = "[admin-gallery-api]";

export async function POST(request: Request) {
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
      featured?: unknown;
    } | null;
    const publicId = typeof body?.publicId === "string" ? body.publicId : "";
    const featured = Boolean(body?.featured);

    if (!publicId) {
      return NextResponse.json(
        {
          ok: false,
          error: "Cloudinary public ID is required.",
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

    await toggleCloudinaryGalleryImageFeatured(currentImage, featured);

    return NextResponse.json({
      ok: true,
      image: {
        ...currentImage,
        featured,
        tags: [
          "hue-website",
          currentImage.category,
          ...(featured ? ["featured=true"] : []),
        ],
      },
    });
  } catch (error) {
    console.error(`${galleryLogPrefix} Featured toggle failed.`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Featured status could not be updated.",
      },
      { status: 502 },
    );
  }
}
