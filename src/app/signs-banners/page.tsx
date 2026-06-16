import Image from "next/image";
import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import {
  SignProjectShowcase,
  type SignProjectSlide,
} from "@/components/SignProjectShowcase";
import { SignQuoteBuilder } from "@/components/SignQuoteBuilder";
import { workImagesByFolder } from "@/data/workImages.generated";
import { getCloudinaryGalleryImagesByTag } from "@/lib/cloudinary-public-gallery";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Signs & Banners in Bethlehem, GA | Yard Signs, Decals & Displays",
  description:
    "Custom signs, banners, yard signs, decals, storefront graphics, and event signage for Bethlehem, Barrow County, Winder, Auburn, Monroe, Braselton, and Northeast Georgia.",
  path: "/signs-banners",
});

export const revalidate = 300;

const products = [
  "Vinyl banners",
  "Yard signs",
  "Real estate signs",
  "A-frame inserts",
  "Coroplast signs",
  "Aluminum signs",
  "Window decals",
  "Storefront graphics",
  "Event signage",
  "Graduation banners",
  "Directional signs",
  "Custom decals",
];

const signCategories = [
  {
    label: "Banners",
    detail: "Outdoor, indoor, event, school, sponsor, and graduation banners with common finishing options.",
    badge: "13oz",
  },
  {
    label: "Rigid signs",
    detail: "Coroplast, aluminum composite, PVC, foam board, and other panel signs for short-term or long-term use.",
    badge: "ACM",
  },
  {
    label: "Decals",
    detail: "Printed vinyl, contour-cut decals, labels, window decals, reflective graphics, and specialty stickers.",
    badge: "VINYL",
  },
  {
    label: "Displays",
    detail: "A-frame inserts, banner stands, directional signs, event displays, and job-site sign setups.",
    badge: "DISPLAY",
  },
  {
    label: "Storefronts",
    detail: "Door lettering, window graphics, hours, logos, wall graphics, and clean business identification.",
    badge: "SHOP",
  },
  {
    label: "Custom work",
    detail: "Special sizes, large quantities, odd shapes, repeat orders, and sign ideas that do not fit a preset.",
    badge: "CUSTOM",
  },
];

const materials = [
  "Indoor and outdoor vinyl",
  "Coroplast",
  "Aluminum composite",
  "Adhesive vinyl",
  "Banner stands and displays",
  "Sign stakes and hardware",
];

const applications = [
  "Businesses and storefronts",
  "Contractors and job sites",
  "Schools, sports, and boosters",
  "Churches and nonprofits",
  "Events, markets, and festivals",
  "Real estate and property management",
  "Graduation and senior celebrations",
  "Vehicle, trailer, and equipment decals",
];

const finishingOptions = [
  "Single-sided and double-sided printing",
  "Gloss, matte, and dry erase laminates",
  "Contour cutting and custom shapes",
  "Grommets, hems, pole pockets, and rope",
  "Standard, heavy-duty, and specialty stakes",
  "Reflective, removable, and low-tack vinyl options",
];

const materialBrands = [
  "3M",
  "ORAJET",
  "ORACAL",
  "Avery Dennison",
  "Arlon",
  "MaxMetal",
];

const featuredProjectSlides: SignProjectSlide[] = [
  {
    src: "/images/sign-banners/639531227_18569535229009873_1734010140289635921_n.jpg",
    category: "Banner",
    title: "Roadside Mesh Banners",
    description:
      "Large-format outdoor banners printed for high-visibility roadside promotion.",
  },
  {
    src: "/images/sign-banners/2026-06-03%2009.22.35.jpg",
    category: "ACM Sign",
    title: "Custom Shaped Panel",
    description:
      "Rigid sign panel with a custom profile, clean edge detail, and durable outdoor finish.",
  },
  {
    src: "/images/sign-banners/signs1.jpg",
    category: "Yard Sign",
    title: "Real Estate Frame Sign",
    description:
      "Readable property sign setup with interchangeable panels for open house promotion.",
  },
  {
    src: "/images/sign-banners/672444216_18584145094009873_5071688867988805225_n.jpg",
    category: "ACM Sign",
    title: "Hiring Site Sign",
    description:
      "Bold rigid-panel hiring sign designed for quick scanning and QR-code response.",
  },
  {
    src: "/images/sign-banners/618657266_18555735766009873_133435053101636559_n.jpg",
    category: "Vinyl",
    title: "Numbered Vinyl Sets",
    description:
      "Printed and cut vinyl sets prepared for organized installation and repeat use.",
  },
  {
    src: "/images/sign-banners/639985671_18569535244009873_4983119230006870802_n.jpg",
    category: "Banner",
    title: "Support Banner",
    description:
      "Finished banner with grommets for durable hanging at events, job sites, and community spaces.",
  },
  {
    src: "/images/sign-banners/645501324_18571217419009873_5145212769391887043_n.jpg",
    category: "Vinyl",
    title: "Printed Promo Surface",
    description:
      "Full-color vinyl-style branded surface produced with sharp detail and saturated color.",
  },
  {
    src: "/images/sign-banners/642470483_18571217428009873_4887144359931898686_n.jpg",
    category: "Vinyl",
    title: "Custom Decal Pieces",
    description:
      "Small-format printed pieces for branded giveaways, internal programs, and specialty projects.",
  },
];

const featuredProjectSources = new Set(
  featuredProjectSlides.map((slide) => slide.src),
);

const folderProjectSlides: SignProjectSlide[] = workImagesByFolder[
  "sign-banners"
]
  .filter((src) => !featuredProjectSources.has(src))
  .map((src, index) => ({
    src,
    category: "Signs & Banners",
    title: `Shop Sign Project ${String(index + 1).padStart(2, "0")}`,
    description:
      "Additional sign, banner, decal, or display work from the Hue Graphics production folder.",
  }));

const localProjectSlides: SignProjectSlide[] = [
  ...featuredProjectSlides,
  ...folderProjectSlides,
];

export default async function SignsBannersPage() {
  const cloudinaryProjectSlides: SignProjectSlide[] = (
    await getCloudinaryGalleryImagesByTag("signs-banners")
  ).map((image) => ({
    src: image.src,
    category: image.category,
    title: image.title,
    description:
      image.description ||
      "Recent sign, banner, decal, or display work uploaded from the Hue Graphics project library.",
  }));
  const projectSlides: SignProjectSlide[] = [
    ...cloudinaryProjectSlides,
    ...localProjectSlides,
  ];

  return (
    <>
      <Header />
      <main className="bg-[#f4f8fc]">
        <section className="relative isolate overflow-hidden px-4 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-24">
          <Image
            src="/images/banners.png"
            alt="Large format banner production at Hue Graphics"
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 -z-20 h-full w-full object-cover opacity-78"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,7,11,0.96),rgba(5,7,11,0.78)_42%,rgba(5,7,11,0.28)),linear-gradient(180deg,rgba(5,7,11,0.1),#f4f8fc)]" />
          <div className="mx-auto max-w-7xl">
            <p className="eyebrow">Signs & banners</p>
            <h1 className="mt-4 max-w-3xl font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-[2.9rem] font-black uppercase leading-[0.9] tracking-tight text-white sm:mt-5 sm:text-7xl">
              Clear signs for storefronts, events, schools, and job sites.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#d6e3f0] sm:mt-7 sm:text-lg sm:leading-8">
              From quick yard signs to durable outdoor banners and custom
              storefront graphics, Hue Graphics helps you get noticed with
              clean production, practical material recommendations, and options
              for jobs that do not fit a standard preset.
            </p>
            <Link
              href="/request-a-quote"
              className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-accent px-7 text-sm font-black uppercase tracking-wide text-white shadow-[0_18px_36px_rgba(31,115,190,0.34)] transition hover:bg-[#2a86d8] sm:mt-9 sm:w-auto"
            >
              Request custom sign quote -&gt;
            </Link>
          </div>
        </section>

        <section className="px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-sm bg-white p-6 shadow-[0_18px_55px_rgba(7,17,31,0.1)] ring-1 ring-black/10 sm:p-8">
              <p className="eyebrow">More than the presets</p>
              <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.95] text-[#07111f] sm:text-5xl">
                Use the estimator as a starting point, then let us review the real job.
              </h2>
              <p className="mt-6 text-sm leading-7 text-[#314154]">
                The instant prices are helpful for common signs, but signs are
                not always one-size-fits-all. Larger quantities, repeat runs,
                artwork layout, material yield, finishing, and installation
                details can all change how a job should be priced.
              </p>
              <p className="mt-4 text-sm leading-7 text-[#314154]">
                If the automatic estimate looks higher than expected, or if you
                need something not listed, send the quote anyway. We will look
                at the details and price the project around the actual
                production plan.
              </p>
            </div>
            <div className="grid gap-px overflow-hidden rounded-sm bg-[#c9d7e6] shadow-[0_18px_55px_rgba(7,17,31,0.1)] ring-1 ring-black/10 sm:grid-cols-3 lg:grid-cols-1">
              {[
                ["Common products", "Quick estimates for popular sign types"],
                ["Custom sizing", "Special shapes, materials, and finishing"],
                ["Quantity review", "Manual review when volume changes the math"],
              ].map(([title, text]) => (
                <div key={title} className="bg-[#07111f] p-6 text-white">
                  <p className="text-3xl font-black text-accent">{title.split(" ")[0]}</p>
                  <p className="mt-3 text-sm font-black uppercase tracking-wide">
                    {title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#d6e3f0]">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-sm bg-[#c9d7e6] shadow-[0_24px_70px_rgba(7,17,31,0.12)] ring-1 ring-black/10 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="bg-white p-6 sm:p-8">
              <p className="eyebrow">What we make</p>
              <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.95] text-[#07111f] sm:text-5xl">
                The most common requests are only part of what we can do.
              </h2>
              <p className="mt-7 text-sm leading-7 text-[#314154]">
                Bring your logo, layout, or rough idea. We can help size the
                project, choose the right material, and get your sign ready for
                the way it will actually be used.
              </p>
            </div>
            <div className="grid gap-px bg-[#d7e3ee] sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div key={product} className="bg-white p-5">
                  <div className="mb-4 h-1.5 w-12 rounded-full bg-accent" />
                  <p className="text-sm font-black uppercase tracking-wide text-[#07111f]">
                    {product}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow">Sign capabilities</p>
                <h2 className="mt-4 max-w-3xl font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.95] text-[#07111f] sm:text-5xl">
                  A wide mix of signs, decals, displays, and materials.
                </h2>
              </div>
              <Link
                href="/request-a-quote"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-[#07111f] px-6 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#13243a] sm:w-auto"
              >
                Request custom sign quote -&gt;
              </Link>
            </div>
            <div className="grid gap-px overflow-hidden rounded-sm bg-[#c9d7e6] shadow-[0_24px_70px_rgba(7,17,31,0.12)] ring-1 ring-black/10 sm:grid-cols-2 lg:grid-cols-3">
              {signCategories.map((category) => (
                <div key={category.label} className="bg-white p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-[#e8f3fc] text-xs font-black text-accent ring-1 ring-accent/20">
                      {category.badge}
                    </div>
                    <div className="h-1.5 flex-1 rounded-full bg-accent" />
                  </div>
                  <h3 className="mt-5 text-lg font-black uppercase tracking-wide text-[#07111f]">
                    {category.label}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#52677d]">
                    {category.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <SignQuoteBuilder />

        <section className="px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-sm bg-[#c9d7e6] shadow-[0_24px_70px_rgba(7,17,31,0.12)] ring-1 ring-black/10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-[360px] bg-[#07111f] p-6 text-white sm:p-8">
              <Image
                src="/images/sign-banners/signs1.jpg"
                alt="Custom sign and banner examples from Hue Graphics"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="absolute inset-0 h-full w-full object-cover opacity-38"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,17,31,0.96),rgba(7,17,31,0.72)),linear-gradient(180deg,transparent,rgba(7,17,31,0.88))]" />
              <div className="relative">
                <p className="eyebrow text-accent">Materials & brands</p>
                <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.95] sm:text-5xl">
                  Built around the way the sign will be used.
                </h2>
                <p className="mt-6 text-sm leading-7 text-[#d6e3f0]">
                  A temporary event sign, a reflective decal, a storefront
                  window graphic, and an outdoor panel do not need the same
                  material. We help match the job to the right substrate,
                  adhesive, laminate, and hardware.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {materialBrands.map((brand) => (
                    <span
                      key={brand}
                      className="rounded-md border border-white/14 bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-wide text-white backdrop-blur"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid gap-px bg-[#d7e3ee] md:grid-cols-2">
              <div className="bg-white p-6 sm:p-8">
                <p className="eyebrow">Used for</p>
                <div className="mt-6 grid gap-3">
                  {applications.map((application) => (
                    <div
                      key={application}
                      className="rounded-md border border-black/8 bg-[#f4f8fc] px-4 py-3 text-sm font-bold text-[#314154]"
                    >
                      {application}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-6 sm:p-8">
                <p className="eyebrow">Options</p>
                <div className="mt-6 grid gap-3">
                  {finishingOptions.map((option) => (
                    <div
                      key={option}
                      className="rounded-md border border-black/8 bg-[#f4f8fc] px-4 py-3 text-sm font-bold text-[#314154]"
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[0.58fr_1.42fr]">
            <div className="rounded-sm bg-white p-6 shadow-[0_18px_55px_rgba(7,17,31,0.1)] ring-1 ring-black/10 sm:p-8">
              <p className="eyebrow">Common materials</p>
              <p className="mt-4 text-sm leading-7 text-[#314154]">
                These are everyday sign materials we quote often, but they are
                not the limit. If you need a different size, finish, adhesive,
                thickness, or display setup, request a custom quote and we will
                help narrow it down.
              </p>
              <div className="mt-6 grid gap-3">
                {materials.map((material) => (
                  <div
                    key={material}
                    className="rounded-md border border-black/8 bg-[#f4f8fc] px-4 py-3 text-sm font-bold text-[#314154]"
                  >
                    {material}
                  </div>
                ))}
              </div>
              <Link
                href="/request-a-quote"
                className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-accent px-5 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#2a86d8]"
              >
                Need something specific? Request a quote -&gt;
              </Link>
            </div>
            <SignProjectShowcase slides={projectSlides} />
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  );
}
