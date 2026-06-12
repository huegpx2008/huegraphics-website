"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import {
  workImagesByFolder,
  type WorkImageFolder,
} from "@/data/workImages.generated";

type WorkImageSlideshowProps = {
  imageFolder?: WorkImageFolder;
  images: string[];
};

export function WorkImageSlideshow({ imageFolder, images }: WorkImageSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideImages, setSlideImages] = useState(images);

  useEffect(() => {
    const generatedImages = imageFolder ? workImagesByFolder[imageFolder] : [];
    const nextImages = generatedImages.length ? [...generatedImages] : images;

    setSlideImages(nextImages);
    setActiveIndex((current) => (current >= nextImages.length ? 0 : current));
  }, [imageFolder, images]);

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
        <img
          key={image}
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
          className={[
            "absolute inset-0 h-full w-full object-cover transition duration-700 ease-in-out group-hover:scale-105",
            index === activeIndex ? "opacity-[0.86]" : "opacity-0",
          ].join(" ")}
        />
      ))}
    </>
  );
}
