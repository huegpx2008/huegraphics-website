import Image from "next/image";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RandomImageGallery } from "@/components/RandomImageGallery";

const products = [
  "Business cards",
  "Postcards",
  "Flyers",
  "Brochures",
  "Rack cards",
  "Door hangers",
  "Letterhead",
  "Envelopes",
  "NCR forms",
  "Invoices",
  "Menus",
  "Stickers and labels",
];

const details = [
  "Everyday print pieces for businesses, schools, churches, teams, and events",
  "Clean layouts that match your brand and are easy for customers to read",
  "Helpful paper, finish, and quantity guidance before your order is produced",
  "A simple way to keep cards, forms, and marketing pieces consistent",
];

const gallery = [
  "/images/service-business-printing.png",
  "/images/service-business-printing.png",
  "/images/service-business-printing.png",
];

export default function BusinessPrintingPage() {
  return (
    <>
      <Header />
      <main className="bg-[#050b14]">
        <section className="relative isolate overflow-hidden px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <Image
            src="/images/service-business-printing.png"
            alt="Business cards and printed marketing pieces"
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 -z-20 h-full w-full object-cover opacity-72"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(2,8,20,0.98),rgba(2,8,20,0.82)_38%,rgba(2,8,20,0.42)),linear-gradient(180deg,rgba(2,8,20,0.24),#050b14)]" />
          <div className="mx-auto max-w-7xl">
            <p className="eyebrow">Business printing</p>
            <h1 className="mt-5 max-w-3xl font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-5xl font-black uppercase leading-[0.9] tracking-tight text-white sm:text-7xl">
              Everyday print pieces that keep your brand looking sharp.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#d6e3f0]">
              Business cards, postcards, flyers, forms, stickers, and branded
              paper goods produced with clean layouts, practical material
              guidance, and the same customer service Hue is known for.
            </p>
            <a
              href="/#quote"
              className="mt-9 inline-flex rounded-lg bg-accent px-7 py-4 text-sm font-black uppercase tracking-wide text-white shadow-[0_18px_36px_rgba(31,115,190,0.34)] transition hover:bg-[#2a86d8]"
            >
              Request print pricing -&gt;
            </a>
          </div>
        </section>

        <section className="px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-xl border border-white/18 bg-white/12 shadow-[0_26px_90px_rgba(0,0,0,0.42)] lg:grid-cols-[0.85fr_1.15fr]">
            <div className="bg-[linear-gradient(145deg,#08111f,#06101d)] p-6 sm:p-8">
              <p className="eyebrow">What we print</p>
              <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-5xl">
                Cards, forms, flyers, and branded essentials.
              </h2>
              <p className="mt-7 text-sm leading-7 text-[#b9c7d6]">
                Whether you need a restock of business cards or a polished set
                of marketing pieces for an event, we can help keep the details
                clean and consistent.
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
              <p className="eyebrow">Good for</p>
              <div className="mt-6 grid gap-3">
                {details.map((detail) => (
                  <div
                    key={detail}
                    className="rounded-lg border border-white/12 bg-white/[0.04] px-4 py-3 text-sm font-bold text-[#d6e3f0]"
                  >
                    {detail}
                  </div>
                ))}
              </div>
            </div>
            <RandomImageGallery folder="business-printing" fallbackImages={gallery} />
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  );
}
