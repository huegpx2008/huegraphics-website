import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const adminSessionCookieName = "hue-admin-session";

const sessionPayload = "hue-graphics-admin-v1";
const sessionMaxAgeSeconds = 60 * 60 * 12;

function getAdminPassword() {
  return process.env.ADMIN_UPLOAD_PASSWORD?.trim() || "";
}

function hashValue(value: string) {
  return createHash("sha256").update(value).digest();
}

function safeEqual(left: string, right: string) {
  return timingSafeEqual(hashValue(left), hashValue(right));
}

function createSessionSignature(password: string, issuedAt: number) {
  return createHmac("sha256", password)
    .update(`${sessionPayload}:${issuedAt}`)
    .digest("hex");
}

function createSessionToken(password: string) {
  const issuedAt = Math.floor(Date.now() / 1000);
  return `${issuedAt}.${createSessionSignature(password, issuedAt)}`;
}

export function isAdminConfigured() {
  return Boolean(getAdminPassword());
}

export function isValidAdminPassword(candidate: string) {
  const password = getAdminPassword();
  return Boolean(password) && safeEqual(candidate, password);
}

export async function isAdminAuthenticated() {
  const password = getAdminPassword();

  if (!password) return false;

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

  return safeEqual(signature, createSessionSignature(password, issuedAt));
}

export async function setAdminSession() {
  const password = getAdminPassword();

  if (!password) throw new Error("Admin access is not configured.");

  const cookieStore = await cookies();
  cookieStore.set(adminSessionCookieName, createSessionToken(password), {
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
