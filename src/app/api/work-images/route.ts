import { readdirSync } from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

const allowedFolders = new Set(["screen-printing", "emb", "vehicle-graphics"]);
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

function getPublicImageFolder(folder: string) {
  const folderPath = path.join(process.cwd(), "public", "images", folder);

  return readdirSync(folderPath)
    .filter((file) => imageExtensions.has(path.extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((file) => `/images/${folder}/${encodeURIComponent(file)}`);
}

export function GET(request: NextRequest) {
  const folder = request.nextUrl.searchParams.get("folder") || "";

  if (!allowedFolders.has(folder)) {
    return NextResponse.json({ images: [] }, { status: 400 });
  }

  try {
    return NextResponse.json({ images: getPublicImageFolder(folder) });
  } catch {
    return NextResponse.json({ images: [] });
  }
}
