import { NextResponse } from "next/server";
import {
  isAdminConfigured,
  isValidAdminPassword,
  safeAdminPath,
  setAdminSession,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Admin access is not configured on this server." },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    password?: unknown;
    nextPath?: unknown;
  } | null;
  const password = typeof body?.password === "string" ? body.password : "";

  if (!isValidAdminPassword(password)) {
    return NextResponse.json(
      { ok: false, error: "Incorrect password." },
      { status: 401 },
    );
  }

  await setAdminSession();

  return NextResponse.json({
    ok: true,
    redirectTo: safeAdminPath(body?.nextPath),
  });
}
