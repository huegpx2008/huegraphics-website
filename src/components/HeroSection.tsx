import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative flex min-h-svh overflow-hidden bg-navy pt-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(31,115,190,0.24),transparent_28rem),linear-gradient(135deg,rgba(8,17,31,0.96),rgba(8,17,31,0.78)_48%,rgba(8,17,31,0.94))]" />
      <div className="absolute inset-x-0 top-20 h-px bg-gradient-to-r from-transparent via-accent/45 to-transparent" />
      <div className="section-shell relative grid min-h-[calc(100svh-7rem)] items-center gap-10 py-10 lg:grid-cols-[0.92fr_1.08fr] lg:py-16">
        <div className="max-w-2xl">
          <p className="eyebrow">Built for brands, crews, and teams</p>
          <h1 className="mt-5 text-5xl font-black leading-[0.95] text-white sm:text-6xl lg:text-7xl xl:text-8xl">
            Custom Apparel.
            <span className="block text-white/90">Signs.</span>
            <span className="block text-accent">Printing.</span>
          </h1>
          <p className="mt-7 text-xl font-semibold text-white sm:text-2xl">
            Built in Bethlehem, Georgia.
          </p>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/70 sm:text-lg">
            Premium placeholder copy for a workshop-led creative partner,
            combining production discipline with polished visual execution.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#quote"
              className="rounded-full bg-accent px-7 py-4 text-center text-sm font-black text-white shadow-glow transition hover:bg-accent/85"
            >
              Request a Quote
            </a>
            <a
              href="#portfolio"
              className="rounded-full border border-white/18 px-7 py-4 text-center text-sm font-black text-white transition hover:border-accent/60 hover:bg-white/5"
            >
              View Our Work
            </a>
          </div>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            {["Apparel", "Signage", "Print"].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-accent/20 bg-card/55 px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.14em] text-white/70 shadow-glow"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 rounded-[2rem] border border-accent/20 bg-accent/5 blur-2xl" />
          <div className="glow-card relative overflow-hidden rounded-[2rem] p-2">
            <div className="relative aspect-[4/3] min-h-[360px] overflow-hidden rounded-[1.45rem] sm:min-h-[470px] lg:min-h-[590px]">
              <Image
                src="/images/placeholder-workshop.svg"
                alt="Industrial workshop placeholder for Hue Graphics production"
                fill
                priority
                sizes="(min-width: 1024px) 54vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/35 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-navy/55 via-transparent to-navy/18" />
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/12 bg-navy/70 p-4 backdrop-blur-md sm:bottom-7 sm:left-7 sm:right-auto sm:w-80 sm:p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
                  Quote-ready production
                </p>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  Placeholder visual system for apparel, signs, and print
                  workflows.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="#work"
            className="rounded-full bg-accent px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-accent/85"
          >
            View Work
          </a>
          <a
            href="#services"
            className="rounded-full border border-white/18 px-6 py-3 text-center text-sm font-bold text-white transition hover:border-accent/60 hover:bg-white/5"
          >
            Explore Services
          </a>
        </div>
      </div>
      <div className="glow-card overflow-hidden p-3">
        <Image
          src="/images/placeholder-hero.svg"
          alt="Abstract placeholder brand artwork"
          width={900}
          height={680}
          priority
          className="h-auto w-full rounded-xl"
        />
      </div>
    </section>
  );
}
