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
      <main className="bg-[#050b14] px-5 py-8 sm:px-8 lg:px-10">
        <section className="mx-auto max-w-7xl overflow-hidden rounded-xl border border-white/18 bg-[#08111f] shadow-[0_26px_90px_rgba(0,0,0,0.42)]">
          <div className="flex flex-col gap-5 border-b border-white/12 bg-[linear-gradient(145deg,#08111f,#06101d)] p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow">Beta quote app</p>
              <h1 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-5xl">
                Build a quick estimate.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#b9c7d6]">
                Use the beta quote app below for quick pricing. If it does not
                load in this window, open it directly in a new tab.
              </p>
            </div>
            <a
              href={quoteAppUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit rounded-lg border border-accent/45 bg-accent/10 px-5 py-3 text-xs font-black uppercase tracking-wide text-white transition hover:border-accent hover:bg-accent/18"
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
