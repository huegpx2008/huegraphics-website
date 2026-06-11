import { readFileSync } from "node:fs";
import path from "node:path";

type ColorSizeIndex = Map<string, Map<string, string[]>>;

let cachedColorSizeIndex: ColorSizeIndex | null = null;

const sizeOrder = [
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

function parseCsvLine(line: string) {
  const values: string[] = [];
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

function clean(value: string | undefined) {
  return value?.trim().replace(/\s+/g, " ") || "";
}

function normalizeKey(value: string) {
  return clean(value).toLowerCase();
}

function sizeSortValue(size: string) {
  const upper = size.toUpperCase();
  const index = sizeOrder.indexOf(upper);

  return index === -1 ? sizeOrder.length + upper.charCodeAt(0) : index;
}

function buildColorSizeIndex() {
  const csvPath = path.join(process.cwd(), "public", "SanMar_SDL_N.csv");
  const csv = readFileSync(csvPath, "utf8");
  const lines = csv.split(/\r?\n/).filter(Boolean);
  const headers = parseCsvLine(lines[0] || "");
  const styleIndex = headers.indexOf("STYLE#");
  const colorIndex = headers.indexOf("COLOR_NAME");
  const sizeIndex = headers.indexOf("SIZE");
  const index: ColorSizeIndex = new Map();

  for (const line of lines.slice(1)) {
    const row = parseCsvLine(line);
    const style = clean(row[styleIndex]);
    const color = clean(row[colorIndex]);
    const size = clean(row[sizeIndex]);

    if (!style || !color || !size) {
      continue;
    }

    const styleKey = normalizeKey(style);
    const colorKey = normalizeKey(color);
    const styleMap = index.get(styleKey) ?? new Map<string, string[]>();
    const sizes = styleMap.get(colorKey) ?? [];

    if (!sizes.includes(size)) {
      sizes.push(size);
    }

    sizes.sort((a, b) => sizeSortValue(a) - sizeSortValue(b));
    styleMap.set(colorKey, sizes);
    index.set(styleKey, styleMap);
  }

  return index;
}

export function getSanmarColorSizes(style: string, color: string) {
  cachedColorSizeIndex ??= buildColorSizeIndex();

  return (
    cachedColorSizeIndex.get(normalizeKey(style))?.get(normalizeKey(color)) ?? []
  );
}
