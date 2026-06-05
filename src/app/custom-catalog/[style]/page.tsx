import Link from "next/link";
import { notFound } from "next/navigation";
import { CatalogStartingPrice } from "@/components/CatalogStartingPrice";
import { CatalogReturnLink } from "@/components/CatalogReturnLink";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProductCatalogQuoteButton } from "@/components/ProductCatalogQuoteButton";
import { sanmarCatalogProducts } from "@/data/sanmarCatalog.generated";
import { createSeoMetadata } from "@/lib/seo";

type ProductDetailPageProps = {
  params: Promise<{
    style: string;
  }>;
};

function specSheetUrl(fileName: string) {
  if (!fileName) {
    return "";
  }

  if (fileName.startsWith("http")) {
    return fileName;
  }

  return `https://www.sanmar.com/specsheets/${encodeURIComponent(fileName)}`;
}

function splitCompanionStyles(value: string) {
  return value
    .split("|")
    .map((style) => style.trim())
    .filter(Boolean);
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { style } = await params;
  const product = sanmarCatalogProducts.find(
    (item) => item.style.toLowerCase() === decodeURIComponent(style).toLowerCase()
  );

  if (!product) {
    return createSeoMetadata({
      title: "Catalog Product | Hue Graphics & Apparel",
      description: "Browse apparel product details from Hue Graphics.",
      path: `/custom-catalog/${style}`,
    });
  }

  return createSeoMetadata({
    title: `${product.title} | Custom Catalog | Hue Graphics`,
    description: `${product.brand} ${product.style}. View colors, sizes, product details, and request a quote from Hue Graphics.`,
    path: `/custom-catalog/${product.style}`,
  });
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { style } = await params;
  const product = sanmarCatalogProducts.find(
    (item) => item.style.toLowerCase() === decodeURIComponent(style).toLowerCase()
  );

  if (!product) {
    notFound();
  }

  const companionStyles = splitCompanionStyles(product.companionStyle);
  const relatedProducts = sanmarCatalogProducts
    .filter(
      (item) =>
        item.style !== product.style &&
        (item.brand === product.brand || item.category === product.category)
    )
    .slice(0, 4);

  return (
    <>
      <Header />
      <main>
        <section className="bg-[#07111f] px-5 py-10 text-white sm:px-8 lg:px-10 lg:py-16">
          <div className="mx-auto max-w-7xl">
            <CatalogReturnLink />
            <div className="mt-8 grid gap-10 lg:grid-cols-[0.52fr_0.48fr] lg:items-start">
              <div className="grid gap-4">
                <div className="overflow-hidden rounded-sm bg-white p-6 shadow-[0_24px_70px_rgba(0,0,0,0.24)]">
                  {product.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.image}
                      alt={product.title}
                      className="mx-auto h-[420px] w-full object-contain"
                    />
                  ) : (
                    <div className="grid h-[420px] place-items-center bg-[#eef2f6] text-sm font-black uppercase tracking-[0.18em] text-[#8b96a3]">
                      Image coming soon
                    </div>
                  )}
                </div>
                {product.backImage ? (
                  <div className="overflow-hidden rounded-sm bg-white p-5 shadow-[0_18px_50px_rgba(0,0,0,0.16)]">
                    <p className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-[#667382]">
                      Back view
                    </p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.backImage}
                      alt={`${product.title} back view`}
                      className="mx-auto h-[260px] w-full object-contain"
                    />
                  </div>
                ) : null}
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#50a8ff]">
                  {product.brand}
                </p>
                <h1 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-5xl font-black uppercase leading-[0.9] text-white sm:text-6xl">
                  {product.title}
                </h1>
                <p className="mt-5 text-sm font-black uppercase tracking-[0.16em] text-white/58">
                  Style {product.style} · {product.category}
                </p>
                <p className="mt-7 text-base leading-8 text-white/78">
                  {product.description}
                </p>

                <div className="mt-8 grid gap-px overflow-hidden rounded-sm bg-white/14 ring-1 ring-white/16 sm:grid-cols-2">
                  <CatalogStartingPrice product={product} />
                  <div className="bg-white/8 p-5">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-white/50">
                      Piece weight
                    </p>
                    <p className="mt-2 text-xl font-black text-white">
                      {product.pieceWeight
                        ? `${product.pieceWeight.toFixed(2)} lb`
                        : "Varies"}
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <ProductCatalogQuoteButton product={product} />
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
            </div>
          </div>
        </section>

        <section className="bg-[#f7f8fa] px-5 py-12 text-[#07111f] sm:px-8 lg:px-10 lg:py-16">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.58fr_0.42fr]">
            <div className="rounded-sm bg-white p-6 shadow-[0_18px_55px_rgba(7,17,31,0.08)] ring-1 ring-black/8 sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
                Colors available
              </p>
              <h2 className="mt-3 text-3xl font-black uppercase text-[#07111f]">
                {product.colors.length} color options
              </h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {product.colors.map((color) => (
                  <div
                    key={color.name}
                    className="flex items-center gap-3 rounded-sm border border-black/8 bg-[#f7f8fa] p-3"
                  >
                    <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full border border-black/12 bg-white shadow-inner">
                      {color.swatchImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={color.swatchImage}
                          alt={`${color.name} swatch`}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <span className="h-full w-full bg-[#d8dde4]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-[#263545]">
                        {color.name}
                      </p>
                      {color.pms ? (
                        <p className="mt-1 truncate text-xs font-bold uppercase tracking-wide text-[#7a8794]">
                          PMS {color.pms}
                        </p>
                      ) : (
                        <p className="mt-1 text-xs font-bold uppercase tracking-wide text-[#9aa5b1]">
                          Fabric swatch
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-sm bg-white p-6 shadow-[0_18px_55px_rgba(7,17,31,0.08)] ring-1 ring-black/8 sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
                Sizes & specs
              </p>
              <h2 className="mt-3 text-3xl font-black uppercase text-[#07111f]">
                Product details
              </h2>
              <dl className="mt-6 grid gap-4 text-sm">
                <div>
                  <dt className="font-black uppercase text-[#7a8794]">
                    Available sizes
                  </dt>
                  <dd className="mt-1 font-semibold text-[#263545]">
                    {product.availableSizes || product.sizes.join(", ")}
                  </dd>
                </div>
                <div>
                  <dt className="font-black uppercase text-[#7a8794]">
                    Size run
                  </dt>
                  <dd className="mt-1 font-semibold text-[#263545]">
                    {product.sizes.join(", ")}
                  </dd>
                </div>
                {companionStyles.length ? (
                  <div>
                    <dt className="font-black uppercase text-[#7a8794]">
                      Companion styles
                    </dt>
                    <dd className="mt-2 flex flex-wrap gap-2">
                      {companionStyles.map((companionStyle) => (
                        <Link
                          key={companionStyle}
                          href={`/custom-catalog/${encodeURIComponent(companionStyle)}`}
                          className="rounded-full bg-[#eef6ff] px-3 py-1 text-xs font-black text-[#125b99] transition hover:bg-accent hover:text-white"
                        >
                          {companionStyle}
                        </Link>
                      ))}
                    </dd>
                  </div>
                ) : null}
              </dl>
              <div className="mt-7 flex flex-wrap gap-3">
                {product.specSheet ? (
                  <a
                    href={specSheetUrl(product.specSheet)}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border border-black/12 px-4 py-3 text-xs font-black uppercase text-[#07111f] transition hover:border-accent hover:text-accent"
                  >
                    Spec sheet
                  </a>
                ) : null}
                {product.productMeasurements ? (
                  <a
                    href={specSheetUrl(product.productMeasurements)}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border border-black/12 px-4 py-3 text-xs font-black uppercase text-[#07111f] transition hover:border-accent hover:text-accent"
                  >
                    Measurements
                  </a>
                ) : null}
                {product.decorationSpecSheet ? (
                  <a
                    href={product.decorationSpecSheet}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border border-black/12 px-4 py-3 text-xs font-black uppercase text-[#07111f] transition hover:border-accent hover:text-accent"
                  >
                    Decoration specs
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          {relatedProducts.length ? (
            <div className="mx-auto mt-10 max-w-7xl">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
                Related styles
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.style}
                    href={`/custom-catalog/${encodeURIComponent(relatedProduct.style)}`}
                    className="group rounded-sm bg-white p-4 shadow-[0_14px_40px_rgba(7,17,31,0.08)] ring-1 ring-black/8 transition hover:-translate-y-1 hover:shadow-[0_20px_54px_rgba(31,115,190,0.14)]"
                  >
                    <div className="aspect-square bg-[#eef2f6] p-4">
                      {relatedProduct.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={relatedProduct.image}
                          alt={relatedProduct.title}
                          className="h-full w-full object-contain"
                          loading="lazy"
                        />
                      ) : null}
                    </div>
                    <p className="mt-4 text-xs font-black uppercase tracking-[0.14em] text-accent">
                      {relatedProduct.brand}
                    </p>
                    <h3 className="mt-2 text-sm font-black leading-5 text-[#07111f] transition group-hover:text-accent">
                      {relatedProduct.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </section>
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
