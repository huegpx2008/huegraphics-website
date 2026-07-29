import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  getAdminUploadCategory,
  type AdminUploadCategory,
} from "@/lib/admin-upload-categories";
import {
  createAdminCloudinaryUploadSignature,
  getMissingCloudinaryUploadEnvVars,
} from "@/lib/cloudinary-admin-upload";

export const runtime = "nodejs";

const uploadSignatureLogPrefix = "[admin-upload-signature-api]";

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { ok: false, error: "Admin access is required." },
        { status: 401 },
      );
    }

    const missingEnvVars = getMissingCloudinaryUploadEnvVars();

    if (missingEnvVars.length) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Cloudinary uploads are not configured on this server. Missing: " +
            missingEnvVars.join(", ") +
            ".",
        },
        { status: 503 },
      );
    }

    const body = (await request.json()) as Record<string, unknown>;
    const categoryValue = String(body.category || "").trim();
    const category = getAdminUploadCategory(categoryValue);

    if (!category) {
      return NextResponse.json(
        { ok: false, error: "Choose a valid photo category." },
        { status: 400 },
      );
    }

    const signedUpload = createAdminCloudinaryUploadSignature({
      category: category.value as AdminUploadCategory,
      title: String(body.title || "").trim().slice(0, 120),
      description: String(body.description || "").trim().slice(0, 500),
    });

    return NextResponse.json({
      ok: true,
      uploadUrl: signedUpload.uploadUrl,
      apiKey: signedUpload.apiKey,
      signature: signedUpload.signature,
      parameters: signedUpload.parameters,
      category: signedUpload.category,
    });
  } catch (error) {
    console.error(`${uploadSignatureLogPrefix} Signature request failed.`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "The upload could not be authorized.",
      },
      { status: 502 },
    );
  }
}

export function GET() {
  return NextResponse.json(
    { ok: false, error: "Use POST to authorize an admin photo upload." },
    { status: 405 },
  );
}
