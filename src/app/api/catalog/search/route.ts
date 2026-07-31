import { NextResponse } from "next/server";
import { sanmarCatalogProducts } from "@/data/sanmarCatalog.generated";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim().toLowerCase().slice(0, 120);
  const requestedLimit = Number.parseInt(searchParams.get("limit") || "20", 10);
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(20, Math.max(1, requestedLimit))
    : 20;

  if (query.length < 2) {
    return NextResponse.json({ products: [] });
  }

  const terms = query.split(/\s+/).filter(Boolean);
  const products = sanmarCatalogProducts
    .map((product) => {
      const searchable = [
        product.style,
        product.title,
        product.brand,
        product.category,
        product.subcategory,
        ...product.colors.map((color) => color.name),
      ].join(" ").toLowerCase();

      if (!terms.every((term) => searchable.includes(term))) return null;

      const normalizedStyle = product.style.toLowerCase();
      const exactStyle = normalizedStyle === query ? 100 : 0;
      const styleTerm = terms.some((term) => normalizedStyle === term) ? 60 : 0;
      const startsStyle = terms.some((term) => normalizedStyle.startsWith(term)) ? 40 : 0;
      const titleMatch = product.title.toLowerCase().includes(query) ? 20 : 0;
      return { product, score: exactStyle + styleTerm + startsStyle + titleMatch };
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
    .sort((a, b) => b.score - a.score || a.product.style.localeCompare(b.product.style))
    .slice(0, limit)
    .map(({ product }) => ({
      style: product.style,
      title: product.title,
      brand: product.brand,
      category: product.category,
      image: product.image,
      backImage: product.backImage,
      colors: product.colors.map((color) => ({
        name: color.name,
        thumbnailImage: color.thumbnailImage,
        sizes: color.sizes,
      })),
    }));

  return NextResponse.json(
    { products },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } },
  );
}
