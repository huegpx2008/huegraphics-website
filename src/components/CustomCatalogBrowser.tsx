"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CatalogProduct } from "@/data/sanmarCatalog.generated";

type CustomCatalogBrowserProps = {
  products: CatalogProduct[];
  categories: readonly string[];
  brands: readonly string[];
};

type ProjectItem = {
  id: string;
  productName: string;
  style: string;
  brand: string;
  color: string;
  quantity: number;
  sizes: Record<string, number>;
};

type SameDesignStatus = "yes" | "no" | "not-sure";
type DecorationMethod = "screenprint" | "dtf" | "embroidery" | "not-sure";

const visibleProductLimit = 48;
const pricingAppUrl = "https://quotes.huegraphics.cc/apparel";

const sameDesignLabels: Record<SameDesignStatus, string> = {
  yes: "Yes, same design",
  no: "No, different designs",
  "not-sure": "Not sure",
};

const decorationMethodLabels: Record<DecorationMethod, string> = {
  screenprint: "Screen Printing",
  dtf: "DTF Transfers",
  embroidery: "Embroidery",
  "not-sure": "Not sure / Help me choose",
};

function shortDescription(description: string) {
  if (description.length <= 180) {
    return description;
  }

  return `${description.slice(0, 177).trim()}...`;
}

function defaultColor(product: CatalogProduct) {
  return product.colors[0]?.name || "";
}

function createProjectItem(product: CatalogProduct): ProjectItem {
  return {
    id: `${product.style}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    productName: product.title,
    style: product.style,
    brand: product.brand,
    color: defaultColor(product),
    quantity: 12,
    sizes: {},
  };
}

function buildPricingUrl({
  items,
  method,
  sameDesign,
  notes,
}: {
  items: ProjectItem[];
  method: DecorationMethod;
  sameDesign: SameDesignStatus;
  notes: string;
}) {
  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
  const sameDesignValue =
    sameDesign === "yes" ? "true" : sameDesign === "no" ? "false" : "unsure";
  const projectData = {
    source: "website-catalog",
    decorationMethod: method,
    decorationMethodLabel: decorationMethodLabels[method],
    sameDesign: sameDesignValue,
    sameDesignLabel: sameDesignLabels[sameDesign],
    totalQuantity,
    notes,
    items: items.map((item) => ({
      productName: item.productName,
      style: item.style,
      sku: item.style,
      brand: item.brand,
      color: item.color,
      quantity: item.quantity,
      sizes: item.sizes,
    })),
  };
  const params = new URLSearchParams({
    source: "website-catalog",
    method,
    sameDesign: sameDesignValue,
    totalQuantity: String(totalQuantity),
    items: JSON.stringify(projectData.items),
    project: JSON.stringify(projectData),
  });

  return `${pricingAppUrl}?${params.toString()}`;
}

export function CustomCatalogBrowser({
  products,
  categories,
  brands,
}: CustomCatalogBrowserProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [projectItems, setProjectItems] = useState<ProjectItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [sameDesign, setSameDesign] = useState<SameDesignStatus>("yes");
  const [method, setMethod] = useState<DecorationMethod>("screenprint");
  const [notes, setNotes] = useState("");

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
  const totalQuantity = projectItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const mixedColors = new Set(
    projectItems.map((item) => item.color).filter(Boolean)
  ).size;
  const pricingUrl = buildPricingUrl({
    items: projectItems,
    method,
    sameDesign,
    notes,
  });

  function addToProject(product: CatalogProduct) {
    setProjectItems((currentItems) => [...currentItems, createProjectItem(product)]);
    setIsDrawerOpen(true);
  }

  function updateProjectItem(
    id: string,
    updates: Partial<Pick<ProjectItem, "color" | "quantity">>
  ) {
    setProjectItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
              quantity:
                updates.quantity === undefined
                  ? item.quantity
                  : Math.max(1, updates.quantity),
            }
          : item
      )
    );
  }

  function removeProjectItem(id: string) {
    setProjectItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );
  }

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
          <div className="mt-4 flex flex-col gap-3 text-sm text-[#65717e] sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing {visibleProducts.length} of {filteredProducts.length}{" "}
              matching products.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="rounded-md bg-[#07111f] px-4 py-2 text-xs font-black uppercase text-white transition hover:bg-accent"
              >
                Project quote ({projectItems.length})
              </button>
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
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleProducts.map((product) => {
            const singleItemUrl = buildPricingUrl({
              items: [createProjectItem(product)],
              method,
              sameDesign,
              notes,
            });

            return (
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
                  <div className="mt-5 grid gap-2 border-t border-black/8 pt-4">
                    <button
                      type="button"
                      onClick={() => addToProject(product)}
                      className="rounded-md bg-accent px-4 py-3 text-xs font-black uppercase text-white transition hover:bg-[#2a86d8]"
                    >
                      Add to project quote
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/custom-catalog/${encodeURIComponent(product.style)}`}
                        className="rounded-md border border-black/10 px-4 py-2 text-center text-xs font-black uppercase text-[#07111f] transition hover:border-accent hover:text-accent"
                      >
                        Details
                      </Link>
                      <a
                        href={singleItemUrl}
                        className="rounded-md border border-black/10 px-4 py-2 text-center text-xs font-black uppercase text-[#07111f] transition hover:border-accent hover:text-accent"
                      >
                        Get price now
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {filteredProducts.length > visibleProductLimit ? (
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-6 text-[#65717e]">
            Narrow your search to see more specific styles. Add several
            compatible garments to one project quote when they share the same
            design, print location, print size, and ink setup.
          </p>
        ) : null}
      </div>

      <div
        className={[
          "fixed inset-0 z-[70] transition",
          isDrawerOpen ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
        aria-hidden={!isDrawerOpen}
      >
        <button
          type="button"
          aria-label="Close project quote drawer"
          onClick={() => setIsDrawerOpen(false)}
          className={[
            "absolute inset-0 bg-black/50 transition-opacity",
            isDrawerOpen ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />
        <aside
          className={[
            "absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-white shadow-[0_24px_90px_rgba(0,0,0,0.38)] transition-transform duration-300",
            isDrawerOpen ? "translate-x-0" : "translate-x-full",
          ].join(" ")}
        >
          <div className="border-b border-black/10 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
                  Project quote
                </p>
                <h2 className="mt-2 text-3xl font-black uppercase text-[#07111f]">
                  Build a mixed garment quote
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="rounded-full border border-black/10 px-3 py-1 text-sm font-black text-[#07111f] transition hover:border-accent hover:text-accent"
              >
                X
              </button>
            </div>
            <p className="mt-4 rounded-sm bg-[#eef6ff] p-4 text-sm leading-6 text-[#314154]">
              Minimums are usually based on the print setup, not just one
              garment style. You can often combine short sleeve shirts, long
              sleeve shirts, hoodies, polos, and other compatible garments when
              they use the same artwork, print location, print size, and ink
              setup.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {projectItems.length ? (
              <div className="grid gap-4">
                {projectItems.map((item) => {
                  const product = products.find(
                    (catalogProduct) => catalogProduct.style === item.style
                  );

                  return (
                    <div
                      key={item.id}
                      className="rounded-sm border border-black/10 bg-[#f7f8fa] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.14em] text-accent">
                            {item.brand} · {item.style}
                          </p>
                          <h3 className="mt-1 text-base font-black text-[#07111f]">
                            {item.productName}
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeProjectItem(item.id)}
                          className="text-xs font-black uppercase text-[#8a3440] transition hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_110px]">
                        <label className="block">
                          <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6a7480]">
                            Color
                          </span>
                          <select
                            value={item.color}
                            onChange={(event) =>
                              updateProjectItem(item.id, {
                                color: event.target.value,
                              })
                            }
                            className="mt-2 h-11 w-full rounded-md border border-black/12 bg-white px-3 text-sm font-semibold text-[#07111f]"
                          >
                            {(product?.colors || []).map((color) => (
                              <option key={color.name}>{color.name}</option>
                            ))}
                          </select>
                        </label>
                        <label className="block">
                          <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6a7480]">
                            Pieces
                          </span>
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(event) =>
                              updateProjectItem(item.id, {
                                quantity: Number(event.target.value),
                              })
                            }
                            className="mt-2 h-11 w-full rounded-md border border-black/12 bg-white px-3 text-sm font-semibold text-[#07111f]"
                          />
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-sm border border-dashed border-black/20 p-8 text-center">
                <p className="text-sm font-semibold text-[#65717e]">
                  Add products from the catalog to start a project quote.
                </p>
              </div>
            )}

            <div className="mt-6 grid gap-5">
              <fieldset>
                <legend className="text-sm font-black uppercase text-[#07111f]">
                  Will these items use the same design?
                </legend>
                <div className="mt-3 grid gap-2">
                  {(Object.keys(sameDesignLabels) as SameDesignStatus[]).map(
                    (option) => (
                      <label
                        key={option}
                        className="flex items-center gap-3 rounded-sm border border-black/10 bg-white p-3 text-sm font-bold text-[#314154]"
                      >
                        <input
                          type="radio"
                          name="sameDesign"
                          checked={sameDesign === option}
                          onChange={() => setSameDesign(option)}
                        />
                        {sameDesignLabels[option]}
                      </label>
                    )
                  )}
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-sm font-black uppercase text-[#07111f]">
                  What decoration method are you considering?
                </legend>
                <div className="mt-3 grid gap-2">
                  {(Object.keys(decorationMethodLabels) as DecorationMethod[]).map(
                    (option) => (
                      <label
                        key={option}
                        className="flex items-center gap-3 rounded-sm border border-black/10 bg-white p-3 text-sm font-bold text-[#314154]"
                      >
                        <input
                          type="radio"
                          name="method"
                          checked={method === option}
                          onChange={() => setMethod(option)}
                        />
                        {decorationMethodLabels[option]}
                      </label>
                    )
                  )}
                </div>
              </fieldset>

              <label className="block">
                <span className="text-sm font-black uppercase text-[#07111f]">
                  Project notes
                </span>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Artwork details, locations, deadline, or anything you already know..."
                  className="mt-3 min-h-24 w-full rounded-md border border-black/12 bg-white p-3 text-sm font-semibold text-[#07111f]"
                />
              </label>

              <div className="grid gap-3">
                {method === "screenprint" && totalQuantity > 0 && totalQuantity < 24 ? (
                  <p className="rounded-sm bg-[#fff7e8] p-4 text-sm font-semibold leading-6 text-[#6d4c13]">
                    Screen printing usually starts at 24 pieces for the same
                    design. For lower quantities, DTF or DTG may be a better
                    option.
                  </p>
                ) : null}
                {method === "screenprint" &&
                totalQuantity >= 24 &&
                sameDesign === "yes" ? (
                  <p className="rounded-sm bg-[#eef6ff] p-4 text-sm font-semibold leading-6 text-[#125b99]">
                    This project may qualify for screen printing if the artwork,
                    print location, print size, and ink setup are compatible.
                  </p>
                ) : null}
                {mixedColors > 1 ? (
                  <p className="rounded-sm bg-[#f3f5f7] p-4 text-sm font-semibold leading-6 text-[#4d5c6c]">
                    Mixing garment colors can affect screen printing setup. Dark
                    garments may require a white underbase, while light garments
                    may not.
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="border-t border-black/10 bg-white p-5">
            <div className="mb-4 flex items-center justify-between gap-3 text-sm">
              <span className="font-black uppercase text-[#65717e]">
                Total quantity
              </span>
              <span className="text-2xl font-black text-[#07111f]">
                {totalQuantity}
              </span>
            </div>
            <a
              href={projectItems.length ? pricingUrl : undefined}
              aria-disabled={!projectItems.length}
              className={[
                "block rounded-md px-5 py-4 text-center text-sm font-black uppercase text-white transition",
                projectItems.length
                  ? "bg-accent hover:bg-[#2a86d8]"
                  : "pointer-events-none bg-[#9aa5b1]",
              ].join(" ")}
            >
              Continue to pricing app
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
