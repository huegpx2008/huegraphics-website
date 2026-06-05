import Image from "next/image";
import Link from "next/link";
import { homeWorkImages } from "@/data/homeWorkImages.generated";
import { ProductionVideoPlayer } from "@/components/ProductionVideoPlayer";
import { HomePhotoWall } from "@/components/HomePhotoWall";
import { workImagesByFolder } from "@/data/workImages.generated";

const trustItems = [
  {
    title: "Family owned",
    text: "Local, trusted, and built on relationships since 2013.",
    stat: "2013",
  },
  {
    title: "In-house production",
    text: "Print, stitch, transfer, cut, and finish under one roof.",
    stat: "One roof",
  },
  {
    title: "Fast communication",
    text: "Clear quotes, real proofs, and honest project guidance.",
    stat: "Real help",
  },
  {
    title: "NE Georgia focused",
    text: "Serving Bethlehem, Barrow County, and surrounding communities.",
    stat: "Local",
  },
];

const services = [
  {
    title: "Screen Printing",
    text: "Durable custom apparel for schools, teams, events, crews, and businesses.",
    image: "/images/screen-print.png",
    href: "/screen-printing",
  },
  {
    title: "Embroidery",
    text: "Polos, hats, jackets, uniforms, and stitched brand pieces with a polished finish.",
    image: "/images/emb.png",
    href: "/embroidery",
  },
  {
    title: "DTF Transfers",
    text: "Full-color graphics for flexible runs, detailed artwork, and repeat apparel orders.",
    image: "/images/dtf-main2.png",
    href: "/dtf-transfers",
  },
  {
    title: "Signs & Banners",
    text: "Yard signs, banners, storefront graphics, decals, and event signage.",
    image: "/images/banners.png",
    href: "/signs-banners",
  },
  {
    title: "Vehicle Graphics",
    text: "Clean lettering, decals, magnets, and commercial graphics for work vehicles.",
    image: "/images/truck-2.png",
    href: "/vehicle-graphics",
  },
  {
    title: "Business Printing",
    text: "Cards, forms, flyers, postcards, labels, and everyday branded print pieces.",
    image: "/images/service-business-printing.png",
    href: "/business-printing",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Quote",
    text: "Send the project details, files, quantities, and deadline so we can price the real job.",
  },
  {
    step: "02",
    title: "Proof",
    text: "We review artwork, ask practical questions, and send a proof before production begins.",
  },
  {
    step: "03",
    title: "Production",
    text: "Your order moves through the shop with the right method, materials, and quality checks.",
  },
  {
    step: "04",
    title: "Pickup or Delivery",
    text: "Finished work is packed, checked, and ready to help your brand show up professionally.",
  },
];

const timeline = [
  {
    year: "2008",
    title: "The first shop",
    text: "Hugh A. Morris opened Ham and Jam Creations in Winder, planting the seed for what Hue would become.",
  },
  {
    year: "2013",
    title: "Hue Graphics begins",
    text: "Hue Graphics & Apparel, LLC was founded in honor of Hugh and built around family, service, and hard work.",
  },
  {
    year: "2025",
    title: "Bethlehem expansion",
    text: "After years of growth in Auburn, Hue moved into a larger Bethlehem facility to serve customers better.",
  },
  {
    year: "Today",
    title: "Full-service production",
    text: "Apparel, signs, vehicle graphics, transfers, embroidery, and business printing now come together in one shop.",
  },
];

const customerGroups = [
  "Schools",
  "Teams",
  "Churches",
  "Contractors",
  "Local businesses",
  "City departments",
  "Events",
  "Organizations",
  "Restaurants",
  "Service fleets",
];

const apparelBrands = [
  "A4",
  "Allmade",
  "Bella+Canvas",
  "Brooks Brothers",
  "Bulwark",
  "Carhartt",
  "Champion",
  "Comfort Colors",
  "CornerStone",
  "Cotopaxi",
  "District",
  "Eddie Bauer",
  "Gildan",
  "Jerzees",
  "Mercer+Mettle",
  "New Era",
  "Next Level Apparel",
  "Nike",
  "OGIO",
  "Outdoor Research",
  "Port & Company",
  "Port Authority",
  "Rabbit Skins",
  "Red Kap",
  "Richardson",
  "Russell Outdoors",
  "Spacecraft",
  "Sport-Tek",
  "Stanley/Stella",
  "tentree",
  "The North Face",
  "Tommy Bahama",
  "TravisMathew",
  "Volunteer Knitwear",
  "Wink",
];

const apparelBrandRows = [
  apparelBrands.slice(0, Math.ceil(apparelBrands.length / 2)),
  apparelBrands.slice(Math.ceil(apparelBrands.length / 2)),
];

const workFallbackImages = [
  "/images/screen-printing/cpa.jpg",
  "/images/emb/emb.png",
  "/images/vehicle-graphics/truck-graphics.jpg",
  "/images/sign-banners/signs1.jpg",
  "/images/dtf/dtf-main2.png",
  "/images/service-business-printing.png",
];

export function HomeV2Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#05070b]">
      <div className="absolute inset-0 -z-30 bg-[#05070b]">
        <Image
          src="/images/press-h.png"
          alt="Hue Graphics production press"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[66%_center] opacity-78 grayscale-[0.18]"
        />
      </div>
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,#05070b_0%,rgba(5,7,11,0.94)_28%,rgba(5,7,11,0.62)_58%,rgba(5,7,11,0.25)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,7,11,0)_0%,rgba(5,7,11,0.12)_56%,#f4f8fc_100%)]" />

      <div className="mx-auto grid min-h-[520px] max-w-7xl items-center px-4 py-12 sm:min-h-[620px] sm:px-8 sm:py-14 lg:px-10 lg:py-20">
        <div className="max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#50a8ff] sm:text-sm">
            Custom apparel. Screen printing. Embroidery. Signs.
          </p>
          <h1 className="mt-4 max-w-3xl font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-[2.75rem] font-black uppercase leading-[0.88] text-white sm:mt-5 sm:text-6xl lg:text-7xl">
            We don&apos;t just print. We build brands.
          </h1>
          <p className="mt-5 max-w-xl text-base font-semibold leading-7 text-white/86 sm:mt-7 sm:text-lg sm:leading-8">
            Family-owned in Bethlehem, Georgia. Hue Graphics helps businesses,
            schools, churches, teams, and organizations turn ideas into apparel,
            graphics, signage, and print pieces people are proud to use.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row">
            <Link
              href="/request-a-quote"
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-accent px-7 text-sm font-black uppercase text-white shadow-[0_18px_42px_rgba(31,115,190,0.34)] transition hover:-translate-y-0.5 hover:bg-[#2a86d8]"
            >
              Request a quote
            </Link>
            <Link
              href="/services"
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/44 bg-black/20 px-7 text-sm font-black uppercase text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-accent hover:bg-accent/12"
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

export function HomeV2TrustBar() {
  return (
    <section className="border-y border-black/10 bg-[#111922] px-5 py-7 text-white sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {trustItems.map((item) => (
          <article
            key={item.title}
            className="group border-l border-white/18 pl-5 transition hover:border-[#50a8ff]"
          >
            <p className="text-2xl font-black uppercase text-[#50a8ff]">
              {item.stat}
            </p>
            <h2 className="mt-2 text-sm font-black uppercase text-white">
              {item.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/68">{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function HomeV2BrandWall() {
  return (
    <section className="overflow-hidden bg-[#f7f8fa] px-5 py-16 text-[#07111f] sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-accent">
            Trusted brands we print on
          </p>
          <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-5xl font-black uppercase leading-[0.9] text-[#07111f] sm:text-6xl">
            Trusted Brands. Quality Products.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#5d6875]">
            Access to hundreds of premium apparel styles from the industry&apos;s
            most trusted manufacturers.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-7 lg:hidden">
          {apparelBrands.map((brand) => (
            <span
              key={brand}
              className="text-center text-sm font-black uppercase tracking-[0.12em] text-[#8a949f] transition hover:-translate-y-0.5 hover:text-accent"
            >
              {brand}
            </span>
          ))}
        </div>

        <div className="relative mt-14 hidden lg:block">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[#f7f8fa] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[#f7f8fa] to-transparent" />
          <div className="space-y-9">
            {apparelBrandRows.map((row, rowIndex) => (
              <div key={rowIndex} className="group flex overflow-hidden">
                <div
                  className={[
                    "flex min-w-max items-center gap-14 pr-14 [animation:brandMarquee_42s_linear_infinite] group-hover:[animation-play-state:paused]",
                    rowIndex === 1 ? "[animation-direction:reverse]" : "",
                  ].join(" ")}
                >
                  {[...row, ...row, ...row].map((brand, index) => (
                    <span
                      key={`${brand}-${index}`}
                      className="text-lg font-black uppercase tracking-[0.16em] text-[#8d98a3] opacity-72 transition hover:text-accent hover:opacity-100"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/custom-catalog"
            className="inline-flex rounded-md bg-[#07111f] px-7 py-4 text-sm font-black uppercase text-white shadow-[0_18px_48px_rgba(7,17,31,0.16)] transition hover:-translate-y-0.5 hover:bg-accent"
          >
            Browse our custom catalog
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HomeV2ProductionVideo({
  showIntro = false,
}: {
  showIntro?: boolean;
}) {
  return (
    <section className={`bg-[#07111f] px-5 pb-8 text-white sm:px-8 lg:px-10 ${showIntro ? "pt-16 lg:pt-24" : ""}`}>
      {showIntro ? (
        <div className="mx-auto grid max-w-7xl gap-8 pb-10 lg:grid-cols-[0.42fr_0.58fr] lg:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-accent">
              What we do
            </p>
            <h2 className="mt-4 max-w-xl font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-5xl font-black uppercase leading-[0.88] text-white sm:text-6xl">
              Complete solutions. In-house.
            </h2>
          </div>
          <div className="max-w-2xl lg:pt-1">
            <p className="text-base font-semibold leading-8 text-white/78">
              From one shirt to thousands, Hue Graphics helps businesses,
              schools, churches, teams, and organizations in Bethlehem, Barrow
              County, Auburn, Winder, and Northeast Georgia stand out with
              durable apparel, signs, vehicle graphics, and business print
              essentials.
            </p>
            <Link
              href="/services"
              className="mt-6 inline-flex text-sm font-black uppercase tracking-[0.06em] text-[#50a8ff] transition hover:text-white"
            >
              View all services -&gt;
            </Link>
          </div>
        </div>
      ) : null}
      <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-sm bg-white/14 shadow-[0_24px_70px_rgba(0,0,0,0.28)] ring-1 ring-white/16 lg:grid-cols-[360px_minmax(0,1fr)] xl:grid-cols-[420px_minmax(0,1fr)]">
        <div className="bg-[#08111f] p-6 text-white sm:p-8 lg:p-10">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-accent">
            In motion
          </p>
          <h2 className="mt-4 max-w-md font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.92] text-white sm:text-5xl">
            Production you can see.
          </h2>
          <p className="mt-6 max-w-md text-sm leading-7 text-[#b9c7d6]">
            A quick look at the equipment, lighting, and hands-on process
            behind the finished work.
          </p>
        </div>
        <div className="relative min-h-[380px] min-w-0 overflow-hidden bg-[#020814] sm:min-h-[480px] lg:min-h-[560px]">
          <ProductionVideoPlayer
            className="absolute inset-0 h-full w-full scale-105 object-cover object-center opacity-82 brightness-75 contrast-125 saturate-150"
            src="/images/video-1.mp4"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(31,140,255,0.24),transparent_38%),linear-gradient(90deg,rgba(2,8,20,0.72),rgba(4,16,34,0.16)_48%,rgba(2,8,20,0.78)),linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.72))]" />
          <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:52px_52px]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/80 to-transparent" />
          <div className="absolute bottom-5 left-5 rounded-md border border-white/28 bg-black/44 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-white backdrop-blur-md">
            Shop floor preview
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeV2Services({
  showExploreLink = true,
}: {
  showExploreLink?: boolean;
}) {
  return (
    <section id="services" className="bg-[#07111f] px-5 py-16 text-white sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.34fr_1fr]">
        <div className="lg:pt-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-accent">
            What we do
          </p>
          <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-5xl font-black uppercase leading-[0.88] text-white sm:text-6xl">
            Complete custom print and graphics solutions.
          </h2>
          <p className="mt-6 text-base leading-8 text-white/72">
            One local production shop for apparel, signs, vehicle graphics,
            business printing, and the small details that make a brand feel
            finished.
          </p>
          {showExploreLink ? (
            <Link
              href="/services"
              className="mt-8 inline-flex rounded-md border-2 border-accent px-6 py-3 text-sm font-black uppercase text-[#50a8ff] transition hover:bg-accent hover:text-white"
            >
              Explore services
            </Link>
          ) : null}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              className="group overflow-hidden rounded-sm bg-white shadow-[0_18px_55px_rgba(7,17,31,0.12)] ring-1 ring-black/8 transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(31,115,190,0.22)]"
            >
              <div className="relative aspect-[1.06] overflow-hidden bg-[#101820]">
                <Image
                  src={service.image}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 20vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,rgba(0,0,0,0.82)_100%)]" />
                <p className="absolute bottom-4 left-4 right-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-2xl font-black uppercase text-white">
                  {service.title}
                </p>
              </div>
              <p className="p-5 text-sm leading-6 text-[#35475a]">
                {service.text}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeV2StoryStats() {
  return (
    <section className="bg-white px-5 py-16 text-[#07111f] sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="relative min-h-[420px] overflow-hidden rounded-sm bg-[#dbe7f2] shadow-[0_24px_70px_rgba(7,17,31,0.16)]">
          <Image
            src="/images/store-2.png"
            alt="Hue Graphics Bethlehem storefront"
            fill
            sizes="(min-width: 1024px) 54vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(5,9,14,0.78))] p-6 text-white">
            <p className="text-sm font-black uppercase">741 Harry McCarty Rd, Suite 101</p>
            <p className="mt-1 text-sm text-white/74">Bethlehem, Georgia</p>
          </div>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-accent">
            Our story
          </p>
          <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-5xl font-black uppercase leading-[0.88] text-[#07111f] sm:text-6xl">
            Family owned. Locally trusted. Built on hard work.
          </h2>
          <p className="mt-6 text-base leading-8 text-[#314154]">
            Hue Graphics grew from a family dream into a full-service production
            shop serving Northeast Georgia. We are proud of the roots, the move
            from Auburn to Bethlehem, and the customers who have become friends
            along the way.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ["13+", "years in business"],
              ["1000+", "customers helped"],
              ["250K+", "items printed"],
            ].map(([stat, label]) => (
              <div key={stat} className="border-l-2 border-accent pl-4">
                <p className="text-4xl font-black text-[#07111f]">{stat}</p>
                <p className="mt-1 text-xs font-black uppercase text-[#536273]">
                  {label}
                </p>
              </div>
            ))}
          </div>
          <Link
            href="/about"
            className="mt-9 inline-flex rounded-md bg-[#07111f] px-7 py-4 text-sm font-black uppercase text-white transition hover:bg-accent"
          >
            Read the full story
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HomeV2FeaturedWork() {
  return (
    <section id="work" className="bg-white px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-sm bg-[#07111f] shadow-[0_28px_80px_rgba(7,17,31,0.18)] ring-1 ring-black/10 lg:grid-cols-[0.34fr_1fr]">
        <div className="bg-[linear-gradient(145deg,#08111f,#06101d)] p-7 text-white sm:p-9 lg:p-10">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#50a8ff]">
            Work through the years
          </p>
          <h2 className="mt-5 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-5xl font-black uppercase leading-[0.88] text-white sm:text-6xl">
            Real projects. Real results.
          </h2>
          <div className="mt-8 h-1 w-16 rounded-full bg-accent" />
          <p className="mt-8 text-sm leading-7 text-[#b9c7d6]">
            A look back at years of Hue Graphics projects from the shop floor,
            job sites, and finished installs. For the newest work, follow along
            on Instagram.
          </p>
          <div className="mt-9 flex flex-col gap-3">
            <Link
              href="/portfolio"
              className="inline-flex justify-center rounded-md border border-white/28 px-6 py-3 text-sm font-black uppercase text-white transition hover:border-accent hover:bg-accent/12"
            >
              View portfolio
            </Link>
            <a
              href="https://www.instagram.com/huegpx"
              target="_blank"
              rel="noreferrer"
              className="inline-flex justify-center rounded-md bg-accent px-6 py-3 text-sm font-black uppercase text-white shadow-[0_18px_36px_rgba(31,115,190,0.28)] transition hover:bg-[#2a86d8]"
            >
              Follow on Instagram
            </a>
          </div>
        </div>
        <HomePhotoWall
          images={homeWorkImages}
          fallbackImages={workFallbackImages}
        />
      </div>
    </section>
  );
}

export function HomeV2Process() {
  return (
    <section className="bg-[#f4f8fc] px-5 py-16 text-[#07111f] sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-accent">
            How it works
          </p>
          <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-5xl font-black uppercase leading-[0.88] sm:text-6xl">
            A clear path from idea to finished order.
          </h2>
        </div>
        <div className="mt-10 grid gap-px overflow-hidden rounded-sm bg-[#c9d7e6] md:grid-cols-4">
          {processSteps.map((step) => (
            <article key={step.step} className="bg-white p-6 sm:p-8">
              <p className="text-5xl font-black text-accent">{step.step}</p>
              <h3 className="mt-6 text-xl font-black uppercase text-[#07111f]">
                {step.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-[#3d4e60]">
                {step.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeV2Timeline() {
  return (
    <section className="bg-white px-5 py-16 text-[#07111f] sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.34fr_1fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-accent">
            From Winder to Bethlehem
          </p>
          <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-5xl font-black uppercase leading-[0.88] sm:text-6xl">
            The Hue timeline.
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {timeline.map((item) => (
            <article
              key={item.year}
              className="border-l-4 border-accent bg-[#f4f8fc] p-6 shadow-[0_16px_42px_rgba(7,17,31,0.08)]"
            >
              <p className="text-sm font-black uppercase tracking-[0.18em] text-accent">
                {item.year}
              </p>
              <h3 className="mt-3 text-xl font-black uppercase">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#3d4e60]">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeV2CustomerWall() {
  return (
    <section className="bg-[#0a0f16] px-5 py-14 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl text-center">
        <p className="font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-none sm:text-5xl">
          Serving businesses, teams, and organizations.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {customerGroups.map((group) => (
            <span
              key={group}
              className="rounded-full border border-white/14 bg-white/[0.04] px-4 py-2 text-xs font-black uppercase text-white/78 transition hover:border-accent hover:text-white"
            >
              {group}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
