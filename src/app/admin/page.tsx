import Link from "next/link";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";
import {
  isAdminAuthenticated,
  isAdminConfigured,
  safeAdminPath,
} from "@/lib/admin-auth";

type AdminPageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

const dashboardCards = [
  {
    title: "Upload Photos",
    description: "Send new project photos to the Hue Graphics Cloudinary library.",
    href: "/admin/upload",
  },
  {
    title: "Manage Gallery",
    description: "Choose, organize, and publish photos to website galleries.",
    href: "/admin/gallery",
  },
  {
    title: "Website Stats",
    description: "View useful traffic and conversion snapshots.",
    href: "/admin/stats",
  },
  {
    title: "Quote Requests",
    description: "Review incoming website quote requests in one place.",
  },
  {
    title: "Announcements",
    description: "Create and schedule website announcement banners.",
  },
  {
    title: "Pricing API Tester",
    description: "Test pricing scenarios without using the public quote flow.",
  },
];

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    const params = await searchParams;
    const requestedNext = Array.isArray(params.next) ? params.next[0] : params.next;
    const nextPath = safeAdminPath(requestedNext);

    return (
      <main className="grid min-h-screen place-items-center px-5 py-12">
        <section className="w-full max-w-md rounded-md border border-white/10 bg-[#0b1828] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.42)] sm:p-8">
          <div className="flex items-center gap-4 border-b border-white/10 pb-5">
            <div className="grid h-12 w-12 place-items-center rounded-md border border-[#2d83c9]/50 bg-[#07111f] text-lg font-black italic text-[#55aaf0]">
              Hue
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#55aaf0]">
                Private access
              </p>
              <h1 className="mt-1 text-2xl font-black">Hue Graphics Admin</h1>
            </div>
          </div>
          <p className="mt-6 text-sm font-semibold leading-6 text-[#a9bacb]">
            Enter the admin password to access website management tools.
          </p>
          <AdminLoginForm nextPath={nextPath} isConfigured={isAdminConfigured()} />
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#55aaf0]">
              Hue Graphics
            </p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Admin Hub</h1>
            <p className="mt-2 text-sm font-semibold text-[#91a6ba]">
              Private website tools and content management.
            </p>
          </div>
          <AdminLogoutButton />
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dashboardCards.map((card) => {
            const content = (
              <>
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-xl font-black">{card.title}</h2>
                  <span
                    className={[
                      "shrink-0 rounded px-2 py-1 text-[0.65rem] font-black uppercase tracking-wide",
                      card.href ? "bg-[#1e70b4] text-white" : "bg-white/8 text-[#8ea1b4]",
                    ].join(" ")}
                  >
                    {card.href ? "Available" : "Coming Soon"}
                  </span>
                </div>
                <p className="mt-4 text-sm font-semibold leading-6 text-[#9eb0c1]">
                  {card.description}
                </p>
                {card.href ? (
                  <p className="mt-6 text-xs font-black uppercase tracking-[0.14em] text-[#62b3f5]">
                    Open tool
                  </p>
                ) : null}
              </>
            );

            return card.href ? (
              <Link
                key={card.title}
                href={card.href}
                className="min-h-52 rounded-md border border-[#2f85cc]/45 bg-[#0c1b2d] p-5 transition hover:-translate-y-0.5 hover:border-[#55aaf0] hover:bg-[#10233a]"
              >
                {content}
              </Link>
            ) : (
              <article
                key={card.title}
                className="min-h-52 rounded-md border border-white/8 bg-[#0a1625] p-5 opacity-75"
              >
                {content}
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
