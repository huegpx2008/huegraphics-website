import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  getAdminUploadCategory,
  type AdminUploadCategory,
} from "@/lib/admin-upload-categories";
import { uploadAdminImageToCloudinary } from "@/lib/cloudinary-admin-upload";

export const runtime = "nodejs";

const maxUploadBytes = 15 * 1024 * 1024;

function formText(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      {
        ok: false,
        error: "Admin access is required.",
      },
      { status: 401 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("image");
    const categoryValue = formText(formData, "category");
    const category = getAdminUploadCategory(categoryValue);
    const title = formText(formData, "title").slice(0, 120);
    const description = formText(formData, "description").slice(0, 500);

    if (!(file instanceof File) || file.size <= 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Choose an image to upload.",
        },
        { status: 400 },
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          ok: false,
          error: "Only image files can be uploaded.",
        },
        { status: 400 },
      );
    }

    if (file.size > maxUploadBytes) {
      return NextResponse.json(
        {
          ok: false,
          error: "Images must be 15 MB or smaller.",
        },
        { status: 413 },
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

    const upload = await uploadAdminImageToCloudinary({
      file,
      category: category.value as AdminUploadCategory,
      title,
      description,
    });

    return NextResponse.json({
      ok: true,
      upload,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "The image could not be uploaded.",
      },
      { status: 502 },
    );
  }
}
