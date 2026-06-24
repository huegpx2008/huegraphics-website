"use client";

/* eslint-disable @next/next/no-img-element */
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { AdminUploadCategory } from "@/lib/admin-upload-categories";

type GalleryCategory = { value: AdminUploadCategory; label: string };
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
};

export function AdminGalleryManager({
  categories,
}: {
  categories: readonly GalleryCategory[];
}) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
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
    async function loadImages() {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch("/api/admin/gallery", { cache: "no-store" });
        const payload = (await response.json()) as {
          ok?: boolean;
          images?: GalleryImage[];
          error?: string;
        };

        if (response.status === 401) {
          window.location.assign("/admin?next=/admin/gallery");
          return;
        }
        if (!response.ok || !payload.ok || !payload.images) {
          throw new Error(payload.error || "Gallery images could not be loaded.");
        }
        setImages(payload.images);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Gallery images could not be loaded.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadImages();
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
        activeCategory === "all" || image.category === activeCategory;
      const searchText = [
        image.title,
        image.description,
        image.filename,
        image.publicId,
      ]
        .join(" ")
        .toLowerCase();
      return categoryMatches && (!searchValue || searchText.includes(searchValue));
    });
  }, [activeCategory, images, search]);

  const featuredCount = images.filter((image) => image.featured).length;

  function updateImage(nextImage: GalleryImage) {
    setImages((current) =>
      current.map((image) => (image.publicId === nextImage.publicId ? nextImage : image)),
    );
    setSelectedImage((current) =>
      current?.publicId === nextImage.publicId ? nextImage : current,
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicId: selectedImage.publicId,
          title: editTitle,
          description: editDescription,
          category: editCategory,
        }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        image?: GalleryImage;
        error?: string;
      };
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: image.publicId, featured }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        image?: GalleryImage;
        error?: string;
      };
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
    if (!window.confirm(`Delete ${image.title || image.publicId} from Cloudinary?`)) return;
    setIsSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/gallery/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: image.publicId }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Image could not be deleted.");
      }
      setImages((current) => current.filter((item) => item.publicId !== image.publicId));
      setSelectedImage(null);
      setNotice("Image deleted from Cloudinary.");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Image could not be deleted.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="grid gap-7">
      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-md border border-white/10 bg-[#0a1828] p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#65b5f5]">Total Images</p>
          <p className="mt-3 text-4xl font-black">{images.length}</p>
        </div>
        <div className="rounded-md border border-white/10 bg-[#0a1828] p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#65b5f5]">Featured</p>
          <p className="mt-3 text-4xl font-black">{featuredCount}</p>
        </div>
        <div className="rounded-md border border-white/10 bg-[#0a1828] p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#65b5f5]">Showing</p>
          <p className="mt-3 text-4xl font-black">{filteredImages.length}</p>
        </div>
      </section>

      <section className="grid gap-4 rounded-md border border-white/10 bg-[#0a1828] p-4 sm:p-5">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[{ value: "all", label: "All Images" }, ...categories].map((category) => (
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
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search title, description, filename, or public ID"
          className="min-h-12 rounded-md border border-white/15 bg-[#071421] px-4 text-sm font-semibold text-white outline-none placeholder:text-[#65798d] focus:border-[#3d9bea]"
        />
      </section>

      {error ? <p className="rounded-md border border-[#ef7777]/45 bg-[#3b1118] px-4 py-3 text-sm font-bold text-[#ffd4d4]">{error}</p> : null}
      {notice ? <p className="rounded-md border border-[#3ca36c]/45 bg-[#0c2a1b] px-4 py-3 text-sm font-bold text-[#9ef0bd]">{notice}</p> : null}
      {isLoading ? <div className="grid min-h-72 place-items-center rounded-md border border-white/10 bg-[#0a1828] p-6 text-sm font-bold text-[#91a6ba]">Loading Cloudinary images...</div> : null}

      {!isLoading && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredImages.map((image) => (
            <article key={image.publicId} className="overflow-hidden rounded-md border border-white/10 bg-[#0a1828]">
              <button type="button" onClick={() => setSelectedImage(image)} className="block w-full bg-black text-left">
                <img src={image.url} alt={image.title} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
              </button>
              <div className="grid gap-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="line-clamp-2 text-base font-black">{image.title}</h2>
                  {image.featured ? <span className="shrink-0 rounded bg-[#247fc9] px-2 py-1 text-[0.62rem] font-black uppercase tracking-wide text-white">Featured</span> : null}
                </div>
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[#65b5f5]">{image.categoryLabel}</p>
                <p className="break-all text-xs font-semibold leading-5 text-[#9eb0c1]">{image.publicId}</p>
                <button type="button" disabled={isSaving} onClick={() => toggleFeatured(image, !image.featured)} className="min-h-10 rounded-md bg-[#247fc9] px-3 text-xs font-black uppercase tracking-wide text-white transition hover:bg-[#3195e8] disabled:opacity-60">
                  {image.featured ? "Unfeature" : "Feature"}
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      {selectedImage ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/72 px-4 py-5 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="mx-auto grid max-w-6xl overflow-hidden rounded-md border border-white/10 bg-[#081522] lg:grid-cols-[1.1fr_0.9fr]">
            <div className="bg-black">
              <img src={selectedImage.url} alt={selectedImage.title} className="max-h-[78vh] w-full object-contain" />
            </div>
            <div className="grid content-start gap-5 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-2xl font-black">{selectedImage.title}</h2>
                <button type="button" onClick={() => setSelectedImage(null)} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 text-lg font-black text-white">x</button>
              </div>
              <p className="text-sm font-semibold leading-6 text-[#c5d6e7]">{selectedImage.description || "No description"}</p>
              <p className="break-all text-xs font-semibold leading-5 text-[#9eb0c1]">{selectedImage.publicId}</p>
              <button type="button" onClick={() => navigator.clipboard.writeText(selectedImage.url)} className="min-h-11 rounded-md border border-white/15 px-4 text-xs font-black uppercase tracking-wide text-white">Copy URL</button>
              <form onSubmit={saveMetadata} className="grid gap-4 border-t border-white/10 pt-5">
                <input value={editTitle} maxLength={120} onChange={(event) => setEditTitle(event.target.value)} className="min-h-11 rounded-md border border-white/15 bg-[#071421] px-4 text-sm font-semibold text-white outline-none" />
                <textarea value={editDescription} rows={4} maxLength={500} onChange={(event) => setEditDescription(event.target.value)} className="resize-y rounded-md border border-white/15 bg-[#071421] px-4 py-3 text-sm font-semibold leading-6 text-white outline-none" />
                <select value={editCategory} onChange={(event) => setEditCategory(event.target.value as AdminUploadCategory)} className="min-h-11 rounded-md border border-white/15 bg-[#071421] px-4 text-sm font-semibold text-white outline-none">
                  {categories.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
                </select>
                <div className="grid gap-2 sm:grid-cols-2">
                  <button type="submit" disabled={isSaving} className="min-h-11 rounded-md bg-[#247fc9] px-4 text-xs font-black uppercase tracking-wide text-white disabled:opacity-60">Save Changes</button>
                  <button type="button" disabled={isSaving} onClick={() => deleteImage(selectedImage)} className="min-h-11 rounded-md border border-[#ef7777]/45 px-4 text-xs font-black uppercase tracking-wide text-[#ffd4d4] disabled:opacity-60">Delete Image</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
