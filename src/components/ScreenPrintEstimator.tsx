"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { CatalogProduct } from "@/data/sanmarCatalog.generated";
import {
  addItemToFloatingQuoteBasket,
  openFloatingQuoteBasket,
  type QuoteBasketItem,
} from "@/components/FloatingQuoteBasket";

type ScreenPrintEstimatorProps = {
  products: CatalogProduct[];
};

type NavigatorCategory = "tees" | "sweatshirts";

type NavigatorTier = {
  id: string;
  label: string;
  headline: string;
  description: string;
  styles: string[];
};

type NavigatorGroup = {
  id: NavigatorCategory;
  label: string;
  eyebrow: string;
  summary: string;
  tiers: NavigatorTier[];
};

type EstimateState = {
  status: "loading" | "ready" | "error";
  each?: number | string;
  total?: number | string;
  currency?: string;
  warning?: string;
};

type DetailEstimatorState = {
  product: CatalogProduct;
  color: string;
  sizes: Record<string, string>;
  frontColors: string;
  backColors: string;
  estimate: ScreenprintEstimate | null;
  error: string;
  isLoading: boolean;
};

type ScreenprintEstimate = {
  ok?: boolean;
  price?: {
    retail?: number | string;
    each?: number | string;
  };
  currency?: string;
  warnings?: string[];
  error?: {
    message?: string;
  };
};

const preferredSizes = ["S", "M", "L", "XL", "2XL", "3XL"];
const frontColorOptions = ["1", "2", "3", "4"];
const backColorOptions = [
  { label: "No back print", value: "0" },
  { label: "1 color", value: "1" },
  { label: "2 colors", value: "2" },
  { label: "3 colors", value: "3" },
  { label: "4 colors", value: "4" },
];

const navigatorGroups: NavigatorGroup[] = [
  {
    id: "tees",
    label: "T-Shirts",
    eyebrow: "T-Shirt navigator",
    summary:
      "Popular short sleeve, long sleeve, soft-style, and performance tees for screen printing.",
    tiers: [
      {
        id: "tee-good",
        label: "Good",
        headline: "Good value tees",
        description: "Reliable everyday tees for schools, events, crews, and bulk orders.",
        styles: ["PC54", "5000", "8000", "29M", "PC55"],
      },
      {
        id: "tee-better",
        label: "Better",
        headline: "Better everyday favorites",
        description: "A stronger mix of feel, color range, and print surface.",
        styles: ["PC61", "2000", "64000", "BC3001", "BC3001CVC"],
      },
      {
        id: "tee-best",
        label: "Best",
        headline: "Best retail feel",
        description: "Soft, polished tees for projects where the garment matters.",
        styles: ["NL6210", "BC3001CVC", "BC3001", "ST450"],
      },
      {
        id: "tee-long-sleeve",
        label: "In-between",
        headline: "Long sleeve options",
        description: "Cool weather and school/event shirts with more coverage.",
        styles: ["G2400", "5400", "ST350LS", "YST350LS"],
      },
      {
        id: "tee-performance",
        label: "Performance",
        headline: "Moisture-wicking tees",
        description: "Athletic and outdoor-friendly tees with performance fabrics.",
        styles: ["ST350", "ST420", "ST700", "A4N3402", "A4N3142"],
      },
      {
        id: "tee-youth",
        label: "Youth",
        headline: "Youth T-shirt options",
        description: "Common youth tees for schools, teams, camps, and events.",
        styles: ["PC54Y", "5000B", "PC61Y", "BC3001Y", "YST350"],
      },
    ],
  },
  {
    id: "sweatshirts",
    label: "Sweatshirts",
    eyebrow: "Sweatshirt navigator",
    summary:
      "Crewnecks, hoodies, full-zips, quarter-zips, and fleece options from the SanMar sweatshirt navigator.",
    tiers: [
      {
        id: "fleece-crewneck",
        label: "Crewneck",
        headline: "Crewneck sweatshirts",
        description: "Good, better, and best crewneck fleece options from core basics to premium brands.",
        styles: [
          "IC48M",
          "PC850",
          "DT6104",
          "PC78",
          "562M",
          "562B",
          "18000",
          "18000B",
          "BC3945",
          "1566",
          "DT1106",
          "NKFD9863",
          "SF000",
          "PC90",
          "PC90T",
        ],
      },
      {
        id: "fleece-pullover-hoodie",
        label: "Pullover Hoodie",
        headline: "Pullover hoodies",
        description: "Classic hoodie options, including budget basics, ring spun fleece, organic, and heavyweight picks.",
        styles: [
          "DT6100",
          "DT6100Y",
          "IC49M",
          "PC850H",
          "PC850YH",
          "PC78H",
          "PC78HT",
          "LPC78H",
          "996M",
          "996Y",
          "18500",
          "18500B",
          "AL4000",
          "CTK121",
          "DT1101",
          "SXU003",
          "SF500",
          "PC90H",
        ],
      },
      {
        id: "fleece-full-zip",
        label: "Full-Zip Hoodie",
        headline: "Full-zip hoodies",
        description: "Full-zip fleece and hooded zip-front styles for crews, staff, and premium branded apparel.",
        styles: [
          "DT6102",
          "PC850ZH",
          "ST258",
          "PC78ZH",
          "LPC78ZH",
          "993M",
          "993B",
          "18600",
          "18600B",
          "CTK122",
          "NEA511",
          "LNEA511",
          "SXU005",
          "NKDR1513",
          "SF600",
          "PC90ZH",
        ],
      },
      {
        id: "fleece-quarter-zip",
        label: "Quarter-Zip",
        headline: "Quarter-zips and pullovers",
        description: "Polished fleece and quarter-zip styles for workwear, schools, and team apparel.",
        styles: [
          "PC850Q",
          "ST561",
          "LST561",
          "DT6106",
          "PC78Q",
          "K807",
          "995M",
          "OG813",
          "NF0A8C5G",
          "NEA512",
          "K829",
        ],
      },
      {
        id: "fleece-performance",
        label: "Performance",
        headline: "Performance fleece",
        description: "Sport-Wick, moisture-management, and active fleece pieces for teams and outdoor use.",
        styles: [
          "ST253",
          "F244",
          "YST244",
          "ST850",
          "TST850",
          "LST850",
          "PC590",
          "PC590Q",
          "PC590H",
          "PC590YH",
        ],
      },
      {
        id: "fleece-premium",
        label: "Premium",
        headline: "Premium and specialty fleece",
        description: "Nike, Stanley/Stella, District, and specialty fleece options with elevated details.",
        styles: [
          "NKFD9735",
          "NKDX6718",
          "NKFQ4762",
          "ST857",
          "ST241",
          "LST241",
          "YST241",
          "SXU028",
          "SXU029",
          "DT6600",
        ],
      },
    ],
  },
];

const embroideryNavigatorLabels = [
  "Polo Navigator",
  "Headwear Navigator",
  "Outerwear Navigator",
  "Woven/Dress Shirts Navigator",
  "Bags & Packs Navigator",
];

function formatPrice(value: number | string | undefined, currency = "USD") {
  if (typeof value === "number") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(value);
  }

  return value || "Request pricing";
}

function defaultColor(product: CatalogProduct) {
  return product.colors[0]?.name || "";
}

function productImage(product: CatalogProduct) {
  return (
    product.colors[0]?.productImage ||
    product.colors[0]?.thumbnailImage ||
    product.image
  );
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

function getTotalQuantity(sizeQty: Record<string, string | number>): number {
  return Object.values(sizeQty).reduce(
    (total: number, quantity) => total + Number(quantity || 0),
    0,
  );
}

function shortTitle(product: CatalogProduct) {
  return product.title
    .replace(`${product.brand} `, "")
    .replace("BELLA+CANVAS ", "")
    .replace("Port & Co ", "")
    .replace("Gildan - ", "")
    .replace("Gildan ", "")
    .replace("Sport-Tek ", "");
}

export function ScreenPrintEstimator({ products }: ScreenPrintEstimatorProps) {
  const productByStyle = useMemo(
    () => new Map(products.map((product) => [product.style, product])),
    [products],
  );
  const [activeGroup, setActiveGroup] = useState<NavigatorCategory>("tees");
  const [quantity, setQuantity] = useState("24");
  const [frontColors, setFrontColors] = useState("1");
  const [backColors, setBackColors] = useState("0");
  const [minimumMessage, setMinimumMessage] = useState("");
  const [estimates, setEstimates] = useState<Record<string, EstimateState>>({});
  const [detailEstimator, setDetailEstimator] =
    useState<DetailEstimatorState | null>(null);

  const group = navigatorGroups.find((item) => item.id === activeGroup) ?? navigatorGroups[0];
  const activePdf =
    activeGroup === "sweatshirts"
      ? "/Fleece-Navigator-2025-0303Update-SMLinks.pdf"
      : "/Tee-Navigator-2026-0302-SM-Links.pdf";
  const visibleProducts = useMemo(
    () =>
      group.tiers.flatMap((tier) =>
        tier.styles
          .map((style) => productByStyle.get(style))
          .filter((product): product is CatalogProduct => Boolean(product)),
      ),
    [group, productByStyle],
  );
  const normalizedQuantity = Math.max(24, Math.floor(Number(quantity) || 24));

  useEffect(() => {
    let isCancelled = false;

    setEstimates((current) => {
      const next = { ...current };
      visibleProducts.forEach((product) => {
        next[product.style] = { status: "loading" };
      });
      return next;
    });

    async function loadEstimates() {
      for (const product of visibleProducts) {
        try {
          const response = await fetch("/api/pricing/screenprint", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              lineItems: [
                {
                  style: product.style,
                  title: product.title,
                  color: defaultColor(product),
                  sizes: buildDefaultSizes(product, normalizedQuantity),
                  sizeQty: buildDefaultSizes(product, normalizedQuantity),
                },
              ],
              printLines: [
                {
                  id: "front",
                  name: "Front",
                  colors: Number(frontColors),
                },
                {
                  id: "back",
                  name: "Back",
                  colors: Number(backColors),
                },
              ],
              sameDesign: true,
            }),
          });
          const data = (await response.json()) as ScreenprintEstimate;

          if (isCancelled) {
            return;
          }

          if (!response.ok || data.ok === false) {
            setEstimates((current) => ({
              ...current,
              [product.style]: {
                status: "error",
                warning: data.error?.message || "Estimate unavailable",
              },
            }));
            continue;
          }

          setEstimates((current) => ({
            ...current,
            [product.style]: {
              status: "ready",
              each: data.price?.each,
              total: data.price?.retail,
              currency: data.currency,
              warning: data.warnings?.[0],
            },
          }));
        } catch {
          if (isCancelled) {
            return;
          }

          setEstimates((current) => ({
            ...current,
            [product.style]: {
              status: "error",
              warning: "Estimate unavailable",
            },
          }));
        }
      }
    }

    const timeout = window.setTimeout(loadEstimates, 150);

    return () => {
      isCancelled = true;
      window.clearTimeout(timeout);
    };
  }, [backColors, frontColors, normalizedQuantity, visibleProducts]);

  function handleQuantityChange(value: string) {
    const numeric = Number(value);

    if (value && Number.isFinite(numeric) && numeric < 24) {
      setQuantity("24");
      setMinimumMessage(
        "Screen printing usually starts at 24 pieces. For lower quantities, DTF or DTG may be a better option.",
      );
      return;
    }

    setQuantity(value);
    setMinimumMessage("");
  }

  function openDetailEstimator(product: CatalogProduct) {
    setDetailEstimator({
      product,
      color: defaultColor(product),
      sizes: buildDetailSizes(product, normalizedQuantity),
      frontColors,
      backColors,
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
            estimate:
              updates.estimate === undefined ? current.estimate : updates.estimate,
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

  async function requestDetailEstimate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!detailEstimator) {
      return;
    }

    const totalQty = getTotalQuantity(detailEstimator.sizes);

    if (totalQty < 24) {
      updateDetail({
        error:
          "This item is under 24 pieces. You can still add it to the quote basket and combine it with compatible styles using the same artwork.",
        estimate: null,
      });
      return;
    }

    const numericSizes = Object.fromEntries(
      Object.entries(detailEstimator.sizes).map(([size, qty]) => [
        size,
        Number(qty || 0),
      ]),
    );

    updateDetail({ isLoading: true, error: "", estimate: null });

    try {
      const response = await fetch("/api/pricing/screenprint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lineItems: [
            {
              style: detailEstimator.product.style,
              title: detailEstimator.product.title,
              color: detailEstimator.color,
              sizes: numericSizes,
              sizeQty: numericSizes,
            },
          ],
          printLines: [
            {
              id: "front",
              name: "Front",
              colors: Number(detailEstimator.frontColors),
            },
            {
              id: "back",
              name: "Back",
              colors: Number(detailEstimator.backColors),
            },
          ],
          sameDesign: true,
        }),
      });
      const data = (await response.json()) as ScreenprintEstimate;

      if (!response.ok || data.ok === false) {
        updateDetail({
          error: data.error?.message || "Estimate unavailable.",
          estimate: null,
          isLoading: false,
        });
        return;
      }

      updateDetail({ estimate: data, isLoading: false });
    } catch {
      updateDetail({
        error: "Estimate unavailable. Please try again.",
        estimate: null,
        isLoading: false,
      });
    }
  }

  function addDetailToBasket() {
    if (!detailEstimator) {
      return;
    }

    const sizes = Object.fromEntries(
      Object.entries(detailEstimator.sizes).map(([size, qty]) => [
        size,
        Number(qty || 0),
      ]),
    );
    const totalQty = getTotalQuantity(sizes);

    if (totalQty <= 0) {
      updateDetail({
        error: "Please enter at least one garment quantity.",
      });
      return;
    }

    const item: QuoteBasketItem = {
      id: `${detailEstimator.product.style}-${Date.now()}-${Math.random()
        .toString(16)
        .slice(2)}`,
      productName: detailEstimator.product.title,
      style: detailEstimator.product.style,
      brand: detailEstimator.product.brand,
      color: detailEstimator.color,
      sizes,
      quantity: totalQty,
      frontColors: detailEstimator.frontColors,
      backColors: detailEstimator.backColors,
      estimatedEach: detailEstimator.estimate?.price?.each,
      estimatedTotal: detailEstimator.estimate?.price?.retail,
    };

    addItemToFloatingQuoteBasket(item);
    setDetailEstimator(null);
  }

  return (
    <section className="px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[96rem] overflow-hidden rounded-sm bg-[#f4f8fc] shadow-[0_24px_70px_rgba(7,17,31,0.16)] ring-1 ring-black/10">
        <div className="relative bg-[#07111f] p-5 text-white sm:p-7 lg:p-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-accent" />
          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr] xl:items-end">
            <div>
              <p className="eyebrow text-accent">Screen print navigator</p>
              <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.94] text-white sm:text-5xl">
                Quick live price guide.
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#d6e3f0]">
                Built like a product navigator, with live pricing added. Start
                with an estimated quantity and print color count, compare
                screen-print-friendly options, then open a detailed estimate
                when you are ready for sizes and exact colors.
              </p>
            </div>

            <div className="grid gap-3 rounded-sm border border-white/10 bg-white/[0.04] p-4 md:grid-cols-[1fr_1fr_1fr_auto]">
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-[#9fb4c8]">
                  Estimated quantity
                </span>
                <input
                  type="number"
                  min={24}
                  value={quantity}
                  onChange={(event) => handleQuantityChange(event.target.value)}
                  className="mt-2 h-11 w-full rounded-md border border-white/14 bg-white px-3 text-sm font-black text-[#07111f]"
                />
              </label>
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-[#9fb4c8]">
                  Front colors
                </span>
                <select
                  value={frontColors}
                  onChange={(event) => setFrontColors(event.target.value)}
                  className="mt-2 h-11 w-full rounded-md border border-white/14 bg-white px-3 text-sm font-black text-[#07111f]"
                >
                  {frontColorOptions.map((count) => (
                    <option key={count} value={count}>
                      {count} {count === "1" ? "color" : "colors"}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-[#9fb4c8]">
                  Back colors
                </span>
                <select
                  value={backColors}
                  onChange={(event) => setBackColors(event.target.value)}
                  className="mt-2 h-11 w-full rounded-md border border-white/14 bg-white px-3 text-sm font-black text-[#07111f]"
                >
                  {backColorOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex flex-col gap-2 md:pt-6">
                <Link
                  href="/custom-catalog"
                  className="rounded-md bg-accent px-4 py-3 text-center text-xs font-black uppercase tracking-wide text-white transition hover:bg-[#2a86d8]"
                >
                  Full catalog
                </Link>
                <a
                  href={activePdf}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border border-white/22 px-4 py-3 text-center text-xs font-black uppercase tracking-wide text-white transition hover:border-accent hover:bg-accent/10"
                >
                  PDF
                </a>
              </div>
            </div>
          </div>

          {minimumMessage ? (
            <p className="mt-4 rounded-md border border-[#50a8ff]/30 bg-[#eef6ff] p-3 text-xs font-bold leading-5 text-[#125b99]">
              {minimumMessage}
            </p>
          ) : null}
          <button
            type="button"
            onClick={openFloatingQuoteBasket}
            className="mt-4 rounded-md border border-white/20 px-5 py-3 text-xs font-black uppercase tracking-wide text-white transition hover:border-accent hover:bg-accent/10"
          >
            Open quote basket
          </button>
        </div>

        <div className="bg-[#f4f8fc] p-5 sm:p-7">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
                  {group.eyebrow}
                </p>
                <h3 className="mt-3 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.94] text-[#07111f] sm:text-5xl">
                  {group.label} good, better, best.
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#52677d]">
                  {group.summary}
                </p>
              </div>
              <div className="flex rounded-md border border-[#c9d7e6] bg-white p-1 shadow-[0_12px_30px_rgba(7,17,31,0.08)]">
                {navigatorGroups.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveGroup(item.id)}
                    className={[
                      "rounded px-4 py-2 text-xs font-black uppercase tracking-wide transition",
                      activeGroup === item.id
                        ? "bg-accent text-white"
                        : "text-[#52677d] hover:text-accent",
                    ].join(" ")}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-sm bg-white p-4 text-sm font-semibold leading-6 text-[#52677d] shadow-[0_12px_30px_rgba(7,17,31,0.08)] ring-1 ring-black/8">
              Prices use an even size split for quick comparison. Exact sizes,
              garment colors, and quote cart details come next when a customer
              opens a detailed estimate.
            </div>

            <div className="mt-6 grid gap-5">
              {group.tiers.map((tier) => (
                <section
                  key={tier.id}
                  className="overflow-hidden rounded-sm bg-white shadow-[0_18px_46px_rgba(7,17,31,0.08)] ring-1 ring-black/8"
                >
                  <div className="grid gap-px bg-[#d7e3ee]">
                    <div className="flex flex-col gap-3 bg-[#07111f] p-5 text-white md:flex-row md:items-end md:justify-between">
                      <div>
                      <p className="text-xs font-black uppercase tracking-[0.24em] text-[#50a8ff]">
                        {tier.label}
                      </p>
                      <h4 className="mt-2 text-2xl font-black uppercase leading-7">
                        {tier.headline}
                      </h4>
                      </div>
                      <p className="mt-3 text-sm font-semibold leading-6 text-white/70">
                        {tier.description}
                      </p>
                    </div>
                    <div className="grid gap-px bg-[#d7e3ee] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                      {tier.styles.map((style) => {
                        const product = productByStyle.get(style);

                        if (!product) {
                          return null;
                        }

                        const estimate = estimates[product.style];
                        const image = productImage(product);

                        return (
                          <article key={product.style} className="bg-white p-4">
                            <div className="relative aspect-[1.15] rounded bg-[#eef2f6]">
                              {image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={image}
                                  alt={product.title}
                                  className="h-full w-full object-contain p-4"
                                  loading="lazy"
                                />
                              ) : null}
                            </div>
                            <p className="mt-4 text-[0.68rem] font-black uppercase tracking-wide text-accent">
                              {product.brand} - {product.style}
                            </p>
                            <h5 className="mt-1 min-h-10 text-sm font-black leading-5 text-[#07111f]">
                              {shortTitle(product)}
                            </h5>
                            <div className="mt-3 flex -space-x-1">
                              {product.colors.slice(0, 7).map((color) => (
                                <span
                                  key={color.name}
                                  title={color.name}
                                  className="h-5 w-5 overflow-hidden rounded-full border border-white bg-[#d8e1ea] shadow-sm ring-1 ring-black/10"
                                >
                                  {color.swatchImage ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                      src={color.swatchImage}
                                      alt=""
                                      className="h-full w-full object-cover"
                                      loading="lazy"
                                    />
                                  ) : null}
                                </span>
                              ))}
                              {product.colors.length > 7 ? (
                                <span className="grid h-5 w-5 place-items-center rounded-full bg-[#07111f] text-[0.55rem] font-black text-white">
                                  +
                                </span>
                              ) : null}
                            </div>
                            <div className="mt-4 rounded-md bg-[#07111f] px-4 py-3 text-white">
                              <p className="text-[0.66rem] font-black uppercase tracking-[0.16em] text-[#9fc8ef]">
                                Quick price
                              </p>
                              <p className="mt-1 text-lg font-black">
                                {estimate?.status === "ready"
                                  ? `${formatPrice(estimate.each, estimate.currency)} ea`
                                  : estimate?.status === "loading"
                                    ? "Loading..."
                                    : "Request pricing"}
                              </p>
                              <p className="mt-1 text-[0.66rem] font-black uppercase tracking-wide text-white/58">
                                {normalizedQuantity} pcs
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => openDetailEstimator(product)}
                              className="mt-3 block rounded-md border border-black/10 px-3 py-2 text-center text-xs font-black uppercase text-[#07111f] transition hover:border-accent hover:text-accent"
                            >
                              Get detailed estimate
                            </button>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </div>
      </div>
      {detailEstimator ? (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-black/60 px-4 py-6">
          <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-sm bg-white shadow-[0_24px_90px_rgba(0,0,0,0.38)]">
            <div className="flex items-start justify-between gap-4 border-b border-black/10 p-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
                  Detailed estimate
                </p>
                <h3 className="mt-2 text-2xl font-black uppercase leading-7 text-[#07111f]">
                  {detailEstimator.product.brand} {detailEstimator.product.style}
                </h3>
                <p className="mt-1 text-sm font-bold text-[#52677d]">
                  {detailEstimator.product.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDetailEstimator(null)}
                className="rounded-full border border-black/10 px-3 py-1 text-sm font-black text-[#07111f] transition hover:border-accent hover:text-accent"
              >
                X
              </button>
            </div>
            <div className="grid gap-px bg-[#d7e3ee] lg:grid-cols-[1fr_0.8fr]">
              <form onSubmit={requestDetailEstimate} className="bg-white p-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6a7480]">
                    Product color
                  </p>
                  <div className="mt-2 rounded-md border border-black/12 bg-[#f7f8fa] p-3">
                    <p className="text-sm font-black text-[#07111f]">
                      {detailEstimator.color}
                    </p>
                    <div className="mt-3 grid max-h-64 grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">
                      {detailEstimator.product.colors.map((productColor) => (
                        <button
                          key={productColor.name}
                          type="button"
                          onClick={() =>
                            updateDetail({
                              color: productColor.name,
                              estimate: null,
                              error: "",
                            })
                          }
                          className={[
                            "flex min-h-11 items-center gap-2 rounded-md border px-2 py-2 text-left text-xs font-black text-[#07111f] transition",
                            detailEstimator.color === productColor.name
                              ? "border-accent bg-[#eef6ff] shadow-[0_0_0_2px_rgba(31,115,190,0.14)]"
                              : "border-black/10 bg-white hover:border-accent/55",
                          ].join(" ")}
                        >
                          <span className="h-6 w-6 shrink-0 overflow-hidden rounded-full border border-black/15 bg-white">
                            {productColor.swatchImage ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={productColor.swatchImage}
                                alt=""
                                className="h-full w-full object-cover"
                                loading="lazy"
                              />
                            ) : null}
                          </span>
                          <span className="leading-4">{productColor.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6a7480]">
                    Size quantities
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {Object.entries(detailEstimator.sizes).map(([size, qty]) => (
                      <label key={size} className="block">
                        <span className="text-xs font-black uppercase text-[#6a7480]">
                          {size}
                        </span>
                        <input
                          type="number"
                          min={0}
                          value={qty}
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
                      {frontColorOptions.map((count) => (
                        <option key={count} value={count}>
                          {count} {count === "1" ? "color" : "colors"}
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
                      {backColorOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mt-5 rounded-md bg-[#eef6ff] p-4 text-sm font-bold leading-6 text-[#125b99]">
                  Item quantity: {getTotalQuantity(detailEstimator.sizes)}. If
                  this item is under 24, add it to the basket and continue
                  adding compatible styles that use the same artwork and setup.
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <button
                    type="submit"
                    disabled={detailEstimator.isLoading}
                    className="rounded-md bg-accent px-5 py-4 text-sm font-black uppercase text-white transition hover:bg-[#2a86d8] disabled:cursor-wait disabled:opacity-70"
                  >
                    {detailEstimator.isLoading ? "Getting estimate..." : "Get estimate"}
                  </button>
                  <button
                    type="button"
                    onClick={addDetailToBasket}
                    className="rounded-md border border-black/12 px-5 py-4 text-sm font-black uppercase text-[#07111f] transition hover:border-accent hover:text-accent"
                  >
                    Add to quote basket
                  </button>
                </div>

                {detailEstimator.error ? (
                  <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm font-bold leading-6 text-amber-800">
                    {detailEstimator.error}
                  </p>
                ) : null}
              </form>
              <div className="bg-[#eef4fa] p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
                  Estimate
                </p>
                {detailEstimator.estimate ? (
                  <div className="mt-5 rounded-md bg-white p-5 ring-1 ring-black/8">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#678197]">
                      Estimated total
                    </p>
                    <p className="mt-2 text-4xl font-black text-[#07111f]">
                      {formatPrice(detailEstimator.estimate.price?.retail)}
                    </p>
                    <p className="mt-2 text-sm font-black uppercase tracking-wide text-[#52677d]">
                      Each: {formatPrice(detailEstimator.estimate.price?.each)}
                    </p>
                  </div>
                ) : (
                  <p className="mt-5 rounded-md border border-dashed border-[#b5c6d6] bg-white/70 p-5 text-sm leading-7 text-[#52677d]">
                    Add sizes and get an estimate, or add the item to the quote
                    basket if you are still building toward 24 pieces.
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
