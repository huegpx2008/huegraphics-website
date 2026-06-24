import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  getAdminUploadCategory,
  type AdminUploadCategory,
} from "@/lib/admin-upload-categories";
import {
  getMissingCloudinaryUploadEnvVars,
  uploadAdminImageToCloudinary,
} from "@/lib/cloudinary-admin-upload";

export const runtime = "nodejs";

const maxUploadBytes = 15 * 1024 * 1024;
const uploadLogPrefix = "[admin-upload-api]";

function formText(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

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

    const missingEnvVars = getMissingCloudinaryUploadEnvVars();

    if (missingEnvVars.length) {
      console.error(`${uploadLogPrefix} Missing Cloudinary environment variables.`, {
        missingEnvVars,
      });

      return NextResponse.json(
        {
          ok: false,
          error:
            "Cloudinary uploads are not configured on this server. Missing: " +
            missingEnvVars.join(", ") +
            ".",
          missingEnvVars,
        },
        { status: 503 },
      );
    }

    const formData = await request.formData();
    const files = formData
      .getAll("image")
      .filter((file): file is File => file instanceof File && file.size > 0);
    const categoryValue = formText(formData, "category");
    const category = getAdminUploadCategory(categoryValue);
    const title = formText(formData, "title").slice(0, 120);
    const description = formText(formData, "description").slice(0, 500);

    if (!files.length) {
      return NextResponse.json(
        {
          ok: false,
          error: "Choose at least one image to upload.",
        },
        { status: 400 },
      );
    }

    const invalidFile = files.find((file) => !file.type.startsWith("image/"));

    if (invalidFile) {
      return NextResponse.json(
        {
          ok: false,
          error: `Only image files can be uploaded. ${invalidFile.name} is not an image.`,
        },
        { status: 400 },
      );
    }

    const oversizedFile = files.find((file) => file.size > maxUploadBytes);

    if (oversizedFile) {
      return NextResponse.json(
        {
          ok: false,
          error: `${oversizedFile.name} is too large. Images must be 15 MB or smaller.`,
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

    const uploads = [];

    for (const file of files) {
      const upload = await uploadAdminImageToCloudinary({
        file,
        category: category.value as AdminUploadCategory,
        title,
        description,
      });

      uploads.push(upload);
    }

    return NextResponse.json({
      ok: true,
      upload: uploads[0],
      uploads,
    });
  } catch (error) {
    console.error(`${uploadLogPrefix} Upload request failed.`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

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

export function GET() {
  return NextResponse.json(
    {
      ok: false,
      error: "Use POST to upload an admin photo.",
    },
    { status: 405 },
  );
}
