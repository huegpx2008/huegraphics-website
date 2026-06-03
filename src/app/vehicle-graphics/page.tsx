import Image from "next/image";
import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RandomImageGallery } from "@/components/RandomImageGallery";

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

export default function VehicleGraphicsPage() {
  return (
    <>
      <Header />
      <main className="bg-[#050b14]">
        <section className="relative isolate overflow-hidden px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <Image
            src="/images/vehicle-graphics/box-truck.jpg"
            alt="Commercial vehicle graphics produced by Hue Graphics"
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-[58%_48%] opacity-70"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(2,8,20,0.98),rgba(2,8,20,0.82)_38%,rgba(2,8,20,0.36)),linear-gradient(180deg,rgba(2,8,20,0.24),#050b14)]" />
          <div className="mx-auto max-w-7xl">
            <p className="eyebrow">Vehicle graphics</p>
            <h1 className="mt-5 max-w-3xl font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-5xl font-black uppercase leading-[0.9] tracking-tight text-white sm:text-7xl">
              Turn your work vehicle into a clean brand impression.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#d6e3f0]">
              Professional vehicle lettering, decals, magnets, and commercial
              graphics for trucks, vans, trailers, and service vehicles.
            </p>
            <Link
              href="/#quote"
              className="mt-9 inline-flex rounded-lg bg-accent px-7 py-4 text-sm font-black uppercase tracking-wide text-white shadow-[0_18px_36px_rgba(31,115,190,0.34)] transition hover:bg-[#2a86d8]"
            >
              Request vehicle pricing -&gt;
            </Link>
          </div>
        </section>

        <section className="px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-xl border border-white/18 bg-white/12 shadow-[0_26px_90px_rgba(0,0,0,0.42)] lg:grid-cols-[0.85fr_1.15fr]">
            <div className="bg-[linear-gradient(145deg,#08111f,#06101d)] p-6 sm:p-8">
              <p className="eyebrow">What we offer</p>
              <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-5xl">
                Clean graphics without overcomplicating the job.
              </h2>
              <p className="mt-7 text-sm leading-7 text-[#b9c7d6]">
                Not every vehicle needs a full wrap. We focus on practical,
                sharp, readable graphics that make your business easy to spot
                and easy to contact.
              </p>
            </div>
            <div className="grid gap-px bg-white/12 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div key={product} className="bg-[#08111f] p-5">
                  <div className="mb-4 h-1.5 w-12 rounded-full bg-accent" />
                  <p className="text-sm font-black uppercase tracking-wide text-white">
                    {product}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="rounded-xl border border-white/18 bg-[#08111f] p-6 sm:p-8">
              <p className="eyebrow">Why it works</p>
              <div className="mt-6 grid gap-3">
                {reasons.map((reason) => (
                  <div
                    key={reason}
                    className="rounded-lg border border-white/12 bg-white/[0.04] px-4 py-3 text-sm font-bold text-[#d6e3f0]"
                  >
                    {reason}
                  </div>
                ))}
              </div>
            </div>
            <RandomImageGallery folder="vehicle-graphics" fallbackImages={gallery} />
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  );
}
