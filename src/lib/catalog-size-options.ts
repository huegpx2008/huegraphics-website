import type { CatalogProduct } from "@/data/sanmarCatalog.generated";

export const preferredCatalogSizes = ["S", "M", "L", "XL", "2XL", "3XL"];
const fallbackSizeOrder = [
  "XXS",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "2XL",
  "3XL",
  "4XL",
  "5XL",
  "6XL",
];

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

  return [...preferred, ...rest];
}

export function sortCatalogSizes(sizes: string[]) {
  return [...sizes].sort((a, b) => {
    const aIndex = fallbackSizeOrder.indexOf(a.toUpperCase());
    const bIndex = fallbackSizeOrder.indexOf(b.toUpperCase());

    if (aIndex !== -1 || bIndex !== -1) {
      return (
        (aIndex === -1 ? fallbackSizeOrder.length : aIndex) -
        (bIndex === -1 ? fallbackSizeOrder.length : bIndex)
      );
    }

    return a.localeCompare(b, undefined, { numeric: true });
  });
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

  return sortCatalogSizes(
    data.sizes.filter((size) => typeof size === "string" && size),
  );
}

export function selectedCatalogSizeQuantities(
  sizes: Record<string, string | number>,
) {
  return Object.fromEntries(
    Object.entries(sizes)
      .map(([size, quantity]) => [
        size,
        Math.max(0, Math.floor(Number(quantity || 0))),
      ] as const)
      .filter(([, quantity]) => quantity > 0),
  ) as Record<string, number>;
}
