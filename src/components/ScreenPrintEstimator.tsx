"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { CatalogProduct } from "@/data/sanmarCatalog.generated";
import {
  addItemToFloatingQuoteBasket,
  openFloatingQuoteBasket,
  type QuoteBasketItem,
} from "@/components/FloatingQuoteBasket";
import { ApparelSizePriceBreakdownList } from "@/components/ApparelSizePriceBreakdown";
import {
  loadGroupedSizePriceBreakdown,
  type ApparelSizePriceBreakdown,
} from "@/lib/apparel-size-breakdown";
import {
  findUnavailableSelectedSizes,
  removeUnavailableSizes,
} from "@/lib/pricing-availability";

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
  sizePriceBreakdown: ApparelSizePriceBreakdown[];
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
const catalogReturnUrlKey = "hue-catalog-return-url";

const navigatorGroups: NavigatorGroup[] = [
  {
    id: "tees",
    label: "T-Shirts",
    eyebrow: "T-Shirt navigator",
    summary:
      "Popular short sleeve, long sleeve, soft-style, and performance tees for screen printing.",
    tiers: [
      {
        id: "tee-basics",
        label: "Basics",
        headline: "Basics",
        description:
          "The Tee Navigator basics page: open-ended or carded cotton tees, 100% cotton, and 50/50 blends.",
        styles: [
          "PC43",
          "PC43LS",
          "PC43Y",
          "5000",
          "5400",
          "5000L",
          "5000B",
          "363M",
          "363L",
          "363LH",
          "363Y",
          "PC01",
          "PC61",
          "PC61LS",
          "PC61T",
          "LPC61",
          "PC61Y",
          "29M",
          "29LS",
          "29B",
          "DT5000",
          "8000",
          "8300",
          "8400",
          "8000B",
          "PC54",
          "PC54LS",
          "PC54T",
          "LPC54",
          "PC54Y",
          "PC55",
          "PC55LS",
          "PC55T",
          "LPC55",
          "PC55Y",
          "2000",
          "G2400",
          "2000T",
          "2000L",
          "2000B",
          "3000",
          "3000B",
        ],
      },
      {
        id: "tee-better-basics",
        label: "Better Basics",
        headline: "Better basics",
        description:
          "Step-up cottons and blends from the Tee Navigator better basics page.",
        styles: [
          "PC450",
          "PC450LS",
          "LPC450",
          "PC450Y",
          "PC330",
          "PC330LS",
          "LPC330V",
          "PC340",
          "PC340Y",
          "PC455",
          "PC455LS",
          "LPC455V",
          "PC455Y",
          "560M",
          "560LS",
          "65000",
          "65000L",
          "65000B",
          "980",
          "NL1810",
          "1717",
          "6014",
          "3023CL",
          "9018",
          "LPC61",
          "PC61Y",
          "PC61",
          "IC46M",
          "IC46L",
          "IC46B",
        ],
      },
      {
        id: "tee-price-point-premium",
        label: "Price Point Premium",
        headline: "Price point premium",
        description:
          "Ring spun cotton and CVC styles at strong price points from the Tee Navigator.",
        styles: [
          "DT6000",
          "DT6001",
          "DT6000Y",
          "DM108",
          "DT109",
          "DM108L",
          "DT108Y",
          "64000",
          "64000L",
          "64000B",
          "64000CVC",
          "64440CVC",
          "64001LCVC",
          "64000BCVC",
          "570M",
        ],
      },
      {
        id: "tee-premium",
        label: "Premium",
        headline: "Premium tees",
        description:
          "Tri-blend, CVC, combed ring spun cotton, and retail-feel tees from the Premium PDF section.",
        styles: [
          "DM130",
          "DM132",
          "DM130L",
          "DT130Y",
          "DT184",
          "DT185",
          "DT188",
          "AL2004",
          "AL6004",
          "AL2015",
          "AL207",
          "AL2300",
          "AL6204",
          "NL6010",
          "NL6710",
          "NL6210",
          "NL6211",
          "NL6610",
          "NL3312",
          "BC3413",
          "BC3513",
          "BC6413",
          "BC3413Y",
          "BC3001CVC",
          "BC3501CVC",
          "BC6400CVC",
          "BC3001YCVC",
          "DT104",
          "DT105",
          "DM104L",
          "DM1170L",
          "NL3600",
          "NL3601",
          "NL3900",
          "BC3001",
          "BC3501",
          "BC6004",
          "BC3001Y",
          "SXU001",
          "SXU022",
          "SXW002",
        ],
      },
      {
        id: "tee-performance",
        label: "Performance",
        headline: "Performance tees",
        description:
          "Moisture-wicking and UV-friendly performance tees from the Tee Navigator.",
        styles: [
          "ST400",
          "ST400LS",
          "LST400",
          "ST420",
          "ST420LS",
          "YST420",
          "NEA200",
          "NEA201",
          "YNEA200",
          "DV7299",
          "NKHQ4550",
          "DV7312",
          "DV7317",
          "ST350",
          "ST350LS",
          "TST350",
          "LST350",
          "YST350",
          "ST360",
          "ST360LS",
          "YST360",
          "ST450",
          "ST450LS",
          "ST340",
          "ST340LS",
          "LST340",
          "YST340",
          "PC380",
          "PC380LS",
          "LPC380",
          "PC380Y",
          "PC381",
          "PC381LS",
          "LPC381V",
          "PC381Y",
          "42000",
          "42400",
          "42000B",
          "21M",
          "21LS",
        ],
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
          "PC78PKT",
          "PC90Y",
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
        label: "1/4-Zip & 1/2-Zip",
        headline: "1/4-zips and 1/2-zips",
        description: "The Fleece Navigator 1/4-zip and 1/2-zip section.",
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
          "TM1MY397",
          "NEA512",
          "K829",
          "ST253",
        ],
      },
      {
        id: "fleece-performance",
        label: "Performance",
        headline: "Performance fleece",
        description: "The Fleece Navigator performance section.",
        styles: [
          "ST710",
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
          "NKFD9735",
          "NKDX6718",
          "NKFD9863",
          "NKFQ4762",
          "ST857",
          "ST241",
          "LST241",
          "YST241",
        ],
      },
      {
        id: "fleece-premium",
        label: "Heavyweight",
        headline: "Heavyweight fleece",
        description: "The Fleece Navigator heavyweight section.",
        styles: [
          "SXU028",
          "SXU029",
          "19000",
          "19500",
          "S149",
          "S101",
          "F280",
          "F281",
          "F282",
          "ST283",
          "ST284",
          "VL130",
          "VL130H",
          "VL130ZH",
          "CT100615",
          "CT100614",
          "CT100617",
          "BC4711",
          "BC4719",
          "DT6154",
          "DT6150",
          "DT2204",
          "DT2200",
          "NL9007",
          "NL9087",
          "NL9307",
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

function buildEmptyDetailSizes(product: CatalogProduct) {
  return Object.fromEntries(
    productSizeOrder(product).map((size) => [size, "0"]),
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

function productDetailHref(product: CatalogProduct) {
  return `/custom-catalog/${encodeURIComponent(product.style)}`;
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
  const [openTiers, setOpenTiers] = useState<Record<string, boolean>>({
    [navigatorGroups[0].tiers[0].id]: true,
  });
  const [detailEstimator, setDetailEstimator] =
    useState<DetailEstimatorState | null>(null);

  const group =
    navigatorGroups.find((item) => item.id === activeGroup) ??
    navigatorGroups[0];
  const activePdf =
    activeGroup === "sweatshirts"
      ? "/Fleece-Navigator-2025-0303Update-SMLinks.pdf"
      : "/Tee-Navigator-2026-0302-SM-Links.pdf";
  const visibleProducts = useMemo(
    () =>
      group.tiers.flatMap((tier, index) =>
        (openTiers[tier.id] ?? index === 0)
          ? tier.styles
              .map((style) => productByStyle.get(style))
              .filter((product): product is CatalogProduct =>
                Boolean(product),
              )
          : [],
      ),
    [group, openTiers, productByStyle],
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
      sizes: buildEmptyDetailSizes(product),
      frontColors,
      backColors,
      estimate: null,
      sizePriceBreakdown: [],
      error: "",
      isLoading: false,
    });
  }

  function saveCatalogReturnState() {
    window.sessionStorage.setItem(
      catalogReturnUrlKey,
      `${window.location.pathname}${window.location.search}`,
    );
  }

  function isTierOpen(tier: NavigatorTier, index: number) {
    return openTiers[tier.id] ?? index === 0;
  }

  function toggleTier(tier: NavigatorTier, index: number) {
    setOpenTiers((current) => ({
      ...current,
      [tier.id]: !(current[tier.id] ?? index === 0),
    }));
  }

  function tierProductCount(tier: NavigatorTier) {
    return tier.styles.filter((style) => productByStyle.has(style)).length;
  }

  function openTierAndScroll(tier: NavigatorTier) {
    setOpenTiers((current) => ({
      ...current,
      [tier.id]: true,
    }));

    window.setTimeout(() => {
      document.getElementById(tier.id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }

  function updateDetail(updates: Partial<DetailEstimatorState>) {
    setDetailEstimator((current) =>
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
            sizePriceBreakdown: [],
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
        sizePriceBreakdown: [],
      });
      return;
    }

    const numericSizes = Object.fromEntries(
      Object.entries(detailEstimator.sizes).map(([size, qty]) => [
        size,
        Number(qty || 0),
      ]),
    );

    updateDetail({
      isLoading: true,
      error: "",
      estimate: null,
      sizePriceBreakdown: [],
    });

    const buildPayload = (sizes: Record<string, number>) => ({
      lineItems: [
        {
          style: detailEstimator.product.style,
          title: detailEstimator.product.title,
          color: detailEstimator.color,
          sizes,
          sizeQty: sizes,
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
    });
    const requestEstimate = async (payload: unknown) => {
      const response = await fetch("/api/pricing/screenprint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as ScreenprintEstimate;

      if (!response.ok || data.ok === false) {
        throw new Error(data.error?.message || "Estimate unavailable.");
      }

      return data;
    };

    try {
      const data = await requestEstimate(buildPayload(numericSizes));
      const sizePriceBreakdown = await loadGroupedSizePriceBreakdown({
        sizes: numericSizes,
        totalQuantity: totalQty,
        buildPayload,
        requestEstimate,
        readEach: (estimate) => estimate.price?.each,
      });

      updateDetail({ estimate: data, sizePriceBreakdown, isLoading: false });
    } catch (error) {
      const unavailableSizes = await findUnavailableSelectedSizes({
        sizes: numericSizes,
        probeQuantity: Math.max(totalQty, 24),
        requestEstimate: (sizes) => requestEstimate(buildPayload(sizes)),
      });

      if (unavailableSizes.length) {
        updateDetail({
          error: `${detailEstimator.color} does not appear to be available in ${unavailableSizes.join(
            ", ",
          )} for ${detailEstimator.product.style}, so ${
            unavailableSizes.length === 1 ? "that size was" : "those sizes were"
          } removed from this estimate. Please review the remaining sizes and get the estimate again.`,
          sizes: removeUnavailableSizes(detailEstimator.sizes, unavailableSizes),
          estimate: null,
          sizePriceBreakdown: [],
          isLoading: false,
        });
        return;
      }

      updateDetail({
        error:
          error instanceof Error
            ? error.message
            : "Estimate unavailable. Please try again.",
        estimate: null,
        sizePriceBreakdown: [],
        isLoading: false,
      });
    }
  }

  function sizePricingSummary() {
    if (!detailEstimator?.sizePriceBreakdown.length) {
      return "";
    }

    return detailEstimator.sizePriceBreakdown
      .map((item) =>
        [
          item.label,
          `${item.quantity}`,
          item.priceEach !== undefined ? `@ ${formatPrice(item.priceEach)} each` : "",
        ]
          .filter(Boolean)
          .join(" "),
      )
      .join(", ");
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
      decorationSummary: sizePricingSummary()
        ? `Size pricing: ${sizePricingSummary()}`
        : "",
      estimatedEach: detailEstimator.estimate?.price?.each,
      estimatedTotal: detailEstimator.estimate?.price?.retail,
    };

    addItemToFloatingQuoteBasket(item);
    setDetailEstimator(null);
  }

  return (
    <section className="px-4 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[96rem] overflow-hidden rounded-sm bg-[#f4f8fc] shadow-[0_24px_70px_rgba(7,17,31,0.16)] ring-1 ring-black/10">
        <div className="relative bg-[#07111f] p-5 text-white sm:p-7 lg:p-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-accent" />
          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr] xl:items-end">
            <div>
              <p className="eyebrow text-accent">Screen print navigator</p>
              <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-3xl font-black uppercase leading-[0.94] text-white sm:text-5xl">
                Quick live price guide.
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#d6e3f0]">
                Built like a product navigator, with live pricing added. Start
                with an estimated quantity and print color count, compare
                screen-print-friendly options, then open a detailed estimate
                when you are ready for sizes and exact colors.
              </p>
            </div>

            <div className="grid items-end gap-3 rounded-sm border border-white/10 bg-white/[0.04] p-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_1fr]">
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
              <Link
                href="/custom-catalog"
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-4 text-center text-xs font-black uppercase tracking-wide text-white transition hover:bg-[#2a86d8]"
              >
                Full catalog
              </Link>
              <a
                href={activePdf}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/22 px-4 text-center text-xs font-black uppercase tracking-wide text-white transition hover:border-accent hover:bg-accent/10"
              >
                PDF
              </a>
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
            className="mt-4 inline-flex min-h-11 items-center rounded-md border border-white/20 px-5 text-xs font-black uppercase tracking-wide text-white transition hover:border-accent hover:bg-accent/10"
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
                  {group.label} navigator.
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#52677d]">
                  {group.summary}
                </p>
              </div>
              <div className="grid rounded-md border border-[#c9d7e6] bg-white p-1 shadow-[0_12px_30px_rgba(7,17,31,0.08)] sm:flex">
                {navigatorGroups.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveGroup(item.id)}
                    className={[
                      "min-h-10 rounded px-4 text-xs font-black uppercase tracking-wide transition",
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

            <div className="mt-4 rounded-sm bg-[#07111f] p-4 text-white shadow-[0_12px_30px_rgba(7,17,31,0.08)]">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#50a8ff]">
                    Browse {group.label.toLowerCase()} by tier
                  </p>
                  <p className="mt-1 text-sm font-semibold leading-6 text-white/70">
                    More options are tucked below. Jump straight to the style
                    level that fits the job.
                  </p>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 lg:max-w-[58%]">
                  {group.tiers.map((tier, index) => {
                    const isOpen = isTierOpen(tier, index);

                    return (
                      <button
                        key={tier.id}
                        type="button"
                        data-testid={`tier-shortcut-${tier.id}`}
                        onClick={() => openTierAndScroll(tier)}
                        className={[
                          "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md border px-3 text-xs font-black uppercase tracking-wide transition",
                          isOpen
                            ? "border-accent bg-accent text-white"
                            : "border-white/16 bg-white/[0.04] text-white/82 hover:border-accent hover:bg-accent/10",
                        ].join(" ")}
                      >
                        {tier.label}
                        <span className="rounded bg-black/20 px-1.5 py-0.5 text-[0.62rem] text-white/82">
                          {tierProductCount(tier)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-5">
              {group.tiers.map((tier, index) => {
                const isOpen = isTierOpen(tier, index);
                const productCount = tierProductCount(tier);

                return (
                  <section
                    id={tier.id}
                    key={tier.id}
                    className="scroll-mt-28 overflow-hidden rounded-sm bg-white shadow-[0_18px_46px_rgba(7,17,31,0.08)] ring-1 ring-black/8"
                  >
                    <div className="grid gap-px bg-[#d7e3ee]">
                      <div className="bg-[#07111f] p-5 text-white">
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          onClick={() => toggleTier(tier, index)}
                          className="flex w-full flex-col gap-4 text-left md:flex-row md:items-center md:justify-between"
                        >
                          <span className="min-w-0">
                            <span className="text-xs font-black uppercase tracking-[0.24em] text-[#50a8ff]">
                              {tier.label}
                            </span>
                            <span className="mt-2 block text-2xl font-black uppercase leading-7">
                              {tier.headline}
                            </span>
                            <span className="mt-3 block max-w-4xl text-sm font-semibold leading-6 text-white/70">
                              {tier.description}
                            </span>
                          </span>
                          <span className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md border border-white/18 bg-white/[0.04] px-4 text-xs font-black uppercase tracking-wide text-white transition hover:border-accent hover:bg-accent/10">
                            {productCount} styles
                            <span
                              className={[
                                "text-lg leading-none text-accent transition",
                                isOpen ? "rotate-180" : "",
                              ].join(" ")}
                              aria-hidden="true"
                            >
                              v
                            </span>
                          </span>
                        </button>
                      </div>
                      {isOpen ? (
                        <div className="grid gap-px bg-[#d7e3ee] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                          {tier.styles.map((style) => {
                            const product = productByStyle.get(style);

                            if (!product) {
                              return null;
                            }

                            const estimate = estimates[product.style];
                            const image = productImage(product);

                            return (
                              <article
                                key={product.style}
                                className="group bg-white p-4 transition hover:bg-[#f9fbfd]"
                              >
                                <Link
                                  href={productDetailHref(product)}
                                  onClick={saveCatalogReturnState}
                                  className="block rounded-sm outline-none transition focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                                >
                                  <div className="relative aspect-[1.15] rounded bg-[#eef2f6]">
                                    {image ? (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img
                                        src={image}
                                        alt={product.title}
                                        className="h-full w-full object-contain p-4 transition duration-500 group-hover:scale-105"
                                        loading="lazy"
                                      />
                                    ) : null}
                                  </div>
                                  <p className="mt-4 text-[0.68rem] font-black uppercase tracking-wide text-accent">
                                    {product.brand} - {product.style}
                                  </p>
                                  <h5 className="mt-1 min-h-10 text-sm font-black leading-5 text-[#07111f] transition group-hover:text-accent">
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
                                  <div className="mt-4 rounded-md bg-[#07111f] px-4 py-3 text-white transition group-hover:bg-[#0b1b31]">
                                    <p className="text-[0.66rem] font-black uppercase tracking-[0.16em] text-[#9fc8ef]">
                                      Quick price
                                    </p>
                                    <p className="mt-1 text-lg font-black">
                                      {estimate?.status === "ready"
                                        ? `${formatPrice(estimate.each, estimate.currency)} avg ea`
                                        : estimate?.status === "loading"
                                          ? "Loading..."
                                          : "Request pricing"}
                                    </p>
                                    <p className="mt-1 text-[0.66rem] font-black uppercase tracking-wide text-white/58">
                                      {normalizedQuantity} pcs
                                    </p>
                                  </div>
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => openDetailEstimator(product)}
                                  className="mt-3 flex min-h-12 w-full items-center justify-center rounded-md bg-accent px-3 text-center text-xs font-black uppercase tracking-wide text-white shadow-[0_14px_30px_rgba(31,115,190,0.24)] transition hover:-translate-y-0.5 hover:bg-[#2a86d8]"
                                >
                                  Get detailed estimate
                                </button>
                              </article>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
      </div>
      {detailEstimator ? (
        <div className="fixed inset-0 z-[80] grid place-items-start overflow-y-auto bg-black/60 px-4 py-4 sm:place-items-center sm:py-6">
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
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-black/10 px-3 text-sm font-black text-[#07111f] transition hover:border-accent hover:text-accent"
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
                      Average each: {formatPrice(detailEstimator.estimate.price?.each)}
                    </p>
                    <p className="mt-2 text-xs font-semibold leading-5 text-[#65717e]">
                      Larger sizes such as 2XL and above are included in the
                      total when entered above.
                    </p>
                    <div className="mt-4">
                      <ApparelSizePriceBreakdownList
                        breakdown={detailEstimator.sizePriceBreakdown}
                        currency={detailEstimator.estimate.currency}
                      />
                    </div>
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
