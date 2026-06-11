"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  addItemToFloatingQuoteBasket,
  type QuoteBasketItem,
} from "@/components/FloatingQuoteBasket";
import { ApparelSizePriceBreakdownList } from "@/components/ApparelSizePriceBreakdown";
import type { CatalogProduct } from "@/data/sanmarCatalog.generated";
import {
  extractApiSizePriceBreakdown,
  loadGroupedSizePriceBreakdown,
  type ApparelSizePriceBreakdown,
} from "@/lib/apparel-size-breakdown";
import { embroideryMinimumQuantity } from "@/lib/catalog-embroidery";
import { screenPrintMinimumQuantity } from "@/lib/catalog-screenprint";

type ProductCatalogQuoteButtonProps = {
  product: CatalogProduct;
};

type PricingService = "screenprint" | "embroidery" | "dtf";

type ScreenprintEstimate = {
  ok?: boolean;
  price?: {
    retail?: number | string;
    each?: number | string;
  };
  currency?: string;
  summary?: {
    sizePriceBreakdown?: unknown;
  };
  warnings?: string[];
  error?: {
    message?: string;
  };
};

type DetailEstimatorState = {
  service: PricingService;
  color: string;
  sizes: Record<string, string>;
  frontColors: string;
  backColors: string;
  dtfFrontPreset: string;
  dtfBackPreset: string;
  dtfLeftSleeve: boolean;
  dtfRightSleeve: boolean;
  placement: string;
  stitchCount: string;
  threadColors: string;
  digitizingRequired: boolean;
  puff3mm: boolean;
  namesEnabled: boolean;
  numbersEnabled: boolean;
  estimate: ScreenprintEstimate | null;
  sizePriceBreakdown: ApparelSizePriceBreakdown[];
  error: string;
  isLoading: boolean;
};

const preferredSizes = ["S", "M", "L", "XL", "2XL", "3XL"];
const dtfMinimumQuantity = 1;
const frontColorOptions = ["1", "2", "3", "4", "dtf"];
const stitchCountOptions = ["5000", "8000", "10000", "12000", "15000"];
const threadColorOptions = ["1", "2", "3", "4", "5", "6", "8"];
const dtfLocationOptions = [
  { label: "Full Front", value: "front", width: 10, height: 12 },
  { label: "Full Back", value: "back", width: 10, height: 12 },
  { label: "Left Chest", value: "leftChest", width: 4, height: 4 },
  { label: "Left Sleeve", value: "leftSleeve", width: 3, height: 12 },
  { label: "Right Sleeve", value: "rightSleeve", width: 3, height: 12 },
];
const frontPrintPresetOptions = [
  { label: "None", value: "none" },
  { label: "Full Front", value: "front" },
  { label: "Left Chest", value: "leftChest" },
];
const backPrintPresetOptions = [
  { label: "None", value: "none" },
  { label: "Full Back", value: "back" },
];
const placementOptions = [
  "Left Chest",
  "Right Chest",
  "Hat Front",
  "Bag Front",
  "Sleeve",
];
const backColorOptions = [
  { label: "No back print", value: "0" },
  { label: "1 color", value: "1" },
  { label: "2 colors", value: "2" },
  { label: "3 colors", value: "3" },
  { label: "4 colors", value: "4" },
  { label: "More than 4 colors - choose DTF", value: "dtf" },
];

function defaultColor(product: CatalogProduct) {
  return product.colors[0]?.name || "";
}

function productSizeOrder(product: CatalogProduct) {
  const normalized = product.sizes.length ? product.sizes : preferredSizes;
  const preferred = preferredSizes.filter((size) => normalized.includes(size));
  const rest = normalized.filter((size) => !preferred.includes(size));
  return [...preferred, ...rest].slice(0, 8);
}

function buildEmptySizes(product: CatalogProduct) {
  return Object.fromEntries(productSizeOrder(product).map((size) => [size, "0"]));
}

function numericSizeQuantities(sizes: Record<string, string | number>) {
  return Object.fromEntries(
    Object.entries(sizes).map(([size, quantity]) => [
      size,
      Math.max(0, Math.floor(Number(quantity || 0))),
    ]),
  ) as Record<string, number>;
}

function getTotalQuantity(sizes: Record<string, string | number>): number {
  return Object.values(sizes).reduce<number>(
    (total, quantity) => total + Math.max(0, Math.floor(Number(quantity || 0))),
    0,
  );
}

function selectedDtfLocationValues(detail: Pick<
  DetailEstimatorState,
  "dtfFrontPreset" | "dtfBackPreset" | "dtfLeftSleeve" | "dtfRightSleeve"
>) {
  const values = [
    detail.dtfFrontPreset,
    detail.dtfBackPreset,
    detail.dtfLeftSleeve ? "leftSleeve" : "",
    detail.dtfRightSleeve ? "rightSleeve" : "",
  ].filter((value) => value && value !== "none");

  return values.length ? values : ["front"];
}

function buildDtfPrintLocations(detail: Pick<
  DetailEstimatorState,
  "dtfFrontPreset" | "dtfBackPreset" | "dtfLeftSleeve" | "dtfRightSleeve"
>) {
  return selectedDtfLocationValues(detail).map((value) => {
    const location = dtfLocationOptions.find((option) => option.value === value);

    return {
      placement: value,
      enabled: true,
      size: {
        width: location?.width ?? 10,
        height: location?.height ?? 12,
      },
    };
  });
}

function selectedDtfLocationLabels(detail: Pick<
  DetailEstimatorState,
  "dtfFrontPreset" | "dtfBackPreset" | "dtfLeftSleeve" | "dtfRightSleeve"
>) {
  return selectedDtfLocationValues(detail)
    .map((value) => dtfLocationOptions.find((option) => option.value === value)?.label)
    .filter(Boolean)
    .join(" / ");
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

export function ProductCatalogQuoteButton({
  product,
}: ProductCatalogQuoteButtonProps) {
  const [detail, setDetail] = useState<DetailEstimatorState | null>(null);
  const [service, setService] = useState<PricingService>("screenprint");

  useEffect(() => {
    if (window.location.search.includes("service=embroidery")) {
      setService("embroidery");
    } else if (window.location.search.includes("service=dtf")) {
      setService("dtf");
    }
  }, []);

  function openDetail() {
    setDetail({
      service,
      color: defaultColor(product),
      sizes: buildEmptySizes(product),
      frontColors: "1",
      backColors: "0",
      dtfFrontPreset: "front",
      dtfBackPreset: "none",
      dtfLeftSleeve: false,
      dtfRightSleeve: false,
      placement: product.category === "Caps" ? "Hat Front" : "Left Chest",
      stitchCount: "5000",
      threadColors: "2",
      digitizingRequired: false,
      puff3mm: false,
      namesEnabled: false,
      numbersEnabled: false,
      estimate: null,
      sizePriceBreakdown: [],
      error: "",
      isLoading: false,
    });
  }

  function updateDetail(updates: Partial<DetailEstimatorState>) {
    setDetail((current) =>
      current
        ? {
            ...current,
            ...updates,
            estimate:
              updates.estimate === undefined ? current.estimate : updates.estimate,
            sizePriceBreakdown:
              updates.sizePriceBreakdown === undefined
                ? current.sizePriceBreakdown
                : updates.sizePriceBreakdown,
            error: updates.error === undefined ? current.error : updates.error,
          }
        : current,
    );
  }

  function updateSize(size: string, value: string) {
    setDetail((current) =>
      current
        ? {
            ...current,
            sizes: {
              ...current.sizes,
              [size]: value,
            },
            estimate: null,
            sizePriceBreakdown: [],
            error: "",
          }
        : current,
    );
  }

  function buildEstimatePayload(
    currentDetail: DetailEstimatorState,
    sizes: Record<string, number>,
  ) {
    return currentDetail.service === "embroidery"
      ? {
          lineItems: [
            {
              style: product.style,
              title: product.title,
              color: currentDetail.color,
              sizes,
              sizeQty: sizes,
            },
          ],
          locations: [
            {
              placement: currentDetail.placement,
              stitchCount: Number(currentDetail.stitchCount),
              threadColors: Number(currentDetail.threadColors),
              puff3mm: currentDetail.puff3mm,
            },
          ],
          options: {
            digitizingRequired: currentDetail.digitizingRequired,
            names: { enabled: currentDetail.namesEnabled, large: false },
            numbers: { enabled: currentDetail.numbersEnabled, large: false },
          },
          sameDesign: true,
        }
      : currentDetail.service === "dtf"
        ? {
            apparel: {
              style: product.style,
              title: product.title,
              color: currentDetail.color,
              sizes,
              sizeQty: sizes,
            },
            printLocations: buildDtfPrintLocations(currentDetail),
            sameDesign: true,
          }
        : {
            lineItems: [
              {
                style: product.style,
                title: product.title,
                color: currentDetail.color,
                sizes,
                sizeQty: sizes,
              },
            ],
            printLines: [
              {
                id: "front",
                name: "Front",
                colors: Number(currentDetail.frontColors),
              },
              {
                id: "back",
                name: "Back",
                colors: Number(currentDetail.backColors),
              },
            ],
            sameDesign: true,
          };
  }

  async function requestServiceEstimate(
    currentDetail: DetailEstimatorState,
    sizes: Record<string, number>,
  ) {
    const response = await fetch(
      currentDetail.service === "embroidery"
        ? "/api/pricing/embroidery"
        : currentDetail.service === "dtf"
          ? "/api/pricing/dtf"
          : "/api/pricing/screenprint",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildEstimatePayload(currentDetail, sizes)),
      },
    );
    const data = (await response.json()) as ScreenprintEstimate;

    if (!response.ok || data.ok === false) {
      throw new Error(data.error?.message || "Estimate unavailable.");
    }

    return data;
  }

  async function findUnavailableSelectedSizes(
    currentDetail: DetailEstimatorState,
    sizes: Record<string, number>,
    probeQuantity: number,
  ) {
    const selectedSizes = Object.entries(sizes).filter(
      ([, quantity]) => Number(quantity) > 0,
    );
    const unavailable: string[] = [];

    for (const [size] of selectedSizes) {
      try {
        await requestServiceEstimate(currentDetail, { [size]: probeQuantity });
      } catch {
        unavailable.push(size);
      }
    }

    return unavailable;
  }

  async function requestEstimate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!detail) {
      return;
    }

    const sizes = numericSizeQuantities(detail.sizes);
    const totalQty = getTotalQuantity(sizes);

    if (totalQty <= 0) {
      updateDetail({
        error: "Please enter at least one garment quantity.",
        estimate: null,
      });
      return;
    }

    const minimum =
      detail.service === "embroidery"
        ? embroideryMinimumQuantity
        : detail.service === "dtf"
          ? dtfMinimumQuantity
          : screenPrintMinimumQuantity;

    if (totalQty < minimum) {
      updateDetail({
        error:
          detail.service === "embroidery"
            ? "Embroidery estimates start at 5 pieces."
            : detail.service === "dtf"
              ? "Please enter at least one garment quantity."
              : "This item is under 24 pieces. You can still add it to the quote basket and combine it with compatible styles using the same artwork.",
        estimate: null,
      });
      return;
    }

    updateDetail({
      isLoading: true,
      error: "",
      estimate: null,
      sizePriceBreakdown: [],
    });

    try {
      const data = await requestServiceEstimate(detail, sizes);
      const apiBreakdown = extractApiSizePriceBreakdown(data);
      const sizePriceBreakdown =
        apiBreakdown.length || detail.service === "dtf"
          ? apiBreakdown
          : await loadGroupedSizePriceBreakdown({
              sizes,
              totalQuantity: totalQty,
              buildPayload: (groupSizes) => buildEstimatePayload(detail, groupSizes),
              requestEstimate: async (payload) => {
                const response = await fetch(
                  detail.service === "embroidery"
                    ? "/api/pricing/embroidery"
                    : detail.service === "dtf"
                      ? "/api/pricing/dtf"
                      : "/api/pricing/screenprint",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                  },
                );
                const groupEstimate =
                  (await response.json()) as ScreenprintEstimate;

                if (!response.ok || groupEstimate.ok === false) {
                  throw new Error(
                    groupEstimate.error?.message || "Estimate unavailable.",
                  );
                }

                return groupEstimate;
              },
              readEach: (groupEstimate) => groupEstimate.price?.each,
            });

      updateDetail({ estimate: data, sizePriceBreakdown, isLoading: false });
    } catch (error) {
      const unavailableSizes = await findUnavailableSelectedSizes(
        detail,
        sizes,
        Math.max(totalQty, minimum),
      );

      if (unavailableSizes.length) {
        updateDetail({
          error: `${detail.color} does not appear to be available in ${unavailableSizes.join(
            ", ",
          )} for ${product.style}, so ${
            unavailableSizes.length === 1 ? "that size was" : "those sizes were"
          } removed from this estimate. Please review the remaining sizes and get the estimate again.`,
          sizes: Object.fromEntries(
            Object.entries(detail.sizes).filter(
              ([size]) => !unavailableSizes.includes(size),
            ),
          ),
          estimate: null,
          sizePriceBreakdown: [],
          isLoading: false,
        });
        return;
      }

      updateDetail({
        error: error instanceof Error ? error.message : "Estimate unavailable. Please try again.",
        estimate: null,
        sizePriceBreakdown: [],
        isLoading: false,
      });
    }
  }

  function addToBasket() {
    if (!detail) {
      return;
    }

    const sizes = numericSizeQuantities(detail.sizes);
    const totalQty = getTotalQuantity(sizes);

    if (totalQty <= 0) {
      updateDetail({
        error: "Please enter at least one garment quantity.",
      });
      return;
    }

    const item: QuoteBasketItem = {
      id: `${product.style}-${Date.now()}-${Math.random()
        .toString(16)
        .slice(2)}`,
      productName: product.title,
      style: product.style,
      brand: product.brand,
      color: detail.color,
      sizes,
      quantity: totalQty,
      service:
        detail.service === "embroidery"
          ? "Embroidery"
          : detail.service === "dtf"
            ? "DTF Transfers"
            : "Screen Printing",
      frontColors: detail.frontColors,
      backColors: detail.backColors,
      decorationSummary:
        detail.service === "embroidery"
          ? [
              detail.placement,
              `${Number(detail.stitchCount).toLocaleString("en-US")} stitches`,
              `${detail.threadColors} thread colors`,
              detail.digitizingRequired ? "Digitizing needed" : "",
              detail.puff3mm ? "3D puff" : "",
              detail.namesEnabled ? "Names" : "",
              detail.numbersEnabled ? "Numbers" : "",
            ]
              .filter(Boolean)
              .join(" / ")
          : detail.service === "dtf"
            ? selectedDtfLocationLabels(detail)
            : undefined,
      estimatedEach: detail.estimate?.price?.each,
      estimatedTotal: detail.estimate?.price?.retail,
      currency: detail.estimate?.currency,
      sizePriceBreakdown: detail.sizePriceBreakdown,
    };

    if (detail.sizePriceBreakdown.length) {
      item.decorationSummary = [
        item.decorationSummary,
        `Size pricing: ${detail.sizePriceBreakdown
          .map(
            (entry) =>
              `${entry.label} ${entry.quantity} @ ${formatPrice(entry.priceEach)} each`,
          )
          .join(", ")}`,
      ]
        .filter(Boolean)
        .join(" | ");
    }

    addItemToFloatingQuoteBasket(item);
    setDetail(null);
  }

  return (
    <>
      <button
        type="button"
        onClick={openDetail}
        className="inline-flex justify-center rounded-md bg-accent px-7 py-4 text-sm font-black uppercase text-white shadow-[0_18px_42px_rgba(31,115,190,0.34)] transition hover:-translate-y-0.5 hover:bg-[#2a86d8]"
      >
        Add to{" "}
        {service === "embroidery"
          ? "embroidery"
          : service === "dtf"
            ? "DTF"
            : "project"}{" "}
        quote
      </button>

      {detail ? (
        <div className="fixed inset-0 z-[80] overflow-y-auto bg-black/60 px-5 py-8 text-[#07111f]">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-sm bg-white shadow-[0_24px_90px_rgba(0,0,0,0.38)]">
            <div className="flex items-start justify-between gap-4 border-b border-black/10 p-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
                  {detail.service === "embroidery"
                    ? "Embroidery quote"
                    : detail.service === "dtf"
                      ? "DTF quote"
                    : "Add to project quote"}
                </p>
                <h2 className="mt-2 text-3xl font-black uppercase text-[#07111f]">
                  {product.style} - {product.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDetail(null)}
                className="rounded-full border border-black/10 px-3 py-1 text-sm font-black text-[#07111f] transition hover:border-accent hover:text-accent"
              >
                X
              </button>
            </div>

            <div className="grid gap-px bg-[#d7e3ee] lg:grid-cols-[1fr_0.9fr]">
              <form onSubmit={requestEstimate} className="bg-white p-5">
                <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6a7480]">
                      Product color
                    </p>
                    <div className="mt-2 grid max-h-64 gap-2 overflow-y-auto rounded-md border border-black/12 bg-[#f7f8fa] p-2">
                      {product.colors.map((productColor) => (
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
                            "flex min-h-11 items-center gap-3 rounded-md border px-3 py-2 text-left text-sm font-bold transition",
                            detail.color === productColor.name
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

                  <div className="rounded-md border border-black/10 bg-[#f7f8fa] p-4">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6a7480]">
                      Project note
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-[#52677d]">
                      Add this style to the same quote basket as other shirts,
                      hoodies, banners, and project items. Final pricing may
                      change after artwork review.
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6a7480]">
                    Size quantities
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {Object.entries(detail.sizes).map(([size, quantity]) => (
                      <label key={size} className="block">
                        <span className="text-xs font-black uppercase text-[#6a7480]">
                          {size}
                        </span>
                        <input
                          type="number"
                          min={0}
                          value={quantity}
                          onChange={(event) => updateSize(size, event.target.value)}
                          className="mt-2 h-11 w-full rounded-md border border-black/12 bg-[#f7f8fa] px-3 text-sm font-semibold text-[#07111f]"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {detail.service === "embroidery" ? (
                  <>
                    <div className="mt-5 grid gap-4 sm:grid-cols-3">
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6a7480]">
                          Placement
                        </span>
                        <select
                          value={detail.placement}
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
                          Stitch count
                        </span>
                        <select
                          value={detail.stitchCount}
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
                          value={detail.threadColors}
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
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {[
                        {
                          label: "Digitizing needed",
                          key: "digitizingRequired" as const,
                          checked: detail.digitizingRequired,
                        },
                        {
                          label: "3D puff",
                          key: "puff3mm" as const,
                          checked: detail.puff3mm,
                        },
                        {
                          label: "Names",
                          key: "namesEnabled" as const,
                          checked: detail.namesEnabled,
                        },
                        {
                          label: "Numbers",
                          key: "numbersEnabled" as const,
                          checked: detail.numbersEnabled,
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
                  </>
                ) : detail.service === "screenprint" ? (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6a7480]">
                        How many colors on front?
                      </span>
                      <select
                        value={detail.frontColors}
                        onChange={(event) => {
                          if (event.target.value === "dtf") {
                            updateDetail({
                              service: "dtf",
                              dtfFrontPreset: "front",
                              dtfBackPreset: "none",
                              dtfLeftSleeve: false,
                              dtfRightSleeve: false,
                              estimate: null,
                              error:
                                "Switched to DTF because this artwork needs more than 4 screen print colors.",
                            });
                            return;
                          }

                          updateDetail({
                            frontColors: event.target.value,
                            estimate: null,
                            error: "",
                          });
                        }}
                        className="mt-2 h-11 w-full rounded-md border border-black/12 bg-[#f7f8fa] px-3 text-sm font-semibold text-[#07111f]"
                      >
                        {frontColorOptions.map((count) => (
                          <option key={count} value={count}>
                            {count === "dtf"
                              ? "More than 4 colors - choose DTF"
                              : `${count} ${count === "1" ? "color" : "colors"}`}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6a7480]">
                        How many colors on back?
                      </span>
                      <select
                        value={detail.backColors}
                        onChange={(event) => {
                          if (event.target.value === "dtf") {
                            updateDetail({
                              service: "dtf",
                              dtfFrontPreset: "none",
                              dtfBackPreset: "back",
                              dtfLeftSleeve: false,
                              dtfRightSleeve: false,
                              estimate: null,
                              error:
                                "Switched to DTF because this artwork needs more than 4 screen print colors.",
                            });
                            return;
                          }

                          updateDetail({
                            backColors: event.target.value,
                            estimate: null,
                            error: "",
                          });
                        }}
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
                ) : (
                  <>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6a7480]">
                          Front print preset
                        </span>
                        <select
                          value={detail.dtfFrontPreset}
                          onChange={(event) =>
                            updateDetail({
                              dtfFrontPreset: event.target.value,
                              estimate: null,
                              error: "",
                            })
                          }
                          className="mt-2 h-11 w-full rounded-md border border-black/12 bg-[#f7f8fa] px-3 text-sm font-semibold text-[#07111f]"
                        >
                          {frontPrintPresetOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6a7480]">
                          Back print preset
                        </span>
                        <select
                          value={detail.dtfBackPreset}
                          onChange={(event) =>
                            updateDetail({
                              dtfBackPreset: event.target.value,
                              estimate: null,
                              error: "",
                            })
                          }
                          className="mt-2 h-11 w-full rounded-md border border-black/12 bg-[#f7f8fa] px-3 text-sm font-semibold text-[#07111f]"
                        >
                          {backPrintPresetOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      {[
                        {
                          label: "Left sleeve",
                          key: "dtfLeftSleeve" as const,
                          checked: detail.dtfLeftSleeve,
                        },
                        {
                          label: "Right sleeve",
                          key: "dtfRightSleeve" as const,
                          checked: detail.dtfRightSleeve,
                        },
                      ].map((option) => (
                        <label
                          key={option.label}
                          className="flex min-h-11 cursor-pointer items-center justify-between rounded-md border border-black/12 bg-[#f7f8fa] px-3 text-xs font-black uppercase tracking-wide text-[#314154] sm:mt-6"
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
                  </>
                )}

                <p className="mt-3 text-xs font-semibold leading-5 text-[#65717e]">
                  Final pricing may change after artwork review, garment color,
                  and exact production setup.
                </p>
                <p className="mt-2 rounded-md bg-[#eef6ff] p-3 text-xs font-bold leading-5 text-[#125b99]">
                  Current item quantity: {getTotalQuantity(detail.sizes)}. You
                  can add this item to the quote basket now and keep browsing.
                </p>

                <button
                  type="submit"
                  disabled={detail.isLoading}
                  className="mt-6 w-full rounded-md bg-accent px-5 py-4 text-sm font-black uppercase text-white transition hover:bg-[#2a86d8] disabled:cursor-wait disabled:opacity-70"
                >
                  {detail.isLoading ? "Getting estimate..." : "Get estimate"}
                </button>

                {detail.error ? (
                  <p className="mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm font-bold leading-6 text-red-700">
                    {detail.error}
                  </p>
                ) : null}
              </form>

              <div className="bg-[#eef4fa] p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
                  Estimate
                </p>
                {detail.estimate ? (
                  <div className="mt-5 grid gap-4">
                    <div className="rounded-md bg-white p-5 ring-1 ring-black/8">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#678197]">
                        Estimated total
                      </p>
                      <p className="mt-2 text-4xl font-black text-[#07111f]">
                        {formatPrice(detail.estimate.price?.retail)}
                      </p>
                      <p className="mt-2 text-sm font-black uppercase text-[#52677d]">
                        Average each: {formatPrice(detail.estimate.price?.each)}
                      </p>
                    <p className="mt-2 text-xs font-semibold leading-5 text-[#65717e]">
                      Larger sizes such as 2XL and above are included in the
                      total when entered above.
                    </p>
                  </div>
                    <ApparelSizePriceBreakdownList
                      breakdown={detail.sizePriceBreakdown}
                      currency={detail.estimate.currency}
                    />
                    <button
                      type="button"
                      onClick={addToBasket}
                      className="rounded-md bg-[#07111f] px-5 py-4 text-sm font-black uppercase text-white transition hover:bg-accent"
                    >
                      Add to quote basket
                    </button>
                  </div>
                ) : (
                  <div className="mt-5 grid gap-4">
                    <p className="rounded-md border border-dashed border-[#b5c6d6] bg-white/70 p-5 text-sm leading-7 text-[#52677d]">
                      Add sizes and get an estimate, or add this item to the
                      quote basket now and keep building the project.
                    </p>
                    <button
                      type="button"
                      onClick={addToBasket}
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
    </>
  );
}
