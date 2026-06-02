import { NextResponse } from "next/server";

const INSTAGRAM_FIELDS = [
  "id",
  "caption",
  "media_type",
  "media_url",
  "permalink",
  "thumbnail_url",
  "timestamp",
].join(",");

type InstagramMedia = {
  id: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  permalink?: string;
  thumbnail_url?: string;
  timestamp?: string;
};

function normalizeMedia(item: InstagramMedia) {
  const firstCaptionLine = item.caption?.split("\n").find(Boolean)?.trim();

  return {
    id: item.id,
    title: firstCaptionLine || "Recent Instagram Post",
    category: item.media_type === "VIDEO" ? "Instagram Video" : "Instagram",
    image: item.thumbnail_url || item.media_url || "",
    permalink: item.permalink || "https://www.instagram.com/huegraphics/",
    timestamp: item.timestamp || "",
  };
}

export async function GET() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const instagramUserId = process.env.INSTAGRAM_USER_ID || "me";

  if (!accessToken) {
    return NextResponse.json({
      configured: false,
      items: [],
    });
  }

  const url = new URL(`https://graph.instagram.com/${instagramUserId}/media`);
  url.searchParams.set("fields", INSTAGRAM_FIELDS);
  url.searchParams.set("limit", "6");
  url.searchParams.set("access_token", accessToken);

  try {
    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          configured: true,
          error: "Instagram feed request failed.",
          items: [],
        },
        { status: 502 }
      );
    }

    const payload = (await response.json()) as { data?: InstagramMedia[] };

    return NextResponse.json({
      configured: true,
      items: (payload.data || [])
        .map(normalizeMedia)
        .filter((item) => item.image)
        .slice(0, 6),
    });
  } catch {
    return NextResponse.json(
      {
        configured: true,
        error: "Instagram feed request failed.",
        items: [],
      },
      { status: 502 }
    );
  }
}
