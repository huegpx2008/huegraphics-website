import { createReadStream } from "node:fs";
import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import readline from "node:readline";

const root = process.cwd();
const inputPath = path.join(root, "public", "SanMar_SDL_N.csv");
const outputPath = path.join(root, "src", "data", "sanmarCatalog.generated.ts");

const preferredCategoryOrder = [
  "T-Shirts",
  "Polos/Knits",
  "Sweatshirts/Fleece",
  "Caps",
  "Jackets/Outerwear",
  "Woven Shirts",
  "Ladies",
  "Youth",
  "Bags",
];

const preferredCategories = new Set(preferredCategoryOrder);
const starterBrandOrder = ["Gildan", "Bella + Canvas", "Sport-Tek"];
const starterTypeOrder = ["T-Shirts", "Hoodies", "Long Sleeves", "Polos"];
const starterProductCount = 48;

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

if (!(await fileExists(inputPath))) {
  if (await fileExists(outputPath)) {
    console.log(
      "SanMar_SDL_N.csv not found. Keeping existing generated catalog data."
    );
    process.exit(0);
  }

  throw new Error(
    "SanMar_SDL_N.csv is required to generate the catalog, but no generated catalog data exists yet."
  );
}

function parseCsvLine(line) {
  const values = [];
  let value = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      value += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(value);
      value = "";
      continue;
    }

    value += char;
  }

  values.push(value);
  return values;
}

function clean(value) {
  return value?.trim().replace(/\s+/g, " ") || "";
}

function normalizeTitle(title, style) {
  return clean(title)
    .replace(/\s+\.\s+/g, ". ")
    .replace(new RegExp(`\\s+${style}$`, "i"), "");
}

function parsePrice(value) {
  const price = Number.parseFloat(value);
  return Number.isFinite(price) ? price : undefined;
}

function parseNumber(value) {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) ? number : undefined;
}

function cdnImageUrl(baseUrl, fileName) {
  const file = clean(fileName);

  if (!file) {
    return "";
  }

  if (file.startsWith("http")) {
    return file;
  }

  return `${baseUrl}${encodeURIComponent(file)}`;
}

function swatchImageUrl(fileName) {
  return cdnImageUrl("https://cdnm.sanmar.com/swatch/gifs/", fileName);
}

function catalogImageUrl(fileName) {
  return cdnImageUrl("https://cdnm.sanmar.com/catalog/images/", fileName);
}

function normalizeCategory(value) {
  const categories = clean(value)
    .split(";")
    .map((category) => category.trim())
    .filter(Boolean);

  const normalizedCategories = categories.map((category) =>
    category === "T-Shirts " ? "T-Shirts" : category
  );

  if (normalizedCategories.includes("Outerwear")) {
    normalizedCategories.push("Jackets/Outerwear");
  }

  const preferredCategory = preferredCategoryOrder.find((category) =>
    normalizedCategories.includes(category)
  );

  return preferredCategory || normalizedCategories[0] || "";
}

function previewDescription(value) {
  const description = clean(value);

  if (description.length <= 320) {
    return description;
  }

  return `${description.slice(0, 317).trim()}...`;
}

function starterType(product) {
  const title = product.title.toLowerCase();
  const description = product.description.toLowerCase();
  const combinedText = `${title} ${description}`;

  if (product.category === "T-Shirts" && /long sleeve|l\/s|long-sleeve/.test(combinedText)) {
    return "Long Sleeves";
  }

  if (product.category === "Sweatshirts/Fleece" && /hoodie|hooded/.test(combinedText)) {
    return "Hoodies";
  }

  if (product.category === "T-Shirts") {
    return "T-Shirts";
  }

  if (product.category === "Polos/Knits") {
    return "Polos";
  }

  return "";
}

function sortStarterProducts(a, b) {
  return `${a.brand} ${a.title} ${a.style}`.localeCompare(
    `${b.brand} ${b.title} ${b.style}`,
    undefined,
    { numeric: true }
  );
}

const stream = createReadStream(inputPath);
const lines = readline.createInterface({
  input: stream,
  crlfDelay: Infinity,
});

let headers = [];
const products = new Map();

for await (const line of lines) {
  if (!headers.length) {
    headers = parseCsvLine(line);
    continue;
  }

  const row = parseCsvLine(line);
  const record = Object.fromEntries(
    headers.map((header, index) => [header, row[index] || ""])
  );

  const style = clean(record["STYLE#"]);
  const title = normalizeTitle(record.PRODUCT_TITLE, style);
  const brand = clean(record.MILL);
  const category = normalizeCategory(record.CATEGORY_NAME);
  const status = clean(record.PRODUCT_STATUS).toLowerCase();

  if (!style || !title || !brand || !category) {
    continue;
  }

  if (status.includes("discontinued") || title.toLowerCase().includes("discontinued")) {
    continue;
  }

  const existing = products.get(style);
  const price = parsePrice(record.PIECE_PRICE);
  const msrp = parsePrice(record.MSRP);
  const pieceWeight = parseNumber(record.PIECE_WEIGHT);
  const image =
    clean(record.FRONT_MODEL_IMAGE_URL) ||
    clean(record.FRONT_FLAT_IMAGE_URL) ||
    clean(record.PRODUCT_IMAGE);
  const backImage =
    clean(record.BACK_MODEL_IMAGE_URL) ||
    clean(record.BACK_FLAT_IMAGE_URL);

  if (!existing) {
    products.set(style, {
      style,
      title,
      brand,
      category,
      subcategory: clean(record.SUBCATEGORY_NAME),
      description: previewDescription(record.PRODUCT_DESCRIPTION),
      availableSizes: clean(record.AVAILABLE_SIZES),
      image,
      backImage,
      specSheet: clean(record.SPEC_SHEET),
      decorationSpecSheet: clean(record.DECORATION_SPEC_SHEET),
      productMeasurements: clean(record.PRODUCT_MEASUREMENTS),
      companionStyle: clean(record.COMPANION_STYLE),
      colors: new Map(),
      sizes: new Set(),
      priceFrom: price,
      msrp,
      pieceWeight,
    });
  } else if (price !== undefined) {
    existing.priceFrom =
      existing.priceFrom === undefined ? price : Math.min(existing.priceFrom, price);
  }

  if (existing) {
    if (!existing.backImage && backImage) {
      existing.backImage = backImage;
    }

    if (!existing.specSheet && clean(record.SPEC_SHEET)) {
      existing.specSheet = clean(record.SPEC_SHEET);
    }

    if (!existing.decorationSpecSheet && clean(record.DECORATION_SPEC_SHEET)) {
      existing.decorationSpecSheet = clean(record.DECORATION_SPEC_SHEET);
    }

    if (!existing.productMeasurements && clean(record.PRODUCT_MEASUREMENTS)) {
      existing.productMeasurements = clean(record.PRODUCT_MEASUREMENTS);
    }

    if (!existing.companionStyle && clean(record.COMPANION_STYLE)) {
      existing.companionStyle = clean(record.COMPANION_STYLE);
    }

    if (msrp !== undefined) {
      existing.msrp = existing.msrp === undefined ? msrp : Math.min(existing.msrp, msrp);
    }

    if (pieceWeight !== undefined) {
      existing.pieceWeight =
        existing.pieceWeight === undefined
          ? pieceWeight
          : Math.min(existing.pieceWeight, pieceWeight);
    }
  }

  const product = products.get(style);
  const color = clean(record.COLOR_NAME);
  const size = clean(record.SIZE);

  if (color && !product.colors.has(color)) {
    product.colors.set(color, {
      name: color,
      swatchImage: swatchImageUrl(record.COLOR_SQUARE_IMAGE),
      colorSwatchImage: catalogImageUrl(record.COLOR_SWATCH_IMAGE),
      productImage:
        clean(record.FRONT_MODEL_IMAGE_URL) ||
        clean(record.FRONT_FLAT_IMAGE_URL) ||
        catalogImageUrl(record.COLOR_PRODUCT_IMAGE),
      thumbnailImage: catalogImageUrl(record.COLOR_PRODUCT_IMAGE_THUMBNAIL),
      pms: clean(record.PMS_COLOR),
    });
  }

  if (size) {
    product.sizes.add(size);
  }
}

const sortedProducts = [...products.values()]
  .sort((a, b) => {
    return `${a.brand} ${a.title} ${a.style}`.localeCompare(
      `${b.brand} ${b.title} ${b.style}`,
      undefined,
      { numeric: true }
    );
  });

const productsByCategory = new Map();

for (const product of sortedProducts) {
  const categoryProducts = productsByCategory.get(product.category) || [];
  categoryProducts.push(product);
  productsByCategory.set(product.category, categoryProducts);
}

const categoryOrder = [
  ...preferredCategoryOrder.filter((category) => productsByCategory.has(category)),
  ...[...productsByCategory.keys()]
    .filter((category) => !preferredCategories.has(category))
    .sort((a, b) => a.localeCompare(b)),
];

const starterBuckets = new Map();

for (const type of starterTypeOrder) {
  for (const brand of starterBrandOrder) {
    starterBuckets.set(`${type}:${brand}`, []);
  }
}

for (const product of sortedProducts) {
  const type = starterType(product);

  if (!type || !starterBrandOrder.includes(product.brand)) {
    continue;
  }

  starterBuckets.get(`${type}:${product.brand}`)?.push(product);
}

for (const bucket of starterBuckets.values()) {
  bucket.sort(sortStarterProducts);
}

const starterProducts = [];
let hasStarterProducts = true;

while (starterProducts.length < starterProductCount && hasStarterProducts) {
  hasStarterProducts = false;

  for (const type of starterTypeOrder) {
    for (const brand of starterBrandOrder) {
      const bucket = starterBuckets.get(`${type}:${brand}`);
      const product = bucket?.shift();

      if (product) {
        starterProducts.push(product);
        hasStarterProducts = true;
      }

      if (starterProducts.length >= starterProductCount) {
        break;
      }
    }

    if (starterProducts.length >= starterProductCount) {
      break;
    }
  }
}

const balancedProducts = [];
let hasRemainingProducts = true;

while (hasRemainingProducts) {
  hasRemainingProducts = false;

  for (const category of categoryOrder) {
    const categoryProducts = productsByCategory.get(category);
    const product = categoryProducts?.shift();

    if (product) {
      balancedProducts.push(product);
      hasRemainingProducts = true;
    }
  }
}

const starterProductStyles = new Set(starterProducts.map((product) => product.style));
const catalogProducts = [
  ...starterProducts,
  ...balancedProducts.filter((product) => !starterProductStyles.has(product.style)),
]
  .map((product) => ({
    ...product,
    colors: [...product.colors.values()].sort((a, b) =>
      a.name.localeCompare(b.name)
    ),
    sizes: [...product.sizes].sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
  }));

const categories = [
  ...new Set(catalogProducts.map((product) => product.category).filter(Boolean)),
].sort((a, b) => a.localeCompare(b));

const brands = [
  ...new Set(catalogProducts.map((product) => product.brand).filter(Boolean)),
].sort((a, b) => a.localeCompare(b));

const content = `export type CatalogProduct = {
  style: string;
  title: string;
  brand: string;
  category: string;
  subcategory: string;
  description: string;
  availableSizes: string;
  image: string;
  backImage: string;
  specSheet: string;
  decorationSpecSheet: string;
  productMeasurements: string;
  companionStyle: string;
  colors: {
    name: string;
    swatchImage: string;
    colorSwatchImage: string;
    productImage: string;
    thumbnailImage: string;
    pms: string;
  }[];
  sizes: string[];
  priceFrom?: number;
  msrp?: number;
  pieceWeight?: number;
};

export const sanmarCatalogProducts = ${JSON.stringify(catalogProducts, null, 2)} satisfies CatalogProduct[];

export const sanmarCatalogCategories = ${JSON.stringify(categories, null, 2)} as const;

export const sanmarCatalogBrands = ${JSON.stringify(brands, null, 2)} as const;
`;

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, content);

console.log(
  `Generated ${catalogProducts.length} catalog products from ${products.size} SanMar styles.`
);
