import Image from "next/image";
import Link from "next/link";

const navItems = [
  { label: "Services", href: "/#services" },
  { label: "Portfolio", href: "/#work" },
  { label: "About", href: "/about" },
  { label: "Resources", href: "/#resources" },
  { label: "Contact", href: "/#contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
        <Link href="/" className="flex items-center gap-3 text-white">
          <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-xl border border-accent/45 bg-card p-1.5 shadow-glow">
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
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="https://pay.hue.graphics/payinvoice"
            className="hidden rounded-xl border border-white/14 bg-white/[0.03] px-4 py-2.5 text-sm font-bold text-white/82 transition hover:border-accent/55 hover:bg-accent/10 sm:inline-flex"
          >
            Pay Invoice
          </a>
          <Link
            href="/#quote"
            className="rounded-xl bg-accent px-4 py-2.5 text-sm font-extrabold text-white shadow-glow transition hover:bg-[#2a86d8] sm:px-5"
          >
            Request a Quote
          </Link>
        </div>
      </div>
    </header>
  );
}
