import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { QuoteSection } from "@/components/QuoteSection";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Request a Quote | Hue Graphics & Apparel, LLC",
  description:
    "Request a quote from Hue Graphics in Bethlehem, GA for screen printing, embroidery, DTF transfers, DTG printing, signs, banners, vehicle graphics, business printing, and promotional products.",
  path: "/request-a-quote",
});

export default function RequestAQuotePage() {
  return (
    <>
      <Header />
      <main className="bg-[#050b14]">
        <section className="px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <p className="eyebrow">Request a quote</p>
            <h1 className="mt-5 max-w-4xl font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-5xl font-black uppercase leading-[0.9] tracking-tight text-white sm:text-7xl">
              Tell us what you need printed.
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-[#b9c7d6]">
              Send project details, quantities, artwork notes, and deadlines.
              We quote custom apparel, signs, banners, vehicle graphics,
              business printing, and promotional products for customers across
              Bethlehem, Barrow County, and Northeast Georgia.
            </p>
          </div>
        </section>
        <QuoteSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
