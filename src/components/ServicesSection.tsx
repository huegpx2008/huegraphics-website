"use client";

import Image from "next/image";
import { useState } from "react";

const productionVideos = ["/images/video-1.mp4", "/images/video-2.mp4"];

const services = [
  {
    title: "Screen Printing",
    description: "High-quality custom shirts, hoodies, team gear, and event apparel with a 24-piece minimum.",
    image: "/images/screen-print.png",
    icon: "SP",
  },
  {
    title: "Embroidery",
    description: "Polished stitching for polos, hats, jackets, uniforms, and premium branded apparel.",
    image: "/images/emb.png",
    icon: "EM",
  },
  {
    title: "DTF Transfers",
    description: "Vibrant full-color transfers for flexible runs, detailed artwork, and fast repeat orders.",
    image: "/images/dtf-main2.png",
    icon: "DTF",
  },
  {
    title: "Signs & Banners",
    description: "Indoor and outdoor signs, banners, decals, yard signs, and storefront graphics.",
    image: "/images/banners.png",
    icon: "SG",
  },
  {
    title: "Vehicle Graphics",
    description: "Turn fleet vehicles, trailers, and work trucks into clean mobile brand impressions.",
    image: "/images/truck-2.png",
    icon: "VG",
  },
  {
    title: "Business Printing",
    description: "Business cards, postcards, forms, stickers, and everyday print pieces for your team.",
    image: "/images/service-business-printing.png",
    icon: "BP",
  },
];

export function ServicesSection() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  return (
    <section id="services" className="bg-[#050b14] px-5 pb-8 pt-0 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-xl border border-white/18 bg-[linear-gradient(135deg,rgba(8,17,31,0.98),rgba(10,23,39,0.92))] shadow-[0_26px_90px_rgba(0,0,0,0.45)]">
        <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-9 lg:py-10">
          <div>
            <p className="eyebrow">What we do</p>
            <h2 className="mt-4 max-w-xl font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.92] tracking-tight text-white sm:text-5xl">
              Complete solutions. In-house.
            </h2>
          </div>
          <div className="max-w-2xl lg:justify-self-end">
            <p className="text-base leading-7 text-white/76">
              From one shirt to thousands, Hue Graphics helps businesses,
              schools, teams, and organizations stand out with durable apparel,
              signs, vehicle graphics, and business print essentials.
            </p>
            <a
              href="#contact"
              className="mt-5 inline-flex text-sm font-black uppercase tracking-wide text-accent transition hover:text-white"
            >
              View all services -&gt;
            </a>
          </div>
        </div>

        <div className="grid gap-px bg-white/12 p-px lg:grid-cols-[0.72fr_1.28fr]">
          <div className="bg-[#08111f] p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-accent">
              In motion
            </p>
            <h3 className="mt-4 max-w-md text-3xl font-black uppercase leading-[0.96] text-white sm:text-4xl">
              Production you can see.
            </h3>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#b9c7d6]">
              A quick look at the equipment, lighting, and hands-on process
              behind the finished work.
            </p>
          </div>
          <div className="relative min-h-[360px] overflow-hidden bg-[#020814] sm:min-h-[440px] lg:min-h-[520px]">
            <video
              key={productionVideos[activeVideoIndex]}
              className="absolute inset-0 h-full w-full scale-105 object-cover object-center opacity-80 mix-blend-screen brightness-75 contrast-125 saturate-150"
              src={productionVideos[activeVideoIndex]}
              autoPlay
              muted
              playsInline
              preload="metadata"
              onEnded={() =>
                setActiveVideoIndex((current) => (current + 1) % productionVideos.length)
              }
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(31,140,255,0.34),transparent_38%),linear-gradient(90deg,rgba(2,8,20,0.84),rgba(4,16,34,0.24)_48%,rgba(2,8,20,0.86)),linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.72))]" />
            <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:52px_52px]" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/80 to-transparent" />
            <div className="absolute bottom-5 left-5 rounded-lg border border-white/16 bg-black/44 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-white backdrop-blur-md">
              Shop floor preview
            </div>
          </div>
        </div>

        <div className="grid gap-px bg-white/12 p-px sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {services.map((service) => (
            <article key={service.title} className="group bg-[#08111f]">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#101b2c]">
                <Image
                  src={service.image}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 16vw, (min-width: 1024px) 33vw, 50vw"
                  className="object-cover opacity-82 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(8,17,31,0.94)_100%)]" />
              </div>
              <div className="relative p-5">
                <div className="-mt-12 mb-5 grid h-12 w-12 place-items-center rounded-full border border-accent/70 bg-[#06101d] text-xs font-black text-accent shadow-[0_0_24px_rgba(31,115,190,0.32)]">
                  {service.icon}
                </div>
                <h3 className="text-base font-black uppercase tracking-wide text-white">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#b9c7d6]">
                  {service.description}
                </p>
                <a
                  href="#contact"
                  aria-label={`Request a quote for ${service.title}`}
                  className="mt-5 inline-flex text-lg font-black text-accent transition group-hover:translate-x-1 group-hover:text-white"
                >
                  -&gt;
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
