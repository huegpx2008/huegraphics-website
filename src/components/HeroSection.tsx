import Image from "next/image";

export function HeroSection() {
  return (
    <section className="hero-shell relative isolate min-h-[calc(100svh-73px)] overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_16%_18%,rgba(31,115,190,0.2),transparent_28rem),linear-gradient(135deg,rgba(8,17,31,0.98),rgba(8,17,31,0.86)_48%,rgba(17,27,46,0.96))]" />
      <div className="absolute left-1/2 top-0 -z-10 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
      <div className="mx-auto grid min-h-[calc(100svh-73px)] w-full max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-16">
        <div className="max-w-2xl pt-2 lg:pt-0">
          <p className="eyebrow">Custom production for crews, fleets, and brands</p>
          <h1 className="mt-5 text-[clamp(3.2rem,9vw,7.7rem)] font-black leading-[0.86] tracking-normal text-white">
            Custom Apparel.
            <span className="block text-white/92">Signs.</span>
            <span className="block text-white/76">Printing.</span>
          </h1>
          <p className="mt-7 max-w-xl text-xl font-semibold leading-8 text-white/78 sm:text-2xl">
            Built in Bethlehem, Georgia.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#contact"
              className="rounded-xl bg-accent px-6 py-4 text-center text-sm font-extrabold uppercase tracking-wide text-white shadow-glow transition hover:bg-[#2a86d8]"
            >
              Request a Quote
            </a>
            <a
              href="#work"
              className="rounded-xl border border-white/16 bg-white/[0.04] px-6 py-4 text-center text-sm font-extrabold uppercase tracking-wide text-white transition hover:border-accent/60 hover:bg-accent/10"
            >
              View Our Work
            </a>
          </div>
          <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
            {["Apparel", "Vehicle + Site", "Print Runs"].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-white/10 bg-card/65 px-3 py-3 text-center text-xs font-bold uppercase tracking-wide text-white/68"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-5 rounded-[2rem] bg-accent/18 blur-3xl" />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-accent/30 bg-card shadow-[0_28px_90px_rgba(0,0,0,0.38),0_0_45px_rgba(31,115,190,0.2)]">
            <div className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(8,17,31,0.18),rgba(8,17,31,0.04)_42%,rgba(8,17,31,0.62)),linear-gradient(0deg,rgba(8,17,31,0.8),transparent_42%)]" />
            <Image
              src="/images/placeholder-hero.svg"
              alt="Premium industrial placeholder for Hue Graphics production work"
              width={960}
              height={760}
              priority
              className="aspect-[1.05/1] h-auto w-full object-cover"
            />
            <div className="absolute bottom-5 left-5 right-5 z-20 rounded-2xl border border-white/12 bg-navy/72 p-4 shadow-2xl backdrop-blur-md sm:bottom-7 sm:left-7 sm:right-7 sm:p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-accent">
                    Production Ready
                  </p>
                  <p className="mt-2 text-lg font-extrabold text-white sm:text-xl">
                    Apparel, signs, and print under one roof.
                  </p>
                </div>
                <div className="hidden rounded-xl border border-accent/35 bg-accent/12 px-4 py-3 text-right sm:block">
                  <p className="text-2xl font-black text-white">HG</p>
                  <p className="text-[0.62rem] font-bold uppercase tracking-widest text-white/52">
                    Bethlehem
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute right-5 top-5 rounded-2xl border border-white/12 bg-navy/68 px-4 py-3 shadow-2xl backdrop-blur-md">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/54">
              Quote Desk
            </p>
            <p className="mt-1 text-sm font-black text-white">Fast. Clean. Built tough.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
