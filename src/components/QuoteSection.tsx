"use client";

import { FormEvent, useState } from "react";

const interestOptions = [
  "Apparel",
  "Signs & Banners",
  "Vehicle Graphics",
  "Business Printing",
  "Embroidery",
  "DTF Transfers",
];

export function QuoteSection() {
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        body: data,
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to send quote request.");
      }

      form.reset();
      setFileNames([]);
      setStatus({
        message: "Thanks. Your quote request has been sent.",
        type: "success",
      });
    } catch (error) {
      setStatus({
        message:
          error instanceof Error
            ? error.message
            : "Unable to send quote request.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="quote" className="bg-[#f4f8fc] px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-sm bg-[#c9d7e6] shadow-[0_24px_70px_rgba(7,17,31,0.12)] ring-1 ring-black/10 lg:grid-cols-[0.42fr_1fr]">
        <div className="bg-white p-6 sm:p-8">
          <p className="eyebrow">Request a quote</p>
          <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.95] text-[#07111f] sm:text-5xl">
            Apparel. Signs. Banners.
          </h2>
          <div className="mt-7 h-1 w-16 rounded-full bg-accent" />
          <p className="mt-7 text-sm leading-7 text-[#314154]">
            Send project details, artwork notes, quantities, deadlines, and
            anything else we need to get pricing started.
          </p>
        </div>
        {status?.type === "success" ? (
          <div className="relative overflow-hidden bg-white p-6 sm:p-8 lg:p-10">
            <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-accent/18 blur-3xl" />
            <div className="relative flex min-h-[520px] flex-col items-start justify-center">
              <div className="grid h-20 w-20 place-items-center rounded-2xl border border-accent/45 bg-accent/15 text-4xl font-black text-accent shadow-[0_0_42px_rgba(31,115,190,0.34)]">
                OK
              </div>
              <p className="mt-8 text-xs font-black uppercase tracking-[0.22em] text-accent">
                Quote request received
              </p>
              <h3 className="mt-4 max-w-xl font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-5xl font-black uppercase leading-[0.92] text-[#07111f] sm:text-6xl">
                Your project is on the shop board.
              </h3>
              <p className="mt-6 max-w-xl text-base leading-8 text-[#314154]">
                Your project details made it through. We will review the specs,
                files, and timeline, then get back to you with the next steps.
              </p>
              <div className="mt-8 rounded-md border border-black/10 bg-[#f4f8fc] p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#536273]">
                  What happens next
                </p>
                <p className="mt-2 text-sm leading-7 text-[#314154]">
                  A real person checks the request, not a robot queue. If we
                  need artwork clarification, quantities, or sizing details,
                  we will reach out.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStatus(null)}
                className="mt-8 inline-flex min-h-12 items-center justify-center rounded-lg bg-accent px-7 text-sm font-black uppercase tracking-wide text-white shadow-[0_18px_36px_rgba(31,115,190,0.28)] transition hover:bg-[#2a86d8]"
              >
                Send another quote
              </button>
            </div>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 lg:p-10">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              name="name"
              placeholder="Name"
              className="rounded-md border border-black/10 bg-[#f4f8fc] px-4 py-4 text-sm text-[#07111f] outline-none transition placeholder:text-[#536273]/70 focus:border-accent"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Email*"
              className="rounded-md border border-black/10 bg-[#f4f8fc] px-4 py-4 text-sm text-[#07111f] outline-none transition placeholder:text-[#536273]/70 focus:border-accent"
            />
            <input
              name="phone"
              type="tel"
              placeholder="Phone"
              className="rounded-md border border-black/10 bg-[#f4f8fc] px-4 py-4 text-sm text-[#07111f] outline-none transition placeholder:text-[#536273]/70 focus:border-accent"
            />
            <select
              name="interest"
              required
              defaultValue=""
              className="rounded-md border border-black/10 bg-[#f4f8fc] px-4 py-4 text-sm text-[#07111f] outline-none transition focus:border-accent"
            >
              <option value="" disabled>
                Service needed*
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
            placeholder="Project details*"
            rows={6}
            className="mt-4 w-full rounded-md border border-black/10 bg-[#f4f8fc] px-4 py-4 text-sm text-[#07111f] outline-none transition placeholder:text-[#536273]/70 focus:border-accent"
          />
          <textarea
            name="notes"
            placeholder="Other notes"
            rows={5}
            className="mt-4 w-full rounded-md border border-black/10 bg-[#f4f8fc] px-4 py-4 text-sm text-[#07111f] outline-none transition placeholder:text-[#536273]/70 focus:border-accent"
          />
          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <label className="inline-flex cursor-pointer items-center gap-3 text-sm font-bold text-[#314154] transition hover:text-accent">
                <span className="text-lg text-accent">+</span>
                Attach Files
                <input
                  name="files"
                  type="file"
                  multiple
                  className="sr-only"
                  onChange={(event) =>
                    setFileNames(
                      Array.from(event.currentTarget.files || []).map(
                        (file) => file.name
                      )
                    )
                  }
                />
              </label>
              <p className="mt-2 text-xs leading-5 text-[#536273]">
                JPG, PNG, PDF, SVG, ZIP, and common artwork files.
              </p>
              {fileNames.length > 0 ? (
                <p className="mt-2 max-w-md text-xs leading-5 text-[#314154]">
                  {fileNames.join(", ")}
                </p>
              ) : null}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-12 w-full rounded-lg bg-accent px-8 text-sm font-black uppercase tracking-wide text-white shadow-[0_18px_36px_rgba(31,115,190,0.28)] transition hover:bg-[#2a86d8] sm:w-auto"
            >
              {isSubmitting ? "Sending..." : "Send ->"}
            </button>
          </div>
          {status ? (
            <p
              className="mt-5 rounded-lg border border-red-400/35 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-100"
            >
              {status.message}
            </p>
          ) : null}
        </form>
        )}
      </div>
    </section>
  );
}
