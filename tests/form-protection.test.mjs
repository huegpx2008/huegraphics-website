import assert from "node:assert/strict";
import test from "node:test";
import {
  getSpamSignal,
  hasOnlyAllowedFields,
  isMultipartRequest,
  isReasonableEmail,
  isReasonablePhone,
  parseTextFields,
  verifyTurnstileToken,
} from "../src/lib/form-protection.ts";

const now = 1_800_000_000_000;

function protectedFormData(overrides = {}) {
  const formData = new FormData();
  formData.set("company_website", overrides.company_website || "");
  formData.set(
    "form_started_at",
    overrides.form_started_at || String(now - 10_000),
  );
  return formData;
}

test("a normally timed form has no automated-spam signal", () => {
  assert.equal(getSpamSignal(protectedFormData(), now), null);
});

test("a populated honeypot is silently identifiable", () => {
  assert.equal(
    getSpamSignal(protectedFormData({ company_website: "spam.example" }), now),
    "honeypot",
  );
});

test("missing and unrealistically fast timestamps are identifiable", () => {
  const missingTimestamp = new FormData();
  missingTimestamp.set("company_website", "");

  assert.equal(getSpamSignal(missingTimestamp, now), "timing");
  assert.equal(
    getSpamSignal(
      protectedFormData({ form_started_at: String(now - 1_500) }),
      now,
    ),
    "timing",
  );
});

test("text validation trims values and enforces required and maximum lengths", () => {
  const rules = [
    { key: "email", maxLength: 254, required: true },
    { key: "message", maxLength: 20, required: true },
  ];
  const valid = new FormData();
  valid.set("email", "  customer@example.com  ");
  valid.set("message", "  Hello\r\nthere  ");

  assert.deepEqual(parseTextFields(valid, rules), {
    ok: true,
    values: {
      email: "customer@example.com",
      message: "Hello\nthere",
    },
  });

  const missing = new FormData();
  missing.set("email", "customer@example.com");
  assert.equal(parseTextFields(missing, rules).ok, false);

  const oversized = new FormData();
  oversized.set("email", "customer@example.com");
  oversized.set("message", "x".repeat(21));
  assert.equal(parseTextFields(oversized, rules).ok, false);
});

test("email, phone, fields, and multipart request checks reject invalid data", () => {
  assert.equal(isReasonableEmail("customer@example.com"), true);
  assert.equal(isReasonableEmail("not-an-email"), false);
  assert.equal(isReasonablePhone("(704) 555-1234 ext 2"), true);
  assert.equal(isReasonablePhone("123"), false);

  const formData = new FormData();
  formData.set("email", "customer@example.com");
  assert.equal(hasOnlyAllowedFields(formData, new Set(["email"])), true);
  formData.set("unexpected", "value");
  assert.equal(hasOnlyAllowedFields(formData, new Set(["email"])), false);

  const request = new Request("https://huegraphics.cc/api/contact", {
    body: protectedFormData(),
    method: "POST",
  });
  assert.equal(isMultipartRequest(request, 100_000), true);
  assert.equal(
    isMultipartRequest(
      new Request("https://huegraphics.cc/api/contact", {
        body: JSON.stringify({ email: "customer@example.com" }),
        headers: { "content-type": "application/json" },
        method: "POST",
      }),
      100_000,
    ),
    false,
  );
});

test("Turnstile requires a successful token for the expected form and hostname", async () => {
  const originalFetch = globalThis.fetch;
  const originalSecret = process.env.TURNSTILE_SECRET_KEY;
  process.env.TURNSTILE_SECRET_KEY = "test-secret";

  globalThis.fetch = async (_url, options) => {
    const body = options?.body;
    const token = body instanceof URLSearchParams ? body.get("response") : "";

    return Response.json({
      action: "contact",
      hostname: "huegraphics.cc",
      success: token === "valid-token",
    });
  };

  try {
    assert.equal(
      await verifyTurnstileToken({
        action: "contact",
        hostname: "huegraphics.cc",
        remoteIp: "203.0.113.1",
        token: "valid-token",
      }),
      true,
    );
    assert.equal(
      await verifyTurnstileToken({
        action: "contact",
        hostname: "huegraphics.cc",
        remoteIp: "",
        token: "invalid-token",
      }),
      false,
    );
    assert.equal(
      await verifyTurnstileToken({
        action: "quote",
        hostname: "huegraphics.cc",
        remoteIp: "",
        token: "valid-token",
      }),
      false,
    );
    assert.equal(
      await verifyTurnstileToken({
        action: "contact",
        hostname: "www.huegraphics.cc",
        remoteIp: "",
        token: "valid-token",
      }),
      false,
    );
    assert.equal(
      await verifyTurnstileToken({
        action: "contact",
        hostname: "huegraphics.cc",
        remoteIp: "",
        token: "",
      }),
      false,
    );
  } finally {
    globalThis.fetch = originalFetch;

    if (originalSecret === undefined) {
      delete process.env.TURNSTILE_SECRET_KEY;
    } else {
      process.env.TURNSTILE_SECRET_KEY = originalSecret;
    }
  }
});
