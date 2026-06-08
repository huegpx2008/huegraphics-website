import Link from "next/link";

const quickLinks = [
  {
    title: "Online Catalog",
    description: "Browse apparel styles, colors, sizing, and product options.",
    href: "/custom-catalog",
  },
  {
    title: "Graduation Banners",
    description: "Jump straight to senior and graduation banner ordering.",
    href: "https://huegraphics.company.site/Senior-Graduation-Banners-c149396760",
    external: true,
  },
];

export function QuickLinksSection() {
  return (
    <section id="resources" className="bg-[#050b14] px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-xl border border-white/18 bg-white/12 shadow-[0_26px_90px_rgba(0,0,0,0.42)] lg:grid-cols-[1.12fr_0.88fr]">
        <a
          href="http://huegraphics.company.site/"
          target="_blank"
          rel="noreferrer"
          className="group relative overflow-hidden bg-[linear-gradient(135deg,#0a55d8,#0786ff)] p-6 shadow-[0_22px_70px_rgba(0,87,216,0.28)] sm:p-8 lg:p-10"
        >
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-white/16 blur-3xl transition group-hover:bg-white/22" />
          <p className="text-xs font-black uppercase tracking-[0.22em] text-white/76">
            Featured customer portal
          </p>
          <h2 className="relative mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-5xl font-black uppercase leading-[0.9] tracking-tight text-white sm:text-6xl">
            Shop Hue
          </h2>
          <p className="relative mt-5 max-w-xl text-base leading-7 text-white/88">
            Order ready-to-buy items, seasonal products, graduation banners, and
            active online store items.
          </p>
          <span className="relative mt-8 inline-flex rounded-lg bg-white/14 px-6 py-4 text-sm font-black uppercase tracking-wide text-white ring-1 ring-white/20 transition group-hover:bg-white/22">
            Start ordering -&gt;
          </span>
        </a>
        <div className="grid gap-px bg-white/12">
          {quickLinks.map((link) => {
            const className =
              "group bg-[#08111f] p-6 transition hover:bg-[#0b1728] sm:p-8";
            const content = (
              <>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-accent">
                  Quick link
                </p>
                <h3 className="mt-3 text-2xl font-black uppercase tracking-wide text-white">
                  {link.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#b9c7d6]">
                  {link.description}
                </p>
                <span className="mt-5 inline-flex text-lg font-black text-accent transition group-hover:translate-x-1 group-hover:text-white">
                  -&gt;
                </span>
              </>
            );

            return link.external ? (
              <a
                key={link.title}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={className}
              >
                {content}
              </a>
            ) : (
              <Link key={link.title} href={link.href} className={className}>
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
