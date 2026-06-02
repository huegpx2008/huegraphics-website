"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type WorkImageSlideshowProps = {
  imageFolder?: string;
  images: string[];
};

export function WorkImageSlideshow({ imageFolder, images }: WorkImageSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideImages, setSlideImages] = useState(images);

  useEffect(() => {
    if (!imageFolder) {
      setSlideImages(images);
    }
  }, [imageFolder, images]);

  useEffect(() => {
    if (!imageFolder) return;

    let cancelled = false;

    async function loadImages() {
      try {
        const response = await fetch(`/api/work-images?folder=${imageFolder}`);
        if (!response.ok) return;

        const payload = (await response.json()) as { images?: string[] };

        if (!cancelled && payload.images?.length) {
          setSlideImages(payload.images);
          setActiveIndex((current) =>
            current >= payload.images!.length ? 0 : current
          );
        }
      } catch {
        // Keep the initial server-provided images if the folder cannot be read.
      }
    }

    loadImages();
    const interval = window.setInterval(loadImages, 10000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [imageFolder]);

  useEffect(() => {
    if (slideImages.length <= 1) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideImages.length);
    }, 4000);

    return () => window.clearInterval(interval);
  }, [slideImages.length]);

  return (
    <>
      {slideImages.map((image, index) => (
        <Image
          key={image}
          src={image}
          alt=""
          fill
          sizes="(min-width: 1280px) 20vw, (min-width: 768px) 50vw, 100vw"
          className={[
            "object-cover transition duration-700 ease-in-out group-hover:scale-105",
            index === activeIndex ? "opacity-[0.86]" : "opacity-0",
          ].join(" ")}
        />
      ))}
    </>
  );
}
