import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PortfolioShowcase } from "@/components/PortfolioShowcase";
import { homeWorkImages } from "@/data/homeWorkImages.generated";
import { getAllCloudinaryGalleryImages } from "@/lib/cloudinary-public-gallery";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Portfolio | Hue Graphics Projects in Northeast Georgia",
  description:
    "See Hue Graphics work including custom apparel, screen printing, embroidery, signs, banners, vehicle graphics, DTF transfers, and print projects from Bethlehem and Northeast Georgia.",
  path: "/portfolio",
});

export const revalidate = 300;

export default async function PortfolioPage() {
  const cloudinaryImages = (await getAllCloudinaryGalleryImages()).map(
    (image) => image.src,
  );
  const portfolioImages = [...cloudinaryImages, ...homeWorkImages];

  return (
    <>
      <Header />
      <main>
        <PortfolioShowcase images={portfolioImages} />
      </main>
      <Footer />
    </>
  );
}
