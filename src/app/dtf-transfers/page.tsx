import Image from "next/image";
import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { DtfBringYourOwnForm } from "@/components/DtfBringYourOwnForm";
import { DtfEstimator } from "@/components/DtfEstimator";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { QuoteSection } from "@/components/QuoteSection";
import { RandomImageGallery } from "@/components/RandomImageGallery";
import { sanmarCatalogProducts } from "@/data/sanmarCatalog.generated";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "DTF Transfers & DTG Printing in Bethlehem, GA",
  description:
    "Full-color DTF transfers and DTG printing for detailed logos, team shirts, events, staff apparel, and custom merch in Bethlehem, Barrow County, Winder, Auburn, and Northeast Georgia.",
  path: "/dtf-transfers",
});

const products = [
  "Full-color transfers",
  "Small runs",
  "Team shirts",
  "Event apparel",
  "Left chest prints",
  "Full front prints",
  "Back prints",
  "Sleeve prints",
  "Detailed artwork",
  "Repeat orders",
  "Gang sheet planning",
  "Cotton and poly blends",
];

const details = [
  "Great for colorful artwork, detailed logos, and flexible quantities",
  "Works well for team apparel, staff shirts, events, and branded merch",
  "A practical option when screen printing minimums do not fit the job",
  "Clean production planning for size runs, placements, and repeat orders",
];

const gallery = [
  "/images/dtf/dtf-main2.png",
  "/images/dtf/service-dtf-transfers.png",
  "/images/dtf-main2.png",
];

export default function DtfTransfersPage() {
  return (
    <>
      <Header />
      <main className="bg-[#f4f8fc]">
        <section className="relative isolate overflow-hidden px-4 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-24">
          <Image
            src="/images/dtf-main2.png"
            alt="DTF transfer production with full-color film"
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 -z-20 h-full w-full object-cover opacity-78"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,7,11,0.96),rgba(5,7,11,0.78)_42%,rgba(5,7,11,0.28)),linear-gradient(180deg,rgba(5,7,11,0.1),#f4f8fc)]" />
          <div className="mx-auto max-w-7xl">
            <p className="eyebrow">DTF transfers</p>
            <h1 className="mt-4 max-w-3xl font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-[2.9rem] font-black uppercase leading-[0.9] tracking-tight text-white sm:mt-5 sm:text-7xl">
              Full-color apparel graphics with flexible production runs.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#d6e3f0] sm:mt-7 sm:text-lg sm:leading-8">
              DTF transfers are a strong option for colorful logos, detailed
              artwork, team orders, short runs, and jobs that need clean prints
              without overbuilding the production setup for local schools,
              churches, teams, and businesses in Northeast Georgia.
            </p>
            <Link
              href="#dtf-price-guide"
              className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-accent px-7 text-sm font-black uppercase tracking-wide text-white shadow-[0_18px_36px_rgba(31,115,190,0.34)] transition hover:bg-[#2a86d8] sm:mt-9 sm:w-auto"
            >
              Open live DTF pricing -&gt;
            </Link>
          </div>
        </section>

        <section id="dtf-price-guide" className="scroll-mt-24">
          <DtfEstimator products={sanmarCatalogProducts} />
        </section>

        <DtfBringYourOwnForm />

        <section className="px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-sm bg-[#c9d7e6] shadow-[0_24px_70px_rgba(7,17,31,0.12)] ring-1 ring-black/10 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="bg-white p-6 sm:p-8">
              <p className="eyebrow">What we produce</p>
              <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.95] text-[#07111f] sm:text-5xl">
                Detailed prints without locking you into one path.
              </h2>
              <p className="mt-7 text-sm leading-7 text-[#314154]">
                DTF gives us room to handle bright colors, fine detail, and
                varied order sizes. We can help choose placement, sizing, and
                garment options so the finished apparel feels intentional.
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
              <p className="eyebrow">Why DTF</p>
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
            <RandomImageGallery folder="dtf" fallbackImages={gallery} />
          </div>
        </section>

        <QuoteSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
