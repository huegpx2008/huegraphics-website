import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: "QuickBooks Connection Disconnected",
    description:
      "Confirmation and reconnection guidance for a disconnected Hue HQ QuickBooks company.",
    path: "/quickbooks-disconnected",
  }),
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function QuickBooksDisconnectedPage() {
  return (
    <>
      <Header />
      <main className="relative isolate grid min-h-[70svh] place-items-center overflow-hidden bg-[#07111f] px-5 py-16 text-white sm:px-8 lg:px-10">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_20%,rgba(31,115,190,0.28),transparent_28rem),linear-gradient(145deg,#07111f,#02070d)]" />
        <div className="absolute inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:56px_56px]" />

        <section className="w-full max-w-2xl rounded-sm border border-white/12 bg-[#0a1828]/95 p-7 text-center shadow-[0_28px_90px_rgba(0,0,0,0.38)] sm:p-10 lg:p-12">
          <div
            aria-hidden="true"
            className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-[#65b5f5]/35 bg-[#1f73be]/15 text-2xl font-black text-[#65b5f5]"
          >
            i
          </div>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-[#65b5f5]">
            Hue HQ connection status
          </p>
          <h1 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.94] text-white sm:text-5xl">
            QuickBooks connection disconnected
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-white/72">
            Hue HQ is no longer connected to the selected QuickBooks company,
            or the connection needs to be renewed.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/58">
            Future QuickBooks access has stopped and will remain stopped until
            an authorized user restores the connection.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="https://hq.huegraphics.cc/settings"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-accent px-7 text-sm font-black uppercase tracking-wide text-white shadow-[0_18px_40px_rgba(31,115,190,0.34)] transition hover:-translate-y-0.5 hover:bg-[#2a86d8] sm:w-auto"
            >
              Return to Hue HQ
            </a>
            <a
              href="mailto:jason@huegraphics.cc"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-md border border-white/22 px-7 text-sm font-black uppercase tracking-wide text-white transition hover:border-[#65b5f5] hover:bg-[#1f73be]/10 sm:w-auto"
            >
              Contact support
            </a>
          </div>
          <p className="mt-5 text-xs text-white/46">jason@huegraphics.cc</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
