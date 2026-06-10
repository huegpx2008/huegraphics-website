"use client";

import Link from "next/link";
import { useState } from "react";
import { LogoEasterEgg } from "./LogoEasterEgg";

const navItems = [
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
];

const serviceLinks = [
  { label: "All Services", href: "/services" },
  { label: "Screen Printing", href: "/screen-printing" },
  { label: "Embroidery", href: "/embroidery" },
  { label: "DTF Transfers", href: "/dtf-transfers" },
  { label: "Signs & Banners", href: "/signs-banners" },
  { label: "Vehicle Graphics", href: "/vehicle-graphics" },
  { label: "Business Printing", href: "/business-printing" },
];

export function Header() {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 px-4 py-2.5 sm:gap-3 sm:px-8 lg:px-10 lg:py-3">
        <LogoEasterEgg />
        <nav aria-label="Main navigation" className="hidden items-center gap-7 lg:flex">
          <div
            className="relative"
            onMouseEnter={() => setIsServicesOpen(true)}
            onMouseLeave={() => setIsServicesOpen(false)}
            onPointerEnter={() => setIsServicesOpen(true)}
            onPointerLeave={() => setIsServicesOpen(false)}
            onFocus={() => setIsServicesOpen(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setIsServicesOpen(false);
              }
            }}
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-1 py-3 text-sm font-semibold text-white/68 transition hover:text-white"
            >
              Services
              <span className="text-[0.65rem] text-accent">v</span>
            </Link>
            <div
              className={[
                "absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-3 transition duration-150",
                isServicesOpen
                  ? "visible opacity-100"
                  : "invisible opacity-0",
              ].join(" ")}
            >
              <div className="overflow-hidden rounded-sm bg-white shadow-[0_24px_70px_rgba(0,0,0,0.28)] ring-1 ring-black/10">
                {serviceLinks.map((service) => (
                  <Link
                    key={service.href}
                    href={service.href}
                    className="group/item flex items-center justify-between border-b border-black/8 px-4 py-3 text-sm font-black uppercase tracking-wide text-[#07111f] transition last:border-b-0 hover:bg-[#f4f8fc] hover:text-accent"
                  >
                    {service.label}
                    <span className="text-accent transition group-hover/item:translate-x-1">
                      -&gt;
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
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
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <a
            href="https://pay.hue.graphics/payinvoice"
            className="inline-flex min-h-11 items-center rounded-xl border border-white/14 bg-white/[0.03] px-2.5 text-[0.68rem] font-bold text-white/82 transition hover:border-accent/55 hover:bg-accent/10 sm:px-4 sm:text-sm"
          >
            Pay Invoice
          </a>
          <a
            href="http://huegraphics.company.site/"
            className="inline-flex min-h-11 items-center rounded-xl bg-accent px-2.5 text-[0.68rem] font-extrabold text-white shadow-glow transition hover:bg-[#2a86d8] sm:px-4 sm:text-sm"
          >
            Shop Hue
          </a>
          <Link
            href="/request-a-quote"
            className="hidden min-h-11 items-center rounded-xl bg-accent px-3 text-xs font-extrabold text-white shadow-glow transition hover:bg-[#2a86d8] sm:inline-flex sm:px-5 sm:text-sm"
          >
            Request Quote
          </Link>
          <button
            type="button"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-white/14 bg-white/[0.04] px-3 text-xs font-black uppercase tracking-wide text-white transition hover:border-accent/55 hover:bg-accent/10 lg:hidden"
          >
            {isMobileMenuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      {isMobileMenuOpen ? (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="border-t border-white/10 bg-[#06101d] px-4 py-4 lg:hidden"
        >
          <div className="mx-auto grid max-w-7xl gap-4">
            <div className="grid gap-2">
              <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-accent">
                Services
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {serviceLinks.map((service) => (
                  <Link
                    key={service.href}
                    href={service.href}
                    onClick={closeMobileMenu}
                    className="flex min-h-11 items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-4 text-sm font-black uppercase tracking-wide text-white transition hover:border-accent hover:bg-accent/10"
                  >
                    {service.label}
                    <span className="text-accent">-&gt;</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="grid gap-2 border-t border-white/10 pt-4 sm:grid-cols-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="flex min-h-11 items-center rounded-lg border border-white/10 px-4 text-sm font-bold text-white/82 transition hover:border-accent hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <a
                href="http://huegraphics.company.site/"
                onClick={closeMobileMenu}
                className="flex min-h-11 items-center rounded-lg border border-accent/35 bg-accent/10 px-4 text-sm font-bold text-white transition hover:border-accent sm:hidden"
              >
                Shop Hue
              </a>
            </div>
          </div>
        </nav>
      ) : null}
      <div className="border-t border-white/10 bg-[#06101d]/88">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 px-4 py-2 text-[0.7rem] font-bold text-white/66 sm:gap-3 sm:px-8 sm:text-xs lg:px-10">
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
            className="inline-flex min-h-10 shrink-0 items-center rounded-lg border border-accent/35 bg-accent/10 px-3 text-white transition hover:border-accent hover:bg-accent/18"
          >
            Call (770) 867-3520
          </a>
        </div>
      </div>
    </header>
  );
}
