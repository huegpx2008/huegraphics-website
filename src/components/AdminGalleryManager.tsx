"use client";

/* eslint-disable @next/next/no-img-element */
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { AdminUploadCategory } from "@/lib/admin-upload-categories";

type GalleryCategory = {
  value: AdminUploadCategory;
  label: string;
};

type GalleryImage = {
  publicId: string;
  url: string;
  title: string;
  description: string;
  category: AdminUploadCategory;
  categoryLabel: string;
  uploadedAt: string;
  tags: string[];
  featured: boolean;
  filename: string;
  width?: number;
  height?: number;
  format?: string;
};

type AdminGalleryManagerProps = {
  categories: readonly GalleryCategory[];
};

type GalleryPayload = {
  ok?: boolean;
  images?: GalleryImage[];
  error?: string;
};

const allFilter = "all";

async function readJsonResponse<T>(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  const text = await response.text();

  if (!contentType.includes("application/json")) {
    throw new Error("Gallery API returned an unexpected non-JSON response.");
  }

  return JSON.parse(text || "{}") as T;
}

function formatDate(value: string) {
  if (!value) return "Unknown";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function makeSearchText(image: GalleryImage) {
  return [
    image.title,
    image.description,
    image.filename,
    image.publicId,
    image.categoryLabel,
  ]
    .join(" ")
    .toLowerCase();
}

export function AdminGalleryManager({
  categories,
}: AdminGalleryManagerProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>(allFilter);
  const [search, setSearch] = useState("");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState<AdminUploadCategory>(
    categories[0]?.value || "screen-printing",
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadImages() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch("/api/admin/gallery", {
          cache: "no-store",
        });
        const payload = await readJsonResponse<GalleryPayload>(response);

        if (response.status === 401) {
          window.location.assign("/admin?next=/admin/gallery");
          return;
        }

        if (!response.ok || !payload.ok || !payload.images) {
          throw new Error(payload.error || "Gallery images could not be loaded.");
        }

        if (isMounted) {
          setImages(payload.images);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Gallery images could not be loaded.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadImages();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedImage) return;

    setEditTitle(selectedImage.title);
    setEditDescription(selectedImage.description);
    setEditCategory(selectedImage.category);
  }, [selectedImage]);

  const filteredImages = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return images.filter((image) => {
      const categoryMatches =
        activeCategory === allFilter || image.category === activeCategory;
      const searchMatches =
        !searchValue || makeSearchText(image).includes(searchValue);

      return categoryMatches && searchMatches;
    });
  }, [activeCategory, images, search]);

  const categoryCounts = useMemo(() => {
    return categories.map((category) => ({
      ...category,
      count: images.filter((image) => image.category === category.value).length,
    }));
  }, [categories, images]);

  const featuredCount = useMemo(
    () => images.filter((image) => image.featured).length,
    [images],
  );

  function updateImage(nextImage: GalleryImage) {
    setImages((currentImages) =>
      currentImages.map((image) =>
        image.publicId === nextImage.publicId ? nextImage : image,
      ),
    );
    setSelectedImage((currentImage) =>
      currentImage?.publicId === nextImage.publicId ? nextImage : currentImage,
    );
  }

  async function saveMetadata(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedImage) return;

    setIsSaving(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/admin/gallery/metadata", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publicId: selectedImage.publicId,
          title: editTitle,
          description: editDescription,
          category: editCategory,
        }),
      });
      const payload = await readJsonResponse<{
        ok?: boolean;
        image?: GalleryImage;
        error?: string;
      }>(response);

      if (!response.ok || !payload.ok || !payload.image) {
        throw new Error(payload.error || "Image metadata could not be updated.");
      }

      updateImage(payload.image);
      setNotice("Image metadata updated.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Image metadata could not be updated.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleFeatured(image: GalleryImage, featured: boolean) {
    setIsSaving(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/admin/gallery/featured", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publicId: image.publicId,
          featured,
        }),
      });
      const payload = await readJsonResponse<{
        ok?: boolean;
        image?: GalleryImage;
        error?: string;
      }>(response);

      if (!response.ok || !payload.ok || !payload.image) {
        throw new Error(payload.error || "Featured status could not be updated.");
      }

      updateImage(payload.image);
      setNotice(featured ? "Image marked as featured." : "Featured tag removed.");
    } catch (featuredError) {
      setError(
        featuredError instanceof Error
          ? featuredError.message
          : "Featured status could not be updated.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteImage(image: GalleryImage) {
    const confirmed = window.confirm(
      `Delete ${image.title || image.publicId} from Cloudinary? This cannot be undone.`,
    );

    if (!confirmed) return;

    setIsSaving(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/admin/gallery/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publicId: image.publicId,
        }),
      });
      const payload = await readJsonResponse<{
        ok?: boolean;
        publicId?: string;
        error?: string;
      }>(response);

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Image could not be deleted.");
      }

      setImages((currentImages) =>
        currentImages.filter((currentImage) => currentImage.publicId !== image.publicId),
      );
      setSelectedImage((currentImage) =>
        currentImage?.publicId === image.publicId ? null : currentImage,
      );
      setNotice("Image deleted from Cloudinary.");
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Image could not be deleted.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function copySelectedUrl() {
    if (!selectedImage) return;

    await navigator.clipboard.writeText(selectedImage.url);
    setNotice("Cloudinary URL copied.");
  }

  return (
    <div className="grid gap-7">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[1fr_2fr_1fr]">
        <div className="rounded-md border border-white/10 bg-[#0a1828] p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#65b5f5]">
            Total images
          </p>
          <p className="mt-3 text-4xl font-black">{images.length}</p>
        </div>
        <div className="rounded-md border border-white/10 bg-[#0a1828] p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#65b5f5]">
            Images by category
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {categoryCounts.map((category) => (
              <div
                key={category.value}
                className="flex items-center justify-between gap-3 rounded bg-white/[0.04] px-3 py-2 text-sm font-bold text-[#c5d6e7]"
              >
                <span>{category.label}</span>
                <span className="text-white">{category.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-md border border-white/10 bg-[#0a1828] p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#65b5f5]">
            Featured
          </p>
          <p className="mt-3 text-4xl font-black">{featuredCount}</p>
        </div>
      </section>

      <section className="grid gap-4 rounded-md border border-white/10 bg-[#0a1828] p-4 sm:p-5">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveCategory(allFilter)}
            className={[
              "shrink-0 rounded-md border px-4 py-2 text-xs font-black uppercase tracking-wide transition",
              activeCategory === allFilter
                ? "border-[#65b5f5] bg-[#247fc9] text-white"
                : "border-white/15 bg-[#071421] text-[#c4d3e2] hover:border-[#65b5f5]",
            ].join(" ")}
          >
            All Images
          </button>
          {categories.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => setActiveCategory(category.value)}
              className={[
                "shrink-0 rounded-md border px-4 py-2 text-xs font-black uppercase tracking-wide transition",
                activeCategory === category.value
                  ? "border-[#65b5f5] bg-[#247fc9] text-white"
                  : "border-white/15 bg-[#071421] text-[#c4d3e2] hover:border-[#65b5f5]",
              ].join(" ")}
            >
              {category.label}
            </button>
          ))}
        </div>
        <label className="grid gap-2">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-[#7fa8cc]">
            Search
          </span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title, description, filename, or public ID"
            className="min-h-12 rounded-md border border-white/15 bg-[#071421] px-4 text-sm font-semibold text-white outline-none placeholder:text-[#65798d] focus:border-[#3d9bea]"
          />
        </label>
      </section>

      {error ? (
        <p
          role="alert"
          className="rounded-md border border-[#ef7777]/45 bg-[#3b1118] px-4 py-3 text-sm font-bold text-[#ffd4d4]"
        >
          {error}
        </p>
      ) : null}

      {notice ? (
        <p className="rounded-md border border-[#3ca36c]/45 bg-[#0c2a1b] px-4 py-3 text-sm font-bold text-[#9ef0bd]">
          {notice}
        </p>
      ) : null}

      {isLoading ? (
        <div className="grid min-h-72 place-items-center rounded-md border border-white/10 bg-[#0a1828] p-6 text-center text-sm font-bold text-[#91a6ba]">
          Loading Cloudinary images...
        </div>
      ) : filteredImages.length ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredImages.map((image) => (
            <article
              key={image.publicId}
              className="overflow-hidden rounded-md border border-white/10 bg-[#0a1828]"
            >
              <button
                type="button"
                onClick={() => setSelectedImage(image)}
                className="block w-full bg-black text-left"
              >
                <img
                  src={image.url}
                  alt={image.title}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover"
                />
              </button>
              <div className="grid gap-3 p-4">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="line-clamp-2 text-base font-black">
                      {image.title}
                    </h2>
                    {image.featured ? (
                      <span className="shrink-0 rounded bg-[#247fc9] px-2 py-1 text-[0.62rem] font-black uppercase tracking-wide text-white">
                        Featured
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-xs font-black uppercase tracking-[0.12em] text-[#65b5f5]">
                    {image.categoryLabel}
                  </p>
                </div>
                <dl className="grid gap-2 text-xs font-semibold leading-5 text-[#9eb0c1]">
                  <div>
                    <dt className="font-black uppercase tracking-wide text-[#6d849b]">
                      Upload date
                    </dt>
                    <dd>{formatDate(image.uploadedAt)}</dd>
                  </div>
                  <div>
                    <dt className="font-black uppercase tracking-wide text-[#6d849b]">
                      Public ID
                    </dt>
                    <dd className="break-all">{image.publicId}</dd>
                  </div>
                </dl>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    className="min-h-10 rounded-md border border-white/15 px-3 text-xs font-black uppercase tracking-wide text-white transition hover:border-[#65b5f5]"
                  >
                    Details
                  </button>
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => toggleFeatured(image, !image.featured)}
                    className="min-h-10 rounded-md bg-[#247fc9] px-3 text-xs font-black uppercase tracking-wide text-white transition hover:bg-[#3195e8] disabled:opacity-60"
                  >
                    {image.featured ? "Unfeature" : "Feature"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <div className="grid min-h-72 place-items-center rounded-md border border-white/10 bg-[#0a1828] p-6 text-center text-sm font-bold text-[#91a6ba]">
          No Cloudinary images match these filters.
        </div>
      )}

      {selectedImage ? (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/72 px-4 py-5 backdrop-blur-sm sm:px-6"
          role="dialog"
          aria-modal="true"
        >
          <div className="mx-auto grid max-w-6xl overflow-hidden rounded-md border border-white/10 bg-[#081522] shadow-[0_30px_100px_rgba(0,0,0,0.55)] lg:grid-cols-[1.1fr_0.9fr]">
            <div className="bg-black">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="max-h-[78vh] w-full object-contain"
              />
            </div>
            <div className="grid content-start gap-5 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#65b5f5]">
                    Image details
                  </p>
                  <h2 className="mt-2 text-2xl font-black">
                    {selectedImage.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 text-lg font-black text-white transition hover:border-[#65b5f5]"
                  aria-label="Close image details"
                >
                  x
                </button>
              </div>

              <dl className="grid gap-3 rounded-md border border-white/10 bg-[#06101b] p-4 text-sm">
                <div>
                  <dt className="text-xs font-black uppercase tracking-[0.13em] text-[#6d849b]">
                    Description
                  </dt>
                  <dd className="mt-1 font-semibold leading-6 text-[#c5d6e7]">
                    {selectedImage.description || "No description"}
                  </dd>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-black uppercase tracking-[0.13em] text-[#6d849b]">
                      Category
                    </dt>
                    <dd className="mt-1 font-semibold text-[#c5d6e7]">
                      {selectedImage.categoryLabel}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-black uppercase tracking-[0.13em] text-[#6d849b]">
                      Upload date
                    </dt>
                    <dd className="mt-1 font-semibold text-[#c5d6e7]">
                      {formatDate(selectedImage.uploadedAt)}
                    </dd>
                  </div>
                </div>
                <div>
                  <dt className="text-xs font-black uppercase tracking-[0.13em] text-[#6d849b]">
                    Public ID
                  </dt>
                  <dd className="mt-1 break-all font-semibold text-[#c5d6e7]">
                    {selectedImage.publicId}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-black uppercase tracking-[0.13em] text-[#6d849b]">
                    Cloudinary URL
                  </dt>
                  <dd className="mt-1 break-all font-semibold text-[#c5d6e7]">
                    {selectedImage.url}
                  </dd>
                </div>
              </dl>

              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={copySelectedUrl}
                  className="min-h-11 rounded-md border border-white/15 px-4 text-xs font-black uppercase tracking-wide text-white transition hover:border-[#65b5f5]"
                >
                  Copy URL
                </button>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => toggleFeatured(selectedImage, !selectedImage.featured)}
                  className="min-h-11 rounded-md bg-[#247fc9] px-4 text-xs font-black uppercase tracking-wide text-white transition hover:bg-[#3195e8] disabled:opacity-60"
                >
                  {selectedImage.featured ? "Remove Featured" : "Mark as Featured"}
                </button>
              </div>

              <form onSubmit={saveMetadata} className="grid gap-4 border-t border-white/10 pt-5">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#65b5f5]">
                  Edit metadata
                </p>
                <label className="grid gap-2">
                  <span className="text-xs font-black uppercase tracking-[0.13em] text-[#7fa8cc]">
                    Title
                  </span>
                  <input
                    type="text"
                    value={editTitle}
                    maxLength={120}
                    onChange={(event) => setEditTitle(event.target.value)}
                    className="min-h-11 rounded-md border border-white/15 bg-[#071421] px-4 text-sm font-semibold text-white outline-none focus:border-[#3d9bea]"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-xs font-black uppercase tracking-[0.13em] text-[#7fa8cc]">
                    Description
                  </span>
                  <textarea
                    value={editDescription}
                    rows={4}
                    maxLength={500}
                    onChange={(event) => setEditDescription(event.target.value)}
                    className="resize-y rounded-md border border-white/15 bg-[#071421] px-4 py-3 text-sm font-semibold leading-6 text-white outline-none focus:border-[#3d9bea]"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-xs font-black uppercase tracking-[0.13em] text-[#7fa8cc]">
                    Category
                  </span>
                  <select
                    value={editCategory}
                    onChange={(event) =>
                      setEditCategory(event.target.value as AdminUploadCategory)
                    }
                    className="min-h-11 rounded-md border border-white/15 bg-[#071421] px-4 text-sm font-semibold text-white outline-none focus:border-[#3d9bea]"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="min-h-11 rounded-md bg-[#247fc9] px-4 text-xs font-black uppercase tracking-wide text-white transition hover:bg-[#3195e8] disabled:opacity-60"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => deleteImage(selectedImage)}
                    className="min-h-11 rounded-md border border-[#ef7777]/45 px-4 text-xs font-black uppercase tracking-wide text-[#ffd4d4] transition hover:bg-[#3b1118] disabled:opacity-60"
                  >
                    Delete Image
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
