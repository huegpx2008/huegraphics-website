"use client";

import { FormEvent, useState } from "react";
import {
  addItemToFloatingQuoteBasket,
  type QuoteBasketItem,
} from "@/components/FloatingQuoteBasket";

const locationOptions = [
  { label: "Full Front", value: "front" },
  { label: "Full Back", value: "back" },
  { label: "Left Chest", value: "leftChest" },
  { label: "Left Sleeve", value: "leftSleeve" },
  { label: "Right Sleeve", value: "rightSleeve" },
];
const frontPrintPresetOptions = [
  { label: "None", value: "none" },
  { label: "Full Front", value: "front" },
  { label: "Left Chest", value: "leftChest" },
];
const backPrintPresetOptions = [
  { label: "None", value: "none" },
  { label: "Full Back", value: "back" },
];

export function DtfBringYourOwnForm() {
  const [quantity, setQuantity] = useState("1");
  const [frontPreset, setFrontPreset] = useState("front");
  const [backPreset, setBackPreset] = useState("none");
  const [leftSleeve, setLeftSleeve] = useState(false);
  const [rightSleeve, setRightSleeve] = useState(false);
  const [apparel, setApparel] = useState("");
  const [message, setMessage] = useState("");

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const numericQuantity = Math.max(1, Math.floor(Number(quantity) || 1));
    const selectedLocations = [
      frontPreset,
      backPreset,
      leftSleeve ? "leftSleeve" : "",
      rightSleeve ? "rightSleeve" : "",
    ]
      .filter((value) => value && value !== "none")
      .map(
        (value) =>
          locationOptions.find((option) => option.value === value)?.label,
      )
      .filter(Boolean);
    const item: QuoteBasketItem = {
      id: `dtf-byo-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      productName: "Customer supplied apparel",
      style: "BYO",
      brand: "Customer supplied",
      color: "Provided by customer",
      sizes: { Each: numericQuantity },
      quantity: numericQuantity,
      service: "DTF Transfers",
      frontColors: "Full color",
      backColors: "0",
      decorationSummary: [
        selectedLocations.length
          ? selectedLocations.join(" / ")
          : "Artwork placement to review",
        "Bring your own apparel",
        apparel.trim() ? `Apparel notes: ${apparel.trim()}` : "",
      ]
        .filter(Boolean)
        .join(" / "),
    };

    addItemToFloatingQuoteBasket(item);
    setMessage("Added customer supplied apparel to the quote basket.");
  }

  return (
    <section className="px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-sm bg-[#c9d7e6] shadow-[0_24px_70px_rgba(7,17,31,0.12)] ring-1 ring-black/10 lg:grid-cols-[0.42fr_1fr]">
        <div className="bg-[#07111f] p-6 text-white sm:p-8">
          <p className="eyebrow text-accent">Bring your own apparel</p>
          <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.95] sm:text-5xl">
            Have shirts already?
          </h2>
          <p className="mt-6 text-sm leading-7 text-[#d6e3f0]">
            Add customer supplied garments as a quote basket item. We will
            review the apparel, print placement, artwork, and production risk
            before confirming final pricing.
          </p>
        </div>
        <form onSubmit={submitForm} className="grid gap-4 bg-white p-6 sm:p-8 lg:grid-cols-4">
          <label className="block">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6a7480]">
              Quantity
            </span>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              className="mt-2 h-12 w-full rounded-md border border-black/12 bg-[#f7f8fa] px-3 text-sm font-semibold text-[#07111f]"
            />
          </label>
          <label className="block">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6a7480]">
              Front print preset
            </span>
            <select
              value={frontPreset}
              onChange={(event) => setFrontPreset(event.target.value)}
              className="mt-2 h-12 w-full rounded-md border border-black/12 bg-[#f7f8fa] px-3 text-sm font-semibold text-[#07111f]"
            >
              {frontPrintPresetOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6a7480]">
              Back print preset
            </span>
            <select
              value={backPreset}
              onChange={(event) => setBackPreset(event.target.value)}
              className="mt-2 h-12 w-full rounded-md border border-black/12 bg-[#f7f8fa] px-3 text-sm font-semibold text-[#07111f]"
            >
              {backPrintPresetOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          {[
            {
              label: "Left sleeve",
              checked: leftSleeve,
              setter: setLeftSleeve,
            },
            {
              label: "Right sleeve",
              checked: rightSleeve,
              setter: setRightSleeve,
            },
          ].map((option) => (
            <label
              key={option.label}
              className="flex min-h-12 cursor-pointer items-center justify-between rounded-md border border-black/12 bg-[#f7f8fa] px-3 text-xs font-black uppercase tracking-wide text-[#314154] lg:mt-6"
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
          <label className="block lg:col-span-4">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6a7480]">
              Apparel notes
            </span>
            <textarea
              value={apparel}
              onChange={(event) => setApparel(event.target.value)}
              rows={4}
              placeholder="Brand, garment type, fabric, colors, or anything we should know"
              className="mt-2 w-full rounded-md border border-black/12 bg-[#f7f8fa] px-3 py-3 text-sm font-semibold text-[#07111f]"
            />
          </label>
          <button
            type="submit"
            className="min-h-12 rounded-md bg-accent px-5 text-sm font-black uppercase text-white transition hover:bg-[#2a86d8] lg:col-span-4"
          >
            Add BYO apparel to quote basket
          </button>
          {message ? (
            <p className="rounded-md border border-green-200 bg-green-50 p-3 text-sm font-bold text-green-800 lg:col-span-4">
              {message}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
