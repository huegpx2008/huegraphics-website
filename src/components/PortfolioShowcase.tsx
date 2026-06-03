"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type PortfolioShowcaseProps = {
  images: readonly string[];
};

type GalleryTile = {
  id: number;
  image: string;
  isChanging: boolean;
};

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/huegpx" },
  { label: "Facebook", href: "https://www.facebook.com/huegpx" },
  {
    label: "Google Business",
    href: "https://www.google.com/search?q=Hue+Graphics+Bethlehem+GA",
  },
];

const collageTileCount = 60;
const collageTileClasses = [
  "col-span-2 row-span-2",
  "",
  "row-span-2",
  "",
  "sm:col-span-2",
  "",
  "lg:col-span-2 lg:row-span-2",
  "",
  "",
  "row-span-2",
  "sm:col-span-2",
  "",
  "",
  "lg:row-span-2",
  "",
  "col-span-2 row-span-2",
  "",
  "",
  "sm:col-span-2",
  "",
];

function pickSpread(images: readonly string[], count: number, offset = 0) {
  if (images.length <= count) {
    return [...images];
  }

  return Array.from({ length: count }, (_, index) => {
    const imageIndex = Math.floor(((index + offset) * images.length) / count) % images.length;
    return images[imageIndex];
  });
}

function getRandomImage(images: readonly string[], currentImage: string) {
  const nextIndex = Math.floor(Math.random() * images.length);
  return images[nextIndex] || currentImage;
}

export function PortfolioShowcase({ images }: PortfolioShowcaseProps) {
  const galleryImages = useMemo(() => pickSpread(images, collageTileCount), [images]);
  const railImages = useMemo(() => pickSpread(images, 18, 7), [images]);
  const [activeImage, setActiveImage] = useState(images[0] || "");
  const [nextImage, setNextImage] = useState(images[1] || images[0] || "");
  const [isSwitching, setIsSwitching] = useState(false);
  const [galleryTiles, setGalleryTiles] = useState<GalleryTile[]>(() =>
    galleryImages.map((image, index) => ({
      id: index,
      image,
      isChanging: false,
    }))
  );

  useEffect(() => {
    if (!images.length) return;

    setActiveImage(images[0]);
    setNextImage(images[1] || images[0]);
  }, [images]);

  useEffect(() => {
    setGalleryTiles(
      galleryImages.map((image, index) => ({
        id: index,
        image,
        isChanging: false,
      }))
    );
  }, [galleryImages]);

  useEffect(() => {
    if (images.length <= 1) return;

    let swapTimeout: number;

    const interval = window.setInterval(() => {
      const selectedImage = getRandomImage(images, activeImage);
      setNextImage(selectedImage);
      setIsSwitching(true);

      swapTimeout = window.setTimeout(() => {
        setActiveImage(selectedImage);
        setIsSwitching(false);
      }, 760);
    }, 2600);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(swapTimeout);
    };
  }, [activeImage, images]);

  useEffect(() => {
    if (images.length <= 1 || !galleryTiles.length) return;

    let fadeTimeout: number;
    let nextSwapTimeout: number;

    const swapTile = () => {
      const tileIndex = Math.floor(Math.random() * galleryTiles.length);

      setGalleryTiles((currentTiles) =>
        currentTiles.map((tile, index) =>
          index === tileIndex ? { ...tile, isChanging: true } : tile
        )
      );

      fadeTimeout = window.setTimeout(() => {
        setGalleryTiles((currentTiles) => {
          const currentTile = currentTiles[tileIndex];
          const nextTileImage = getRandomImage(images, currentTile?.image || "");

          return currentTiles.map((tile, index) =>
            index === tileIndex
              ? {
                  id: tile.id + collageTileCount,
                  image: nextTileImage,
                  isChanging: false,
                }
              : tile
          );
        });
      }, 220);

      nextSwapTimeout = window.setTimeout(swapTile, 160 + Math.random() * 360);
    };

    nextSwapTimeout = window.setTimeout(swapTile, 240);

    return () => {
      window.clearTimeout(fadeTimeout);
      window.clearTimeout(nextSwapTimeout);
    };
  }, [galleryTiles.length, images]);

  if (!images.length) {
    return null;
  }

  return (
    <>
      <section className="relative isolate overflow-hidden bg-[#050b14] px-5 py-8 sm:px-8 lg:px-10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_18%,rgba(31,115,190,0.22),transparent_28rem),linear-gradient(180deg,#08111f,#050b14)]" />
        <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-xl border border-white/18 bg-white/12 shadow-[0_26px_90px_rgba(0,0,0,0.42)] lg:grid-cols-[0.42fr_1fr]">
          <div className="bg-[linear-gradient(145deg,#08111f,#06101d)] p-6 sm:p-8">
            <p className="eyebrow">Portfolio</p>
            <h1 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-5xl font-black uppercase leading-[0.9] tracking-tight text-white sm:text-7xl">
              A living wall of work.
            </h1>
            <div className="mt-7 h-1 w-16 rounded-full bg-accent" />
            <p className="mt-7 text-sm leading-7 text-[#b9c7d6]">
              A rotating look through years of apparel, graphics, signs,
              banners, installs, and shop-floor moments from Hue Graphics.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-accent/35 bg-accent/10 px-4 py-2 text-xs font-black uppercase tracking-wide text-white transition hover:border-accent hover:bg-accent/18"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="relative min-h-[560px] overflow-hidden bg-[#020814]">
            <Image
              src={activeImage}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className={[
                "object-cover opacity-90 transition duration-700",
                isSwitching ? "scale-105 opacity-0" : "scale-100 opacity-90",
              ].join(" ")}
            />
            <Image
              src={nextImage}
              alt=""
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className={[
                "object-cover transition duration-700",
                isSwitching ? "scale-100 opacity-90" : "scale-95 opacity-0",
              ].join(" ")}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,8,20,0.76),transparent_42%,rgba(2,8,20,0.42)),linear-gradient(180deg,transparent_40%,rgba(2,8,20,0.72))]" />
            <div className="absolute inset-x-0 bottom-0 overflow-hidden border-t border-white/12 bg-[#06101d]/72 py-3 backdrop-blur-md">
              <div className="flex w-max animate-[portfolioRail_46s_linear_infinite] gap-3 px-3">
                {[...railImages, ...railImages].map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-white/14 bg-[#101b2c] sm:h-24 sm:w-24"
                  >
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover opacity-80"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute bottom-32 left-5 rounded-lg border border-white/16 bg-black/46 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-white backdrop-blur-md">
              Random archive slideshow
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#050b14] px-5 pb-8 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl auto-rows-[4.7rem] grid-cols-4 grid-flow-dense gap-px overflow-hidden rounded-xl border border-white/18 bg-white/12 shadow-[0_26px_90px_rgba(0,0,0,0.42)] sm:auto-rows-[5.6rem] sm:grid-cols-6 lg:auto-rows-[6rem] lg:grid-cols-8 xl:grid-cols-10">
          {galleryTiles.map((tile, index) => (
            <button
              key={`${tile.id}-${index}`}
              type="button"
              onClick={() => {
                setActiveImage(tile.image);
                setNextImage(tile.image);
                setIsSwitching(false);
              }}
              className={[
                "group relative overflow-hidden bg-[#101b2c] text-left",
                collageTileClasses[index % collageTileClasses.length],
              ].join(" ")}
            >
              <Image
                src={tile.image}
                alt=""
                fill
                sizes="(min-width: 1280px) 18vw, (min-width: 1024px) 22vw, (min-width: 640px) 28vw, 50vw"
                className={[
                  "object-cover transition duration-300 group-hover:scale-[1.04] group-hover:opacity-100",
                  tile.isChanging
                    ? "scale-95 opacity-0 blur-sm"
                    : "scale-100 opacity-[0.86] blur-0",
                ].join(" ")}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,rgba(5,11,20,0.34))] opacity-0 transition group-hover:opacity-100" />
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
