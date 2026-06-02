"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type WorkItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  permalink?: string;
  isExternal?: boolean;
};

const fallbackProjects: WorkItem[] = [
  {
    id: "team-apparel",
    title: "Team Apparel",
    category: "Screen Printing",
    image: "/images/screen-print.png",
  },
  {
    id: "embroidered-gear",
    title: "Embroidered Gear",
    category: "Embroidery",
    image: "/images/emb.png",
  },
  {
    id: "vehicle-graphics",
    title: "Vehicle Graphics",
    category: "Fleet Branding",
    image: "/images/truck-2.png",
  },
  {
    id: "outdoor-banners",
    title: "Outdoor Banners",
    category: "Signs & Banners",
    image: "/images/banners.png",
  },
  {
    id: "transfer-prints",
    title: "Transfer Prints",
    category: "DTF Transfers",
    image: "/images/service-dtf-transfers.png",
  },
  {
    id: "print-essentials",
    title: "Print Essentials",
    category: "Business Printing",
    image: "/images/service-business-printing.png",
  },
];

function InstagramImage({ item }: { item: WorkItem }) {
  if (item.isExternal) {
    return (
      <img
        src={item.image}
        alt=""
        className="h-full w-full object-cover opacity-86 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
      />
    );
  }

  return (
    <Image
      src={item.image}
      alt=""
      fill
      sizes="(min-width: 1280px) 20vw, (min-width: 768px) 50vw, 100vw"
      className="object-cover opacity-86 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
    />
  );
}

export function RecentWorkSection() {
  const [items, setItems] = useState<WorkItem[]>(fallbackProjects);
  const [usesInstagram, setUsesInstagram] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadInstagramFeed() {
      try {
        const response = await fetch("/api/instagram");
        if (!response.ok) return;

        const payload = (await response.json()) as {
          configured?: boolean;
          items?: Array<Omit<WorkItem, "isExternal">>;
        };

        if (!cancelled && payload.items?.length) {
          setItems(
            payload.items.map((item) => ({
              ...item,
              isExternal: true,
            }))
          );
          setUsesInstagram(Boolean(payload.configured));
        }
      } catch {
        // Keep curated fallback projects when Instagram is unavailable.
      }
    }

    loadInstagramFeed();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="work" className="bg-[#050b14] px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-xl border border-white/18 bg-white/12 shadow-[0_26px_90px_rgba(0,0,0,0.42)] lg:grid-cols-[0.38fr_1fr]">
        <div className="bg-[linear-gradient(145deg,#08111f,#06101d)] p-6 sm:p-8">
          <p className="eyebrow">Our recent work</p>
          <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-5xl">
            Real projects. Real results.
          </h2>
          <div className="mt-7 h-1 w-16 rounded-full bg-accent" />
          <p className="mt-7 text-sm leading-7 text-[#b9c7d6]">
            {usesInstagram
              ? "Latest project photos pulled from Instagram, with the same polished layout and quick access to the original posts."
              : "A curated project grid is shown now. Add the Instagram token and this section will automatically pull recent posts."}
          </p>
          <a
            href="https://www.instagram.com/huegraphics/"
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex rounded-lg bg-accent px-6 py-3 text-sm font-black uppercase tracking-wide text-white shadow-[0_18px_36px_rgba(31,115,190,0.28)] transition hover:bg-[#2a86d8]"
          >
            View on Instagram -&gt;
          </a>
        </div>
        <div className="grid gap-px bg-white/12 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const content = (
              <>
                <div className="relative aspect-[1.42] overflow-hidden bg-[#101b2c]">
                  <InstagramImage item={item} />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,rgba(8,17,31,0.92)_100%)]" />
                </div>
                <div className="p-5">
                  <h3 className="line-clamp-2 text-base font-black uppercase tracking-wide text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-[#b9c7d6]">{item.category}</p>
                </div>
              </>
            );

            if (item.permalink) {
              return (
                <a
                  key={item.id}
                  href={item.permalink}
                  target="_blank"
                  rel="noreferrer"
                  className="group bg-[#08111f]"
                >
                  {content}
                </a>
              );
            }

            return (
              <article key={item.id} className="group bg-[#08111f]">
                {content}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
