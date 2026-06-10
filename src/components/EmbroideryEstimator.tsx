"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  addItemToFloatingQuoteBasket,
  openFloatingQuoteBasket,
  type QuoteBasketItem,
} from "@/components/FloatingQuoteBasket";
import { ApparelSizePriceBreakdownList } from "@/components/ApparelSizePriceBreakdown";
import type { CatalogProduct } from "@/data/sanmarCatalog.generated";
import { embroideryMinimumQuantity } from "@/lib/catalog-embroidery";
import {
  loadGroupedSizePriceBreakdown,
  type ApparelSizePriceBreakdown,
} from "@/lib/apparel-size-breakdown";

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
  sections: NavigatorSection[];
};

type NavigatorSection = {
  id: string;
  label: string;
  description: string;
  styles: string[];
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
  sizePriceBreakdown: ApparelSizePriceBreakdown[];
  error: string;
  isLoading: boolean;
};

const preferredSizes = ["S", "M", "L", "XL", "2XL", "3XL"];
const returnUrlKey = "hue-catalog-return-url";
const returnScrollKey = "hue-catalog-return-scroll-y";
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
    sections: [
      {
        id: "polo-retail-travismathew",
        label: "Retail Brands: TravisMathew",
        description: "Premium retail polos with modern fabrics and a polished finish.",
        styles: [
          "TM1MY403",
          "TM1MY402",
          "TMA41462",
          "TM1MAA369",
          "TM1LD005",
          "TM1MY404",
          "TM1WW002",
          "TMA41461",
          "TM1LF071",
          "TM1MAA370",
          "TM1MU411",
          "TM1WW001",
          "TM1MU410",
          "TM1WX002",
        ],
      },
      {
        id: "polo-retail-nike",
        label: "Retail Brands: Nike",
        description: "Dri-FIT and performance Nike polos from the polo navigator.",
        styles: [
          "NKDC2108",
          "NKFQ3968",
          "NKDX6684",
          "NKDX6685",
          "203690",
          "203697",
          "799802",
          "811807",
          "267020",
          "286772",
          "NKDC1963",
          "NKDC1991",
          "883681",
          "838957",
          "NKBV6042",
        ],
      },
      {
        id: "polo-retail-ogio",
        label: "Retail Brands: OGIO",
        description: "OGIO polos with a sportier retail feel and embroidery-friendly surfaces.",
        styles: [
          "OG170",
          "LOG170",
          "OG101",
          "LOG101",
          "OG138",
          "LOG138",
          "OG109",
          "OG152",
          "OG122",
          "LOG122",
          "OG143",
          "OG154",
          "LOG154",
          "OG125",
          "LOG125",
        ],
      },
      {
        id: "polo-port-authority",
        label: "Industry Exclusives: Port Authority",
        description: "Core professional polos, including Silk Touch and performance options.",
        styles: [
          "K240",
          "LK240",
          "K528",
          "L528",
          "K110",
          "LK110",
          "K572",
          "L572",
          "K863",
          "LK863",
          "K200",
          "LK200",
          "K100",
          "TLK100",
          "L100",
          "Y100",
          "K8000",
          "TK8000",
          "LK8000",
          "K500",
          "TLK500",
          "L500",
          "Y500",
        ],
      },
      {
        id: "polo-sport-tek",
        label: "Industry Exclusives: Sport-Tek",
        description: "Performance polos for teams, schools, and active staff apparel.",
        styles: [
          "ST520",
          "LST520",
          "T474",
          "L474",
          "ST665",
          "LST665",
          "ST550",
          "LST550",
          "ST655",
          "TST655",
          "LST655",
          "ST740",
          "LST740",
          "YST740",
          "ST640",
          "LST640",
          "YST640",
          "ST650",
          "TST650",
          "LST650",
          "ST405",
          "LST405",
        ],
      },
      {
        id: "polo-cornerstone",
        label: "Industry Exclusives: CornerStone",
        description: "Hardworking snag-proof and tactical polos for crews and workwear.",
        styles: [
          "CS4020",
          "CS4020P",
          "CS410",
          "TLCS410",
          "CS411",
          "CS420",
          "CS450",
          "TLCS450",
          "CS451",
          "CS412",
          "TLCS412",
          "CS413",
          "CS418",
          "TLCS418",
          "CS419",
        ],
      },
    ],
  },
  {
    id: "wovens",
    label: "Wovens",
    eyebrow: "Dress shirt navigator",
    summary:
      "Button-down and woven shirts that look sharp with a left chest embroidered logo.",
    pdf: "/2025-Wovens-Navigator-0316Update-SM-Links.pdf",
    sections: [
      {
        id: "woven-easy-care",
        label: "Easy Care",
        description: "Wrinkle-resistant dress shirts and easy-care woven options.",
        styles: [
          "BB18002",
          "TBB18002",
          "BB18003",
          "W680",
          "LW680",
          "S608",
          "TLS608",
          "S608ES",
          "L608",
          "BB18000",
          "TBB18000",
          "BB18001",
          "MM2000",
          "MM2001",
          "W100",
          "TW100",
          "LW100",
        ],
      },
      {
        id: "woven-oxfords-fishing",
        label: "Oxfords & Fishing",
        description: "Oxford cloth, fishing shirts, and UV daybreak woven styles.",
        styles: [
          "BB18004",
          "BB18005",
          "MM2002",
          "MM2003",
          "S658",
          "TS658",
          "L658",
          "EB600",
          "W960",
          "LW960",
          "CT107106",
        ],
      },
      {
        id: "woven-workwear",
        label: "Workwear",
        description: "Durable woven work shirts for crews, field staff, and uniforms.",
        styles: [
          "CT105291",
          "SLU2",
          "CSW174",
          "CT106689",
          "SP14",
          "SP14LONG",
          "CSW176",
        ],
      },
      {
        id: "woven-short-sleeve",
        label: "Short Sleeve / Camp",
        description: "Short-sleeve woven shirts and camp shirts for warmer-weather uniforms.",
        styles: ["ST326815TB", "MM2006", "W400", "LW400", "ST325929TB", "S535"],
      },
      {
        id: "woven-womens",
        label: "Women's",
        description: "Blouses and tunics from the woven/dress shirts navigator.",
        styles: ["BB18007", "MM2011", "LW713", "BB18009", "LOG1002", "LW701"],
      },
    ],
  },
  {
    id: "headwear",
    label: "Headwear",
    eyebrow: "Headwear navigator",
    summary:
      "Caps, beanies, and structured headwear for teams, crews, shops, and events.",
    pdf: "/Headwear-Navigator-2025-FINAL-1106Update-SM.pdf",
    sections: [
      {
        id: "headwear-stretch-fit",
        label: "Stretch Fit Caps",
        description: "Structured stretch caps from the headwear navigator.",
        styles: [
          "C865",
          "C813",
          "C812",
          "C938",
          "NE1000",
          "NE1020",
          "TM1MU426",
          "NKFD9718",
          "NKFB6448",
        ],
      },
      {
        id: "headwear-performance",
        label: "Performance Caps",
        description: "Lightweight, moisture-wicking, and performance cap options.",
        styles: [
          "NKFB6447",
          "NE406",
          "C833",
          "YC833",
          "NKFD9709",
          "NE209",
          "STC39",
          "NKFB6445",
          "OG604",
          "STC26",
          "YSTC26",
        ],
      },
      {
        id: "headwear-flat-bill",
        label: "Flat Bill Caps",
        description: "Flat bill and snapback caps with a more modern profile.",
        styles: [
          "NE404",
          "STC38",
          "NE4030",
          "NE4020",
          "DT624",
          "NE207",
          "STC64",
          "STC19",
          "NE400",
        ],
      },
      {
        id: "headwear-mesh-back",
        label: "Mesh Back Caps",
        description: "Trucker and mesh-back caps for breathable everyday wear.",
        styles: ["NE205", "C402", "YC402", "CT106577", "C110", "STC54", "TM1MU423", "NE204", "C911"],
      },
      {
        id: "headwear-classic",
        label: "Classic Caps",
        description: "Traditional structured and unstructured caps.",
        styles: ["NE200", "CP80", "YCP80", "CT103938", "DT600", "CP86", "NE201", "CP78", "PWU", "LPWU", "STC43"],
      },
      {
        id: "headwear-camo",
        label: "Camo Caps",
        description: "Camouflage and outdoor-inspired caps.",
        styles: ["C925", "C855", "C819", "C869", "C930", "RU900", "C871"],
      },
      {
        id: "headwear-full-brim",
        label: "Full Brim Hats",
        description: "Bucket, brim, and outdoor sun hats.",
        styles: ["NE800", "C948", "C920", "NKBFN6319", "C921", "PWSH2", "C947", "C980", "C976"],
      },
      {
        id: "headwear-visors",
        label: "Visors",
        description: "Performance and fashion visor options.",
        styles: ["NKFB6446", "STC57", "C983", "NKFB5675", "STC51", "C840", "NE219", "STC27", "CP45"],
      },
      {
        id: "headwear-beanies",
        label: "Fleece Caps / Beanies",
        description: "Beanies, knit caps, and fleece-lined cold-weather headwear.",
        styles: ["NKFN6310", "NE902", "C977", "CT104597", "CTA205", "NE900", "CP90", "DT815", "CP90L"],
      },
    ],
  },
  {
    id: "bags",
    label: "Bags",
    eyebrow: "Bags navigator",
    summary:
      "Backpacks, totes, duffels, and everyday bags for schools, events, and business gifts.",
    pdf: "/BagsNavigator-2025-0317Update-SM-Links.pdf",
    sections: [
      {
        id: "bag-retail-backpacks",
        label: "Retail Brands Backpacks",
        description: "Premium retail backpack styles from OGIO, The North Face, Nike, and Carhartt.",
        styles: [
          "411065",
          "417054",
          "NF0A3KX6",
          "411092",
          "NKDH7709",
          "CT89241804",
          "411067",
          "NF0A3KX7",
          "CT89350303",
        ],
      },
      {
        id: "bag-exclusive-backpacks",
        label: "Exclusive Brands Backpacks",
        description: "Port Authority, Mercer+Mettle, and CornerStone backpack options.",
        styles: ["MMB200", "BG204", "CSB205", "BG226", "BG203", "BG217", "BG208", "BG1020", "BG223"],
      },
      {
        id: "bag-cinch",
        label: "Cinch Packs",
        description: "Simple drawstring and cinch packs for events, schools, and giveaways.",
        styles: ["BG615", "BG611", "BG6200", "NKDM3978", "92000", "412045", "BG637", "BG810", "BST600"],
      },
      {
        id: "bag-coolers",
        label: "Coolers & Lunch Bags",
        description: "Coolers and lunch bags that can carry embroidered branding.",
        styles: ["BG516", "EB800", "408113", "BG512", "CT89132109", "CT89251601", "BG513", "CT89032822", "CSB505"],
      },
      {
        id: "bag-duffels",
        label: "Duffel Bags",
        description: "Gym, travel, and sport duffels from the bags navigator.",
        styles: ["BG99", "BB18880", "95001", "BG970", "CT89260209", "NKDM3976", "BG980", "TMB205", "108087"],
      },
      {
        id: "bag-totes",
        label: "Totes",
        description: "Cotton, twill, laptop, and everyday tote styles.",
        styles: ["B0750", "BB18840", "BG435", "B050", "220", "94000", "B400", "BG1500", "MMB202", "B300"],
      },
      {
        id: "bag-messenger",
        label: "Messenger Bags & Briefcases",
        description: "Computer cases, briefcases, and messenger bags.",
        styles: ["BG302", "BB18830", "117023", "BG304", "417018", "417012", "BG305", "711207", "417015"],
      },
      {
        id: "bag-crossbody",
        label: "Crossbody, Hip Packs & Sling Packs",
        description: "Small packs, crossbody bags, sling packs, and hip packs.",
        styles: ["BG905", "CT89098101", "97002", "BG1010", "92002", "BG935", "BG936", "COTOBFP", "MMB600"],
      },
    ],
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

function saveReturnState() {
  window.sessionStorage.setItem(
    returnUrlKey,
    `${window.location.pathname}${window.location.search}`,
  );
  window.sessionStorage.setItem(returnScrollKey, String(window.scrollY));
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
  const productByStyle = useMemo(
    () => new Map(products.map((product) => [product.style, product])),
    [products],
  );
  const [activeGroup, setActiveGroup] = useState<NavigatorCategory>("polos");
  const [activeSectionId, setActiveSectionId] = useState(
    navigatorGroups[0].sections[0].id,
  );
  const [quantity, setQuantity] = useState(String(embroideryMinimumQuantity));
  const [placement, setPlacement] = useState("Left Chest");
  const [stitchCount, setStitchCount] = useState("5000");
  const [threadColors, setThreadColors] = useState("2");
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
  const activeSection =
    group.sections.find((section) => section.id === activeSectionId) ??
    group.sections[0];
  const visibleProducts = useMemo(
    () =>
      activeSection.styles
        .map((style) => productByStyle.get(style))
        .filter((product): product is CatalogProduct => Boolean(product)),
    [activeSection, productByStyle],
  );
  const normalizedQuantity = normalizeQuantity(quantity);

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
  }, [activeGroup, activeSectionId]);

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
                    placement: activeGroup === "headwear" ? "Hat Front" : placement,
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
    activeGroup,
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
      placement: activeGroup === "headwear" ? "Hat Front" : placement,
      stitchCount,
      threadColors,
      digitizingRequired,
      puff3mm,
      namesEnabled,
      numbersEnabled,
      sameDesign: true,
      estimate: null,
      sizePriceBreakdown: [],
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

    if (totalQty < embroideryMinimumQuantity) {
      updateDetail({
        error: "Embroidery estimates start at 5 pieces.",
        estimate: null,
        sizePriceBreakdown: [],
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
      const numericSizes = numericSizeQuantities(detailEstimator.sizes);
      const buildPayload = (sizeQuantities: Record<string, number>) =>
        buildEmbroideryPayload({
          product: detailEstimator.product,
          color: detailEstimator.color,
          sizeQuantities,
          placement: detailEstimator.placement,
          stitchCount: Number(detailEstimator.stitchCount),
          threadColors: Number(detailEstimator.threadColors),
          digitizingRequired: detailEstimator.digitizingRequired,
          puff3mm: detailEstimator.puff3mm,
          namesEnabled: detailEstimator.namesEnabled,
          numbersEnabled: detailEstimator.numbersEnabled,
          sameDesign: detailEstimator.sameDesign,
        });
      const estimate = await requestEmbroideryEstimate(buildPayload(numericSizes));
      const sizePriceBreakdown = await loadGroupedSizePriceBreakdown({
        sizes: numericSizes,
        totalQuantity: totalQty,
        buildPayload,
        requestEstimate: requestEmbroideryEstimate,
        readEach: (estimate) => estimate.price?.each,
      });

      updateDetail({ estimate, sizePriceBreakdown, isLoading: false });
    } catch (error) {
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
        sizePricingSummary() ? `Size pricing: ${sizePricingSummary()}` : "",
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
    <section className="px-4 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[96rem] overflow-hidden rounded-sm bg-[#f4f8fc] shadow-[0_24px_70px_rgba(7,17,31,0.16)] ring-1 ring-black/10">
        <div className="relative bg-[#07111f] p-5 text-white sm:p-7 lg:p-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-accent" />
          <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr] xl:items-end">
            <div>
              <p className="eyebrow text-accent">Embroidery navigator</p>
              <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-3xl font-black uppercase leading-[0.94] text-white sm:text-5xl">
                Quick live price guide.
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#d6e3f0]">
                Compare popular polos, dress shirts, hats, and bags with live
                embroidery estimates from the pricing app. Start with stitch
                count and thread colors, then open a detailed estimate when you
                are ready for sizes and exact color.
              </p>
            </div>

            <div className="grid items-end gap-3 rounded-sm border border-white/10 bg-white/[0.04] p-4 md:grid-cols-2 xl:grid-cols-5">
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
                className="min-h-11 rounded-md border border-white/20 px-4 text-xs font-black uppercase text-white transition hover:border-accent hover:bg-accent/20"
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
                className="flex min-h-11 cursor-pointer items-center justify-between rounded-md border border-white/10 bg-white/[0.04] px-3 text-xs font-black uppercase tracking-wide text-[#d6e3f0]"
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
                  onClick={() => {
                    setActiveGroup(item.id);
                    setActiveSectionId(item.sections[0].id);
                    setPlacement(item.id === "headwear" ? "Hat Front" : "Left Chest");
                  }}
                  className={[
                    "min-h-11 rounded-md border px-4 py-3 text-left text-xs font-black uppercase tracking-wide transition",
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
              className="mt-5 inline-flex min-h-11 items-center rounded-md border border-white/18 px-4 text-xs font-black uppercase text-white transition hover:border-accent hover:bg-accent/12"
            >
              Open {group.label} PDF
            </a>
            <Link
              href="/custom-catalog?service=embroidery"
              className="mt-3 inline-flex min-h-11 items-center rounded-md bg-white px-4 text-xs font-black uppercase text-[#07111f] transition hover:bg-[#d8ecff]"
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
              <div className="mt-5 flex flex-wrap gap-2">
                {group.sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSectionId(section.id)}
                    className={[
                      "min-h-10 rounded-full border px-4 text-xs font-black uppercase tracking-wide transition",
                      activeSection.id === section.id
                        ? "border-accent bg-accent text-white"
                        : "border-black/10 bg-white text-[#314154] hover:border-accent hover:text-accent",
                    ].join(" ")}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
              <div className="mt-5 rounded-sm border border-accent/20 bg-white p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-accent">
                  {activeSection.label}
                </p>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#52677d]">
                  {activeSection.description}
                </p>
                <p className="mt-2 text-xs font-black uppercase tracking-wide text-[#7a8794]">
                  Showing {visibleProducts.length} matching catalog styles from
                  this PDF section.
                </p>
              </div>
            </div>

            {visibleProducts.length ? (
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
                      href={`/custom-catalog/${encodeURIComponent(product.style)}?service=embroidery`}
                      onClick={saveReturnState}
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
                              ? `${formatPrice(estimate.each)} avg each`
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
                        className="min-h-11 rounded-md bg-accent px-4 text-xs font-black uppercase text-white transition hover:bg-[#2a86d8]"
                      >
                        Get price now
                      </button>
                      <Link
                        href={`/custom-catalog/${encodeURIComponent(product.style)}?service=embroidery`}
                        onClick={saveReturnState}
                        className="flex min-h-11 items-center justify-center rounded-md border border-black/10 px-4 text-center text-xs font-black uppercase text-[#07111f] transition hover:border-accent hover:text-accent"
                      >
                        Details
                      </Link>
                    </div>
                  </article>
                );
              })}
              </div>
            ) : (
              <div className="rounded-sm border border-dashed border-[#b5c6d6] bg-white p-8 text-center">
                <p className="text-sm font-bold text-[#52677d]">
                  The PDF includes styles in this section that are not in the
                  current generated catalog data yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {detailEstimator ? (
        <div className="fixed inset-0 z-[80] overflow-y-auto bg-black/60 px-4 py-4 sm:px-5 sm:py-8">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-sm bg-white shadow-[0_24px_90px_rgba(0,0,0,0.38)]">
            <div className="flex items-start justify-between gap-4 border-b border-black/10 p-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
                  Embroidery estimate
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

                <p className="mt-3 text-xs font-semibold leading-5 text-[#65717e]">
                  Pricing shown is an estimate and may be adjusted after artwork
                  and production review.
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
                    <ApparelSizePriceBreakdownList
                      breakdown={detailEstimator.sizePriceBreakdown}
                      currency={detailEstimator.estimate.currency}
                    />
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
                      className="min-h-12 rounded-md bg-[#07111f] px-5 text-sm font-black uppercase text-white transition hover:bg-accent"
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
