import { NextResponse } from "next/server";
import { getSanmarColorSizes } from "@/lib/sanmar-color-sizes";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const style = searchParams.get("style") || "";
  const color = searchParams.get("color") || "";

  if (!style || !color) {
    return NextResponse.json({ sizes: [] }, { status: 400 });
  }

  return NextResponse.json({
    sizes: getSanmarColorSizes(style, color),
  });
}
