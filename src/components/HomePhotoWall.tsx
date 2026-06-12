"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from "react";

type HomePhotoWallProps = {
  images: readonly string[];
  fallbackImages: string[];
};

type PhotoTile = {
  id: number;
  image: string;
  nextImage: string;
  isFlipping: boolean;
};

const visiblePhotoCount = 6;
const flipDuration = 620;

function shuffleImages(images: string[]) {
  return [...images].sort(() => Math.random() - 0.5);
}

function getRandomImage(images: string[], currentImages: string[]) {
  const options = images.filter((image) => !currentImages.includes(image));
  const pool = options.length ? options : images;

  return pool[Math.floor(Math.random() * pool.length)] || currentImages[0];
}

export function HomePhotoWall({ images, fallbackImages }: HomePhotoWallProps) {
  const allImages = useMemo(() => {
    const sourceImages = images.length ? [...images] : fallbackImages;
    return sourceImages.length ? sourceImages : fallbackImages;
  }, [fallbackImages, images]);

  const [tiles, setTiles] = useState<PhotoTile[]>(() =>
    allImages
      .slice(0, visiblePhotoCount)
      .map((image, index) => ({
        id: index,
        image,
        nextImage: image,
        isFlipping: false,
      }))
  );

  useEffect(() => {
    setTiles(
      shuffleImages(allImages)
        .slice(0, visiblePhotoCount)
        .map((image, index) => ({
          id: index,
          image,
          nextImage: image,
          isFlipping: false,
        }))
    );
  }, [allImages]);

  useEffect(() => {
    if (allImages.length <= visiblePhotoCount) return;

    const activePhotoCount = Math.min(visiblePhotoCount, allImages.length);
    let fadeTimeout: number;
    let timeout: number;

    const swapRandomTile = () => {
      const tileIndex = Math.floor(Math.random() * activePhotoCount);

      setTiles((currentTiles) => {
        const currentImages = currentTiles.map((tile) => tile.image);
        const nextImage = getRandomImage(allImages, currentImages);

        return currentTiles.map((tile, index) =>
          index === tileIndex
            ? { ...tile, nextImage, isFlipping: true }
            : tile
        );
      });

      fadeTimeout = window.setTimeout(() => {
        setTiles((currentTiles) =>
          currentTiles.map((tile, index) =>
            index === tileIndex
              ? {
                  ...tile,
                  id: tile.id + activePhotoCount,
                  image: tile.nextImage,
                  isFlipping: false,
                }
              : tile
          )
        );
      }, flipDuration);

      timeout = window.setTimeout(swapRandomTile, 700 + Math.random() * 1200);
    };

    timeout = window.setTimeout(swapRandomTile, 700 + Math.random() * 1200);

    return () => {
      window.clearTimeout(fadeTimeout);
      window.clearTimeout(timeout);
    };
  }, [allImages]);

  return (
    <div className="grid grid-cols-2 gap-px bg-white/12 sm:grid-cols-3">
      {tiles.map((tile, index) => (
        <div key={`${tile.id}-${index}`} className="relative aspect-square overflow-hidden bg-[#101b2c] [perspective:900px]">
          <div
            className={[
              "absolute inset-0 transition-transform duration-[620ms] ease-in-out [transform-style:preserve-3d]",
              tile.isFlipping ? "[transform:rotateX(-180deg)]" : "[transform:rotateX(0deg)]",
            ].join(" ")}
          >
            <div className="absolute inset-0 [backface-visibility:hidden]">
              <img
                src={tile.image}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover opacity-[0.9]"
              />
            </div>
            <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateX(180deg)]">
              <img
                src={tile.nextImage}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover opacity-[0.92]"
              />
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-px bg-black/45 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1/2 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,11,20,0.08),rgba(5,11,20,0.2))]" />
        </div>
      ))}
    </div>
  );
}
