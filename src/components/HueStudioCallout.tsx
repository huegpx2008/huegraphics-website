import Image from "next/image";

const studioFeatures = [
  "Upload finished artwork",
  "Design or import from Canva",
  "Price and order online",
];

export function HueStudioCallout() {
  return (
    <section
      id="hue-studio"
      aria-labelledby="hue-studio-heading"
      className="relative isolate overflow-hidden border-y border-white/10 bg-[#02070d] px-5 py-14 text-white sm:px-8 lg:px-10 lg:py-20"
    >
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_18%_45%,rgba(31,115,190,0.24),transparent_30rem),linear-gradient(120deg,#02070d_0%,#08111f_52%,#03070c_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:56px_56px]" />

      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-16">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#50a8ff]/35 bg-[#1f73be]/12 px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#77bbff]">
            <span className="h-2 w-2 rounded-full bg-[#50a8ff] shadow-[0_0_16px_rgba(80,168,255,0.9)]" />
            Now live
          </div>
          <Image
            src="/images/hue-studio-logo.jpg"
            alt="Hue Studio by Hue Graphics"
            width={1266}
            height={346}
            sizes="(min-width: 1024px) 43vw, 100vw"
            className="mt-6 h-auto w-full max-w-xl"
          />
          <p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-white/52">
            Design. Upload. Order.
          </p>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#50a8ff]">
            A faster way to order
          </p>
          <h2
            id="hue-studio-heading"
            className="mt-4 max-w-2xl font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.92] text-white sm:text-5xl lg:text-6xl"
          >
            Start with your artwork. Finish with an order.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/72">
            Hue Studio is our self-service design and ordering tool. Upload
            print-ready artwork, make quick changes or build a simple design,
            import a saved Canva project, then choose your product, see pricing,
            and check out online.
          </p>

          <ul className="mt-7 grid gap-3 sm:grid-cols-3">
            {studioFeatures.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 border-l-2 border-[#50a8ff] bg-white/[0.04] px-4 py-3 text-xs font-bold uppercase leading-5 text-white/78"
              >
                {feature}
              </li>
            ))}
          </ul>

          <a
            href="https://studio.huegraphics.cc"
            target="_blank"
            rel="noreferrer"
            className="group mt-8 inline-flex min-h-12 items-center justify-center rounded-md bg-[#1f73be] px-7 text-sm font-black uppercase tracking-[0.06em] text-white shadow-[0_18px_42px_rgba(31,115,190,0.32)] transition hover:-translate-y-0.5 hover:bg-[#2a86d8]"
          >
            Open Hue Studio
            <span aria-hidden="true" className="ml-3 transition group-hover:translate-x-1">
              -&gt;
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
