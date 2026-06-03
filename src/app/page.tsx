import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { QuickLinksSection } from "@/components/QuickLinksSection";
import { QuoteSection } from "@/components/QuoteSection";
import { RecentWorkSection } from "@/components/RecentWorkSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { ServiceAreaSection } from "@/components/ServiceAreaSection";
import { ServicesSection } from "@/components/ServicesSection";
import { StorySection } from "@/components/StorySection";
import { createSeoMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = createSeoMetadata({
  title:
    "Hue Graphics & Apparel, LLC | Screen Printing, Signs & Custom Apparel in Bethlehem, GA",
  description:
    "Hue Graphics is a family-owned print shop in Bethlehem, GA serving Barrow County and Northeast Georgia with screen printing, embroidery, DTF transfers, DTG printing, signs, banners, vehicle graphics, and business printing.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <ServiceAreaSection />
        <RecentWorkSection />
        <ReviewsSection />
        <StorySection />
        <QuoteSection />
        <QuickLinksSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
