import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  listCloudinaryGalleryImages,
  updateCloudinaryGalleryImage,
} from "@/lib/cloudinary-gallery-admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { ok: false, error: "Admin access is required." },
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
        { ok: false, error: "Cloudinary public ID is required." },
        { status: 400 },
      );
    }

    const currentImage = (await listCloudinaryGalleryImages()).find(
      (image) => image.publicId === publicId,
    );
    if (!currentImage) {
      return NextResponse.json(
        { ok: false, error: "Image was not found." },
        { status: 404 },
      );
    }

    await updateCloudinaryGalleryImage({ ...currentImage, featured });

    return NextResponse.json({
      ok: true,
      image: {
        ...currentImage,
        featured,
        tags: ["hue-website", currentImage.category, ...(featured ? ["featured=true"] : [])],
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Featured status could not be updated.",
      },
      { status: 502 },
    );
  }
}
