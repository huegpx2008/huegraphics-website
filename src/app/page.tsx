import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import {
  HomeV2BrandWall,
  HomeV2CustomerWall,
  HomeV2FeaturedWork,
  HomeV2Hero,
  HomeV2Process,
  HomeV2ProductionVideo,
  HomeV2Services,
  HomeV2StoryStats,
  HomeV2Timeline,
  HomeV2TrustBar,
} from "@/components/HomeV2Sections";
import { QuickLinksSection } from "@/components/QuickLinksSection";
import { QuoteSection } from "@/components/QuoteSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { ServiceAreaSection } from "@/components/ServiceAreaSection";
import { WebsiteAnnouncementBanner } from "@/components/WebsiteAnnouncementBanner";
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
        <HomeV2Hero />
        <WebsiteAnnouncementBanner />
        <HomeV2TrustBar />
        <HomeV2BrandWall />
        <HomeV2ProductionVideo showIntro />
        <HomeV2Services />
        <HomeV2StoryStats />
        <HomeV2CustomerWall />
        <HomeV2FeaturedWork />
        <HomeV2Process />
        <ReviewsSection />
        <HomeV2Timeline />
        <ServiceAreaSection />
        <QuoteSection />
        <QuickLinksSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
