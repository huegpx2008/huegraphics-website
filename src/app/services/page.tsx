import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import {
  HomeV2CustomerWall,
  HomeV2Process,
  HomeV2ProductionVideo,
  HomeV2Services,
} from "@/components/HomeV2Sections";
import { QuoteSection } from "@/components/QuoteSection";
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
      <main className="bg-[#f4f8fc]">
        <section className="relative isolate overflow-hidden px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_20%,rgba(31,115,190,0.16),transparent_28rem),linear-gradient(180deg,#ffffff,#f4f8fc)]" />
          <div className="mx-auto max-w-7xl">
            <p className="eyebrow">Services</p>
            <h1 className="mt-5 max-w-4xl font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-5xl font-black uppercase leading-[0.9] text-[#07111f] sm:text-7xl">
              Printing, apparel, signs, and graphics under one roof.
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-[#314154]">
              Hue Graphics serves businesses, schools, churches, teams, and
              organizations across Bethlehem, Barrow County, Auburn, Winder,
              Statham, Monroe, Braselton, Hoschton, Jefferson, Commerce, and
              Northeast Georgia.
            </p>
          </div>
        </section>
        <HomeV2ProductionVideo />
        <HomeV2Services showExploreLink={false} />
        <HomeV2Process />
        <HomeV2CustomerWall />
        <QuoteSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
