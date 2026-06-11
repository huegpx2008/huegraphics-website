"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  addItemToFloatingQuoteBasket,
  openFloatingQuoteBasket,
  type QuoteBasketItem,
} from "@/components/FloatingQuoteBasket";
import { ApparelSizePriceBreakdownList } from "@/components/ApparelSizePriceBreakdown";
import type { CatalogProduct } from "@/data/sanmarCatalog.generated";
import {
  extractApiSizePriceBreakdown,
  loadGroupedSizePriceBreakdown,
  type ApparelSizePriceBreakdown,
} from "@/lib/apparel-size-breakdown";
import {
  buildEmptyCatalogSizes,
  fetchCatalogColorSizes,
  getProductSizeOrder,
  reconcileCatalogSizes,
} from "@/lib/catalog-size-options";
import {
  embroideryMinimumQuantity,
  getEmbroideryRecommendation,
  isEmbroideryFriendlyProduct,
} from "@/lib/catalog-embroidery";
import {
  getScreenPrintRecommendation,
  screenPrintMinimumQuantity,
} from "@/lib/catalog-screenprint";

type CustomCatalogBrowserProps = {
  products: CatalogProduct[];
  categories: readonly string[];
  brands: readonly string[];
};

type PricingService = "screenprint" | "embroidery" | "dtf";
type PriceSort = "featured" | "low" | "high";

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
    sizePriceBreakdown?: unknown;
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

type EmbroideryEstimate = ScreenprintEstimate & {
  summary?: ScreenprintEstimate["summary"] & {
    location?: {
      placement?: string;
      stitchCount?: number | string;
      threadColors?: number | string;
      puff3mm?: boolean;
    };
    options?: {
      digitizingRequired?: boolean;
      names?: { enabled?: boolean };
      numbers?: { enabled?: boolean };
    };
  };
};

type DetailEstimatorState = {
  product: CatalogProduct;
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
  sameDesign: boolean;
  estimate: ScreenprintEstimate | EmbroideryEstimate | null;
  sizePriceBreakdown: ApparelSizePriceBreakdown[];
  error: string;
  isLoading: boolean;
};

const visibleProductLimit = 48;
const returnUrlKey = "hue-catalog-return-url";
const returnScrollKey = "hue-catalog-return-scroll-y";
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
  return Number.isFinite(numeric)
    ? Math.max(screenPrintMinimumQuantity, Math.floor(numeric))
    : screenPrintMinimumQuantity;
}

function productSizeOrder(product: CatalogProduct) {
  return getProductSizeOrder(product);
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
  return buildEmptyCatalogSizes(product);
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

function buildScreenprintPayload({
  product,
  color,
  sizeQuantities,
  frontColors,
  backColors,
  sameDesign,
}: {
  product: CatalogProduct;
  color: string;
  sizeQuantities: Record<string, number>;
  frontColors: number;
  backColors: number;
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
      names: { enabled: namesEnabled, large: false },
      numbers: { enabled: numbersEnabled, large: false },
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
    throw new Error(data.error?.message || "Estimate unavailable");
  }

  return data;
}

function buildDtfPayload({
  product,
  color,
  sizeQuantities,
  frontPreset,
  backPreset,
  leftSleeve,
  rightSleeve,
  sameDesign,
}: {
  product: CatalogProduct;
  color: string;
  sizeQuantities: Record<string, number>;
  frontPreset: string;
  backPreset: string;
  leftSleeve: boolean;
  rightSleeve: boolean;
  sameDesign: boolean;
}) {
  const selectedLocations = [
    frontPreset !== "none" ? frontPreset : "",
    backPreset !== "none" ? backPreset : "",
    leftSleeve ? "leftSleeve" : "",
    rightSleeve ? "rightSleeve" : "",
  ].filter(Boolean);
  const locations = selectedLocations.length ? selectedLocations : ["front"];

  return {
    apparel: {
      style: product.style,
      title: product.title,
      color,
      sizes: sizeQuantities,
      sizeQty: sizeQuantities,
    },
    printLocations: locations.map((placement) => {
      const option =
        dtfLocationOptions.find((item) => item.value === placement) ??
        dtfLocationOptions[0];

      return {
        placement: option.value,
        enabled: true,
        size: {
          width: option.width,
          height: option.height,
        },
      };
    }),
    sameDesign,
  };
}

async function requestDtfEstimate(payload: unknown) {
  const response = await fetch("/api/pricing/dtf", {
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

function productDetailHref(product: CatalogProduct, service: PricingService) {
  const path = `/custom-catalog/${encodeURIComponent(product.style)}`;

  return service === "screenprint" ? path : `${path}?service=${service}`;
}

function saveReturnState() {
  window.sessionStorage.setItem(
    returnUrlKey,
    `${window.location.pathname}${window.location.search}`,
  );
  window.sessionStorage.setItem(returnScrollKey, String(window.scrollY));
}

function productSortPrice(product: CatalogProduct) {
  return typeof product.priceFrom === "number" ? product.priceFrom : null;
}

export function CustomCatalogBrowser({
  products,
  categories,
  brands,
}: CustomCatalogBrowserProps) {
  const [query, setQuery] = useState("");
  const [pricingService, setPricingService] =
    useState<PricingService>("screenprint");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [priceSort, setPriceSort] = useState<PriceSort>("featured");
  const [quickQuantity, setQuickQuantity] = useState(
    String(screenPrintMinimumQuantity),
  );
  const [quickFrontColors, setQuickFrontColors] = useState("1");
  const [quickBackColors, setQuickBackColors] = useState("0");
  const [quickSameDesign, setQuickSameDesign] = useState(true);
  const [quickDtfFrontPreset, setQuickDtfFrontPreset] = useState("front");
  const [quickDtfBackPreset, setQuickDtfBackPreset] = useState("none");
  const [quickDtfLeftSleeve, setQuickDtfLeftSleeve] = useState(false);
  const [quickDtfRightSleeve, setQuickDtfRightSleeve] = useState(false);
  const [quickPlacement, setQuickPlacement] = useState("Left Chest");
  const [quickStitchCount, setQuickStitchCount] = useState("5000");
  const [quickThreadColors, setQuickThreadColors] = useState("2");
  const [quickDigitizingRequired, setQuickDigitizingRequired] = useState(false);
  const [quickPuff3mm, setQuickPuff3mm] = useState(false);
  const [quickNamesEnabled, setQuickNamesEnabled] = useState(false);
  const [quickNumbersEnabled, setQuickNumbersEnabled] = useState(false);
  const [minimumSuggestion, setMinimumSuggestion] = useState("");
  const [debouncedQuickSettings, setDebouncedQuickSettings] = useState({
    service: "screenprint" as PricingService,
    quantity: String(screenPrintMinimumQuantity),
    frontColors: "1",
    backColors: "0",
    sameDesign: true,
    dtfFrontPreset: "front",
    dtfBackPreset: "none",
    dtfLeftSleeve: false,
    dtfRightSleeve: false,
    placement: "Left Chest",
    stitchCount: "5000",
    threadColors: "2",
    digitizingRequired: false,
    puff3mm: false,
    namesEnabled: false,
    numbersEnabled: false,
  });
  const [catalogEstimates, setCatalogEstimates] = useState<
    Record<string, EstimateState>
  >({});
  const [detailEstimator, setDetailEstimator] =
    useState<DetailEstimatorState | null>(null);
  const appliedServiceSearchRef = useRef("");

  useEffect(() => {
    const search = window.location.search;

    if (appliedServiceSearchRef.current === search) {
      return;
    }

    const requestedService = new URLSearchParams(search).get("service");

    if (requestedService === "embroidery" || requestedService === "dtf") {
      appliedServiceSearchRef.current = search;
      setPricingService(requestedService);
      setQuickQuantity(
        requestedService === "embroidery"
          ? String(embroideryMinimumQuantity)
          : "1",
      );
      setCategory("All");
    }
  }, [pricingService]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;
      const matchesBrand = brand === "All" || product.brand === brand;
      const matchesService =
        pricingService !== "embroidery" ||
        category !== "All" ||
        isEmbroideryFriendlyProduct(product);
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

      return matchesCategory && matchesBrand && matchesQuery && matchesService;
    });
  }, [brand, category, pricingService, products, query]);

  const sortedProducts = useMemo(() => {
    if (priceSort === "featured") {
      return filteredProducts;
    }

    return [...filteredProducts].sort((a, b) => {
      const aPrice = productSortPrice(a);
      const bPrice = productSortPrice(b);

      if (aPrice === null && bPrice === null) {
        return a.title.localeCompare(b.title);
      }

      if (aPrice === null) {
        return 1;
      }

      if (bPrice === null) {
        return -1;
      }

      if (aPrice === bPrice) {
        return a.title.localeCompare(b.title);
      }

      return priceSort === "low" ? aPrice - bPrice : bPrice - aPrice;
    });
  }, [filteredProducts, priceSort]);

  const visibleProducts = sortedProducts.slice(0, visibleProductLimit);
  const visibleProductKey = visibleProducts
    .map((product) => product.style)
    .join("|");
  const visibleProductsForEstimates = useMemo(
    () => visibleProducts,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [visibleProductKey],
  );

  useEffect(() => {
    const savedUrl = window.sessionStorage.getItem(returnUrlKey);
    const savedScroll = window.sessionStorage.getItem(returnScrollKey);
    const currentUrl = `${window.location.pathname}${window.location.search}`;

    if (savedUrl !== currentUrl || !savedScroll) {
      return;
    }

    const scrollY = Number(savedScroll);

    if (!Number.isFinite(scrollY)) {
      return;
    }

    const timeout = window.setTimeout(() => {
      window.scrollTo({ top: scrollY, behavior: "auto" });
      window.sessionStorage.removeItem(returnScrollKey);
    }, 150);

    return () => window.clearTimeout(timeout);
  }, [pricingService, visibleProductKey]);

  const isStartingEstimate =
    pricingService === "screenprint" &&
    quickQuantity === String(screenPrintMinimumQuantity) &&
    quickFrontColors === "1" &&
    quickBackColors === "0";

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuickSettings({
        service: pricingService,
        quantity: quickQuantity,
        frontColors: quickFrontColors,
        backColors: quickBackColors,
        sameDesign: quickSameDesign,
        dtfFrontPreset: quickDtfFrontPreset,
        dtfBackPreset: quickDtfBackPreset,
        dtfLeftSleeve: quickDtfLeftSleeve,
        dtfRightSleeve: quickDtfRightSleeve,
        placement: quickPlacement,
        stitchCount: quickStitchCount,
        threadColors: quickThreadColors,
        digitizingRequired: quickDigitizingRequired,
        puff3mm: quickPuff3mm,
        namesEnabled: quickNamesEnabled,
        numbersEnabled: quickNumbersEnabled,
      });
    }, 600);

    return () => window.clearTimeout(timeout);
  }, [
    quickBackColors,
    quickDigitizingRequired,
    quickDtfBackPreset,
    quickDtfFrontPreset,
    quickDtfLeftSleeve,
    quickDtfRightSleeve,
    quickFrontColors,
    quickNamesEnabled,
    quickNumbersEnabled,
    quickPlacement,
    quickPuff3mm,
    quickQuantity,
    quickSameDesign,
    quickStitchCount,
    quickThreadColors,
    pricingService,
  ]);

  useEffect(() => {
    let isCancelled = false;
    const productsToEstimate = [...visibleProductsForEstimates];
    const quantity =
      debouncedQuickSettings.service === "screenprint"
        ? normalizeQuantity(debouncedQuickSettings.quantity)
        : debouncedQuickSettings.service === "embroidery"
          ? Math.max(
            embroideryMinimumQuantity,
            Math.floor(Number(debouncedQuickSettings.quantity) || embroideryMinimumQuantity),
          )
          : Math.max(
              dtfMinimumQuantity,
              Math.floor(Number(debouncedQuickSettings.quantity) || dtfMinimumQuantity),
            );

    setCatalogEstimates((current) => {
      const next = { ...current };
      productsToEstimate.forEach((product) => {
        const recommendation =
          debouncedQuickSettings.service === "screenprint"
            ? getScreenPrintRecommendation(product)
            : debouncedQuickSettings.service === "embroidery"
              ? getEmbroideryRecommendation(product)
              : {
                  canEstimate: true,
                  label: "DTF ready",
                  message: "This style can be estimated for DTF transfers.",
                };

        next[product.style] = recommendation.canEstimate
          ? { status: "loading" }
          : { status: "unavailable", warnings: [recommendation.message] };
      });
      return next;
    });

    async function loadEstimates() {
      for (const product of productsToEstimate) {
        const recommendation =
          debouncedQuickSettings.service === "screenprint"
            ? getScreenPrintRecommendation(product)
            : debouncedQuickSettings.service === "embroidery"
              ? getEmbroideryRecommendation(product)
              : {
                  canEstimate: true,
                  label: "DTF ready",
                  message: "This style can be estimated for DTF transfers.",
                };

        if (!recommendation.canEstimate) {
          continue;
        }

        try {
          const estimate =
            debouncedQuickSettings.service === "screenprint"
              ? await requestScreenprintEstimate(
                  buildScreenprintPayload({
                    product,
                    color: defaultColor(product),
                    sizeQuantities: buildDefaultSizes(product, quantity),
                    frontColors: Number(debouncedQuickSettings.frontColors),
                    backColors: Number(debouncedQuickSettings.backColors),
                    sameDesign: debouncedQuickSettings.sameDesign,
                  }),
                )
              : debouncedQuickSettings.service === "embroidery"
                ? await requestEmbroideryEstimate(
                    buildEmbroideryPayload({
                      product,
                      color: defaultColor(product),
                      sizeQuantities: buildDefaultSizes(product, quantity),
                      placement: debouncedQuickSettings.placement,
                      stitchCount: Number(debouncedQuickSettings.stitchCount),
                      threadColors: Number(debouncedQuickSettings.threadColors),
                      digitizingRequired:
                        debouncedQuickSettings.digitizingRequired,
                      puff3mm: debouncedQuickSettings.puff3mm,
                      namesEnabled: debouncedQuickSettings.namesEnabled,
                      numbersEnabled: debouncedQuickSettings.numbersEnabled,
                      sameDesign: debouncedQuickSettings.sameDesign,
                    }),
                  )
                : await requestDtfEstimate(
                    buildDtfPayload({
                      product,
                      color: defaultColor(product),
                      sizeQuantities: buildDefaultSizes(product, quantity),
                      frontPreset: debouncedQuickSettings.dtfFrontPreset,
                      backPreset: debouncedQuickSettings.dtfBackPreset,
                      leftSleeve: debouncedQuickSettings.dtfLeftSleeve,
                      rightSleeve: debouncedQuickSettings.dtfRightSleeve,
                      sameDesign: debouncedQuickSettings.sameDesign,
                    }),
                  );

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

  function handleQuickQuantityChange(value: string) {
    const numeric = Number(value);
    const minimum =
      pricingService === "screenprint"
        ? screenPrintMinimumQuantity
        : pricingService === "embroidery"
          ? embroideryMinimumQuantity
          : dtfMinimumQuantity;

    if (
      pricingService === "screenprint" &&
      value &&
      Number.isFinite(numeric) &&
      numeric < screenPrintMinimumQuantity
    ) {
      setPricingService("dtf");
      setQuickQuantity(String(Math.max(dtfMinimumQuantity, Math.floor(numeric))));
      setMinimumSuggestion(
        "Switched to DTF because screen printing starts at 24 pieces.",
      );
      return;
    }

    if (value && Number.isFinite(numeric) && numeric < minimum) {
      setQuickQuantity(String(minimum));
      setMinimumSuggestion(
        pricingService === "embroidery"
          ? "Embroidery estimates start at 5 pieces. Send very small projects in for review and we can help."
          : "DTF pricing can start at one piece.",
      );
      return;
    }

    setQuickQuantity(value);
    setMinimumSuggestion("");
  }

  function switchQuickService(service: PricingService) {
    setPricingService(service);
    setCategory("All");
    setQuickQuantity(
      service === "screenprint"
        ? String(screenPrintMinimumQuantity)
        : service === "embroidery"
          ? String(embroideryMinimumQuantity)
          : "1",
    );
    setMinimumSuggestion("");
  }

  function switchScreenPrintColorsToDtf() {
    setPricingService("dtf");
    setQuickQuantity((currentQuantity) => {
      const numeric = Math.floor(Number(currentQuantity) || 12);
      return String(Math.max(dtfMinimumQuantity, numeric));
    });
    setQuickFrontColors("1");
    setQuickBackColors("0");
    setMinimumSuggestion(
      "Switched to DTF because the artwork needs more than 4 screen print colors.",
    );
  }

  function addToProject(product: CatalogProduct) {
    openDetailEstimator(product);
  }

  function addDetailToBasket() {
    if (!detailEstimator) {
      return;
    }

    const product = detailEstimator.product;
    const sizes = numericSizeQuantities(detailEstimator.sizes);
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
      color: detailEstimator.color,
      sizes,
      quantity: totalQty,
      service:
        detailEstimator.service === "screenprint"
          ? "Screen Printing"
          : detailEstimator.service === "embroidery"
            ? "Embroidery"
            : "DTF Transfers",
      frontColors: detailEstimator.frontColors,
      backColors: detailEstimator.backColors,
      decorationSummary:
        detailEstimator.service === "embroidery"
          ? [
              detailEstimator.placement,
              `${Number(detailEstimator.stitchCount).toLocaleString("en-US")} stitches`,
              `${detailEstimator.threadColors} thread colors`,
              detailEstimator.digitizingRequired ? "Digitizing needed" : "",
              detailEstimator.puff3mm ? "3D puff" : "",
              detailEstimator.namesEnabled ? "Names" : "",
              detailEstimator.numbersEnabled ? "Numbers" : "",
            ]
              .filter(Boolean)
              .join(" / ")
          : detailEstimator.service === "dtf"
            ? [
                ...[
                  detailEstimator.dtfFrontPreset,
                  detailEstimator.dtfBackPreset,
                  detailEstimator.dtfLeftSleeve ? "leftSleeve" : "",
                  detailEstimator.dtfRightSleeve ? "rightSleeve" : "",
                ]
                  .filter((value) => value && value !== "none")
                  .map(
                    (value) =>
                      dtfLocationOptions.find((option) => option.value === value)
                        ?.label,
                  ),
              ]
                .filter(Boolean)
                .join(" / ")
            : undefined,
      estimatedEach: detailEstimator.estimate?.price?.each,
      estimatedTotal: detailEstimator.estimate?.price?.retail,
      currency: detailEstimator.estimate?.currency,
      sizePriceBreakdown: detailEstimator.sizePriceBreakdown,
    };

    if (detailEstimator.sizePriceBreakdown.length) {
      item.decorationSummary = [
        item.decorationSummary,
        `Size pricing: ${detailEstimator.sizePriceBreakdown
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
    setDetailEstimator(null);
  }

  function openDetailEstimator(product: CatalogProduct) {
    const recommendation =
      pricingService === "screenprint"
        ? getScreenPrintRecommendation(product)
        : pricingService === "embroidery"
          ? getEmbroideryRecommendation(product)
          : { canEstimate: true };

    if (!recommendation.canEstimate) {
      return;
    }

    setDetailEstimator({
      product,
      service: pricingService,
      color: defaultColor(product),
      sizes: buildEmptyDetailSizes(product),
      frontColors: quickFrontColors,
      backColors: quickBackColors,
      dtfFrontPreset: quickDtfFrontPreset,
      dtfBackPreset: quickDtfBackPreset,
      dtfLeftSleeve: quickDtfLeftSleeve,
      dtfRightSleeve: quickDtfRightSleeve,
      placement: quickPlacement,
      stitchCount: quickStitchCount,
      threadColors: quickThreadColors,
      digitizingRequired: quickDigitizingRequired,
      puff3mm: quickPuff3mm,
      namesEnabled: quickNamesEnabled,
      numbersEnabled: quickNumbersEnabled,
      sameDesign: quickSameDesign,
      estimate: null,
      sizePriceBreakdown: [],
      error: "",
      isLoading: false,
    });
  }

  const detailProduct = detailEstimator?.product;
  const detailColor = detailEstimator?.color;

  useEffect(() => {
    if (!detailProduct || !detailColor) {
      return;
    }

    let isCancelled = false;
    const product = detailProduct;
    const color = detailColor;

    async function loadColorSizes() {
      const colorSizes = await fetchCatalogColorSizes(product.style, color);

      if (isCancelled || !colorSizes.length) {
        return;
      }

      setDetailEstimator((current) => {
        if (
          !current ||
          current.product.style !== product.style ||
          current.color !== color
        ) {
          return current;
        }

        return {
          ...current,
          sizes: reconcileCatalogSizes(current.sizes, product, colorSizes),
          estimate: null,
          sizePriceBreakdown: [],
          error: "",
        };
      });
    }

    loadColorSizes();

    return () => {
      isCancelled = true;
    };
  }, [detailProduct, detailColor]);

  function updateDetail(updates: Partial<DetailEstimatorState>) {
    setDetailEstimator((current) =>
      current
        ? {
            ...current,
            ...updates,
            estimate: updates.estimate === undefined ? current.estimate : updates.estimate,
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

  async function requestDetailServiceEstimate(
    currentDetail: DetailEstimatorState,
    sizeQuantities: Record<string, number>,
  ) {
    return currentDetail.service === "screenprint"
      ? requestScreenprintEstimate(
          buildScreenprintPayload({
            product: currentDetail.product,
            color: currentDetail.color,
            sizeQuantities,
            frontColors: Number(currentDetail.frontColors),
            backColors: Number(currentDetail.backColors),
            sameDesign: currentDetail.sameDesign,
          }),
        )
      : currentDetail.service === "embroidery"
        ? requestEmbroideryEstimate(
            buildEmbroideryPayload({
              product: currentDetail.product,
              color: currentDetail.color,
              sizeQuantities,
              placement: currentDetail.placement,
              stitchCount: Number(currentDetail.stitchCount),
              threadColors: Number(currentDetail.threadColors),
              digitizingRequired: currentDetail.digitizingRequired,
              puff3mm: currentDetail.puff3mm,
              namesEnabled: currentDetail.namesEnabled,
              numbersEnabled: currentDetail.numbersEnabled,
              sameDesign: currentDetail.sameDesign,
            }),
          )
        : requestDtfEstimate(
            buildDtfPayload({
              product: currentDetail.product,
              color: currentDetail.color,
              sizeQuantities,
              frontPreset: currentDetail.dtfFrontPreset,
              backPreset: currentDetail.dtfBackPreset,
              leftSleeve: currentDetail.dtfLeftSleeve,
              rightSleeve: currentDetail.dtfRightSleeve,
              sameDesign: currentDetail.sameDesign,
            }),
          );
  }

  async function findUnavailableSelectedSizes(
    currentDetail: DetailEstimatorState,
    sizeQuantities: Record<string, number>,
    probeQuantity: number,
  ) {
    const selectedSizes = Object.entries(sizeQuantities).filter(
      ([, quantity]) => Number(quantity) > 0,
    );
    const unavailable: string[] = [];

    for (const [size] of selectedSizes) {
      try {
        await requestDetailServiceEstimate(currentDetail, {
          [size]: probeQuantity,
        });
      } catch {
        unavailable.push(size);
      }
    }

    return unavailable;
  }

  async function submitDetailEstimate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!detailEstimator) {
      return;
    }

    const sizeQuantities = numericSizeQuantities(detailEstimator.sizes);
    const totalQty = getTotalQuantity(sizeQuantities);

    if (totalQty <= 0) {
      updateDetail({
        error: "Please enter at least one garment quantity.",
        estimate: null,
      });
      return;
    }

    const minimum =
      detailEstimator.service === "screenprint"
        ? screenPrintMinimumQuantity
        : detailEstimator.service === "embroidery"
          ? embroideryMinimumQuantity
          : dtfMinimumQuantity;

    if (totalQty < minimum) {
      updateDetail({
        error:
          detailEstimator.service === "screenprint"
            ? "This item is under 24 pieces. You can still add it to the quote basket and combine it with compatible styles using the same artwork."
            : detailEstimator.service === "embroidery"
              ? "Embroidery estimates start at 5 pieces."
              : "Please enter at least one garment quantity.",
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
      const estimate = await requestDetailServiceEstimate(
        detailEstimator,
        sizeQuantities,
      );

      const apiBreakdown = extractApiSizePriceBreakdown(estimate);
      const sizePriceBreakdown =
        apiBreakdown.length || detailEstimator.service === "dtf"
          ? apiBreakdown
          : await loadGroupedSizePriceBreakdown({
              sizes: sizeQuantities,
              totalQuantity: totalQty,
              buildPayload: (groupSizes) =>
                detailEstimator.service === "screenprint"
                  ? buildScreenprintPayload({
                      product: detailEstimator.product,
                      color: detailEstimator.color,
                      sizeQuantities: groupSizes,
                      frontColors: Number(detailEstimator.frontColors),
                      backColors: Number(detailEstimator.backColors),
                      sameDesign: detailEstimator.sameDesign,
                    })
                  : buildEmbroideryPayload({
                      product: detailEstimator.product,
                      color: detailEstimator.color,
                      sizeQuantities: groupSizes,
                      placement: detailEstimator.placement,
                      stitchCount: Number(detailEstimator.stitchCount),
                      threadColors: Number(detailEstimator.threadColors),
                      digitizingRequired: detailEstimator.digitizingRequired,
                      puff3mm: detailEstimator.puff3mm,
                      namesEnabled: detailEstimator.namesEnabled,
                      numbersEnabled: detailEstimator.numbersEnabled,
                      sameDesign: detailEstimator.sameDesign,
                    }),
              requestEstimate:
                detailEstimator.service === "screenprint"
                  ? requestScreenprintEstimate
                  : requestEmbroideryEstimate,
              readEach: (groupEstimate) => groupEstimate.price?.each,
            });

      updateDetail({ estimate, sizePriceBreakdown, isLoading: false });
    } catch (error) {
      const unavailableSizes = await findUnavailableSelectedSizes(
        detailEstimator,
        sizeQuantities,
        Math.max(totalQty, minimum),
      );

      if (unavailableSizes.length) {
        updateDetail({
          error: `${detailEstimator.color} does not appear to be available in ${unavailableSizes.join(
            ", ",
          )} for ${detailEstimator.product.style}, so ${
            unavailableSizes.length === 1 ? "that size was" : "those sizes were"
          } removed from this estimate. Please review the remaining sizes and get the estimate again.`,
          sizes: Object.fromEntries(
            Object.entries(detailEstimator.sizes).filter(
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
        error: getErrorMessage(error),
        estimate: null,
        sizePriceBreakdown: [],
        isLoading: false,
      });
    }
  }

  return (
    <section className="bg-[#f7f8fa] px-4 py-10 text-[#07111f] sm:px-8 sm:py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-sm bg-white p-4 shadow-[0_22px_70px_rgba(7,17,31,0.08)] ring-1 ring-black/8 sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[1fr_220px_220px_220px]">
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
            <label className="block">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-[#6a7480]">
                Sort by price
              </span>
              <select
                value={priceSort}
                onChange={(event) =>
                  setPriceSort(event.target.value as PriceSort)
                }
                className="mt-2 h-12 w-full rounded-md border border-black/12 bg-[#f7f8fa] px-4 text-sm font-semibold text-[#07111f] outline-none transition focus:border-accent focus:bg-white"
              >
                <option value="featured">Featured</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
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
                {pricingService === "screenprint"
                  ? "Screen printing"
                  : pricingService === "embroidery"
                    ? "Embroidery"
                    : "DTF transfers"}
              </p>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6a7480]">
                  Service
                </span>
                <select
                  value={pricingService}
                  onChange={(event) => {
                    const service = event.target.value as PricingService;
                    switchQuickService(service);
                  }}
                  className="mt-2 h-11 w-full rounded-md border border-black/12 bg-white px-3 text-sm font-semibold text-[#07111f]"
                >
                  <option value="screenprint">Screen Printing</option>
                  <option value="dtf">DTF Transfers</option>
                  <option value="embroidery">Embroidery</option>
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6a7480]">
                  Est. quantity
                </span>
                <input
                  type="number"
                  min={
                    pricingService === "screenprint"
                      ? screenPrintMinimumQuantity
                      : pricingService === "embroidery"
                        ? embroideryMinimumQuantity
                        : dtfMinimumQuantity
                  }
                  value={quickQuantity}
                  onChange={(event) => handleQuickQuantityChange(event.target.value)}
                  className="mt-2 h-11 w-full rounded-md border border-black/12 bg-white px-3 text-sm font-semibold text-[#07111f]"
                />
              </label>
              {pricingService === "screenprint" ? (
                <>
                  <label className="block">
                    <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6a7480]">
                      How many colors on front?
                    </span>
                    <select
                      value={quickFrontColors}
                      onChange={(event) => {
                        if (event.target.value === "dtf") {
                          switchScreenPrintColorsToDtf();
                          return;
                        }

                        setQuickFrontColors(event.target.value);
                      }}
                      className="mt-2 h-11 w-full rounded-md border border-black/12 bg-white px-3 text-sm font-semibold text-[#07111f]"
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
                      value={quickBackColors}
                      onChange={(event) => {
                        if (event.target.value === "dtf") {
                          switchScreenPrintColorsToDtf();
                          return;
                        }

                        setQuickBackColors(event.target.value);
                      }}
                      className="mt-2 h-11 w-full rounded-md border border-black/12 bg-white px-3 text-sm font-semibold text-[#07111f]"
                    >
                      {backColorOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </>
              ) : pricingService === "embroidery" ? (
                <>
                  <label className="block">
                    <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6a7480]">
                      Stitch count
                    </span>
                    <select
                      value={quickStitchCount}
                      onChange={(event) => setQuickStitchCount(event.target.value)}
                      className="mt-2 h-11 w-full rounded-md border border-black/12 bg-white px-3 text-sm font-semibold text-[#07111f]"
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
                      value={quickThreadColors}
                      onChange={(event) => setQuickThreadColors(event.target.value)}
                      className="mt-2 h-11 w-full rounded-md border border-black/12 bg-white px-3 text-sm font-semibold text-[#07111f]"
                    >
                      {threadColorOptions.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                </>
              ) : (
                <>
                  <label className="block">
                    <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6a7480]">
                      Front print preset
                    </span>
                    <select
                      value={quickDtfFrontPreset}
                      onChange={(event) =>
                        setQuickDtfFrontPreset(event.target.value)
                      }
                      className="mt-2 h-11 w-full rounded-md border border-black/12 bg-white px-3 text-sm font-semibold text-[#07111f]"
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
                      value={quickDtfBackPreset}
                      onChange={(event) =>
                        setQuickDtfBackPreset(event.target.value)
                      }
                      className="mt-2 h-11 w-full rounded-md border border-black/12 bg-white px-3 text-sm font-semibold text-[#07111f]"
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
                      checked: quickDtfLeftSleeve,
                      setter: setQuickDtfLeftSleeve,
                    },
                    {
                      label: "Right sleeve",
                      checked: quickDtfRightSleeve,
                      setter: setQuickDtfRightSleeve,
                    },
                  ].map((option) => (
                    <label
                      key={option.label}
                      className="flex min-h-11 cursor-pointer items-center justify-between rounded-md border border-black/12 bg-white px-3 text-xs font-black uppercase tracking-wide text-[#314154] md:mt-6"
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
                </>
              )}
              {[
                {
                  label: "Same design",
                  checked: quickSameDesign,
                  setter: setQuickSameDesign,
                },
              ].map((option) => (
                <label
                  key={option.label}
                  className="flex min-h-11 cursor-pointer items-center justify-between rounded-md border border-black/12 bg-white px-3 text-xs font-black uppercase tracking-wide text-[#314154] md:mt-6"
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
            {pricingService === "embroidery" ? (
              <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6a7480]">
                    Placement
                  </span>
                  <select
                    value={quickPlacement}
                    onChange={(event) => setQuickPlacement(event.target.value)}
                    className="mt-2 h-11 w-full rounded-md border border-black/12 bg-white px-3 text-sm font-semibold text-[#07111f]"
                  >
                    {placementOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
                {[
                  {
                    label: "Digitizing",
                    checked: quickDigitizingRequired,
                    setter: setQuickDigitizingRequired,
                  },
                  {
                    label: "3D puff",
                    checked: quickPuff3mm,
                    setter: setQuickPuff3mm,
                  },
                  {
                    label: "Names",
                    checked: quickNamesEnabled,
                    setter: setQuickNamesEnabled,
                  },
                  {
                    label: "Numbers",
                    checked: quickNumbersEnabled,
                    setter: setQuickNumbersEnabled,
                  },
                ].map((option) => (
                  <label
                    key={option.label}
                    className="flex min-h-11 cursor-pointer items-center justify-between rounded-md border border-black/12 bg-white px-3 text-xs font-black uppercase tracking-wide text-[#314154] md:mt-6"
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
            ) : null}
            {pricingService === "dtf" ? (
              <div className="mt-3 grid gap-3">
                <div className="rounded-md border border-black/12 bg-white px-3 py-3 text-xs font-bold leading-5 text-[#52677d]">
                  DTF is best for full-color art, short runs, names, numbers,
                  small youth sizes, and artwork that would push screen printing
                  past four colors.
                </div>
              </div>
            ) : null}
            {minimumSuggestion ? (
              <p className="mt-3 rounded-md border border-[#b9dcff] bg-[#eef6ff] p-3 text-xs font-bold leading-5 text-[#125b99]">
                {minimumSuggestion}
              </p>
            ) : null}
          </div>

          <div className="mt-4 flex flex-col gap-3 text-sm text-[#65717e] sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing {visibleProducts.length} of {filteredProducts.length}{" "}
              matching products.
            </p>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={openFloatingQuoteBasket}
                className="min-h-11 rounded-md bg-[#07111f] px-4 text-xs font-black uppercase text-white transition hover:bg-accent"
              >
                Open quote basket
              </button>
              <a
                href="https://www.companycasuals.com/huegraphics/start.jsp"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center font-black text-accent transition hover:text-[#125b99]"
              >
                View SanMar hosted catalog -&gt;
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleProducts.map((product) => {
            const estimate = catalogEstimates[product.style];
            const recommendation =
              pricingService === "screenprint"
                ? getScreenPrintRecommendation(product)
                : pricingService === "embroidery"
                  ? getEmbroideryRecommendation(product)
                  : {
                      canEstimate: true,
                      method: "dtf",
                      label: "DTF ready",
                      message: "This style can be estimated for DTF transfers.",
                    };
            const serviceLabel =
              pricingService === "screenprint"
                ? "Screen print"
                : pricingService === "embroidery"
                  ? "Embroidery"
                  : "DTF";
            const minimumLabel =
              pricingService === "screenprint"
                ? "24 pc minimum"
                : pricingService === "embroidery"
                  ? "5 pc minimum"
                  : "1 pc minimum";

            return (
              <article
                key={product.style}
                className="group overflow-hidden rounded-sm bg-white shadow-[0_18px_50px_rgba(7,17,31,0.08)] ring-1 ring-black/8 transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(31,115,190,0.16)]"
              >
                <Link
                  href={productDetailHref(product, pricingService)}
                  onClick={saveReturnState}
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
                        {recommendation.canEstimate
                          ? isStartingEstimate
                            ? "Starting price"
                            : "Quick estimate"
                          : `${serviceLabel} guidance`}
                      </p>
                      <p className="mt-1 text-sm font-black">
                        {!recommendation.canEstimate
                          ? recommendation.label
                          : estimate?.status === "ready"
                          ? `${formatPrice(estimate.each)} avg each`
                          : estimate?.status === "loading"
                            ? "Loading starting price..."
                            : "Request pricing"}
                      </p>
                      <p className="mt-1 text-[0.66rem] font-black uppercase tracking-wide text-white/58">
                        {recommendation.canEstimate
                          ? isStartingEstimate
                            ? `${minimumLabel} - 1 color / 1 side`
                            : "Based on current settings"
                          : recommendation.label}
                      </p>
                      {!recommendation.canEstimate ? (
                        <p className="mt-2 text-xs font-semibold leading-5 text-white/70">
                          {recommendation.message}
                        </p>
                      ) : null}
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
                      disabled={!recommendation.canEstimate}
                      className="min-h-11 rounded-md bg-accent px-4 text-xs font-black uppercase text-white transition hover:bg-[#2a86d8] disabled:cursor-not-allowed disabled:bg-[#9aa5b1]"
                    >
                      {recommendation.canEstimate
                        ? "Add to project quote"
                        : recommendation.label}
                    </button>
                    {!recommendation.canEstimate &&
                    pricingService === "screenprint" &&
                    recommendation.method === "embroidery" ? (
                      <Link
                        href="/embroidery"
                        className="flex min-h-11 items-center justify-center rounded-md bg-[#07111f] px-4 text-center text-xs font-black uppercase text-white transition hover:bg-accent"
                      >
                        View embroidery
                      </Link>
                    ) : null}
                    {!recommendation.canEstimate &&
                    pricingService === "embroidery" &&
                    recommendation.method === "screenprint" ? (
                      <Link
                        href="/screen-printing"
                        className="flex min-h-11 items-center justify-center rounded-md bg-[#07111f] px-4 text-center text-xs font-black uppercase text-white transition hover:bg-accent"
                      >
                        View screen printing
                      </Link>
                    ) : null}
                    <div className="grid gap-2">
                      <Link
                        href={productDetailHref(product, pricingService)}
                        onClick={saveReturnState}
                        className="flex min-h-11 items-center justify-center rounded-md border border-black/10 px-4 text-center text-xs font-black uppercase text-[#07111f] transition hover:border-accent hover:text-accent"
                      >
                        Details
                      </Link>
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

      {detailEstimator ? (
        <div className="fixed inset-0 z-[80] overflow-y-auto bg-black/60 px-4 py-4 sm:px-5 sm:py-8">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-sm bg-white shadow-[0_24px_90px_rgba(0,0,0,0.38)]">
            <div className="flex items-start justify-between gap-4 border-b border-black/10 p-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
                  Add to project quote
                </p>
                <h2 className="mt-2 text-2xl font-black uppercase leading-7 text-[#07111f] sm:text-3xl">
                  {detailEstimator.product.style} -{" "}
                  {detailEstimator.product.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDetailEstimator(null)}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-black/10 px-3 text-sm font-black text-[#07111f] transition hover:border-accent hover:text-accent"
              >
                X
              </button>
            </div>

            <div className="grid gap-px bg-[#d7e3ee] lg:grid-cols-[1fr_0.9fr]">
              <form onSubmit={submitDetailEstimate} className="bg-white p-5">
                <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6a7480]">
                      Product color
                    </p>
                    <div className="mt-2 grid max-h-64 gap-2 overflow-y-auto rounded-md border border-black/12 bg-[#f7f8fa] p-2">
                      {detailEstimator.product.colors.map((productColor) => (
                        <button
                          key={productColor.name}
                          type="button"
                          onClick={() =>
                            updateDetail({
                              color: productColor.name,
                              sizes: buildEmptyCatalogSizes(detailEstimator.product),
                              estimate: null,
                              sizePriceBreakdown: [],
                              error: "",
                            })
                          }
                          className={[
                            "flex min-h-11 items-center gap-3 rounded-md border px-3 py-2 text-left text-sm font-bold transition",
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
                    {getProductSizeOrder(
                      detailEstimator.product,
                      Object.keys(detailEstimator.sizes),
                    ).map((size) => (
                      <label key={size} className="block">
                        <span className="text-xs font-black uppercase text-[#6a7480]">
                          {size}
                        </span>
                        <input
                          type="number"
                          min={0}
                          value={detailEstimator.sizes[size] || "0"}
                          onChange={(event) =>
                            updateDetailSize(size, event.target.value)
                          }
                          className="mt-2 h-11 w-full rounded-md border border-black/12 bg-[#f7f8fa] px-3 text-sm font-semibold text-[#07111f]"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {detailEstimator.service === "screenprint" ? (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6a7480]">
                        How many colors on front?
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
                        How many colors on back?
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
                ) : detailEstimator.service === "embroidery" ? (
                  <>
                    <div className="mt-5 grid gap-4 sm:grid-cols-3">
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
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
                          className="flex min-h-11 cursor-pointer items-center justify-between rounded-md border border-black/12 bg-[#f7f8fa] px-3 text-xs font-black uppercase tracking-wide text-[#314154]"
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
                ) : (
                  <>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6a7480]">
                          Front print preset
                        </span>
                        <select
                          value={detailEstimator.dtfFrontPreset}
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
                          value={detailEstimator.dtfBackPreset}
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
                          checked: detailEstimator.dtfLeftSleeve,
                        },
                        {
                          label: "Right sleeve",
                          key: "dtfRightSleeve" as const,
                          checked: detailEstimator.dtfRightSleeve,
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
                  Current item quantity:{" "}
                  {getTotalQuantity(detailEstimator.sizes)}. You can add this
                  item to the quote basket now and keep browsing.
                </p>

                <button
                  type="submit"
                  disabled={detailEstimator.isLoading}
                  className="mt-6 min-h-12 w-full rounded-md bg-accent px-5 text-sm font-black uppercase text-white transition hover:bg-[#2a86d8] disabled:cursor-wait disabled:opacity-70"
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
                        Estimated average each:{" "}
                        {formatPrice(detailEstimator.estimate.price?.each)}
                      </p>
                      <p className="mt-2 text-xs font-semibold leading-5 text-[#65717e]">
                        Larger sizes such as 2XL and above are included in the
                        total when entered above.
                      </p>
                    </div>
                    <p className="rounded-md bg-white p-4 text-sm font-bold leading-6 text-[#314154] ring-1 ring-black/8">
                      {getEstimateSummary(
                        detailEstimator.product,
                        detailEstimator.estimate,
                      )}
                    </p>
                    <ApparelSizePriceBreakdownList
                      breakdown={detailEstimator.sizePriceBreakdown}
                      currency={detailEstimator.estimate.currency}
                    />
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
                      className="min-h-12 rounded-md bg-[#07111f] px-5 text-sm font-black uppercase text-white transition hover:bg-accent"
                    >
                      Add to quote basket
                    </button>
                  </div>
                ) : (
                  <div className="mt-5 grid gap-4">
                    <p className="rounded-md border border-dashed border-[#b5c6d6] bg-white/70 p-5 text-sm leading-7 text-[#52677d]">
                      Enter exact color, sizes, and print details to request a
                      live screen printing estimate, or add this item to the
                      quote basket and keep building the project.
                    </p>
                    <button
                      type="button"
                      onClick={addDetailToBasket}
                      className="min-h-12 rounded-md bg-[#07111f] px-5 text-sm font-black uppercase text-white transition hover:bg-accent"
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
