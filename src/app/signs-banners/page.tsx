import Image from "next/image";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RandomImageGallery } from "@/components/RandomImageGallery";

const products = [
  "Vinyl banners",
  "Yard signs",
  "Real estate signs",
  "A-frame inserts",
  "Coroplast signs",
  "Aluminum signs",
  "Window decals",
  "Storefront graphics",
  "Event signage",
  "Graduation banners",
  "Directional signs",
  "Custom decals",
];

const materials = [
  "Indoor and outdoor vinyl",
  "Coroplast",
  "Aluminum composite",
  "Adhesive vinyl",
  "Banner stands and displays",
  "Sign stakes and hardware",
];

const gallery = [
  "618657266_18555735766009873_133435053101636559_n.jpg",
  "639531227_18569535229009873_1734010140289635921_n.jpg",
  "639985671_18569535244009873_4983119230006870802_n.jpg",
  "642470483_18571217428009873_4887144359931898686_n.jpg",
  "645501324_18571217419009873_5145212769391887043_n.jpg",
  "672444216_18584145094009873_5071688867988805225_n.jpg",
].map((image) => `/images/sign-banners/${image}`);

export default function SignsBannersPage() {
  return (
    <>
      <Header />
      <main className="bg-[#050b14]">
        <section className="relative isolate overflow-hidden px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <Image
            src="/images/banners.png"
            alt="Large format banner production at Hue Graphics"
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 -z-20 h-full w-full object-cover opacity-72"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(2,8,20,0.98),rgba(2,8,20,0.82)_38%,rgba(2,8,20,0.42)),linear-gradient(180deg,rgba(2,8,20,0.3),#050b14)]" />
          <div className="mx-auto max-w-7xl">
            <p className="eyebrow">Signs & banners</p>
            <h1 className="mt-5 max-w-3xl font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-5xl font-black uppercase leading-[0.9] tracking-tight text-white sm:text-7xl">
              Clear signs for storefronts, events, schools, and job sites.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#d6e3f0]">
              From quick yard signs to durable outdoor banners and custom
              storefront graphics, Hue Graphics helps you get noticed with clean
              production and practical material recommendations.
            </p>
            <a
              href="/#quote"
              className="mt-9 inline-flex rounded-lg bg-accent px-7 py-4 text-sm font-black uppercase tracking-wide text-white shadow-[0_18px_36px_rgba(31,115,190,0.34)] transition hover:bg-[#2a86d8]"
            >
              Request sign pricing -&gt;
            </a>
          </div>
        </section>

        <section className="px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-xl border border-white/18 bg-white/12 shadow-[0_26px_90px_rgba(0,0,0,0.42)] lg:grid-cols-[0.85fr_1.15fr]">
            <div className="bg-[linear-gradient(145deg,#08111f,#06101d)] p-6 sm:p-8">
              <p className="eyebrow">What we make</p>
              <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-5xl">
                Practical signage, produced in-house.
              </h2>
              <p className="mt-7 text-sm leading-7 text-[#b9c7d6]">
                Bring your logo, layout, or rough idea. We can help size the
                project, choose the right material, and get your sign ready for
                the way it will actually be used.
              </p>
            </div>
            <div className="grid gap-px bg-white/12 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div key={product} className="bg-[#08111f] p-5">
                  <div className="mb-4 h-1.5 w-12 rounded-full bg-accent" />
                  <p className="text-sm font-black uppercase tracking-wide text-white">
                    {product}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="rounded-xl border border-white/18 bg-[#08111f] p-6 sm:p-8">
              <p className="eyebrow">Materials & uses</p>
              <div className="mt-6 grid gap-3">
                {materials.map((material) => (
                  <div
                    key={material}
                    className="rounded-lg border border-white/12 bg-white/[0.04] px-4 py-3 text-sm font-bold text-[#d6e3f0]"
                  >
                    {material}
                  </div>
                ))}
              </div>
            </div>
            <RandomImageGallery folder="sign-banners" fallbackImages={gallery} />
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  );
}
