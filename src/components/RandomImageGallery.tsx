"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  workImagesByFolder,
  type WorkImageFolder,
} from "@/data/workImages.generated";

type RandomImageGalleryProps = {
  folder: WorkImageFolder;
  fallbackImages: string[];
  variant?: "grid" | "showcase";
  labels?: string[];
};

function shuffleImages(images: string[]) {
  return [...images].sort(() => Math.random() - 0.5);
}

function getRandomImage(images: string[], currentImage: string) {
  const options = images.filter((image) => image !== currentImage);
  const pool = options.length ? options : images;

  return pool[Math.floor(Math.random() * pool.length)] || currentImage;
}

export function RandomImageGallery({
  folder,
  fallbackImages,
  variant = "grid",
  labels = [],
}: RandomImageGalleryProps) {
  const [allImages, setAllImages] = useState(fallbackImages);
  const [visibleImages, setVisibleImages] = useState(fallbackImages.slice(0, 6));

  useEffect(() => {
    const generatedImages = workImagesByFolder[folder];
    const images = generatedImages.length ? [...generatedImages] : fallbackImages;

    setAllImages(images);
    setVisibleImages(shuffleImages(images).slice(0, 6));
  }, [fallbackImages, folder]);

  useEffect(() => {
    if (allImages.length <= 6) return;

    const timers = visibleImages.map((image, index) => {
      const delay = 4200 + Math.random() * 5200 + index * 450;

      return window.setTimeout(() => {
        setVisibleImages((currentImages) => {
          const nextImages = [...currentImages];
          nextImages[index] = getRandomImage(allImages, image);
          return nextImages;
        });
      }, delay);
    });

    return () => {
      timers.forEach(window.clearTimeout);
    };
  }, [allImages, visibleImages]);

  if (variant === "showcase") {
    return (
      <div className="overflow-hidden rounded-sm bg-[#07111f] shadow-[0_24px_70px_rgba(7,17,31,0.16)] ring-1 ring-black/10">
        <div className="grid min-h-[560px] gap-px bg-[#1d3047] md:grid-cols-4 md:grid-rows-3">
          {visibleImages.map((image, index) => {
            const tileClass =
              index === 0
                ? "md:col-span-2 md:row-span-2"
                : index === 5
                  ? "md:col-span-2"
                  : "";
            const label = labels[index % labels.length];

            return (
              <div
                key={`${image}-${index}`}
                className={`group relative min-h-[210px] overflow-hidden bg-[#101b2c] ${tileClass}`}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes={
                    index === 0
                      ? "(min-width: 1024px) 36vw, 100vw"
                      : "(min-width: 1024px) 18vw, (min-width: 768px) 25vw, 100vw"
                  }
                  className="object-cover opacity-92 transition duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,17,31,0.08)_20%,rgba(7,17,31,0.78)),linear-gradient(90deg,rgba(31,115,190,0.2),transparent_42%)]" />
                <div className="absolute left-4 top-4 h-1.5 w-14 rounded-full bg-accent shadow-[0_0_24px_rgba(31,115,190,0.55)]" />
                {label ? (
                  <div className="absolute inset-x-4 bottom-4">
                    <p className="inline-flex rounded-md border border-white/16 bg-black/44 px-3 py-2 text-[0.68rem] font-black uppercase tracking-[0.16em] text-white backdrop-blur-md">
                      {label}
                    </p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
        <div className="grid gap-px bg-white/10 sm:grid-cols-3">
          {["Rotating work samples", "Custom sizes and materials", "Local sign production"].map(
            (item) => (
              <div key={item} className="bg-[#07111f] px-5 py-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d6e3f0]">
                  {item}
                </p>
              </div>
            ),
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-px overflow-hidden rounded-sm bg-[#c9d7e6] shadow-[0_24px_70px_rgba(7,17,31,0.12)] ring-1 ring-black/10 sm:grid-cols-2 lg:grid-cols-3">
      {visibleImages.map((image, index) => (
        <div key={`${image}-${index}`} className="relative aspect-square bg-[#101b2c]">
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 1024px) 26vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover opacity-92 transition duration-700"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(8,17,31,0.68))]" />
        </div>
      ))}
    </div>
  );
}
