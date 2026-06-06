import { NextResponse } from "next/server";

const maxFileSize = 8 * 1024 * 1024;
const maxTotalFileSize = 18 * 1024 * 1024;
const allowedFileTypes = new Set([
  "application/pdf",
  "application/octet-stream",
  "application/postscript",
  "application/zip",
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/vnd.adobe.photoshop",
  "image/webp",
  "text/plain",
]);

type ResendAttachment = {
  content: string;
  filename: string;
};

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
  const quoteToEmail = process.env.QUOTE_TO_EMAIL || "jason@huegraphics.cc";
  const quoteFromEmail =
    process.env.QUOTE_FROM_EMAIL || "Hue Graphics <onboarding@resend.dev>";

  if (!resendApiKey) {
    return NextResponse.json(
      {
        error:
          "Email sending is not configured on this server. Add RESEND_API_KEY to the local environment and restart the dev server.",
      },
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const name = getFormValue(formData, "name");
  const businessName = getFormValue(formData, "businessName");
  const email = getFormValue(formData, "email");
  const phone = getFormValue(formData, "phone");
  const interest = getFormValue(formData, "interest");
  const details = getFormValue(formData, "details");
  const notes = getFormValue(formData, "notes");

  if (!email || !interest || !details) {
    return NextResponse.json(
      { error: "Please complete the required fields." },
      { status: 400 }
    );
  }

  const fileValues = formData
    .getAll("files")
    .filter((file): file is File => file instanceof File && Boolean(file.name));

  let totalFileSize = 0;
  const attachments: ResendAttachment[] = [];

  for (const file of fileValues) {
    if (file.size > maxFileSize) {
      return NextResponse.json(
        { error: `${file.name} is larger than 8MB.` },
        { status: 400 }
      );
    }

    totalFileSize += file.size;

    if (totalFileSize > maxTotalFileSize) {
      return NextResponse.json(
        { error: "Attachments must be under 18MB total." },
        { status: 400 }
      );
    }

    if (file.type && !allowedFileTypes.has(file.type)) {
      return NextResponse.json(
        { error: `${file.name} is not a supported file type.` },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    attachments.push({
      content: fileBuffer.toString("base64"),
      filename: file.name,
    });
  }

  const fileList = attachments.length
    ? attachments.map((file) => escapeHtml(file.filename)).join("<br />")
    : "No files attached";

  const html = `
    <div style="background:#f5f7fb;padding:24px;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
        <div style="background:#08111F;padding:24px;">
          <p style="margin:0;color:#60a5fa;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.16em;">Hue Graphics</p>
          <h1 style="margin:8px 0 0;color:#ffffff;font-size:28px;line-height:1.1;">New quote request</h1>
        </div>
        <div style="padding:24px;">
          <table style="width:100%;border-collapse:collapse;">
            ${renderField("Name", name)}
            ${renderField("Business name", businessName)}
            ${renderField("Email", email)}
            ${renderField("Phone", phone)}
            ${renderField("Interested in", interest)}
          </table>
          <div style="margin-top:22px;">
            <p style="margin:0 0 8px;color:#6b7280;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">Project details</p>
            <div style="white-space:pre-wrap;color:#111827;font-size:15px;line-height:1.65;">${escapeHtml(details)}</div>
          </div>
          <div style="margin-top:22px;">
            <p style="margin:0 0 8px;color:#6b7280;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">Other notes</p>
            <div style="white-space:pre-wrap;color:#111827;font-size:15px;line-height:1.65;">${escapeHtml(notes || "None")}</div>
          </div>
          <div style="margin-top:22px;">
            <p style="margin:0 0 8px;color:#6b7280;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">Attached files</p>
            <div style="color:#111827;font-size:15px;line-height:1.65;">${fileList}</div>
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
      attachments,
      from: quoteFromEmail,
      html,
      reply_to: email,
      subject: `Quote Request: ${interest}`,
      to: quoteToEmail,
    }),
  });

  if (!resendResponse.ok) {
    return NextResponse.json(
      { error: "The quote request could not be sent. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
