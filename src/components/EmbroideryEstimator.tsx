"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  addItemToFloatingQuoteBasket,
  openFloatingQuoteBasket,
  type QuoteBasketItem,
} from "@/components/FloatingQuoteBasket";
import type { CatalogProduct } from "@/data/sanmarCatalog.generated";
import { embroideryMinimumQuantity } from "@/lib/catalog-embroidery";

type EmbroideryEstimatorProps = {
  products: CatalogProduct[];
};

type NavigatorCategory = "polos" | "wovens" | "headwear" | "bags";

type NavigatorGroup = {
  id: NavigatorCategory;
  label: string;
  eyebrow: string;
  summary: string;
  pdf: string;
  category: string;
};

type EstimateState = {
  status: "loading" | "ready" | "error";
  each?: number | string;
  total?: number | string;
  currency?: string;
  warning?: string;
};

type EmbroideryEstimate = {
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
    location?: {
      placement?: string;
      stitchCount?: number | string;
      threadColors?: number | string;
      puff3mm?: boolean;
    };
    options?: {
      digitizingRequired?: boolean;
      names?: { enabled?: boolean; large?: boolean };
      numbers?: { enabled?: boolean; large?: boolean };
    };
  };
  warnings?: string[];
  error?: {
    message?: string;
  };
};

type DetailEstimatorState = {
  product: CatalogProduct;
  color: string;
  sizes: Record<string, string>;
  placement: string;
  stitchCount: string;
  threadColors: string;
  digitizingRequired: boolean;
  puff3mm: boolean;
  namesEnabled: boolean;
  numbersEnabled: boolean;
  sameDesign: boolean;
  estimate: EmbroideryEstimate | null;
  error: string;
  isLoading: boolean;
};

const preferredSizes = ["S", "M", "L", "XL", "2XL", "3XL"];
const placementOptions = [
  "Left Chest",
  "Right Chest",
  "Hat Front",
  "Bag Front",
  "Sleeve",
];
const stitchCountOptions = ["5000", "8000", "10000", "12000", "15000"];
const threadColorOptions = ["1", "2", "3", "4", "5", "6", "8"];

const navigatorGroups: NavigatorGroup[] = [
  {
    id: "polos",
    label: "Polos",
    eyebrow: "Polo navigator",
    summary:
      "Popular polos and knits for company uniforms, schools, golf events, and staff apparel.",
    pdf: "/2026-Polo-Navigator-SM-Links.pdf",
    category: "Polos/Knits",
  },
  {
    id: "wovens",
    label: "Wovens",
    eyebrow: "Dress shirt navigator",
    summary:
      "Button-down and woven shirts that look sharp with a left chest embroidered logo.",
    pdf: "/2025-Wovens-Navigator-0316Update-SM-Links.pdf",
    category: "Woven Shirts",
  },
  {
    id: "headwear",
    label: "Headwear",
    eyebrow: "Headwear navigator",
    summary:
      "Caps, beanies, and structured headwear for teams, crews, shops, and events.",
    pdf: "/Headwear-Navigator-2025-FINAL-1106Update-SM.pdf",
    category: "Caps",
  },
  {
    id: "bags",
    label: "Bags",
    eyebrow: "Bags navigator",
    summary:
      "Backpacks, totes, duffels, and everyday bags for schools, events, and business gifts.",
    pdf: "/BagsNavigator-2025-0317Update-SM-Links.pdf",
    category: "Bags",
  },
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

function shortDescription(description: string) {
  if (description.length <= 150) {
    return description;
  }

  return `${description.slice(0, 147).trim()}...`;
}

function productSizeOrder(product: CatalogProduct) {
  const normalized = product.sizes.length ? product.sizes : preferredSizes;
  const preferred = preferredSizes.filter((size) => normalized.includes(size));
  const rest = normalized.filter((size) => !preferred.includes(size));

  return [...preferred, ...rest].slice(0, 8);
}

function normalizeQuantity(value: string | number) {
  const numeric = Number(value);
  return Number.isFinite(numeric)
    ? Math.max(embroideryMinimumQuantity, Math.floor(numeric))
    : embroideryMinimumQuantity;
}

function buildDefaultSizes(product: CatalogProduct, quantity: number) {
  const sizes = productSizeOrder(product);
  const activeSizes = sizes.filter((size) =>
    ["S", "M", "L", "XL"].includes(size),
  );
  const distributionSizes = activeSizes.length ? activeSizes : sizes.slice(0, 1);
  const result = Object.fromEntries(sizes.map((size) => [size, 0]));

  distributionSizes.forEach((size, index) => {
    result[size] =
      Math.floor(quantity / distributionSizes.length) +
      (index < quantity % distributionSizes.length ? 1 : 0);
  });

  return result;
}

function buildDetailSizes(product: CatalogProduct, quantity: number) {
  return Object.fromEntries(
    Object.entries(buildDefaultSizes(product, quantity)).map(([size, qty]) => [
      size,
      String(qty),
    ]),
  );
}

function getTotalQuantity(sizeQty: Record<string, string | number>): number {
  return Object.values(sizeQty).reduce(
    (total: number, quantity) => total + Number(quantity || 0),
    0,
  );
}

function numericSizeQuantities(sizes: Record<string, string | number>) {
  return Object.fromEntries(
    Object.entries(sizes).map(([size, quantity]) => [
      size,
      Math.max(0, Math.floor(Number(quantity || 0))),
    ]),
  ) as Record<string, number>;
}

function buildEmbroideryPayload({
  product,
  color,
  sizeQuantities,
  placement,
  stitchCount,
  threadColors,
  digitizingRequired,
  puff3mm,
  namesEnabled,
  numbersEnabled,
  sameDesign,
}: {
  product: CatalogProduct;
  color: string;
  sizeQuantities: Record<string, number>;
  placement: string;
  stitchCount: number;
  threadColors: number;
  digitizingRequired: boolean;
  puff3mm: boolean;
  namesEnabled: boolean;
  numbersEnabled: boolean;
  sameDesign: boolean;
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
    locations: [
      {
        placement,
        stitchCount,
        threadColors,
        puff3mm,
      },
    ],
    options: {
      digitizingRequired,
      names: {
        enabled: namesEnabled,
        large: false,
      },
      numbers: {
        enabled: numbersEnabled,
        large: false,
      },
    },
    sameDesign,
  };
}

async function requestEmbroideryEstimate(payload: unknown) {
  const response = await fetch("/api/pricing/embroidery", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = (await response.json()) as EmbroideryEstimate;

  if (!response.ok || data.ok === false) {
    throw new Error(data.error?.message || "Estimate unavailable.");
  }

  return data;
}

function getEstimateSummary(product: CatalogProduct, estimate: EmbroideryEstimate) {
  const line = estimate.summary?.lineItems?.[0];
  const sizes = line?.sizes
    ? Object.entries(line.sizes)
        .filter(([, quantity]) => Number(quantity) > 0)
        .map(([size, quantity]) => `${size}: ${quantity}`)
        .join(", ")
    : "";
  const location = estimate.summary?.location;

  return [
    line?.style || product.style,
    line?.productName || product.title,
    line?.color ? `Color: ${line.color}` : "",
    sizes,
    location?.placement ? `Placement: ${location.placement}` : "",
    location?.stitchCount ? `${location.stitchCount} stitches` : "",
    location?.threadColors ? `${location.threadColors} thread colors` : "",
  ]
    .filter(Boolean)
    .join(" - ");
}

export function EmbroideryEstimator({ products }: EmbroideryEstimatorProps) {
  const [activeGroup, setActiveGroup] = useState<NavigatorCategory>("polos");
  const [quantity, setQuantity] = useState(String(embroideryMinimumQuantity));
  const [placement, setPlacement] = useState("Left Chest");
  const [stitchCount, setStitchCount] = useState("8000");
  const [threadColors, setThreadColors] = useState("6");
  const [digitizingRequired, setDigitizingRequired] = useState(false);
  const [puff3mm, setPuff3mm] = useState(false);
  const [namesEnabled, setNamesEnabled] = useState(false);
  const [numbersEnabled, setNumbersEnabled] = useState(false);
  const [minimumMessage, setMinimumMessage] = useState("");
  const [estimates, setEstimates] = useState<Record<string, EstimateState>>({});
  const [detailEstimator, setDetailEstimator] =
    useState<DetailEstimatorState | null>(null);

  const group =
    navigatorGroups.find((item) => item.id === activeGroup) ?? navigatorGroups[0];
  const visibleProducts = useMemo(
    () =>
      products
        .filter((product) => product.category === group.category)
        .slice(0, 12),
    [group.category, products],
  );
  const normalizedQuantity = normalizeQuantity(quantity);

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
        const payload = buildEmbroideryPayload({
          product,
          color: defaultColor(product),
          sizeQuantities: buildDefaultSizes(product, normalizedQuantity),
          placement,
          stitchCount: Number(stitchCount),
          threadColors: Number(threadColors),
          digitizingRequired,
          puff3mm,
          namesEnabled,
          numbersEnabled,
          sameDesign: true,
        });

        try {
          const data = await requestEmbroideryEstimate(payload);

          if (isCancelled) {
            return;
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
        } catch (error) {
          if (isCancelled) {
            return;
          }

          setEstimates((current) => ({
            ...current,
            [product.style]: {
              status: "error",
              warning:
                error instanceof Error ? error.message : "Estimate unavailable",
            },
          }));
        }
      }
    }

    const timeout = window.setTimeout(loadEstimates, 200);

    return () => {
      isCancelled = true;
      window.clearTimeout(timeout);
    };
  }, [
    digitizingRequired,
    namesEnabled,
    normalizedQuantity,
    numbersEnabled,
    placement,
    puff3mm,
    stitchCount,
    threadColors,
    visibleProducts,
  ]);

  function handleQuantityChange(value: string) {
    const numeric = Number(value);

    if (value && Number.isFinite(numeric) && numeric < embroideryMinimumQuantity) {
      setQuantity(String(embroideryMinimumQuantity));
      setMinimumMessage(
        "Embroidery estimates start at 5 pieces. For single pieces or very small runs, send us the project and we can review options.",
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
      placement,
      stitchCount,
      threadColors,
      digitizingRequired,
      puff3mm,
      namesEnabled,
      numbersEnabled,
      sameDesign: true,
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

    if (totalQty < embroideryMinimumQuantity) {
      updateDetail({
        error: "Embroidery estimates start at 5 pieces.",
        estimate: null,
      });
      return;
    }

    updateDetail({ isLoading: true, error: "", estimate: null });

    try {
      const estimate = await requestEmbroideryEstimate(
        buildEmbroideryPayload({
          product: detailEstimator.product,
          color: detailEstimator.color,
          sizeQuantities: numericSizeQuantities(detailEstimator.sizes),
          placement: detailEstimator.placement,
          stitchCount: Number(detailEstimator.stitchCount),
          threadColors: Number(detailEstimator.threadColors),
          digitizingRequired: detailEstimator.digitizingRequired,
          puff3mm: detailEstimator.puff3mm,
          namesEnabled: detailEstimator.namesEnabled,
          numbersEnabled: detailEstimator.numbersEnabled,
          sameDesign: detailEstimator.sameDesign,
        }),
      );

      updateDetail({ estimate, isLoading: false });
    } catch (error) {
      updateDetail({
        error:
          error instanceof Error
            ? error.message
            : "Estimate unavailable. Please try again.",
        estimate: null,
        isLoading: false,
      });
    }
  }

  function addDetailToBasket() {
    if (!detailEstimator) {
      return;
    }

    const sizes = numericSizeQuantities(detailEstimator.sizes);
    const totalQty = getTotalQuantity(sizes);

    if (totalQty <= 0) {
      updateDetail({ error: "Please enter at least one item quantity." });
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
      service: "Embroidery",
      frontColors: "Embroidery",
      backColors: "0",
      decorationSummary: [
        detailEstimator.placement,
        `${Number(detailEstimator.stitchCount).toLocaleString("en-US")} stitches`,
        `${detailEstimator.threadColors} thread colors`,
        detailEstimator.digitizingRequired ? "Digitizing needed" : "",
        detailEstimator.puff3mm ? "3D puff" : "",
        detailEstimator.namesEnabled ? "Names" : "",
        detailEstimator.numbersEnabled ? "Numbers" : "",
      ]
        .filter(Boolean)
        .join(" / "),
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
          <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr] xl:items-end">
            <div>
              <p className="eyebrow text-accent">Embroidery navigator</p>
              <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.94] text-white sm:text-5xl">
                Quick live price guide.
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#d6e3f0]">
                Compare popular polos, dress shirts, hats, and bags with live
                embroidery estimates from the pricing app. Start with stitch
                count and thread colors, then open a detailed estimate when you
                are ready for sizes and exact color.
              </p>
            </div>

            <div className="grid gap-3 rounded-sm border border-white/10 bg-white/[0.04] p-4 md:grid-cols-2 xl:grid-cols-5">
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-[#9fb4c8]">
                  Estimated quantity
                </span>
                <input
                  type="number"
                  min={embroideryMinimumQuantity}
                  value={quantity}
                  onChange={(event) => handleQuantityChange(event.target.value)}
                  className="mt-2 h-11 w-full rounded-md border border-white/14 bg-white px-3 text-sm font-black text-[#07111f]"
                />
              </label>
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-[#9fb4c8]">
                  Placement
                </span>
                <select
                  value={placement}
                  onChange={(event) => setPlacement(event.target.value)}
                  className="mt-2 h-11 w-full rounded-md border border-white/14 bg-white px-3 text-sm font-black text-[#07111f]"
                >
                  {placementOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-[#9fb4c8]">
                  Stitch count
                </span>
                <select
                  value={stitchCount}
                  onChange={(event) => setStitchCount(event.target.value)}
                  className="mt-2 h-11 w-full rounded-md border border-white/14 bg-white px-3 text-sm font-black text-[#07111f]"
                >
                  {stitchCountOptions.map((option) => (
                    <option key={option} value={option}>
                      {Number(option).toLocaleString("en-US")}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-[#9fb4c8]">
                  Thread colors
                </span>
                <select
                  value={threadColors}
                  onChange={(event) => setThreadColors(event.target.value)}
                  className="mt-2 h-11 w-full rounded-md border border-white/14 bg-white px-3 text-sm font-black text-[#07111f]"
                >
                  {threadColorOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                onClick={openFloatingQuoteBasket}
                className="h-11 self-end rounded-md border border-white/20 px-4 text-xs font-black uppercase text-white transition hover:border-accent hover:bg-accent/20"
              >
                Basket
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Digitizing needed",
                checked: digitizingRequired,
                setter: setDigitizingRequired,
              },
              { label: "3D puff", checked: puff3mm, setter: setPuff3mm },
              { label: "Names", checked: namesEnabled, setter: setNamesEnabled },
              {
                label: "Numbers",
                checked: numbersEnabled,
                setter: setNumbersEnabled,
              },
            ].map((option) => (
              <label
                key={option.label}
                className="flex h-11 cursor-pointer items-center justify-between rounded-md border border-white/10 bg-white/[0.04] px-3 text-xs font-black uppercase tracking-wide text-[#d6e3f0]"
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

          {minimumMessage ? (
            <p className="mt-4 rounded-md border border-[#387fbd] bg-[#0b2238] p-3 text-xs font-bold leading-5 text-[#cfe8ff]">
              {minimumMessage}
            </p>
          ) : null}
        </div>

        <div className="grid gap-px bg-[#d7e3ee] lg:grid-cols-[17rem_1fr]">
          <aside className="bg-[#0a1627] p-5 text-white">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
              Navigator
            </p>
            <div className="mt-4 grid gap-2">
              {navigatorGroups.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveGroup(item.id)}
                  className={[
                    "rounded-md border px-4 py-3 text-left text-xs font-black uppercase tracking-wide transition",
                    activeGroup === item.id
                      ? "border-accent bg-accent text-white"
                      : "border-white/10 bg-white/[0.03] text-[#cfe0f1] hover:border-accent/60",
                  ].join(" ")}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <a
              href={group.pdf}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex rounded-md border border-white/18 px-4 py-3 text-xs font-black uppercase text-white transition hover:border-accent hover:bg-accent/12"
            >
              Open {group.label} PDF
            </a>
            <Link
              href="/custom-catalog?service=embroidery"
              className="mt-3 inline-flex rounded-md bg-white px-4 py-3 text-xs font-black uppercase text-[#07111f] transition hover:bg-[#d8ecff]"
            >
              Full catalog
            </Link>
          </aside>

          <div className="bg-[#f4f8fc] p-5 sm:p-7">
            <div className="mb-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
                {group.eyebrow}
              </p>
              <h3 className="mt-2 text-3xl font-black uppercase text-[#07111f]">
                {group.label}
              </h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#52677d]">
                {group.summary}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleProducts.map((product) => {
                const estimate = estimates[product.style];
                const image = productImage(product);

                return (
                  <article
                    key={product.style}
                    className="overflow-hidden rounded-sm bg-white shadow-[0_16px_42px_rgba(7,17,31,0.08)] ring-1 ring-black/8"
                  >
                    <Link
                      href={`/custom-catalog/${encodeURIComponent(product.style)}`}
                      className="block"
                    >
                      <div className="relative aspect-[1.08] bg-[#eef2f6]">
                        {image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={image}
                            alt={product.title}
                            className="h-full w-full object-contain p-5 transition duration-500 hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="grid h-full place-items-center p-6 text-center text-sm font-black uppercase tracking-[0.16em] text-[#9aa5b1]">
                            Image coming soon
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-black uppercase tracking-[0.14em] text-accent">
                              {product.brand}
                            </p>
                            <h4 className="mt-2 text-lg font-black leading-6 text-[#07111f]">
                              {product.title}
                            </h4>
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
                            Embroidery estimate
                          </p>
                          <p className="mt-1 text-sm font-black">
                            {estimate?.status === "ready"
                              ? `${formatPrice(estimate.each)} each`
                              : estimate?.status === "loading"
                                ? "Loading estimate..."
                                : "Estimate unavailable"}
                          </p>
                          <p className="mt-1 text-[0.66rem] font-black uppercase tracking-wide text-white/58">
                            5 pc minimum / based on current settings
                          </p>
                        </div>
                      </div>
                    </Link>
                    <div className="grid gap-2 px-5 pb-5">
                      <button
                        type="button"
                        onClick={() => openDetailEstimator(product)}
                        className="rounded-md bg-accent px-4 py-3 text-xs font-black uppercase text-white transition hover:bg-[#2a86d8]"
                      >
                        Get price now
                      </button>
                      <Link
                        href={`/custom-catalog/${encodeURIComponent(product.style)}`}
                        className="rounded-md border border-black/10 px-4 py-2 text-center text-xs font-black uppercase text-[#07111f] transition hover:border-accent hover:text-accent"
                      >
                        Details
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {detailEstimator ? (
        <div className="fixed inset-0 z-[80] overflow-y-auto bg-black/60 px-5 py-8">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-sm bg-white shadow-[0_24px_90px_rgba(0,0,0,0.38)]">
            <div className="flex items-start justify-between gap-4 border-b border-black/10 p-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
                  Embroidery estimate
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
              <form onSubmit={requestDetailEstimate} className="bg-white p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6a7480]">
                      Product color
                    </p>
                    <div className="mt-2 grid max-h-44 gap-2 overflow-y-auto rounded-md border border-black/12 bg-[#f7f8fa] p-2">
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
                            "flex items-center gap-3 rounded-md border px-3 py-2 text-left text-sm font-bold transition",
                            detailEstimator.color === productColor.name
                              ? "border-accent bg-white text-[#07111f] shadow-sm"
                              : "border-transparent text-[#314154] hover:border-black/10 hover:bg-white",
                          ].join(" ")}
                        >
                          <span className="grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded-full border border-black/12 bg-white">
                            {productColor.swatchImage ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={productColor.swatchImage}
                                alt={`${productColor.name} swatch`}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="h-full w-full bg-[#d8dde4]" />
                            )}
                          </span>
                          <span>{productColor.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-4">
                    <label className="block">
                      <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6a7480]">
                        Placement
                      </span>
                      <select
                        value={detailEstimator.placement}
                        onChange={(event) =>
                          updateDetail({
                            placement: event.target.value,
                            estimate: null,
                            error: "",
                          })
                        }
                        className="mt-2 h-11 w-full rounded-md border border-black/12 bg-[#f7f8fa] px-3 text-sm font-semibold text-[#07111f]"
                      >
                        {placementOptions.map((option) => (
                          <option key={option}>{option}</option>
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
                      Stitch count
                    </span>
                    <select
                      value={detailEstimator.stitchCount}
                      onChange={(event) =>
                        updateDetail({
                          stitchCount: event.target.value,
                          estimate: null,
                          error: "",
                        })
                      }
                      className="mt-2 h-11 w-full rounded-md border border-black/12 bg-[#f7f8fa] px-3 text-sm font-semibold text-[#07111f]"
                    >
                      {stitchCountOptions.map((option) => (
                        <option key={option} value={option}>
                          {Number(option).toLocaleString("en-US")}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6a7480]">
                      Thread colors
                    </span>
                    <select
                      value={detailEstimator.threadColors}
                      onChange={(event) =>
                        updateDetail({
                          threadColors: event.target.value,
                          estimate: null,
                          error: "",
                        })
                      }
                      className="mt-2 h-11 w-full rounded-md border border-black/12 bg-[#f7f8fa] px-3 text-sm font-semibold text-[#07111f]"
                    >
                      {threadColorOptions.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    {
                      label: "Digitizing needed",
                      key: "digitizingRequired" as const,
                      checked: detailEstimator.digitizingRequired,
                    },
                    {
                      label: "3D puff",
                      key: "puff3mm" as const,
                      checked: detailEstimator.puff3mm,
                    },
                    {
                      label: "Names",
                      key: "namesEnabled" as const,
                      checked: detailEstimator.namesEnabled,
                    },
                    {
                      label: "Numbers",
                      key: "numbersEnabled" as const,
                      checked: detailEstimator.numbersEnabled,
                    },
                  ].map((option) => (
                    <label
                      key={option.label}
                      className="flex h-11 cursor-pointer items-center justify-between rounded-md border border-black/12 bg-[#f7f8fa] px-3 text-xs font-black uppercase tracking-wide text-[#314154]"
                    >
                      <span>{option.label}</span>
                      <input
                        type="checkbox"
                        checked={option.checked}
                        onChange={(event) =>
                          updateDetail({
                            [option.key]: event.target.checked,
                            estimate: null,
                            error: "",
                          })
                        }
                        className="h-5 w-5 accent-[#1f73be]"
                      />
                    </label>
                  ))}
                </div>

                <p className="mt-3 text-xs font-semibold leading-5 text-[#65717e]">
                  Pricing shown is an estimate and may be adjusted after artwork
                  and production review.
                </p>

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
                      onClick={addDetailToBasket}
                      className="rounded-md bg-[#07111f] px-5 py-4 text-sm font-black uppercase text-white transition hover:bg-accent"
                    >
                      Add to quote basket
                    </button>
                  </div>
                ) : (
                  <div className="mt-5 grid gap-4">
                    <p className="rounded-md border border-dashed border-[#b5c6d6] bg-white/70 p-5 text-sm leading-7 text-[#52677d]">
                      Enter exact color, sizes, placement, and embroidery
                      details to request a live estimate, or add this item to
                      the quote basket and keep browsing.
                    </p>
                    <button
                      type="button"
                      onClick={addDetailToBasket}
                      className="rounded-md bg-[#07111f] px-5 py-4 text-sm font-black uppercase text-white transition hover:bg-accent"
                    >
                      Add to quote basket
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
