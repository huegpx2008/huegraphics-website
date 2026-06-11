import type { CatalogProduct } from "@/data/sanmarCatalog.generated";

export const preferredCatalogSizes = ["S", "M", "L", "XL", "2XL", "3XL"];

function getBaseSizeOrder(product: CatalogProduct, colorSizes?: string[]) {
  return colorSizes?.length ? colorSizes : product.sizes.length ? product.sizes : preferredCatalogSizes;
}

export function getProductSizeOrder(
  product: CatalogProduct,
  colorSizes?: string[],
) {
  const normalized = getBaseSizeOrder(product, colorSizes);
  const preferred = preferredCatalogSizes.filter((size) =>
    normalized.includes(size),
  );
  const rest = normalized.filter((size) => !preferred.includes(size));

  return [...preferred, ...rest].slice(0, 8);
}

export function buildEmptyCatalogSizes(
  product: CatalogProduct,
  colorSizes?: string[],
) {
  return Object.fromEntries(
    getProductSizeOrder(product, colorSizes).map((size) => [size, "0"]),
  );
}

export function reconcileCatalogSizes(
  currentSizes: Record<string, string>,
  product: CatalogProduct,
  colorSizes: string[],
) {
  return Object.fromEntries(
    getProductSizeOrder(product, colorSizes).map((size) => [
      size,
      currentSizes[size] || "0",
    ]),
  );
}

export async function fetchCatalogColorSizes(style: string, color: string) {
  const params = new URLSearchParams({ style, color });
  const response = await fetch(`/api/catalog/color-sizes?${params.toString()}`);
  const data = (await response.json()) as { sizes?: string[] };

  if (!response.ok || !Array.isArray(data.sizes)) {
    return [];
  }

  return data.sizes.filter((size) => typeof size === "string" && size);
}
