"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
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
  estimatedEach?: number | string;
  estimatedTotal?: number | string;
};

type EstimateState = {
  status: "loading" | "ready" | "unavailable";
  each?: number | string;
  total?: number | string;
  quantity?: number | string;
  warnings?: string[];
};

type ScreenprintEstimate = {
  ok?: boolean;
  price?: {
    retail?: number | string;
    each?: number | string;
  };
  currency?: string;
  summary?: {
    totalQuantity?: number | string;
    lineItems?: {
      style?: string;
      productName?: string;
      title?: string;
      color?: string;
      quantity?: number | string;
      sizes?: Record<string, number>;
    }[];
  };
  warnings?: string[];
  error?: {
    message?: string;
    fields?: Record<string, string>;
  };
};

type DetailEstimatorState = {
  product: CatalogProduct;
  color: string;
  sizes: Record<string, string>;
  frontColors: string;
  backColors: string;
  sameDesign: boolean;
  darkGarment: boolean;
  whiteUnderbase: boolean;
  estimate: ScreenprintEstimate | null;
  error: string;
  isLoading: boolean;
};

const visibleProductLimit = 48;
const preferredSizes = ["S", "M", "L", "XL", "2XL", "3XL"];

function shortDescription(description: string) {
  if (description.length <= 180) {
    return description;
  }

  return `${description.slice(0, 177).trim()}...`;
}

function defaultColor(product: CatalogProduct) {
  return product.colors[0]?.name || "";
}

function formatPrice(value: number | string | undefined, currency = "USD") {
  if (typeof value === "number") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(value);
  }

  return value || "Estimate unavailable";
}

function normalizeQuantity(value: string | number) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.max(1, Math.floor(numeric)) : 1;
}

function productSizeOrder(product: CatalogProduct) {
  const normalized = product.sizes.length ? product.sizes : preferredSizes;
  const preferred = preferredSizes.filter((size) => normalized.includes(size));
  const rest = normalized.filter((size) => !preferred.includes(size));
  return [...preferred, ...rest].slice(0, 8);
}

function buildDefaultSizes(product: CatalogProduct, quantity: number) {
  const sizes = productSizeOrder(product);
  const activeSizes = sizes.filter((size) =>
    ["S", "M", "L", "XL"].includes(size),
  );
  const distributionSizes = activeSizes.length ? activeSizes : sizes.slice(0, 4);
  const result = Object.fromEntries(sizes.map((size) => [size, 0]));

  distributionSizes.forEach((size, index) => {
    result[size] =
      Math.floor(quantity / distributionSizes.length) +
      (index < quantity % distributionSizes.length ? 1 : 0);
  });

  return result;
}

function buildDetailSizes(product: CatalogProduct, quantity: number) {
  const defaults = buildDefaultSizes(product, quantity);

  return Object.fromEntries(
    Object.entries(defaults).map(([size, qty]) => [size, String(qty)]),
  );
}

function buildScreenprintPayload({
  product,
  color,
  sizeQuantities,
  frontColors,
  backColors,
  sameDesign,
  darkGarment,
  whiteUnderbase,
}: {
  product: CatalogProduct;
  color: string;
  sizeQuantities: Record<string, number>;
  frontColors: number;
  backColors: number;
  sameDesign: boolean;
  darkGarment: boolean;
  whiteUnderbase: boolean;
}) {
  return {
    lineItems: [
      {
        style: product.style,
        title: product.title,
        color,
        sizes: sizeQuantities,
        sizeQty: sizeQuantities,
      },
    ],
    printLines: [
      {
        id: "front",
        name: "Front",
        colors: frontColors,
      },
      {
        id: "back",
        name: "Back",
        colors: backColors,
      },
    ],
    sameDesign,
    darkGarments: darkGarment,
    whiteUnderbase,
  };
}

async function requestScreenprintEstimate(payload: unknown) {
  const response = await fetch("/api/pricing/screenprint", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = (await response.json()) as ScreenprintEstimate;

  if (!response.ok || data.ok === false) {
    throw new Error(data.error?.message || "Estimate unavailable");
  }

  return data;
}

function getEstimateSummary(product: CatalogProduct, estimate: ScreenprintEstimate) {
  const line = estimate.summary?.lineItems?.[0];
  const sizes = line?.sizes
    ? Object.entries(line.sizes)
        .filter(([, quantity]) => Number(quantity) > 0)
        .map(([size, quantity]) => `${size}: ${quantity}`)
        .join(", ")
    : "";

  return [
    line?.style || product.style,
    line?.productName || product.title,
    line?.color ? `Color: ${line.color}` : "",
    sizes,
  ]
    .filter(Boolean)
    .join(" - ");
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Estimate unavailable. Please try again or request a quote.";
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
  const [quickQuantity, setQuickQuantity] = useState("24");
  const [quickFrontColors, setQuickFrontColors] = useState("1");
  const [quickBackColors, setQuickBackColors] = useState("0");
  const [quickSameDesign, setQuickSameDesign] = useState(true);
  const [quickDarkGarment, setQuickDarkGarment] = useState(false);
  const [quickWhiteUnderbase, setQuickWhiteUnderbase] = useState(false);
  const [debouncedQuickSettings, setDebouncedQuickSettings] = useState({
    quantity: "24",
    frontColors: "1",
    backColors: "0",
    sameDesign: true,
    darkGarment: false,
    whiteUnderbase: false,
  });
  const [catalogEstimates, setCatalogEstimates] = useState<
    Record<string, EstimateState>
  >({});
  const [detailEstimator, setDetailEstimator] =
    useState<DetailEstimatorState | null>(null);

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
  const visibleProductKey = visibleProducts
    .map((product) => product.style)
    .join("|");
  const visibleProductsForEstimates = useMemo(
    () => visibleProducts,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [visibleProductKey],
  );
  const estimatedQuoteTotal = projectItems.reduce(
    (total, item) =>
      total +
      (typeof item.estimatedTotal === "number" ? item.estimatedTotal : 0),
    0,
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuickSettings({
        quantity: quickQuantity,
        frontColors: quickFrontColors,
        backColors: quickBackColors,
        sameDesign: quickSameDesign,
        darkGarment: quickDarkGarment,
        whiteUnderbase: quickWhiteUnderbase,
      });
    }, 600);

    return () => window.clearTimeout(timeout);
  }, [
    quickBackColors,
    quickDarkGarment,
    quickFrontColors,
    quickQuantity,
    quickSameDesign,
    quickWhiteUnderbase,
  ]);

  useEffect(() => {
    let isCancelled = false;
    const productsToEstimate = [...visibleProductsForEstimates];
    const quantity = normalizeQuantity(debouncedQuickSettings.quantity);

    setCatalogEstimates((current) => {
      const next = { ...current };
      productsToEstimate.forEach((product) => {
        next[product.style] = { status: "loading" };
      });
      return next;
    });

    async function loadEstimates() {
      for (const product of productsToEstimate) {
        const payload = buildScreenprintPayload({
          product,
          color: defaultColor(product),
          sizeQuantities: buildDefaultSizes(product, quantity),
          frontColors: Number(debouncedQuickSettings.frontColors),
          backColors: Number(debouncedQuickSettings.backColors),
          sameDesign: debouncedQuickSettings.sameDesign,
          darkGarment: debouncedQuickSettings.darkGarment,
          whiteUnderbase: debouncedQuickSettings.whiteUnderbase,
        });

        try {
          const estimate = await requestScreenprintEstimate(payload);

          if (isCancelled) {
            return;
          }

          setCatalogEstimates((current) => ({
            ...current,
            [product.style]: {
              status: "ready",
              each: estimate.price?.each,
              total: estimate.price?.retail,
              quantity: estimate.summary?.totalQuantity,
              warnings: estimate.warnings,
            },
          }));
        } catch {
          if (isCancelled) {
            return;
          }

          setCatalogEstimates((current) => ({
            ...current,
            [product.style]: { status: "unavailable" },
          }));
        }
      }
    }

    const timeout = window.setTimeout(loadEstimates, 150);

    return () => {
      isCancelled = true;
      window.clearTimeout(timeout);
    };
  }, [debouncedQuickSettings, visibleProductKey, visibleProductsForEstimates]);

  function addToProject(product: CatalogProduct) {
    const estimate = catalogEstimates[product.style];

    setProjectItems((currentItems) => [
      ...currentItems,
      {
        id: `${product.style}-${Date.now()}-${Math.random()
          .toString(16)
          .slice(2)}`,
        productName: product.title,
        style: product.style,
        brand: product.brand,
        color: defaultColor(product),
        quantity: Number(estimate?.quantity) || normalizeQuantity(quickQuantity),
        estimatedEach: estimate?.each,
        estimatedTotal: estimate?.total,
      },
    ]);
    setIsDrawerOpen(true);
  }

  function addDetailEstimateToProject() {
    if (!detailEstimator?.estimate) {
      return;
    }

    const estimate = detailEstimator.estimate;
    const product = detailEstimator.product;

    setProjectItems((currentItems) => [
      ...currentItems,
      {
        id: `${product.style}-${Date.now()}-${Math.random()
          .toString(16)
          .slice(2)}`,
        productName: product.title,
        style: product.style,
        brand: product.brand,
        color: detailEstimator.color,
        quantity:
          Number(estimate.summary?.totalQuantity) ||
          Object.values(detailEstimator.sizes).reduce(
            (total, quantity) => total + Number(quantity || 0),
            0,
          ),
        estimatedEach: estimate.price?.each,
        estimatedTotal: estimate.price?.retail,
      },
    ]);
    setIsDrawerOpen(true);
  }

  function removeProjectItem(id: string) {
    setProjectItems((currentItems) =>
      currentItems.filter((item) => item.id !== id),
    );
  }

  function openDetailEstimator(product: CatalogProduct) {
    setDetailEstimator({
      product,
      color: defaultColor(product),
      sizes: buildDetailSizes(product, normalizeQuantity(quickQuantity)),
      frontColors: quickFrontColors,
      backColors: quickBackColors,
      sameDesign: quickSameDesign,
      darkGarment: quickDarkGarment,
      whiteUnderbase: quickWhiteUnderbase,
      estimate: null,
      error: "",
      isLoading: false,
    });
  }

  function updateDetail(updates: Partial<DetailEstimatorState>) {
    setDetailEstimator((current) =>
      current
        ? {
            ...current,
            ...updates,
            estimate: updates.estimate === undefined ? current.estimate : updates.estimate,
            error: updates.error === undefined ? current.error : updates.error,
          }
        : current,
    );
  }

  function updateDetailSize(size: string, value: string) {
    setDetailEstimator((current) =>
      current
        ? {
            ...current,
            sizes: {
              ...current.sizes,
              [size]: value,
            },
            estimate: null,
            error: "",
          }
        : current,
    );
  }

  async function submitDetailEstimate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!detailEstimator) {
      return;
    }

    const sizeQuantities = Object.fromEntries(
      Object.entries(detailEstimator.sizes).map(([size, quantity]) => [
        size,
        Number(quantity || 0),
      ]),
    );
    const totalQty = Object.values(sizeQuantities).reduce(
      (total, quantity) => total + quantity,
      0,
    );

    if (totalQty <= 0) {
      updateDetail({
        error: "Please enter at least one garment quantity.",
        estimate: null,
      });
      return;
    }

    updateDetail({ isLoading: true, error: "", estimate: null });

    try {
      const estimate = await requestScreenprintEstimate(
        buildScreenprintPayload({
          product: detailEstimator.product,
          color: detailEstimator.color,
          sizeQuantities,
          frontColors: Number(detailEstimator.frontColors),
          backColors: Number(detailEstimator.backColors),
          sameDesign: detailEstimator.sameDesign,
          darkGarment: detailEstimator.darkGarment,
          whiteUnderbase: detailEstimator.whiteUnderbase,
        }),
      );

      updateDetail({ estimate, isLoading: false });
    } catch (error) {
      updateDetail({
        error: getErrorMessage(error),
        estimate: null,
        isLoading: false,
      });
    }
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

          <div className="mt-5 rounded-sm border border-accent/20 bg-[#eef6ff] p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
                  Quick estimate settings
                </p>
                <p className="mt-2 text-sm leading-6 text-[#314154]">
                  Catalog estimates are based on your quick estimate settings.
                  Final pricing may change after exact sizes, artwork, and
                  production review.
                </p>
              </div>
              <p className="text-xs font-black uppercase tracking-wide text-[#65717e]">
                Screen printing only
              </p>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6a7480]">
                  Est. quantity
                </span>
                <input
                  type="number"
                  min={1}
                  value={quickQuantity}
                  onChange={(event) => setQuickQuantity(event.target.value)}
                  className="mt-2 h-11 w-full rounded-md border border-black/12 bg-white px-3 text-sm font-semibold text-[#07111f]"
                />
              </label>
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6a7480]">
                  Front colors
                </span>
                <select
                  value={quickFrontColors}
                  onChange={(event) => setQuickFrontColors(event.target.value)}
                  className="mt-2 h-11 w-full rounded-md border border-black/12 bg-white px-3 text-sm font-semibold text-[#07111f]"
                >
                  {[0, 1, 2, 3, 4].map((count) => (
                    <option key={count} value={count}>
                      {count}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6a7480]">
                  Back colors
                </span>
                <select
                  value={quickBackColors}
                  onChange={(event) => setQuickBackColors(event.target.value)}
                  className="mt-2 h-11 w-full rounded-md border border-black/12 bg-white px-3 text-sm font-semibold text-[#07111f]"
                >
                  {[0, 1, 2, 3, 4].map((count) => (
                    <option key={count} value={count}>
                      {count}
                    </option>
                  ))}
                </select>
              </label>
              {[
                {
                  label: "Same design",
                  checked: quickSameDesign,
                  setter: setQuickSameDesign,
                },
                {
                  label: "Dark garment",
                  checked: quickDarkGarment,
                  setter: setQuickDarkGarment,
                },
                {
                  label: "White underbase",
                  checked: quickWhiteUnderbase,
                  setter: setQuickWhiteUnderbase,
                },
              ].map((option) => (
                <label
                  key={option.label}
                  className="flex h-11 cursor-pointer items-center justify-between rounded-md border border-black/12 bg-white px-3 text-xs font-black uppercase tracking-wide text-[#314154] md:mt-6"
                >
                  <span>{option.label}</span>
                  <input
                    type="checkbox"
                    checked={option.checked}
                    onChange={(event) => option.setter(event.target.checked)}
                    className="h-5 w-5 accent-[#1f73be]"
                  />
                </label>
              ))}
            </div>
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
            const estimate = catalogEstimates[product.style];

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
                    <div className="mt-4 rounded-md bg-[#07111f] px-4 py-3 text-white">
                      <p className="text-[0.66rem] font-black uppercase tracking-[0.16em] text-[#9fc8ef]">
                        Decorated estimate
                      </p>
                      <p className="mt-1 text-sm font-black">
                        {estimate?.status === "ready"
                          ? `Estimated from ${formatPrice(estimate.each)} each`
                          : estimate?.status === "loading"
                            ? "Loading estimate..."
                            : "Estimate unavailable"}
                      </p>
                    </div>
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
                      <button
                        type="button"
                        onClick={() => openDetailEstimator(product)}
                        className="rounded-md border border-black/10 px-4 py-2 text-center text-xs font-black uppercase text-[#07111f] transition hover:border-accent hover:text-accent"
                      >
                        Get price now
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {filteredProducts.length > visibleProductLimit ? (
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-6 text-[#65717e]">
            Narrow your search to see more specific styles. Estimates are only
            requested for the products currently shown.
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
                  Screen print estimate cart
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
              Catalog estimates are based on your quick estimate settings.
              Final pricing may change after exact sizes, artwork, and
              production review.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {projectItems.length ? (
              <div className="grid gap-4">
                {projectItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-sm border border-black/10 bg-[#f7f8fa] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-accent">
                          {item.brand} - {item.style}
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
                    <div className="mt-4 grid gap-2 text-sm font-bold text-[#314154]">
                      <p>Color: {item.color}</p>
                      <p>Estimated quantity: {item.quantity}</p>
                      <p>
                        Estimated each price:{" "}
                        {formatPrice(item.estimatedEach)}
                      </p>
                      <p>
                        Estimated total: {formatPrice(item.estimatedTotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-sm border border-dashed border-black/20 p-8 text-center">
                <p className="text-sm font-semibold text-[#65717e]">
                  Add products from the catalog to start a project quote.
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-black/10 bg-white p-5">
            <div className="mb-4 flex items-center justify-between gap-3 text-sm">
              <span className="font-black uppercase text-[#65717e]">
                Estimated quote total
              </span>
              <span className="text-2xl font-black text-[#07111f]">
                {formatPrice(estimatedQuoteTotal)}
              </span>
            </div>
            <Link
              href="/request-a-quote"
              className="block rounded-md bg-accent px-5 py-4 text-center text-sm font-black uppercase text-white transition hover:bg-[#2a86d8]"
            >
              Request official quote
            </Link>
          </div>
        </aside>
      </div>

      {detailEstimator ? (
        <div className="fixed inset-0 z-[80] overflow-y-auto bg-black/60 px-5 py-8">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-sm bg-white shadow-[0_24px_90px_rgba(0,0,0,0.38)]">
            <div className="flex items-start justify-between gap-4 border-b border-black/10 p-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
                  Get price now
                </p>
                <h2 className="mt-2 text-3xl font-black uppercase text-[#07111f]">
                  {detailEstimator.product.style} -{" "}
                  {detailEstimator.product.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDetailEstimator(null)}
                className="rounded-full border border-black/10 px-3 py-1 text-sm font-black text-[#07111f] transition hover:border-accent hover:text-accent"
              >
                X
              </button>
            </div>

            <div className="grid gap-px bg-[#d7e3ee] lg:grid-cols-[1fr_0.9fr]">
              <form onSubmit={submitDetailEstimate} className="bg-white p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6a7480]">
                      Color
                    </span>
                    <select
                      value={detailEstimator.color}
                      onChange={(event) =>
                        updateDetail({
                          color: event.target.value,
                          estimate: null,
                          error: "",
                        })
                      }
                      className="mt-2 h-11 w-full rounded-md border border-black/12 bg-[#f7f8fa] px-3 text-sm font-semibold text-[#07111f]"
                    >
                      {detailEstimator.product.colors.map((color) => (
                        <option key={color.name}>{color.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6a7480]">
                      Same design
                    </span>
                    <div className="mt-2 flex h-11 items-center justify-between rounded-md border border-black/12 bg-[#f7f8fa] px-3 text-sm font-black uppercase text-[#314154]">
                      <span>{detailEstimator.sameDesign ? "Yes" : "No"}</span>
                      <input
                        type="checkbox"
                        checked={detailEstimator.sameDesign}
                        onChange={(event) =>
                          updateDetail({
                            sameDesign: event.target.checked,
                            estimate: null,
                            error: "",
                          })
                        }
                        className="h-5 w-5 accent-[#1f73be]"
                      />
                    </div>
                  </label>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6a7480]">
                    Size quantities
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {Object.entries(detailEstimator.sizes).map(([size, quantity]) => (
                      <label key={size} className="block">
                        <span className="text-xs font-black uppercase text-[#6a7480]">
                          {size}
                        </span>
                        <input
                          type="number"
                          min={0}
                          value={quantity}
                          onChange={(event) =>
                            updateDetailSize(size, event.target.value)
                          }
                          className="mt-2 h-11 w-full rounded-md border border-black/12 bg-[#f7f8fa] px-3 text-sm font-semibold text-[#07111f]"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6a7480]">
                      Front colors
                    </span>
                    <select
                      value={detailEstimator.frontColors}
                      onChange={(event) =>
                        updateDetail({
                          frontColors: event.target.value,
                          estimate: null,
                          error: "",
                        })
                      }
                      className="mt-2 h-11 w-full rounded-md border border-black/12 bg-[#f7f8fa] px-3 text-sm font-semibold text-[#07111f]"
                    >
                      {[0, 1, 2, 3, 4].map((count) => (
                        <option key={count} value={count}>
                          {count}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6a7480]">
                      Back colors
                    </span>
                    <select
                      value={detailEstimator.backColors}
                      onChange={(event) =>
                        updateDetail({
                          backColors: event.target.value,
                          estimate: null,
                          error: "",
                        })
                      }
                      className="mt-2 h-11 w-full rounded-md border border-black/12 bg-[#f7f8fa] px-3 text-sm font-semibold text-[#07111f]"
                    >
                      {[0, 1, 2, 3, 4].map((count) => (
                        <option key={count} value={count}>
                          {count}
                        </option>
                      ))}
                    </select>
                  </label>
                  {[
                    ["Dark garment", "darkGarment"],
                    ["White underbase", "whiteUnderbase"],
                  ].map(([label, field]) => (
                    <label
                      key={field}
                      className="flex h-11 cursor-pointer items-center justify-between rounded-md border border-black/12 bg-[#f7f8fa] px-3 text-xs font-black uppercase tracking-wide text-[#314154]"
                    >
                      <span>{label}</span>
                      <input
                        type="checkbox"
                        checked={Boolean(
                          detailEstimator[field as "darkGarment" | "whiteUnderbase"],
                        )}
                        onChange={(event) =>
                          updateDetail({
                            [field]: event.target.checked,
                            estimate: null,
                            error: "",
                          })
                        }
                        className="h-5 w-5 accent-[#1f73be]"
                      />
                    </label>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={detailEstimator.isLoading}
                  className="mt-6 w-full rounded-md bg-accent px-5 py-4 text-sm font-black uppercase text-white transition hover:bg-[#2a86d8] disabled:cursor-wait disabled:opacity-70"
                >
                  {detailEstimator.isLoading ? "Getting estimate..." : "Get estimate"}
                </button>

                {detailEstimator.error ? (
                  <p className="mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm font-bold leading-6 text-red-700">
                    {detailEstimator.error}
                  </p>
                ) : null}
              </form>

              <div className="bg-[#eef4fa] p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
                  Estimate
                </p>
                {detailEstimator.estimate ? (
                  <div className="mt-5 grid gap-4">
                    <div className="rounded-md bg-white p-5 ring-1 ring-black/8">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#678197]">
                        Estimated total
                      </p>
                      <p className="mt-2 text-4xl font-black text-[#07111f]">
                        {formatPrice(detailEstimator.estimate.price?.retail)}
                      </p>
                      <p className="mt-2 text-sm font-black uppercase text-[#52677d]">
                        Estimated each:{" "}
                        {formatPrice(detailEstimator.estimate.price?.each)}
                      </p>
                    </div>
                    <p className="rounded-md bg-white p-4 text-sm font-bold leading-6 text-[#314154] ring-1 ring-black/8">
                      {getEstimateSummary(
                        detailEstimator.product,
                        detailEstimator.estimate,
                      )}
                    </p>
                    {detailEstimator.estimate.warnings?.length ? (
                      <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm font-bold leading-6 text-amber-800">
                        {detailEstimator.estimate.warnings.map((warning) => (
                          <p key={warning}>{warning}</p>
                        ))}
                      </div>
                    ) : null}
                    <button
                      type="button"
                      onClick={addDetailEstimateToProject}
                      className="rounded-md bg-[#07111f] px-5 py-4 text-sm font-black uppercase text-white transition hover:bg-accent"
                    >
                      Add estimate to project quote
                    </button>
                  </div>
                ) : (
                  <p className="mt-5 rounded-md border border-dashed border-[#b5c6d6] bg-white/70 p-5 text-sm leading-7 text-[#52677d]">
                    Enter exact color, sizes, and print details to request a
                    live screen printing estimate.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
