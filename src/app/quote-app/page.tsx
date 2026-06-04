import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { createSeoMetadata } from "@/lib/seo";

const quoteAppUrl = "https://quotes.huegraphics.cc/";

export const metadata = createSeoMetadata({
  title: "Beta Quote App | Hue Graphics",
  description:
    "Use the Hue Graphics beta quote app for quick pricing on custom apparel, printing, signs, banners, DTF transfers, and business printing from Bethlehem, GA.",
  path: "/quote-app",
});

export default function QuoteAppPage() {
  return (
    <>
      <Header />
      <main className="bg-[#f4f8fc] px-5 py-8 sm:px-8 lg:px-10">
        <section className="mx-auto max-w-7xl overflow-hidden rounded-sm bg-[#c9d7e6] shadow-[0_24px_70px_rgba(7,17,31,0.12)] ring-1 ring-black/10">
          <div className="flex flex-col gap-5 bg-white p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow">Beta quote app</p>
              <h1 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.95] text-[#07111f] sm:text-5xl">
                Build a quick estimate.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#314154]">
                Use the beta quote app below for quick pricing. If it does not
                load in this window, open it directly in a new tab.
              </p>
            </div>
            <a
              href={quoteAppUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit rounded-md border border-accent/45 bg-accent/10 px-5 py-3 text-xs font-black uppercase tracking-wide text-[#07111f] transition hover:border-accent hover:bg-accent hover:text-white"
            >
              Open in new tab
            </a>
          </div>
          <div className="relative h-[76vh] min-h-[680px] bg-[#020814]">
            <iframe
              title="Hue Graphics beta quote app"
              src={quoteAppUrl}
              className="absolute inset-0 h-full w-full border-0 bg-white"
              loading="lazy"
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
