import { homeWorkImages } from "@/data/homeWorkImages.generated";
import { HomePhotoWall } from "./HomePhotoWall";

const fallbackImages = [
  "/images/screen-printing/cpa.jpg",
  "/images/emb/emb.png",
  "/images/vehicle-graphics/truck-graphics.jpg",
  "/images/sign-banners/signs1.jpg",
  "/images/dtf/dtf-main2.png",
  "/images/service-business-printing.png",
];

export function RecentWorkSection() {
  return (
    <section id="work" className="bg-[#050b14] px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-xl border border-white/18 bg-white/12 shadow-[0_26px_90px_rgba(0,0,0,0.42)] lg:grid-cols-[0.38fr_1fr]">
        <div className="bg-[linear-gradient(145deg,#08111f,#06101d)] p-6 sm:p-8">
          <p className="eyebrow">Work through the years</p>
          <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-5xl">
            Real projects. Real results.
          </h2>
          <div className="mt-7 h-1 w-16 rounded-full bg-accent" />
          <p className="mt-7 text-sm leading-7 text-[#b9c7d6]">
            A look back at years of Hue Graphics projects from the shop floor,
            job sites, and finished installs. For the newest work, follow along
            on Instagram.
          </p>
          <a
            href="https://www.instagram.com/huegpx"
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex whitespace-nowrap rounded-lg bg-accent px-6 py-3 text-sm font-black uppercase tracking-wide text-white shadow-[0_18px_36px_rgba(31,115,190,0.28)] transition hover:bg-[#2a86d8]"
          >
            Follow on Instagram
          </a>
        </div>
        <HomePhotoWall images={homeWorkImages} fallbackImages={fallbackImages} />
      </div>
    </section>
  );
}
