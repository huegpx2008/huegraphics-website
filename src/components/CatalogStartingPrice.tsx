"use client";

import { useEffect, useState } from "react";
import type { CatalogProduct } from "@/data/sanmarCatalog.generated";
import {
  embroideryMinimumQuantity,
  getEmbroideryRecommendation,
} from "@/lib/catalog-embroidery";
import {
  getScreenPrintRecommendation,
  screenPrintMinimumQuantity,
} from "@/lib/catalog-screenprint";
import {
  fetchCatalogColorSizes,
  getProductSizeOrder,
} from "@/lib/catalog-size-options";

type CatalogStartingPriceProps = {
  product: CatalogProduct;
};

type PricingService = "screenprint" | "embroidery";

type ScreenprintEstimate = {
  ok?: boolean;
  price?: {
    retail?: number | string;
    each?: number | string;
  };
  error?: {
    message?: string;
  };
};

function formatPrice(value: number | string | undefined, currency = "USD") {
  if (typeof value === "number") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(value);
  }

  return value || "Request pricing";
}

function productSizeOrder(product: CatalogProduct, colorSizes?: string[]) {
  return getProductSizeOrder(product, colorSizes);
}

function buildDefaultSizes(product: CatalogProduct, colorSizes?: string[]) {
  const sizes = productSizeOrder(product, colorSizes);
  const activeSizes = sizes.filter((size) =>
    ["S", "M", "L", "XL"].includes(size),
  );
  const distributionSizes = activeSizes.length ? activeSizes : sizes.slice(0, 4);
  const result = Object.fromEntries(sizes.map((size) => [size, 0]));

  distributionSizes.forEach((size, index) => {
    result[size] =
      Math.floor(screenPrintMinimumQuantity / distributionSizes.length) +
      (index < screenPrintMinimumQuantity % distributionSizes.length ? 1 : 0);
  });

  return result;
}

function buildEmbroideryDefaultSizes(
  product: CatalogProduct,
  colorSizes?: string[],
) {
  const sizes = productSizeOrder(product, colorSizes);
  const targetSize = sizes.includes("L") ? "L" : sizes[0];

  return Object.fromEntries(
    sizes.map((size) => [
      size,
      size === targetSize ? embroideryMinimumQuantity : 0,
    ]),
  );
}

export function CatalogStartingPrice({ product }: CatalogStartingPriceProps) {
  const [estimate, setEstimate] = useState<ScreenprintEstimate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [service, setService] = useState<PricingService>("screenprint");
  const recommendation =
    service === "screenprint"
      ? getScreenPrintRecommendation(product)
      : getEmbroideryRecommendation(product);

  useEffect(() => {
    if (window.location.search.includes("service=embroidery")) {
      setService("embroidery");
    }
  }, []);

  useEffect(() => {
    if (!recommendation.canEstimate) {
      setEstimate(null);
      setIsLoading(false);
      return;
    }

    let isCancelled = false;

    async function loadStartingPrice() {
      setIsLoading(true);

      try {
        const isEmbroidery = service === "embroidery";
        const color = product.colors[0]?.name || "";
        const colorSizes = await fetchCatalogColorSizes(product.style, color);
        const availableSizes = colorSizes.length ? colorSizes : product.sizes;
        const sizes = isEmbroidery
          ? buildEmbroideryDefaultSizes(product, availableSizes)
          : buildDefaultSizes(product, availableSizes);
        const response = await fetch(
          isEmbroidery ? "/api/pricing/embroidery" : "/api/pricing/screenprint",
          {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            isEmbroidery
              ? {
                  lineItems: [
                    {
                      style: product.style,
                      title: product.title,
                      color,
                      sizes,
                      sizeQty: sizes,
                    },
                  ],
                  locations: [
                    {
                      placement: product.category === "Caps" ? "Hat Front" : "Left Chest",
                      stitchCount: 5000,
                      threadColors: 2,
                      puff3mm: false,
                    },
                  ],
                  options: {
                    digitizingRequired: false,
                    names: { enabled: false, large: false },
                    numbers: { enabled: false, large: false },
                  },
                  sameDesign: true,
                }
              : {
                  lineItems: [
                    {
                      style: product.style,
                      title: product.title,
                      color,
                      sizes,
                      sizeQty: sizes,
                    },
                  ],
                  printLines: [
                    {
                      id: "front",
                      name: "Front",
                      colors: 1,
                    },
                    {
                      id: "back",
                      name: "Back",
                      colors: 0,
                    },
                  ],
                  sameDesign: true,
                },
          ),
          },
        );
        const data = (await response.json()) as ScreenprintEstimate;

        if (!isCancelled) {
          setEstimate(response.ok ? data : null);
        }
      } catch {
        if (!isCancelled) {
          setEstimate(null);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadStartingPrice();

    return () => {
      isCancelled = true;
    };
  }, [product, recommendation.canEstimate, service]);

  return (
    <div className="bg-white/8 p-5">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-white/50">
        {recommendation.canEstimate
          ? "Starting price"
          : service === "screenprint"
            ? "Screen print guidance"
            : "Embroidery guidance"}
      </p>
      <p className="mt-2 text-xl font-black text-white">
        {!recommendation.canEstimate
          ? recommendation.label
          : isLoading
          ? "Loading..."
          : estimate?.price?.each
            ? `${formatPrice(estimate.price.each)} avg each`
            : "Request pricing"}
      </p>
      <p className="mt-2 text-xs font-black uppercase tracking-wide text-[#9fc8ef]">
        {recommendation.canEstimate
          ? service === "screenprint"
            ? "24 pc minimum - 1 color / 1 side"
            : "5 pc minimum - left chest / 5k stitches"
          : recommendation.label}
      </p>
      {!recommendation.canEstimate ? (
        <p className="mt-3 text-xs font-semibold leading-5 text-white/70">
          {recommendation.message}
        </p>
      ) : null}
    </div>
  );
}
