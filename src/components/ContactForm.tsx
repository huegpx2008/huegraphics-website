"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
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
      const response = await fetch("/api/contact", {
        method: "POST",
        body: data,
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to send your message.");
      }

      form.reset();
      setStatus({
        message: "Thanks. Your message has been sent.",
        type: "success",
      });
    } catch (error) {
      setStatus({
        message:
          error instanceof Error
            ? error.message
            : "Unable to send your message.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 lg:p-10">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          name="name"
          required
          placeholder="Name*"
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
        <input
          name="subject"
          placeholder="Subject"
          className="rounded-md border border-black/10 bg-[#f4f8fc] px-4 py-4 text-sm text-[#07111f] outline-none transition placeholder:text-[#536273]/70 focus:border-accent"
        />
      </div>
      <textarea
        name="message"
        required
        placeholder="Message*"
        rows={7}
        className="mt-4 w-full rounded-md border border-black/10 bg-[#f4f8fc] px-4 py-4 text-sm text-[#07111f] outline-none transition placeholder:text-[#536273]/70 focus:border-accent"
      />
      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-xs leading-5 text-[#536273]">
          For project pricing, use the quote form below so we have the right
          details to estimate the job.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-accent px-8 py-4 text-sm font-black uppercase tracking-wide text-white shadow-[0_18px_36px_rgba(31,115,190,0.28)] transition hover:bg-[#2a86d8] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </div>
      {status ? (
        <p
          className={[
            "mt-5 rounded-lg border px-4 py-3 text-sm font-bold",
            status.type === "success"
              ? "border-accent/40 bg-accent/10 text-[#07111f]"
              : "border-red-400/35 bg-red-500/10 text-red-900",
          ].join(" ")}
        >
          {status.message}
        </p>
      ) : null}
    </form>
  );
}
