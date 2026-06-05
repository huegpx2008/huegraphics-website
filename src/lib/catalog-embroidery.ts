import type { CatalogProduct } from "@/data/sanmarCatalog.generated";

export const embroideryMinimumQuantity = 5;

export type EmbroideryRecommendation = {
  canEstimate: boolean;
  method: "embroidery" | "screenprint" | "dtf";
  label: string;
  message: string;
};

const embroideryCategories = new Set([
  "Polos/Knits",
  "Caps",
  "Woven Shirts",
  "Bags",
  "Jackets/Outerwear",
  "Workwear",
]);

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

export function isEmbroideryFriendlyProduct(product: CatalogProduct) {
  if (embroideryCategories.has(product.category)) {
    return true;
  }

  const text = productText(product);

  return /\bpolo\b|\bcap\b|\bhat\b|\bbeanie\b|\bbag\b|\bbackpack\b|\btote\b|\bwoven\b|\bdress shirt\b|\bbutton\b|\bjacket\b|\bvest\b/.test(
    text,
  );
}

export function getEmbroideryRecommendation(
  product: CatalogProduct,
): EmbroideryRecommendation {
  const text = productText(product);
  const isTee =
    product.category === "T-Shirts" ||
    /\btee\b|\bt-shirt\b|\btshirt\b/.test(text);

  if (isTee) {
    return {
      canEstimate: false,
      method: "screenprint",
      label: "Recommend screen print, DTF, or DTG",
      message:
        "T-shirts are usually better for screen printing, DTF, or DTG. Embroidery can be heavy on many tee fabrics.",
    };
  }

  if (!isEmbroideryFriendlyProduct(product)) {
    return {
      canEstimate: false,
      method: "dtf",
      label: "Request decoration help",
      message:
        "This item may need a quick review before we recommend embroidery or another decoration method.",
    };
  }

  return {
    canEstimate: true,
    method: "embroidery",
    label: "Embroidery ready",
    message:
      "This style is a good fit for embroidered logos at 5 pieces or more.",
  };
}
