import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PortfolioShowcase } from "@/components/PortfolioShowcase";
import { homeWorkImages } from "@/data/homeWorkImages.generated";

export default function PortfolioPage() {
  return (
    <>
      <Header />
      <main>
        <PortfolioShowcase images={homeWorkImages} />
      </main>
      <Footer />
    </>
  );
}
