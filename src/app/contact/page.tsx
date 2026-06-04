import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { QuoteSection } from "@/components/QuoteSection";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Contact Hue Graphics | Bethlehem, GA Print Shop",
  description:
    "Contact Hue Graphics & Apparel, LLC in Bethlehem, GA for screen printing, signs, banners, embroidery, DTF transfers, vehicle graphics, business printing, directions, hours, and quote requests.",
  path: "/contact",
});

const address = "741 Harry McCarty Rd, Suite 101, Bethlehem, GA 30620";
const directionsUrl =
  "https://www.google.com/maps/dir/?api=1&destination=741+Harry+McCarty+Rd+Suite+101+Bethlehem+GA+30620";
const mapUrl =
  "https://www.google.com/maps?q=741+Harry+McCarty+Rd+Suite+101+Bethlehem+GA+30620&output=embed";

const contactLinks = [
  { label: "Office", value: "(770) 867-3520", href: "tel:17708673520" },
  { label: "Office Mobile", value: "(678) 238-8913", href: "tel:16782388913" },
  { label: "Text", value: "(678) 238-8913", href: "sms:16782388913" },
  { label: "Email", value: "jason@huegraphics.cc", href: "mailto:jason@huegraphics.cc" },
  { label: "Website", value: "huegraphics.cc", href: "https://www.huegraphics.cc" },
];

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/huegpx" },
  { label: "Instagram", href: "https://www.instagram.com/huegpx" },
  {
    label: "Google Business",
    href: "https://www.google.com/search?q=Hue+Graphics+Bethlehem+GA",
  },
];

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="bg-[#f4f8fc]">
        <section className="relative isolate overflow-hidden px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_20%,rgba(31,115,190,0.16),transparent_28rem),linear-gradient(180deg,#ffffff,#f4f8fc)]" />
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="eyebrow">Contact Hue Graphics</p>
              <h1 className="mt-5 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-5xl font-black uppercase leading-[0.9] text-[#07111f] sm:text-7xl">
                Questions, quotes, directions.
              </h1>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-[#314154]">
              Reach the shop, find our Bethlehem location, send a general
              question, or jump straight into a quote request when you are ready
              to start a project.
            </p>
          </div>
        </section>

        <section className="px-5 pb-8 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-sm bg-[#c9d7e6] shadow-[0_24px_70px_rgba(7,17,31,0.12)] ring-1 ring-black/10 lg:grid-cols-[0.86fr_1.14fr]">
            <div className="bg-white p-6 sm:p-8">
              <p className="eyebrow">Shop info</p>
              <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.95] text-[#07111f] sm:text-5xl">
                Hue Graphics & Apparel.
              </h2>
              <div className="mt-7 h-1 w-16 rounded-full bg-accent" />
              <div className="mt-7 space-y-6 text-sm leading-7 text-[#314154]">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#536273]">
                    Address
                  </p>
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 block font-bold text-[#07111f] transition hover:text-accent"
                  >
                    {address}
                  </a>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#536273]">
                    Hours
                  </p>
                  <p className="mt-2 font-bold text-[#07111f]">Monday-Friday, 9:00 AM-5:00 PM</p>
                </div>
                <div className="grid gap-3">
                  {contactLinks.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="grid gap-1 rounded-md border border-black/10 bg-[#f4f8fc] p-4 transition hover:border-accent/50 hover:bg-accent/10"
                    >
                      <span className="text-xs font-black uppercase tracking-[0.18em] text-[#536273]">
                        {item.label}
                      </span>
                      <span className="font-bold text-[#07111f]">{item.value}</span>
                    </a>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#536273]">
                    Socials
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {socialLinks.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md border border-accent/35 bg-accent/10 px-4 py-2 text-xs font-black uppercase tracking-wide text-[#07111f] transition hover:border-accent hover:bg-accent hover:text-white"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative min-h-[420px] overflow-hidden bg-[#08111f]">
              <iframe
                title="Map to Hue Graphics"
                src={mapUrl}
                className="absolute inset-0 h-full w-full border-0 opacity-90"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,11,20,0.1),rgba(5,11,20,0.28))]" />
              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="absolute left-5 top-5 rounded-lg bg-[#06101d] px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white shadow-[0_18px_38px_rgba(0,0,0,0.38)] ring-1 ring-white/18 transition hover:bg-accent"
              >
                Get directions
              </a>
            </div>
          </div>
        </section>

        <section className="px-5 pb-8 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-sm bg-[#c9d7e6] shadow-[0_24px_70px_rgba(7,17,31,0.12)] ring-1 ring-black/10 lg:grid-cols-[0.38fr_1fr]">
            <div className="bg-white p-6 sm:p-8">
              <p className="eyebrow">General questions</p>
              <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.95] text-[#07111f] sm:text-5xl">
                Send us a message.
              </h2>
              <div className="mt-7 h-1 w-16 rounded-full bg-accent" />
              <p className="mt-7 text-sm leading-7 text-[#314154]">
                Use this for general questions, order follow-ups, or anything
                that does not need a full quote request.
              </p>
            </div>
            <ContactForm />
          </div>
        </section>

        <section className="px-5 pb-8 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <NewsletterSignup />
          </div>
        </section>

        <QuoteSection />

        <section className="bg-[#f4f8fc] px-5 pb-8 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl rounded-sm bg-white p-6 text-sm leading-7 text-[#314154] shadow-[0_18px_55px_rgba(7,17,31,0.1)] ring-1 ring-black/10 sm:p-8">
            <p className="font-bold text-[#07111f]">Prefer to talk now?</p>
            <p className="mt-2">
              Call the office at{" "}
              <Link href="tel:17708673520" className="font-bold text-[#07111f] hover:text-accent">
                (770) 867-3520
              </Link>{" "}
              or call/text Office Mobile at{" "}
              <Link href="tel:16782388913" className="font-bold text-[#07111f] hover:text-accent">
                (678) 238-8913
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
