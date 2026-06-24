"use client";

import { useState } from "react";

export function AdminLogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function logout() {
    setIsLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.assign("/admin");
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={isLoggingOut}
      className="min-h-11 rounded-md border border-white/15 px-4 text-xs font-black uppercase tracking-wide text-white transition hover:border-[#65b5f5] disabled:opacity-60"
    >
      {isLoggingOut ? "Signing out..." : "Sign out"}
    </button>
  );
}
