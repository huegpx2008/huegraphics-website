import Image from "next/image";

export function StorySection() {
  return (
    <section id="story" className="bg-[#050b14] px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-xl border border-white/18 bg-[linear-gradient(135deg,rgba(8,17,31,0.98),rgba(10,23,39,0.92))] shadow-[0_26px_90px_rgba(0,0,0,0.42)] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative min-h-[340px] overflow-hidden lg:min-h-[460px]">
          <Image
            src="/images/store-2.png"
            alt="Hue Graphics storefront at 741 Harry McCarty Road in Bethlehem, Georgia"
            fill
            sizes="(min-width: 1024px) 52vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,17,31,0.08),rgba(8,17,31,0.36)),linear-gradient(180deg,transparent_45%,rgba(8,17,31,0.84))]" />
        </div>
        <div className="p-6 sm:p-8 lg:p-10">
          <p className="eyebrow">Our story</p>
          <h2 className="mt-4 max-w-md font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-5xl">
            Family owned. Locally trusted.
          </h2>
          <div className="mt-6 h-1 w-14 rounded-full bg-accent" />
          <p className="mt-7 text-base leading-8 text-[#b9c7d6]">
            Our name carries a family story, and that same care shows up in how
            we treat people. Every customer is met with respect, honesty, and
            the kind of service we would want for our own friends and family.
          </p>
          <p className="mt-5 text-base leading-8 text-[#b9c7d6]">
            From our early days in Auburn to our expanded Bethlehem shop, we
            have grown by keeping the work practical, the communication honest,
            and the finished product something people are proud to put their
            name on. Many customers become friends, and that is something we are
            proud of.
          </p>
          <a
            href="/about"
            className="mt-8 inline-flex rounded-lg border border-white/18 px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:border-accent hover:bg-accent/10"
          >
            Learn more -&gt;
          </a>
          <div className="mt-8 rounded-lg border border-white/14 bg-white/[0.04] p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-accent">
              Visit us
            </p>
            <p className="mt-2 text-lg font-black text-white">
              741 Harry McCarty Road, Suite 101
            </p>
            <p className="text-sm leading-6 text-[#b9c7d6]">
              Bethlehem, Georgia 30620
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
