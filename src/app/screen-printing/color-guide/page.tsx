import Link from "next/link";
import type { ReactNode } from "react";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Understanding Ink Colors & Shirt Colors | Screen Printing Guide",
  description:
    "Learn how screen printing colors are counted, why dark shirts often need a white underbase, and how mixing shirt colors can affect setup and pricing.",
  path: "/screen-printing/color-guide",
});

const colorCountExamples = [
  { design: "Red Logo", colors: ["#d71920"], result: "1 Color Print" },
  { design: "Red + Blue Logo", colors: ["#d71920", "#005eb8"], result: "2 Color Print" },
  { design: "Red + Blue + Gold", colors: ["#d71920", "#005eb8", "#f2b705"], result: "3 Color Print" },
];

const faqs = [
  ["Why does a black shirt cost more than a white shirt?", "Dark shirts often need an extra white print layer under the design so bright colors stay vibrant. That extra layer can add setup and production time."],
  ["Why does the same design sometimes have different color counts?", "The shirt color can change the print setup. A red and blue design may be two colors on a white shirt, but three colors on a black shirt if it needs a white underbase."],
  ["Can I order multiple shirt colors?", "Yes. The easiest orders usually keep garment colors in the same general lightness group, such as all dark shirts or all light shirts."],
  ["Why do dark garments need a white base?", "Ink can lose brightness on dark fabric. A white underbase gives the colored ink a bright foundation so the final print looks cleaner."],
  ["What is an underbase?", "An underbase is a white ink layer printed beneath the visible colors. Think of it like priming a wall before painting a bright color."],
  ["Can I mix black and white shirts in the same order?", "Usually, yes, but the print setup may change. Black shirts may need a white underbase while white shirts may not, so we will review the order before quoting."],
];

function ColorDot({ color }: { color: string }) {
  return (
    <span
      className="h-10 w-10 rounded-full border border-black/20 shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
      style={{ backgroundColor: color }}
    />
  );
}

function MiniShirt({ children }: { children: ReactNode }) {
  return (
    <div className="absolute left-1/2 top-7 h-28 w-44 -translate-x-1/2">
      <div className="absolute left-0 top-5 h-20 w-12 -rotate-12 rounded-[1.2rem] bg-white/90 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55)]" />
      <div className="absolute right-0 top-5 h-20 w-12 rotate-12 rounded-[1.2rem] bg-white/90 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55)]" />
      <div className="absolute left-8 right-8 top-0 h-28 rounded-[1.7rem_1.7rem_1.1rem_1.1rem] bg-white/90 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.6)]" />
      <div className="absolute left-1/2 top-14 flex -translate-x-1/2 gap-2">
        {children}
      </div>
    </div>
  );
}

function MockShirt({
  color,
  layers,
  label,
}: {
  color: string;
  layers: Array<{ name: string; color: string; textColor?: string }>;
  label: string;
}) {
  return (
    <div className="rounded-sm border border-black/10 bg-[#f4f8fc] p-5">
      <div
        className="relative mx-auto h-56 max-w-[17rem] overflow-hidden rounded-[2.25rem_2.25rem_1.5rem_1.5rem] border border-white/14 shadow-[0_22px_60px_rgba(0,0,0,0.34)]"
        style={{ backgroundColor: color }}
      >
        <div className="absolute left-1/2 top-16 flex -translate-x-1/2 flex-col items-center gap-1">
          {layers.map((layer) => (
            <div
              key={layer.name}
              className="grid h-10 w-36 place-items-center rounded-lg border border-black/18 text-xs font-black uppercase tracking-wide shadow-[0_8px_18px_rgba(0,0,0,0.26)]"
              style={{ backgroundColor: layer.color, color: layer.textColor || "#ffffff" }}
            >
              {layer.name}
            </div>
          ))}
        </div>
      </div>
      <p className="mt-5 text-center text-sm font-black uppercase tracking-wide text-[#07111f]">
        {label}
      </p>
    </div>
  );
}

export default function ScreenPrintingColorGuidePage() {
  return (
    <>
      <Header />
      <main className="bg-[#f4f8fc]">
        <section className="relative isolate overflow-hidden px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_20%,rgba(31,115,190,0.16),transparent_28rem),linear-gradient(180deg,#ffffff,#f4f8fc)]" />
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="eyebrow">Screen printing education</p>
              <h1 className="mt-5 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-5xl font-black uppercase leading-[0.9] text-[#07111f] sm:text-7xl">
                Understanding ink colors & shirt colors.
              </h1>
            </div>
            <div>
              <p className="text-lg leading-8 text-[#314154]">
                Not sure how your project will print? Contact us and we&apos;ll
                be happy to help.
              </p>
              <Link
                href="/request-a-quote"
                className="mt-6 inline-flex rounded-lg bg-accent px-7 py-4 text-sm font-black uppercase tracking-wide text-white shadow-[0_18px_36px_rgba(31,115,190,0.34)] transition hover:bg-[#2a86d8]"
              >
                Request a quote -&gt;
              </Link>
            </div>
          </div>
        </section>

        <section className="px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-sm bg-[#c9d7e6] shadow-[0_24px_70px_rgba(7,17,31,0.12)] ring-1 ring-black/10 lg:grid-cols-[0.34fr_1fr]">
            <div className="bg-white p-6 sm:p-8">
              <p className="eyebrow">Color count</p>
              <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.95] text-[#07111f] sm:text-5xl">
                How screen printing colors are counted.
              </h2>
              <p className="mt-6 text-sm leading-7 text-[#314154]">
                Each ink color usually needs its own screen. More colors can
                mean more setup, more print passes, and more production time.
              </p>
            </div>
            <div className="grid gap-px bg-[#d7e3ee] md:grid-cols-3">
              {colorCountExamples.map((example) => (
                <article key={example.design} className="bg-white p-6">
                  <div className="relative h-40 overflow-hidden rounded-sm border border-black/10 bg-[#eef4fa]">
                    <MiniShirt>
                      {example.colors.map((color) => (
                        <ColorDot key={color} color={color} />
                      ))}
                    </MiniShirt>
                  </div>
                  <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-accent">
                    Design
                  </p>
                  <h3 className="mt-2 text-lg font-black uppercase text-[#07111f]">
                    {example.design}
                  </h3>
                  <p className="mt-4 rounded-md border border-accent/30 bg-accent/10 px-4 py-3 text-sm font-black uppercase tracking-wide text-[#07111f]">
                    {example.result}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-sm bg-[#c9d7e6] shadow-[0_24px_70px_rgba(7,17,31,0.12)] ring-1 ring-black/10 lg:grid-cols-2">
            <div className="bg-white p-6 sm:p-8">
              <p className="eyebrow">Light shirt</p>
              <h2 className="mt-4 text-3xl font-black uppercase leading-tight text-[#07111f]">
                White shirt example
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#314154]">
                Red + blue artwork on a white shirt usually prints as the two
                visible ink colors.
              </p>
              <div className="mt-6">
                <MockShirt
                  color="#f4f7fb"
                  label="2 Color Print"
                  layers={[
                    { name: "Red", color: "#d71920" },
                    { name: "Blue", color: "#005eb8" },
                  ]}
                />
              </div>
            </div>
            <div className="bg-white p-6 sm:p-8">
              <p className="eyebrow">Dark shirt</p>
              <h2 className="mt-4 text-3xl font-black uppercase leading-tight text-[#07111f]">
                Black shirt example
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#314154]">
                Dark garments often need a white underbase so red and blue stay
                bright. That underbase is typically counted as an added print
                color.
              </p>
              <div className="mt-6">
                <MockShirt
                  color="#05070b"
                  label="3 Color Print"
                  layers={[
                    { name: "White Underbase", color: "#ffffff", textColor: "#101827" },
                    { name: "Red", color: "#d71920" },
                    { name: "Blue", color: "#005eb8" },
                  ]}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-sm bg-[#c9d7e6] shadow-[0_24px_70px_rgba(7,17,31,0.12)] ring-1 ring-black/10 lg:grid-cols-[0.38fr_1fr]">
            <div className="bg-white p-6 sm:p-8">
              <p className="eyebrow">Ink layers</p>
              <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.95] text-[#07111f] sm:text-5xl">
                What is happening on the shirt.
              </h2>
              <p className="mt-6 text-sm leading-7 text-[#314154]">
                Think of the white underbase like primer. It goes down first on
                dark fabric, then the visible colors print on top.
              </p>
            </div>
            <div className="bg-white p-6 sm:p-8">
              {[
                ["Top layer", "Red Ink", "#d71920", "translate-x-8"],
                ["Top layer", "Blue Ink", "#005eb8", "translate-x-4"],
                ["Base layer", "White Underbase", "#ffffff", "translate-x-0"],
                ["Garment", "Black Shirt", "#05070b", "-translate-x-4"],
              ].map(([kind, name, color, shift], index) => (
                <div
                  key={name}
                  className={`relative mb-4 ${shift} rounded-sm border border-black/10 p-5 shadow-[0_16px_38px_rgba(0,0,0,0.16)]`}
                  style={{ backgroundColor: color }}
                >
                  <p className={`text-xs font-black uppercase tracking-[0.18em] ${color === "#ffffff" ? "text-[#101827]/55" : "text-white/62"}`}>
                    {kind}
                  </p>
                  <p className={`mt-1 text-2xl font-black uppercase ${color === "#ffffff" ? "text-[#101827]" : "text-white"}`}>
                    {name}
                  </p>
                  <span className="absolute right-5 top-5 text-sm font-black text-white/28">
                    0{index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto overflow-hidden rounded-sm bg-[#c9d7e6] shadow-[0_24px_70px_rgba(7,17,31,0.12)] ring-1 ring-black/10">
            <div className="bg-white p-6 sm:p-8">
              <p className="eyebrow">Mixing shirt colors</p>
              <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.95] text-[#07111f] sm:text-5xl">
                Can I mix shirt colors?
              </h2>
            </div>
            <div className="grid gap-px bg-[#d7e3ee] lg:grid-cols-3">
              {[
                [["Black", "#05070b"], ["Navy", "#071d3c"], ["Dark Gray", "#3f4448"], "Usually Compatible", "These garments often use the same print setup and white underbase."],
                [["White", "#f4f7fb"], ["Ash", "#d7d8d5"], ["Light Gray", "#bfc3c7"], "Usually Compatible", "These garments often print using the same ink colors without an underbase."],
                [["Black", "#05070b"], ["White", "#f4f7fb"], ["Red", "#a81220"], "May Require Additional Setup", "Mixing light and dark garments can require different print configurations and additional production time."],
              ].map(([one, two, three, title, text]) => (
                <article key={String(text)} className="bg-white p-6 sm:p-8">
                  {[one, two, three].map((item) => {
                    const [name, color] = item as string[];
                    return (
                      <div
                        key={name}
                        className="mb-3 flex items-center gap-3 rounded-md border border-black/10 bg-[#f4f8fc] p-3"
                      >
                        <span className="h-9 w-9 rounded-full border border-black/20" style={{ backgroundColor: color }} />
                        <span className="text-sm font-black uppercase tracking-wide text-[#07111f]">
                          {name}
                        </span>
                      </div>
                    );
                  })}
                  <p className="mt-6 rounded-md border border-accent/30 bg-accent/10 px-4 py-3 text-sm font-black uppercase tracking-wide text-[#07111f]">
                    {String(title)}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-[#314154]">
                    {String(text)}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl rounded-sm border border-accent/25 bg-white p-6 shadow-[0_18px_55px_rgba(7,17,31,0.1)] sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-accent">
              Tip
            </p>
            <p className="mt-3 text-lg font-bold leading-8 text-[#07111f]">
              If you want to order multiple garment colors while keeping costs
              lower, choose colors within the same general lightness group, all
              dark colors or all light colors, whenever possible.
            </p>
          </div>
        </section>

        <section className="px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-sm bg-[#c9d7e6] shadow-[0_24px_70px_rgba(7,17,31,0.12)] ring-1 ring-black/10">
            <div className="bg-white p-6 sm:p-8">
              <p className="eyebrow">FAQ</p>
              <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.95] text-[#07111f] sm:text-5xl">
                Common color-count questions.
              </h2>
            </div>
            <div className="grid gap-px bg-[#d7e3ee] md:grid-cols-2">
              {faqs.map(([question, answer]) => (
                <article key={question} className="bg-white p-6 sm:p-7">
                  <h3 className="text-base font-black uppercase tracking-wide text-[#07111f]">
                    {question}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-[#314154]">
                    {answer}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  );
}
