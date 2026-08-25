const minimumCompletionMs = 2_000;
const maximumTurnstileTokenLength = 2_048;

export type SpamSignal = "honeypot" | "timing";

export type TextFieldRule = {
  key: string;
  maxLength: number;
  minLength?: number;
  required?: boolean;
};

type TurnstileVerificationResponse = {
  action?: string;
  hostname?: string;
  metadata?: {
    result_with_testing_key?: boolean;
  };
  success?: boolean;
};

export function logFormRejection(form: "contact" | "quote", reason: string) {
  console.warn("Form submission rejected", { form, reason });
}

export function hasOnlyAllowedFields(
  formData: FormData,
  allowedFields: ReadonlySet<string>,
) {
  return Array.from(formData.keys()).every((key) => allowedFields.has(key));
}

export function parseTextFields(
  formData: FormData,
  rules: readonly TextFieldRule[],
) {
  const values: Record<string, string> = {};

  for (const rule of rules) {
    const entries = formData.getAll(rule.key);

    if (entries.length > 1) {
      return { ok: false as const, values };
    }

    const rawValue = entries[0];

    if (rawValue !== undefined && typeof rawValue !== "string") {
      return { ok: false as const, values };
    }

    const value = (rawValue || "").trim().replace(/\r\n?/g, "\n");
    const minimumLength = rule.minLength || 0;

    if (
      (rule.required && !value) ||
      value.length < minimumLength ||
      value.length > rule.maxLength
    ) {
      return { ok: false as const, values };
    }

    values[rule.key] = value;
  }

  return { ok: true as const, values };
}

export function getSpamSignal(formData: FormData, now = Date.now()): SpamSignal | null {
  const honeypotValues = formData.getAll("company_website");

  if (
    honeypotValues.length !== 1 ||
    typeof honeypotValues[0] !== "string" ||
    honeypotValues[0].trim()
  ) {
    return "honeypot";
  }

  const timingValues = formData.getAll("form_started_at");
  const startedAt =
    timingValues.length === 1 && typeof timingValues[0] === "string"
      ? Number(timingValues[0])
      : Number.NaN;
  const elapsed = now - startedAt;

  if (
    !Number.isSafeInteger(startedAt) ||
    elapsed <= minimumCompletionMs
  ) {
    return "timing";
  }

  return null;
}

export function isReasonableEmail(value: string) {
  if (value.length > 254 || value.includes("..")) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isReasonablePhone(value: string) {
  if (!value) {
    return true;
  }

  const digitCount = value.replace(/\D/g, "").length;
  return value.length <= 50 && digitCount >= 7 && digitCount <= 20;
}

export function isMultipartRequest(request: Request, maximumBytes: number) {
  const contentType = request.headers.get("content-type")?.toLowerCase() || "";
  const contentLength = Number(request.headers.get("content-length") || "0");

  return (
    contentType.startsWith("multipart/form-data;") &&
    (!Number.isFinite(contentLength) ||
      contentLength <= 0 ||
      contentLength <= maximumBytes)
  );
}

export function getRequestIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    ""
  );
}

export async function verifyTurnstileToken(input: {
  action: "contact" | "quote";
  hostname: string;
  remoteIp: string;
  token: string;
}) {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();

  if (!secret || !input.token || input.token.length > maximumTurnstileTokenLength) {
    return false;
  }

  const body = new URLSearchParams({
    response: input.token,
    secret,
  });

  if (input.remoteIp) {
    body.set("remoteip", input.remoteIp);
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        body,
        cache: "no-store",
        method: "POST",
      },
    );

    if (!response.ok) {
      return false;
    }

    const result = (await response.json()) as TurnstileVerificationResponse;

    if (
      process.env.NODE_ENV !== "production" &&
      result.success === true &&
      result.metadata?.result_with_testing_key === true
    ) {
      return true;
    }

    return (
      result.success === true &&
      result.action === input.action &&
      result.hostname?.toLowerCase() === input.hostname.toLowerCase()
    );
  } catch {
    return false;
  }
}
