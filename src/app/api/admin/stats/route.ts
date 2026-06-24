import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  getMissingAnalyticsEnvVars,
  getWebsiteStats,
} from "@/lib/google-analytics-admin";

export const runtime = "nodejs";

const statsLogPrefix = "[admin-stats-api]";

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        {
          ok: false,
          error: "Admin access is required.",
        },
        { status: 401 },
      );
    }

    const missingEnvVars = getMissingAnalyticsEnvVars();

    if (missingEnvVars.length) {
      return NextResponse.json({
        ok: true,
        configured: false,
        missingEnvVars,
        stats: null,
      });
    }

    const stats = await getWebsiteStats();

    return NextResponse.json({
      ok: true,
      configured: true,
      missingEnvVars: [],
      stats,
    });
  } catch (error) {
    console.error(`${statsLogPrefix} Stats request failed.`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Website stats could not be loaded.",
      },
      { status: 502 },
    );
  }
}
