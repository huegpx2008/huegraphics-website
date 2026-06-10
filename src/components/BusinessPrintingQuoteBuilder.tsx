"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  addItemToFloatingQuoteBasket,
  type QuoteBasketItem,
} from "@/components/FloatingQuoteBasket";

type FieldOption = {
  label: string;
  value: string;
};

type QuoteField = {
  name: string;
  label: string;
  type: "number" | "select" | "checkbox";
  defaultValue: string | boolean;
  options?: FieldOption[];
};

type ProductConfig = {
  id: string;
  name: string;
  apiSlug: string;
  description: string;
  fields: QuoteField[];
};

type ApiEstimate = {
  ok?: boolean;
  currency?: string;
  price?: {
    retail?: number | string;
    each?: number | string;
  };
  summary?: Record<string, unknown>;
  warnings?: string[];
  error?: {
    message?: string;
    fields?: Record<string, string>;
  };
};

const quantityOptions = ["100", "250", "500", "1000", "2500", "5000", "10000"];

const products: ProductConfig[] = [
  {
    id: "business-card",
    name: "Business Cards",
    apiSlug: "business-card",
    description: "Standard business cards with coating, sided, and orientation options.",
    fields: [
      { name: "quantity", label: "Quantity", type: "select", defaultValue: "250", options: quantityOptions.map((value) => ({ label: value, value })) },
      { name: "sides", label: "Print Sides", type: "select", defaultValue: "single", options: [{ label: "Single-Sided", value: "single" }, { label: "Double-Sided", value: "double" }] },
      { name: "coating", label: "Coating", type: "select", defaultValue: "Gloss Laminate", options: [{ label: "Gloss Laminate", value: "Gloss Laminate" }, { label: "Matte Laminate", value: "Matte Laminate" }, { label: "No Coating", value: "No Coating" }] },
      { name: "orientation", label: "Orientation", type: "select", defaultValue: "Landscape", options: [{ label: "Landscape", value: "Landscape" }, { label: "Portrait", value: "Portrait" }] },
      { name: "rush", label: "Rush", type: "checkbox", defaultValue: false },
    ],
  },
  {
    id: "handheld-paper",
    name: "Handheld 16pt Paper",
    apiSlug: "handheld-paper",
    description: "Small handout pieces, cards, inserts, and promo print pieces.",
    fields: [
      { name: "quantity", label: "Quantity", type: "select", defaultValue: "250", options: quantityOptions.map((value) => ({ label: value, value })) },
      { name: "size", label: "Size", type: "select", defaultValue: "3.5x2.5", options: [{ label: "3.5 x 2.5", value: "3.5x2.5" }, { label: "4 x 6", value: "4x6" }, { label: "5 x 7", value: "5x7" }, { label: "8.5 x 11", value: "8.5x11" }] },
      { name: "sides", label: "Print Sides", type: "select", defaultValue: "single", options: [{ label: "Single-Sided", value: "single" }, { label: "Double-Sided", value: "double" }] },
      { name: "coating", label: "Coating", type: "select", defaultValue: "Gloss Laminate", options: [{ label: "Gloss Laminate", value: "Gloss Laminate" }, { label: "Matte Laminate", value: "Matte Laminate" }, { label: "No Coating", value: "No Coating" }] },
      { name: "orientation", label: "Orientation", type: "select", defaultValue: "Landscape", options: [{ label: "Landscape", value: "Landscape" }, { label: "Portrait", value: "Portrait" }] },
      { name: "rush", label: "Rush", type: "checkbox", defaultValue: false },
    ],
  },
  {
    id: "carbonless",
    name: "Carbonless Forms",
    apiSlug: "carbonless",
    description: "NCR forms for invoices, work orders, receipts, and field paperwork.",
    fields: [
      { name: "quantity", label: "Quantity", type: "select", defaultValue: "250", options: quantityOptions.map((value) => ({ label: value, value })) },
      { name: "formType", label: "Form Type", type: "select", defaultValue: "2 Part", options: [{ label: "2 Part", value: "2 Part" }, { label: "3 Part", value: "3 Part" }, { label: "4 Part", value: "4 Part" }] },
      { name: "size", label: "Size", type: "select", defaultValue: "8.5\" x 11\"", options: [{ label: "8.5 x 11", value: "8.5\" x 11\"" }, { label: "5.5 x 8.5", value: "5.5\" x 8.5\"" }, { label: "8.5 x 14", value: "8.5\" x 14\"" }] },
      { name: "printType", label: "Print Type", type: "select", defaultValue: "Black Ink", options: [{ label: "Black Ink", value: "Black Ink" }, { label: "Full Color", value: "Full Color" }] },
      { name: "printSides", label: "Print Sides", type: "select", defaultValue: "Front Only", options: [{ label: "Front Only", value: "Front Only" }, { label: "Front and Back", value: "Front and Back" }] },
      { name: "numbering", label: "Sequential Numbering", type: "checkbox", defaultValue: false },
      { name: "wraparound", label: "Wraparound Cover", type: "checkbox", defaultValue: false },
      { name: "bookedSets", label: "Booked Sets", type: "checkbox", defaultValue: false },
      { name: "rush", label: "Rush", type: "checkbox", defaultValue: false },
    ],
  },
  {
    id: "door-hanger",
    name: "Door Hangers",
    apiSlug: "door-hanger",
    description: "Door hangers for neighborhoods, events, service businesses, and promos.",
    fields: [
      { name: "quantity", label: "Quantity", type: "select", defaultValue: "250", options: quantityOptions.map((value) => ({ label: value, value })) },
      { name: "size", label: "Size", type: "select", defaultValue: "4 x 11", options: [{ label: "3.5 x 8.5", value: "3.5 x 8.5" }, { label: "4 x 11", value: "4 x 11" }, { label: "5.25 x 8.5", value: "5.25 x 8.5" }, { label: "8.5 x 11", value: "8.5 x 11" }] },
      { name: "type", label: "Type / Color", type: "select", defaultValue: "14pt Gloss Front - Uncoated Back", options: ["White 80lb Cover Uncoated", "White 80lb Cover Gloss", "14pt Gloss Front - Uncoated Back", "14pt Gloss Front and Back", "14pt Uncoated Front and Back", "14pt Matte Front - Uncoated Back", "14pt Matte Front and Back", "16pt Matte Front - Uncoated Back", "16pt Matte Front and Back", "16pt Uncoated Front and Back", "16pt Gloss Front and Back", "16pt Gloss Front - Uncoated Back", "18pt Gloss Front - Uncoated Back", "18pt Matte Front - Uncoated Back"].map((value) => ({ label: value, value })) },
      { name: "ink", label: "Ink", type: "select", defaultValue: "Full Color", options: [{ label: "Full Color", value: "Full Color" }, { label: "Standard Black", value: "Standard Black" }] },
      { name: "backPrinting", label: "Back Printing", type: "select", defaultValue: "No", options: [{ label: "No", value: "No" }, { label: "Standard Black", value: "Standard Black" }, { label: "Full Color", value: "Full Color" }] },
      { name: "perforation", label: "Perforation", type: "select", defaultValue: "No", options: ["No", "Yes (1 Perforation)", "Yes (2 Perforations)", "Yes (3 Perforations)", "Yes (4 Perforations)"].map((value) => ({ label: value, value })) },
      { name: "shrinkWrap", label: "Shrink Wrap", type: "select", defaultValue: "Shrink Wrap 250", options: ["Shrink Wrap 250", "Shrink Wrap 25s", "Shrink Wrap 50s", "Shrink Wrap 100s"].map((value) => ({ label: value, value })) },
    ],
  },
];

function getDefaultValues(product: ProductConfig) {
  return Object.fromEntries(
    product.fields.map((field) => [field.name, field.defaultValue]),
  ) as Record<string, string | boolean>;
}

function formatPrice(value: number | string | undefined, currency = "USD") {
  if (typeof value === "number") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(value);
  }

  return value || "Returned after review";
}

function getErrorMessage(data: ApiEstimate, fallback: string) {
  const fieldMessages = data.error?.fields
    ? Object.entries(data.error.fields).map(([field, message]) => `${field}: ${message}`)
    : [];

  return [data.error?.message || fallback, ...fieldMessages].join(" ");
}

function toPayload(product: ProductConfig, values: Record<string, string | boolean>) {
  return Object.fromEntries(
    product.fields.map((field) => {
      const value = values[field.name];
      return [
        field.name,
        field.name === "quantity" ? Number(value) : value,
      ];
    }),
  );
}

function getConfigurationText(product: ProductConfig, values: Record<string, string | boolean>) {
  return product.fields
    .map((field) => {
      const value = values[field.name];
      if (field.type === "checkbox") {
        return value ? field.label : "";
      }
      const label = field.options?.find((option) => option.value === value)?.label ?? value;
      return `${field.label}: ${label}`;
    })
    .filter(Boolean)
    .join(", ");
}

function getSummaryText(productName: string, estimate: ApiEstimate) {
  const summary = estimate.summary ?? {};
  const quantity = summary.quantity ? `Qty ${summary.quantity}` : "";
  const size = typeof summary.size === "string" ? summary.size : "";
  const details = [summary.sides, summary.coating, summary.formType, summary.printType]
    .filter((item) => typeof item === "string")
    .join(", ");

  return [productName, size, quantity, details].filter(Boolean).join(" - ");
}

export function BusinessPrintingQuoteBuilder() {
  const [activeProductId, setActiveProductId] = useState(products[0].id);
  const activeProduct = useMemo(
    () => products.find((product) => product.id === activeProductId) ?? products[0],
    [activeProductId],
  );
  const [values, setValues] = useState<Record<string, string | boolean>>(
    getDefaultValues(activeProduct),
  );
  const [estimate, setEstimate] = useState<ApiEstimate | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setValues(getDefaultValues(activeProduct));
    setEstimate(null);
    setError("");
    setMessage("");
  }, [activeProduct]);

  function updateValue(field: QuoteField, value: string | boolean) {
    setMessage("");
    setValues((current) => ({
      ...current,
      [field.name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setEstimate(null);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/pricing/${activeProduct.apiSlug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(toPayload(activeProduct, values)),
      });
      const data = (await response.json()) as ApiEstimate;

      if (!response.ok || data.ok === false) {
        setError(getErrorMessage(data, "The estimate could not be returned."));
        return;
      }

      setEstimate(data);
    } catch {
      setError("The estimate could not be loaded right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function addEstimateToQuote() {
    if (!estimate) {
      return;
    }

    const quantity = Number(values.quantity) || 1;
    const item: QuoteBasketItem = {
      id: `business-print-${activeProduct.id}-${Date.now()}`,
      productName: activeProduct.name,
      style: activeProduct.name,
      brand: "Hue Graphics",
      color: "Business print",
      sizes: { Each: quantity },
      quantity,
      service: "Business Printing",
      frontColors: "Full color",
      backColors: "0",
      decorationSummary: [
        getSummaryText(activeProduct.name, estimate),
        `Configuration: ${getConfigurationText(activeProduct, values)}`,
      ].join(" | "),
      estimatedEach: estimate.price?.each,
      estimatedTotal: estimate.price?.retail,
      currency: estimate.currency ?? "USD",
    };

    addItemToFloatingQuoteBasket(item);
    setMessage(`${activeProduct.name} estimate was added to the quote basket.`);
  }

  return (
    <section className="px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-sm bg-[#07111f] shadow-[0_24px_70px_rgba(7,17,31,0.16)] ring-1 ring-black/10">
        <div className="bg-[#07111f] p-5 sm:p-7">
          <div className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <div>
              <p className="eyebrow text-accent">Business print estimator</p>
              <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-3xl font-black uppercase leading-[0.94] text-white sm:text-5xl">
                Get a starting price for common paper products.
              </h2>
              <p className="mt-5 text-sm leading-7 text-[#d6e3f0]">
                Choose a print product, set the common options, and add the estimate
                to the same quote basket as apparel and signs.
              </p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8eb8dc]">
                Available products
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {products.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => setActiveProductId(product.id)}
                    className={`rounded-md border px-3 py-2 text-left text-xs font-black uppercase tracking-wide transition sm:text-[0.8rem] ${
                      product.id === activeProduct.id
                        ? "border-accent bg-accent text-white shadow-[0_12px_26px_rgba(31,115,190,0.32)]"
                        : "border-white/14 bg-white/[0.04] text-[#d6e3f0] hover:border-accent hover:bg-white/[0.08]"
                    }`}
                  >
                    {product.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-px bg-white/10 xl:grid-cols-[1fr_0.9fr]">
          <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-7">
            <p className="eyebrow">Estimator</p>
            <h3 className="mt-2 text-2xl font-black uppercase tracking-tight text-[#07111f]">
              {activeProduct.name}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#52677d]">
              {activeProduct.description}
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {activeProduct.fields.map((field) => {
                if (field.type === "checkbox") {
                  return (
                    <label
                      key={field.name}
                      className="flex min-h-12 cursor-pointer items-center justify-between rounded-md border border-[#c9d7e6] bg-[#f4f8fc] px-4 py-3 text-sm font-black uppercase tracking-wide text-[#07111f] transition hover:border-accent"
                    >
                      <span>{field.label}</span>
                      <input
                        type="checkbox"
                        checked={Boolean(values[field.name])}
                        onChange={(event) => updateValue(field, event.target.checked)}
                        className="h-5 w-5 accent-[#1f73be]"
                      />
                    </label>
                  );
                }

                if (field.type === "select") {
                  return (
                    <label
                      key={field.name}
                      className="text-xs font-black uppercase tracking-[0.16em] text-[#314154]"
                    >
                      {field.label}
                      <select
                        value={String(values[field.name])}
                        onChange={(event) => updateValue(field, event.target.value)}
                        className="mt-2 h-12 w-full rounded-md border border-[#c9d7e6] bg-[#f4f8fc] px-3 text-sm font-black text-[#07111f] outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                      >
                        {field.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  );
                }

                return (
                  <label
                    key={field.name}
                    className="text-xs font-black uppercase tracking-[0.16em] text-[#314154]"
                  >
                    {field.label}
                    <input
                      type="number"
                      min="1"
                      value={String(values[field.name])}
                      onChange={(event) => updateValue(field, event.target.value)}
                      className="mt-2 h-12 w-full rounded-md border border-[#c9d7e6] bg-[#f4f8fc] px-3 text-base font-black text-[#07111f] outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                      required
                    />
                  </label>
                );
              })}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-accent px-6 text-sm font-black uppercase tracking-wide text-white shadow-[0_18px_36px_rgba(31,115,190,0.28)] transition hover:bg-[#2a86d8] disabled:cursor-wait disabled:opacity-70"
            >
              {isLoading ? "Getting estimate..." : "Get Estimate"}
            </button>

            {error ? (
              <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-red-700">
                {error}
              </div>
            ) : null}

            {message ? (
              <div className="mt-4 rounded-md border border-accent/25 bg-[#eef6ff] px-4 py-3 text-sm font-bold leading-6 text-[#174a78]">
                {message}
              </div>
            ) : null}
          </form>

          <div className="bg-[#eef4fa] p-4 sm:p-7">
            <p className="eyebrow">Estimate</p>
            {estimate ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-md bg-white p-5 shadow-[0_12px_32px_rgba(7,17,31,0.08)] ring-1 ring-black/8">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#678197]">
                    Estimated price
                  </p>
                  <p className="mt-2 text-3xl font-black text-[#07111f] sm:text-4xl">
                    {formatPrice(estimate.price?.retail, estimate.currency)}
                  </p>
                  <p className="mt-2 text-sm font-black uppercase tracking-wide text-[#52677d]">
                    Each: {formatPrice(estimate.price?.each, estimate.currency)}
                  </p>
                </div>

                <div className="rounded-md bg-white px-4 py-3 text-sm font-bold leading-6 text-[#314154] ring-1 ring-black/8">
                  {getSummaryText(activeProduct.name, estimate)}
                </div>

                {estimate.warnings?.length ? (
                  <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold leading-6 text-amber-800">
                    {estimate.warnings.map((warning) => (
                      <p key={warning}>{warning}</p>
                    ))}
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={addEstimateToQuote}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-[#07111f] px-6 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#13243a]"
                >
                  Add To Quote Basket
                </button>
              </div>
            ) : (
              <div className="mt-5 rounded-md border border-dashed border-[#b5c6d6] bg-white/70 p-5 text-sm leading-7 text-[#52677d]">
                Select a product and request an estimate. Your starting price will
                appear here, then you can add it to the quote basket for review.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
