import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";
import { AdminPhotoUploadForm } from "@/components/AdminPhotoUploadForm";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { isCloudinaryUploadConfigured } from "@/lib/cloudinary-admin-upload";

export const dynamic = "force-dynamic";

export default async function AdminUploadPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin?next=/admin/upload");
  }

  return (
    <main className="min-h-screen px-5 py-7 sm:px-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin"
              className="inline-flex min-h-11 items-center text-xs font-black uppercase tracking-[0.14em] text-[#65b5f5] transition hover:text-white"
            >
              Back to admin
            </Link>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">
              Upload Photos
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#91a6ba]">
              Add organized project photos to Cloudinary. These uploads are not
              automatically published to the website galleries.
            </p>
          </div>
          <AdminLogoutButton />
        </header>

        <div className="mt-7">
          <AdminPhotoUploadForm
            isConfigured={isCloudinaryUploadConfigured()}
          />
        </div>
      </div>
    </main>
  );
}
