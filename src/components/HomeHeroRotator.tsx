"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const heroSlides = [
  {
    service: "SCREEN PRINTING",
    image: "/images/press-h.png",
    alt: "Screen printing press on the Hue Graphics production floor",
    position: "object-[62%_30%] sm:object-[64%_30%]",
  },
  {
    service: "EMBROIDERY",
    image: "/images/emb.png",
    alt: "Embroidery production at Hue Graphics",
    position: "object-[66%_center] sm:object-[70%_center]",
  },
  {
    service: "DTF TRANSFERS",
    image: "/images/dtf-main2.png",
    alt: "DTF printing production at Hue Graphics",
    position: "object-[54%_center] sm:object-[56%_center]",
  },
  {
    service: "SIGNS & BANNERS",
    image: "/images/banners.png",
    alt: "Signs and banners produced by Hue Graphics",
    position: "object-[54%_center] sm:object-[56%_center]",
  },
  {
    service: "VEHICLE GRAPHICS",
    image: "/images/truck-2.png",
    alt: "Wrapped truck with Hue Graphics vehicle graphics",
    position: "object-[58%_center] sm:object-[60%_center]",
  },
  {
    service: "FULL SERVICE",
    image: "/images/store-2.png",
    alt: "Hue Graphics storefront in Bethlehem, Georgia",
    position: "object-[66%_center] sm:object-[70%_center]",
  },
];

const mobileHeroSlides = [
  {
    image: "/images/hero frame.png",
    alt: "Hue Graphics screen printing frame with fresh blue ink",
    position: "object-center",
  },
  ...heroSlides.slice(0, 5).map((slide) => ({
    image: slide.image,
    alt: slide.alt,
    position: slide.position,
  })),
];

const serviceLabels = [
  { label: "SCREEN PRINTING", href: "/screen-printing" },
  { label: "EMBROIDERY", href: "/embroidery" },
  { label: "DTF TRANSFERS", href: "/dtf-transfers" },
  { label: "SIGNS & BANNERS", href: "/signs-banners" },
  { label: "VEHICLE GRAPHICS", href: "/vehicle-graphics" },
];

const mobileServiceButtons = [
  {
    label: "Screen Printing",
    href: "/screen-printing",
    image: "/images/screen print button.png",
  },
  {
    label: "Embroidery",
    href: "/embroidery",
    image: "/images/emb button.png",
  },
  {
    label: "DTF Transfers",
    href: "/dtf-transfers",
    image: "/images/dtf button.png",
  },
  {
    label: "Signs and Banners",
    href: "/signs-banners",
    image: "/images/signs button.png",
  },
  {
    label: "Vehicle Graphics",
    href: "/vehicle-graphics",
    image: "/images/vehicle button.png",
  },
];

export function HomeHeroRotator() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [headlineStep, setHeadlineStep] = useState(0);
  const activeService = heroSlides[activeIndex].service;
  const isStorefrontSlide = activeService === "FULL SERVICE";
  const mobileActiveIndex = activeIndex % mobileHeroSlides.length;

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
    <>
      <section className="relative isolate overflow-hidden bg-[#05070b] md:hidden">
      <div className="relative aspect-[1.12] overflow-hidden bg-[#03070d]">
        {mobileHeroSlides.map((slide, index) => (
          <Image
            key={slide.image}
            src={slide.image}
            alt={slide.alt}
            fill
            priority={index === 0}
            sizes="100vw"
            className={[
              "object-cover transition duration-700",
              slide.position,
              index === mobileActiveIndex
                ? "opacity-100"
                : "opacity-0",
            ].join(" ")}
          />
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_52%,rgba(3,8,15,0.7)_100%)]" />
        <button
          type="button"
          aria-label="Previous hero image"
          onClick={() =>
            setActiveIndex(
              (current) =>
                (current - 1 + mobileHeroSlides.length) %
                mobileHeroSlides.length,
            )
          }
          className="absolute left-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/80 bg-black/34 text-4xl font-light leading-none text-white shadow-[0_8px_24px_rgba(0,0,0,0.42)]"
        >
          {"<"}
        </button>
        <button
          type="button"
          aria-label="Next hero image"
          onClick={() =>
            setActiveIndex((current) => (current + 1) % mobileHeroSlides.length)
          }
          className="absolute right-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/80 bg-black/34 text-4xl font-light leading-none text-white shadow-[0_8px_24px_rgba(0,0,0,0.42)]"
        >
          {">"}
        </button>
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-black/26 px-3 py-2 backdrop-blur-sm">
          {mobileHeroSlides.map((slide, index) => (
            <button
              key={slide.image}
              type="button"
              aria-label={`Show hero image ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={[
                "h-3 w-3 rounded-full transition",
                index === mobileActiveIndex
                  ? "bg-accent"
                  : "bg-white/76",
              ].join(" ")}
            />
          ))}
        </div>
      </div>

      <div className="bg-[radial-gradient(circle_at_16%_8%,rgba(31,115,190,0.2),transparent_18rem),linear-gradient(180deg,#071522_0%,#020912_100%)] px-4 pb-8 pt-7 text-white min-[390px]:px-6">
        <p className="text-[0.76rem] font-black uppercase leading-7 tracking-[0.2em] text-[#50a8ff] min-[390px]:text-[0.8rem]">
          Custom apparel. Screen printing. Embroidery. Signs.
        </p>
        <h1 className="mt-6 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-[2.58rem] font-black uppercase leading-[0.94] tracking-normal text-white min-[390px]:text-[2.78rem]">
          We don&apos;t just print. We build brands.
        </h1>
        <p className="mt-7 text-base font-semibold leading-8 text-white/88 min-[390px]:text-[1.02rem]">
          Family-owned in Bethlehem, Georgia. Hue Graphics helps businesses,
          schools, churches, teams, and organizations turn ideas into apparel,
          graphics, signage, and print pieces people are proud to use.
        </p>
        <Link
          href="/request-a-quote"
          className="mt-8 inline-flex min-h-14 w-full items-center justify-center rounded-lg bg-accent px-7 text-base font-black uppercase tracking-wide text-white shadow-[0_18px_42px_rgba(31,115,190,0.34)] transition hover:bg-[#2a86d8]"
        >
          Request a quote <span className="ml-4 text-2xl leading-none">-&gt;</span>
        </Link>

        <div className="mt-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-accent/80" />
          <p className="text-center text-sm font-black uppercase tracking-[0.2em] text-[#50a8ff]">
            Explore our services
          </p>
          <div className="h-px flex-1 bg-accent/80" />
        </div>

        <div className="mt-5 grid grid-cols-5 gap-2">
          {mobileServiceButtons.map((service) => (
            <Link
              key={service.href}
              href={service.href}
              aria-label={service.label}
              className="relative aspect-[0.9] overflow-hidden rounded-lg border border-white/72 bg-black/20 shadow-[0_12px_24px_rgba(0,0,0,0.3)] transition hover:-translate-y-0.5 hover:border-accent"
            >
              <Image
                src={service.image}
                alt=""
                fill
                sizes="20vw"
                className="object-cover"
              />
            </Link>
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-lg bg-white shadow-[0_18px_38px_rgba(0,0,0,0.32)]">
          <Image
            src="/images/local quailty banner.png"
            alt="Local and reliable. Quality you can see."
            width={900}
            height={170}
            className="h-auto w-full"
          />
        </div>
      </div>
      </section>

      <section className="relative isolate hidden overflow-hidden bg-[#05070b] md:block">
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
      <div className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(5,7,11,0.94)_0%,rgba(5,7,11,0.78)_46%,rgba(5,7,11,0.38)_78%,rgba(5,7,11,0.16)_100%)] sm:bg-[linear-gradient(90deg,#05070b_0%,rgba(5,7,11,0.94)_28%,rgba(5,7,11,0.68)_55%,rgba(5,7,11,0.26)_100%)] lg:bg-[linear-gradient(90deg,#05070b_0%,rgba(5,7,11,0.96)_24%,rgba(5,7,11,0.74)_48%,rgba(5,7,11,0.34)_76%,rgba(5,7,11,0.16)_100%)]" />
      <div className="absolute inset-0 z-20 bg-[linear-gradient(180deg,rgba(5,7,11,0)_0%,rgba(5,7,11,0.02)_68%,#f4f8fc_100%)]" />

      <div className="relative z-30 mx-auto grid min-h-[620px] max-w-7xl items-center px-5 pb-36 pt-14 sm:px-8 sm:py-14 lg:px-10 lg:py-20">
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
              const isActive = activeService === service.label;
              const shouldGlow = isActive || isStorefrontSlide;

              return (
                <Link
                  key={service.label}
                  href={service.href}
                  className={[
                    "rounded-md border px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.14em] backdrop-blur-sm transition duration-700 sm:text-xs",
                    shouldGlow
                      ? "border-accent bg-accent/18 text-white shadow-[0_0_26px_rgba(31,115,190,0.28)]"
                      : "border-white/18 bg-black/22 text-white/64",
                  ].join(" ")}
                >
                  {service.label}
                </Link>
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
            className="mt-6 inline-grid w-full max-w-[22rem] grid-cols-[2.5rem_1fr] items-center gap-x-3 gap-y-1 rounded-full bg-black/36 p-2 pr-4 text-sm font-bold text-white/90 backdrop-blur-sm transition hover:bg-black/44 hover:text-white sm:inline-flex sm:max-w-none sm:flex-wrap sm:gap-3 sm:px-1.5 sm:py-1.5 sm:pr-4"
          >
            <span className="relative row-span-2 h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white p-1 sm:h-8 sm:w-8">
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
              className="shrink-0 text-[20px] font-black leading-none tracking-[0.08em] text-[#ffd24a] drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)] sm:text-[24px]"
            >
              ★★★★★
            </span>
            <span className="text-xs leading-tight text-white/92 sm:whitespace-nowrap sm:text-sm">
              4.9 Stars · 118+ Google Reviews
            </span>
          </a>
        </div>
      </div>
      </section>
    </>
  );
}
