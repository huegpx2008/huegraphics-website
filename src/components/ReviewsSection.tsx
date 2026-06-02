const reviews = [
  {
    name: "Kayla DeCant",
    text: "Amazing outcome and turnaround time. Hue Graphics made the process easy and the finished work looked great.",
  },
  {
    name: "Office Backup",
    text: "Jason was very helpful. Our company shirts look perfect and the quality was exactly what we needed.",
  },
  {
    name: "Local Customer",
    text: "Professional, responsive, and easy to work with. The final product was clean, sharp, and delivered with care.",
  },
];

const googleReviewsUrl =
  "https://www.google.com/search?q=hue+graphics+reviews";

export function ReviewsSection() {
  return (
    <section className="bg-[#050b14] px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-xl border border-white/18 bg-[linear-gradient(135deg,rgba(8,17,31,0.98),rgba(10,23,39,0.92))] shadow-[0_26px_90px_rgba(0,0,0,0.42)] lg:grid-cols-[0.85fr_1.15fr]">
        <div className="border-b border-white/12 p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
          <p className="eyebrow">Customer reviews</p>
          <div className="mt-5 flex items-end gap-4">
            <p className="font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-7xl font-black uppercase leading-none text-white sm:text-8xl">
              4.9
            </p>
            <div className="pb-2">
              <p className="text-xl font-black tracking-[0.12em] text-accent">
                5 STARS
              </p>
              <p className="mt-1 text-sm font-bold uppercase tracking-wide text-white/62">
                100+ Google reviews
              </p>
            </div>
          </div>
          <h2 className="mt-7 max-w-md font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-5xl">
            Trusted by local customers.
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-7 text-[#b9c7d6]">
            A few words from people who have trusted Hue Graphics with apparel,
            signs, vehicle graphics, and print work.
          </p>
          <a
            href={googleReviewsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex rounded-lg bg-accent px-6 py-3 text-sm font-black uppercase tracking-wide text-white shadow-[0_18px_36px_rgba(31,115,190,0.28)] transition hover:bg-[#2a86d8]"
          >
            Read reviews on Google
          </a>
        </div>
        <div className="grid gap-px bg-white/12 sm:grid-cols-3">
          {reviews.map((review) => (
            <article key={review.name} className="bg-[#08111f] p-6 sm:p-7">
              <p className="text-lg font-black tracking-[0.1em] text-accent">
                5 STARS
              </p>
              <p className="mt-5 text-sm leading-7 text-[#d8e3ee]">
                &quot;{review.text}&quot;
              </p>
              <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-white/58">
                {review.name}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
