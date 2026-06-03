import Image from "next/image";
import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { EarlyLoopVideo } from "@/components/EarlyLoopVideo";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { QuoteSection } from "@/components/QuoteSection";
import { workImagesByFolder } from "@/data/workImages.generated";

const screenPrintingImages = workImagesByFolder["screen-printing"].length
  ? [...workImagesByFolder["screen-printing"]]
  : ["/images/screen-print.png"];

const highlights = [
  "24-piece minimum per order/design",
  "Complimentary artwork help with orders",
  "Typical 7-10 business day turnaround after proof approval",
  "Up to four print colors per side",
];

const faqs = [
  {
    question: "What is screen printing?",
    answer:
      "Screen printing uses ink pushed through a prepared mesh screen to place a design onto garments. It is a strong fit for custom apparel, especially when you need durable prints with clean color and repeatable results.",
  },
  {
    question: "What does screen printing cost?",
    answer:
      "Pricing depends on garment style, quantity, print locations, and the number of ink colors. Send your details through the quote form and we will price the job around the actual order.",
  },
  {
    question: "What is the minimum order?",
    answer:
      "The minimum is 24 pieces per order/design. Those pieces can usually be a mix of sizes and compatible garment styles, as long as the print setup works across the order.",
  },
  {
    question: "What garments can be screen printed?",
    answer:
      "Common options include 100% cotton, cotton/poly blends, polyester performance shirts, hoodies, long sleeves, and soft-style tees.",
  },
  {
    question: "What artwork files should I send?",
    answer:
      "Vector files are best, including PDF, Adobe Illustrator, EPS, and SVG. High-quality PNG or JPG files can also help us recreate or clean up artwork when needed.",
  },
  {
    question: "Can I print on both sides?",
    answer:
      "Yes. Screen printing can be done on the front, back, sleeve, or other approved print locations, with up to four colors per side.",
  },
];

export default function ScreenPrintingPage() {
  const galleryImages = screenPrintingImages.slice(0, 10);

  return (
    <>
      <Header />
      <main className="bg-[#050b14]">
        <section className="relative isolate overflow-hidden px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
          <div className="absolute inset-0 -z-30 bg-[#03070d]" />
          <div className="absolute inset-y-0 right-0 -z-30 w-full lg:w-[78%]">
            <EarlyLoopVideo
              className="h-full w-full object-cover object-[72%_center] opacity-54 brightness-75 contrast-125 saturate-125"
              sources={[
                "/images/20260115_201147.mp4",
                "/images/video-3.mp4",
              ]}
              startSeconds={[5, 0]}
              cutoffSeconds={3}
            />
          </div>
          <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(3,7,13,0.98)_0%,rgba(3,7,13,0.94)_34%,rgba(3,7,13,0.62)_56%,rgba(3,7,13,0.42)_100%)]" />
          <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(3,7,13,0.5)_0%,rgba(3,7,13,0.08)_42%,rgba(3,7,13,0.96)_100%)]" />
          <div className="absolute inset-y-0 left-[34%] -z-10 hidden w-1/3 bg-[linear-gradient(90deg,rgba(3,7,13,0),rgba(3,7,13,0.72)_42%,rgba(3,7,13,0.08)_100%)] lg:block" />
          <div className="absolute right-0 top-10 -z-10 h-[34rem] w-2/3 bg-[radial-gradient(ellipse_at_center,rgba(31,115,190,0.18),transparent_70%)] blur-2xl" />
          <div className="absolute inset-0 -z-10 opacity-[0.1] [background-image:linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:70px_70px]" />
          <div className="mx-auto grid min-h-[560px] max-w-7xl items-end gap-10 lg:grid-cols-[0.9fr_0.75fr]">
            <div className="max-w-3xl">
              <p className="eyebrow">Screen printing</p>
              <h1 className="mt-5 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-6xl font-black uppercase leading-[0.84] tracking-tight text-white sm:text-7xl lg:text-8xl">
                Custom apparel printed in-house.
              </h1>
              <p className="mt-7 max-w-2xl text-lg font-semibold leading-8 text-white/82 sm:text-xl">
                Durable prints for businesses, schools, crews, events, and
                organizations that need apparel people actually want to wear.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/#quote"
                  className="rounded-lg bg-accent px-7 py-4 text-center text-sm font-black uppercase tracking-wide text-white shadow-[0_18px_36px_rgba(31,115,190,0.34)] transition hover:bg-[#2a86d8]"
                >
                  Request a quote
                </Link>
                <a
                  href="https://www.companycasuals.com/huegraphics/start.jsp"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-white/28 bg-black/28 px-7 py-4 text-center text-sm font-black uppercase tracking-wide text-white backdrop-blur-sm transition hover:border-accent/70 hover:bg-accent/10"
                >
                  Browse apparel catalog
                </a>
              </div>
            </div>
            <div className="rounded-xl border border-white/16 bg-[#08111f]/82 p-5 shadow-[0_26px_90px_rgba(0,0,0,0.42)] backdrop-blur">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-accent">
                Quick specs
              </p>
              <div className="mt-5 grid gap-3">
                {highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="rounded-lg border border-white/12 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white/78"
                  >
                    {highlight}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl overflow-hidden rounded-xl border border-white/18 bg-white/12 shadow-[0_26px_90px_rgba(0,0,0,0.42)] lg:grid-cols-[0.78fr_1.22fr]">
            <div className="bg-[linear-gradient(145deg,#08111f,#06101d)] p-6 sm:p-8 lg:p-10">
              <p className="eyebrow">Production floor</p>
              <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-5xl">
                See the print work in motion.
              </h2>
              <p className="mt-6 text-sm leading-7 text-[#b9c7d6]">
                Every screen print job comes down to setup, registration, ink,
                pressure, cure, and a final check before it leaves the shop.
              </p>
            </div>
            <div className="relative min-h-[360px] overflow-hidden bg-[#020814] sm:min-h-[520px]">
              <video
                className="absolute inset-0 h-full w-full object-cover opacity-82 brightness-75 contrast-125 saturate-150"
                src="/images/video-1.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(31,140,255,0.22),transparent_36%),linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.78))]" />
            </div>
          </div>
        </section>

        <section className="px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-xl border border-white/18 bg-white/12 shadow-[0_26px_90px_rgba(0,0,0,0.42)] lg:grid-cols-[0.38fr_1fr]">
            <div className="bg-[linear-gradient(145deg,#08111f,#06101d)] p-6 sm:p-8">
              <p className="eyebrow">What to expect</p>
              <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-5xl">
                Clean prints. Clear process.
              </h2>
              <p className="mt-6 text-sm leading-7 text-[#b9c7d6]">
                Bring finished artwork or send what you have. We can help clean
                up files, prepare the print, and send a proof before production.
              </p>
            </div>
            <div className="grid gap-px bg-white/12 sm:grid-cols-3">
              {[
                ["Artwork", "Send vector files when possible, or send what you have and we will help review it."],
                ["Approval", "You receive a proof before production so details can be checked first."],
                ["Production", "After approval, most screen printing orders run in about 7-10 business days."],
              ].map(([title, text]) => (
                <article key={title} className="bg-[#08111f] p-6 sm:p-7">
                  <h3 className="text-lg font-black uppercase tracking-wide text-white">
                    {title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-[#b9c7d6]">
                    {text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {galleryImages.length > 0 ? (
          <section className="px-5 py-8 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-7xl">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="eyebrow">Photo gallery</p>
                  <h2 className="mt-3 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-5xl">
                    Recent screen printing.
                  </h2>
                </div>
                <Link
                  href="/#work"
                  className="text-sm font-black uppercase tracking-wide text-accent transition hover:text-white"
                >
                  View more work
                </Link>
              </div>
              <div className="grid gap-px overflow-hidden rounded-xl border border-white/18 bg-white/12 sm:grid-cols-2 lg:grid-cols-3">
                {galleryImages.map((image) => (
                  <div
                    key={image}
                    className="relative aspect-[1.35] overflow-hidden bg-[#101b2c]"
                  >
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_58%,rgba(8,17,31,0.72)_100%)]" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-xl border border-white/18 bg-[#08111f] shadow-[0_26px_90px_rgba(0,0,0,0.42)]">
            <div className="border-b border-white/12 p-6 sm:p-8">
              <p className="eyebrow">Screen printing FAQ</p>
              <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-5xl">
                Questions before you order.
              </h2>
            </div>
            <div className="grid gap-px bg-white/12 md:grid-cols-2">
              {faqs.map((faq) => (
                <article key={faq.question} className="bg-[#08111f] p-6 sm:p-7">
                  <h3 className="text-base font-black uppercase tracking-wide text-white">
                    {faq.question}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-[#b9c7d6]">
                    {faq.answer}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <QuoteSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
