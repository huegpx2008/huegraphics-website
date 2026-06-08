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

type QuoteItem = {
  itemNumber: string;
  productName: string;
  styleSku: string;
  service: string;
  color: string;
  quantity: string;
  sizes: string;
  decorationMethod: string;
  configuration: string;
  estimatedTotal: string;
  estimatedEach: string;
};

type ParsedQuoteDetails = {
  isBasket: boolean;
  intro: string;
  totalItems: string;
  services: string[];
  estimatedQuoteTotal: string;
  customerNotes: string;
  items: QuoteItem[];
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

function parseMoney(value: string) {
  const match = value.match(/\$[\d,]+(?:\.\d{2})?/);
  return match?.[0] || "";
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
  }).format(value);
}

function parseBasketDetails(details: string): ParsedQuoteDetails {
  const [projectDetails, customerNotes = ""] = details.split(/\nCustomer notes:\n/i);
  const lines = projectDetails
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const isBasket = lines[0] === "Website quote basket";
  const totalItems =
    lines
      .find((line) => line.toLowerCase().startsWith("total items:"))
      ?.replace(/^total items:\s*/i, "") || "";

  if (!isBasket) {
    return {
      isBasket: false,
      intro: details,
      totalItems,
      services: [],
      estimatedQuoteTotal: "",
      customerNotes: customerNotes.trim(),
      items: [],
    };
  }

  const itemStartIndexes = lines.reduce<number[]>((indexes, line, index) => {
    if (/^\d+\.\s+/.test(line)) {
      indexes.push(index);
    }

    return indexes;
  }, []);

  const items = itemStartIndexes.map((startIndex, itemIndex) => {
    const endIndex = itemStartIndexes[itemIndex + 1] || lines.length;
    const itemLines = lines.slice(startIndex, endIndex);
    const heading = itemLines[0] || "";
    const headingMatch = heading.match(/^(\d+)\.\s+(.+)$/);
    const headingText = headingMatch?.[2] || heading;
    const [styleSku = "", productName = headingText] = headingText
      .split(/\s+-\s+(.+)/)
      .filter(Boolean);

    const readValue = (label: string) =>
      itemLines
        .find((line) => line.toLowerCase().startsWith(`${label.toLowerCase()}:`))
        ?.replace(new RegExp(`^${label}:\\s*`, "i"), "") || "";

    const estimateLine =
      itemLines.find((line) => line.toLowerCase().startsWith("estimated total")) ||
      "";
    const estimateParts = estimateLine.match(
      /^Estimated total\s+(.+?)\s+\((.+?)\s+each\)$/i,
    );
    const decoration = readValue("Decoration");
    const printColors = readValue("Print colors");

    return {
      itemNumber: headingMatch?.[1] || String(itemIndex + 1),
      productName,
      styleSku,
      service: readValue("Service"),
      color: readValue("Color"),
      quantity: readValue("Quantity"),
      sizes: readValue("Sizes"),
      decorationMethod: decoration ? "Decoration" : printColors ? "Print colors" : "",
      configuration: decoration || printColors,
      estimatedTotal: estimateParts?.[1] || parseMoney(estimateLine),
      estimatedEach: estimateParts?.[2] || "",
    };
  });

  const services = Array.from(
    new Set(items.map((item) => item.service).filter(Boolean)),
  );
  const estimatedTotal = items.reduce((total, item) => {
    const parsed = Number(item.estimatedTotal.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(parsed) ? total + parsed : total;
  }, 0);

  return {
    isBasket: true,
    intro: "Website quote basket",
    totalItems,
    services,
    estimatedQuoteTotal: estimatedTotal > 0 ? formatMoney(estimatedTotal) : "",
    customerNotes: customerNotes.trim(),
    items,
  };
}

function renderSectionTitle(title: string) {
  return `
    <p style="margin:0 0 12px;color:#1f73be;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;">${title}</p>
  `;
}

function renderValue(label: string, value: string) {
  return `
    <tr>
      <td style="padding:8px 10px 8px 0;color:#6b7280;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;vertical-align:top;width:36%;">${label}</td>
      <td style="padding:8px 0;color:#111827;font-size:14px;line-height:1.45;vertical-align:top;">${escapeHtml(value || "Not provided")}</td>
    </tr>
  `;
}

function renderQuoteSummary(details: ParsedQuoteDetails, interest: string) {
  return `
    <div style="margin-top:24px;padding:18px;background:#eef6ff;border:1px solid #cfe5fb;border-radius:12px;">
      ${renderSectionTitle("Quote Summary")}
      <table style="width:100%;border-collapse:collapse;">
        ${renderValue("Total items", details.totalItems || "Not provided")}
        ${renderValue("Estimated quote total", details.estimatedQuoteTotal || "Not calculated")}
        ${renderValue("Services selected", details.services.length ? details.services.join(", ") : interest)}
      </table>
    </div>
  `;
}

function renderQuoteItems(details: ParsedQuoteDetails) {
  if (!details.isBasket || !details.items.length) {
    return `
      <div style="margin-top:24px;">
        ${renderSectionTitle("Project Details")}
        <div style="white-space:pre-wrap;color:#111827;font-size:15px;line-height:1.7;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:16px;">${escapeHtml(details.intro)}</div>
      </div>
    `;
  }

  return `
    <div style="margin-top:24px;">
      ${renderSectionTitle("Project Items")}
      ${details.items
        .map(
          (item) => `
            <div style="margin:0 0 16px;padding:18px;background:#ffffff;border:1px solid #d7e0ea;border-radius:12px;">
              <p style="margin:0 0 6px;color:#1f73be;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;">Item ${escapeHtml(item.itemNumber)}</p>
              <h2 style="margin:0 0 14px;color:#111827;font-size:20px;line-height:1.2;">${escapeHtml(item.productName || "Quote item")}</h2>
              <table style="width:100%;border-collapse:collapse;">
                ${renderValue("Style/SKU", item.styleSku)}
                ${renderValue("Service", item.service)}
                ${renderValue("Color", item.color)}
                ${renderValue("Quantity", item.quantity)}
                ${renderValue("Sizes", item.sizes)}
                ${renderValue("Decoration method", item.decorationMethod)}
                ${renderValue("Configuration", item.configuration)}
                ${renderValue("Estimated total", item.estimatedTotal || "Not calculated")}
                ${renderValue("Estimated each", item.estimatedEach || "Not calculated")}
              </table>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderAttachedFiles(fileNames: string[]) {
  if (!fileNames.length) {
    return `
      <div style="color:#111827;font-size:15px;line-height:1.65;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:14px;">No files attached</div>
    `;
  }

  return `
    <ul style="margin:0;padding:14px 14px 14px 32px;color:#111827;font-size:15px;line-height:1.7;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;">
      ${fileNames.map((fileName) => `<li>${escapeHtml(fileName)}</li>`).join("")}
    </ul>
  `;
}

function buildPlainTextEmail(input: {
  name: string;
  businessName: string;
  email: string;
  phone: string;
  interest: string;
  details: ParsedQuoteDetails;
  notes: string;
  fileNames: string[];
}) {
  const customerNotes = input.notes || input.details.customerNotes || "None";
  const summary = [
    "QUOTE SUMMARY",
    `Total items: ${input.details.totalItems || "Not provided"}`,
    `Estimated quote total: ${input.details.estimatedQuoteTotal || "Not calculated"}`,
    `Services selected: ${
      input.details.services.length
        ? input.details.services.join(", ")
        : input.interest
    }`,
  ].join("\n");

  const projectDetails =
    input.details.isBasket && input.details.items.length
      ? input.details.items
          .map((item) =>
            [
              `Item ${item.itemNumber}: ${item.productName || "Quote item"}`,
              `Style/SKU: ${item.styleSku || "Not provided"}`,
              `Service: ${item.service || "Not provided"}`,
              `Color: ${item.color || "Not provided"}`,
              `Quantity: ${item.quantity || "Not provided"}`,
              `Sizes: ${item.sizes || "Not provided"}`,
              `Decoration method: ${item.decorationMethod || "Not provided"}`,
              `Configuration: ${item.configuration || "Not provided"}`,
              `Estimated total: ${item.estimatedTotal || "Not calculated"}`,
              `Estimated each: ${item.estimatedEach || "Not calculated"}`,
            ].join("\n"),
          )
          .join("\n\n")
      : input.details.intro;

  return [
    "New quote request",
    "",
    `Name: ${input.name || "Not provided"}`,
    `Business name: ${input.businessName || "Not provided"}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone || "Not provided"}`,
    `Interested in: ${input.interest}`,
    "",
    summary,
    "",
    input.details.isBasket ? "PROJECT ITEMS" : "PROJECT DETAILS",
    projectDetails,
    "",
    "CUSTOMER NOTES",
    customerNotes,
    "",
    "ATTACHED FILES",
    input.fileNames.length ? input.fileNames.join("\n") : "No files attached",
  ].join("\n");
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
    ? attachments.map((file) => file.filename)
    : [];
  const parsedDetails = parseBasketDetails(details);
  const customerNotes = notes || parsedDetails.customerNotes;
  const text = buildPlainTextEmail({
    businessName,
    details: parsedDetails,
    email,
    fileNames: fileList,
    interest,
    name,
    notes: customerNotes,
    phone,
  });

  const html = `
    <div style="background:#f5f7fb;padding:24px;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:760px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
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
          ${renderQuoteSummary(parsedDetails, interest)}
          ${renderQuoteItems(parsedDetails)}
          <div style="margin-top:24px;">
            ${renderSectionTitle("Customer Notes")}
            <div style="white-space:pre-wrap;color:#111827;font-size:15px;line-height:1.7;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:16px;">${escapeHtml(customerNotes || "None")}</div>
          </div>
          <div style="margin-top:24px;">
            ${renderSectionTitle("Attached Files")}
            ${renderAttachedFiles(fileList)}
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
      text,
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
