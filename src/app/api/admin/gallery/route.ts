import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  getAdminGalleryCategories,
  listCloudinaryGalleryImages,
} from "@/lib/cloudinary-gallery-admin";

export const runtime = "nodejs";

const galleryLogPrefix = "[admin-gallery-api]";

export async function GET() {
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

    const images = await listCloudinaryGalleryImages();

    return NextResponse.json({
      ok: true,
      images,
      categories: getAdminGalleryCategories(),
    });
  } catch (error) {
    console.error(`${galleryLogPrefix} List request failed.`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Gallery images could not be loaded.",
      },
      { status: 502 },
    );
  }
}
