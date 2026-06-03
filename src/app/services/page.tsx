import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ServicesSection } from "@/components/ServicesSection";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Services | Custom Apparel, Signs & Printing in Bethlehem, GA",
  description:
    "Explore Hue Graphics services including screen printing, embroidery, DTF transfers, DTG printing, signs, banners, vehicle graphics, business printing, and promotional products for Northeast Georgia.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="bg-[#050b14]">
        <section className="px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <p className="eyebrow">Services</p>
            <h1 className="mt-5 max-w-4xl font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-5xl font-black uppercase leading-[0.9] tracking-tight text-white sm:text-7xl">
              Printing, apparel, signs, and graphics under one roof.
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-[#b9c7d6]">
              Hue Graphics serves businesses, schools, churches, teams, and
              organizations across Bethlehem, Barrow County, Auburn, Winder,
              Statham, Monroe, Braselton, Hoschton, Jefferson, Commerce, and
              Northeast Georgia.
            </p>
          </div>
        </section>
        <ServicesSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
