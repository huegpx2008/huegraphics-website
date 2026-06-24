"use client";

import { useEffect, useMemo, useState } from "react";

type WebsiteStatsSummary = {
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

type StatsPayload = {
  ok?: boolean;
  configured?: boolean;
  missingEnvVars?: string[];
  stats?: WebsiteStatsSummary | null;
  error?: string;
};

const measurementId = "G-VSBH51T5P7";
const gaRealtimeUrl = "https://analytics.google.com/analytics/web/#/realtime";
const gaReportsUrl = "https://analytics.google.com/analytics/web/#/reports";

async function readStatsResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  const text = await response.text();

  if (!contentType.includes("application/json")) {
    throw new Error("Stats API returned an unexpected non-JSON response.");
  }

  return JSON.parse(text || "{}") as StatsPayload;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function AdminWebsiteStats() {
  const [stats, setStats] = useState<WebsiteStatsSummary | null>(null);
  const [missingEnvVars, setMissingEnvVars] = useState<string[]>([]);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch("/api/admin/stats", {
          cache: "no-store",
        });
        const payload = await readStatsResponse(response);

        if (response.status === 401) {
          window.location.assign("/admin?next=/admin/stats");
          return;
        }

        if (!response.ok || !payload.ok) {
          throw new Error(payload.error || "Website stats could not be loaded.");
        }

        if (isMounted) {
          setIsConfigured(Boolean(payload.configured));
          setMissingEnvVars(payload.missingEnvVars || []);
          setStats(payload.stats || null);
        }
      } catch (statsError) {
        if (isMounted) {
          setError(
            statsError instanceof Error
              ? statsError.message
              : "Website stats could not be loaded.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const statCards = useMemo(
    () => [
      ["Active now", stats?.activeUsers ?? 0],
      ["Users - 30 days", stats?.users30Days ?? 0],
      ["Sessions - 30 days", stats?.sessions30Days ?? 0],
      ["Page views - 30 days", stats?.pageViews30Days ?? 0],
      ["Events - 30 days", stats?.events30Days ?? 0],
    ],
    [stats],
  );

  return (
    <div className="grid gap-7">
      <section className="rounded-md border border-white/10 bg-[#0a1828] p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#65b5f5]">
              GA4 tracking
            </p>
            <h2 className="mt-2 text-2xl font-black">Website analytics</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#9eb0c1]">
              Measurement ID: <span className="text-white">{measurementId}</span>
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <a
              href={gaRealtimeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/15 px-4 text-xs font-black uppercase tracking-wide text-white transition hover:border-[#65b5f5]"
            >
              Open Realtime
            </a>
            <a
              href={gaReportsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#247fc9] px-4 text-xs font-black uppercase tracking-wide text-white transition hover:bg-[#3195e8]"
            >
              Open Reports
            </a>
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="grid min-h-52 place-items-center rounded-md border border-white/10 bg-[#0a1828] p-6 text-sm font-bold text-[#91a6ba]">
          Loading website stats...
        </div>
      ) : null}

      {error ? (
        <p
          role="alert"
          className="rounded-md border border-[#ef7777]/45 bg-[#3b1118] px-4 py-3 text-sm font-bold text-[#ffd4d4]"
        >
          {error}
        </p>
      ) : null}

      {!isLoading && !error && !isConfigured ? (
        <section className="rounded-md border border-[#efc76e]/45 bg-[#33260c] p-5 sm:p-6">
          <p className="text-sm font-black text-[#ffe5a6]">
            Google Analytics report access is not configured yet.
          </p>
          <p className="mt-3 text-sm font-semibold leading-6 text-[#f7d995]">
            The website tag is installed, but this admin page needs GA4 Data API
            credentials before it can show live report cards.
          </p>
          <div className="mt-4 grid gap-2">
            {missingEnvVars.map((envVar) => (
              <code
                key={envVar}
                className="rounded bg-black/20 px-3 py-2 text-xs font-bold text-white"
              >
                {envVar}
              </code>
            ))}
          </div>
        </section>
      ) : null}

      {!isLoading && stats ? (
        <>
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {statCards.map(([label, value]) => (
              <div
                key={label}
                className="rounded-md border border-white/10 bg-[#0a1828] p-5"
              >
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#65b5f5]">
                  {label}
                </p>
                <p className="mt-3 text-3xl font-black">
                  {formatNumber(Number(value))}
                </p>
              </div>
            ))}
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-md border border-white/10 bg-[#0a1828] p-5">
              <h2 className="text-lg font-black">Top Pages</h2>
              <div className="mt-4 grid gap-2">
                {stats.topPages.map((page) => (
                  <div
                    key={page.path}
                    className="grid gap-2 rounded bg-white/[0.04] p-3 text-sm sm:grid-cols-[1fr_auto]"
                  >
                    <p className="break-all font-bold text-[#d5e4f2]">{page.path}</p>
                    <p className="font-black text-white">
                      {formatNumber(page.views)} views
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-md border border-white/10 bg-[#0a1828] p-5">
              <h2 className="text-lg font-black">Traffic Channels</h2>
              <div className="mt-4 grid gap-2">
                {stats.topChannels.map((channel) => (
                  <div
                    key={channel.channel}
                    className="grid gap-2 rounded bg-white/[0.04] p-3 text-sm sm:grid-cols-[1fr_auto]"
                  >
                    <p className="font-bold text-[#d5e4f2]">{channel.channel}</p>
                    <p className="font-black text-white">
                      {formatNumber(channel.sessions)} sessions
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
