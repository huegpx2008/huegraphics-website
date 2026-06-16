import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { deleteCloudinaryGalleryImage } from "@/lib/cloudinary-gallery-admin";

export const runtime = "nodejs";

const galleryLogPrefix = "[admin-gallery-api]";

export async function DELETE(request: Request) {
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
    } | null;
    const publicId = typeof body?.publicId === "string" ? body.publicId : "";

    if (!publicId) {
      return NextResponse.json(
        {
          ok: false,
          error: "Cloudinary public ID is required.",
        },
        { status: 400 },
      );
    }

    await deleteCloudinaryGalleryImage(publicId);

    return NextResponse.json({
      ok: true,
      publicId,
    });
  } catch (error) {
    console.error(`${galleryLogPrefix} Delete failed.`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Image could not be deleted.",
      },
      { status: 502 },
    );
  }
}
