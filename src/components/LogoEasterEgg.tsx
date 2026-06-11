"use client";

import Image from "next/image";
import Link from "next/link";
import { MouseEvent, useRef, useState } from "react";

export function LogoEasterEgg() {
  const [isActive, setIsActive] = useState(false);
  const clickCount = useRef(0);
  const resetTimer = useRef<number | null>(null);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    clickCount.current += 1;

    if (resetTimer.current) {
      window.clearTimeout(resetTimer.current);
    }

    resetTimer.current = window.setTimeout(() => {
      clickCount.current = 0;
    }, 1400);

    if (clickCount.current >= 5) {
      event.preventDefault();
      clickCount.current = 0;
      setIsActive(true);
      window.setTimeout(() => setIsActive(false), 3600);
    }
  }

  return (
    <>
      <Link href="/" onClick={handleClick} className="flex items-center gap-3 text-white">
        <span className="grid h-14 w-14 place-items-center overflow-hidden rounded-xl border border-accent/45 bg-card p-1.5 shadow-glow sm:h-14 sm:w-14 lg:h-12 lg:w-12">
          <Image
            src="/images/logo.png"
            alt="Hue Graphics"
            width={80}
            height={80}
            priority
            className="h-full w-full object-contain"
          />
        </span>
        <span className="hidden text-base font-extrabold tracking-wide text-white sm:inline sm:text-lg">
          Hue Graphics
        </span>
      </Link>

      {isActive ? (
        <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden bg-[#020814]/18 backdrop-saturate-150">
          <div className="absolute inset-0 animate-[burnFlash_3.6s_ease-out_forwards] bg-[radial-gradient(circle_at_50%_42%,rgba(31,140,255,0.2),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />
          <div className="absolute left-1/2 top-1/2 h-64 w-[32rem] max-w-[86vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-accent/45 bg-[#06101d]/88 shadow-[0_28px_90px_rgba(31,115,190,0.28)] backdrop-blur-md">
            <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:34px_34px]" />
            <div className="absolute left-0 top-1/2 h-16 w-36 -translate-y-1/2 animate-[squeegeePass_1.2s_ease-in-out_3] rounded-r-lg bg-black/70 shadow-[0_0_42px_rgba(31,115,190,0.48)]" />
            <div className="absolute inset-x-10 top-20 h-16 animate-[inkReveal_3.2s_ease-out_forwards] rounded-lg bg-accent" />
            <div className="relative grid h-full place-items-center px-6 text-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-accent">
                  Build & Burn Mode Activated
                </p>
                <p className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-none text-white sm:text-5xl">
                  Ink is on press.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
