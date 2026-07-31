import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const adminSessionCookieName = "hue-admin-session";

const sessionPayload = "hue-graphics-admin-v1";
const sessionMaxAgeSeconds = 60 * 60 * 12;

function getAdminPassword() {
  return process.env.ADMIN_UPLOAD_PASSWORD?.trim() || "";
}

function getAdminSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() || getAdminPassword();
}

function hashValue(value: string) {
  return createHash("sha256").update(value).digest();
}

function safeEqual(left: string, right: string) {
  return timingSafeEqual(hashValue(left), hashValue(right));
}

function createSessionSignature(secret: string, issuedAt: number) {
  return createHmac("sha256", secret)
    .update(`${sessionPayload}:${issuedAt}`)
    .digest("hex");
}

function createSessionToken(secret: string) {
  const issuedAt = Math.floor(Date.now() / 1000);
  return `${issuedAt}.${createSessionSignature(secret, issuedAt)}`;
}

export function isAdminConfigured() {
  return Boolean(getAdminPassword());
}

export function isValidAdminPassword(candidate: string) {
  const password = getAdminPassword();
  return Boolean(password) && safeEqual(candidate, password);
}

export async function isAdminAuthenticated() {
  const secret = getAdminSessionSecret();

  if (!secret) {
    return false;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(adminSessionCookieName)?.value || "";
  const [issuedAtValue, signature] = token.split(".");
  const issuedAt = Number(issuedAtValue);
  const now = Math.floor(Date.now() / 1000);

  if (
    !Number.isFinite(issuedAt) ||
    !signature ||
    issuedAt > now + 60 ||
    now - issuedAt > sessionMaxAgeSeconds
  ) {
    return false;
  }

  return safeEqual(signature, createSessionSignature(secret, issuedAt));
}

export async function setAdminSession() {
  const secret = getAdminSessionSecret();

  if (!secret) {
    throw new Error("Admin session signing is not configured.");
  }

  const cookieStore = await cookies();
  cookieStore.set(adminSessionCookieName, createSessionToken(secret), {
    httpOnly: true,
    maxAge: sessionMaxAgeSeconds,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(adminSessionCookieName, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export function safeAdminPath(value: unknown) {
  return typeof value === "string" && /^\/admin(?:\/|$)/.test(value)
    ? value
    : "/admin";
}
