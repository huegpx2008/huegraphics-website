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
  step?: string;
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
  product?: string;
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

const products: ProductConfig[] = [
  {
    id: "banner",
    name: "Vinyl Banner",
    apiSlug: "banner",
    description: "Indoor and outdoor banners with finishing options.",
    fields: [
      { name: "width", label: "Width (inches)", type: "number", defaultValue: "36", step: "0.25" },
      { name: "height", label: "Height (inches)", type: "number", defaultValue: "24", step: "0.25" },
      { name: "quantity", label: "Quantity", type: "number", defaultValue: "1", step: "1" },
      {
        name: "material",
        label: "Material",
        type: "select",
        defaultValue: "13-single",
        options: [
          { label: "13oz Single-Sided", value: "13-single" },
          { label: "13oz Double-Sided", value: "13-double" },
          { label: "15oz Single-Sided", value: "15-single" },
          { label: "18oz Single-Sided", value: "18-single" },
          { label: "18oz Double-Sided", value: "18-double" },
        ],
      },
      { name: "polePocket", label: "Pole Pocket", type: "checkbox", defaultValue: false },
      { name: "rope", label: "Rope", type: "checkbox", defaultValue: false },
      { name: "windSlits", label: "Wind Slits", type: "checkbox", defaultValue: false },
      { name: "rush", label: "Rush", type: "checkbox", defaultValue: false },
    ],
  },
  {
    id: "yard-sign",
    name: "Yard Sign",
    apiSlug: "yard-sign",
    description: "18 x 24 coroplast yard signs with stake options.",
    fields: [
      { name: "quantity", label: "Quantity", type: "number", defaultValue: "10", step: "1" },
      {
        name: "sides",
        label: "Print Sides",
        type: "select",
        defaultValue: "single",
        options: [
          { label: "Single-Sided", value: "single" },
          { label: "Double-Sided", value: "double" },
        ],
      },
      {
        name: "stakeType",
        label: "Stakes",
        type: "select",
        defaultValue: "standard",
        options: [
          { label: "No Stakes", value: "none" },
          { label: "Standard Stakes", value: "standard" },
          { label: "Heavy-Duty Stakes", value: "heavy-duty" },
        ],
      },
    ],
  },
  {
    id: "acm",
    name: "ACM / Maxmetal",
    apiSlug: "acm",
    description: "Rigid aluminum composite signs for outdoor and storefront use.",
    fields: [
      { name: "width", label: "Width (inches)", type: "number", defaultValue: "24", step: "0.25" },
      { name: "height", label: "Height (inches)", type: "number", defaultValue: "18", step: "0.25" },
      { name: "quantity", label: "Quantity", type: "number", defaultValue: "1", step: "1" },
      {
        name: "thickness",
        label: "Thickness",
        type: "select",
        defaultValue: "3mm",
        options: [
          { label: "3mm", value: "3mm" },
          { label: "6mm", value: "6mm" },
        ],
      },
      {
        name: "sides",
        label: "Print Sides",
        type: "select",
        defaultValue: "single",
        options: [
          { label: "Single-Sided", value: "single" },
          { label: "Double-Sided", value: "double" },
        ],
      },
      { name: "contourCut", label: "Contour Cut", type: "checkbox", defaultValue: false },
      { name: "glossLaminate", label: "Gloss Laminate", type: "checkbox", defaultValue: false },
      { name: "rush", label: "Rush", type: "checkbox", defaultValue: false },
    ],
  },
  {
    id: "vinyl",
    name: "Printed Vinyl",
    apiSlug: "vinyl",
    description: "Printed decals and vinyl graphics for walls, windows, and vehicles.",
    fields: [
      { name: "width", label: "Width (inches)", type: "number", defaultValue: "24", step: "0.25" },
      { name: "height", label: "Height (inches)", type: "number", defaultValue: "18", step: "0.25" },
      { name: "quantity", label: "Quantity", type: "number", defaultValue: "1", step: "1" },
      {
        name: "material",
        label: "Material",
        type: "select",
        defaultValue: "standard",
        options: [
          { label: "Standard Vinyl", value: "standard" },
          { label: "Reflective Vinyl", value: "reflective" },
          { label: "Low-Tack Wall Vinyl", value: "low-tack-wall" },
          { label: "Premium Vehicle Vinyl", value: "premium-vehicle" },
        ],
      },
      {
        name: "laminate",
        label: "Laminate",
        type: "select",
        defaultValue: "gloss",
        options: [
          { label: "Gloss Laminate", value: "gloss" },
          { label: "Matte Laminate", value: "matte" },
          { label: "No Laminate", value: "none" },
        ],
      },
      { name: "contourCut", label: "Contour Cut", type: "checkbox", defaultValue: false },
      { name: "gangLayout", label: "Gang Layout", type: "checkbox", defaultValue: false },
      { name: "rush", label: "Rush", type: "checkbox", defaultValue: false },
    ],
  },
  {
    id: "custom-cut-coroplast",
    name: "Custom Cut Coroplast",
    apiSlug: "custom-cut-coroplast",
    description: "Custom-size coroplast signs beyond standard yard sign presets.",
    fields: [
      { name: "width", label: "Width (inches)", type: "number", defaultValue: "24", step: "0.25" },
      { name: "height", label: "Height (inches)", type: "number", defaultValue: "18", step: "0.25" },
      { name: "quantity", label: "Quantity", type: "number", defaultValue: "1", step: "1" },
      {
        name: "thickness",
        label: "Thickness",
        type: "select",
        defaultValue: "4mm",
        options: [
          { label: "4mm", value: "4mm" },
          { label: "10mm", value: "10mm" },
        ],
      },
      {
        name: "sides",
        label: "Print Sides",
        type: "select",
        defaultValue: "single",
        options: [
          { label: "Single-Sided", value: "single" },
          { label: "Double-Sided", value: "double" },
        ],
      },
      { name: "contourCut", label: "Contour Cut", type: "checkbox", defaultValue: false },
      { name: "grommets", label: "Grommets", type: "checkbox", defaultValue: false },
      { name: "glossLaminate", label: "Gloss Laminate", type: "checkbox", defaultValue: false },
      { name: "rush", label: "Rush", type: "checkbox", defaultValue: false },
    ],
  },
  {
    id: "vehicle-magnet",
    name: "Vehicle Magnet",
    apiSlug: "vehicle-magnet",
    description: "Magnetic vehicle signs with rectangle, rounded, or contour-cut options.",
    fields: [
      { name: "width", label: "Width (inches)", type: "number", defaultValue: "24", step: "0.25" },
      { name: "height", label: "Height (inches)", type: "number", defaultValue: "18", step: "0.25" },
      { name: "quantity", label: "Quantity", type: "number", defaultValue: "2", step: "1" },
      { name: "roundedCorners", label: "Rounded Corners", type: "checkbox", defaultValue: false },
      { name: "contourCut", label: "Contour Cut", type: "checkbox", defaultValue: false },
      { name: "rush", label: "Rush", type: "checkbox", defaultValue: false },
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

  return value || "Returned by API";
}

function getErrorMessage(data: ApiEstimate, fallback: string) {
  const fieldMessages = data.error?.fields
    ? Object.entries(data.error.fields).map(([field, message]) => `${field}: ${message}`)
    : [];

  return [data.error?.message || fallback, ...fieldMessages].join(" ");
}

function getSummaryText(productName: string, estimate: ApiEstimate) {
  const summary = estimate.summary ?? {};
  const size =
    typeof summary.size === "string"
      ? summary.size
      : summary.width && summary.height
        ? `${summary.width} x ${summary.height} in.`
        : "";
  const quantity = summary.quantity ? `Qty ${summary.quantity}` : "";
  const material =
    summary.materialName ||
    summary.thickness ||
    summary.sides ||
    summary.style ||
    "";
  const options =
    summary.options && typeof summary.options === "object"
      ? Object.entries(summary.options as Record<string, unknown>)
          .filter(([, value]) => Boolean(value))
          .map(([key]) => key.replace(/([A-Z])/g, " $1").trim())
          .join(", ")
      : "";

  return [productName, size, quantity, material, options && `Options: ${options}`]
    .filter(Boolean)
    .join(" - ");
}

function getQuantity(values: Record<string, string | boolean>) {
  const quantity = Number(values.quantity);
  return Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
}

function getSelectedOptionLabel(
  field: QuoteField,
  value: string | boolean,
) {
  if (typeof value === "boolean") {
    return value ? field.label : "";
  }

  return (
    field.options?.find((option) => option.value === value)?.label || value
  );
}

function getConfigurationText(
  product: ProductConfig,
  values: Record<string, string | boolean>,
) {
  return product.fields
    .map((field) => {
      const value = values[field.name];

      if (field.type === "checkbox") {
        return value ? field.label : "";
      }

      return `${field.label}: ${getSelectedOptionLabel(field, value)}`;
    })
    .filter(Boolean)
    .join(", ");
}

function toPayload(product: ProductConfig, values: Record<string, string | boolean>) {
  return Object.fromEntries(
    product.fields.map((field) => {
      const value = values[field.name];
      return [
        field.name,
        field.type === "number" ? Number(value) : value,
      ];
    }),
  );
}

export function SignQuoteBuilder() {
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setValues(getDefaultValues(activeProduct));
    setEstimate(null);
    setError("");
  }, [activeProduct]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setEstimate(null);

    const payload = toPayload(activeProduct, values);

    const missingNumber = activeProduct.fields.some(
      (field) =>
        field.type === "number" &&
        (!payload[field.name] || Number.isNaN(payload[field.name])),
    );

    if (missingNumber) {
      setError("Please enter valid numbers before requesting an estimate.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/pricing/${activeProduct.apiSlug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as ApiEstimate;

      if (!response.ok || data.ok === false) {
        setError(
          getErrorMessage(data, "The pricing API could not return an estimate."),
        );
        return;
      }

      setEstimate(data);
    } catch {
      setError("The estimate could not be loaded right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function updateValue(field: QuoteField, value: string | boolean) {
    setValues((currentValues) => ({
      ...currentValues,
      [field.name]: value,
    }));
  }

  function addEstimateToQuote() {
    if (!estimate) {
      return;
    }

    const quantity = getQuantity(values);
    const configuration = getConfigurationText(activeProduct, values);
    const item: QuoteBasketItem = {
      id: `sign-${activeProduct.id}-${Date.now()}`,
      productName: activeProduct.name,
      style: activeProduct.name,
      brand: "Hue Graphics",
      color: "Full color sign print",
      sizes: { Each: quantity },
      quantity,
      service: "Signs & Banners",
      frontColors: "Full color",
      backColors: "0",
      decorationSummary: [
        getSummaryText(activeProduct.name, estimate),
        configuration && `Configuration: ${configuration}`,
      ]
        .filter(Boolean)
        .join(" | "),
      estimatedEach: estimate.price?.each,
      estimatedTotal: estimate.price?.retail,
      currency: estimate.currency ?? "USD",
    };

    addItemToFloatingQuoteBasket(item);
  }

  return (
    <section className="px-4 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-sm bg-[#07111f] shadow-[0_24px_70px_rgba(7,17,31,0.16)] ring-1 ring-black/10">
        <div className="grid gap-px bg-white/10 lg:grid-cols-[0.68fr_1.32fr]">
          <div className="bg-[#07111f] p-6 sm:p-8">
            <p className="eyebrow text-accent">Signs & banners quote builder</p>
            <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-3xl font-black uppercase leading-[0.94] text-white sm:text-5xl">
              Estimate sign projects from live pricing APIs.
            </h2>
            <p className="mt-6 text-sm leading-7 text-[#d6e3f0]">
              Choose a product, enter the details, and the website will request
              pricing from the matching quote app API.
            </p>
            <div className="mt-8 grid gap-3">
              {products.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => setActiveProductId(product.id)}
                  className={`min-h-20 rounded-md border p-4 text-left transition ${
                    product.id === activeProduct.id
                      ? "border-accent bg-accent text-white shadow-[0_16px_32px_rgba(31,115,190,0.28)]"
                      : "border-white/10 bg-white/[0.04] text-[#d6e3f0] hover:border-accent"
                  }`}
                >
                  <span className="block text-sm font-black uppercase tracking-wide">
                    {product.name}
                  </span>
                  <span className="mt-1 block text-xs leading-5 opacity-85">
                    {product.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-px bg-white/10 xl:grid-cols-[1fr_0.9fr]">
            <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-7">
              <p className="eyebrow">Estimator</p>
              <h3 className="mt-2 text-2xl font-black uppercase tracking-tight text-[#07111f]">
                {activeProduct.name}
              </h3>

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
                          onChange={(event) =>
                            updateValue(field, event.target.checked)
                          }
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
                          onChange={(event) =>
                            updateValue(field, event.target.value)
                          }
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
                        step={field.step ?? "1"}
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

                  <p className="text-xs leading-5 text-[#52677d]">
                    Pricing shown is an estimate and may be adjusted after
                    artwork and production review.
                  </p>

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
                  Select a product and request an estimate. Results from the
                  pricing API will appear here.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 bg-[#07111f] p-5 sm:p-7">
          <p className="eyebrow text-accent">Shared quote basket</p>
          <p className="mt-3 max-w-3xl text-sm font-bold leading-7 text-[#d6e3f0]">
            Add a sign estimate and it will open in the sitewide quote basket
            with your apparel, embroidery, and other project items.
          </p>
        </div>
      </div>
    </section>
  );
}
