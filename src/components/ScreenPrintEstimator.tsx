"use client";

import { FormEvent, useMemo, useState } from "react";

const styleOptions = [
  {
    style: "5000",
    title: "Gildan Heavy Cotton Tee",
    colors: ["Black", "White", "Navy", "Sport Grey", "Red", "Royal"],
  },
  {
    style: "8000",
    title: "Gildan DryBlend Tee",
    colors: ["Black", "White", "Navy", "Sport Grey", "Red", "Royal"],
  },
  {
    style: "PC54",
    title: "Port & Company Core Cotton Tee",
    colors: ["Black", "White", "Athletic Heather", "Navy", "Red", "Royal"],
  },
  {
    style: "18500",
    title: "Gildan Heavy Blend Hooded Sweatshirt",
    colors: ["Black", "White", "Navy", "Sport Grey", "Red", "Royal"],
  },
];

const sizes = ["S", "M", "L", "XL", "2XL", "3XL"] as const;

type SizeName = (typeof sizes)[number];

type ScreenprintEstimate = {
  ok?: boolean;
  retail?: number | string;
  each?: number | string;
  averagePricePerShirt?: number | string;
  totalGarments?: number | string;
  currency?: string;
  price?: {
    retail?: number | string;
    each?: number | string;
  };
  summary?: {
    totalQuantity?: number | string;
    lineItems?: {
      style?: string;
      productName?: string;
      title?: string;
      color?: string;
      quantity?: number | string;
      sizes?: Record<string, number>;
      sizeQty?: Record<string, number>;
    }[];
  };
  lineItems?: {
    style?: string;
    productName?: string;
    title?: string;
    color?: string;
    sizeQty?: Record<string, number>;
    sizes?: Record<string, number>;
    totalQty?: number | string;
    quantity?: number | string;
  }[];
  warnings?: string[];
  error?: {
    message?: string;
    fields?: Record<string, string>;
  };
};

function formatPrice(value: number | string | undefined, currency = "USD") {
  if (typeof value === "number") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(value);
  }

  return value || "Returned by API";
}

function getErrorMessage(data: ScreenprintEstimate, fallback: string) {
  const fieldMessages = data.error?.fields
    ? Object.entries(data.error.fields).map(([field, message]) => `${field}: ${message}`)
    : [];

  return [data.error?.message || fallback, ...fieldMessages].join(" ");
}

function getTotalQuantity(sizeQty: Record<SizeName, string>) {
  return sizes.reduce((total, size) => total + Number(sizeQty[size] || 0), 0);
}

function getGarmentSummary(estimate: ScreenprintEstimate, fallback: string) {
  const line = estimate.summary?.lineItems?.[0] ?? estimate.lineItems?.[0];

  if (!line) {
    return fallback;
  }

  const sizeSource = line.sizeQty ?? line.sizes ?? {};
  const sizeText =
    Object.entries(sizeSource)
      .filter(([, quantity]) => Number(quantity) > 0)
      .map(([size, quantity]) => `${size}: ${quantity}`)
      .join(", ") || "No sizes returned";

  const productName = line.productName ?? line.title;

  return `${line.style || "Style"} ${productName ? `- ${productName}` : ""} - ${
    line.color || "Color"
  } - ${sizeText}`;
}

export function ScreenPrintEstimator() {
  const [style, setStyle] = useState(styleOptions[0].style);
  const selectedStyle = useMemo(
    () => styleOptions.find((styleOption) => styleOption.style === style) ?? styleOptions[0],
    [style],
  );
  const [color, setColor] = useState(selectedStyle.colors[0]);
  const [sizeQty, setSizeQty] = useState<Record<SizeName, string>>({
    S: "6",
    M: "6",
    L: "6",
    XL: "6",
    "2XL": "0",
    "3XL": "0",
  });
  const [frontColors, setFrontColors] = useState("1");
  const [backColors, setBackColors] = useState("0");
  const [sameDesign, setSameDesign] = useState(true);
  const [estimate, setEstimate] = useState<ScreenprintEstimate | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function updateStyle(nextStyle: string) {
    const styleOption =
      styleOptions.find((option) => option.style === nextStyle) ?? styleOptions[0];
    setStyle(nextStyle);
    setColor(styleOption.colors[0]);
    setEstimate(null);
    setError("");
  }

  function updateSize(size: SizeName, quantity: string) {
    setSizeQty((current) => ({
      ...current,
      [size]: quantity,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEstimate(null);
    setError("");

    const totalQty = getTotalQuantity(sizeQty);

    if (totalQty <= 0) {
      setError("Please enter at least one garment quantity.");
      return;
    }

    const numericSizes = Object.fromEntries(
      sizes.map((size) => [size, Number(sizeQty[size] || 0)]),
    );

    const payload = {
      lineItems: [
        {
          style: selectedStyle.style,
          title: selectedStyle.title,
          color,
          sizes: numericSizes,
          sizeQty: numericSizes,
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
      sameDesign,
    };

    setIsLoading(true);

    try {
      const response = await fetch("/api/pricing/screenprint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as ScreenprintEstimate;

      if (!response.ok || data.ok === false) {
        setError(
          getErrorMessage(
            data,
            "The screen printing pricing API could not return an estimate.",
          ),
        );
        return;
      }

      setEstimate(data);
    } catch {
      setError(
        "The screen printing estimate could not be loaded right now. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  const totalQuantity =
    estimate?.summary?.totalQuantity ??
    estimate?.totalGarments ??
    getTotalQuantity(sizeQty);
  const fallbackSummary = `${selectedStyle.style} - ${selectedStyle.title} - ${color}`;

  return (
    <section className="px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-sm bg-[#07111f] shadow-[0_24px_70px_rgba(7,17,31,0.16)] ring-1 ring-black/10 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="relative overflow-hidden border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r">
          <div className="absolute inset-x-0 top-0 h-1 bg-accent" />
          <p className="eyebrow text-accent">API proof of concept</p>
          <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.94] text-white sm:text-5xl">
            Screen printing estimate.
          </h2>
          <p className="mt-6 text-sm leading-7 text-[#d6e3f0]">
            Select a common garment style, color, size quantities, and print
            colors. Pricing is requested from the screen printing API and shown
            exactly as returned.
          </p>
          <div className="mt-8 rounded-md border border-white/10 bg-white/5 p-4 text-xs font-bold uppercase tracking-[0.16em] text-[#9fb4c8]">
            No costs or formulas are exposed on this website.
          </div>
        </div>

        <div className="grid gap-px bg-white/10 xl:grid-cols-[1.08fr_0.92fr]">
          <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-black uppercase tracking-[0.16em] text-[#314154]">
                Style
                <select
                  value={style}
                  onChange={(event) => updateStyle(event.target.value)}
                  className="mt-2 h-12 w-full rounded-md border border-[#c9d7e6] bg-[#f4f8fc] px-3 text-sm font-black text-[#07111f] outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                >
                  {styleOptions.map((styleOption) => (
                    <option key={styleOption.style} value={styleOption.style}>
                      {styleOption.style} - {styleOption.title}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-xs font-black uppercase tracking-[0.16em] text-[#314154]">
                Color
                <select
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                  className="mt-2 h-12 w-full rounded-md border border-[#c9d7e6] bg-[#f4f8fc] px-3 text-sm font-black text-[#07111f] outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                >
                  {selectedStyle.colors.map((colorOption) => (
                    <option key={colorOption} value={colorOption}>
                      {colorOption}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#314154]">
                Quantities by size
              </p>
              <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {sizes.map((size) => (
                  <label
                    key={size}
                    className="text-xs font-black uppercase tracking-[0.16em] text-[#314154]"
                  >
                    {size}
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={sizeQty[size]}
                      onChange={(event) => updateSize(size, event.target.value)}
                      className="mt-2 h-12 w-full rounded-md border border-[#c9d7e6] bg-[#f4f8fc] px-3 text-base font-black text-[#07111f] outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <label className="text-xs font-black uppercase tracking-[0.16em] text-[#314154]">
                Front colors
                <select
                  value={frontColors}
                  onChange={(event) => setFrontColors(event.target.value)}
                  className="mt-2 h-12 w-full rounded-md border border-[#c9d7e6] bg-[#f4f8fc] px-3 text-sm font-black text-[#07111f] outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                >
                  {[0, 1, 2, 3, 4].map((count) => (
                    <option key={count} value={count}>
                      {count}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-black uppercase tracking-[0.16em] text-[#314154]">
                Back colors
                <select
                  value={backColors}
                  onChange={(event) => setBackColors(event.target.value)}
                  className="mt-2 h-12 w-full rounded-md border border-[#c9d7e6] bg-[#f4f8fc] px-3 text-sm font-black text-[#07111f] outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                >
                  {[0, 1, 2, 3, 4].map((count) => (
                    <option key={count} value={count}>
                      {count}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex cursor-pointer items-center justify-between rounded-md border border-[#c9d7e6] bg-[#f4f8fc] px-4 py-3 text-sm font-black uppercase tracking-wide text-[#07111f] transition hover:border-accent sm:mt-6">
                <span>Same Design</span>
                <input
                  type="checkbox"
                  checked={sameDesign}
                  onChange={(event) => setSameDesign(event.target.checked)}
                  className="h-5 w-5 accent-[#1f73be]"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-accent px-6 py-4 text-sm font-black uppercase tracking-wide text-white shadow-[0_18px_36px_rgba(31,115,190,0.28)] transition hover:bg-[#2a86d8] disabled:cursor-wait disabled:opacity-70"
            >
              {isLoading ? "Getting estimate..." : "Get Screen Print Estimate"}
            </button>

            {error ? (
              <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-red-700">
                {error}
              </div>
            ) : null}
          </form>

          <div className="bg-[#eef4fa] p-5 sm:p-7">
            <p className="eyebrow">Estimate</p>
            {estimate ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-md bg-white p-5 shadow-[0_12px_32px_rgba(7,17,31,0.08)] ring-1 ring-black/8">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#678197]">
                    Estimated total
                  </p>
                  <p className="mt-2 text-4xl font-black text-[#07111f]">
                    {formatPrice(
                      estimate.price?.retail ?? estimate.retail,
                      estimate.currency,
                    )}
                  </p>
                  <p className="mt-2 text-sm font-black uppercase tracking-wide text-[#52677d]">
                    Estimated price each:{" "}
                    {formatPrice(
                      estimate.price?.each ??
                        estimate.averagePricePerShirt ??
                        estimate.each,
                      estimate.currency,
                    )}
                  </p>
                </div>

                <div className="grid gap-3">
                  <div className="rounded-md bg-white px-4 py-3 ring-1 ring-black/8">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#678197]">
                      Total quantity
                    </p>
                    <p className="mt-1 text-sm font-black uppercase tracking-wide text-[#07111f]">
                      {totalQuantity}
                    </p>
                  </div>
                  <div className="rounded-md bg-white px-4 py-3 ring-1 ring-black/8">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#678197]">
                      Garment summary
                    </p>
                    <p className="mt-1 text-sm font-bold leading-6 text-[#07111f]">
                      {getGarmentSummary(estimate, fallbackSummary)}
                    </p>
                  </div>
                </div>

                {estimate.warnings?.length ? (
                  <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold leading-6 text-amber-800">
                    {estimate.warnings.map((warning) => (
                      <p key={warning}>{warning}</p>
                    ))}
                  </div>
                ) : null}

                <p className="text-xs leading-5 text-[#52677d]">
                  Pricing shown is an estimate and may be adjusted after
                  artwork and production review.
                </p>
              </div>
            ) : (
              <div className="mt-5 rounded-md border border-dashed border-[#b5c6d6] bg-white/70 p-5 text-sm leading-7 text-[#52677d]">
                Your screen printing API estimate will appear here after the
                pricing app returns a response.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
