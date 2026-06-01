export function StorySection() {
  return (
    <section id="story" className="border-y border-white/10 bg-white/[0.02]">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="eyebrow">Our Story</p>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            Built around thoughtful design and practical production.
          </h2>
        </div>
        <div className="glow-card p-7 sm:p-9">
          <p className="text-base leading-8 text-white/70 sm:text-lg">
            Placeholder story content for Hue Graphics. This space can grow into
            a studio overview, founder note, values section, or process
            narrative as the site develops.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {["Strategy", "Design", "Delivery"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 p-4">
                <p className="text-sm font-bold text-white">{item}</p>
                <p className="mt-2 text-xs leading-5 text-white/60">
                  Placeholder detail.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
