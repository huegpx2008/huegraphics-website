const services = [
  "Brand Identity",
  "Print Design",
  "Web Creative",
  "Marketing Collateral",
];

export function ServicesSection() {
  return (
    <section id="services" className="border-y border-white/10 bg-white/[0.02]">
      <div className="section-shell">
        <div className="max-w-2xl">
          <p className="eyebrow">Services</p>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            A flexible creative toolkit for launch, growth, and refresh work.
          </h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <article key={service} className="glow-card p-6">
              <div className="mb-6 h-12 w-12 rounded-2xl border border-accent/30 bg-accent/10" />
              <h3 className="text-xl font-bold text-white">{service}</h3>
              <p className="mt-3 text-sm leading-6 text-white/65">
                Placeholder service description with room for process, outcomes,
                and category-specific details.
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
