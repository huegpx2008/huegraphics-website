import { readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const folders = [
  "business-printing",
  "dtf",
  "emb",
  "screen-printing",
  "sign-banners",
  "vehicle-graphics",
];

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const root = process.cwd();
const outputPath = path.join(root, "src", "data", "workImages.generated.ts");
const homeOutputPath = path.join(root, "src", "data", "homeWorkImages.generated.ts");

async function readImages(folder) {
  const folderPath = path.join(root, "public", "images", folder);

  try {
    const files = await readdir(folderPath);

    return files
      .filter((file) => imageExtensions.has(path.extname(file).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((file) => `/images/${folder}/${encodeURIComponent(file)}`);
  } catch {
    return [];
  }
}

const entries = await Promise.all(
  folders.map(async (folder) => [folder, await readImages(folder)])
);

const manifest = Object.fromEntries(entries);
const content = `export const workImagesByFolder = ${JSON.stringify(
  manifest,
  null,
  2
)} as const;\n\nexport type WorkImageFolder = keyof typeof workImagesByFolder;\n`;

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, content);

const homeImages = await readImages("all-photos");
const homeContent = `export const homeWorkImages = ${JSON.stringify(
  homeImages,
  null,
  2
)} as const;\n`;

await writeFile(homeOutputPath, homeContent);
