import { readdirSync } from "node:fs";
import path from "node:path";
import { WorkImageSlideshow } from "./WorkImageSlideshow";

type WorkItem = {
  id: string;
  title: string;
  category: string;
  imageFolder?: string;
  images: string[];
  permalink?: string;
};

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

function getPublicImageFolder(folder: string, fallback: string[]) {
  const folderPath = path.join(process.cwd(), "public", "images", folder);

  try {
    const images = readdirSync(folderPath)
      .filter((file) => imageExtensions.has(path.extname(file).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((file) => `/images/${folder}/${encodeURIComponent(file)}`);

    return images.length ? images : fallback;
  } catch {
    return fallback;
  }
}

function getRecentWorkProjects(): WorkItem[] {
  return [
    {
      id: "team-apparel",
      title: "Custom Printed Apparel",
      category: "Screen Printing",
      imageFolder: "screen-printing",
      images: getPublicImageFolder("screen-printing", [
        "/images/screen-print1.jpg",
        "/images/cpa.jpg",
      ]),
    },
    {
      id: "embroidered-gear",
      title: "Embroidered Gear",
      category: "Embroidery",
      imageFolder: "emb",
      images: getPublicImageFolder("emb", ["/images/emb.png"]),
    },
    {
      id: "vehicle-graphics",
      title: "Vehicle Graphics",
      category: "Fleet Branding",
      imageFolder: "vehicle-graphics",
      images: getPublicImageFolder("vehicle-graphics", ["/images/truck-2.png"]),
    },
    {
      id: "outdoor-banners",
      title: "Outdoor Banners",
      category: "Signs & Banners",
      images: ["/images/banners.png"],
    },
    {
      id: "transfer-prints",
      title: "Transfer Prints",
      category: "DTF Transfers",
      images: ["/images/dtf-main2.png"],
    },
    {
      id: "print-essentials",
      title: "Print Essentials",
      category: "Business Printing",
      images: ["/images/service-business-printing.png"],
    },
  ];
}

export function RecentWorkSection() {
  const recentWorkProjects = getRecentWorkProjects();

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
            A look at recent Hue Graphics projects from the shop floor. Follow
            along on Instagram to see more day-to-day work.
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
        <div className="grid gap-px bg-white/12 sm:grid-cols-2 xl:grid-cols-3">
          {recentWorkProjects.map((item) => {
            const content = (
              <>
                <div className="relative aspect-[1.42] overflow-hidden bg-[#101b2c]">
                  <WorkImageSlideshow
                    imageFolder={item.imageFolder}
                    images={item.images}
                  />
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
