const mailchimpAction =
  "https://huegraphics.us5.list-manage.com/subscribe/post?u=43dffcb44a922f23938c7f5c7&id=d1a21b8be4&f_id=00a0beedf0";

export function NewsletterSignup() {
  return (
    <form
      action={mailchimpAction}
      method="post"
      target="_blank"
      className="rounded-xl border border-white/18 bg-[#08111f] p-6 sm:p-8"
    >
      <p className="eyebrow">Email updates</p>
      <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-5xl">
        Join the Hue list.
      </h2>
      <p className="mt-5 max-w-2xl text-sm leading-7 text-[#b9c7d6]">
        New customers get $20 off their first order. Sign up for occasional
        updates, offers, and shop news.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          name="EMAIL"
          required
          placeholder="Email address*"
          className="min-w-0 flex-1 rounded-lg border border-white/14 bg-white/[0.04] px-4 py-4 text-sm text-white outline-none transition placeholder:text-[#b9c7d6]/70 focus:border-accent"
        />
        <input
          type="text"
          name="b_43dffcb44a922f23938c7f5c7_d1a21b8be4"
          tabIndex={-1}
          aria-hidden="true"
          className="hidden"
        />
        <button
          type="submit"
          className="rounded-lg bg-accent px-7 py-4 text-sm font-black uppercase tracking-wide text-white shadow-[0_18px_36px_rgba(31,115,190,0.28)] transition hover:bg-[#2a86d8]"
        >
          Subscribe
        </button>
      </div>
    </form>
  );
}
