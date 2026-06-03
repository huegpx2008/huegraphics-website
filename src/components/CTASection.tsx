export function CTASection() {
  return (
    <section id="contact" className="bg-[#050b14] px-5 pt-0 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-t-xl border-x border-t border-white/18 bg-[linear-gradient(135deg,#0a55d8,#0786ff)] shadow-[0_22px_70px_rgba(0,87,216,0.28)]">
        <div className="flex flex-col gap-6 px-6 py-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div>
            <p className="font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-3xl font-black uppercase leading-none text-white">
              Ready to get started?
            </p>
            <p className="mt-2 text-sm leading-6 text-white/86">
              Tell us about your project and we will make it happen.
            </p>
          </div>
          <a
            href="/request-a-quote"
            className="inline-flex w-fit rounded-lg bg-white/12 px-7 py-4 text-sm font-black uppercase tracking-wide text-white ring-1 ring-white/18 transition hover:bg-white/20"
          >
            Request a quote -&gt;
          </a>
        </div>
      </div>
    </section>
  );
}
