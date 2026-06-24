import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";
import { AdminWebsiteStats } from "@/components/AdminWebsiteStats";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminStatsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin?next=/admin/stats");

  return (
    <main className="min-h-screen px-5 py-7 sm:px-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/admin" className="inline-flex min-h-11 items-center text-xs font-black uppercase tracking-[0.14em] text-[#65b5f5] transition hover:text-white">Back to admin</Link>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Website Stats</h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#91a6ba]">View GA4 traffic snapshots and popular pages.</p>
          </div>
          <AdminLogoutButton />
        </header>
        <div className="mt-7">
          <AdminWebsiteStats />
        </div>
      </div>
    </main>
  );
}
