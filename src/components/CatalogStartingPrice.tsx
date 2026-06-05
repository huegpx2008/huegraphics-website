"use client";

import { useEffect, useState } from "react";
import type { CatalogProduct } from "@/data/sanmarCatalog.generated";
import {
  getScreenPrintRecommendation,
  screenPrintMinimumQuantity,
} from "@/lib/catalog-screenprint";

type CatalogStartingPriceProps = {
  product: CatalogProduct;
};

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

const preferredSizes = ["S", "M", "L", "XL", "2XL", "3XL"];

function formatPrice(value: number | string | undefined, currency = "USD") {
  if (typeof value === "number") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(value);
  }

  return value || "Request pricing";
}

function productSizeOrder(product: CatalogProduct) {
  const normalized = product.sizes.length ? product.sizes : preferredSizes;
  const preferred = preferredSizes.filter((size) => normalized.includes(size));
  const rest = normalized.filter((size) => !preferred.includes(size));

  return [...preferred, ...rest].slice(0, 8);
}

function buildDefaultSizes(product: CatalogProduct) {
  const sizes = productSizeOrder(product);
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

export function CatalogStartingPrice({ product }: CatalogStartingPriceProps) {
  const [estimate, setEstimate] = useState<ScreenprintEstimate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const recommendation = getScreenPrintRecommendation(product);

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
                color: product.colors[0]?.name || "",
                sizes: buildDefaultSizes(product),
                sizeQty: buildDefaultSizes(product),
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
          }),
        });
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
  }, [product, recommendation.canEstimate]);

  return (
    <div className="bg-white/8 p-5">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-white/50">
        {recommendation.canEstimate
          ? "Starting price"
          : "Screen print guidance"}
      </p>
      <p className="mt-2 text-xl font-black text-white">
        {!recommendation.canEstimate
          ? recommendation.label
          : isLoading
          ? "Loading..."
          : estimate?.price?.each
            ? `${formatPrice(estimate.price.each)} each`
            : "Request pricing"}
      </p>
      <p className="mt-2 text-xs font-black uppercase tracking-wide text-[#9fc8ef]">
        {recommendation.canEstimate
          ? "24 pc minimum - 1 color / 1 side"
          : recommendation.method === "dtf"
            ? "DTF recommended"
            : "Embroidery recommended"}
      </p>
      {!recommendation.canEstimate ? (
        <p className="mt-3 text-xs font-semibold leading-5 text-white/70">
          {recommendation.message}
        </p>
      ) : null}
    </div>
  );
}
