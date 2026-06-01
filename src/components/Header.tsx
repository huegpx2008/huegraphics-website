const navItems = [
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#work" },
  { label: "About", href: "#story" },
  { label: "Resources", href: "#resources" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
        <a href="#" className="flex items-center gap-3 text-white">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-accent/45 bg-card text-sm font-black shadow-glow">
            HG
          </span>
          <span className="text-base font-extrabold tracking-wide sm:text-lg">
            Hue Graphics
          </span>
        </a>
        <nav aria-label="Main navigation" className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-white/68 transition hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="#pay"
            className="hidden rounded-xl border border-white/14 bg-white/[0.03] px-4 py-2.5 text-sm font-bold text-white/82 transition hover:border-accent/55 hover:bg-accent/10 sm:inline-flex"
          >
            Pay Invoice
          </a>
          <a
            href="#contact"
            className="rounded-xl bg-accent px-4 py-2.5 text-sm font-extrabold text-white shadow-glow transition hover:bg-[#2a86d8] sm:px-5"
          >
            Request a Quote
          </a>
        </div>
      </div>
    </header>
  );
}
