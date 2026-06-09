"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export type SignProjectSlide = {
  src: string;
  category: "Banner" | "ACM Sign" | "Vinyl" | "Yard Sign" | "Vehicle Graphics";
  title: string;
  description: string;
};

type SignProjectShowcaseProps = {
  slides: SignProjectSlide[];
};

const rotationDelay = 4500;

export function SignProjectShowcase({ slides }: SignProjectShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeSlide = slides[activeIndex] ?? slides[0];
  const activeNumber = useMemo(
    () => String(activeIndex + 1).padStart(2, "0"),
    [activeIndex],
  );
  const totalNumber = useMemo(
    () => String(slides.length).padStart(2, "0"),
    [slides.length],
  );

  useEffect(() => {
    if (isPaused || slides.length < 2) {
      return;
    }

    const timer = window.setTimeout(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
    }, rotationDelay);

    return () => window.clearTimeout(timer);
  }, [activeIndex, isPaused, slides.length]);

  if (!activeSlide) {
    return null;
  }

  function showPrevious() {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? slides.length - 1 : currentIndex - 1,
    );
  }

  function showNext() {
    setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
  }

  return (
    <div
      className="overflow-hidden rounded-sm bg-[#07111f] shadow-[0_28px_80px_rgba(7,17,31,0.22)] ring-1 ring-black/10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="relative grid bg-[#07111f] lg:grid-cols-[1.18fr_0.82fr]">
        <div className="relative min-h-[390px] overflow-hidden bg-[#050912] sm:min-h-[560px] lg:min-h-[680px]">
          <Image
            key={activeSlide.src}
            src={activeSlide.src}
            alt={activeSlide.title}
            fill
            sizes="(min-width: 1024px) 56vw, 100vw"
            priority={activeIndex === 0}
            className="object-cover opacity-95 transition duration-700"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,9,18,0.76),rgba(5,9,18,0.16)_48%,rgba(5,9,18,0.78)),linear-gradient(180deg,rgba(5,9,18,0.04),rgba(5,9,18,0.82))]" />
          <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:64px_64px]" />
          <div className="absolute left-5 top-5 rounded-md border border-white/14 bg-black/36 px-3 py-2 text-[0.68rem] font-black uppercase tracking-[0.18em] text-white backdrop-blur-md sm:left-7 sm:top-7">
            Project {activeNumber} / {totalNumber}
          </div>
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-7 sm:left-7 sm:right-7">
            <div className="hidden max-w-md sm:block">
              <p className="inline-flex rounded-md bg-accent px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-white shadow-[0_0_24px_rgba(31,115,190,0.44)]">
                {activeSlide.category}
              </p>
              <h3 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-5xl font-black uppercase leading-[0.9] text-white">
                {activeSlide.title}
              </h3>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={showPrevious}
                aria-label="Previous sign project"
                className="flex h-12 w-12 items-center justify-center rounded-md border border-white/16 bg-black/44 text-xl font-black text-white shadow-[0_14px_34px_rgba(0,0,0,0.32)] backdrop-blur-md transition hover:border-accent hover:bg-accent"
              >
                <span aria-hidden="true">&lt;</span>
              </button>
              <button
                type="button"
                onClick={showNext}
                aria-label="Next sign project"
                className="flex h-12 w-12 items-center justify-center rounded-md border border-white/16 bg-black/44 text-xl font-black text-white shadow-[0_14px_34px_rgba(0,0,0,0.32)] backdrop-blur-md transition hover:border-accent hover:bg-accent"
              >
                <span aria-hidden="true">&gt;</span>
              </button>
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/10 bg-[#07111f] p-5 text-white lg:border-l lg:border-t-0 sm:p-7">
          <div className="absolute inset-y-0 left-0 hidden w-px bg-gradient-to-b from-transparent via-accent/70 to-transparent lg:block" />
          <p className="eyebrow text-accent">Project showcase</p>
          <p className="mt-5 inline-flex rounded-md border border-accent/35 bg-accent/12 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-accent">
            {activeSlide.category}
          </p>
          <h3 className="mt-5 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.92] text-white sm:text-5xl">
            {activeSlide.title}
          </h3>
          <p className="mt-5 text-sm font-bold leading-7 text-[#d6e3f0]">
            {activeSlide.description}
          </p>
          <div className="mt-7 h-1 overflow-hidden rounded-full bg-white/10">
            <div
              key={activeSlide.src}
              className={`h-full rounded-full bg-accent shadow-[0_0_20px_rgba(31,115,190,0.72)] ${
                isPaused ? "w-1/3" : "w-full transition-[width] duration-[4500ms] ease-linear"
              }`}
            />
          </div>
          <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-sm bg-white/10">
            {["Large format", "Indoor / outdoor", "Custom finishing", "Shop reviewed"].map(
              (item) => (
                <div key={item} className="bg-[#0d1a2d] px-4 py-3">
                  <p className="text-[0.68rem] font-black uppercase tracking-[0.15em] text-[#d6e3f0]">
                    {item}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#091525] p-4 sm:p-5">
        <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:thin]">
          {slides.map((slide, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={slide.src}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`group relative h-24 w-36 shrink-0 overflow-hidden rounded-md border bg-[#101b2c] text-left transition sm:h-28 sm:w-44 ${
                  isActive
                    ? "border-accent shadow-[0_0_0_1px_rgba(31,115,190,0.7),0_0_28px_rgba(31,115,190,0.36)]"
                    : "border-white/10 hover:border-accent/70"
                }`}
                aria-label={`Show ${slide.title}`}
              >
                <Image
                  src={slide.src}
                  alt=""
                  fill
                  sizes="176px"
                  className={`object-cover transition duration-500 group-hover:scale-105 ${
                    isActive ? "opacity-100" : "opacity-72"
                  }`}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_34%,rgba(5,9,18,0.82))]" />
                <p className="absolute bottom-2 left-2 right-2 truncate text-[0.68rem] font-black uppercase tracking-[0.12em] text-white">
                  {slide.title}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
