"use client";

import { FormEvent, useMemo, useState } from "react";

const materialOptions = [
  { label: "13oz Single-Sided", value: "13-single" },
  { label: "13oz Double-Sided", value: "13-double" },
  { label: "15oz Single-Sided", value: "15-single" },
  { label: "18oz Single-Sided", value: "18-single" },
  { label: "18oz Double-Sided", value: "18-double" },
];

const addOns = [
  { key: "polePocket", label: "Pole Pocket" },
  { key: "rope", label: "Rope" },
  { key: "windSlits", label: "Wind Slits" },
  { key: "rush", label: "Rush" },
] as const;

type AddOnKey = (typeof addOns)[number]["key"];

type BannerEstimateResponse = {
  ok?: boolean;
  currency?: string;
  price?: {
    retail?: number | string;
    each?: number | string;
  };
  summary?: {
    width?: number | string;
    height?: number | string;
    material?: string;
    materialName?: string;
    quantity?: number | string;
    options?: Partial<Record<AddOnKey, boolean>>;
  };
  warnings?: string[];
  error?: {
    message?: string;
    fields?: Record<string, string>;
  };
};

type QuoteCartItem = {
  id: string;
  estimate: BannerEstimateResponse;
  fallback: {
    width: string;
    height: string;
    quantity: string;
    materialLabel: string;
    addOns: Record<AddOnKey, boolean>;
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

function getErrorMessage(data: BannerEstimateResponse, fallback: string) {
  const fieldMessages = data.error?.fields
    ? Object.entries(data.error.fields).map(([field, message]) => `${field}: ${message}`)
    : [];

  return [data.error?.message || fallback, ...fieldMessages].join(" ");
}

export function BannerEstimator() {
  const [width, setWidth] = useState("36");
  const [height, setHeight] = useState("24");
  const [quantity, setQuantity] = useState("1");
  const [material, setMaterial] = useState(materialOptions[0].value);
  const [selectedAddOns, setSelectedAddOns] = useState<Record<AddOnKey, boolean>>({
    polePocket: false,
    rope: false,
    windSlits: false,
    rush: false,
  });
  const [estimate, setEstimate] = useState<BannerEstimateResponse | null>(null);
  const [quoteItems, setQuoteItems] = useState<QuoteCartItem[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const selectedMaterialLabel = useMemo(
    () =>
      materialOptions.find((materialOption) => materialOption.value === material)
        ?.label ?? material,
    [material],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setEstimate(null);

    const payload = {
      width: Number(width),
      height: Number(height),
      quantity: Number(quantity),
      material,
      polePocket: selectedAddOns.polePocket,
      rope: selectedAddOns.rope,
      windSlits: selectedAddOns.windSlits,
      rush: selectedAddOns.rush,
    };

    if (!payload.width || !payload.height || !payload.quantity) {
      setError("Please enter a valid width, height, and quantity.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/pricing/banner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as BannerEstimateResponse;

      if (!response.ok || data.ok === false) {
        setError(
          getErrorMessage(
            data,
            "The banner pricing API could not return an estimate.",
          ),
        );
        return;
      }

      setEstimate(data);
    } catch {
      setError(
        "The estimate could not be loaded right now. Please try again or request a quote.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function toggleAddOn(key: AddOnKey) {
    setSelectedAddOns((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  function addEstimateToQuote() {
    if (!estimate) {
      return;
    }

    setQuoteItems((currentItems) => [
      ...currentItems,
      {
        id: `${Date.now()}-${currentItems.length}`,
        estimate,
        fallback: {
          width,
          height,
          quantity,
          materialLabel: selectedMaterialLabel,
          addOns: selectedAddOns,
        },
      },
    ]);
  }

  function removeQuoteItem(id: string) {
    setQuoteItems((currentItems) =>
      currentItems.filter((quoteItem) => quoteItem.id !== id),
    );
  }

  const estimateMaterial =
    estimate?.summary?.materialName ||
    materialOptions.find(
      (materialOption) => materialOption.value === estimate?.summary?.material,
    )?.label ||
    selectedMaterialLabel;
  const estimateQuantity = estimate?.summary?.quantity ?? quantity;

  return (
    <section className="px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-sm bg-[#07111f] shadow-[0_24px_70px_rgba(7,17,31,0.16)] ring-1 ring-black/10 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="relative overflow-hidden border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r">
          <div className="absolute inset-x-0 top-0 h-1 bg-accent" />
          <p className="eyebrow text-accent">API proof of concept</p>
          <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.94] text-white sm:text-5xl">
            Instant banner estimate.
          </h2>
          <p className="mt-6 text-sm leading-7 text-[#d6e3f0]">
            Enter your banner size, quantity, material, and finishing options.
            The website sends the details to the Hue quote app API and displays
            the estimate it returns.
          </p>
          <div className="mt-8 rounded-md border border-white/10 bg-white/5 p-4 text-xs font-bold uppercase tracking-[0.16em] text-[#9fb4c8]">
            No pricing is calculated on this website.
          </div>
        </div>

        <div className="grid gap-px bg-white/10 md:grid-cols-[1.05fr_0.95fr]">
          <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-7">
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="text-xs font-black uppercase tracking-[0.16em] text-[#314154]">
                Width
                <input
                  type="number"
                  min="1"
                  step="0.25"
                  value={width}
                  onChange={(event) => setWidth(event.target.value)}
                  className="mt-2 h-12 w-full rounded-md border border-[#c9d7e6] bg-[#f4f8fc] px-3 text-base font-black text-[#07111f] outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                  required
                />
              </label>
              <label className="text-xs font-black uppercase tracking-[0.16em] text-[#314154]">
                Height
                <input
                  type="number"
                  min="1"
                  step="0.25"
                  value={height}
                  onChange={(event) => setHeight(event.target.value)}
                  className="mt-2 h-12 w-full rounded-md border border-[#c9d7e6] bg-[#f4f8fc] px-3 text-base font-black text-[#07111f] outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                  required
                />
              </label>
              <label className="text-xs font-black uppercase tracking-[0.16em] text-[#314154]">
                Quantity
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  className="mt-2 h-12 w-full rounded-md border border-[#c9d7e6] bg-[#f4f8fc] px-3 text-base font-black text-[#07111f] outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                  required
                />
              </label>
            </div>

            <label className="mt-5 block text-xs font-black uppercase tracking-[0.16em] text-[#314154]">
              Material
              <select
                value={material}
                onChange={(event) => setMaterial(event.target.value)}
                className="mt-2 h-12 w-full rounded-md border border-[#c9d7e6] bg-[#f4f8fc] px-3 text-sm font-black text-[#07111f] outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
              >
                {materialOptions.map((materialOption) => (
                  <option key={materialOption.value} value={materialOption.value}>
                    {materialOption.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {addOns.map((addOn) => (
                <label
                  key={addOn.key}
                  className="flex cursor-pointer items-center justify-between rounded-md border border-[#c9d7e6] bg-[#f4f8fc] px-4 py-3 text-sm font-black uppercase tracking-wide text-[#07111f] transition hover:border-accent"
                >
                  <span>{addOn.label}</span>
                  <input
                    type="checkbox"
                    checked={selectedAddOns[addOn.key]}
                    onChange={() => toggleAddOn(addOn.key)}
                    className="h-5 w-5 accent-[#1f73be]"
                  />
                </label>
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-accent px-6 py-4 text-sm font-black uppercase tracking-wide text-white shadow-[0_18px_36px_rgba(31,115,190,0.28)] transition hover:bg-[#2a86d8] disabled:cursor-wait disabled:opacity-70"
            >
              {isLoading ? "Getting estimate..." : "Get Instant Estimate"}
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
                    Estimated total price
                  </p>
                  <p className="mt-2 text-4xl font-black text-[#07111f]">
                    {formatPrice(estimate.price?.retail, estimate.currency)}
                  </p>
                </div>
                <div className="grid gap-3">
                  <div className="rounded-md bg-white px-4 py-3 ring-1 ring-black/8">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#678197]">
                      Estimated price each
                    </p>
                    <p className="mt-1 text-xl font-black text-[#07111f]">
                      {formatPrice(estimate.price?.each, estimate.currency)}
                    </p>
                  </div>
                  <div className="rounded-md bg-white px-4 py-3 ring-1 ring-black/8">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#678197]">
                      Material selected
                    </p>
                    <p className="mt-1 text-sm font-black uppercase tracking-wide text-[#07111f]">
                      {estimateMaterial}
                    </p>
                  </div>
                  <div className="rounded-md bg-white px-4 py-3 ring-1 ring-black/8">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#678197]">
                      Quantity
                    </p>
                    <p className="mt-1 text-sm font-black uppercase tracking-wide text-[#07111f]">
                      {estimateQuantity}
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
                  Pricing shown is an estimate and may be adjusted based on
                  artwork, production requirements, shipping, or special
                  requests.
                </p>

                <button
                  type="button"
                  onClick={addEstimateToQuote}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-[#07111f] px-6 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#13243a]"
                >
                  Add to Quote
                </button>
              </div>
            ) : (
              <div className="mt-5 rounded-md border border-dashed border-[#b5c6d6] bg-white/70 p-5 text-sm leading-7 text-[#52677d]">
                Your API estimate will appear here after the pricing app
                returns a response.
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 bg-[#07111f] p-5 sm:p-7 lg:col-span-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-accent">Quote cart proof of concept</p>
              <h3 className="mt-2 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-3xl font-black uppercase leading-none text-white">
                Banner items added locally
              </h3>
            </div>
            <p className="text-sm font-bold text-[#9fb4c8]">
              {quoteItems.length} {quoteItems.length === 1 ? "item" : "items"} in
              this demo quote
            </p>
          </div>

          {quoteItems.length ? (
            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              {quoteItems.map((quoteItem, index) => {
                const itemSummary = quoteItem.estimate.summary;
                const materialName =
                  itemSummary?.materialName ||
                  materialOptions.find(
                    (materialOption) =>
                      materialOption.value === itemSummary?.material,
                  )?.label ||
                  quoteItem.fallback.materialLabel;
                const itemOptions = itemSummary?.options ?? quoteItem.fallback.addOns;
                const activeOptions = addOns
                  .filter((addOn) => itemOptions[addOn.key])
                  .map((addOn) => addOn.label);

                return (
                  <div
                    key={quoteItem.id}
                    className="rounded-md border border-white/10 bg-white/[0.06] p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-accent">
                          Banner item {index + 1}
                        </p>
                        <p className="mt-2 text-lg font-black uppercase tracking-wide text-white">
                          {materialName}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeQuoteItem(quoteItem.id)}
                        className="rounded-md border border-white/15 px-3 py-2 text-xs font-black uppercase tracking-wide text-[#d6e3f0] transition hover:border-accent hover:text-white"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-4 grid gap-2 text-sm font-bold text-[#d6e3f0] sm:grid-cols-2">
                      <p>
                        Size: {itemSummary?.width ?? quoteItem.fallback.width}
                        &quot; x{" "}
                        {itemSummary?.height ?? quoteItem.fallback.height}
                        &quot;
                      </p>
                      <p>
                        Qty:{" "}
                        {itemSummary?.quantity ?? quoteItem.fallback.quantity}
                      </p>
                      <p>
                        Each:{" "}
                        {formatPrice(
                          quoteItem.estimate.price?.each,
                          quoteItem.estimate.currency,
                        )}
                      </p>
                      <p>
                        Total:{" "}
                        {formatPrice(
                          quoteItem.estimate.price?.retail,
                          quoteItem.estimate.currency,
                        )}
                      </p>
                    </div>
                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-[#9fb4c8]">
                      Options: {activeOptions.length ? activeOptions.join(", ") : "None"}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-5 rounded-md border border-dashed border-white/15 bg-white/[0.04] p-5 text-sm leading-7 text-[#9fb4c8]">
              Run an estimate, then use Add to Quote to place that API result in
              this local proof-of-concept cart.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
