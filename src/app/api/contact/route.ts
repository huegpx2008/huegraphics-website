import { NextResponse } from "next/server";
import {
  getRequestIp,
  getSpamSignal,
  hasOnlyAllowedFields,
  isMultipartRequest,
  isReasonableEmail,
  isReasonablePhone,
  logFormRejection,
  parseTextFields,
  verifyTurnstileToken,
} from "@/lib/form-protection";

const maximumRequestBytes = 96 * 1024;
const allowedFields = new Set([
  "company_website",
  "email",
  "form_started_at",
  "message",
  "name",
  "phone",
  "subject",
  "turnstileToken",
]);
const textFieldRules = [
  { key: "name", maxLength: 120, required: true },
  { key: "email", maxLength: 254, required: true },
  { key: "phone", maxLength: 50 },
  { key: "subject", maxLength: 160 },
  { key: "message", maxLength: 5_000, required: true },
] as const;

function genericFailure(status = 400) {
  return NextResponse.json(
    {
      error:
        "Unable to submit the form. Please check your information and try again.",
    },
    { status },
  );
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderField(label: string, value: string) {
  return `
    <tr>
      <td style="padding:10px 0;color:#6b7280;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">${label}</td>
      <td style="padding:10px 0;color:#111827;font-size:15px;">${escapeHtml(value || "Not provided")}</td>
    </tr>
  `;
}

export async function POST(request: Request) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const contactToEmail = process.env.QUOTE_TO_EMAIL || "jason@huegraphics.cc";
  const contactFromEmail =
    process.env.QUOTE_FROM_EMAIL || "Hue Graphics <onboarding@resend.dev>";

  if (!resendApiKey) {
    console.error("Contact form is not configured");
    return genericFailure(503);
  }

  if (!isMultipartRequest(request, maximumRequestBytes)) {
    logFormRejection("contact", "invalid_request");
    return genericFailure(415);
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    logFormRejection("contact", "invalid_request");
    return genericFailure();
  }

  const spamSignal = getSpamSignal(formData);

  if (spamSignal) {
    logFormRejection("contact", spamSignal);
    return NextResponse.json({ ok: true });
  }

  if (!hasOnlyAllowedFields(formData, allowedFields)) {
    logFormRejection("contact", "invalid_data");
    return genericFailure();
  }

  const parsed = parseTextFields(formData, textFieldRules);

  if (
    !parsed.ok ||
    !isReasonableEmail(parsed.values.email) ||
    !isReasonablePhone(parsed.values.phone)
  ) {
    logFormRejection("contact", "invalid_data");
    return genericFailure();
  }

  const turnstileValues = formData.getAll("turnstileToken");
  const turnstileToken =
    turnstileValues.length === 1 && typeof turnstileValues[0] === "string"
      ? turnstileValues[0]
      : "";
  const turnstileVerified = await verifyTurnstileToken({
    action: "contact",
    hostname: new URL(request.url).hostname,
    remoteIp: getRequestIp(request),
    token: turnstileToken,
  });

  if (!turnstileVerified) {
    logFormRejection("contact", "turnstile_failure");
    return genericFailure();
  }

  const { email, message, name, phone, subject } = parsed.values;

  const html = `
    <div style="background:#f5f7fb;padding:24px;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
        <div style="background:#08111F;padding:24px;">
          <p style="margin:0;color:#60a5fa;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.16em;">Hue Graphics</p>
          <h1 style="margin:8px 0 0;color:#ffffff;font-size:28px;line-height:1.1;">New contact message</h1>
        </div>
        <div style="padding:24px;">
          <table style="width:100%;border-collapse:collapse;">
            ${renderField("Name", name)}
            ${renderField("Email", email)}
            ${renderField("Phone", phone)}
            ${renderField("Subject", subject)}
          </table>
          <div style="margin-top:22px;">
            <p style="margin:0 0 8px;color:#6b7280;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">Message</p>
            <div style="white-space:pre-wrap;color:#111827;font-size:15px;line-height:1.65;">${escapeHtml(message)}</div>
          </div>
        </div>
      </div>
    </div>
  `;

  let resendResponse: Response;

  try {
    resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: contactFromEmail,
        html,
        reply_to: email,
        subject: subject ? `Contact: ${subject}` : "New contact message",
        to: contactToEmail,
      }),
    });
  } catch {
    console.error("Contact email request failed");
    return genericFailure(502);
  }

  if (!resendResponse.ok) {
    console.error("Contact email request failed", resendResponse.status);
    return genericFailure(502);
  }

  return NextResponse.json({ ok: true });
}
