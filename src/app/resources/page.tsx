import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Customer Resources | Hue Graphics & Apparel",
  description:
    "Quick access to Hue Graphics catalogs, quote forms, contact information, service guides, ordering links, and customer resources.",
  path: "/resources",
});

const featuredResources = [
  {
    title: "Full Apparel Catalog",
    description:
      "Browse styles, colors, sizes, product details, and quote starter tools.",
    href: "/custom-catalog",
    cta: "Browse catalog",
  },
  {
    title: "Request a Quote",
    description:
      "Send project details, artwork notes, deadlines, and files for review.",
    href: "/request-a-quote",
    cta: "Start quote",
  },
  {
    title: "Contact Hue Graphics",
    description:
      "Find phone numbers, email, location, hours, directions, and the contact form.",
    href: "/contact",
    cta: "Contact us",
  },
];

const resourceGroups = [
  {
    title: "Catalogs & Ordering",
    links: [
      {
        label: "Full Apparel Catalog",
        href: "/custom-catalog",
        text: "Search apparel styles and product details.",
      },
      {
        label: "Screen Printing Navigator",
        href: "/screen-printing",
        text: "Compare screen-print-friendly products and estimates.",
      },
      {
        label: "Shop Hue Customer Portal",
        href: "http://huegraphics.company.site/",
        text: "Order ready-to-buy items and active online store products.",
        external: true,
      },
      {
        label: "Graduation Banners",
        href: "https://huegraphics.company.site/Senior-Graduation-Banners-c149396760",
        text: "Jump straight to senior and graduation banner ordering.",
        external: true,
      },
      {
        label: "BETA Quote App",
        href: "/quote-app",
        text: "Try the self-serve quote builder.",
      },
    ],
  },
  {
    title: "Service Guides",
    links: [
      {
        label: "Screen Printing",
        href: "/screen-printing",
        text: "Custom shirts, hoodies, team apparel, and larger orders.",
      },
      {
        label: "Ink & Shirt Color Guide",
        href: "/screen-printing/color-guide",
        text: "Understand print colors, dark garments, and underbases.",
      },
      {
        label: "Embroidery",
        href: "/embroidery",
        text: "Polos, hats, jackets, bags, and stitched logo projects.",
      },
      {
        label: "DTF Transfers",
        href: "/dtf-transfers",
        text: "Flexible short-run apparel and full-color transfer options.",
      },
      {
        label: "Signs & Banners",
        href: "/signs-banners",
        text: "Banners, yard signs, decals, rigid signs, and displays.",
      },
      {
        label: "Vehicle Graphics",
        href: "/vehicle-graphics",
        text: "Vehicle lettering, decals, magnets, and business graphics.",
      },
      {
        label: "Business Printing",
        href: "/business-printing",
        text: "Cards, flyers, forms, handouts, and everyday print pieces.",
      },
    ],
  },
  {
    title: "Helpful Info",
    links: [
      {
        label: "Portfolio",
        href: "/portfolio",
        text: "See recent print, apparel, sign, and vehicle work.",
      },
      {
        label: "All Services",
        href: "/services",
        text: "Scan everything Hue Graphics can help produce.",
      },
      {
        label: "About Hue Graphics",
        href: "/about",
        text: "Learn about the shop, team, and production approach.",
      },
      {
        label: "Pay Invoice",
        href: "https://pay.hue.graphics/payinvoice",
        text: "Pay an existing invoice online.",
        external: true,
      },
      {
        label: "Directions",
        href: "https://www.google.com/maps/search/?api=1&query=741+Harry+McCarty+Road+Suite+101+Bethlehem+GA+30620",
        text: "Find the shop at 741 Harry McCarty Road, Suite 101.",
        external: true,
      },
    ],
  },
];

function ResourceLink({
  href,
  label,
  text,
  external,
}: {
  href: string;
  label: string;
  text: string;
  external?: boolean;
}) {
  const className =
    "group block rounded-sm border border-black/8 bg-white p-5 shadow-[0_14px_38px_rgba(7,17,31,0.06)] transition hover:-translate-y-0.5 hover:border-accent/45 hover:shadow-[0_20px_52px_rgba(31,115,190,0.12)]";
  const content = (
    <>
      <span className="flex items-center justify-between gap-3">
        <span className="text-base font-black uppercase leading-5 text-[#07111f] transition group-hover:text-accent">
          {label}
        </span>
        <span className="shrink-0 text-lg font-black text-accent transition group-hover:translate-x-1">
          -&gt;
        </span>
      </span>
      <span className="mt-3 block text-sm leading-6 text-[#536273]">
        {text}
      </span>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

export default function ResourcesPage() {
  return (
    <>
      <Header />
      <main className="bg-[#f4f8fc]">
        <section className="bg-[#07111f] px-5 py-14 text-white sm:px-8 lg:px-10 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <p className="eyebrow text-accent">Customer resources</p>
            <div className="mt-5 grid gap-8 lg:grid-cols-[0.78fr_0.42fr] lg:items-end">
              <div>
                <h1 className="font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-5xl font-black uppercase leading-[0.9] text-white sm:text-7xl">
                  Everything useful in one place.
                </h1>
                <p className="mt-6 max-w-3xl text-base leading-8 text-white/76 sm:text-lg">
                  Jump to catalogs, quote tools, contact details, ordering
                  portals, and service guides without hunting through the site.
                </p>
              </div>
              <div className="rounded-sm border border-white/14 bg-white/[0.06] p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#50a8ff]">
                  Need help choosing?
                </p>
                <p className="mt-3 text-sm leading-6 text-white/72">
                  Start with the quote form if you know what you need, or use
                  the catalog if you are still choosing products.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
            {featuredResources.map((resource) => (
              <Link
                key={resource.title}
                href={resource.href}
                className="group rounded-sm bg-white p-6 shadow-[0_18px_50px_rgba(7,17,31,0.08)] ring-1 ring-black/8 transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(31,115,190,0.15)]"
              >
                <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
                  Start here
                </p>
                <h2 className="mt-3 text-2xl font-black uppercase leading-7 text-[#07111f] transition group-hover:text-accent">
                  {resource.title}
                </h2>
                <p className="mt-4 text-sm leading-6 text-[#536273]">
                  {resource.description}
                </p>
                <span className="mt-6 inline-flex rounded-md bg-[#07111f] px-4 py-3 text-xs font-black uppercase tracking-wide text-white transition group-hover:bg-accent">
                  {resource.cta} -&gt;
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="px-5 pb-12 sm:px-8 lg:px-10 lg:pb-16">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
            {resourceGroups.map((group) => (
              <section key={group.title}>
                <div className="mb-4">
                  <p className="eyebrow">{group.title}</p>
                </div>
                <div className="grid gap-3">
                  {group.links.map((link) => (
                    <ResourceLink key={link.label} {...link} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  );
}
