import Image from "next/image";
import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RandomImageGallery } from "@/components/RandomImageGallery";
import { getCloudinaryGalleryImagesByTag } from "@/lib/cloudinary-public-gallery";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Vehicle Graphics in Bethlehem, GA | Truck & Fleet Lettering",
  description:
    "Commercial vehicle graphics, truck lettering, trailer decals, magnets, DOT numbers, and fleet branding for Georgia businesses in Bethlehem, Barrow County, Winder, Auburn, and Northeast Georgia.",
  path: "/vehicle-graphics",
});

export const revalidate = 300;

const products = [
  "Vehicle lettering",
  "Spot graphics",
  "Door logos",
  "Window decals",
  "Fleet identification",
  "DOT numbers",
  "Trailer graphics",
  "Magnetic signs",
  "Service truck graphics",
  "Box truck graphics",
  "Installation-ready decals",
  "Removal and replacement guidance",
];

const reasons = [
  "Make work vehicles look professional",
  "Help customers recognize your team on-site",
  "Add phone numbers, websites, and service areas",
  "Create a consistent look across trucks, vans, and trailers",
];

const gallery = [
  "vehicle-page.jpg",
  "box-truck.jpg",
  "truck-graphics.jpg",
  "vehicle-ngl.jpg",
  "469947036_9018672644822422_2689589393475107603_n.jpg",
  "491449752_18504299536009873_4018330112690580641_n.jpg",
].map((image) => `/images/vehicle-graphics/${image}`);

export default async function VehicleGraphicsPage() {
  const cloudinaryGalleryImages = (
    await getCloudinaryGalleryImagesByTag("vehicle-graphics")
  ).map((image) => image.src);

  return (
    <>
      <Header />
      <main className="bg-[#f4f8fc]">
        <section className="relative isolate overflow-hidden px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <Image
            src="/images/vehicle-graphics/box-truck.jpg"
            alt="Commercial vehicle graphics produced by Hue Graphics"
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-[58%_48%] opacity-78"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,7,11,0.96),rgba(5,7,11,0.78)_42%,rgba(5,7,11,0.28)),linear-gradient(180deg,rgba(5,7,11,0.1),#f4f8fc)]" />
          <div className="mx-auto max-w-7xl">
            <p className="eyebrow">Vehicle graphics</p>
            <h1 className="mt-5 max-w-3xl font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-5xl font-black uppercase leading-[0.9] tracking-tight text-white sm:text-7xl">
              Turn your work vehicle into a clean brand impression.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#d6e3f0]">
              Professional vehicle lettering, decals, magnets, and commercial
              graphics for trucks, vans, trailers, and service vehicles across
              Bethlehem, Winder, Auburn, Barrow County, and Northeast Georgia.
            </p>
            <Link
              href="/request-a-quote"
              className="mt-9 inline-flex rounded-lg bg-accent px-7 py-4 text-sm font-black uppercase tracking-wide text-white shadow-[0_18px_36px_rgba(31,115,190,0.34)] transition hover:bg-[#2a86d8]"
            >
              Request vehicle pricing -&gt;
            </Link>
          </div>
        </section>

        <section className="px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-sm bg-[#c9d7e6] shadow-[0_24px_70px_rgba(7,17,31,0.12)] ring-1 ring-black/10 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="bg-white p-6 sm:p-8">
              <p className="eyebrow">What we offer</p>
              <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.95] text-[#07111f] sm:text-5xl">
                Clean graphics without overcomplicating the job.
              </h2>
              <p className="mt-7 text-sm leading-7 text-[#314154]">
                We focus on practical, sharp, readable graphics that make your
                business easy to spot and easy to contact.
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
          <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-sm bg-[#c9d7e6] shadow-[0_24px_70px_rgba(7,17,31,0.12)] ring-1 ring-black/10 lg:grid-cols-2">
            {[
              {
                src: "/images/printer-1.mp4",
                label: "Printing vehicle graphics",
              },
              {
                src: "/images/vehicle-1.mp4",
                label: "Stripping and prep for fresh install",
              },
            ].map((video) => (
              <div
                key={video.src}
                className="relative min-h-[340px] overflow-hidden bg-[#020814] sm:min-h-[440px]"
              >
                <video
                  className="absolute inset-0 h-full w-full scale-105 object-cover object-center opacity-80 mix-blend-screen brightness-75 contrast-125 saturate-150"
                  src={video.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(31,140,255,0.34),transparent_38%),linear-gradient(90deg,rgba(2,8,20,0.84),rgba(4,16,34,0.24)_48%,rgba(2,8,20,0.86)),linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.72))]" />
                <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:52px_52px]" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/80 to-transparent" />
                <div className="absolute bottom-5 left-5 rounded-lg border border-white/16 bg-black/44 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-white backdrop-blur-md">
                  {video.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="rounded-sm bg-white p-6 shadow-[0_18px_55px_rgba(7,17,31,0.1)] ring-1 ring-black/10 sm:p-8">
              <p className="eyebrow">Why it works</p>
              <div className="mt-6 grid gap-3">
                {reasons.map((reason) => (
                  <div
                    key={reason}
                    className="rounded-md border border-black/8 bg-[#f4f8fc] px-4 py-3 text-sm font-bold text-[#314154]"
                  >
                    {reason}
                  </div>
                ))}
              </div>
            </div>
            <RandomImageGallery
              folder="vehicle-graphics"
              fallbackImages={gallery}
              extraImages={cloudinaryGalleryImages}
            />
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  );
}
