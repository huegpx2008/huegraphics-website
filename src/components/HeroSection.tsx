import Image from "next/image";

export function HeroSection() {
  return (
    <section className="section-shell grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
      <div className="max-w-2xl">
        <p className="eyebrow">Design. Print. Digital.</p>
        <h1 className="mt-5 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
          Visual systems for brands that need to be seen clearly.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-8 text-white/70 sm:text-lg">
          Placeholder copy for Hue Graphics. Introduce the studio, the work, and
          the kind of creative partnership clients can expect.
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
