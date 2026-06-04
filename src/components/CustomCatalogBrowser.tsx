"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CatalogProduct } from "@/data/sanmarCatalog.generated";

type CustomCatalogBrowserProps = {
  products: CatalogProduct[];
  categories: readonly string[];
  brands: readonly string[];
};

const visibleProductLimit = 48;

function formatPrice(price?: number) {
  if (price === undefined) {
    return "Request pricing";
  }

  return `From $${price.toFixed(2)}`;
}

function shortDescription(description: string) {
  if (description.length <= 180) {
    return description;
  }

  return `${description.slice(0, 177).trim()}...`;
}

export function CustomCatalogBrowser({
  products,
  categories,
  brands,
}: CustomCatalogBrowserProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;
      const matchesBrand = brand === "All" || product.brand === brand;
      const matchesQuery =
        !normalizedQuery ||
        [
          product.title,
          product.brand,
          product.category,
          product.subcategory,
          product.style,
          product.description,
          product.colors.map((color) => color.name).join(" "),
          product.colors.map((color) => color.pms).join(" "),
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesCategory && matchesBrand && matchesQuery;
    });
  }, [brand, category, products, query]);

  const visibleProducts = filteredProducts.slice(0, visibleProductLimit);

  return (
    <section className="bg-[#f7f8fa] px-5 py-12 text-[#07111f] sm:px-8 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-sm bg-white p-4 shadow-[0_22px_70px_rgba(7,17,31,0.08)] ring-1 ring-black/8 sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[1fr_220px_220px]">
            <label className="block">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-[#6a7480]">
                Search catalog
              </span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search shirts, polos, hats, Carhartt, Nike..."
                className="mt-2 h-12 w-full rounded-md border border-black/12 bg-[#f7f8fa] px-4 text-sm font-semibold text-[#07111f] outline-none transition placeholder:text-[#8c98a4] focus:border-accent focus:bg-white"
              />
            </label>
            <label className="block">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-[#6a7480]">
                Category
              </span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="mt-2 h-12 w-full rounded-md border border-black/12 bg-[#f7f8fa] px-4 text-sm font-semibold text-[#07111f] outline-none transition focus:border-accent focus:bg-white"
              >
                <option>All</option>
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-[#6a7480]">
                Brand
              </span>
              <select
                value={brand}
                onChange={(event) => setBrand(event.target.value)}
                className="mt-2 h-12 w-full rounded-md border border-black/12 bg-[#f7f8fa] px-4 text-sm font-semibold text-[#07111f] outline-none transition focus:border-accent focus:bg-white"
              >
                <option>All</option>
                {brands.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-4 flex flex-col gap-2 text-sm text-[#65717e] sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing {visibleProducts.length} of {filteredProducts.length}{" "}
              matching products.
            </p>
            <a
              href="https://www.companycasuals.com/huegraphics/start.jsp"
              target="_blank"
              rel="noreferrer"
              className="font-black text-accent transition hover:text-[#125b99]"
            >
              View SanMar hosted catalog -&gt;
            </a>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleProducts.map((product) => (
            <article
              key={product.style}
              className="group overflow-hidden rounded-sm bg-white shadow-[0_18px_50px_rgba(7,17,31,0.08)] ring-1 ring-black/8 transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(31,115,190,0.16)]"
            >
              <Link
                href={`/custom-catalog/${encodeURIComponent(product.style)}`}
                className="block"
              >
                <div className="relative aspect-[1.08] bg-[#eef2f6]">
                  {product.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-full w-full object-contain p-5 transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="grid h-full place-items-center p-6 text-center text-sm font-black uppercase tracking-[0.16em] text-[#9aa5b1]">
                      Image coming soon
                    </div>
                  )}
                </div>
                <div className="p-5 pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-accent">
                        {product.brand}
                      </p>
                      <h2 className="mt-2 text-lg font-black leading-6 text-[#07111f] transition group-hover:text-accent">
                        {product.title}
                      </h2>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#f0f4f8] px-3 py-1 text-[0.68rem] font-black uppercase text-[#667382]">
                      {product.style}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#5e6c7a]">
                    {shortDescription(product.description)}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#eef6ff] px-3 py-1 text-xs font-black text-[#125b99]">
                      {product.category}
                    </span>
                    <span className="rounded-full bg-[#f3f5f7] px-3 py-1 text-xs font-black text-[#667382]">
                      {product.colors.length} colors
                    </span>
                    <span className="rounded-full bg-[#f3f5f7] px-3 py-1 text-xs font-black text-[#667382]">
                      {product.sizes.slice(0, 4).join(", ")}
                      {product.sizes.length > 4 ? "+" : ""}
                    </span>
                  </div>
                </div>
              </Link>
              <div className="p-5 pt-0">
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-black/8 pt-4">
                  <p className="text-sm font-black text-[#07111f]">
                    {formatPrice(product.priceFrom)}
                  </p>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/custom-catalog/${encodeURIComponent(product.style)}`}
                      className="rounded-md border border-black/10 px-4 py-2 text-xs font-black uppercase text-[#07111f] transition hover:border-accent hover:text-accent"
                    >
                      Details
                    </Link>
                    <Link
                      href={`/request-a-quote?style=${encodeURIComponent(product.style)}`}
                      className="rounded-md bg-accent px-4 py-2 text-xs font-black uppercase text-white transition hover:bg-[#2a86d8]"
                    >
                      Quote
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredProducts.length > visibleProductLimit ? (
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-6 text-[#65717e]">
            Narrow your search to see more specific styles. This starter catalog
            is built from the SanMar data file and can be expanded with product
            detail pages, live inventory, and favorites later.
          </p>
        ) : null}
      </div>
    </section>
  );
}
