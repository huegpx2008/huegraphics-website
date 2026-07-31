import { NextRequest, NextResponse } from "next/server";
import { safeAdminPath, setAdminSession } from "@/lib/admin-auth";

const hueHqUrl = "https://hq.huegraphics.cc";
const codePattern = /^[A-Za-z0-9_-]{40,512}$/;

function failedRedirect(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/admin?sso=failed", request.url), 303);
  response.headers.set("Cache-Control", "no-store, max-age=0");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code") || "";
  const clientSecret = process.env.HUE_HQ_SSO_CLIENT_SECRET?.trim() || "";
  if (!codePattern.test(code) || !codePattern.test(clientSecret)) {
    return failedRedirect(request);
  }

  try {
    const response = await fetch(`${hueHqUrl}/api/internal/admin-sso/redeem`, {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audience: "website", code, clientSecret }),
      signal: AbortSignal.timeout(8_000),
    });
    const payload = await response.json().catch(() => null) as {
      ok?: boolean;
      identity?: { userId?: string; role?: string };
      redirectPath?: unknown;
    } | null;

    if (
      !response.ok
      || payload?.ok !== true
      || payload.identity?.role !== "admin"
      || !payload.identity.userId
    ) {
      return failedRedirect(request);
    }

    await setAdminSession();
    const destination = safeAdminPath(payload.redirectPath);
    const redirect = NextResponse.redirect(new URL(destination, request.url), 303);
    redirect.headers.set("Cache-Control", "no-store, max-age=0");
    redirect.headers.set("Referrer-Policy", "no-referrer");
    return redirect;
  } catch {
    return failedRedirect(request);
  }
}
