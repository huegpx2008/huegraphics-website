export function CTASection() {
  return (
    <section id="contact" className="section-shell">
      <div className="glow-card overflow-hidden p-8 sm:p-10 lg:p-12">
        <div className="max-w-3xl">
          <p className="eyebrow">Next Step</p>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            Ready for the next version of Hue Graphics.
          </h2>
          <p className="mt-5 text-base leading-8 text-white/70">
            Placeholder call-to-action copy. Forms, APIs, and account features
            can be added later when the foundation is ready.
          </p>
        </div>
        <a
          href="mailto:hello@example.com"
          className="mt-8 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-bold text-white transition hover:bg-accent/85"
        >
          Email Placeholder
        </a>
      </div>
    </section>
  );
}
