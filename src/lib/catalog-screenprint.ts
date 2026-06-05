import type { CatalogProduct } from "@/data/sanmarCatalog.generated";

export const screenPrintMinimumQuantity = 24;

export type ScreenPrintRecommendation = {
  canEstimate: boolean;
  method: "screenprint" | "embroidery" | "dtf";
  label: string;
  message: string;
};

const infantSizePattern = /^(0003|0306|0612|1218|1824|2t|3t|4t|5t|nb)$/i;

function productText(product: CatalogProduct) {
  return [
    product.title,
    product.category,
    product.subcategory,
    product.description,
    product.availableSizes,
  ]
    .join(" ")
    .toLowerCase();
}

export function getScreenPrintRecommendation(
  product: CatalogProduct,
): ScreenPrintRecommendation {
  const text = productText(product);
  const hasInfantOrToddlerSize = product.sizes.some((size) =>
    infantSizePattern.test(size.trim()),
  );
  const isInfantOrToddler =
    product.category === "Infant & Toddler" ||
    hasInfantOrToddlerSize ||
    /\binfant\b|\btoddler\b|\bbaby\b/.test(text);

  if (isInfantOrToddler) {
    return {
      canEstimate: false,
      method: "dtf",
      label: "Recommend DTF",
      message:
        "This style is smaller than our screen printing minimum size. DTF is usually the better option.",
    };
  }

  const isYouthScreenPrintFriendly =
    product.category === "Youth" &&
    /\btee\b|\bt-shirt\b|\btshirt\b|\bhoodie\b|\bhooded\b|\bsweatshirt\b/.test(
      text,
    );
  const isScreenPrintFriendly =
    product.category === "T-Shirts" ||
    product.category === "Sweatshirts/Fleece" ||
    isYouthScreenPrintFriendly;

  if (!isScreenPrintFriendly) {
    return {
      canEstimate: false,
      method: "embroidery",
      label: "Recommend embroidery",
      message:
        "This style is not a great fit for screen printing. Embroidery is usually better for this item.",
    };
  }

  return {
    canEstimate: true,
    method: "screenprint",
    label: "Screen print ready",
    message:
      "This style is a good fit for screen printing at 24 pieces or more.",
  };
}
