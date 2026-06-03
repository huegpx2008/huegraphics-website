import { NextResponse } from "next/server";

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
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
    return NextResponse.json(
      { error: "Contact form email is not configured yet." },
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const name = getFormValue(formData, "name");
  const email = getFormValue(formData, "email");
  const phone = getFormValue(formData, "phone");
  const subject = getFormValue(formData, "subject");
  const message = getFormValue(formData, "message");

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Please complete the required fields." },
      { status: 400 }
    );
  }

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

  const resendResponse = await fetch("https://api.resend.com/emails", {
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

  if (!resendResponse.ok) {
    return NextResponse.json(
      { error: "The message could not be sent. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
