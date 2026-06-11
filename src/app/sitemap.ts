import type { MetadataRoute } from "next";
import { sanmarCatalogProducts } from "@/data/sanmarCatalog.generated";
import { siteUrl } from "@/lib/site-url";

const staticRoutes = [
  "",
  "/screen-printing",
  "/screen-printing/color-guide",
  "/embroidery",
  "/dtf-transfers",
  "/signs-banners",
  "/business-printing",
  "/vehicle-graphics",
  "/custom-catalog",
  "/services",
  "/portfolio",
  "/about",
  "/resources",
  "/contact",
  "/request-a-quote",
  "/quote-app",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const staticEntries = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/custom-catalog" ? 0.9 : 0.8,
  })) satisfies MetadataRoute.Sitemap;

  const productEntries = sanmarCatalogProducts.map((product) => ({
    url: `${siteUrl}/custom-catalog/${encodeURIComponent(product.style)}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  })) satisfies MetadataRoute.Sitemap;

  return [...staticEntries, ...productEntries];
}
