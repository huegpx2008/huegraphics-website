const serviceKeywords = [
  "Screen printing",
  "Custom T-shirts",
  "Hoodies",
  "Team uniforms",
  "Embroidery",
  "Hats",
  "Polos",
  "Workwear",
  "DTF transfers",
  "DTG printing",
  "Signs",
  "Banners",
  "Yard signs",
  "Storefront graphics",
  "Vehicle graphics",
  "Truck lettering",
  "Trailer decals",
  "Business cards",
  "Flyers",
  "Stickers",
  "Labels",
  "Promotional products",
];

const serviceAreas = [
  "Bethlehem, GA",
  "Barrow County",
  "Auburn, GA",
  "Winder, GA",
  "Statham, GA",
  "Monroe, GA",
  "Braselton, GA",
  "Hoschton, GA",
  "Jefferson, GA",
  "Commerce, GA",
  "Northeast Georgia",
];

export function ServiceAreaSection() {
  return (
    <section className="bg-[#050b14] px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-xl border border-white/18 bg-white/12 shadow-[0_26px_90px_rgba(0,0,0,0.42)] lg:grid-cols-[0.38fr_1fr]">
        <div className="bg-[linear-gradient(145deg,#08111f,#06101d)] p-6 sm:p-8">
          <p className="eyebrow">Local service area</p>
          <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-5xl">
            Printing for Northeast Georgia.
          </h2>
          <div className="mt-7 h-1 w-16 rounded-full bg-accent" />
          <p className="mt-7 text-sm leading-7 text-[#b9c7d6]">
            Hue Graphics helps Georgia businesses, schools, churches, teams,
            organizations, contractors, and event planners with custom apparel,
            signs, graphics, and everyday printing.
          </p>
        </div>
        <div className="grid gap-px bg-white/12 md:grid-cols-2">
          <div className="bg-[#08111f] p-6 sm:p-8">
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-white">
              Services we produce
            </h3>
            <div className="mt-5 flex flex-wrap gap-2">
              {serviceKeywords.map((service) => (
                <span
                  key={service}
                  className="rounded-lg border border-white/12 bg-white/[0.04] px-3 py-2 text-xs font-bold text-[#d6e3f0]"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-[#08111f] p-6 sm:p-8">
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-white">
              Areas we serve
            </h3>
            <div className="mt-5 flex flex-wrap gap-2">
              {serviceAreas.map((area) => (
                <span
                  key={area}
                  className="rounded-lg border border-accent/25 bg-accent/10 px-3 py-2 text-xs font-bold text-white"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
