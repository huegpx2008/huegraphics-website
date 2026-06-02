import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { QuickLinksSection } from "@/components/QuickLinksSection";
import { QuoteSection } from "@/components/QuoteSection";
import { RecentWorkSection } from "@/components/RecentWorkSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { ServicesSection } from "@/components/ServicesSection";
import { StorySection } from "@/components/StorySection";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
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
