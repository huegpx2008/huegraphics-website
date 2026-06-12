"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import {
  workImagesByFolder,
  type WorkImageFolder,
} from "@/data/workImages.generated";

type RandomImageGalleryProps = {
  folder: WorkImageFolder;
  fallbackImages: string[];
};

function shuffleImages(images: string[]) {
  return [...images].sort(() => Math.random() - 0.5);
}

function getRandomImage(images: string[], currentImage: string) {
  const options = images.filter((image) => image !== currentImage);
  const pool = options.length ? options : images;

  return pool[Math.floor(Math.random() * pool.length)] || currentImage;
}

export function RandomImageGallery({ folder, fallbackImages }: RandomImageGalleryProps) {
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

  return (
    <div className="grid gap-px overflow-hidden rounded-sm bg-[#c9d7e6] shadow-[0_24px_70px_rgba(7,17,31,0.12)] ring-1 ring-black/10 sm:grid-cols-2 lg:grid-cols-3">
      {visibleImages.map((image, index) => (
        <div key={`${image}-${index}`} className="relative aspect-square bg-[#101b2c]">
          <img
            src={image}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover opacity-92 transition duration-700"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(8,17,31,0.68))]" />
        </div>
      ))}
    </div>
  );
}
