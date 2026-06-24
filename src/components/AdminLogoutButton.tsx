"use client";

import { useState } from "react";

export function AdminLogoutButton() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function logout() {
    setIsSubmitting(true);

    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      window.location.assign("/admin");
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={isSubmitting}
      className="min-h-11 rounded-md border border-white/18 px-4 text-xs font-black uppercase text-white transition hover:border-[#55aaf0] hover:text-[#8bc8fb] disabled:opacity-60"
    >
      {isSubmitting ? "Signing out..." : "Sign out"}
    </button>
  );
}
