"use client";

import { FormEvent, useEffect, useState } from "react";

export type QuoteBasketItem = {
  id: string;
  productName: string;
  style: string;
  brand: string;
  color: string;
  sizes: Record<string, number>;
  quantity: number;
  service?: string;
  frontColors: string;
  backColors: string;
  decorationSummary?: string;
  estimatedEach?: number | string;
  estimatedTotal?: number | string;
  currency?: string;
};

const storageKey = "hue-quote-basket";
const addItemEventName = "hue:add-quote-item";
const openBasketEventName = "hue:open-quote-basket";

function formatPrice(value: number | string | undefined, currency = "USD") {
  if (typeof value === "number") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(value);
  }

  return value || "Request pricing";
}

function numericPrice(value: number | string | undefined) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function formatBasketDetails(items: QuoteBasketItem[], notes: string) {
  const itemDetails = items
    .map((item, index) => {
      const sizes = Object.entries(item.sizes)
        .filter(([, quantity]) => Number(quantity) > 0)
        .map(([size, quantity]) => `${size}: ${quantity}`)
        .join(", ");
      const back =
        Number(item.backColors) > 0 ? `${item.backColors} back` : "front only";
      const decoration = item.decorationSummary
        ? `Decoration: ${item.decorationSummary}`
        : `Print colors: ${item.frontColors} front / ${back}`;
      const estimate =
        item.estimatedTotal === undefined
          ? "Estimate not calculated yet"
          : `Estimated total ${formatPrice(
              item.estimatedTotal,
              item.currency,
            )} (${formatPrice(item.estimatedEach, item.currency)} each)`;

      return [
        `${index + 1}. ${item.brand} ${item.style} - ${item.productName}`,
        item.service ? `Service: ${item.service}` : "",
        `Color: ${item.color}`,
        `Quantity: ${item.quantity}`,
        `Sizes: ${sizes || "Not provided"}`,
        decoration,
        estimate,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");

  return [
    "Website quote basket",
    `Total items: ${items.reduce((total, item) => total + item.quantity, 0)}`,
    "",
    itemDetails,
    notes ? `\nCustomer notes:\n${notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function readStoredBasket() {
  try {
    const stored = window.localStorage.getItem(storageKey);
    return stored ? (JSON.parse(stored) as QuoteBasketItem[]) : [];
  } catch {
    return [];
  }
}

export function addItemToFloatingQuoteBasket(item: QuoteBasketItem) {
  window.dispatchEvent(new CustomEvent(addItemEventName, { detail: item }));
}

export function openFloatingQuoteBasket() {
  window.dispatchEvent(new Event(openBasketEventName));
}

export function FloatingQuoteBasket() {
  const [items, setItems] = useState<QuoteBasketItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const hasConfigurationError =
    status?.type === "error" &&
    (status.message.includes("RESEND_API_KEY") ||
      status.message.includes("Email sending is not configured") ||
      status.message.includes("email is not configured"));

  useEffect(() => {
    setItems(readStoredBasket());
    setIsReady(true);

    function handleAddItem(event: Event) {
      const item = (event as CustomEvent<QuoteBasketItem>).detail;

      if (!item) {
        return;
      }

      setItems((current) => [...current, item]);
      setIsOpen(true);
      setStatus(null);
    }

    function handleOpenBasket() {
      setIsOpen(true);
    }

    window.addEventListener(addItemEventName, handleAddItem);
    window.addEventListener(openBasketEventName, handleOpenBasket);

    return () => {
      window.removeEventListener(addItemEventName, handleAddItem);
      window.removeEventListener(openBasketEventName, handleOpenBasket);
    };
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [isReady, items]);

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  async function submitBasket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!items.length) {
      setStatus({
        type: "error",
        message: "Add at least one item before sending the quote basket.",
      });
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const notes = String(formData.get("notes") || "");

    const services = Array.from(
      new Set(items.map((item) => item.service || "Screen Printing")),
    );

    formData.set("interest", services.join(", "));
    formData.set("details", formatBasketDetails(items, notes));

    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to send quote basket.");
      }

      setItems([]);
      form.reset();
      setFileNames([]);
      setStatus({
        type: "success",
        message:
          "Quote sent. Your quote basket was emailed to Hue Graphics and we will review it and follow up.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Unable to send quote basket.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
  const estimatedQuoteTotal = items.reduce((total, item) => {
    const price = numericPrice(item.estimatedTotal);
    return price === null ? total : total + price;
  }, 0);
  const hasEstimatedPrices = items.some(
    (item) => numericPrice(item.estimatedTotal) !== null,
  );

  if (!isReady) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={[
          "fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] left-6 right-6 z-[60] min-h-12 rounded-full bg-accent px-5 text-xs font-black uppercase tracking-wide text-white shadow-[0_18px_42px_rgba(31,115,190,0.36)] transition hover:-translate-y-0.5 hover:bg-[#2a86d8] sm:bottom-5 sm:left-auto sm:right-5 sm:min-h-0 sm:w-auto sm:py-4",
          items.length ? "opacity-100" : "opacity-92",
        ].join(" ")}
      >
        Quote basket ({items.length})
      </button>

      <div
        className={[
          "fixed inset-0 z-[70] transition",
          isOpen ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
        aria-hidden={!isOpen}
      >
        <button
          type="button"
          aria-label="Close quote basket"
          onClick={() => setIsOpen(false)}
          className={[
            "absolute inset-0 bg-black/50 transition-opacity",
            isOpen ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />
        <aside
          className={[
            "absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_24px_90px_rgba(0,0,0,0.38)] transition-transform duration-300",
            isOpen ? "translate-x-0" : "translate-x-full",
          ].join(" ")}
        >
          <div className="border-b border-black/10 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
                  Quote basket
                </p>
                <h3 className="mt-2 text-2xl font-black uppercase text-[#07111f] sm:text-3xl">
                  Project quote
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-black/10 px-3 text-sm font-black text-[#07111f] transition hover:border-accent hover:text-accent"
              >
                X
              </button>
            </div>
            <p className="mt-4 rounded-sm bg-[#eef6ff] p-3 text-sm leading-6 text-[#314154] sm:p-4">
              Add products as you browse. Compatible styles can often be
              combined when they use the same artwork, print location, size,
              and ink setup. Total quantity: <strong>{totalQuantity}</strong>.
            </p>
            {status ? (
              <div
                role="status"
                aria-live="polite"
                className={[
                  "mt-4 rounded-md border p-4 shadow-[0_12px_28px_rgba(7,17,31,0.08)]",
                  status.type === "success"
                    ? "border-green-300 bg-green-50 text-green-900"
                    : "border-red-200 bg-red-50 text-red-800",
                ].join(" ")}
              >
                <p className="text-xs font-black uppercase tracking-[0.18em]">
                  {status.type === "success"
                    ? "Quote sent successfully"
                    : "Quote not sent"}
                </p>
                <p className="mt-2 text-lg font-black leading-6">
                  {status.type === "success"
                    ? "We received your quote basket."
                    : hasConfigurationError
                      ? "The quote basket is ready, but email sending is not configured here."
                      : "Please check the quote basket."}
                </p>
                <p className="mt-2 text-sm font-bold leading-6">
                  {status.message}
                </p>
              </div>
            ) : null}
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            {items.length ? (
              <div className="grid gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-sm border border-black/10 bg-[#f7f8fa] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-accent">
                          {item.brand} - {item.style}
                        </p>
                        <h4 className="mt-1 text-base font-black text-[#07111f]">
                          {item.productName}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="inline-flex min-h-10 items-center rounded-md px-2 text-xs font-black uppercase text-[#8a3440] transition hover:bg-red-50 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-4 grid gap-2 text-sm font-bold text-[#314154]">
                      <p>Color: {item.color}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Service: {item.service || "Screen Printing"}</p>
                      <p>
                        {item.decorationSummary
                          ? `Decoration: ${item.decorationSummary}`
                          : `Print colors: ${item.frontColors} front / ${
                              Number(item.backColors) > 0
                                ? `${item.backColors} back`
                                : "front only"
                            }`}
                      </p>
                      <div className="mt-2 rounded-md bg-white p-3 ring-1 ring-black/8">
                        {item.estimatedTotal !== undefined ||
                        item.estimatedEach !== undefined ? (
                          <div className="grid gap-1">
                            <p>
                              Estimated each:{" "}
                              <span className="font-black text-[#07111f]">
                                {formatPrice(item.estimatedEach, item.currency)}
                              </span>
                            </p>
                            <p>
                              Estimated total:{" "}
                              <span className="font-black text-[#07111f]">
                                {formatPrice(item.estimatedTotal, item.currency)}
                              </span>
                            </p>
                          </div>
                        ) : (
                          <p className="text-[#65717e]">
                            Estimate not calculated yet. Open this item and run
                            an estimate to save item pricing.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {hasEstimatedPrices ? (
                  <div className="sticky bottom-0 rounded-sm border border-accent/20 bg-[#eef6ff] p-4 shadow-[0_-14px_34px_rgba(255,255,255,0.88)]">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-accent">
                      Estimated quote total
                    </p>
                    <p className="mt-2 text-2xl font-black text-[#07111f]">
                      {formatPrice(estimatedQuoteTotal)}
                    </p>
                    <p className="mt-2 text-xs font-semibold leading-5 text-[#52677d]">
                      Items without a saved estimate are not included in this
                      total.
                    </p>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="rounded-sm border border-dashed border-black/20 p-8 text-center">
                <p className="text-sm font-semibold text-[#65717e]">
                  Add products as you browse to start a quote basket.
                </p>
              </div>
            )}

            <form onSubmit={submitBasket} className="mt-6 border-t border-black/10 pt-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  name="name"
                  placeholder="Name"
                  className="min-h-12 rounded-md border border-black/10 bg-[#f4f8fc] px-4 text-sm text-[#07111f]"
                />
                <input
                  name="businessName"
                  placeholder="Business name"
                  className="rounded-md border border-black/10 bg-[#f4f8fc] px-4 py-3 text-sm text-[#07111f]"
                />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email*"
                  className="min-h-12 rounded-md border border-black/10 bg-[#f4f8fc] px-4 text-sm text-[#07111f]"
                />
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone"
                  className="min-h-12 rounded-md border border-black/10 bg-[#f4f8fc] px-4 text-sm text-[#07111f] sm:col-span-2"
                />
              </div>
              <textarea
                name="notes"
                placeholder="Artwork notes, due date, or anything else"
                rows={4}
                className="mt-3 w-full rounded-md border border-black/10 bg-[#f4f8fc] px-4 py-3 text-sm text-[#07111f]"
              />
              <div className="mt-3 rounded-md border border-black/10 bg-[#f4f8fc] p-4">
                <label className="inline-flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-accent/30 bg-white px-4 text-sm font-black uppercase tracking-wide text-[#07111f] transition hover:border-accent hover:text-accent">
                  <span className="text-lg text-accent">+</span>
                  Attach File
                  <input
                    name="files"
                    type="file"
                    multiple
                    className="sr-only"
                    onChange={(event) =>
                      setFileNames(
                        Array.from(event.currentTarget.files || []).map(
                          (file) => file.name,
                        ),
                      )
                    }
                  />
                </label>
                <p className="mt-2 text-xs leading-5 text-[#536273]">
                  JPG, PNG, PDF, SVG, ZIP, and common artwork files.
                </p>
                {fileNames.length > 0 ? (
                  <p className="mt-2 text-xs font-semibold leading-5 text-[#314154]">
                    {fileNames.join(", ")}
                  </p>
                ) : null}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 min-h-12 w-full rounded-md bg-accent px-5 text-sm font-black uppercase text-white transition hover:bg-[#2a86d8] disabled:cursor-wait disabled:opacity-70"
              >
                {isSubmitting ? "Sending..." : "Email quote basket"}
              </button>
            </form>
          </div>
        </aside>
      </div>
    </>
  );
}
