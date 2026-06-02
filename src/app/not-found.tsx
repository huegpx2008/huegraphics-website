import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#050b14] px-5 text-white">
      <div className="max-w-md text-center">
        <p className="eyebrow">Page not found</p>
        <h1 className="mt-4 text-4xl font-black uppercase tracking-tight">
          This page is not on the press.
        </h1>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-lg bg-accent px-6 py-3 text-sm font-black uppercase tracking-wide text-white"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}
