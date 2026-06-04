const mailchimpAction =
  "https://huegraphics.us5.list-manage.com/subscribe/post?u=43dffcb44a922f23938c7f5c7&id=d1a21b8be4&f_id=00a0beedf0";

export function NewsletterSignup() {
  return (
    <form
      action={mailchimpAction}
      method="post"
      target="_blank"
      className="rounded-sm bg-white p-6 shadow-[0_18px_55px_rgba(7,17,31,0.1)] ring-1 ring-black/10 sm:p-8"
    >
      <p className="eyebrow">Email updates</p>
      <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.95] text-[#07111f] sm:text-5xl">
        Join the Hue list.
      </h2>
      <p className="mt-5 max-w-2xl text-sm leading-7 text-[#314154]">
        New customers get $20 off their first order. Sign up for occasional
        updates, offers, and shop news.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          name="EMAIL"
          required
          placeholder="Email address*"
          className="min-w-0 flex-1 rounded-md border border-black/10 bg-[#f4f8fc] px-4 py-4 text-sm text-[#07111f] outline-none transition placeholder:text-[#536273]/70 focus:border-accent"
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
