"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { adminUploadCategories } from "@/lib/admin-upload-categories";

type UploadResult = {
  url: string;
  publicId: string;
  category: string;
  width?: number;
  height?: number;
};

type AdminPhotoUploadFormProps = {
  isConfigured: boolean;
};

type UploadSignatureResponse = {
  ok?: boolean;
  uploadUrl?: string;
  apiKey?: string;
  signature?: string;
  parameters?: Record<string, string | number>;
  category?: string;
  error?: string;
};

type CloudinaryUploadResponse = {
  secure_url?: string;
  public_id?: string;
  width?: number;
  height?: number;
  error?: {
    message?: string;
  };
};

const maxUploadBytes = 15 * 1024 * 1024;

async function readJsonResponse<T>(
  response: Response,
  fallbackError: string,
): Promise<T> {
  const contentType = response.headers.get("content-type") || "";
  const responseText = await response.text();

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(responseText || "{}") as T;
    } catch {
      return { error: `${fallbackError} returned invalid JSON.` } as T;
    }
  }

  return {
    error:
      response.status === 413
        ? "The upload is too large for the receiving server."
        : `${fallbackError} returned an unexpected response (${response.status}).`,
  } as T;
}

export function AdminPhotoUploadForm({
  isConfigured,
}: AdminPhotoUploadFormProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [localPreviews, setLocalPreviews] = useState<string[]>([]);
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!selectedFiles.length) {
      setLocalPreviews([]);
      return;
    }

    const previewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setLocalPreviews(previewUrls);

    return () => {
      previewUrls.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
    };
  }, [selectedFiles]);

  function chooseImage(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
    setUploadResults([]);
    setError("");
  }

  async function submitUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setUploadResults([]);

    if (!selectedFiles.length) {
      setError("Choose at least one image to upload.");
      return;
    }

    const invalidFile = selectedFiles.find(
      (file) => !file.type.startsWith("image/"),
    );

    if (invalidFile) {
      setError(`${invalidFile.name} is not an image.`);
      return;
    }

    const oversizedFile = selectedFiles.find(
      (file) => file.size > maxUploadBytes,
    );

    if (oversizedFile) {
      setError(
        `${oversizedFile.name} is too large. Images must be 15 MB or smaller.`,
      );
      return;
    }

    setIsUploading(true);

    try {
      const form = event.currentTarget;
      const formData = new FormData(form);
      const category = String(formData.get("category") || "");
      const title = String(formData.get("title") || "");
      const description = String(formData.get("description") || "");
      const completedUploads: UploadResult[] = [];

      for (const file of selectedFiles) {
        const signatureResponse = await fetch("/api/admin/upload/signature", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ category, title, description }),
        });
        const signaturePayload = await readJsonResponse<UploadSignatureResponse>(
          signatureResponse,
          "Upload authorization",
        );

        if (signatureResponse.status === 401) {
          window.location.assign("/admin?next=/admin/upload");
          return;
        }

        if (
          !signatureResponse.ok ||
          !signaturePayload.ok ||
          !signaturePayload.uploadUrl ||
          !signaturePayload.apiKey ||
          !signaturePayload.signature ||
          !signaturePayload.parameters ||
          !signaturePayload.category
        ) {
          throw new Error(
            `${file.name}: ${signaturePayload.error || "The upload could not be authorized."}`,
          );
        }

        const cloudinaryForm = new FormData();

        cloudinaryForm.set("file", file);
        cloudinaryForm.set("api_key", signaturePayload.apiKey);
        cloudinaryForm.set("signature", signaturePayload.signature);

        Object.entries(signaturePayload.parameters).forEach(([key, value]) => {
          cloudinaryForm.set(key, String(value));
        });

        const uploadResponse = await fetch(signaturePayload.uploadUrl, {
          method: "POST",
          body: cloudinaryForm,
        });
        const uploadPayload = await readJsonResponse<CloudinaryUploadResponse>(
          uploadResponse,
          "Cloudinary",
        );

        if (
          !uploadResponse.ok ||
          !uploadPayload.secure_url ||
          !uploadPayload.public_id
        ) {
          throw new Error(
            `${file.name}: ${uploadPayload.error?.message || "Cloudinary could not upload this image."}`,
          );
        }

        completedUploads.push({
          url: uploadPayload.secure_url,
          publicId: uploadPayload.public_id,
          category: signaturePayload.category,
          width: uploadPayload.width,
          height: uploadPayload.height,
        });
        setUploadResults([...completedUploads]);
      }

      setUploadResults(completedUploads);
      setSelectedFiles([]);
      form.reset();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "The image could not be uploaded.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  const previewUrl = uploadResults[0]?.url || localPreviews[0] || "";
  const selectedFileCount = selectedFiles.length;

  return (
    <form onSubmit={submitUpload} className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
      <div className="grid content-start gap-5 rounded-md border border-white/10 bg-[#0a1828] p-5 sm:p-6">
        <label className="grid gap-2">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-[#7fa8cc]">
            Image
          </span>
          <input
            type="file"
            name="image"
            accept="image/*"
            multiple
            required
            disabled={!isConfigured || isUploading}
            onChange={chooseImage}
            className="block min-h-12 w-full cursor-pointer rounded-md border border-dashed border-[#3f7098] bg-[#071421] px-3 py-3 text-sm font-semibold text-[#bfd0df] file:mr-3 file:rounded file:border-0 file:bg-[#247fc9] file:px-4 file:py-2 file:text-xs file:font-black file:uppercase file:text-white"
          />
          <span className="text-xs font-semibold leading-5 text-[#7f93a7]">
            Choose one photo or batch upload multiple photos. Maximum 15 MB each.
          </span>
          {selectedFileCount ? (
            <span className="text-xs font-black uppercase tracking-wide text-[#72bdf7]">
              {selectedFileCount} selected
            </span>
          ) : null}
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-[#7fa8cc]">
            Category
          </span>
          <select
            name="category"
            required
            defaultValue={adminUploadCategories[0].value}
            disabled={!isConfigured || isUploading}
            className="h-12 rounded-md border border-white/15 bg-[#071421] px-4 text-sm font-bold text-white outline-none focus:border-[#3d9bea]"
          >
            {adminUploadCategories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-[#7fa8cc]">
            Title <span className="text-[#60778e]">Optional</span>
          </span>
          <input
            type="text"
            name="title"
            maxLength={120}
            disabled={!isConfigured || isUploading}
            className="h-12 rounded-md border border-white/15 bg-[#071421] px-4 text-sm font-semibold text-white outline-none focus:border-[#3d9bea]"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-[#7fa8cc]">
            Description <span className="text-[#60778e]">Optional</span>
          </span>
          <textarea
            name="description"
            rows={5}
            maxLength={500}
            disabled={!isConfigured || isUploading}
            className="resize-y rounded-md border border-white/15 bg-[#071421] px-4 py-3 text-sm font-semibold leading-6 text-white outline-none focus:border-[#3d9bea]"
          />
        </label>

        {!isConfigured ? (
          <p
            role="alert"
            className="rounded-md border border-[#efc76e]/45 bg-[#33260c] px-4 py-3 text-sm font-bold leading-6 text-[#ffe5a6]"
          >
            Cloudinary is not configured. Add the three CLOUDINARY environment
            variables and restart the server.
          </p>
        ) : null}

        {error ? (
          <p
            role="alert"
            className="rounded-md border border-[#ef7777]/45 bg-[#3b1118] px-4 py-3 text-sm font-bold text-[#ffd4d4]"
          >
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={!isConfigured || isUploading}
          className="h-12 rounded-md bg-[#247fc9] px-5 text-sm font-black uppercase text-white transition hover:bg-[#3195e8] disabled:cursor-not-allowed disabled:bg-[#42566b]"
        >
          {isUploading ? "Uploading..." : "Upload photo"}
        </button>
      </div>

      <section className="min-h-80 rounded-md border border-white/10 bg-[#081522] p-5 sm:p-6">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#7fa8cc]">
          Preview
        </p>

        {previewUrl ? (
          <div className="mt-4 overflow-hidden rounded-md border border-white/10 bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt={uploadResults.length ? "Uploaded image preview" : "Selected image preview"}
              className="aspect-[4/3] w-full object-contain"
            />
          </div>
        ) : (
          <div className="mt-4 grid aspect-[4/3] place-items-center rounded-md border border-dashed border-white/15 bg-[#06101b] p-6 text-center text-sm font-bold leading-6 text-[#60778e]">
            Your selected photo will appear here before upload.
          </div>
        )}

        {uploadResults.length ? (
          <div className="mt-5 rounded-md border border-[#3ca36c]/45 bg-[#0c2a1b] p-4">
            <p className="text-sm font-black text-[#9ef0bd]">
              {uploadResults.length === 1
                ? "Photo uploaded successfully."
                : `${uploadResults.length} photos uploaded successfully.`}
            </p>
            <div className="mt-3 grid gap-2">
              {uploadResults.map((uploadResult) => (
                <div key={uploadResult.publicId} className="rounded bg-black/18 p-3">
                  <p className="break-all text-xs font-semibold leading-5 text-[#a9cabb]">
                    {uploadResult.publicId}
                  </p>
                  <a
                    href={uploadResult.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex min-h-8 items-center text-xs font-black uppercase tracking-wide text-[#72bdf7] hover:text-white"
                  >
                    Open uploaded image
                  </a>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </form>
  );
}
