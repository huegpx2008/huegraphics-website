"use client";

import { useEffect, useMemo, useState } from "react";

type ProductAvailableSizesProps = {
  style: string;
  title: string;
  color: string;
  catalogAvailableSizes: string;
  sizes: string[];
};

const probeQuantity = 24;

function sizeSortValue(size: string) {
  const order = [
    "XXS",
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "2XL",
    "3XL",
    "4XL",
    "5XL",
    "6XL",
  ];
  const upper = size.toUpperCase();
  const index = order.indexOf(upper);

  return index === -1 ? order.length + upper.charCodeAt(0) : index;
}

function sortSizes(sizes: string[]) {
  return [...sizes].sort((a, b) => sizeSortValue(a) - sizeSortValue(b));
}

function formatSizeRun(sizes: string[]) {
  return sortSizes(sizes).join(", ");
}

function formatAvailableLabel(color: string, sizes: string[]) {
  const sorted = sortSizes(sizes);

  if (
    sorted.includes("S") &&
    sorted.includes("M") &&
    sorted.includes("L") &&
    sorted.includes("XL")
  ) {
    const largest = [...sorted]
      .reverse()
      .find((size) => !["S", "M", "L", "XL"].includes(size));

    return `Quote-available for ${color}: S-${largest || "XL"}`;
  }

  return `Quote-available for ${color}: ${sorted.join(", ")}`;
}

export function ProductAvailableSizes({
  style,
  title,
  color,
  catalogAvailableSizes,
  sizes,
}: ProductAvailableSizesProps) {
  const [availableSizes, setAvailableSizes] = useState<string[] | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const sizeRun = useMemo(() => formatSizeRun(sizes), [sizes]);

  useEffect(() => {
    let isCancelled = false;

    async function loadAvailableSizes() {
      if (!sizes.length || !color) {
        return;
      }

      setIsChecking(true);

      const results = await Promise.all(
        sizes.map(async (size) => {
          try {
            const response = await fetch("/api/pricing/screenprint", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                lineItems: [
                  {
                    style,
                    title,
                    color,
                    sizes: { [size]: probeQuantity },
                    sizeQty: { [size]: probeQuantity },
                  },
                ],
                printLines: [
                  { id: "front", name: "Front", colors: 1 },
                  { id: "back", name: "Back", colors: 0 },
                ],
                sameDesign: true,
              }),
            });
            const data = (await response.json()) as { ok?: boolean };

            return response.ok && data.ok !== false ? size : "";
          } catch {
            return "";
          }
        }),
      );

      if (isCancelled) {
        return;
      }

      const validSizes = results.filter(Boolean);
      setAvailableSizes(validSizes.length ? validSizes : null);
      setIsChecking(false);
    }

    loadAvailableSizes();

    return () => {
      isCancelled = true;
    };
  }, [color, sizes, style, title]);

  return (
    <>
      <div>
        <dt className="font-black uppercase text-[#7a8794]">
          Available sizes
        </dt>
        <dd className="mt-1 font-semibold text-[#263545]">
          {availableSizes
            ? formatAvailableLabel(color, availableSizes)
            : catalogAvailableSizes || sizeRun}
        </dd>
        {isChecking ? (
          <dd className="mt-1 text-xs font-bold text-[#7a8794]">
            Checking color-specific quote sizes...
          </dd>
        ) : null}
      </div>
      <div>
        <dt className="font-black uppercase text-[#7a8794]">Size run</dt>
        <dd className="mt-1 font-semibold text-[#263545]">
          {availableSizes ? formatSizeRun(availableSizes) : sizeRun}
        </dd>
      </div>
    </>
  );
}
