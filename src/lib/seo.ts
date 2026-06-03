import type { Metadata } from "next";

const siteUrl = "https://www.huegraphics.cc";
const defaultImage = "/images/logo.png";

type SeoMetadataInput = {
  title: string;
  description: string;
  path?: string;
};

export function createSeoMetadata({
  title,
  description,
  path = "/",
}: SeoMetadataInput): Metadata {
  const url = new URL(path, siteUrl).toString();

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url,
      siteName: "Hue Graphics & Apparel, LLC",
      images: [
        {
          url: defaultImage,
          width: 1200,
          height: 1200,
          alt: "Hue Graphics logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultImage],
    },
  };
}
