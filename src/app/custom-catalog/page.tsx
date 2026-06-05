import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { CustomCatalogBrowser } from "@/components/CustomCatalogBrowser";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import {
  sanmarCatalogBrands,
  sanmarCatalogCategories,
  sanmarCatalogProducts,
} from "@/data/sanmarCatalog.generated";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Custom Apparel Catalog | Hue Graphics & Apparel",
  description:
    "Browse Hue Graphics custom apparel styles with built-in screen printing estimate guidance, product details, colors, brands, and quote cart tools.",
  path: "/custom-catalog",
});

export default function CustomCatalogPage() {
  const searchableStyleCount =
    sanmarCatalogProducts.length.toLocaleString("en-US");

  return (
    <>
      <Header />
      <main>
        <section className="relative isolate overflow-hidden bg-[#07111f] px-5 py-16 text-white sm:px-8 lg:px-10 lg:py-24">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_20%,rgba(31,115,190,0.24),transparent_30rem),linear-gradient(180deg,#07111f,#0a1627)]" />
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.65fr_0.35fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#50a8ff]">
                Custom catalog
              </p>
              <h1 className="mt-5 max-w-4xl font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-5xl font-black uppercase leading-[0.88] text-white sm:text-7xl">
                Browse products. Build a quote starter.
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-white/78">
                This custom catalog is built from our apparel product data with
                built-in estimate guidance, so you can search styles, compare
                colors, add items to a project quote, and get a realistic
                starting point before final artwork review.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/request-a-quote"
                  className="inline-flex justify-center rounded-md bg-accent px-7 py-4 text-sm font-black uppercase text-white shadow-[0_18px_42px_rgba(31,115,190,0.34)] transition hover:-translate-y-0.5 hover:bg-[#2a86d8]"
                >
                  Send files or general quote
                </Link>
                <a
                  href="https://www.companycasuals.com/huegraphics/start.jsp"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex justify-center rounded-md border border-white/34 px-7 py-4 text-sm font-black uppercase text-white transition hover:-translate-y-0.5 hover:border-accent hover:bg-accent/12"
                >
                  SanMar catalog
                </a>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-px overflow-hidden rounded-sm bg-white/14 ring-1 ring-white/16">
              {[
                [searchableStyleCount, "searchable styles"],
                [String(sanmarCatalogBrands.length), "brands"],
                [String(sanmarCatalogCategories.length), "categories"],
              ].map(([stat, label]) => (
                <div key={label} className="bg-white/8 p-5 text-center">
                  <p className="text-3xl font-black text-[#50a8ff]">{stat}</p>
                  <p className="mt-2 text-xs font-black uppercase tracking-wide text-white/66">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <CustomCatalogBrowser
          products={sanmarCatalogProducts}
          categories={sanmarCatalogCategories}
          brands={sanmarCatalogBrands}
        />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
