"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const heroSlides = [
  {
    image: "/images/hero frame.png",
    alt: "Hue Graphics screen printing frame with fresh blue ink",
    position: "object-center",
  },
  {
    image: "/images/hero sign.png",
    alt: "Hue Graphics sign and banner project",
    position: "object-center",
  },
  {
    image: "/images/press-h.png",
    alt: "Screen printing press on the Hue Graphics production floor",
    position: "object-[62%_30%] sm:object-[64%_30%]",
  },
  {
    image: "/images/emb.png",
    alt: "Embroidery production at Hue Graphics",
    position: "object-[66%_center] sm:object-[70%_center]",
  },
  {
    image: "/images/dtf-main2.png",
    alt: "DTF printing production at Hue Graphics",
    position: "object-[54%_center] sm:object-[56%_center]",
  },
  {
    image: "/images/banners.png",
    alt: "Signs and banners produced by Hue Graphics",
    position: "object-[54%_center] sm:object-[56%_center]",
  },
  {
    image: "/images/truck-2.png",
    alt: "Wrapped truck with Hue Graphics vehicle graphics",
    position: "object-[58%_center] sm:object-[60%_center]",
  },
];

const serviceButtons = [
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
  const [wipeKey, setWipeKey] = useState(0);
  const slideTimer = useRef<number | null>(null);

  const advanceSlide = useCallback(
    (nextIndex: number) => {
      if (nextIndex === activeIndex) {
        return;
      }

      if (slideTimer.current) {
        window.clearTimeout(slideTimer.current);
      }

      setWipeKey((current) => current + 1);
      slideTimer.current = window.setTimeout(() => {
        setActiveIndex(nextIndex);
        slideTimer.current = null;
      }, 280);
    },
    [activeIndex],
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      advanceSlide((activeIndex + 1) % heroSlides.length);
    }, 5200);

    return () => window.clearInterval(interval);
  }, [activeIndex, advanceSlide]);

  useEffect(() => {
    const timers = [300, 1050, 1800, 2550, 3450].map((delay, index) =>
      window.setTimeout(() => setHeadlineStep(index), delay),
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  useEffect(() => {
    return () => {
      if (slideTimer.current) {
        window.clearTimeout(slideTimer.current);
      }
    };
  }, []);

  function showPreviousSlide() {
    advanceSlide((activeIndex - 1 + heroSlides.length) % heroSlides.length);
  }

  function showNextSlide() {
    advanceSlide((activeIndex + 1) % heroSlides.length);
  }

  function wordClass(index: number, stayBlue = false) {
    const isActive = headlineStep === index;
    const isFinalBlue = stayBlue && headlineStep >= 4;

    return [
      "inline-block origin-center transition duration-300 ease-out",
      isFinalBlue
        ? "scale-100 text-accent drop-shadow-[0_0_22px_rgba(31,115,190,0.48)]"
        : isActive
        ? "scale-[1.07] text-accent drop-shadow-[0_0_26px_rgba(31,115,190,0.58)]"
        : "scale-100 text-white",
    ].join(" ");
  }

  function HeroHeadline({ className }: { className: string }) {
    return (
      <h1
        aria-label="We don't just print. We build brands."
        className={className}
      >
        <span aria-hidden="true" className="block">
          <span className={wordClass(0)}>We</span>{" "}
          <span className={wordClass(1)}>don&apos;t</span>{" "}
          <span className={wordClass(2)}>just</span>
        </span>
        <span aria-hidden="true" className="block">
          <span className={wordClass(3)}>Print.</span>{" "}
          <span className={wordClass(4, true)}>We build</span>
        </span>
        <span aria-hidden="true" className={["block", wordClass(4, true)].join(" ")}>
          Brands.
        </span>
      </h1>
    );
  }

  function DesktopHeroHeadline({ className }: { className: string }) {
    return (
      <h1
        aria-label="We don't just print. We build brands."
        className={className}
      >
        <span aria-hidden="true" className="flex gap-x-[0.18em]">
          <span className={wordClass(0)}>We</span>{" "}
          <span className={wordClass(1)}>don&apos;t</span>
        </span>
        <span aria-hidden="true" className="flex gap-x-[0.18em]">
          <span className={wordClass(2)}>Just</span>{" "}
          <span className={wordClass(3)}>Print.</span>
        </span>
        <span aria-hidden="true" className="flex gap-x-[0.18em]">
          <span className={wordClass(4, true)}>We</span>{" "}
          <span className={wordClass(4, true)}>build</span>
        </span>
        <span aria-hidden="true" className="block">
          <span className={wordClass(4, true)}>brands.</span>
        </span>
      </h1>
    );
  }

  function HeroImages({
    className,
    imageClassName,
    arrowClassName,
    dotClassName,
    showArrows = true,
  }: {
    className: string;
    imageClassName: string;
    arrowClassName: string;
    dotClassName: string;
    showArrows?: boolean;
  }) {
    return (
      <div className={className}>
        {heroSlides.map((slide, index) => (
          <Image
            key={slide.image}
            src={slide.image}
            alt={slide.alt}
            fill
            priority={index === 0}
            sizes="100vw"
            className={[
              "transition-none",
              imageClassName,
              slide.position,
              index === activeIndex
                ? "opacity-100 saturate-125"
                : "opacity-0 saturate-125",
            ].join(" ")}
          />
        ))}
        {wipeKey > 0 ? (
          <div
            key={wipeKey}
            className="pointer-events-none absolute inset-0 animate-[heroInkCover_520ms_ease-in-out_both] bg-[#020912]"
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_52%,rgba(3,8,15,0.7)_100%)]" />
        {showArrows ? (
          <>
            <button
              type="button"
              aria-label="Previous hero image"
              onClick={showPreviousSlide}
              className={["left-4", arrowClassName].join(" ")}
            >
              {"<"}
            </button>
            <button
              type="button"
              aria-label="Next hero image"
              onClick={showNextSlide}
              className={["right-4", arrowClassName].join(" ")}
            >
              {">"}
            </button>
          </>
        ) : null}
        <div className={dotClassName}>
          {heroSlides.map((slide, index) => (
            <button
              key={slide.image}
              type="button"
              aria-label={`Show hero image ${index + 1}`}
              onClick={() => advanceSlide(index)}
              className={[
                "rounded-full transition",
                index === activeIndex ? "bg-accent" : "bg-white/76",
              ].join(" ")}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="relative isolate overflow-hidden bg-[#05070b] md:hidden">
        <HeroImages
          className="relative aspect-[1.12] overflow-hidden bg-[#03070d]"
          imageClassName="object-cover"
          arrowClassName="absolute top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/80 bg-black/34 text-4xl font-light leading-none text-white shadow-[0_8px_24px_rgba(0,0,0,0.42)]"
          dotClassName="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-black/26 px-3 py-2 backdrop-blur-sm [&>button]:h-3 [&>button]:w-3"
        />

        <div className="bg-[radial-gradient(circle_at_16%_8%,rgba(31,115,190,0.2),transparent_18rem),linear-gradient(180deg,#071522_0%,#020912_100%)] px-4 pb-8 pt-7 text-white min-[390px]:px-6">
          <p className="text-[0.76rem] font-black uppercase leading-7 tracking-[0.2em] text-[#50a8ff] min-[390px]:text-[0.8rem]">
            Custom apparel. Screen printing. Embroidery. Signs.
          </p>
          <HeroHeadline className="mt-6 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-[2.58rem] font-black uppercase leading-[0.94] tracking-normal text-white min-[390px]:text-[2.78rem]" />
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
            {serviceButtons.map((service) => (
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

      <section className="relative isolate hidden min-h-[620px] overflow-hidden bg-[radial-gradient(circle_at_20%_0%,rgba(31,115,190,0.2),transparent_32rem),linear-gradient(180deg,#071522_0%,#020912_100%)] text-white md:block">
        <div className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-[78%] bg-[radial-gradient(ellipse_at_center,rgba(31,115,190,0.18),transparent_66%)]" />
        <div className="absolute inset-x-0 top-14 z-0 mx-auto w-full max-w-7xl px-8 lg:px-10 xl:top-16">
          <div className="ml-auto w-[66vw] max-w-[980px] xl:w-[62vw] xl:max-w-[1040px] 2xl:w-[58vw] 2xl:max-w-[1090px]">
            <div className="relative overflow-hidden rounded-lg bg-black/24 shadow-[0_28px_90px_rgba(0,0,0,0.38)]">
              <HeroImages
                className="relative aspect-[16/9] min-h-[390px] overflow-hidden bg-[#03070d]"
                imageClassName="object-contain"
                arrowClassName=""
                dotClassName="absolute bottom-5 left-[58%] flex -translate-x-1/2 gap-3 rounded-full bg-black/30 px-4 py-2 backdrop-blur-sm [&>button]:h-3 [&>button]:w-3"
                showArrows={false}
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 w-[34%] bg-[linear-gradient(90deg,#06111e_0%,rgba(6,17,30,0.86)_24%,rgba(6,17,30,0.34)_68%,transparent_100%)]" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-[10%] bg-[linear-gradient(270deg,#020912_0%,transparent_100%)]" />
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto grid min-h-[620px] w-full max-w-7xl grid-rows-[1fr_auto] px-8 pb-8 pt-12 lg:px-10 lg:pt-14">
          <div className="max-w-[44rem] self-center pb-4">
              <p className="text-sm font-black uppercase leading-7 tracking-[0.24em] text-[#50a8ff]">
                Custom apparel. Screen printing. Embroidery. Signs.
              </p>
              <DesktopHeroHeadline className="mt-5 max-w-[48rem] font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-[4.25rem] font-black uppercase leading-[0.86] tracking-normal text-white xl:text-[5.05rem]" />
              <p className="mt-5 max-w-xl text-base font-semibold leading-7 text-white/86 xl:text-lg xl:leading-8">
                Family-owned in Bethlehem, Georgia. Hue Graphics helps
                businesses, schools, churches, teams, and organizations turn
                ideas into apparel, graphics, signage, and print pieces people
                are proud to use.
              </p>
              <Link
                href="/request-a-quote"
                className="mt-6 inline-flex min-h-14 items-center justify-center rounded-lg bg-accent px-10 text-base font-black uppercase tracking-wide text-white shadow-[0_18px_42px_rgba(31,115,190,0.34)] transition hover:-translate-y-0.5 hover:bg-[#2a86d8]"
              >
                Request a quote <span className="ml-4 text-2xl leading-none">-&gt;</span>
              </Link>
            </div>

          <div className="grid gap-5 lg:grid-cols-[0.5fr_0.5fr] lg:items-end">
            <div>
              <div className="flex max-w-xl items-center gap-4">
                <div className="h-px flex-1 bg-accent/80" />
                <p className="text-center text-sm font-black uppercase tracking-[0.2em] text-[#50a8ff]">
                  Explore our services
                </p>
                <div className="h-px flex-1 bg-accent/80" />
              </div>
              <div className="mt-5 grid max-w-2xl grid-cols-5 gap-3">
                {serviceButtons.map((service) => (
                  <Link
                    key={service.href}
                    href={service.href}
                    aria-label={service.label}
                    className="relative aspect-[0.9] overflow-hidden rounded-lg border border-white/70 bg-black/20 shadow-[0_16px_34px_rgba(0,0,0,0.32)] transition hover:-translate-y-1 hover:border-accent"
                  >
                    <Image
                      src={service.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 10vw, 18vw"
                      className="object-cover"
                    />
                  </Link>
                ))}
              </div>
            </div>
            <div className="overflow-hidden rounded-lg bg-white shadow-[0_18px_38px_rgba(0,0,0,0.32)]">
                <Image
                  src="/images/local quailty banner.png"
                  alt="Local and reliable. Quality you can see."
                  width={900}
                  height={170}
                  className="h-auto w-full"
                />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
