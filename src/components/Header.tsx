import Image from "next/image";
import Link from "next/link";

const navItems = [
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Resources", href: "/#resources" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-5 py-3 sm:px-8 lg:px-10">
        <Link href="/" className="flex items-center gap-3 text-white">
          <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl border border-accent/45 bg-card p-1.5 shadow-glow sm:h-12 sm:w-12">
            <Image
              src="/images/logo.png"
              alt="Hue Graphics"
              width={80}
              height={80}
              priority
              className="h-full w-full object-contain"
            />
          </span>
          <span className="hidden text-base font-extrabold tracking-wide text-white sm:inline sm:text-lg">
            Hue Graphics
          </span>
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-white/68 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <a
            href="https://pay.hue.graphics/payinvoice"
            className="inline-flex rounded-xl border border-white/14 bg-white/[0.03] px-3 py-2.5 text-xs font-bold text-white/82 transition hover:border-accent/55 hover:bg-accent/10 sm:px-4 sm:text-sm"
          >
            Pay Invoice
          </a>
          <Link
            href="/quote-app"
            className="inline-flex rounded-xl border border-accent/45 bg-accent/10 px-3 py-2.5 text-xs font-extrabold text-white transition hover:border-accent hover:bg-accent/18 sm:px-4 sm:text-sm"
          >
            <span className="sm:hidden">Beta App</span>
            <span className="hidden sm:inline">BETA Quote App</span>
          </Link>
          <Link
            href="/request-a-quote"
            className="rounded-xl bg-accent px-3 py-2.5 text-xs font-extrabold text-white shadow-glow transition hover:bg-[#2a86d8] sm:px-5 sm:text-sm"
          >
            Request Quote
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10 bg-[#06101d]/88">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-5 py-2 text-xs font-bold text-white/66 sm:px-8 lg:px-10">
          <a
            href="https://www.google.com/maps/search/?api=1&query=741+Harry+McCarty+Road+Suite+101+Bethlehem+GA+30620"
            target="_blank"
            rel="noreferrer"
            className="min-w-0 truncate transition hover:text-white"
          >
            741 Harry McCarty Rd, Suite 101
          </a>
          <a
            href="tel:17708673520"
            className="shrink-0 rounded-lg border border-accent/35 bg-accent/10 px-3 py-1.5 text-white transition hover:border-accent hover:bg-accent/18"
          >
            Call (770) 867-3520
          </a>
        </div>
      </div>
    </header>
  );
}
