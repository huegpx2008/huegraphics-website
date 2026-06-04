import Image from "next/image";
import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RandomImageGallery } from "@/components/RandomImageGallery";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Embroidery in Bethlehem, GA | Hats, Polos & Branded Apparel",
  description:
    "Professional embroidery for polos, hats, jackets, workwear, uniforms, and branded apparel for businesses, schools, teams, and organizations across Bethlehem, Barrow County, Winder, Auburn, and Northeast Georgia.",
  path: "/embroidery",
});

const products = [
  "Polos",
  "Hats and caps",
  "Jackets",
  "Workwear",
  "Uniform shirts",
  "Bags",
  "Left chest logos",
  "Sleeve embroidery",
  "Team apparel",
  "Company apparel",
  "Logo digitizing",
  "Thread color guidance",
];

const details = [
  "Professional stitched logos for a polished, long-lasting finish",
  "Great for staff apparel, clubs, schools, teams, and customer-facing uniforms",
  "Artwork prep and placement help so the final piece feels balanced",
  "Honest guidance on what will stitch cleanly before production starts",
];

const gallery = [
  "/images/emb/emb-jeff.jpg",
  "/images/emb/emb.png",
  "/images/emb.png",
];

export default function EmbroideryPage() {
  return (
    <>
      <Header />
      <main className="bg-[#f4f8fc]">
        <section className="relative isolate overflow-hidden px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <Image
            src="/images/emb.png"
            alt="Embroidery machine stitching branded apparel"
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 -z-20 h-full w-full object-cover opacity-78"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,7,11,0.96),rgba(5,7,11,0.78)_42%,rgba(5,7,11,0.28)),linear-gradient(180deg,rgba(5,7,11,0.1),#f4f8fc)]" />
          <div className="mx-auto max-w-7xl">
            <p className="eyebrow">Embroidery</p>
            <h1 className="mt-5 max-w-3xl font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-5xl font-black uppercase leading-[0.9] tracking-tight text-white sm:text-7xl">
              Premium stitched apparel with a clean, professional finish.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#d6e3f0]">
              Polos, hats, jackets, bags, uniforms, and branded apparel
              produced with careful setup, clean stitching, and practical
              guidance for customers across Bethlehem, Barrow County, and
              Northeast Georgia before your order goes into production.
            </p>
            <Link
              href="/request-a-quote"
              className="mt-9 inline-flex rounded-lg bg-accent px-7 py-4 text-sm font-black uppercase tracking-wide text-white shadow-[0_18px_36px_rgba(31,115,190,0.34)] transition hover:bg-[#2a86d8]"
            >
              Request embroidery pricing -&gt;
            </Link>
          </div>
        </section>

        <section className="px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-sm bg-[#c9d7e6] shadow-[0_24px_70px_rgba(7,17,31,0.12)] ring-1 ring-black/10 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="bg-white p-6 sm:p-8">
              <p className="eyebrow">What we stitch</p>
              <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.95] text-[#07111f] sm:text-5xl">
                Branded apparel that looks ready for work.
              </h2>
              <p className="mt-7 text-sm leading-7 text-[#314154]">
                Embroidery is a strong choice when you want your logo to feel
                more finished and durable. We help with placement, thread color,
                and artwork setup so the finished pieces look sharp in real use.
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
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="rounded-sm bg-white p-6 shadow-[0_18px_55px_rgba(7,17,31,0.1)] ring-1 ring-black/10 sm:p-8">
              <p className="eyebrow">Good fit for</p>
              <div className="mt-6 grid gap-3">
                {details.map((detail) => (
                  <div
                    key={detail}
                    className="rounded-md border border-black/8 bg-[#f4f8fc] px-4 py-3 text-sm font-bold text-[#314154]"
                  >
                    {detail}
                  </div>
                ))}
              </div>
            </div>
            <RandomImageGallery folder="emb" fallbackImages={gallery} />
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  );
}
