"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const heroSlides = [
  {
    service: "SCREEN PRINTING",
    image: "/images/press-h.png",
    alt: "Screen printing press on the Hue Graphics production floor",
    position: "object-[66%_30%]",
  },
  {
    service: "EMBROIDERY",
    image: "/images/emb.png",
    alt: "Embroidery production at Hue Graphics",
    position: "object-[74%_center]",
  },
  {
    service: "DTF TRANSFERS",
    image: "/images/dtf-main2.png",
    alt: "DTF printing production at Hue Graphics",
    position: "object-[58%_center]",
  },
  {
    service: "SIGNS & BANNERS",
    image: "/images/banners.png",
    alt: "Signs and banners produced by Hue Graphics",
    position: "object-[58%_center]",
  },
  {
    service: "VEHICLE GRAPHICS",
    image: "/images/truck-2.png",
    alt: "Wrapped truck with Hue Graphics vehicle graphics",
    position: "object-[62%_center]",
  },
  {
    service: "FULL SERVICE",
    image: "/images/store-2.png",
    alt: "Hue Graphics storefront in Bethlehem, Georgia",
    position: "object-[72%_center]",
  },
];

const serviceLabels = [
  "SCREEN PRINTING",
  "EMBROIDERY",
  "DTF TRANSFERS",
  "SIGNS & BANNERS",
  "VEHICLE GRAPHICS",
];

export function HomeHeroRotator() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [headlineStep, setHeadlineStep] = useState(0);
  const activeService = heroSlides[activeIndex].service;
  const isStorefrontSlide = activeService === "FULL SERVICE";

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length);
    }, 5200);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const timers = [300, 1050, 1800, 2550, 3450, 4850].map((delay, index) =>
      window.setTimeout(() => setHeadlineStep(index), delay),
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  function headlineWordClass(index: number) {
    return [
      "inline-block origin-center transition duration-300 ease-out",
      headlineStep === index
        ? "scale-[1.075] text-accent drop-shadow-[0_0_22px_rgba(31,115,190,0.55)]"
        : "scale-100 text-white",
    ].join(" ");
  }

  return (
    <section className="relative isolate overflow-hidden bg-[#05070b]">
      <div className="absolute inset-0 z-0 bg-[#05070b]">
        {heroSlides.map((slide, index) => {
          const isActive = index === activeIndex;

          return (
            <Image
              key={slide.image}
              src={slide.image}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className={[
                "hero-slide object-cover opacity-0 grayscale-[0.12]",
                slide.position,
                isActive ? "hero-slide-active" : "",
              ].join(" ")}
            />
          );
        })}
      </div>
      <div className="absolute inset-0 z-10 bg-[linear-gradient(90deg,#05070b_0%,rgba(5,7,11,0.94)_28%,rgba(5,7,11,0.62)_58%,rgba(5,7,11,0.25)_100%)]" />
      <div className="absolute inset-0 z-20 bg-[linear-gradient(180deg,rgba(5,7,11,0)_0%,rgba(5,7,11,0.06)_70%,#f4f8fc_100%)]" />

      <div className="relative z-30 mx-auto grid min-h-[620px] max-w-7xl items-center px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <div className="max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#50a8ff] sm:text-sm">
            Custom apparel. Screen printing. Embroidery. Signs.
          </p>
          <h1
            aria-label="We don't just print. We build brands."
            className="mt-5 max-w-[52rem] font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-[2.1rem] font-black uppercase leading-[0.92] text-white sm:text-[4.15rem] lg:text-[5.35rem]"
          >
            <span aria-hidden="true" className="block">
              <span className={headlineWordClass(0)}>We</span>{" "}
              <span className={headlineWordClass(1)}>don&apos;t</span>{" "}
              <span className={headlineWordClass(2)}>just</span>
            </span>
            <span aria-hidden="true" className="block">
              <span className={headlineWordClass(3)}>Print.</span>{" "}
              <span
                className={[
                  "inline-block origin-center transition duration-300 ease-out",
                  headlineStep === 4
                    ? "scale-[1.06] text-accent drop-shadow-[0_0_28px_rgba(31,115,190,0.62)]"
                    : "scale-100 text-white",
                ].join(" ")}
              >
                We build
              </span>
            </span>
            <span
              aria-hidden="true"
              className={[
                "block origin-left transition duration-300 ease-out",
                headlineStep === 4
                  ? "scale-[1.06] text-accent drop-shadow-[0_0_28px_rgba(31,115,190,0.62)]"
                  : "scale-100 text-white",
              ].join(" ")}
            >
              Brands.
            </span>
          </h1>
          <div className="mt-5 flex max-w-4xl flex-wrap gap-2">
            {serviceLabels.map((service) => {
              const isActive = activeService === service;
              const shouldGlow = isActive || isStorefrontSlide;

              return (
                <span
                  key={service}
                  className={[
                    "rounded-md border px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.14em] backdrop-blur-sm transition duration-700 sm:text-xs",
                    shouldGlow
                      ? "border-accent bg-accent/18 text-white shadow-[0_0_26px_rgba(31,115,190,0.28)]"
                      : "border-white/18 bg-black/22 text-white/64",
                  ].join(" ")}
                >
                  {service}
                </span>
              );
            })}
          </div>
          <p className="mt-7 max-w-xl text-base font-semibold leading-8 text-white/86 sm:text-lg">
            Family-owned in Bethlehem, Georgia. Hue Graphics helps businesses,
            schools, churches, teams, and organizations turn ideas into apparel,
            graphics, signage, and print pieces people are proud to use.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/request-a-quote"
              className="inline-flex justify-center rounded-md bg-accent px-7 py-4 text-sm font-black uppercase text-white shadow-[0_18px_42px_rgba(31,115,190,0.34)] transition hover:-translate-y-0.5 hover:bg-[#2a86d8]"
            >
              Request a quote
            </Link>
            <Link
              href="/services"
              className="inline-flex justify-center rounded-md border border-white/44 bg-black/20 px-7 py-4 text-sm font-black uppercase text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-accent hover:bg-accent/12"
            >
              Our services
            </Link>
          </div>
          <a
            href="https://www.google.com/search?q=hue+graphics+reviews"
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex flex-wrap items-center gap-2 rounded-full bg-black/30 px-1.5 py-1.5 pr-4 text-sm font-bold text-white/90 backdrop-blur-sm transition hover:bg-black/44 hover:text-white sm:gap-3"
          >
            <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-white p-1">
              <Image
                src="/images/Google-logo.svg.png"
                alt="Google"
                fill
                sizes="32px"
                className="object-contain p-1"
              />
            </span>
            <span
              aria-label="5 stars"
              className="shrink-0 text-[22px] font-black leading-none tracking-[0.08em] text-[#ffd24a] drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)] sm:text-[24px]"
            >
              ★★★★★
            </span>
            <span className="whitespace-nowrap text-white/92">
              4.9 Stars · 118+ Google Reviews
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
