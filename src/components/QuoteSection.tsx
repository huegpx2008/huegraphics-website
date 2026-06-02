"use client";

import { FormEvent } from "react";

const interestOptions = [
  "Apparel",
  "Signs & Banners",
  "Vehicle Graphics",
  "Business Printing",
  "Embroidery",
  "DTF Transfers",
];

export function QuoteSection() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);
    const files = data.getAll("files").filter((file) => file instanceof File && file.name);
    const fileNames = files.map((file) => (file as File).name).join(", ");

    const body = [
      `Name: ${data.get("name") ?? ""}`,
      `Email: ${data.get("email") ?? ""}`,
      `Phone: ${data.get("phone") ?? ""}`,
      `Interested in: ${data.get("interest") ?? ""}`,
      "",
      "Project details:",
      `${data.get("details") ?? ""}`,
      "",
      "Other notes:",
      `${data.get("notes") ?? ""}`,
      "",
      fileNames ? `Files selected: ${fileNames}` : "Files selected: None",
    ].join("\n");

    window.location.href = `mailto:jason@huegraphics.cc?subject=${encodeURIComponent(
      "Quote Request"
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <section id="quote" className="bg-[#050b14] px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-xl border border-white/18 bg-white/12 shadow-[0_26px_90px_rgba(0,0,0,0.42)] lg:grid-cols-[0.42fr_1fr]">
        <div className="bg-[linear-gradient(145deg,#08111f,#06101d)] p-6 sm:p-8">
          <p className="eyebrow">Request a quote</p>
          <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-5xl">
            Apparel. Signs. Banners.
          </h2>
          <div className="mt-7 h-1 w-16 rounded-full bg-accent" />
          <p className="mt-7 text-sm leading-7 text-[#b9c7d6]">
            Send project details, artwork notes, quantities, deadlines, and
            anything else we need to get pricing started.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="bg-[#08111f] p-6 sm:p-8 lg:p-10">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              name="name"
              placeholder="Name"
              className="rounded-lg border border-white/14 bg-white/[0.04] px-4 py-4 text-sm text-white outline-none transition placeholder:text-[#b9c7d6]/70 focus:border-accent"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Email*"
              className="rounded-lg border border-white/14 bg-white/[0.04] px-4 py-4 text-sm text-white outline-none transition placeholder:text-[#b9c7d6]/70 focus:border-accent"
            />
            <input
              name="phone"
              type="tel"
              placeholder="Phone"
              className="rounded-lg border border-white/14 bg-white/[0.04] px-4 py-4 text-sm text-white outline-none transition placeholder:text-[#b9c7d6]/70 focus:border-accent"
            />
            <select
              name="interest"
              required
              defaultValue=""
              className="rounded-lg border border-white/14 bg-[#0b1728] px-4 py-4 text-sm text-white outline-none transition focus:border-accent"
            >
              <option value="" disabled>
                I'm interested in*
              </option>
              {interestOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <textarea
            name="details"
            required
            placeholder="I'm interested in*"
            rows={6}
            className="mt-4 w-full rounded-lg border border-white/14 bg-white/[0.04] px-4 py-4 text-sm text-white outline-none transition placeholder:text-[#b9c7d6]/70 focus:border-accent"
          />
          <textarea
            name="notes"
            placeholder="Other notes"
            rows={5}
            className="mt-4 w-full rounded-lg border border-white/14 bg-white/[0.04] px-4 py-4 text-sm text-white outline-none transition placeholder:text-[#b9c7d6]/70 focus:border-accent"
          />
          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <label className="inline-flex cursor-pointer items-center gap-3 text-sm font-bold text-[#b9c7d6] transition hover:text-white">
                <span className="text-lg text-accent">+</span>
                Attach Files
                <input name="files" type="file" multiple className="sr-only" />
              </label>
              <p className="mt-2 text-xs leading-5 text-white/42">
                File names are added to your quote email.
              </p>
            </div>
            <button
              type="submit"
              className="rounded-lg bg-accent px-8 py-4 text-sm font-black uppercase tracking-wide text-white shadow-[0_18px_36px_rgba(31,115,190,0.28)] transition hover:bg-[#2a86d8]"
            >
              Send -&gt;
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
