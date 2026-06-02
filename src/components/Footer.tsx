import Image from "next/image";

const services = [
  "Screen Printing",
  "Embroidery",
  "DTF Transfers",
  "Signs & Banners",
  "Vehicle Graphics",
  "Business Printing",
];

export function Footer() {
  return (
    <footer className="bg-[#050b14] px-5 pb-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl rounded-b-xl border-x border-b border-white/18 bg-[#08111f]">
        <div className="grid gap-8 px-6 py-8 sm:px-8 md:grid-cols-2 lg:grid-cols-[0.9fr_1fr_0.9fr_0.9fr] lg:px-10">
          <div>
            <Image
              src="/images/logo.png"
              alt="Hue Graphics"
              width={150}
              height={147}
              className="h-auto w-24 object-contain"
            />
            <div className="mt-5 flex gap-3 text-sm font-black text-white/72">
              <a href="#" className="transition hover:text-accent">FB</a>
              <a href="#" className="transition hover:text-accent">IG</a>
              <a href="#" className="transition hover:text-accent">YT</a>
            </div>
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-white">
              Contact us
            </p>
            <div className="mt-4 space-y-2 text-sm leading-6 text-[#b9c7d6]">
              <p>741 Harry McCarty Road</p>
              <p>Bethlehem, GA 30620</p>
              <p>
                <a href="tel:17708673520" className="transition hover:text-white">
                  (770) 867-3520
                </a>
              </p>
              <p>
                <a href="mailto:jason@huegraphics.cc" className="transition hover:text-white">
                  jason@huegraphics.cc
                </a>
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-white">
              Services
            </p>
            <div className="mt-4 grid gap-2 text-sm text-[#b9c7d6]">
              {services.map((service) => (
                <a key={service} href="/#services" className="transition hover:text-white">
                  {service}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-white">
              Company
            </p>
            <div className="mt-4 grid gap-2 text-sm text-[#b9c7d6]">
              <a href="/about" className="transition hover:text-white">Our Story</a>
              <a href="/#work" className="transition hover:text-white">Portfolio</a>
              <a href="/#contact" className="transition hover:text-white">Contact</a>
            </div>
            <a
              href="/#resources"
              className="mt-6 inline-flex rounded-lg border border-white/18 px-5 py-3 text-xs font-black uppercase tracking-wide text-white transition hover:border-accent hover:bg-accent/10"
            >
              Customer portal
            </a>
          </div>
        </div>
        <div className="border-t border-white/10 px-6 py-4 text-center text-xs text-white/44 sm:px-8 lg:px-10">
          © 2026 Hue Graphics. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
