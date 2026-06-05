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
          : `Estimated total ${formatPrice(item.estimatedTotal)} (${formatPrice(
              item.estimatedEach,
            )} each)`;

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
    `Total garments: ${items.reduce((total, item) => total + item.quantity, 0)}`,
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

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

    formData.set("interest", "Screen Printing");
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
      setStatus({
        type: "success",
        message: "Quote basket sent. We will review it and follow up.",
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

  if (!isReady) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={[
          "fixed bottom-5 right-5 z-[60] rounded-full bg-accent px-5 py-4 text-xs font-black uppercase tracking-wide text-white shadow-[0_18px_42px_rgba(31,115,190,0.36)] transition hover:-translate-y-0.5 hover:bg-[#2a86d8]",
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
            "absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-white shadow-[0_24px_90px_rgba(0,0,0,0.38)] transition-transform duration-300",
            isOpen ? "translate-x-0" : "translate-x-full",
          ].join(" ")}
        >
          <div className="border-b border-black/10 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
                  Quote basket
                </p>
                <h3 className="mt-2 text-3xl font-black uppercase text-[#07111f]">
                  Project quote
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-black/10 px-3 py-1 text-sm font-black text-[#07111f] transition hover:border-accent hover:text-accent"
              >
                X
              </button>
            </div>
            <p className="mt-4 rounded-sm bg-[#eef6ff] p-4 text-sm leading-6 text-[#314154]">
              Add products as you browse. Compatible styles can often be
              combined when they use the same artwork, print location, size,
              and ink setup. Total quantity: <strong>{totalQuantity}</strong>.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
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
                        className="text-xs font-black uppercase text-[#8a3440] transition hover:text-red-600"
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
                      {item.estimatedTotal !== undefined ? (
                        <p>Estimated total: {formatPrice(item.estimatedTotal)}</p>
                      ) : null}
                    </div>
                  </div>
                ))}
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
                  className="rounded-md border border-black/10 bg-[#f4f8fc] px-4 py-3 text-sm text-[#07111f]"
                />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email*"
                  className="rounded-md border border-black/10 bg-[#f4f8fc] px-4 py-3 text-sm text-[#07111f]"
                />
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone"
                  className="rounded-md border border-black/10 bg-[#f4f8fc] px-4 py-3 text-sm text-[#07111f] sm:col-span-2"
                />
              </div>
              <textarea
                name="notes"
                placeholder="Artwork notes, due date, or anything else"
                rows={4}
                className="mt-3 w-full rounded-md border border-black/10 bg-[#f4f8fc] px-4 py-3 text-sm text-[#07111f]"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 w-full rounded-md bg-accent px-5 py-4 text-sm font-black uppercase text-white transition hover:bg-[#2a86d8] disabled:cursor-wait disabled:opacity-70"
              >
                {isSubmitting ? "Sending..." : "Email quote basket"}
              </button>
              {status ? (
                <p
                  className={[
                    "mt-4 rounded-md p-4 text-sm font-bold leading-6",
                    status.type === "success"
                      ? "border border-green-200 bg-green-50 text-green-800"
                      : "border border-red-200 bg-red-50 text-red-700",
                  ].join(" ")}
                >
                  {status.message}
                </p>
              ) : null}
            </form>
          </div>
        </aside>
      </div>
    </>
  );
}
