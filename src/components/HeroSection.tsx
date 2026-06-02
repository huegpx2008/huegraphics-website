import Image from "next/image";

export function HeroSection() {
  return (
    <section className="hero-shell relative isolate min-h-[calc(100svh-73px)] overflow-hidden bg-[#03070d]">
      <Image
        src="/images/press.png"
        alt="Industrial screen printing press on the Hue Graphics production floor"
        fill
        priority
        sizes="100vw"
        className="absolute -top-[4%] right-0 -z-30 h-[108%] w-full object-cover object-[62%_54%] opacity-100 md:-top-[8%] md:h-[112%] md:w-[86%] md:object-contain md:object-right lg:w-[78%]"
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(0,0,0,0.98)_0%,rgba(3,7,13,0.92)_31%,rgba(3,7,13,0.46)_59%,rgba(2,5,10,0.68)_100%)]" />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(0,0,0,0.44)_0%,rgba(3,7,13,0.02)_40%,rgba(3,7,13,0.97)_100%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.09] [background-image:linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:76px_76px]" />
      <div className="absolute left-0 top-0 -z-10 h-full w-28 bg-[linear-gradient(90deg,#000,transparent)]" />
      <div className="absolute right-0 top-12 -z-10 h-[34rem] w-2/3 bg-[radial-gradient(ellipse_at_center,rgba(31,115,190,0.2),transparent_70%)] blur-2xl" />

      <div className="mx-auto flex min-h-[calc(100svh-73px)] w-full max-w-7xl flex-col justify-center px-5 py-12 sm:px-8 lg:px-10">
        <div className="max-w-3xl pt-8 sm:pt-12 lg:pt-8">
          <Image
            src="/images/logo.png"
            alt="Hue Graphics"
            width={180}
            height={177}
            priority
            className="mb-8 h-auto w-24 object-contain sm:w-28 lg:w-32"
          />
          <p className="eyebrow">Premium production for brands, crews, and fleets</p>
          <h1 className="mt-5 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-6xl font-black uppercase leading-[0.84] tracking-tight text-white sm:text-7xl lg:text-8xl xl:text-9xl">
            Custom
            <span className="block">Apparel.</span>
            <span className="block">Signs.</span>
            <span className="block text-accent">Printing.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg font-semibold leading-8 text-white/82 sm:text-xl">
            Built in Bethlehem, Georgia with in-house equipment, disciplined
            production, and finish quality made for real-world use.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#quote"
              className="rounded-lg bg-accent px-7 py-4 text-center text-sm font-black uppercase tracking-wide text-white shadow-[0_18px_36px_rgba(31,115,190,0.34)] transition hover:bg-[#2a86d8]"
            >
              Request a Quote -&gt;
            </a>
            <a
              href="#work"
              className="rounded-lg border border-white/28 bg-black/28 px-7 py-4 text-center text-sm font-black uppercase tracking-wide text-white backdrop-blur-sm transition hover:border-accent/70 hover:bg-accent/10"
            >
              View Our Work -&gt;
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
