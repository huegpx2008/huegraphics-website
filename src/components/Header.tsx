const navItems = [
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "About", href: "#about" },
  { label: "Resources", href: "#resources" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-navy/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
        <a href="#" className="flex items-center gap-3 text-white">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-accent/40 bg-accent/15 text-sm font-black shadow-glow">
            HG
          </span>
          <span className="text-base font-bold sm:text-lg">Hue Graphics</span>
        </a>
        <nav aria-label="Main navigation" className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-white/70 transition hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="#invoice"
            className="hidden rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-white/85 transition hover:border-accent/55 hover:bg-white/5 sm:inline-flex"
          >
            Pay Invoice
          </a>
          <a
            href="#quote"
            className="rounded-full border border-accent/50 bg-accent px-4 py-2 text-sm font-bold text-white shadow-glow transition hover:bg-accent/85 sm:px-5"
          >
            Request a Quote
          </a>
        </div>
      </div>
    </header>
  );
}
