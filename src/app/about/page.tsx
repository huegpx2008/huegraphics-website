import Image from "next/image";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "About Hue Graphics & Apparel, LLC | Family-Owned Print Shop",
  description:
    "Learn the story behind Hue Graphics & Apparel, LLC, a family-owned print shop founded in 2013 and now serving Bethlehem, Barrow County, Auburn, Winder, and Northeast Georgia.",
  path: "/about",
});

const milestones = [
  {
    year: "2008",
    title: "Ham and Jam Creations",
    description:
      "Hugh A. Morris opened a small T-shirt shop in Winder, Georgia, planting the seed for what would become Hue Graphics.",
  },
  {
    year: "2013",
    title: "Hue Graphics Founded",
    description:
      "Hue Graphics & Apparel, LLC was founded in February 2013 in honor of Hugh and the values he instilled.",
  },
  {
    year: "2025",
    title: "Moved to Bethlehem",
    description:
      "After years of growth in Auburn, Hue Graphics moved into a larger Bethlehem facility to better serve customers.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="bg-[#f4f8fc]">
        <section className="relative isolate overflow-hidden px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_20%,rgba(31,115,190,0.16),transparent_28rem),linear-gradient(180deg,#ffffff,#f4f8fc)]" />
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="eyebrow">About Hue Graphics & Apparel, LLC</p>
              <h1 className="mt-5 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-5xl font-black uppercase leading-[0.9] text-[#07111f] sm:text-7xl">
                Built on family, legacy, and community.
              </h1>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-[#314154]">
              Founded in February 2013, Hue Graphics & Apparel, LLC was built on
              more than a passion for printing. It was built on family, legacy,
              and a commitment to serving the community.
            </p>
          </div>
        </section>

        <section className="px-5 pb-8 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-sm bg-[#c9d7e6] shadow-[0_24px_70px_rgba(7,17,31,0.12)] ring-1 ring-black/10 lg:grid-cols-2">
            <div className="relative min-h-[360px] overflow-hidden bg-[#08111f] lg:min-h-[540px]">
              <Image
                src="/images/old-store.png"
                alt="Original Hue Graphics storefront from the Auburn era"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_44%,rgba(8,17,31,0.88))]" />
              <div className="absolute bottom-5 left-5 rounded-lg border border-white/16 bg-black/46 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-white backdrop-blur-md">
                Auburn roots
              </div>
            </div>
            <div className="relative min-h-[360px] overflow-hidden bg-[#08111f] lg:min-h-[540px]">
              <Image
                src="/images/store-2.png"
                alt="Current Hue Graphics storefront in Bethlehem, Georgia"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_44%,rgba(8,17,31,0.88))]" />
              <div className="absolute bottom-5 left-5 rounded-lg border border-white/16 bg-black/46 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-white backdrop-blur-md">
                Bethlehem facility
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.34fr_1fr]">
            <div className="rounded-sm bg-white p-6 shadow-[0_18px_55px_rgba(7,17,31,0.1)] ring-1 ring-black/10 sm:p-8">
              <p className="eyebrow">Milestones</p>
              <div className="mt-7 grid gap-5">
                {milestones.map((milestone) => (
                  <div key={milestone.year} className="border-l border-accent/45 pl-5">
                    <p className="text-sm font-black text-accent">{milestone.year}</p>
                    <p className="mt-1 text-base font-black uppercase tracking-wide text-[#07111f]">
                      {milestone.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#314154]">
                      {milestone.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <article className="rounded-sm bg-white p-6 text-base leading-8 text-[#314154] shadow-[0_18px_55px_rgba(7,17,31,0.1)] ring-1 ring-black/10 sm:p-8 lg:p-10">
              <p>
                The story of Hue Graphics began with my father, Hugh A. Morris.
                In 2008, he opened a small T-shirt shop in Winder, Georgia
                called <em>Ham and Jam Creations</em>. After his passing in July
                2012, I felt a responsibility to continue the dream he had
                started. In his honor, I founded Hue Graphics & Apparel, LLC,
                naming the company after him as a tribute to the impact he had
                on my life and the values he instilled in me.
              </p>
              <p className="mt-6">
                What started as a small printing company has grown into a
                full-service production shop offering screen printing,
                embroidery, direct-to-film transfers, direct-to-garment
                printing, signs, banners, vehicle graphics, business printing,
                promotional products, and more, all under one roof.
              </p>
              <p className="mt-6">
                For over a decade, we have proudly served businesses, schools,
                churches, teams, organizations, and individuals throughout
                Barrow County and the surrounding areas. As a family-owned and
                operated business, we believe every order deserves personal
                attention, honest communication, and a commitment to quality.
              </p>
              <p className="mt-6">
                For many years, our home was in downtown Auburn, Georgia. Auburn
                played a huge role in our growth, and it will always hold a
                special place in our story. As our customer base expanded and
                our services continued to grow, we eventually outgrew our Auburn
                location. In September 2025, we relocated to our larger facility
                in Bethlehem, Georgia.
              </p>
              <p className="mt-6">
                Today, we are proud to operate from our expanded Bethlehem
                facility, allowing us to take on larger projects, improve
                production efficiency, and continue investing in new equipment
                and services for our customers.
              </p>
              <p className="mt-6">
                Whether you need a large screen printing order, custom
                embroidered apparel, a single DTG shirt, full-color DTF
                transfers, signs, banners, or promotional products, we are
                committed to helping bring your ideas to life.
              </p>
              <p className="mt-6">
                At Hue Graphics, we are not just printing products. We are
                helping businesses, organizations, and individuals share their
                message, build their brand, and make a lasting impression.
              </p>
              <blockquote className="mt-8 border-l-4 border-accent pl-5 text-xl font-black leading-8 text-[#07111f]">
                &ldquo;The first quality that is needed is audacity.&rdquo;
              </blockquote>
              <p className="mt-8 font-bold text-[#07111f]">
                Thank you for supporting our family business and being part of
                our journey.
              </p>
            </article>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  );
}
