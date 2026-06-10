"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const dismissedStorageKey = "hue-new-website-announcement-dismissed";

export function WebsiteAnnouncementBanner() {
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    setIsDismissed(window.localStorage.getItem(dismissedStorageKey) === "true");
  }, []);

  function dismissBanner() {
    window.localStorage.setItem(dismissedStorageKey, "true");
    setIsDismissed(true);
  }

  if (isDismissed) {
    return null;
  }

  return (
    <section
      aria-label="Website announcement"
      className="border-b border-[#b9d9f4] bg-[#eaf5ff] px-4 py-4 text-[#07111f] sm:px-8 lg:px-10"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 rounded-sm border border-[#b9d9f4] bg-white p-4 shadow-[0_16px_42px_rgba(7,17,31,0.08)] sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
            Welcome to the new Hue Graphics website
          </p>
          <p className="mt-2 max-w-4xl text-sm font-bold leading-6 text-[#314154] sm:text-base sm:leading-7">
            We added a new apparel catalog, quote basket, live estimates, and
            easier quote requests so you can build projects faster and send us
            better details from the start.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:shrink-0">
          <Link
            href="/request-a-quote"
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-5 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:bg-[#2a86d8]"
          >
            Start a Quote
          </Link>
          <Link
            href="/custom-catalog"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#9eb4c6] px-5 text-sm font-black uppercase tracking-[0.08em] text-[#07111f] transition hover:border-accent hover:text-accent"
          >
            Browse Catalog
          </Link>
          <button
            type="button"
            onClick={dismissBanner}
            aria-label="Dismiss website announcement"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-transparent px-4 text-sm font-black uppercase tracking-[0.08em] text-[#607184] transition hover:border-[#b9c9d8] hover:text-[#07111f]"
          >
            Dismiss
          </button>
        </div>
      </div>
    </section>
  );
}
