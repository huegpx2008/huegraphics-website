import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { FloatingQuoteBasket } from "@/components/FloatingQuoteBasket";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.huegraphics.cc"),
  title: {
    default:
      "Hue Graphics & Apparel, LLC | Custom Printing in Bethlehem, GA",
    template: "%s | Hue Graphics",
  },
  description:
    "Family-owned print shop in Bethlehem, GA serving Barrow County and Northeast Georgia with screen printing, embroidery, signs, banners, vehicle graphics, DTF transfers, DTG printing, and business printing.",
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "Store"],
  "@id": "https://www.huegraphics.cc/#localbusiness",
  name: "Hue Graphics & Apparel, LLC",
  url: "https://www.huegraphics.cc",
  telephone: "+1-770-867-3520",
  foundingDate: "2013",
  description:
    "Family-owned and operated local print shop, custom apparel shop, and sign shop in Bethlehem, Georgia serving businesses, schools, churches, teams, and organizations across Barrow County and Northeast Georgia.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "741 Harry McCarty Road, Suite 101",
    addressLocality: "Bethlehem",
    addressRegion: "GA",
    postalCode: "30620",
    addressCountry: "US",
  },
  areaServed: [
    "Bethlehem, GA",
    "Barrow County",
    "Auburn, GA",
    "Winder, GA",
    "Statham, GA",
    "Monroe, GA",
    "Braselton, GA",
    "Hoschton, GA",
    "Jefferson, GA",
    "Commerce, GA",
    "Northeast Georgia",
  ],
  makesOffer: [
    "Screen printing",
    "Embroidery",
    "DTF transfers",
    "DTG printing",
    "Signs",
    "Banners",
    "Vehicle graphics",
    "Business printing",
    "Promotional products",
  ].map((service) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: service,
    },
  })),
  sameAs: [
    "https://www.facebook.com/huegpx",
    "https://www.instagram.com/huegpx",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        {children}
        <FloatingQuoteBasket />
      </body>
    </html>
  );
}
