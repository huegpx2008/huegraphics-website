import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  getAdminGalleryCategories,
  listCloudinaryGalleryImages,
} from "@/lib/cloudinary-gallery-admin";

export const runtime = "nodejs";

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { ok: false, error: "Admin access is required." },
        { status: 401 },
      );
    }

    return NextResponse.json({
      ok: true,
      images: await listCloudinaryGalleryImages(),
      categories: getAdminGalleryCategories(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Gallery images could not be loaded.",
      },
      { status: 502 },
    );
  }
}
