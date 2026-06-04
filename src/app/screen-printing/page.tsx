import Image from "next/image";
import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { EarlyLoopVideo } from "@/components/EarlyLoopVideo";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { InkColorExplorer } from "@/components/InkColorExplorer";
import { QuoteSection } from "@/components/QuoteSection";
import { workImagesByFolder } from "@/data/workImages.generated";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Screen Printing in Bethlehem, GA | Custom Shirts & Apparel",
  description:
    "Custom screen printing for shirts, hoodies, team apparel, school orders, events, churches, and Georgia businesses in Bethlehem, Barrow County, Auburn, Winder, and Northeast Georgia.",
  path: "/screen-printing",
});

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

const processSteps = [
  {
    title: "Artwork",
    text: "Send vector files when possible, or send what you have and we will help review it.",
    visual: "artwork",
  },
  {
    title: "Approval",
    text: "You receive a proof before production so details can be checked first.",
    visual: "approval",
  },
  {
    title: "Production",
    text: "After approval, most screen printing orders run in about 7-10 business days.",
    visual: "production",
  },
];

export default function ScreenPrintingPage() {
  const galleryImages = screenPrintingImages.slice(0, 10);

  return (
    <>
      <Header />
      <main className="bg-[#f4f8fc]">
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
          <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(3,7,13,0.5)_0%,rgba(3,7,13,0.08)_42%,#f4f8fc_100%)]" />
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
                organizations in Bethlehem, Barrow County, Winder, Auburn, and
                Northeast Georgia that need apparel people actually want to
                wear.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/request-a-quote"
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
            <div className="rounded-sm border border-white/18 bg-white/92 p-5 text-[#07111f] shadow-[0_26px_90px_rgba(0,0,0,0.28)] backdrop-blur">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-accent">
                Quick specs
              </p>
              <div className="mt-5 grid gap-3">
                {highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="rounded-md border border-black/8 bg-[#f4f8fc] px-4 py-3 text-sm font-bold text-[#314154]"
                  >
                    {highlight}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f4f8fc] px-5 pt-8 sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-7xl flex-wrap gap-3">
            <Link
              href="/screen-printing"
              className="rounded-lg bg-accent px-5 py-3 text-xs font-black uppercase tracking-wide text-white shadow-[0_14px_30px_rgba(31,115,190,0.22)]"
            >
              Screen printing overview
            </Link>
            <Link
              href="/screen-printing/color-guide"
              className="rounded-lg border border-accent/25 bg-white px-5 py-3 text-xs font-black uppercase tracking-wide text-accent shadow-[0_10px_28px_rgba(7,17,31,0.08)] transition hover:border-accent hover:bg-accent hover:text-white"
            >
              Ink & shirt color guide
            </Link>
          </div>
        </section>

        <section className="px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl overflow-hidden rounded-sm bg-[#c9d7e6] shadow-[0_24px_70px_rgba(7,17,31,0.12)] ring-1 ring-black/10 lg:grid-cols-[0.78fr_1.22fr]">
            <div className="bg-white p-6 sm:p-8 lg:p-10">
              <p className="eyebrow">Production floor</p>
              <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.95] text-[#07111f] sm:text-5xl">
                See the print work in motion.
              </h2>
              <p className="mt-6 text-sm leading-7 text-[#314154]">
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
          <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-sm bg-[#c9d7e6] shadow-[0_24px_70px_rgba(7,17,31,0.12)] ring-1 ring-black/10 lg:grid-cols-[0.38fr_1fr]">
            <div className="bg-white p-6 sm:p-8">
              <p className="eyebrow">What to expect</p>
              <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.95] text-[#07111f] sm:text-5xl">
                Clean prints. Clear process.
              </h2>
              <p className="mt-6 text-sm leading-7 text-[#314154]">
                Bring finished artwork or send what you have. We can help clean
                up files, prepare the print, and send a proof before production.
              </p>
            </div>
            <div className="grid gap-px bg-[#d7e3ee] sm:grid-cols-3">
              {processSteps.map((step, index) => (
                <article
                  key={step.title}
                  className="relative min-h-[360px] overflow-hidden bg-[#08111f] p-6 sm:p-7"
                >
                  <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:38px_38px]" />
                  <div className="relative h-40 overflow-hidden rounded-lg border border-white/12 bg-[#101b2c]">
                    {step.visual === "artwork" ? (
                      <div className="absolute inset-0 p-5">
                        <div className="h-full rounded border border-dashed border-accent/45 bg-white/[0.03]">
                          <div className="mx-auto mt-8 h-12 w-32 animate-[artworkDraw_3.4s_ease-in-out_infinite] rounded-full border-[10px] border-white/80 border-r-accent" />
                          <div className="mx-auto mt-5 h-2 w-24 animate-[processPulse_1.8s_ease-in-out_infinite] rounded-full bg-accent" />
                        </div>
                      </div>
                    ) : null}
                    {step.visual === "approval" ? (
                      <div className="absolute inset-0 grid place-items-center">
                        <div className="relative h-24 w-24">
                          <div className="absolute inset-0 animate-[approvalPing_2.2s_ease-out_infinite] rounded-full border border-accent/70" />
                          <div className="absolute inset-3 grid place-items-center rounded-full border border-accent/60 bg-accent/14 text-4xl font-black text-white">
                            OK
                          </div>
                          <div className="absolute -right-8 top-1/2 h-px w-16 animate-[proofSlide_2.2s_ease-in-out_infinite] bg-accent" />
                        </div>
                      </div>
                    ) : null}
                    {step.visual === "production" ? (
                      <div className="absolute inset-0 p-5">
                        <div className="relative h-full overflow-hidden rounded bg-white/[0.04]">
                          <div className="absolute left-5 right-5 top-7 h-8 rounded-full bg-white/84" />
                          <div className="absolute left-8 right-8 top-16 h-10 rounded-lg bg-accent/90" />
                          <div className="absolute left-0 top-11 h-8 w-24 animate-[printPass_2.4s_ease-in-out_infinite] rounded-r bg-black/72 shadow-[0_0_28px_rgba(31,115,190,0.42)]" />
                          <div className="absolute bottom-5 left-5 right-5 h-2 animate-[processPulse_1.4s_ease-in-out_infinite] rounded-full bg-accent" />
                        </div>
                      </div>
                    ) : null}
                    <div className="absolute left-4 top-4 rounded bg-black/44 px-2 py-1 text-[0.65rem] font-black uppercase tracking-[0.18em] text-accent">
                      Step 0{index + 1}
                    </div>
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-wide text-white">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-[#b9c7d6]">
                    {step.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <InkColorExplorer />

        {galleryImages.length > 0 ? (
          <section className="px-5 py-8 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-7xl">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="eyebrow">Photo gallery</p>
                  <h2 className="mt-3 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.95] text-[#07111f] sm:text-5xl">
                    Recent screen printing.
                  </h2>
                </div>
                <Link
                  href="/portfolio"
                  className="text-sm font-black uppercase tracking-wide text-accent transition hover:text-[#07111f]"
                >
                  View more work
                </Link>
              </div>
              <div className="grid gap-px overflow-hidden rounded-sm bg-[#c9d7e6] shadow-[0_24px_70px_rgba(7,17,31,0.12)] ring-1 ring-black/10 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="mx-auto max-w-7xl overflow-hidden rounded-sm bg-[#c9d7e6] shadow-[0_24px_70px_rgba(7,17,31,0.12)] ring-1 ring-black/10">
            <div className="bg-white p-6 sm:p-8">
              <p className="eyebrow">Screen printing FAQ</p>
              <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.95] text-[#07111f] sm:text-5xl">
                Questions before you order.
              </h2>
            </div>
            <div className="grid gap-px bg-[#d7e3ee] md:grid-cols-2">
              {faqs.map((faq) => (
                <article key={faq.question} className="bg-white p-6 sm:p-7">
                  <h3 className="text-base font-black uppercase tracking-wide text-[#07111f]">
                    {faq.question}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-[#314154]">
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
