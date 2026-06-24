import "server-only";

import { createSign } from "node:crypto";

const analyticsLogPrefix = "[admin-stats]";
const tokenUrl = "https://oauth2.googleapis.com/token";
const analyticsScope = "https://www.googleapis.com/auth/analytics.readonly";

type GoogleTokenResponse = {
  access_token?: string;
  expires_in?: number;
  token_type?: string;
  error?: string;
  error_description?: string;
};

type AnalyticsReportRow = {
  dimensionValues?: Array<{ value?: string }>;
  metricValues?: Array<{ value?: string }>;
};

type AnalyticsReportResponse = {
  rows?: AnalyticsReportRow[];
  totals?: AnalyticsReportRow[];
  error?: {
    message?: string;
  };
};

export type WebsiteStatsSummary = {
  activeUsers: number;
  users30Days: number;
  sessions30Days: number;
  pageViews30Days: number;
  events30Days: number;
  topPages: Array<{
    path: string;
    views: number;
    users: number;
  }>;
  topChannels: Array<{
    channel: string;
    sessions: number;
    users: number;
  }>;
};

function base64UrlEncode(value: string | Buffer) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function getAnalyticsConfig() {
  return {
    propertyId: process.env.GA4_PROPERTY_ID?.trim() || "",
    clientEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim() || "",
    privateKey:
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n").trim() ||
      "",
  };
}

export function getMissingAnalyticsEnvVars() {
  const config = getAnalyticsConfig();
  const missing: string[] = [];

  if (!config.propertyId) missing.push("GA4_PROPERTY_ID");
  if (!config.clientEmail) missing.push("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  if (!config.privateKey) missing.push("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY");

  return missing;
}

function createJwt() {
  const config = getAnalyticsConfig();
  const issuedAt = Math.floor(Date.now() / 1000);
  const header = {
    alg: "RS256",
    typ: "JWT",
  };
  const claimSet = {
    iss: config.clientEmail,
    scope: analyticsScope,
    aud: tokenUrl,
    exp: issuedAt + 3600,
    iat: issuedAt,
  };
  const unsignedToken = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(
    JSON.stringify(claimSet),
  )}`;
  const signer = createSign("RSA-SHA256");

  signer.update(unsignedToken);
  signer.end();

  return `${unsignedToken}.${base64UrlEncode(signer.sign(config.privateKey))}`;
}

async function getAccessToken() {
  const assertion = createJwt();
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  });
  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });
  const payload = (await response.json()) as GoogleTokenResponse;

  if (!response.ok || !payload.access_token) {
    console.error(`${analyticsLogPrefix} Google token request failed.`, {
      status: response.status,
      error: payload.error,
      description: payload.error_description,
    });
    throw new Error(
      payload.error_description || "Google Analytics access token could not be created.",
    );
  }

  return payload.access_token;
}

async function runAnalyticsReport(
  accessToken: string,
  path: string,
  body: Record<string, unknown>,
) {
  const { propertyId } = getAnalyticsConfig();
  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:${path}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    },
  );
  const payload = (await response.json()) as AnalyticsReportResponse;

  if (!response.ok) {
    console.error(`${analyticsLogPrefix} GA report request failed.`, {
      status: response.status,
      path,
      error: payload.error?.message,
    });
    throw new Error(payload.error?.message || "Google Analytics report failed.");
  }

  return payload;
}

function metric(row: AnalyticsReportRow | undefined, index: number) {
  return Number(row?.metricValues?.[index]?.value || 0);
}

function dimension(row: AnalyticsReportRow, index: number, fallback: string) {
  return row.dimensionValues?.[index]?.value || fallback;
}

export async function getWebsiteStats(): Promise<WebsiteStatsSummary> {
  const missingEnvVars = getMissingAnalyticsEnvVars();

  if (missingEnvVars.length) {
    throw new Error(`Google Analytics stats are not configured. Missing: ${missingEnvVars.join(", ")}.`);
  }

  const accessToken = await getAccessToken();
  const [summary, topPages, topChannels, realtime] = await Promise.all([
    runAnalyticsReport(accessToken, "runReport", {
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
        { name: "eventCount" },
      ],
    }),
    runAnalyticsReport(accessToken, "runReport", {
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 8,
    }),
    runAnalyticsReport(accessToken, "runReport", {
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "sessionDefaultChannelGroup" }],
      metrics: [{ name: "sessions" }, { name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 8,
    }),
    runAnalyticsReport(accessToken, "runRealtimeReport", {
      metrics: [{ name: "activeUsers" }],
    }),
  ]);
  const summaryTotal = summary.totals?.[0];
  const realtimeTotal = realtime.totals?.[0];

  return {
    activeUsers: metric(realtimeTotal, 0),
    users30Days: metric(summaryTotal, 0),
    sessions30Days: metric(summaryTotal, 1),
    pageViews30Days: metric(summaryTotal, 2),
    events30Days: metric(summaryTotal, 3),
    topPages: (topPages.rows || []).map((row) => ({
      path: dimension(row, 0, "/"),
      views: metric(row, 0),
      users: metric(row, 1),
    })),
    topChannels: (topChannels.rows || []).map((row) => ({
      channel: dimension(row, 0, "Unassigned"),
      sessions: metric(row, 0),
      users: metric(row, 1),
    })),
  };
}
